'use client'

import Image from 'next/image';
import { projects } from '@/lib/projects';

export const ImagePreloader = () => {
  // Filter out projects that don't have an imageUrl
  const projectsWithImages = projects.filter(
    (project): project is typeof project & { imageUrl: string } => 
    typeof project.imageUrl === 'string' && project.imageUrl !== ''
  );

  return (
    <div className="hidden">
      {projectsWithImages.map((project) => (
        <Image
          key={project.title}
          src={project.imageUrl}
          alt={project.title}
          width={500}
          height={300}
          priority
        />
      ))}
    </div>
  );
};