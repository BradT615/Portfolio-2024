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

const ProjectImage = ({ project }: { project: Project }) => {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const imageComponent = (
   <Image
     src={project.imageUrl!}
     alt={project.title}
     width={1920}
     height={1080}
     className="w-fit object-fit rounded-lg border-[1px] border-[#222441]"
   />
 );
 if (project.videoUrl) {
   return (
     <>
       <button
         onClick={() => setIsModalOpen(true)}
         className="h-full w-full"
         aria-label={`Watch video for ${project.title}`}
       >
         {imageComponent}
       </button>
       <YoutubeModal
         videoUrl={project.videoUrl}
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
       />
     </>
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

const LandscapeGithubCard = ({ project }: { project: Project }) => (
 <div className="flex flex-col items-center justify-center w-[50vw] max-w-3xl h-fit max-h-[90vh] relative bg-[#101328] rounded-lg border-2 border-[#222441] shadow-2xl overflow-hidden">
   <div className="flex flex-col justify-center items-center gap-[2vh] p-4">
     <IoLogoGithub className='h-28 w-28 [@media(min-height:550px)]:h-48 [@media(min-height:550px)]:w-48' />
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
 </div>
);

const VerticalGithubCard = ({ project }: { project: Project }) => (
 <div className="flex flex-col items-center justify-center w-[40vw] max-w-2xl h-[50vh] relative bg-[#101328] rounded-lg border-2 border-[#222441] shadow-2xl overflow-hidden">
   <div className="flex flex-col justify-center items-center gap-8 p-4">
     <IoLogoGithub className="h-28 w-28 lg:h-48 lg:w-48" />
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
 </div>
);

const LandscapeCard = ({ project }: { project: Project }) => {
 const [isModalOpen, setIsModalOpen] = useState(false);

 if (project.isGithubCard) {
   return <LandscapeGithubCard project={project} />;
 }

 return (
   <div className="relative flex flex-col w-[60vw] max-w-3xl h-fit max-h-[90vh] bg-[#101328] rounded-lg border-2 border-[#222441] shadow-2xl overflow-hidden">
     <div className='flex items-center justify-between mx-3 my-1'>
       <h3 className="text-lg md:text-xl xl:text-2xl font-semibold text-[#97a1b8]">
         {project.title}
       </h3>
       <div className="flex items-center gap-4">
         <Link
           href={project.repoLink}
           target="_blank"
           className="transition-colors hover:text-[#b6c2de]"
         >
           <Github strokeWidth="1.5" className="[@media(max-height:400px)]:h-[18px] [@media(max-height:400px)]:w-[18px] w-5 h-5 lg:w-7 lg:h-7" />
         </Link>
         {project.videoUrl ? (
           <button
             onClick={() => setIsModalOpen(true)}
             className="transition-colors hover:text-[#b6c2de]"
           >
             <Youtube strokeWidth="1.5" className="[@media(max-height:400px)]:h-[18px] [@media(max-height:400px)]:w-[18px] w-5 h-5 lg:w-7 lg:h-7" />
           </button>
         ) : (
           project.liveLink && (
             <Link
               href={project.liveLink}
               target="_blank"
               className="p-1.5 lg:p-2 transition-colors hover:text-[#97a1b8]"
             >
               <ExternalLink strokeWidth="1.5" className="[@media(max-height:400px)]:h-[18px] [@media(max-height:400px)]:w-[18px] w-5 h-5 lg:w-7 lg:h-7" />
             </Link>
           )
         )}
       </div>
     </div>
     <div className="h-0.5 w-full self-center bg-[#222441]" />
     <div className="relative z-10 h-full w-full flex">
       <div className="relative mx-2 mt-2 flex-shrink-0 w-2/5 h-full">
         <ProjectImage project={project} />
       </div>
       <p className="mt-[2%] text-sm lg:text-base xl:text-lg text-balance text-[#81899c]">
         {project.description}
       </p>
       {project.videoUrl && (
         <YoutubeModal
           videoUrl={project.videoUrl}
           isOpen={isModalOpen}
           onClose={() => setIsModalOpen(false)}
         />
       )}
     </div>
     <div className="flex flex-wrap gap-1 lg:gap-2 [@media(max-height:400px)]:my-2 my-3 mx-2 items-center">
       {project.skills.map((skill, i) => (
         <span key={i} className="text-xs lg:text-sm">
           <div className="w-full rounded-full bg-gray-400 bg-opacity-10 px-2 xl:px-3 py-1 [@media(min-height:400px)]:py-1.5 [@media(min-height:400px)]:px-3 text-[#97a1b8] backdrop-blur-sm backdrop-filter">
             {skill}
           </div>
         </span>
       ))}
     </div>
   </div>
 );
};

const VerticalCard = ({ project }: { project: Project }) => {
 const [isModalOpen, setIsModalOpen] = useState(false);

 if (project.isGithubCard) {
   return <VerticalGithubCard project={project} />;
 }

 return (
   <div className="relative flex flex-col w-[50vw] max-w-2xl min-h-[50vh] h-fit max-h-[90vh] bg-[#101328] rounded-lg border-2 border-[#222441] shadow-2xl overflow-hidden">
     <div className="relative z-10 h-full w-full rounded-xl flex flex-col">
       <div className="relative mx-2 mt-2 flex-shrink-0">
         <ProjectImage project={project} />
       </div>
       <div className="flex flex-col px-4 flex-1 min-h-0 overflow-y-auto">
         <div className="flex items-center justify-between m-2">
           <h3 className="text-xl lg:text-2xl font-semibold text-[#97a1b8]">
             {project.title}
           </h3>
           <div className="flex items-center gap-4">
             <Link
               href={project.repoLink}
               target="_blank"
               className="transition-colors hover:text-[#b6c2de]"
             >
               <Github strokeWidth="1.5" className="w-5 h-5 lg:w-7 lg:h-7" />
             </Link>
             {project.videoUrl ? (
               <button
                 onClick={() => setIsModalOpen(true)}
                 className="transition-colors hover:text-[#b6c2de]"
               >
                 <Youtube strokeWidth="1.5" className="w-5 h-5 lg:w-7 lg:h-7" />
               </button>
             ) : (
               project.liveLink && (
                 <Link
                   href={project.liveLink}
                   target="_blank"
                   className="p-1.5 lg:p-2 transition-colors hover:text-[#97a1b8]"
                 >
                   <ExternalLink strokeWidth="1.5" className="w-5 h-5 lg:w-7 lg:h-7" />
                 </Link>
               )
             )}
           </div>
         </div>
         <div className="h-0.5 w-full self-center bg-[#222441]" />
         <p className="flex-1 my-4 mx-1 text-sm lg:text-base text-[#81899c]">
           {project.description}
         </p>
         <div className="flex flex-wrap gap-2 my-4 items-center">
           {project.skills.map((skill, i) => (
             <span key={i} className="text-xs lg:text-sm">
               <div className="w-full rounded-full bg-gray-400 bg-opacity-10 p-2 px-3 py-1.5 text-[#97a1b8] backdrop-blur-sm backdrop-filter">
                 {skill}
               </div>
             </span>
           ))}
         </div>
       </div>
       {project.videoUrl && (
         <YoutubeModal
           videoUrl={project.videoUrl}
           isOpen={isModalOpen}
           onClose={() => setIsModalOpen(false)}
         />
       )}
     </div>
   </div>
 );
};

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