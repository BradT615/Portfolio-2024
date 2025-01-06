import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillConnectionsProps {
  activeSkills: string[];
  projectRef: React.RefObject<HTMLElement>;
  isEnabled: boolean;
}

const SkillConnections = ({ activeSkills, projectRef, isEnabled }: SkillConnectionsProps) => {
  const rafRef = useRef<number>();
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());

  useEffect(() => {
    if (!isEnabled) return;

    const updateConnections = () => {
      if (!projectRef.current) return;

      const projectRect = projectRef.current.getBoundingClientRect();
      const projectEndX = projectRect.left;
      const endPoints = calculateEndPoints(projectRect.height, activeSkills.length, projectRect.top);

      const skillPositions = activeSkills.map(skill => {
        const element = document.querySelector(`[data-skill-anchor="${skill}"]`);
        const rect = element?.getBoundingClientRect();
        return {
          skill,
          y: rect ? rect.top + rect.height / 2 : 0
        };
      }).sort((a, b) => a.y - b.y);

      skillPositions.forEach((skillPos, index) => {
        const element = document.querySelector(`[data-skill-anchor="${skillPos.skill}"]`);
        const path = pathRefs.current.get(skillPos.skill);
        
        if (element && path) {
          const rect = element.getBoundingClientRect();
          const startX = rect.right;
          const startY = rect.top + rect.height / 2;
          const endY = endPoints[index];

          const pathD = `M ${startX} ${startY} C ${startX + (projectEndX - startX) * 0.4} ${startY}, ${startX + (projectEndX - startX) * 0.6} ${endY}, ${projectEndX} ${endY}`;
          
          path.setAttribute('d', pathD);
        }
      });

      rafRef.current = requestAnimationFrame(updateConnections);
    };

    rafRef.current = requestAnimationFrame(updateConnections);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isEnabled, activeSkills, projectRef]);

  const calculateEndPoints = (height: number, count: number, offset: number): number[] => {
    if (count === 0) return [];
    const effectiveHeight = height * 0.1;
    const centerY = offset + (height / 2);
    const spacing = effectiveHeight / (count > 1 ? count - 1 : 2);
    const startY = centerY - (spacing * (count - 1) / 2);
    return Array.from({ length: count }, (_, i) => startY + spacing * i);
  };

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
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
          <stop offset="95%" stopColor="rgba(139, 92, 246, 0.7)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.5)" />
        </linearGradient>
      </defs>
      
      <AnimatePresence mode="sync">
        {isEnabled && activeSkills.map((skill, index) => (
          <motion.path
            key={`${skill}-${activeSkills.join(',')}`}
            ref={(el) => {
              if (el) pathRefs.current.set(skill, el);
              else pathRefs.current.delete(skill);
            }}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ 
              pathLength: 1,
              pathOffset: 0 
            }}
            exit={{ 
              pathLength: 0,
              pathOffset: 1,
              transition: { 
                duration: 0.8,
                ease: "easeInOut"
              }
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
              delay: 0.5
            }}
          />
        ))}
      </AnimatePresence>
    </svg>
  );
};

export default SkillConnections;