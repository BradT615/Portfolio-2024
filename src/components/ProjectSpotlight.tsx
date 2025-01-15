import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectSpotlightProps {
  isEnabled: boolean;
  projectRef: React.RefObject<HTMLDivElement>;
}

const ProjectSpotlight: React.FC<ProjectSpotlightProps> = ({
  isEnabled,
  projectRef
}) => {
  const [paths, setPaths] = useState<{ top: string; bottom: string }>({ top: '', bottom: '' });
  const rafRef = useRef<number>();
  const uniqueKeyRef = useRef(0);

  useEffect(() => {
    if (!isEnabled) {
      uniqueKeyRef.current += 1;
      return;
    }

    let isRunning = true;

    const updatePaths = () => {
      if (!isRunning || !projectRef.current) return;
      
      rafRef.current = requestAnimationFrame(updatePaths);
      
      const rect = projectRef.current.getBoundingClientRect();
      const startX = rect.left;
      const endX = rect.right;
      const midY = rect.top + rect.height / 2;
      const topY = rect.top;
      const bottomY = rect.bottom;
      
      // Create curved paths that start from the middle left, go around the corners, and meet in the middle right
      const borderRadius = 12;
      
      // Create paths that exactly follow the card border
      const topPath = `M ${startX} ${midY} 
        L ${startX} ${topY + borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${startX + borderRadius} ${topY}
        L ${endX - borderRadius} ${topY}
        A ${borderRadius} ${borderRadius} 0 0 1 ${endX} ${topY + borderRadius}
        L ${endX} ${midY}`;
      
      const bottomPath = `M ${startX} ${midY}
        L ${startX} ${bottomY - borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 0 ${startX + borderRadius} ${bottomY}
        L ${endX - borderRadius} ${bottomY}
        A ${borderRadius} ${borderRadius} 0 0 0 ${endX} ${bottomY - borderRadius}
        L ${endX} ${midY}`;
      
      setPaths({ top: topPath, bottom: bottomPath });
    };

    rafRef.current = requestAnimationFrame(updatePaths);

    return () => {
      isRunning = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isEnabled, projectRef]);

  return (
    <svg
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ 
        position: 'fixed',
        inset: '0px',
        width: '100vw',
        height: '100vh'
      }}
    >
      <defs>
        <linearGradient id="spotlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.7)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.7)" />
        </linearGradient>
      </defs>
      
      <AnimatePresence mode="sync">
        {isEnabled && (
          <>
            <motion.path
              key={`top-${uniqueKeyRef.current}`}
              d={paths.top}
              stroke="url(#spotlightGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ 
                duration: 1,
                ease: "easeInOut",
                delay: 0.19
              }}
            />
            <motion.path
              key={`bottom-${uniqueKeyRef.current}`}
              d={paths.bottom}
              stroke="url(#spotlightGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ 
                duration: 1,
                ease: "easeInOut",
                delay: 0.19
              }}
            />
          </>
        )}
      </AnimatePresence>
    </svg>
  );
};

export default ProjectSpotlight;