import Link from 'next/link';
import { Logo } from '@/components/Logo';
import EmailModal from '@/components/ui/EmailModal';
import { TextEffect } from './core/text-effect';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HeaderProps {
  currentSection?: 'hero' | 'projects';
}

export default function Header({ currentSection = 'hero' }: HeaderProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsVisible(currentSection === 'projects');
  }, [currentSection]);

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
        <Logo className={`${animationComplete ? 'h-12 w-12' : 'h-52 w-52'} transition-all duration-1000 ease-out delay-100`} />
      </motion.div>

      <motion.header 
        className="fixed w-full z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center px-5 h-20 w-full">
          <div className={`${animationComplete ? 'h-12 w-12' : 'h-32 w-32'}`} />
          
          <AnimatePresence mode="wait">
          <TextEffect 
            key="projects-title"
            per="char" 
            preset="fade" 
            className="pl-4 text-3xl text-neutral-400 font-light"
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
              className="nav-link hover:text-neutral-300 transition-colors pointer-events-auto" 
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>
            <span className="mx-6 text-neutral-400">/</span>
            <Link 
              href="https://github.com/BradT615" 
              className="nav-link hover:text-neutral-300 transition-colors pointer-events-auto" 
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </Link>
            <span className="mx-6 text-neutral-400">/</span>
            <EmailModal />
          </motion.nav>
        </div>
      </motion.header>
    </>
  );
}