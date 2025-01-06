// components/YoutubeModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface YoutubeModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const YoutubeModal: React.FC<YoutubeModalProps> = ({ videoUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      <div className="relative w-full max-w-7xl mx-4 bg-neutral-900 rounded-xl overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors z-10"
        >
          <X size={24} />
        </button>
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={videoUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default YoutubeModal;