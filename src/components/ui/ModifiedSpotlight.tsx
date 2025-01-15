import { motion } from 'framer-motion';

interface ModifiedSpotlightProps {
  isActive?: boolean;
}

export function ModifiedSpotlight({ 
  isActive = false
}: ModifiedSpotlightProps) {
  const variants = {
    hidden: { 
      pathLength: 0,
      opacity: 0
    },
    visible: { 
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <motion.rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx="2"
          strokeWidth={0.7}
          stroke="url(#borderGradient)"
          variants={variants}
          initial="hidden"
          animate={isActive ? "visible" : "hidden"}
          fill="none"
        />
        <defs>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
            <stop offset="95%" stopColor="rgba(139, 92, 246, 0.7)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.5)" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

export default ModifiedSpotlight;