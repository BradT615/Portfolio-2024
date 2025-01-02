import React, { useEffect, useRef, useState } from 'react';

interface GridPoint {
  x: number;
  y: number;
}

interface LineSegment {
  point: GridPoint;
}

interface GridBackgroundProps {
  gridSize?: number;
  baseColor?: string;
  highlightColor?: string;
  hoverRadius?: number;
  className?: string;
}

const FIXED_LINE_SEGMENTS: LineSegment[] = [
  { point: { x: -8.5, y: -2.5 } },
  { point: { x: 9.5, y: -3.5 } },
  { point: { x: 5.5, y: -1.5 } },
  { point: { x: -5.5, y: .5 } }
];

// Define different durations for each line segment
const ANIMATION_DURATIONS = [7, 5, 8, 4];

// Define animated cell positions (relative to center)
const ANIMATED_CELLS = [
  { x: -2.5, y: -2.5 },
  { x: 1.5, y: 0.5 },
  { x: -1.5, y: 2.5 },
  { x: 2.5, y: -1.5 },
  { x: -0.5, y: -0.5 },
  { x: -3.5, y: 1.5 }
];

const GridBackground: React.FC<GridBackgroundProps> = ({
  gridSize = 82,
  baseColor = 'rgba(255, 255, 255, 0.1)',
  highlightColor = 'rgba(255, 255, 255, 0.4)',
  hoverRadius = 120,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    const container = containerRef.current;
    const highlight = highlightRef.current;
    if (!container || !highlight) return;

    let rafId: number;
    
    const updateMousePosition = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        container.style.setProperty('--mouse-x', `${x}px`);
        container.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    const handleMouseEnter = () => {
      highlight.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      highlight.style.opacity = '0';
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 w-full h-full overflow-hidden ${className}`}
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px'
      } as React.CSSProperties}
    >
      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.9;
            }
            100% {
              opacity: 0.2;
            }
          }

          @keyframes cellGlow {
            0%, 100% {
              opacity: 0;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}
      </style>

      {/* Base grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${baseColor} 1px, transparent 1px),
            linear-gradient(90deg, ${baseColor} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: 'center center',
          maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
        }}
      />

      {/* Animated cells */}
      {ANIMATED_CELLS.map((cell, index) => (
        <div
          key={`cell-${index}`}
          className="absolute"
          style={{
            left: `calc(50% + ${cell.x * gridSize}px)`,
            top: `calc(50% + ${cell.y * gridSize}px)`,
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            animation: `cellGlow ${8 + index}s cubic-bezier(0.45, 0, 0.55, 1) infinite`,
            animationDelay: `${index * 0.7}s`,
            opacity: 0,
            zIndex: 2
          }}
        />
      ))}

      {/* Highlight grid */}
      <div 
        ref={highlightRef}
        className="absolute inset-0 transition-opacity duration-800"
        style={{
          opacity: 0,
          backgroundImage: `
            linear-gradient(${highlightColor} 1px, transparent 1px),
            linear-gradient(90deg, ${highlightColor} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: 'center center',
          maskImage: `
            radial-gradient(circle ${hoverRadius}px at var(--mouse-x) var(--mouse-y), black, transparent),
            linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)
          `,
          WebkitMaskImage: `
            radial-gradient(circle ${hoverRadius}px at var(--mouse-x) var(--mouse-y), black, transparent),
            linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)
          `,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
          mixBlendMode: 'lighten',
          zIndex: 10
        }}
      />

      {/* Fixed line segments */}
      {FIXED_LINE_SEGMENTS.map((segment, index) => (
        <div
          key={index}
          ref={el => {
            lineRefs.current[index] = el;
          }}
          className="absolute transition-opacity" 
          style={{
            left: `calc(50% + ${segment.point.x * gridSize}px)`,
            top: `calc(50% + ${segment.point.y * gridSize}px)`,
            transform: 'translate(-50%, -50%)',
            width: '0.5px',
            height: `${gridSize * 2}px`,
            zIndex: 5,
            backgroundImage: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)',
            mixBlendMode: 'lighten',
            pointerEvents: 'none',
            ...(mounted ? {
              animation: `pulse ${ANIMATION_DURATIONS[index]}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            } : {
              opacity: 0.2
            })
          }}
        />
      ))}
    </div>
  );
};

export default GridBackground;