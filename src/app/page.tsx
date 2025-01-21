'use client'
import { useState, useRef, useEffect } from 'react';
import ProjectSection from '@/components/ProjectSection';
import Header from '@/components/Header';
import { ImagePreloader } from '@/components/ImagePreloader';
import GridBackground from '@/components/GridBackground';
import HeroSection from '@/components/HeroSection';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'hero' | 'projects'>('hero');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
  const isScrollingRef = useRef(false);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);

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
    setHasScrolled(true);

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  const handleProjectChange = (index: number) => {
    setCurrentProjectIndex(index);
  };

  const handleScroll = (e: React.WheelEvent) => {
    if (!isInitialAnimationComplete || isScrollingRef.current) return;
    if (e.ctrlKey || e.metaKey) return;
    
    const target = e.target as HTMLElement;
    const isInProjectsSection = target.closest('#projects');
    
    if (currentSection === 'projects' && isInProjectsSection) {
      return;
    }

    const delta = e.deltaY;
    if (delta > 0 && currentSection === 'hero') {
      handleSectionChange('projects');
    } else if (delta < 0 && currentSection === 'projects') {
      if (!isInProjectsSection) {
        handleSectionChange('hero');
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isInitialAnimationComplete || isScrollingRef.current) return;

    const touchEnd = e.changedTouches[0].clientY;
    const deltaY = touchStartRef.current - touchEnd;
    const minSwipeDistance = 50; // Minimum distance for a swipe to be registered

    const target = e.target as HTMLElement;
    const isInProjectsSection = target.closest('#projects');

    if (currentSection === 'projects' && isInProjectsSection) {
      return;
    }

    if (Math.abs(deltaY) >= minSwipeDistance) {
      if (deltaY > 0 && currentSection === 'hero') {
        // Swipe up
        handleSectionChange('projects');
      } else if (deltaY < 0 && currentSection === 'projects') {
        // Swipe down
        if (!isInProjectsSection) {
          handleSectionChange('hero');
        }
      }
    }
  };

  const heroVariants = {
    initial: { y: hasScrolled ? '-100%' : 0, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 }
  };

  const projectsVariants = {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  };

  return (
    <div 
      className="flex flex-col h-screen relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ImagePreloader />
      <AnimatePresence>
        {isInitialAnimationComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GridBackground currentSection={currentSection} />
          </motion.div>
        )}
      </AnimatePresence>
      <Header 
        currentSection={currentSection} 
        onNavigateToHero={() => handleSectionChange('hero')}
        onNavigateToProjects={() => handleSectionChange('projects')}
        currentProjectIndex={currentProjectIndex}
      />

      <main className="h-full w-full" onWheel={handleScroll}>
        <div className="relative h-full">
          <AnimatePresence>
            {currentSection === 'hero' ? (
              <motion.div
                key="hero"
                variants={heroVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: isInitialAnimationComplete ? 1 : 3.8,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { 
                    duration: isInitialAnimationComplete ? 0.5 : 0.8,
                    delay: isInitialAnimationComplete ? 0 : 2.7
                  }
                }}
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
                ref={projectsSectionRef}
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
                className="absolute inset-0 flex"
              >
                <ProjectSection 
                  onTopScroll={() => handleSectionChange('hero')}
                  onProjectChange={handleProjectChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}