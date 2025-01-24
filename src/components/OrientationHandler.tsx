'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface OrientationHandlerProps {
  isProjectSection: boolean;
  onNavigateToHero?: () => void;
}

const OrientationHandler: React.FC<OrientationHandlerProps> = ({ 
  isProjectSection, 
  onNavigateToHero 
}) => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  if (!isProjectSection || !isPortrait) return null;

  return (
    <div className="fixed inset-0 bg-[#080b23] z-40 flex flex-col items-center justify-center">
      <button 
        onClick={onNavigateToHero}
        className="absolute top-20 sm:top-24 left-4 flex"
      >
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4 text-white" />
          <span className="text-white">Return Home</span>
        </div>
      </button>
      <div className="text-center px-6">
        <div className="pb-2">
          <DotLottieReact
            src="https://lottie.host/0e3abd83-b8c1-4808-b5ed-07d74ed9d61e/4EkGTNq1w7.lottie"
            loop
            autoplay
          />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">Please Rotate Your Device</h2>
        <p className="text-gray-300">For the best experience, please view this section in landscape mode.</p>
      </div>
    </div>
  );
};

export default OrientationHandler;