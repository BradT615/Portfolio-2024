import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Youtube } from 'lucide-react';
import { IoLogoGithub } from "react-icons/io";
import { projects } from '@/lib/projects';
import YoutubeModal from './YoutubeModal';
import ProjectIndicator from './ProjectIndicator';
import ProjectSpotlight from './ProjectSpotlight';
import { TextShimmer } from './core/text-shimmer';

interface Project {
  title: string;
  repoLink: string;
  liveLink?: string;
  videoUrl?: string;
  imageUrl?: string;
  description?: string;
  skills: string[];
  isGithubCard?: boolean;
}

interface ProjectCardProps {
  onProjectChange?: (skills: string[], projectIndex: number) => void;
  projectRef?: React.RefObject<HTMLDivElement>;
  onAnimationComplete?: () => void;
  onTopScroll?: () => void;
  currentIndex?: number;
  isSkillsConnected?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  onProjectChange,
  projectRef,
  onAnimationComplete,
  onTopScroll,
  currentIndex: initialIndex = 0,
  isSkillsConnected = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isFirstRender, setIsFirstRender] = useState(true);
  const prevIndex = useRef(currentIndex);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      prevIndex.current = currentIndex;
      onProjectChange?.(projects[currentIndex].skills, currentIndex);
    }
  }, [currentIndex, onProjectChange]);

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      if (isScrolling) return;

      const isAtFirstCard = currentIndex === 0;
      if (event.deltaY > 0 && currentIndex < projects.length - 1) {
        setIsScrolling(true);
        setScrollDirection('down');
        setCurrentIndex((prev) => prev + 1);
      } else if (event.deltaY < 0) {
        if (!isAtFirstCard) {
          setIsScrolling(true);
          setScrollDirection('up');
          setCurrentIndex((prev) => prev - 1);
        } else {
          onTopScroll?.();
          return;
        }
      }

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 800);
    },
    [currentIndex, isScrolling, onTopScroll]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleScroll, { passive: false });
    return () => container.removeEventListener('wheel', handleScroll);
  }, [handleScroll]);

  const slideVariants = {
    enter: (direction: 'up' | 'down') => ({
      y: direction === 'down' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: 'up' | 'down') => ({
      y: direction === 'down' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const handleIndicatorClick = (index: number) => {
    if (!isScrolling) {
      setScrollDirection(index > currentIndex ? 'down' : 'up');
      setCurrentIndex(index);
    }
  };

  const renderProjectImage = (project: Project) => {
    const imageComponent = (
      <Image
        src={project.imageUrl!}
        alt={project.title}
        width={500}
        height={300}
        className="h-full w-full rounded-md border-[1px] border-[#222441] transition-opacity hover:opacity-80 cursor-pointer"
      />
    );

    if (project.videoUrl) {
      return (
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-full w-full"
          aria-label={`Watch video for ${project.title}`}
        >
          {imageComponent}
        </button>
      );
    }

    if (project.liveLink) {
      return (
        <Link
          href={project.liveLink}
          target="_blank"
          className="h-full w-full"
          aria-label={`Visit live site for ${project.title}`}
        >
          {imageComponent}
        </Link>
      );
    }

    return imageComponent;
  };

  const renderCardContent = (project: Project) => (
    <div className="relative w-[95vw] h-fit lg:w-[50vw] xl:w-[40vw] max-w-[700px] max-h-[80vh] max-lg:mt-16 bg-[#101328] rounded-lg border-2 border-[#222441] shadow-2xl">
      <div className="relative z-10 h-full w-full rounded-xl">
        {project.isGithubCard ? (
          <>
            <div className="flex flex-col h-full items-center justify-center gap-8 p-4">
              <IoLogoGithub size={200} />
              <button className="w-fit rounded-full border-[1px] border-[#222441] px-6 py-2 text-[#97a1b8] hover:border-[#97a1b8] transition-colors">
                <Link href={project.repoLink} target="_blank">
                  <TextShimmer
                    className="font-mono text-lg"
                    duration={1}
                    repeat={Infinity}
                    delay={2}
                    spread={3}
                  >
                    View my GitHub
                  </TextShimmer>
                </Link>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative h-3/5 p-2">
              {renderProjectImage(project)}
            </div>
            <div className="flex h-2/5 flex-col px-[3%] pb-2">
              <div className="flex items-center justify-between min-h-12 pb-2">
                <h3 className="text:lg min-[450px]:text-xl lg:text-2xl lg:font-semibold text-[#97a1b8]">
                  {project.title}
                </h3>
                <div className="flex gap-2 lg:gap-3">
                  <Link
                    href={project.repoLink}
                    target="_blank"
                    className="p-1.5 lg:p-2 transition-colors hover:text-[#b6c2de]"
                  >
                    <Github strokeWidth="1.5" className="w-5 h-5 lg:w-6 lg:h-6" />
                  </Link>
                  {project.videoUrl ? (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-1.5 lg:p-2 transition-colors hover:text-[#b6c2de]"
                    >
                      <Youtube strokeWidth="1.5" className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                  ) : (
                    project.liveLink && (
                      <Link
                        href={project.liveLink}
                        target="_blank"
                        className="p-1.5 lg:p-2 transition-colors hover:text-[#97a1b8]"
                      >
                        <ExternalLink strokeWidth="1.5" className="w-5 h-5 lg:w-6 lg:h-6" />
                      </Link>
                    )
                  )}
                </div>
              </div>
              <div className="mb-4 h-0.5 w-full self-center bg-[#222441]" />
              <p className="mb-4 flex-1 overflow-y-auto min-h-24 text-sm lg:text-base leading-relaxed text-[#81899c]">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 py-2 items-center">
                {project.skills.map((skill, i) => (
                  <span key={i} className="text-xs lg:text-sm">
                    <div className="w-full rounded-full bg-gray-400 bg-opacity-10 p-2 px-3 py-1.5 text-[#97a1b8] backdrop-blur-sm backdrop-filter">
                      {skill}
                    </div>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      id="projects"
      className="relative flex h-full items-center justify-center"
    >
      <div ref={projectRef} className="relative">
        <AnimatePresence mode="popLayout" custom={scrollDirection}>
          <motion.div
            key={projects[currentIndex].title}
            custom={scrollDirection}
            variants={slideVariants}
            initial={isFirstRender ? 'center' : 'enter'}
            animate="center"
            exit="exit"
            onAnimationComplete={onAnimationComplete}
            transition={{
              duration: isFirstRender ? 0 : 0.4,
              ease: 'easeInOut',
              opacity: {
                duration: isFirstRender ? 0 : 0.3,
                delay: isFirstRender ? 0 : 0.2,
              },
            }}
          >
            {renderCardContent(projects[currentIndex])}
          </motion.div>
        </AnimatePresence>
        <ProjectSpotlight
          isEnabled={isSkillsConnected}
          projectRef={projectRef!}
        />
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <ProjectIndicator
          totalProjects={projects.length}
          currentIndex={currentIndex}
          isScrolling={isScrolling}
          onIndicatorClick={handleIndicatorClick}
        />
      </div>

      {projects[currentIndex].videoUrl && (
        <YoutubeModal
          videoUrl={projects[currentIndex].videoUrl!}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectCard;