import { useState } from 'react';
import Link from 'next/link';
import { Github, ExternalLink, Youtube } from 'lucide-react';
import YoutubeModal from '../YoutubeModal';
import ProjectImage from './ProjectImage';
import { VerticalGithubCard } from './GithubCard';
import { Project } from './types';

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

export default VerticalCard;
