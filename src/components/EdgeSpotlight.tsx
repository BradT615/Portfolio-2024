import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type SpotlightProps = {
  isActive?: boolean;
  padding?: number;
};

export function EdgeSpotlight({ isActive = false, padding = 20 }: SpotlightProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      setProgress(1);
    } else {
      setProgress(0);
    }
  }, [isActive]);

  const commonStyles = {
    position: 'absolute' as const,
    width: '150%',
    height: '150%',
    background: `radial-gradient(
      circle at center,
      transparent 30%,
      rgba(59, 130, 246, 0.5) 70%,
      rgba(139, 92, 246, 1) 100%
    )`,
    opacity: progress,
    pointerEvents: 'none' as const,
    filter: 'blur(20px)',
    transformOrigin: 'left center', // Changed to left center for middle-left starting point
    left: '-25%',
    top: '-25%',
  };

  // Top path animation (from middle-left to top-right)
  const topVariants = {
    hidden: { 
      rotate: 0,
      x: '0%',
      y: '0%'
    },
    visible: { 
      rotate: -45, // Adjusted for diagonal movement
      x: '100%',
      y: '-50%',
      transition: {
        duration: 6,
        ease: "easeOut",
        when: "beforeChildren"
      }
    }
  };

  // Bottom path animation (from middle-left to bottom-right)
  const bottomVariants = {
    hidden: { 
      rotate: 0,
      x: '0%',
      y: '0%'
    },
    visible: { 
      rotate: 45, // Adjusted for diagonal movement
      x: '100%',
      y: '50%',
      transition: {
        duration: 6,
        ease: "easeOut",
        when: "beforeChildren"
      }
    }
  };

  return (
    <div className="absolute" style={{
      top: -padding,
      left: -padding,
      right: -padding,
      bottom: -padding,
      overflow: 'hidden',
      borderRadius: '12px',
    }}>
      <motion.div
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        variants={topVariants}
        style={commonStyles}
      />
      <motion.div
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        variants={bottomVariants}
        style={commonStyles}
      />
    </div>
  );
}

export default EdgeSpotlight;