// components/ImagePreloader.tsx
'use client'
import Image from 'next/image';
import { projects } from '@/lib/projects';

export const ImagePreloader = () => {
  return (
    <div className="hidden">
      {projects.map((project) => (
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