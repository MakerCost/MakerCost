import { useEffect, useRef, useCallback } from 'react';
import { usePricingStore } from '@/store/pricing-store';
import { useQuoteStore } from '@/store/quote-store';
import { useAuth } from '@/hooks/useAuth';

interface AutoSaveOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  minimalContent?: boolean;
}

const DEFAULT_OPTIONS: AutoSaveOptions = {
  enabled: true,
  interval: 30000, // 30 seconds
  minimalContent: true,
};

export const useAutoSave = (options: AutoSaveOptions = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { user } = useAuth();
  const { currentProject } = usePricingStore();
  const { 
    currentQuote, 
    findOrCreateDraftQuote, 
    updateQuoteFromProject,
    saveQuoteToDatabase 
  } = useQuoteStore();
  
  const lastSaveRef = useRef<number>(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastProjectStateRef = useRef<string>('');

  // Check if project has meaningful content worth auto-saving
  const hasMinimalContent = useCallback(() => {
    if (!config.minimalContent) return true;
    
    return !!(
      currentProject.projectName?.trim() ||
      currentProject.clientName?.trim() ||
      currentProject.materials.length > 0 ||
      currentProject.costParameters.machines.length > 0 ||
      currentProject.costParameters.labor.hours > 0 ||
      currentProject.salePrice.amount > 0
    );
  }, [currentProject, config.minimalContent]);

  // Generate a hash of the current project state for comparison
  const getProjectStateHash = useCallback(() => {
    return JSON.stringify({
      projectName: currentProject.projectName,
      clientName: currentProject.clientName,
      materials: currentProject.materials,
      machines: currentProject.costParameters.machines,
      labor: currentProject.costParameters.labor,
      salePrice: currentProject.salePrice,
      vatSettings: currentProject.vatSettings,
    });
  }, [currentProject]);

  // Perform the auto-save operation
  const performAutoSave = useCallback(async () => {
    if (!config.enabled || !hasMinimalContent()) return;

    try {
      const projectName = currentProject.projectName || 'Untitled Project';
      const clientName = currentProject.clientName || 'Client';

      // Find existing draft or create new one
      const targetQuote = findOrCreateDraftQuote(
        projectName,
        clientName,
        currentProject.currency
      );

      // Update quote with current project data
      updateQuoteFromProject(targetQuote.id, currentProject);
        
      // Save to database if user is authenticated
      if (user) {
        try {
          await saveQuoteToDatabase(targetQuote.id);
        } catch (error) {
          // Silently handle auth errors - quote is still saved locally
          console.log('Auto-save to cloud failed, saved locally only');
        }
      }
      
      lastSaveRef.current = Date.now();
      console.log('Auto-saved draft quote:', targetQuote.quoteNumber);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [
    config.enabled,
    hasMinimalContent,
    currentProject,
    findOrCreateDraftQuote,
    updateQuoteFromProject,
    saveQuoteToDatabase,
    user,
  ]);

  // Debounced save function
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, config.interval);
  }, [performAutoSave, config.interval]);

  // Monitor project changes
  useEffect(() => {
    if (!config.enabled) return;

    const currentStateHash = getProjectStateHash();
    
    // Only trigger save if state actually changed
    if (currentStateHash !== lastProjectStateRef.current) {
      lastProjectStateRef.current = currentStateHash;
      
      // Only auto-save if enough time has passed since last save
      const timeSinceLastSave = Date.now() - lastSaveRef.current;
      if (timeSinceLastSave >= config.interval!) {
        debouncedSave();
      }
    }
  }, [currentProject, config.enabled, config.interval, getProjectStateHash, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await performAutoSave();
  }, [performAutoSave]);

  return {
    saveNow,
    lastSaveTime: lastSaveRef.current,
    hasMinimalContent: hasMinimalContent(),
  };
};