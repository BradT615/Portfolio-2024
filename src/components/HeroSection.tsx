import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { BREAKPOINTS } from '@/lib/constants';

interface HeroSectionProps {
  onNavigateToProjects: () => void;
  isEnabled?: boolean;
  hasScrolled?: boolean;
}

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-30 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex items-center justify-center"
      onClick={handleBackdropClick}
      data-state={isOpen ? 'open' : 'closed'}
    >
      <div className="w-full max-w-7xl flex flex-col mx-4">
        <div className="rounded-lg h-[85vh]">
          <iframe
            src="/BradleyTitus_Resume.pdf"
            className="w-full h-full rounded-lg"
            title="Resume PDF"
          />
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ onNavigateToProjects, isEnabled = true, hasScrolled = false }: HeroSectionProps) => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsCompact(window.innerHeight <= BREAKPOINTS.SMALL_HEIGHT);
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleClick = () => {
    if (isEnabled) {
      onNavigateToProjects();
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: hasScrolled ? '-100%' : 20 },
    visible: { opacity: 1, y: 0 },
  };

  const contentTransition = {
    duration: 1,
    ease: [0.16, 1, 0.3, 1],
    delay: hasScrolled ? 0 : 2.3
  };

  const chevronVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const chevronTransition = {
    duration: 0.4,
    delay: 0.6
  };
  
  const titleSize = isCompact ? 'text-5xl' : 'text-5xl sm:text-8xl';
  const subtitleSize = isCompact ? 'text-xl' : 'text-xl sm:text-4xl';
  const locationSize = isCompact ? 'text-lg' : 'text-lg sm:text-xl';
  const buttonSize = isCompact ? 'text-base w-28' : 'text-base sm:text-lg w-28 sm:w-36';
  const buttonPadding = isCompact ? 'py-2' : 'py-3 sm:py-4';
  const contentHeight = isCompact ? 'justify-start mt-[10vh]' : 'justify-center mb-[15vh]';
  const chevronPosition = isCompact ? 'bottom-2' : 'bottom-8';

  return (
    <div className={`w-full h-full flex justify-center text-center`}>
      <motion.div
        className={`${contentHeight} flex flex-col`}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        transition={contentTransition}
      >
        <div className="space-y-4">
          <h1 className={`${titleSize} font-semibold tracking-tight text-white mb-3`}>
            Brad Titus
          </h1>
          <h2 className={`${subtitleSize} text-neutral-400 font-normal tracking-wide`}>
            Full Stack Developer
          </h2>
          <div className="flex justify-center items-center gap-2 text-neutral-500 mt-2">
            <MapPin size={isCompact ? 14 : 16} strokeWidth={2} className="opacity-70" />
            <span className={`${locationSize} font-light tracking-wide`}>
              Tampa, FL
            </span>
          </div>
        </div>
        <div className={`flex gap-4 justify-center mt-12`}>
          <button
            className={`group relative ${buttonPadding} ${buttonSize} font-medium tracking-wide
              bg-white/5 hover:bg-white/10
              text-white/90 hover:text-white
              border border-white/10 hover:border-white/20
              backdrop-blur-sm
              transition-all duration-200 ease-out
              rounded-xl
              shadow-lg hover:shadow-xl
              ${!isEnabled && 'pointer-events-none'}`}
            onClick={() => isEnabled && setIsResumeOpen(true)}
          >
            <span className="relative z-10">Resume</span>
          </button>

          <button
            className={`relative ${buttonPadding} ${buttonSize} font-medium tracking-wide
              bg-white/10 hover:bg-white/[0.15]
              text-white
              border border-white/20 hover:border-white/30
              backdrop-blur-sm
              transition-all duration-200 ease-out
              rounded-xl
              shadow-lg hover:shadow-xl
              ${!isEnabled && 'pointer-events-none'}`}
            onClick={handleClick}
          >
            <span className="relative z-10">Projects</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        className={`fixed ${chevronPosition} left-1/2 -translate-x-1/2 ${!isEnabled && 'pointer-events-none'}`}
        initial="hidden"
        animate="visible"
        variants={chevronVariants}
        transition={chevronTransition}
        onClick={handleClick}
      >
        <ChevronDown
          size={isCompact ? 32 : 40}
          className="cursor-pointer text-white/40 hover:text-white/60 transition-colors animate-[bounce_1.5s_ease-in-out_infinite]"
          strokeWidth={1.5}
        />
      </motion.div>

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};

export default HeroSection;