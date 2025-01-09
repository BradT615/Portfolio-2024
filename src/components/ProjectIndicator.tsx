import { motion } from 'framer-motion';

interface ProjectIndicatorProps {
  totalProjects: number;
  currentIndex: number;
  isScrolling: boolean;
  onIndicatorClick: (index: number) => void;
}

const ProjectIndicator: React.FC<ProjectIndicatorProps> = ({
  totalProjects,
  currentIndex,
  isScrolling,
  onIndicatorClick,
}) => {
  return (
    <div className="relative flex flex-col justify-center p-8 w-32">
      <div className="relative">
        {Array.from({ length: totalProjects }).map((_, index) => (
          <IndicatorButton
            key={index}
            index={index}
            isActive={index === currentIndex}
            isScrolling={isScrolling}
            onClick={() => onIndicatorClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

interface IndicatorButtonProps {
  index: number;
  isActive: boolean;
  isScrolling: boolean;
  onClick: () => void;
}

const IndicatorButton: React.FC<IndicatorButtonProps> = ({
  index,
  isActive,
  isScrolling,
  onClick,
}) => {
  const handleClick = () => {
    if (!isScrolling) {
      onClick();
    }
  };

  return (
    <motion.button
      className="relative h-8 flex items-center mb-1 group"
      onClick={handleClick}
      whileHover="hover"
    >
      <motion.div
        className={`h-3 rounded-lg transition-colors duration-200
          ${isActive ? 'bg-blue-400 w-14' : 'bg-neutral-600 w-10'}`}
        variants={{
          hover: {
            width: isActive ? 56 : 48,
            height: 14,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 25
            }
          }
        }}
        animate={{
          width: isActive ? 56 : 40,
          height: isActive ? 12 : 10
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-blue-400/20 rounded-lg m-1 -mx-1 blur-sm"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ProjectIndicator;