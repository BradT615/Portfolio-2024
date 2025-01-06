'use client'
import { useState, useEffect, useRef } from 'react';
import { SkillsTree } from '@/components/Skills/SkillsTree';
import ProjectSection from '@/components/ProjectSection';
import SkillConnections from '@/components/Skills/SkillConnections';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';
import { ImagePreloader } from '@/components/ImagePreloader';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/projects';

declare global {
  interface Window {
    projectCarouselIndex: number;
  }
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'hero' | 'projects'>('hero');
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
  const [isProjectAnimationComplete, setIsProjectAnimationComplete] = useState(false);
  const [isTransitioningFromHero, setIsTransitioningFromHero] = useState(false);
  const activeProjectRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialAnimationComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (newSection: 'hero' | 'projects') => {
    if (!isInitialAnimationComplete || isScrollingRef.current) return;
    
    isScrollingRef.current = true;
    setCurrentSection(newSection);
    setIsTransitioningFromHero(true);
    setActiveSkills(newSection === 'projects' ? projects[0].skills : []);
    setHasScrolled(true);
    setIsProjectAnimationComplete(false);

    setTimeout(() => setIsTransitioningFromHero(false), 1000);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  const handleScroll = (e: React.WheelEvent) => {
    if (!isInitialAnimationComplete || isScrollingRef.current) return;
    if (e.ctrlKey || e.metaKey) return;
    if ((e.target as HTMLElement).closest('[data-scroll-container]')) return;

    const delta = e.deltaY;
    if (delta > 0 && currentSection === 'hero') {
      handleSectionChange('projects');
    } else if (delta < 0 && currentSection === 'projects' && window.projectCarouselIndex === 0) {
      handleSectionChange('hero');
    }
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const heroVariants = {
    initial: { 
      y: hasScrolled ? '-100%' : 0, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1 
    },
    exit: { 
      y: '-100%', 
      opacity: 0 
    }
  };

  const projectsVariants = {
    initial: { 
      y: '100%', 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1 
    },
    exit: { 
      y: '100%', 
      opacity: 0 
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <ImagePreloader />
      <Header currentSection={currentSection} />

      <main className="h-full w-full" onWheel={handleScroll}>
        <div className="relative h-full">
          <AnimatePresence mode="sync">
            {currentSection === 'hero' ? (
              <motion.div
                key="hero"
                variants={heroVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={
                  isInitialAnimationComplete ? {
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.5 }
                  } : {
                    duration: 3.8,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { 
                      duration: 0.8,
                      delay: 2.7
                    }
                  }
                }
                className="absolute inset-0 grid place-items-center"
              >
                <HeroSection 
                  onNavigateToProjects={() => handleSectionChange('projects')}
                  isEnabled={isInitialAnimationComplete}
                  hasScrolled={hasScrolled}
                />
              </motion.div>
            ) : (
              <motion.div
                key="projects"
                variants={projectsVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { duration: 0.5 }
                }}
                onAnimationComplete={() => {
                  setIsProjectAnimationComplete(true);
                }}
                className="absolute inset-0 flex"
              >
                <div className="w-80 shrink-0" data-scroll-container>
                  <SkillsTree activeSkills={activeSkills} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <ProjectSection 
                    onProjectChange={setActiveSkills}
                    projectRef={activeProjectRef}
                    isTransitioningFromHero={isTransitioningFromHero}
                  />
                </div>
                
                {currentSection === 'projects' && (
                  <SkillConnections 
                    activeSkills={activeSkills}
                    projectRef={activeProjectRef}
                    isEnabled={isProjectAnimationComplete}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}