import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projects } from '@/lib/projects';
import ProjectIndicator from '../ProjectIndicator';
import ProjectSpotlight from '../ProjectSpotlight';
import LandscapeCard from './LandscapeCard';
import VerticalCard from './VerticalCard';
import { ProjectCardProps } from './types';

const ProjectCard: React.FC<ProjectCardProps> = ({
  onProjectChange,
  projectRef,
  onAnimationComplete,
  onTopScroll,
  currentIndex: initialIndex = 0,
  isSkillsConnected = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isFirstRender, setIsFirstRender] = useState(true);
  const prevIndex = useRef(currentIndex);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].pageX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].pageX;
    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchStartX.current - touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (Math.abs(deltaY) >= minSwipeDistance) {
        const isAtFirstCard = currentIndex === 0;
        if (deltaY > 0 && currentIndex < projects.length - 1) {
          setIsScrolling(true);
          setScrollDirection('down');
          setCurrentIndex(prev => prev + 1);
        } else if (deltaY < 0) {
          if (!isAtFirstCard) {
            setIsScrolling(true);
            setScrollDirection('up');
            setCurrentIndex(prev => prev - 1);
          } else {
            onTopScroll?.();
            return;
          }
        }
      }
    } else {
      if (Math.abs(deltaX) >= minSwipeDistance) {
        if (deltaX > 0 && currentIndex < projects.length - 1) {
          setIsScrolling(true);
          setScrollDirection('down');
          setCurrentIndex(prev => prev + 1);
        } else if (deltaX < 0 && currentIndex > 0) {
          setIsScrolling(true);
          setScrollDirection('up');
          setCurrentIndex(prev => prev - 1);
        }
      }
    }

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 800);
  };

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

  return (
    <div
      ref={containerRef}
      id="projects"
      className="relative flex h-full items-center justify-end xl:justify-center mr-0 lg:mr-8 xl:mr-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={projectRef} className="relative">
        <div className="landscape-div">
          <AnimatePresence mode="popLayout" custom={scrollDirection}>
            <motion.div
              key={`landscape-${projects[currentIndex].title}-${currentIndex}`}
              custom={scrollDirection}
              variants={slideVariants}
              initial={isFirstRender ? 'center' : 'enter'}
              animate="center"
              exit="exit"
              onAnimationComplete={onAnimationComplete}
              transition={{
                duration: isFirstRender ? 0 : 0.4,
                ease: 'easeInOut',
                opacity: { duration: isFirstRender ? 0 : 0.3, delay: isFirstRender ? 0 : 0.2 },
              }}
            >
              <LandscapeCard project={projects[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="vertical-div">
          <AnimatePresence mode="popLayout" custom={scrollDirection}>
            <motion.div
              key={`vertical-${projects[currentIndex].title}-${currentIndex}`}
              custom={scrollDirection}
              variants={slideVariants}
              initial={isFirstRender ? 'center' : 'enter'}
              animate="center"
              exit="exit"
              onAnimationComplete={onAnimationComplete}
              transition={{
                duration: isFirstRender ? 0 : 0.4,
                ease: 'easeInOut',
                opacity: { duration: isFirstRender ? 0 : 0.3, delay: isFirstRender ? 0 : 0.2 },
              }}
            >
              <VerticalCard project={projects[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>
        <ProjectSpotlight
          isEnabled={isSkillsConnected}
          projectRef={projectRef!}
        />
      </div>
      <div className="ml-4 lg:ml-8">
        <ProjectIndicator
          totalProjects={projects.length}
          currentIndex={currentIndex}
          isScrolling={isScrolling}
          onIndicatorClick={handleIndicatorClick}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
