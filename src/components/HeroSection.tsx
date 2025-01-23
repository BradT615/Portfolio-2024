import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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
      setIsCompact(window.innerHeight <= 500);
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
        <div>
          <h1 className={`${titleSize} font-bold text-[#d1dbff] mb-[2vh]`}>
            Brad Titus
          </h1>
          <h2 className={`${subtitleSize} text-[#97a1b8] font-light mb-[1vh]`}>
            Full Stack Developer
          </h2>
          <div className="flex justify-center items-center gap-2">
            <MapPin size={isCompact ? 16 : 18} strokeWidth={1.25} />
            <h3 className={`${locationSize} text-[#97a1b8] font-light`}>
              Tampa,FL
            </h3>
          </div>
        </div>
        <div className={`flex gap-4 sm:gap-8 justify-center mt-[5vh]`}>
          <button 
            className={`group relative ${buttonPadding} ${buttonSize} shadow-xl bg-[#1a1a50] hover:bg-[#262676] text-[#d1dbff] border-[2px] border-[#6d7484] hover:text-white hover:border-[#97a1b8] transition-all duration-300 rounded-lg overflow-hidden ${!isEnabled && 'pointer-events-none'}`}
            onClick={() => isEnabled && setIsResumeOpen(true)}
          >
            <span>Resume</span>
          </button>
          
          <button 
            className={`relative ${buttonPadding} ${buttonSize} shadow-xl text-[#d1dbff] border-[2px] border-[#6d7484] hover:text-white hover:border-[#97a1b8] transition-all duration-300 rounded-lg overflow-hidden ${!isEnabled && 'pointer-events-none'}`}
            onClick={handleClick}
          >
            <div className="absolute inset-0 bg-neutral-400 bg-opacity-10 backdrop-blur-sm backdrop-filter" />
            <span className="relative">Projects</span>
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
          size={isCompact ? 35 : 45} 
          className="cursor-pointer transition-all animate-[bounce_1.5s_ease-in-out_infinite] hover:text-[#97a1b8]"
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