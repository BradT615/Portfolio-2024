import React, { useState } from 'react';
import { ChevronDown, MapPin, X } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col">
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-neutral-100 transition-colors"
          >
            <X className="w-6 h-6 text-neutral-600" />
          </button>
        </div>
        
        <div className="bg-white rounded-lg h-[85vh]">
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
    hidden: hasScrolled ? { opacity: 0, y: '-100%' } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const contentTransition = {
    duration: hasScrolled ? 1 : 0.8,
    ease: [0.16, 1, 0.3, 1],
    delay: hasScrolled ? 0 : 2.3
  };

  const chevronVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const chevronTransition = {
    duration: 0.8,
    delay: hasScrolled ? 0.8 : 2.5
  };

  return (
    <>
      <motion.div 
        className="text-center flex flex-col justify-center h-full w-fit items-center z-10 pb-10"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        transition={contentTransition}
      >
        <div className="space-y-4">
          <h1 className="text-8xl font-bold bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent drop-shadow-lg">
            Brad Titus
          </h1>
          <h2 className="text-4xl text-neutral-400 font-light">
            Full Stack Developer
          </h2>
          <div className="flex justify-center items-center gap-2">
            <MapPin size={18} strokeWidth={1.25} />
            <h3 className="text-xl text-neutral-400 font-light">
              Tampa, FL
            </h3>
          </div>

          <div className="flex gap-8 justify-center pt-8">
            <button 
              className={`group relative px-8 py-4 text-lg font-semibold text-neutral-900 bg-neutral-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-700 ${!isEnabled && 'pointer-events-none'}`}
              onClick={() => isEnabled && setIsResumeOpen(true)}
            >
              <span className="relative z-10">Resume</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button 
              className={`group px-8 py-4 text-lg font-semibold text-neutral-300 border-2 border-neutral-300 rounded-lg overflow-hidden relative transition-all duration-300 hover:border-white hover:text-white hover:shadow-lg hover:shadow-neutral-800/50 ${!isEnabled && 'pointer-events-none'}`}
              onClick={handleClick}
            >
              <span className="relative z-10">Projects</span>
              <div className="absolute inset-0 bg-neutral-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className={`cursor-pointer w-fit fixed bottom-16 left-1/2 transform -translate-x-1/2 z-10 ${!isEnabled && 'pointer-events-none'}`}
        initial="hidden"
        animate="visible"
        variants={chevronVariants}
        transition={chevronTransition}
        onClick={handleClick}
      >
        <ChevronDown 
          size={45} 
          className="text-neutral-400 transition-all animate-[bounce_1.5s_ease-in-out_infinite] hover:text-white"
        />
      </motion.div>

      <ResumeModal 
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </>
  );
};

export default HeroSection;