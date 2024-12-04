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
    const delta = e.deltaY;
    if (delta > 0 && currentSection === 'hero') {
      handleSectionChange('projects');
    } else if (delta < 0 && currentSection === 'projects') {
      handleSectionChange('hero');
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[6%]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Header />

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
                  duration: 0.8,
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
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0 flex"
              >
                <div className="w-80 shrink-0">
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