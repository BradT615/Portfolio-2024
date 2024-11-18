// components/HeroSection.tsx
import { motion, useAnimate } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const [scope, animate] = useAnimate();

  const scrollToProjects = () => {
    const main = document.querySelector('main');
    if (!main) return;

    animate(main, { 
      scrollTop: window.innerHeight 
    }, { 
      duration: 1.5, // Increased duration
      ease: [0.16, 1, 0.3, 1] // Custom ease curve for smoother animation
    });
  };

  return (
    <motion.div 
      ref={scope}
      className="flex flex-col h-full items-center justify-center relative bg-neutral-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center space-y-8">
        <motion.h1 
          className="text-6xl font-bold mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Brad Titus
        </motion.h1>
        <motion.div 
          className="flex gap-6 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button 
            className="px-8 py-4 text-lg font-semibold text-neutral-900 bg-neutral-300 rounded-lg hover:bg-neutral-200 transition-colors"
            onClick={() => window.open('/resume.pdf', '_blank')}
          >
            Resume
          </button>
          <button 
            className="px-8 py-4 text-lg font-semibold text-neutral-300 border-2 border-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors"
            onClick={scrollToProjects}
          >
            Projects
          </button>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-12 cursor-pointer"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToProjects}
      >
        <ChevronDown size={32} />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;