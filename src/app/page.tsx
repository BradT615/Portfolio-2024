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
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
  const isScrollingRef = useRef(false);
  const projectsSectionRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = (e: React.WheelEvent) => {
    if (!isInitialAnimationComplete || isScrollingRef.current) return;
    if (e.ctrlKey || e.metaKey) return;
    
    // Get the scroll target
    const target = e.target as HTMLElement;
    const isInProjectsSection = target.closest('#projects');
    
    // If we're in the projects section, let it handle its own scroll
    if (currentSection === 'projects' && isInProjectsSection) {
      return;
    }

    // Handle page-level section changes
    const delta = e.deltaY;
    if (delta > 0 && currentSection === 'hero') {
      handleSectionChange('projects');
    } else if (delta < 0 && currentSection === 'projects') {
      // Only change section if not in projects carousel
      if (!isInProjectsSection) {
        handleSectionChange('hero');
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
    <div className="flex flex-col h-screen relative overflow-hidden">
      <ImagePreloader />
      <GridBackground />
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
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}