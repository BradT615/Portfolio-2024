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
    <div className="flex flex-row lg:flex-col items-center lg:items-start gap-1">
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
  );
};

interface IndicatorButtonProps {
  index: number;
  isActive: boolean;
  isScrolling: boolean;
  onClick: () => void;
}

const IndicatorButton: React.FC<IndicatorButtonProps> = ({
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
    <button
      className="h-10 flex items-center group appearance-none focus:outline-none w-8 lg:w-16"
      onClick={handleClick}
    >
      <div
        className={`
          transition-all duration-200 ease-in-out
          ${isActive 
            ? 'bg-cyan-400 rounded-lg h-3 w-12 group-hover:h-4 group-hover:w-14' 
            : 'bg-slate-600 group-hover:bg-slate-500 rounded-lg h-3 w-10 group-hover:h-4 group-hover:w-12'
          }
        `}
      />
    </button>
  );
};

export default ProjectIndicator;