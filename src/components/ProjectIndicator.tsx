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
      className="h-8 lg:h-10 flex items-center group appearance-none focus:outline-none w-8 lg:w-14 justify-center"
      onClick={handleClick}
    >
      <div
        className={`
          transition-all duration-200 ease-in-out
          ${isActive 
            ? 'bg-[#29c4de] rounded-full lg:rounded-lg w-4 h-4 lg:w-14 lg:h-3 group-hover:w-5 group-hover:h-5 lg:group-hover:w-16 lg:group-hover:h-4' 
            : 'bg-[#5d6b83] hover:bg-[#788aa9] rounded-full lg:rounded-lg w-3 h-3 lg:w-10 lg:h-3 group-hover:w-4 group-hover:h-4 lg:group-hover:w-12 lg:group-hover:h-4'
          }
        `}
      />
    </button>
  );
};

export default ProjectIndicator;