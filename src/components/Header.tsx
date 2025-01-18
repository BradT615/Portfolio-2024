import Link from 'next/link';
import { Logo } from '@/components/Logo';
import EmailModal from '@/components/ui/EmailModal';
import { TextEffect } from './core/text-effect';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HeaderProps {
  currentSection?: 'hero' | 'projects';
  onNavigateToHero?: () => void;
  onNavigateToProjects?: () => void;
  currentProjectIndex?: number;
}

export default function Header({ 
  currentSection = 'hero', 
  onNavigateToHero, 
  onNavigateToProjects,
  currentProjectIndex = 0
}: HeaderProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsVisible(currentSection === 'projects');
  }, [currentSection]);

  const handleLogoClick = () => {
    if (currentSection === 'projects' && onNavigateToHero) {
      onNavigateToHero();
    }
  };

  const handleScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
    
    if (currentSection === 'projects' && onNavigateToHero && e.deltaY < 0 && currentProjectIndex === 0) {
      onNavigateToHero();
    } else if (currentSection === 'hero' && onNavigateToProjects && e.deltaY > 0) {
      onNavigateToProjects();
    }
  };

  return (
    <>
      <motion.div 
        className="fixed z-30"
        initial={{ 
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={animationComplete ? { 
          left: "16px",
          top: "16px",
          x: "0%",
          y: "0%",
        } : {}}
        transition={{
          duration: 1,
          ease: [0.25, 0.1, 0.6, 1]
        }}
      >
        <div 
          onClick={handleLogoClick}
          className={`cursor-${currentSection === 'projects' ? 'pointer' : 'default'}`}
        >
          <Logo className={`${animationComplete ? 'h-12 w-12' : 'h-52 w-52'} transition-all duration-1000 ease-out delay-100`} />
        </div>
      </motion.div>

      <motion.header 
        className="fixed w-full z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onWheel={handleScroll}
      >
        <div className="flex items-center px-5 h-20 w-full text-[#97a1b8]">
          <div className={`${animationComplete ? 'h-12 w-12' : 'h-32 w-32'}`} />
          
          <AnimatePresence mode="wait">
            <TextEffect 
              key="projects-title"
              per="char" 
              preset="fade" 
              className="pl-4 text-3xl font-light"
              trigger={isVisible}
            >
              Projects
            </TextEffect>
          </AnimatePresence>

          <motion.nav 
            className="flex items-center text-lg ml-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              href="https://www.linkedin.com/in/bradt615/" 
              className="nav-link hover:text-white transition-colors pointer-events-auto" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <TextEffect
                per="char"
                preset="fade"
                trigger={animationComplete}
                delay={0.5}
              >
                LinkedIn
              </TextEffect>
            </Link>
            <motion.span 
              className="mx-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationComplete ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            >
              /
            </motion.span>
            <Link 
              href="https://github.com/BradT615" 
              className="nav-link hover:text-white transition-colors pointer-events-auto" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <TextEffect
                per="char"
                preset="fade"
                trigger={animationComplete}
                delay={1}
              >
                Github
              </TextEffect>
            </Link>
            <motion.span 
              className="mx-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationComplete ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 1.5 }}
            >
              /
            </motion.span>
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="nav-link hover:text-white transition-colors pointer-events-auto"
            >
              <TextEffect
                per="char"
                preset="fade"
                trigger={animationComplete}
                delay={1.3}
              >
                Email
              </TextEffect>
            </button>
          </motion.nav>
        </div>
      </motion.header>

      <EmailModal 
        open={isEmailModalOpen} 
        onOpenChange={setIsEmailModalOpen}
      />
    </>
  );
}