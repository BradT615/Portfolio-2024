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
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsCompact(window.innerHeight <= 700);
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

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

  const headerHeight = isCompact ? 'h-12 sm:h-14' : 'h-16 sm:h-20';
  const logoSize = isCompact ? 
    `${animationComplete ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-40 w-40'}` : 
    `${animationComplete ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-52 w-52'}`;
  const navFontSize = isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg';
  const navSpacing = isCompact ? 'mx-1 sm:mx-4' : 'mx-1 sm:mx-6';

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
          top: isCompact ? "12px" : "16px",
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
          <Logo className={`${logoSize} -mt-1 transition-all duration-1000 ease-out delay-100`} />
        </div>
      </motion.div>

      <motion.header 
        className={`w-full z-10 ${headerHeight}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onWheel={handleScroll}
      >
        <div className="flex items-center px-4 h-full w-full text-[#97a1b8]">
          <div className={`${animationComplete ? 'h-12 w-12' : 'h-32 w-32'}`} />
          
          <AnimatePresence mode="wait">
            <TextEffect 
              key="projects-title"
              per="char" 
              preset="fade" 
              className={`${isCompact ? 'text-2xl mt-2 ml-1' : 'text-3xl ml-2'} font-light transition-all duration-1000 delay-100`}
              trigger={isVisible}
            >
              Projects
            </TextEffect>
          </AnimatePresence>

          <motion.nav 
            className={`flex items-center ${navFontSize} ml-auto`}
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
              className={navSpacing}
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
              className={navSpacing}
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