import React, { useState, useCallback, ReactNode } from 'react';

interface InteractiveGridProps {
  children?: ReactNode;
  gridSize?: number;
  baseColor?: string;
  highlightColor?: string;
  hoverRadius?: number;
}

const InteractiveGrid = ({
  children,
  gridSize = 75,
  baseColor = 'rgba(255, 255, 255, 0.1)',
  highlightColor = 'rgba(255, 255, 255, 0.4)',
  hoverRadius = 100
}: InteractiveGridProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInView, setIsMouseInView] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
    setIsMouseInView(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseInView(false);
  }, []);

  // Add global mouse event handlers to track mouse position everywhere
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      setIsMouseInView(true);
    };

    const handleGlobalMouseLeave = () => {
      setIsMouseInView(false);
    };

    // Add event listeners to window
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {/* Base grid pattern */}
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={baseColor}
              strokeWidth="1"
            />
          </pattern>

          {/* Highlight pattern */}
          <pattern
            id="highlight-grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={highlightColor}
              strokeWidth="1.5"
            />
          </pattern>

          {/* Radial gradient for hover effect */}
          <radialGradient id="hover-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Top and bottom fade gradients */}
          <linearGradient id="fade-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="white" />
            <stop offset="80%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Fade mask */}
          <mask id="fade-mask">
            <rect width="100%" height="100%" fill="url(#fade-gradient)" />
          </mask>

          {/* Hover mask */}
          <mask id="hover-mask">
            <rect width="100%" height="100%" fill="black" />
            {isMouseInView && (
              <circle
                cx={mousePosition.x}
                cy={mousePosition.y}
                r={hoverRadius}
                fill="url(#hover-gradient)"
              />
            )}
          </mask>
        </defs>

        {/* Base grid with fade mask */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#grid)" 
          mask="url(#fade-mask)"
        />

        {/* Highlight grid with hover and fade masks */}
        <g mask="url(#fade-mask)">
          <rect
            width="100%"
            height="100%"
            fill="url(#highlight-grid)"
            mask="url(#hover-mask)"
            className="mix-blend-lighten"
          />
        </g>
      </svg>
      {children}
    </div>
  );
};

export default InteractiveGrid;