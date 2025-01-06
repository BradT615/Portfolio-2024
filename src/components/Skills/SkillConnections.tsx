import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Connection {
  start: { x: number; y: number };
  end: { x: number; y: number };
  id: string;
}

interface SkillConnectionsProps {
  activeSkills: string[];
  projectRef: React.RefObject<HTMLElement>;
  isEnabled: boolean;
}

const SkillConnections = ({ activeSkills, projectRef, isEnabled }: SkillConnectionsProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const overlayRef = useRef<SVGSVGElement>(null);
  const isUpdatingRef = useRef(false);

  const calculateEvenlySpacedPoints = useCallback((
    totalHeight: number,
    numPoints: number,
    yOffset: number
  ): number[] => {
    if (numPoints === 0) return [];
    const effectiveHeight = totalHeight * 0.1;
    const centerY = yOffset + (totalHeight / 2);
    const spacing = effectiveHeight / (numPoints > 1 ? numPoints - 1 : 2);
    const startY = centerY - (spacing * (numPoints - 1) / 2);
    return Array.from({ length: numPoints }, (_, index) => startY + spacing * index);
  }, []);

  const updateConnections = useCallback(() => {
    if (!projectRef.current || !overlayRef.current || !isEnabled || isUpdatingRef.current) {
      return;
    }

    isUpdatingRef.current = true;

    const projectRect = projectRef.current.getBoundingClientRect();
    const connectionPoints = calculateEvenlySpacedPoints(
      projectRect.height,
      activeSkills.length,
      projectRect.top
    );

    const skillsWithPositions = activeSkills
      .map(skill => {
        const element = document.querySelector(`[data-skill-anchor="${skill}"]`);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          skill,
          element,
          rect,
          centerY: rect.top + (rect.height / 2)
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.centerY - b.centerY);

    const newConnections = skillsWithPositions
      .map((skillInfo, index) => {
        if (!skillInfo || connectionPoints[index] === undefined) return null;
        
        const start = {
          x: skillInfo.rect.right,
          y: skillInfo.rect.top + (skillInfo.rect.height / 2)
        };
        
        const end = {
          x: projectRect.left + 1,
          y: connectionPoints[index]
        };

        if (Object.values(start).some(isNaN) || Object.values(end).some(isNaN)) {
          return null;
        }

        return {
          start,
          end,
          id: `${skillInfo.skill}-${index}`,
        };
      })
      .filter((connection): connection is Connection => connection !== null);

    setConnections(newConnections);
    
    requestAnimationFrame(() => {
      isUpdatingRef.current = false;
    });
  }, [activeSkills, projectRef, calculateEvenlySpacedPoints, isEnabled]);

  // Handle skill changes
  useEffect(() => {
    if (!isEnabled) {
      setConnections([]);
      return;
    }

    const timeout = setTimeout(updateConnections, activeSkills.length ? 700 : 0);
    return () => clearTimeout(timeout);
  }, [isEnabled, activeSkills, updateConnections]);

  // Handle scroll and resize
  useEffect(() => {
    if (!isEnabled) return;

    let rafId: number;
    const handlePositionChanges = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateConnections);
    };

    window.addEventListener('scroll', handlePositionChanges, { passive: true });
    window.addEventListener('resize', handlePositionChanges);

    return () => {
      window.removeEventListener('scroll', handlePositionChanges);
      window.removeEventListener('resize', handlePositionChanges);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isEnabled, updateConnections]);

  const createPathD = useCallback((connection: Connection): string => {
    if (!connection.start || !connection.end) return '';
    
    const coordinates = [
      connection.start.x, connection.start.y,
      connection.end.x, connection.end.y
    ];
    
    if (coordinates.some(coord => coord === undefined || coord === null || isNaN(coord))) {
      return '';
    }
    
    return [
      'M', connection.start.x, connection.start.y,
      'C',
      connection.start.x + (connection.end.x - connection.start.x) * 0.4, connection.start.y,
      connection.start.x + (connection.end.x - connection.start.x) * 0.6, connection.end.y,
      connection.end.x, connection.end.y
    ].join(' ');
  }, []);

  return (
    <svg
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ 
        position: 'fixed',
        inset: '0px',
        width: '100vw',
        height: '100vh'
      }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
          <stop offset="95%" stopColor="rgba(139, 92, 246, 0.7)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
        </linearGradient>
      </defs>
      
      <AnimatePresence>
        {isEnabled && connections.map((connection) => {
          const pathD = createPathD(connection);
          if (!pathD) return null;

          return (
            <motion.path
              key={connection.id}
              d={pathD}
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              exit={{
                pathLength: [1, 0],
                pathOffset: [0, 1],
                transition: {
                  duration: 0.8,
                  ease: "easeInOut",
                  times: [0, 1],
                  delay: 0
                },
              }}
            />
          );
        })}
      </AnimatePresence>
    </svg>
  );
};

export default SkillConnections;