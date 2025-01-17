import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectSpotlightProps {
  isEnabled: boolean;
  projectRef: React.RefObject<HTMLDivElement>;
}

const ProjectSpotlight: React.FC<ProjectSpotlightProps> = ({
  isEnabled,
  projectRef,
}) => {
  console.log("eggs");
  const [paths, setPaths] = useState<{ top: string; bottom: string }>({
    top: '',
    bottom: '',
  });
  const [pathLengths, setPathLengths] = useState<{
    top: number;
    bottom: number;
  }>({ top: 0, bottom: 0 });
  const [isReady, setIsReady] = useState(false);
  const rafRef = useRef<number>();
  console.log(rafRef);
  const topPathRef = useRef<SVGPathElement>(null);
  const bottomPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!isEnabled) {
      setIsReady(false);
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

      const borderRadius = 12;

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

  useEffect(() => {
    // Only measure paths if we have valid paths and refs
    if (paths.top && paths.bottom && topPathRef.current && bottomPathRef.current) {
      const topLength = topPathRef.current.getTotalLength();
      const bottomLength = bottomPathRef.current.getTotalLength();
      
      if (topLength > 0 && bottomLength > 0) {
        setPathLengths({
          top: topLength,
          bottom: bottomLength,
        });
        setIsReady(true);
      }
    }
  }, [paths]);

  // Create paths immediately but hidden
  return (
    <svg
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{
        position: 'fixed',
        inset: '0px',
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Hidden measurement paths */}
      {paths.top && !isReady && (
        <path
          ref={topPathRef}
          d={paths.top}
          style={{ visibility: 'hidden' }}
        />
      )}
      {paths.bottom && !isReady && (
        <path
          ref={bottomPathRef}
          d={paths.bottom}
          style={{ visibility: 'hidden' }}
        />
      )}
      
      <AnimatePresence mode="sync">
        {isEnabled && isReady && (
          <>
            <motion.path
              
              d={paths.top}
              stroke="rgba(41, 196, 222, 1)"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`150 ${pathLengths.top}`}
              initial={{
                strokeDashoffset: pathLengths.top + 150,
                opacity: 0.5,
              }}
              animate={{
                strokeDashoffset: 0,
                opacity: [0, 1, 0],
                transition: {
                  strokeDashoffset: {
                    duration: 1,
                    ease: 'linear',
                  },
                  opacity: {
                    duration: 1,
                    times: [0, 0.1, 1],
                  },
                },
              }}
              exit={{ opacity: 0 }}
            />
            <motion.path
              
              d={paths.bottom}
              stroke="rgba(41, 196, 222, 1)"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`150 ${pathLengths.bottom}`}
              initial={{
                strokeDashoffset: pathLengths.bottom + 150,
                opacity: 0.5,
              }}
              animate={{
                strokeDashoffset: 0,
                opacity: [0, 1, 0],
                transition: {
                  strokeDashoffset: {
                    duration: 1,
                    ease: 'linear',
                  },
                  opacity: {
                    duration: 1,
                    times: [0, 0.1, 1],
                  },
                },
              }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>
    </svg>
  );
};

export default ProjectSpotlight;