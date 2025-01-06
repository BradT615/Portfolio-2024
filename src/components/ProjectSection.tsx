import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Youtube } from 'lucide-react';
import { projects } from '@/lib/projects';
import { Spotlight } from '@/components/core/spotlight';
import YoutubeModal from './YoutubeModal';

interface ProjectSectionProps {
  onProjectChange?: (skills: string[]) => void;
  projectRef?: React.RefObject<HTMLDivElement>;
  isTransitioningFromHero?: boolean;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ 
  onProjectChange, 
  projectRef,
  isTransitioningFromHero = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const prevIndex = useRef(currentIndex);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    window.projectCarouselIndex = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      onProjectChange?.([]);
      const timeout = setTimeout(() => {
        onProjectChange?.(projects[currentIndex].skills);
      }, 300);
      prevIndex.current = currentIndex;
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, onProjectChange]);

  const handleScroll = (event: WheelEvent) => {
    if (isScrolling) return;
    
    if (event.deltaY > 0 && currentIndex < projects.length - 1) {
      setIsScrolling(true);
      setScrollDirection('down');
      setCurrentIndex(prev => prev + 1);
    } else if (event.deltaY < 0) {
      setIsScrolling(true);
      setScrollDirection('up');
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [isScrolling]);

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

  return (
    <div id="projects" className="h-full px-24 flex gap-12 justify-center items-center">
      <div className="max-w-5xl h-[600px] flex items-center">
        <div className="relative">
          <AnimatePresence mode="popLayout" custom={scrollDirection}>
            <motion.div
              key={projects[currentIndex].title}
              custom={scrollDirection}
              variants={!isTransitioningFromHero ? slideVariants : {}}
              initial={isTransitioningFromHero ? false : "enter"}
              animate="center"
              exit={isTransitioningFromHero ? undefined : "exit"}
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
                  ref={projectRef}
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

      <div className="flex flex-col justify-center gap-2 pr-8">
        {projects.map((_, index) => (
          <button
            key={index}
            className="relative h-6 w-6 group"
            onClick={() => !isScrolling && !isTransitioningFromHero && setCurrentIndex(index)}
          >
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full transition-all duration-200 group-hover:h-6 group-hover:w-6 ${
              index === currentIndex ? 'bg-blue-400' : 'bg-neutral-600 group-hover:bg-neutral-500'
            }`}/>
          </button>
        ))}
      </div>

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

export default ProjectSection;