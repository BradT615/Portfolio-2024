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
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 701);
  const [activeSkills, setActiveSkills] = useState<string[]>(projects[0].skills);
  const [showConnections, setShowConnections] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const [skillsConnected, setSkillsConnected] = useState(false);
  
  const projectRef = useRef<HTMLDivElement>(null);
  const currentProjectRef = useRef(currentProject);
  const connectionsTimer = useRef<NodeJS.Timeout>();
  const spotlightTimer = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    }, 500);
    
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
    <div className="relative w-full flex">
      <div className={`${
        windowHeight <= 400 ? 'w-48' : 
        windowHeight <= 600 ? 'w-56 font-light' : 
        windowHeight <= 700 ? 'w-64 font-light' : 
        'w-64 lg:w-80 font-normal'
      }`}>
        <div className="h-full font-normal">
          <SkillsTree activeSkills={activeSkills} />
        </div>
      </div>
      
      <div className="fixed inset-0 pointer-events-none">
        <SkillConnections
          activeSkills={activeSkills}
          projectRef={projectRef}
          isEnabled={showConnections}
          onConnectionsComplete={handleConnectionsComplete}
        />
      </div>
      
      <div className="flex-1">
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