'use client'
import { useState } from 'react';
import { SkillsTree } from '@/components/Skills/SkillsTree';
import ProjectSection from '@/components/ProjectSection';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/projects';

export default function Home() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleSectionChange = (newSection: 'hero' | 'projects') => {
    setCurrentSection(newSection);
    setActiveSkills(newSection === 'projects' ? projects[0].skills : []);
    setHasScrolled(true);
  };

  const handleScroll = (e: React.WheelEvent) => {
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
      <Header />
      {/* <AnimatePresence>
        {currentSection === 'hero' && (
          <motion.div 
            key="hero-gradient"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              background: `radial-gradient(
                40vw 30vh at 50% 0%,
                hsl(240, 7%, 10%),
                hsl(240, 7%, 6%)
              )`
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}
          />
        )}
      </AnimatePresence> */}

      <main className="h-full w-full" onWheel={handleScroll}>
        <div className="relative h-full">
          <AnimatePresence>
            {currentSection === 'hero' ? (
              <motion.div
                key="hero"
                initial={hasScrolled ? { y: '-100%', opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0 grid place-items-center"
              >
                <HeroSection onNavigateToProjects={() => handleSectionChange('projects')} />
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