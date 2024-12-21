'use client'
import { useState, useEffect } from 'react';
import { SkillsTree } from '@/components/Skills/SkillsTree';
import ProjectSection from '@/components/ProjectSection';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';
import { ImagePreloader } from '@/components/ImagePreloader';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/projects';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'hero' | 'projects'>('hero');
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);

  useEffect(() => {
    // Enable scrolling after initial animation (logo + hero fade in)
    const timer = setTimeout(() => {
      setIsInitialAnimationComplete(true);
    }, 3500); // Adjust this timing based on your total animation duration

    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (newSection: 'hero' | 'projects') => {
    if (!isInitialAnimationComplete) return; // Prevent section changes during animation
    
    setCurrentSection(newSection);
    setActiveSkills(newSection === 'projects' ? projects[0].skills : []);
    setHasScrolled(true);
  };

  const handleScroll = (e: React.WheelEvent) => {
    // Prevent scrolling if initial animation isn't complete
    if (!isInitialAnimationComplete) return;

    if (e.ctrlKey || e.metaKey) return;
    
    if ((e.target as HTMLElement).closest('[data-scroll-container]')) return;

    const delta = e.deltaY;
    if (delta > 0 && currentSection === 'hero') {
      handleSectionChange('projects');
    } else if (delta < 0 && currentSection === 'projects') {
      handleSectionChange('hero');
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <ImagePreloader />
      <Header currentSection={currentSection} />

      <main className="h-full w-full" onWheel={handleScroll}>
        <div className="relative h-full">
          <AnimatePresence>
            {currentSection === 'hero' ? (
              <motion.div
                key="hero"
                initial={hasScrolled ? { y: '-100%', opacity: 0 } : { opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{
                  duration: hasScrolled ? 1 : 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { 
                    duration: hasScrolled ? 0.5 : 0.8,
                    delay: hasScrolled ? 0 : 3
                  }
                }}
                className="absolute inset-0 grid place-items-center"
              >
                <HeroSection 
                  onNavigateToProjects={() => handleSectionChange('projects')}
                  isEnabled={isInitialAnimationComplete}
                />
              </motion.div>
            ) : (
              <motion.div
                key="projects"
                initial={hasScrolled ? { y: '100%', opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0 flex"
              >
                <div className="w-80 shrink-0" data-scroll-container>
                  <SkillsTree activeSkills={activeSkills} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <ProjectSection onProjectChange={setActiveSkills} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}