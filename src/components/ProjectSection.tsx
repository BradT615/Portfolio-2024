import { useState, useRef, useCallback } from 'react';
import { SkillsTree } from './Skills/SkillsTree';
import ProjectCard from './ProjectCard';
import SkillConnections from './Skills/SkillConnections';
import { projects } from '@/lib/projects';

interface ProjectSectionProps {
  onTopScroll?: () => void;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ onTopScroll }) => {
  const [activeSkills, setActiveSkills] = useState<string[]>(projects[0].skills);
  const [showConnections, setShowConnections] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);

  const handleProjectChange = useCallback((skills: string[]) => {
    setShowConnections(false);
    
    // Wait for the next frame to ensure DOM updates have happened
    requestAnimationFrame(() => {
      setActiveSkills(skills);
      // Give the ProjectCard time to reposition
      requestAnimationFrame(() => {
        setShowConnections(true);
      });
    });
  }, []);

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
          onTopScroll={onTopScroll}
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