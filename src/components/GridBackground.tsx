import React, { useEffect, useRef } from 'react';

interface GridBackgroundProps {
  gridSize?: number;
  baseColor?: string;
  highlightColor?: string;
  hoverRadius?: number;
  className?: string;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
  gridSize = 82,
  baseColor = 'rgba(255, 255, 255, 0.1)',
  highlightColor = 'rgba(255, 255, 255, 0.4)',
  hoverRadius = 120,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  
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
      className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px'
      } as React.CSSProperties}
    >
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

      {/* Highlight grid */}
      <div 
        ref={highlightRef}
        className="absolute inset-0 transition-opacity duration-200"
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
        }}
      />
    </div>
  );
};

export default GridBackground;