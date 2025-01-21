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
  
  // Keep currentProjectRef in sync with state
  useEffect(() => {
    currentProjectRef.current = currentProject;
  }, [currentProject]);

  // Handle project changes
  useEffect(() => {
    // Clear any existing timers
    if (connectionsTimer.current) {
      clearTimeout(connectionsTimer.current);
    }
    if (spotlightTimer.current) {
      clearTimeout(spotlightTimer.current);
    }

    // Reset states
    setShowConnections(false);
    setSkillsConnected(false);
    setActiveSkills(projects[currentProject].skills);

    // Set up new connections timer
    connectionsTimer.current = setTimeout(() => {
      requestAnimationFrame(() => {
        if (currentProjectRef.current === currentProject) {
          setShowConnections(true);
        }
      });
    }, 400);
    
    // Cleanup function
    return () => {
      if (connectionsTimer.current) {
        clearTimeout(connectionsTimer.current);
      }
      if (spotlightTimer.current) {
        clearTimeout(spotlightTimer.current);
      }
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
    // Clear any existing spotlight timer
    if (spotlightTimer.current) {
      clearTimeout(spotlightTimer.current);
    }

    // Set up new spotlight timer
    spotlightTimer.current = setTimeout(() => {
      // Only trigger spotlight if project hasn't changed
      if (currentProjectRef.current === currentProject) {
        setSkillsConnected(true);
      }
    }, 1000);

    // Cleanup function
    return () => {
      if (spotlightTimer.current) {
        clearTimeout(spotlightTimer.current);
      }
    };
  }, [currentProject]);

  return (
    <div className="relative w-full">
      {/* Skills tree container with fixed position and scrollable content */}
      <div className="fixed w-80 h-screen">
        <div className="h-full overflow-y-auto pr-4 text-xs xl:text-sm">
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
      
      {/* Centered project cards */}
      <div className="w-full h-full max-w-4xl xl:max-w-5xl max-[1800px]:ml-auto min-[1800px]:mx-auto px-4 border-2">
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
  );
};

export default ProjectSection;