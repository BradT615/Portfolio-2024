import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillConnectionsProps {
  activeSkills: string[];
  projectRef: React.RefObject<HTMLElement>;
  isEnabled: boolean;
}

interface VisibleSkill {
  path: string;
  isVisible: boolean;
  key: string; // Add a unique key for each animation instance
}

const SkillConnections = ({ activeSkills, projectRef, isEnabled }: SkillConnectionsProps) => {
  const rafRef = useRef<number>();
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const [visibleSkills, setVisibleSkills] = useState<Map<string, VisibleSkill>>(new Map());
  const previousVisibleSkills = useRef<Map<string, VisibleSkill>>(new Map());
  const isFirstRender = useRef(true);
  const uniqueKeyCounter = useRef(0);

  useEffect(() => {
    // Increment the counter whenever isEnabled changes from true to false
    if (!isEnabled) {
      uniqueKeyCounter.current += 1;
    }
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

    let isRunning = true;

    const updateConnections = () => {
      if (isRunning) {
        rafRef.current = requestAnimationFrame(updateConnections);
      }
      
      if (!projectRef?.current) return;

      const projectRect = projectRef.current.getBoundingClientRect();
      const projectEndX = projectRect.left;
      
      const currentlyVisibleSkills = activeSkills.filter(skill => {
        const element = document.querySelector(`[data-skill-anchor="${skill}"]`);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.height > 0;
      });

      const endPoints = calculateEndPoints(
        projectRect.height, 
        currentlyVisibleSkills.length, 
        projectRect.top
      );

      const skillPositions = currentlyVisibleSkills
        .map(skill => {
          const element = document.querySelector(`[data-skill-anchor="${skill}"]`);
          const rect = element?.getBoundingClientRect();
          return {
            skill,
            y: rect ? rect.top + rect.height / 2 : 0
          };
        })
        .sort((a, b) => a.y - b.y);

      const newVisibleSkills = new Map<string, VisibleSkill>();
      
      skillPositions.forEach((skillPos, index) => {
        const element = document.querySelector(`[data-skill-anchor="${skillPos.skill}"]`);
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const startX = rect.right;
          const startY = rect.top + rect.height / 2;
          const endY = endPoints[index];
          
          const pathD = `M ${startX} ${startY} C ${startX + (projectEndX - startX) * 0.4} ${startY}, ${startX + (projectEndX - startX) * 0.6} ${endY}, ${projectEndX} ${endY}`;
          
          // Create a unique key that includes both the skill name and the current animation cycle
          const uniqueKey = `${skillPos.skill}-${uniqueKeyCounter.current}`;
          
          newVisibleSkills.set(skillPos.skill, {
            path: pathD,
            isVisible: true,
            key: uniqueKey
          });
        }
      });

      if (!isFirstRender.current) {
        previousVisibleSkills.current = visibleSkills;
        setVisibleSkills(newVisibleSkills);
      } else {
        isFirstRender.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(updateConnections);

    return () => {
      isRunning = false;
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

  const visibleSkillsArray = Array.from(visibleSkills.entries()).map(([skill, state]) => ({
    id: skill,
    ...state
  }));

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
        {isEnabled && visibleSkillsArray.map(({ id, path, key }) => (
          <motion.path
            key={key}
            ref={(el) => {
              if (el) pathRefs.current.set(id, el);
              else pathRefs.current.delete(id);
            }}
            d={path}
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
                duration: 0.4,
                ease: "easeInOut"
              }
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2
            }}
          />
        ))}
      </AnimatePresence>
    </svg>
  );
};

export default SkillConnections;