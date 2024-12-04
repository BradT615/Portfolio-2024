"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { projects } from '@/lib/projects';

interface ProjectSectionProps {
  onProjectChange?: (skills: string[]) => void;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ onProjectChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log('Project changed to:', projects[currentIndex].title);
    console.log('Skills:', projects[currentIndex].skills);
    onProjectChange?.(projects[currentIndex].skills);
  }, [currentIndex, onProjectChange]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % projects.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

  const getSlideStyles = (index: number) => {
    const diff = (index - currentIndex + projects.length) % projects.length;
    if (diff === 0) return 'z-20 relative'; // Current slide
    if (diff === 1 || diff === projects.length - 1) return 'z-10 cursor-pointer'; // Adjacent slides
    return 'z-0'; // Other slides
  };

  return (
    <div id="projects" className="h-full relative">
      <div className="flex flex-col h-full w-full items-center justify-center mx-auto">
        <h1 className="text-3xl text-neutral-400 self-start font-light tracking-wide ml-12 mb-12">Projects</h1>
        
        <div className="relative w-full max-w-5xl h-[600px] px-16">
          <div className="relative h-full flex items-center justify-center">
            <AnimatePresence initial={false}>
              {projects.map((project, index) => {
                const diff = (index - currentIndex + projects.length) % projects.length;
                const isActive = diff === 0;
                const isAdjacent = diff === 1 || diff === projects.length - 1;
                const isNext = diff === 1;
                const isPrev = diff === projects.length - 1;
                
                return (
                  <motion.div
                    key={project.title}
                    className={`absolute w-full max-w-4xl ${getSlideStyles(index)}`}
                    initial={{ 
                      scale: 0.8, 
                      opacity: 0,
                      x: index > currentIndex ? 200 : -200 
                    }}
                    animate={{ 
                      scale: isActive ? 1 : 0.8,
                      opacity: isActive ? 1 : isAdjacent ? 0.5 : 0,
                      x: isActive ? 0 : (diff === 1 ? 200 : diff === projects.length - 1 ? -200 : 0),
                      zIndex: isActive ? 20 : 10
                    }}
                    exit={{ 
                      scale: 0.8,
                      opacity: 0,
                      x: index < currentIndex ? -200 : 200 
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                    onClick={() => {
                      if (isNext) nextSlide();
                      if (isPrev) prevSlide();
                    }}
                    whileHover={isAdjacent ? { 
                      scale: 0.85,
                      opacity: 0.7,
                      transition: { duration: 0.2 }
                    } : undefined}
                  >
                    <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all">
                      <div className="h-[400px] overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-2xl font-semibold">{project.title}</h3>
                          <div className="flex gap-3">
                            <Link 
                              href={project.repoLink} 
                              className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                              target="_blank"
                            >
                              <Github size={24} />
                            </Link>
                            <Link 
                              href={project.liveLink} 
                              className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                              target="_blank"
                            >
                              <ExternalLink size={24} />
                            </Link>
                          </div>
                        </div>
                        <p className="text-neutral-400 text-lg mb-8 leading-relaxed max-h-48 overflow-y-auto">
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
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-neutral-300' : 'bg-neutral-700'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;