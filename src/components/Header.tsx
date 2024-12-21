import Link from 'next/link';
import { Logo } from '@/components/Logo';
import EmailModal from '@/components/ui/EmailModal';
import { TextEffect } from './core/text-effect';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HeaderProps {
  currentSection?: 'hero' | 'projects';
}

export default function Header({ currentSection = 'hero' }: HeaderProps) {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Logo Container - Position Fixed to break out of header bounds */}
      <motion.div 
        className="fixed z-20"
        initial={{ 
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={animationComplete ? { 
          left: "20px",
          top: "20px",
          x: "0%",
          y: "0%",
        } : {}}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <Logo className={`${animationComplete ? 'h-12 w-12' : 'h-52 w-52'} transition-all duration-800`} />
      </motion.div>

      {/* Header with Navigation */}
      <motion.header 
        className="fixed w-full z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center px-5 h-20 w-full">
          {/* Empty div to maintain spacing where logo will be */}
          <div className={`${animationComplete ? 'h-12 w-12' : 'h-32 w-32'}`} />
          
          {currentSection === 'projects' && (
            <TextEffect 
              per='char' 
              preset='fade' 
              className="pl-4 text-3xl text-neutral-400 font-light tracking-wide"
            >
              Projects
            </TextEffect>
          )}

          <motion.nav 
            className="flex items-center text-lg ml-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              href="https://www.linkedin.com/in/bradt615/" 
              className="nav-link hover:text-neutral-300 transition-colors" 
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>
            <span className="mx-6 text-neutral-400">/</span>
            <Link 
              href="https://github.com/BradT615" 
              className="nav-link hover:text-neutral-300 transition-colors" 
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