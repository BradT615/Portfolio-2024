import React, { useEffect, useState } from 'react';

interface YoutubeModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const YoutubeModal: React.FC<YoutubeModalProps> = ({ videoUrl, isOpen, onClose }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 32; // 16px padding on each side
      const maxWidth = viewportWidth - padding * 2;
      const maxHeight = viewportHeight - padding * 2;
      const aspectRatio = 16 / 9;

      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      setDimensions({ width, height });
    };

    if (isOpen) {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        className="relative bg-neutral-900 shadow-xl overflow-hidden"
      >
        <iframe
          className="w-full h-full"
          src={videoUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default YoutubeModal;