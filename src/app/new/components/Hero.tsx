import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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
      className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex items-center justify-center"
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

const HeroSection = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const contentTransition = {
    duration: 1,
    ease: [0.16, 1, 0.3, 1],
    delay: 2.3
  };

  return (
    <div className="w-full h-full flex justify-center text-center">
      <motion.div 
        className="justify-center mb-[15vh] flex flex-col"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        transition={contentTransition}
      >
        <div>
          <h1 className="text-8xl font-bold text-[#d1dbff] mb-[2vh]">
            Brad Titus
          </h1>
          <h2 className="text-4xl text-[#97a1b8] font-light mb-[1vh]">
            Full Stack Developer
          </h2>
          <div className="flex justify-center items-center gap-2">
            <MapPin size={18} strokeWidth={1.25} />
            <h3 className="text-xl text-[#97a1b8] font-light">
              Tampa,FL
            </h3>
          </div>
        </div>
        <div className="flex gap-8 justify-center mt-[5vh]">
          <button 
            className="group relative py-4 w-36 shadow-xl bg-[#1a1a50] hover:bg-[#262676] text-[#d1dbff] border-[2px] border-[#6d7484] hover:text-white hover:border-[#97a1b8] transition-all duration-300 rounded-lg overflow-hidden"
            onClick={() => setIsResumeOpen(true)}
          >
            <span>Resume</span>
          </button>
          
          <button 
            className="relative py-4 w-36 shadow-xl text-[#d1dbff] border-[2px] border-[#6d7484] hover:text-white hover:border-[#97a1b8] transition-all duration-300 rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-neutral-400 bg-opacity-10 backdrop-blur-sm backdrop-filter" />
            <span className="relative">Projects</span>
          </button>
        </div>
      </motion.div>

      <ResumeModal 
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};

export default HeroSection;