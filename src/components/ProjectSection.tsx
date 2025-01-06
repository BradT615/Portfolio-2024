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
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ onProjectChange, projectRef }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      // First clear skills to trigger exit animations
      onProjectChange?.([]);
      
      // Wait for card exit animation before setting new skills
      const timeout = setTimeout(() => {
        onProjectChange?.(projects[currentIndex].skills);
      }, 300); // Match card exit duration

      prevIndex.current = currentIndex;
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, onProjectChange]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % projects.length);

  const getSlideStyles = (index: number) => {
    const diff = (index - currentIndex + projects.length) % projects.length;
    if (diff === 0) return 'z-20 relative';
    if (diff === 1) return 'z-10 cursor-pointer';
    if (diff === 2) return 'z-5 cursor-pointer';
    return 'z-0';
  };

  return (
    <div id="projects" className="h-full px-24 flex flex-col gap-8 justify-center">
      <div className="max-w-5xl mx-auto px-16">
        <div className="relative flex flex-col items-center justify-center pt-16">
          <AnimatePresence>
            {projects.map((project, index) => {
              const diff = (index - currentIndex + projects.length) % projects.length;
              const isActive = diff === 0;
              const isNext = diff === 1;
              const isNextPlus = diff === 2;
              
              return (
                <motion.div
                  key={project.title}
                  className={`absolute w-full ${getSlideStyles(index)}`}
                  initial={{ 
                    scale: 0.8, 
                    opacity: 0,
                    x: 200 
                  }}
                  animate={{ 
                    scale: isActive ? 1 : isNext ? 0.9 : isNextPlus ? 0.8 : 0,
                    opacity: isActive ? 1 : isNext ? 1 : isNextPlus ? 0.6 : 0,
                    x: isActive ? 0 : isNext ? 125 : isNextPlus ? 225 : 0,
                    zIndex: isActive ? 20 : isNext ? 10 : isNextPlus ? 5 : 0
                  }}
                  exit={{ 
                    scale: 0.8,
                    opacity: 0,
                    x: -200,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut"
                    }
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    opacity: { duration: 0.3 }
                  }}
                  onClick={() => {
                    if (isNext) nextSlide();
                    if (isNextPlus) {
                      nextSlide(); 
                      setTimeout(nextSlide, 100);
                    }
                  }}
                  whileHover={isActive ? {
                    scale: 1,
                    transition: { duration: 0.2 }
                  } : undefined}
                  whileTap={isActive ? {
                    scale: 0.98
                  } : undefined}
                >
                  <div className="relative aspect-[1.3] overflow-hidden rounded-xl p-[1px]">
                    <Spotlight
                      className="from-neutral-100/50 via-neutral-300/50 to-neutral-100/50"
                      size={600}
                    />
                    <div 
                      ref={isActive ? projectRef : undefined}
                      className="relative h-full w-full rounded-xl bg-[#2f2f36] overflow-hidden"
                    >
                      <div className="relative h-3/5">
                        <Image 
                          src={project.imageUrl} 
                          alt={project.title}
                          width={500}
                          height={300}
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      </div>
                      
                      <div className="h-2/5 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-semibold">{project.title}</h3>
                          <div className="flex gap-3">
                            {isActive ? (
                              <>
                                <Link 
                                  href={project.repoLink} 
                                  className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                                  target="_blank"
                                >
                                  <Github size={24} />
                                </Link>
                                {project.videoUrl ? (
                                  <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800"
                                  >
                                    <Youtube size={24} />
                                  </button>
                                ) : (
                                  <Link 
                                    href={project.liveLink} 
                                    className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                                    target="_blank"
                                  >
                                    <ExternalLink size={24} />
                                  </Link>
                                )}
                              </>
                            ) : (
                              <>
                                <span className="p-2">
                                  <Github size={24} />
                                </span>
                                <span className="p-2">
                                  {project.videoUrl ? (
                                    <Youtube size={24} />
                                  ) : (
                                    <ExternalLink size={24} />
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-neutral-400 text-base mb-4 leading-relaxed overflow-y-auto flex-1">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill, skillIndex) => (
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
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center mt-6 pb-6">
        {projects.map((_, index) => (
          <button
            key={index}
            className="relative w-6 h-6 group"
            onClick={() => setCurrentIndex(index)}
          >
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-200 group-hover:h-6 group-hover:w-6 ${
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