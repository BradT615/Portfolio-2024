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
    <div className="flex flex-col p-8 w-32">
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
      className="h-10 flex items-center group appearance-none focus:outline-none"
      onClick={handleClick}
    >
      <div
        className={`
          rounded-lg transition-all duration-200 ease-in-out
          ${isActive ? 'bg-[#29c4de] w-14 h-3 group-hover:w-16 group-hover:h-4' : 'bg-[#5d6b83] hover:bg-[#788aa9] w-10 h-3 group-hover:w-12 group-hover:h-4'}
        `}
      />
    </button>
  );
};

export default ProjectIndicator;