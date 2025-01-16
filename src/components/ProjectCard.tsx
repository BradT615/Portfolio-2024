import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Youtube } from 'lucide-react';
import { projects } from '@/lib/projects';
import YoutubeModal from './YoutubeModal';
import ProjectIndicator from './ProjectIndicator';
import ProjectSpotlight from './ProjectSpotlight';
import { TextShimmer } from './core/text-shimmer';

interface Project {
  title: string;
  repoLink: string;
  liveLink?: string;
  videoUrl?: string;
  imageUrl?: string;
  description?: string;
  skills: string[];
  isGithubCard?: boolean;
}

interface ProjectCardProps {
  onProjectChange?: (skills: string[], projectIndex: number) => void;
  projectRef?: React.RefObject<HTMLDivElement>;
  onAnimationComplete?: () => void;
  onTopScroll?: () => void;
  currentIndex?: number;
  isSkillsConnected?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  onProjectChange, 
  projectRef,
  onAnimationComplete,
  onTopScroll,
  currentIndex: initialIndex = 0,
  isSkillsConnected = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isFirstRender, setIsFirstRender] = useState(true);
  const prevIndex = useRef(currentIndex);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      prevIndex.current = currentIndex;
      onProjectChange?.(projects[currentIndex].skills, currentIndex);
    }
  }, [currentIndex, onProjectChange]);

  const handleScroll = useCallback((event: WheelEvent) => {
    if (event.ctrlKey) return;
    
    event.preventDefault();
    
    if (isScrolling) return;
    
    const isAtFirstCard = currentIndex === 0;
    
    if (event.deltaY > 0 && currentIndex < projects.length - 1) {
      setIsScrolling(true);
      setScrollDirection('down');
      setCurrentIndex(prev => prev + 1);
    } else if (event.deltaY < 0) {
      if (!isAtFirstCard) {
        setIsScrolling(true);
        setScrollDirection('up');
        setCurrentIndex(prev => prev - 1);
      } else {
        onTopScroll?.();
        return;
      }
    }

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  }, [currentIndex, isScrolling, onTopScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleScroll, { passive: false });
    return () => container.removeEventListener('wheel', handleScroll);
  }, [handleScroll]);

  const slideVariants = {
    enter: (direction: 'up' | 'down') => ({
      y: direction === 'down' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: 'up' | 'down') => ({
      y: direction === 'down' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const handleIndicatorClick = (index: number) => {
    if (!isScrolling) {
      setScrollDirection(index > currentIndex ? 'down' : 'up');
      setCurrentIndex(index);
    }
  };

  const renderCardContent = (project: Project) => {
    const cardBaseClasses = "relative aspect-[1.1] overflow-hidden rounded-xl w-[700px] border-2 border-[#222441] shadow-2xl";
    const cardInnerClasses = "relative z-10 h-full w-full rounded-xl overflow-hidden";
    const contentWrapperClasses = "h-2/5 px-6 pb-6 pt-2 flex flex-col";
    const titleWrapperClasses = "flex justify-between items-start";
    const titleClasses = "text-2xl font-semibold text-[#97a1b8]";
    const dividerClasses = "h-0.5 w-full self-center bg-[#222441] mt-2 mb-4";
    const skillsWrapperClasses = "flex flex-wrap gap-2 mt-auto";
    const skillClasses = "px-3 py-1.5 text-sm bg-neutral-800 rounded-full text-neutral-300";

    if (project.isGithubCard) {
      return (
        <div className={cardBaseClasses}>
          <div className="absolute inset-0 bg-neutral-600 backdrop-filter backdrop-blur-md bg-opacity-10"></div>
          
          <div className={cardInnerClasses}>
            <div className="relative h-3/5 p-4 flex items-center justify-center">
              <div className='border-2 border-[#222441] rounded-full p-6'>
                <Github size={150} strokeWidth={0.5} />
              </div>
            </div>
            <div className="h-full p-4 flex flex-col items-center">
              <button className='bg-[#222441] w-fit text-[#97a1b8] py-2 px-6 rounded-full hover:bg-[#1a1d2f] transition-colors'>
                <Link
                  href={project.repoLink} 
                  target="_blank"
                >
                  <TextShimmer 
                    className='font-mono text-lg' 
                    duration={2}
                    repeat={Infinity}
                    delay={3}
                    spread={4}
                  >
                    View my GitHub
                  </TextShimmer>
                </Link>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={cardBaseClasses}>
        <div className="absolute inset-0 bg-neutral-600 backdrop-filter backdrop-blur-md bg-opacity-10"></div>
        
        <div className={cardInnerClasses}>
          <div className="relative h-3/5 p-2">
            <Image 
              src={project.imageUrl!} 
              alt={project.title}
              width={500}
              height={300}
              className="w-full h-full rounded-lg object-fit border-[1px] border-[#222441]"
            />
          </div>
          
          <div className={contentWrapperClasses}>
            <div className={titleWrapperClasses}>
              <h3 className={titleClasses}>{project.title}</h3>
              <div className="flex gap-3">
                <Link 
                  href={project.repoLink} 
                  className="hover:text-[#97a1b8] transition-colors p-2" 
                  target="_blank"
                >
                  <Github size={24} />
                </Link>
                {project.videoUrl ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="hover:text-[#97a1b8] transition-colors p-2"
                  >
                    <Youtube size={24} />
                  </button>
                ) : project.liveLink && (
                  <Link 
                    href={project.liveLink} 
                    className="hover:text-[#97a1b8] transition-colors p-2" 
                    target="_blank"
                  >
                    <ExternalLink size={24} />
                  </Link>
                )}
              </div>
            </div>
            <div className={dividerClasses}></div>
            <p className="text-neutral-400 text-base mb-4 leading-relaxed overflow-y-auto flex-1">
              {project.description}
            </p>
            <div className={skillsWrapperClasses}>
              {project.skills.map((skill, skillIndex) => (
                <span 
                  key={skillIndex}
                  className={skillClasses}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      id="projects" 
      className="h-full px-24 flex gap-12 justify-center items-center"
    >
      <div className="max-w-4xl flex items-center">
        <div 
          ref={projectRef}
          className="relative"
        >
          <AnimatePresence mode="popLayout" custom={scrollDirection}>
            <motion.div
              key={projects[currentIndex].title}
              custom={scrollDirection}
              variants={slideVariants}
              initial={isFirstRender ? "center" : "enter"}
              animate="center"
              exit="exit"
              onAnimationComplete={onAnimationComplete}
              transition={{
                duration: isFirstRender ? 0 : 0.4,
                ease: "easeInOut",
                opacity: {
                  duration: isFirstRender ? 0 : 0.3,
                  delay: isFirstRender ? 0 : 0.2
                }
              }}
            >
              {renderCardContent(projects[currentIndex])}
            </motion.div>
          </AnimatePresence>

          <ProjectSpotlight
            isEnabled={isSkillsConnected}
            projectRef={projectRef!}
          />
        </div>
      </div>

      <ProjectIndicator
        totalProjects={projects.length}
        currentIndex={currentIndex}
        isScrolling={isScrolling}
        onIndicatorClick={handleIndicatorClick}
      />

      {projects[currentIndex].videoUrl && (
        <YoutubeModal
          videoUrl={projects[currentIndex].videoUrl!}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectCard;