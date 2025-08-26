'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackUserExperience, trackUIInteraction, trackFormBehavior, trackNavigationPattern } from '@/lib/posthog-product-analytics';

interface PageEngagementProps {
  children: React.ReactNode;
}

export default function PageEngagement({ children }: PageEngagementProps) {
  const pathname = usePathname();
  const startTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const engagementEvents = useRef<string[]>([]);
  const hasTrackedLoad = useRef(false);

  useEffect(() => {
    const trackPageLoad = () => {
      if (hasTrackedLoad.current) return;
      
      const loadTime = Date.now() - startTime.current;
      trackUserExperience.pageLoad(pathname, loadTime);
      hasTrackedLoad.current = true;
    };

    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
      
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = Math.min(scrollPercent, 100);
        
        // Track milestone scroll depths
        const milestones = [25, 50, 75, 90];
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !engagementEvents.current.includes(`scroll_${milestone}`)) {
            engagementEvents.current.push(`scroll_${milestone}`);
            
            trackUserExperience.scrollDepth(
              pathname, 
              milestone, 
              Date.now() - startTime.current
            );
          }
        });
      }
    };

    const trackMouseMovement = () => {
      if (!engagementEvents.current.includes('mouse_active')) {
        engagementEvents.current.push('mouse_active');
      }
    };

    const trackKeyboardActivity = () => {
      if (!engagementEvents.current.includes('keyboard_active')) {
        engagementEvents.current.push('keyboard_active');
      }
    };

    const trackClicks = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track specific UI interactions
      if (target.tagName === 'BUTTON') {
        trackUIInteraction({
          element_type: 'button',
          element_id: target.id || undefined,
          element_text: target.textContent?.slice(0, 50) || undefined,
          interaction_type: 'click',
          page_section: getPageSection(target),
        });
      }
      
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        trackNavigationPattern({
          from_page: pathname,
          to_page: href || 'unknown',
          navigation_type: 'link_click',
          time_on_page_ms: Date.now() - startTime.current,
          scroll_depth_percent: maxScrollDepth.current,
        });
      }
    };

    const trackFormInteractions = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
        const form = target.closest('form');
        const formName = form?.getAttribute('data-form-name') || 
                         form?.className.includes('material') ? 'material_form' :
                         form?.className.includes('signup') ? 'signup_form' :
                         'unknown_form';

        trackFormBehavior({
          form_name: formName,
          action: event.type === 'focus' ? 'field_focus' : 'field_complete',
          field_name: target.getAttribute('name') || target.getAttribute('id') || 'unnamed_field',
        });
      }
    };

    // Set up event listeners
    window.addEventListener('load', trackPageLoad);
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    window.addEventListener('mousemove', trackMouseMovement, { passive: true });
    window.addEventListener('keydown', trackKeyboardActivity, { passive: true });
    document.addEventListener('click', trackClicks, { passive: true });
    document.addEventListener('focus', trackFormInteractions, { passive: true, capture: true });
    document.addEventListener('blur', trackFormInteractions, { passive: true, capture: true });

    // Track initial page load if already loaded
    if (document.readyState === 'complete') {
      trackPageLoad();
    }

    // Cleanup function
    return () => {
      // Track final scroll depth and time on page
      trackUserExperience.scrollDepth(
        pathname,
        maxScrollDepth.current,
        Date.now() - startTime.current
      );

      window.removeEventListener('load', trackPageLoad);
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('mousemove', trackMouseMovement);
      window.removeEventListener('keydown', trackKeyboardActivity);
      document.removeEventListener('click', trackClicks);
      document.removeEventListener('focus', trackFormInteractions);
      document.removeEventListener('blur', trackFormInteractions);
    };
  }, [pathname]);

  // Reset tracking when pathname changes
  useEffect(() => {
    startTime.current = Date.now();
    maxScrollDepth.current = 0;
    engagementEvents.current = [];
    hasTrackedLoad.current = false;
  }, [pathname]);

  return <>{children}</>;
}

// Helper function to determine page section
function getPageSection(element: HTMLElement): string {
  // Look for common section identifiers
  const section = element.closest('[data-section]')?.getAttribute('data-section');
  if (section) return section;

  const classList = element.classList;
  if (classList.contains('header') || element.closest('header')) return 'header';
  if (classList.contains('footer') || element.closest('footer')) return 'footer';
  if (classList.contains('sidebar') || element.closest('aside')) return 'sidebar';
  if (classList.contains('modal') || element.closest('[role="dialog"]')) return 'modal';
  if (classList.contains('nav') || element.closest('nav')) return 'navigation';
  
  // Calculator-specific sections
  if (classList.contains('materials') || element.closest('[class*="material"]')) return 'materials';
  if (classList.contains('costs') || element.closest('[class*="cost"]')) return 'cost_parameters';
  if (classList.contains('results') || element.closest('[class*="result"]')) return 'results';
  if (classList.contains('quote') || element.closest('[class*="quote"]')) return 'quote';

  return 'main_content';
}