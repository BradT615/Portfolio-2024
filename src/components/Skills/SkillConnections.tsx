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
  key: string;
}

interface EndPoint {
  y: number;
  index: number;
  relativePosition: number; // Store position as percentage
}

const SkillConnections = ({ activeSkills, projectRef, isEnabled }: SkillConnectionsProps) => {
  const rafRef = useRef<number>();
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const [visibleSkills, setVisibleSkills] = useState<Map<string, VisibleSkill>>(new Map());
  const previousVisibleSkills = useRef<Map<string, VisibleSkill>>(new Map());
  const isFirstRender = useRef(true);
  const uniqueKeyCounter = useRef(0);
  const endPointsMap = useRef<Map<string, EndPoint>>(new Map());
  const projectRectRef = useRef<DOMRect | null>(null);
  const lastProjectId = useRef<string | null>(null);
  const lastZoom = useRef<number>(window.devicePixelRatio);

  useEffect(() => {
    if (!isEnabled) {
      uniqueKeyCounter.current += 1;
      endPointsMap.current.clear();
    }
  }, [isEnabled]);

  const calculateEndPoints = (projectRect: DOMRect, visibleSkillElements: Array<{ skill: string, y: number }>) => {
    const height = projectRect.height;
    const offset = projectRect.top;
    const effectiveHeight = height * 0.1;
    const centerY = offset + (height / 2);
    const count = activeSkills.length;
    const spacing = effectiveHeight / (count > 1 ? count - 1 : 2);
    const startY = centerY - (spacing * (count - 1) / 2);

    // Sort skills by their vertical position
    const sortedSkills = visibleSkillElements.sort((a, b) => a.y - b.y);
    
    // For new skills, calculate their relative position within the container
    sortedSkills.forEach((skillData, index) => {
      if (!endPointsMap.current.has(skillData.skill)) {
        // Store position as a percentage of the effective height
        const relativePosition = index / (count > 1 ? count - 1 : 1);
        endPointsMap.current.set(skillData.skill, {
          y: startY + spacing * index, // Current absolute position
          index,
          relativePosition
        });
      } else {
        // Update absolute Y position while maintaining relative position
        const endpoint = endPointsMap.current.get(skillData.skill)!;
        endpoint.y = startY + spacing * (endpoint.relativePosition * (count > 1 ? count - 1 : 1));
        endpoint.index = index;
      }
    });

    return { startY, spacing };
  };

  useEffect(() => {
    if (!isEnabled) return;

    let isRunning = true;

    const updateConnections = () => {
      if (isRunning) {
        rafRef.current = requestAnimationFrame(updateConnections);
      }
      
      if (!projectRef?.current) return;

      const currentZoom = window.devicePixelRatio;
      const projectRect = projectRef.current.getBoundingClientRect();
      const projectEndX = projectRect.left;
      const currentProjectId = projectRef.current.id;
      const hasProjectChanged = currentProjectId !== lastProjectId.current;
      const hasZoomChanged = currentZoom !== lastZoom.current;

      if (hasProjectChanged) {
        lastProjectId.current = currentProjectId;
        projectRectRef.current = projectRect;
        endPointsMap.current.clear();
      }

      if (hasZoomChanged) {
        lastZoom.current = currentZoom;
        projectRectRef.current = projectRect;
      }
      
      const currentlyVisibleSkills = activeSkills
        .map(skill => {
          const element = document.querySelector(`[data-skill-anchor="${skill}"]`);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          if (rect.height === 0) return null;
          return {
            skill,
            y: rect.top + rect.height / 2
          };
        })
        .filter((item): item is { skill: string; y: number } => item !== null);

      if (currentlyVisibleSkills.length > 0) {
        calculateEndPoints(projectRect, currentlyVisibleSkills);
      }

      const newVisibleSkills = new Map<string, VisibleSkill>();
      
      currentlyVisibleSkills.forEach((skillPos) => {
        const element = document.querySelector(`[data-skill-anchor="${skillPos.skill}"]`);
        const endPoint = endPointsMap.current.get(skillPos.skill);
        
        if (element && endPoint) {
          const rect = element.getBoundingClientRect();
          const startX = rect.right;
          const startY = rect.top + rect.height / 2;
          const endY = endPoint.y;
          
          const pathD = `M ${startX} ${startY} C ${startX + (projectEndX - startX) * 0.4} ${startY}, ${startX + (projectEndX - startX) * 0.6} ${endY}, ${projectEndX} ${endY}`;
          
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