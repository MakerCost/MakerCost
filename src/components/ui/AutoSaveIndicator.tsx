import { useEffect, useState } from 'react';

interface AutoSaveIndicatorProps {
  lastSaveTime: number;
  hasMinimalContent: boolean;
  className?: string;
}

export default function AutoSaveIndicator({ 
  lastSaveTime, 
  hasMinimalContent, 
  className = '' 
}: AutoSaveIndicatorProps) {
  const [displayText, setDisplayText] = useState<string>('');
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (!hasMinimalContent) {
      setDisplayText('');
      setShowIndicator(false);
      return;
    }

    if (lastSaveTime === 0) {
      setDisplayText('');
      setShowIndicator(false);
      return;
    }

    // Show "Draft saved" immediately after save
    setDisplayText('Draft saved');
    setShowIndicator(true);

    // After 3 seconds, show relative time
    const timer = setTimeout(() => {
      const now = Date.now();
      const secondsAgo = Math.floor((now - lastSaveTime) / 1000);
      
      if (secondsAgo < 60) {
        setDisplayText(`Saved ${secondsAgo}s ago`);
      } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        setDisplayText(`Saved ${minutesAgo}m ago`);
      } else {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        setDisplayText(`Saved ${hoursAgo}h ago`);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [lastSaveTime, hasMinimalContent]);

  // Update relative time every 30 seconds
  useEffect(() => {
    if (!showIndicator || lastSaveTime === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const secondsAgo = Math.floor((now - lastSaveTime) / 1000);
      
      if (secondsAgo < 60) {
        setDisplayText(`Saved ${secondsAgo}s ago`);
      } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        setDisplayText(`Saved ${minutesAgo}m ago`);
      } else {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        setDisplayText(`Saved ${hoursAgo}h ago`);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [showIndicator, lastSaveTime]);

  if (!showIndicator || !displayText) {
    return null;
  }

  return (
    <div className={`flex items-center text-sm text-gray-500 ${className}`}>
      <svg 
        className="w-4 h-4 mr-1 text-green-500" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
          clipRule="evenodd" 
        />
      </svg>
      {displayText}
    </div>
  );
}