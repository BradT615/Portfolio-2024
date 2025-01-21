import React, { useState } from 'react';
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

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Main Content */}
      <motion.div 
        className="text-center flex flex-col justify-center items-center pb-10"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        transition={contentTransition}
      >
        <div className="space-y-2 sm:space-y-4">
          <h1 className="text-5xl min-[380px]:text-6xl sm:text-8xl font-bold text-[#d1dbff]">
            Brad Titus
          </h1>
          <h2 className="text-xl min-[380px]:text-2xl sm:text-4xl text-[#97a1b8] font-light">
            Full Stack Developer
          </h2>
          <div className="flex justify-center items-center gap-2">
            <MapPin size={18} strokeWidth={1.25} />
            <h3 className="text-lg sm:text-xl text-[#97a1b8] font-light">
              Tampa, FL
            </h3>
          </div>

          <div className="flex gap-4 sm:gap-8 justify-center pt-32 sm:pt-12">
            <button 
              className={`group relative w-32 sm:w-40 py-3 sm:py-4 text-base sm:text-lg shadow-xl bg-[#1a1a50] hover:bg-[#262676] text-[#d1dbff] border-[2px] border-[#6d7484] hover:text-white hover:border-[#97a1b8] transition-all duration-300 rounded-lg overflow-hidden ${!isEnabled && 'pointer-events-none'}`}
              onClick={() => isEnabled && setIsResumeOpen(true)}
            >
              <span className="relative">Resume</span>
            </button>
            
            <button 
              className={`relative w-32 sm:w-40 py-3 sm:py-4 text-base sm:text-lg shadow-xl text-[#d1dbff] border-[2px] border-[#6d7484] hover:text-white hover:border-[#97a1b8] transition-all duration-300 rounded-lg overflow-hidden ${!isEnabled && 'pointer-events-none'}`}
              onClick={handleClick}
            >
              <div className="absolute inset-0 bg-neutral-400 bg-opacity-10 backdrop-blur-sm backdrop-filter" />
              <span className="relative">Projects</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chevron Navigation */}
      <motion.div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${!isEnabled && 'pointer-events-none'}`}
        initial="hidden"
        animate="visible"
        variants={chevronVariants}
        transition={chevronTransition}
        onClick={handleClick}
      >
        <ChevronDown 
          size={45} 
          className="cursor-pointer transition-all animate-[bounce_1.5s_ease-in-out_infinite] hover:text-[#97a1b8]"
        />
      </motion.div>

      {/* Resume Modal */}
      <ResumeModal 
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};

export default HeroSection;