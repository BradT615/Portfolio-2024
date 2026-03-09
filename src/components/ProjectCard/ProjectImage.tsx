import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import YoutubeModal from '../YoutubeModal';
import { Project } from './types';

const ProjectImage = ({ project }: { project: Project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageComponent = (
    <div className="relative group">
      <Image
        src={project.imageUrl!}
        alt={project.title}
        width={1920}
        height={1080}
        className="w-fit object-fit rounded-lg border-[1px] border-[#222441]"
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
    </div>
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

export default ProjectImage;
