import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Youtube } from 'lucide-react';
import { projects } from '@/lib/projects';
import { Spotlight } from '@/components/core/spotlight';
import YoutubeModal from './YoutubeModal';
import ProjectIndicator from './ProjectIndicator';

interface ProjectCardProps {
  onProjectChange?: (skills: string[], projectIndex: number) => void;
  projectRef?: React.RefObject<HTMLDivElement>;
  onAnimationComplete?: () => void;
  onTopScroll?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  onProjectChange, 
  projectRef,
  onAnimationComplete,
  onTopScroll
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const prevIndex = useRef(currentIndex);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      prevIndex.current = currentIndex;
      onProjectChange?.(projects[currentIndex].skills, currentIndex);
    }
  }, [currentIndex, onProjectChange]);

  const handleScroll = useCallback((event: WheelEvent) => {
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
              initial="enter"
              animate="center"
              exit="exit"
              onAnimationComplete={onAnimationComplete}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
                opacity: {
                  duration: 0.3,
                  delay: 0.2
                }
              }}
            >
              <div className="relative aspect-[1.3] overflow-hidden rounded-xl p-[1px]">
                <Spotlight
                  className="from-neutral-100/50 via-neutral-300/50 to-neutral-100/50"
                  size={600}
                />
                <div 
                  className="relative h-full w-full rounded-xl bg-[#2f2f36] overflow-hidden"
                >
                  <div className="relative h-3/5">
                    <Image 
                      src={projects[currentIndex].imageUrl} 
                      alt={projects[currentIndex].title}
                      width={500}
                      height={300}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  </div>
                  
                  <div className="h-2/5 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-semibold">{projects[currentIndex].title}</h3>
                      <div className="flex gap-3">
                        <Link 
                          href={projects[currentIndex].repoLink} 
                          className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                          target="_blank"
                        >
                          <Github size={24} />
                        </Link>
                        {projects[currentIndex].videoUrl ? (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800"
                          >
                            <Youtube size={24} />
                          </button>
                        ) : (
                          <Link 
                            href={projects[currentIndex].liveLink} 
                            className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                            target="_blank"
                          >
                            <ExternalLink size={24} />
                          </Link>
                        )}
                      </div>
                    </div>
                    <p className="text-neutral-400 text-base mb-4 leading-relaxed overflow-y-auto flex-1">
                      {projects[currentIndex].description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {projects[currentIndex].skills.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-3 py-1.5 text-sm bg-neutral-800 rounded-full text-neutral-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
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