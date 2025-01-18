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
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-white">
            Brad Titus
          </h1>
          <h2 className="text-4xl text-[#97a1b8] font-light">
            Full Stack Developer
          </h2>
          <div className="flex justify-center items-center gap-2">
            <MapPin size={18} strokeWidth={1.25} />
            <h3 className="text-xl text-[#97a1b8] font-light">
              Tampa, FL
            </h3>
          </div>

          <div className="flex gap-8 justify-center pt-12">
            <button 
              className={`group relative px-8 py-4 text-lg font-semibold text-[#faf9fd] hover:text-white bg-[#4a37b9] rounded-lg overflow-hidden ${!isEnabled && 'pointer-events-none'}`}
              onClick={() => isEnabled && setIsResumeOpen(true)}
            >
              <span className="relative">Resume</span>
            </button>
            
            <button 
              className={`group px-8 py-4 text-lg font-semibold text-neutral-300 border-2 border-neutral-300 rounded-lg overflow-hidden relative transition-all duration-300 hover:border-white hover:text-white hover:shadow-lg hover:shadow-neutral-800/50 ${!isEnabled && 'pointer-events-none'}`}
              onClick={handleClick}
            >
              <span className="relative">Projects</span>
              <div className="absolute inset-0 bg-neutral-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chevron Navigation */}
      <motion.div 
        className={`cursor-pointer w-fit fixed bottom-16 left-1/2 transform -translate-x-1/2 ${!isEnabled && 'pointer-events-none'}`}
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

      {/* Resume Modal */}
      <ResumeModal 
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};

export default HeroSection;