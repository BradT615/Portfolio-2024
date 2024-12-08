import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onNavigateToProjects: () => void;
}

const HeroSection = ({ onNavigateToProjects }: HeroSectionProps) => {
  return (
    <>
      {/* Gradient background that animates with the hero section */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              60vw 40vh at 50% 0%,
              rgb(38, 38, 38),
              rgb(0, 0, 0)
            )`
          }}
        />
      </motion.div>

      <div className="text-center flex flex-col justify-center h-full w-fit items-center z-10 pb-10">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent drop-shadow-lg">
            Brad Titus
          </h1>
          <h2 className="text-4xl text-neutral-400 font-light">
            Full Stack Developer
          </h2>
          <div className='flex justify-center items-center gap-2'>
            <MapPin size={18} strokeWidth={1.25} />
            <h3 className="text-xl text-neutral-400 font-light">
              Tampa, FL
            </h3>
          </div>

          <div className="flex gap-8 justify-center pt-8">
            <button 
              className="group relative px-8 py-4 text-lg font-semibold text-neutral-900 bg-neutral-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-700"
              onClick={() => window.open('/resume.pdf', '_blank')}
            >
              <span className="relative z-10">Resume</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button 
              className="group px-8 py-4 text-lg font-semibold text-neutral-300 border-2 border-neutral-300 rounded-lg overflow-hidden relative transition-all duration-300 hover:border-white hover:text-white hover:shadow-lg hover:shadow-neutral-800/50"
              onClick={onNavigateToProjects}
            >
              <span className="relative z-10">Projects</span>
              <div className="absolute inset-0 bg-neutral-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>
        </div>
      </div>
      <div 
        className="cursor-pointer w-fit fixed bottom-16 left-1/2 transform -translate-x-1/2"
        onClick={onNavigateToProjects}
      >
        <ChevronDown 
          size={45} 
          className="text-neutral-400 transition-all animate-[bounce_1.5s_ease-in-out_infinite] hover:text-white"
        />
      </div>
    </>
  );
};

export default HeroSection;