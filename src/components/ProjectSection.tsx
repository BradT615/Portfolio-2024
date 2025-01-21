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
  // State management
  const [activeSkills, setActiveSkills] = useState<string[]>(projects[0].skills);
  const [showConnections, setShowConnections] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const [skillsConnected, setSkillsConnected] = useState(false);
  
  // Refs
  const projectRef = useRef<HTMLDivElement>(null);
  const currentProjectRef = useRef(currentProject);
  const connectionsTimer = useRef<NodeJS.Timeout>();
  const spotlightTimer = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    currentProjectRef.current = currentProject;
  }, [currentProject]);

  useEffect(() => {
    if (connectionsTimer.current) clearTimeout(connectionsTimer.current);
    if (spotlightTimer.current) clearTimeout(spotlightTimer.current);

    setShowConnections(false);
    setSkillsConnected(false);
    setActiveSkills(projects[currentProject].skills);

    connectionsTimer.current = setTimeout(() => {
      requestAnimationFrame(() => {
        if (currentProjectRef.current === currentProject) {
          setShowConnections(true);
        }
      });
    }, 400);
    
    return () => {
      if (connectionsTimer.current) clearTimeout(connectionsTimer.current);
      if (spotlightTimer.current) clearTimeout(spotlightTimer.current);
    };
  }, [currentProject]);

  const handleProjectChange = useCallback((skills: string[], projectIndex: number) => {
    setShowConnections(false);
    setSkillsConnected(false);
    setCurrentProject(projectIndex);
    onProjectChange?.(projectIndex);
  }, [onProjectChange]);

  const handleTopScroll = useCallback(() => {
    if (currentProject === 0) {
      onTopScroll?.();
    }
  }, [currentProject, onTopScroll]);

  const handleConnectionsComplete = useCallback(() => {
    if (spotlightTimer.current) clearTimeout(spotlightTimer.current);

    spotlightTimer.current = setTimeout(() => {
      if (currentProjectRef.current === currentProject) {
        setSkillsConnected(true);
      }
    }, 1000);

    return () => {
      if (spotlightTimer.current) clearTimeout(spotlightTimer.current);
    };
  }, [currentProject]);

  return (
    <div className="relative w-full min-h-screen flex flex-col lg:flex-row">
      {/* Skills tree - Responsive layout */}
      <div className="lg:w-80 w-full lg:h-screen h-48 lg:fixed relative">
        <div className="h-full overflow-y-auto lg:pr-4 px-2 text-xs xl:text-sm">
          <SkillsTree activeSkills={activeSkills} />
        </div>
      </div>
      
      {/* Connections layer */}
      <div className="fixed inset-0 pointer-events-none">
        <SkillConnections
          activeSkills={activeSkills}
          projectRef={projectRef}
          isEnabled={showConnections}
          onConnectionsComplete={handleConnectionsComplete}
        />
      </div>
      
      {/* Project cards container with responsive layout */}
      <div className="flex-1 ml-80">
        <div className="w-full h-full max-w-4xl mx-auto px-2">
          <ProjectCard 
            onProjectChange={handleProjectChange}
            projectRef={projectRef}
            onAnimationComplete={() => {
              if (currentProjectRef.current === currentProject) {
                setShowConnections(true);
              }
            }}
            onTopScroll={handleTopScroll}
            currentIndex={currentProject}
            isSkillsConnected={skillsConnected}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;