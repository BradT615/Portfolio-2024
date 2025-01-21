'use client';

import { useEffect } from 'react';

export default function ViewTracker() {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Check if this view has already been tracked in this session
        const hasTracked = localStorage.getItem('viewTracked');
        if (hasTracked) return;

        await fetch('/api/track-view', {
          method: 'POST',
        });
        
        // Mark this session as tracked
        localStorage.setItem('viewTracked', 'true');
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackPageView();
  }, []);

  return null;
}