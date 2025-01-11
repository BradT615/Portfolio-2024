import { useState, useRef, useCallback, useEffect } from 'react';
import { SkillsTree } from './Skills/SkillsTree';
import ProjectCard from './ProjectCard';
import SkillConnections from './Skills/SkillConnections';
import { projects } from '@/lib/projects';

interface ProjectSectionProps {
  onTopScroll?: () => void;
  onProjectChange?: (index: number) => void;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ onTopScroll, onProjectChange }) => {
  const [activeSkills, setActiveSkills] = useState<string[]>(projects[0].skills);
  const [showConnections, setShowConnections] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const projectRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setShowConnections(false);
    setActiveSkills(projects[currentProject].skills);
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        setShowConnections(true);
      });
    }, 400);
    
    return () => clearTimeout(timer);
  }, [currentProject]);

  const handleProjectChange = useCallback((skills: string[], projectIndex: number) => {
    setShowConnections(false);
    setCurrentProject(projectIndex);
    onProjectChange?.(projectIndex); // Call the parent's onProjectChange
  }, [onProjectChange]);

  // Create a handler for top scroll that only triggers when on first project
  const handleTopScroll = useCallback(() => {
    if (currentProject === 0) {
      onTopScroll?.();
    }
  }, [currentProject, onTopScroll]);

  return (
    <>
      <div className="w-80 shrink-0" data-scroll-container>
        <SkillsTree activeSkills={activeSkills} />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ProjectCard 
          onProjectChange={handleProjectChange}
          projectRef={projectRef}
          onAnimationComplete={() => setShowConnections(true)}
          onTopScroll={handleTopScroll}
          currentIndex={currentProject}
        />
      </div>
      
      <SkillConnections 
        activeSkills={activeSkills}
        projectRef={projectRef}
        isEnabled={showConnections}
      />
    </>
  );
};

export default ProjectSection;