'use client'

import Image from 'next/image';
import { projects } from '@/lib/projects';

interface Project {
  title: string;
  imageUrl?: string;
  repoLink: string;
  skills: string[];
}

export const ImagePreloader = () => {
  // Filter out projects without imageUrl and handle type safety
  const projectsWithImages = projects.filter((project): project is Project & { imageUrl: string } => {
    return Boolean(project.imageUrl);
  });

  return (
    <div className="hidden" aria-hidden="true">
      {projectsWithImages.map((project) => (
        <Image
          key={`preload-${project.title}`}
          src={project.imageUrl}
          alt={`Preload ${project.title}`}
          width={1920}
          height={1080}
          priority
          loading="eager"
          onError={(e) => {
            console.warn(`Failed to preload image for ${project.title}:`, e);
          }}
        />
      ))}
    </div>
  );
};

export default ImagePreloader;