import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { Trail } from './Trail';
import { useTrails } from './UseTrails';

interface InteractiveGridProps {
  children?: ReactNode;
  gridSize?: number;
  baseColor?: string;
  highlightColor?: string;
  hoverRadius?: number;
  maxTrails?: number;
}

const InteractiveGrid = ({
  children,
  gridSize = 75,
  baseColor = 'rgba(255, 255, 255, 0.1)',
  highlightColor = 'rgba(255, 255, 255, 0.4)',
  hoverRadius = 120,
  maxTrails = 8
}: InteractiveGridProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInView, setIsMouseInView] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const trails = useTrails({ dimensions, gridSize, maxTrails });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const scale = window.visualViewport?.scale || 1;
        // Use layout viewport dimensions
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width * scale,
          height: rect.height * scale
        });
      }
    };

    // Initial update
    updateDimensions();

    // Listen for both resize and scroll (which includes zoom)
    window.visualViewport?.addEventListener('resize', updateDimensions);
    window.visualViewport?.addEventListener('scroll', updateDimensions);
    
    // Fallback for browsers without VisualViewport API
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('scroll', updateDimensions);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateDimensions);
      window.visualViewport?.removeEventListener('scroll', updateDimensions);
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', updateDimensions);
    };
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsMouseInView(
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
      }
    };

    const handleGlobalMouseLeave = () => {
      setIsMouseInView(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ 
          transform: `scale(${1/(window.visualViewport?.scale || 1)})`,
          transformOrigin: 'top left'
        }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMinYMin meet"
      >
        <defs>
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
              strokeWidth="1"
            />
          </pattern>

          <radialGradient id="hover-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="fade-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="white" />
            <stop offset="80%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <mask id="fade-mask">
            <rect width="100%" height="100%" fill="url(#fade-gradient)" />
          </mask>

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

        <g mask="url(#fade-mask)">
          <rect 
            width="100%" 
            height="100%" 
            fill="url(#grid)" 
          />

          <g mask="url(#hover-mask)">
            <rect
              width="100%"
              height="100%"
              fill="url(#highlight-grid)"
              className="mix-blend-lighten"
            />
          </g>

          {trails.map(trail => (
            trail.active && (
              <Trail
                key={trail.id}
                {...trail}
                gridSize={gridSize}
              />
            )
          ))}
        </g>
        {children}
      </svg>
    </div>
  );
};

export default InteractiveGrid;