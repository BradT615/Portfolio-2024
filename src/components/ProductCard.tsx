import React from 'react';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
  liveLink: string;
  repoLink: string;
  skills: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, imageUrl, liveLink, repoLink, skills }) => {
    return (
        <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all">
          <div className="h-[400px] overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-semibold">{title}</h3>
              <div className="flex gap-3">
                <Link 
                  href={repoLink} 
                  className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                  target="_blank"
                >
                  <Github size={24} />
                </Link>
                <Link 
                  href={liveLink} 
                  className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                  target="_blank"
                >
                  <ExternalLink size={24} />
                </Link>
              </div>
            </div>
            <p className="text-neutral-400 text-lg mb-6 leading-relaxed">{description}</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 text-sm bg-neutral-800 rounded-full text-neutral-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    export default ProductCard;