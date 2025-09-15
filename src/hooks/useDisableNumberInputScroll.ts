import { useEffect } from 'react';

/**
 * Custom hook to disable mouse wheel scrolling on number inputs globally
 * This prevents accidental value changes when scrolling over number fields
 */
export const useDisableNumberInputScroll = () => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;

      // Check if the target is a number input and is focused
      if (target.tagName === 'INPUT' &&
          (target as HTMLInputElement).type === 'number' &&
          document.activeElement === target) {
        e.preventDefault();
        // Blur the input to remove focus and prevent any value changes
        (target as HTMLInputElement).blur();
      }
    };

    // Add event listener to the document to catch all wheel events
    document.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);
};

/**
 * Event handler function that can be added directly to number input onWheel events
 * Usage: <input type="number" onWheel={disableNumberInputScroll} />
 */
export const disableNumberInputScroll = (e: React.WheelEvent<HTMLInputElement>) => {
  e.currentTarget.blur();
};