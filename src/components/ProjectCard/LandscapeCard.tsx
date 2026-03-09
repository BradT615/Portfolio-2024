import { useState } from 'react';
import Link from 'next/link';
import { Github, ExternalLink, Youtube } from 'lucide-react';
import YoutubeModal from '../YoutubeModal';
import ProjectImage from './ProjectImage';
import { LandscapeGithubCard } from './GithubCard';
import { Project } from './types';

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

export default LandscapeCard;
