import React, { useEffect, useRef, useState } from 'react';

interface GridPoint {
  x: number;
  y: number;
}

interface LineSegment {
  point: GridPoint;
  isVertical: boolean;
  region: 'left' | 'right' | 'top';
}

interface GridBackgroundProps {
  gridSize?: number;
  baseColor?: string;
  highlightColor?: string;
  hoverRadius?: number;
  className?: string;
}

interface Region {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  count: number;
  required: number;
}

const regions = {
  left: {
    minX: -11,
    maxX: -6,
    minY: -4,
    maxY: 4,
    count: 0,
    required: 2
  },
  right: {
    minX: 6,
    maxX: 11,
    minY: -4,
    maxY: 4,
    count: 0,
    required: 2
  },
  top: {
    minX: -5,
    maxX: 5,
    minY: -4,
    maxY: -3,
    count: 0,
    required: 1
  }
};

function generateRandomIntersectionPoints(seed: number): LineSegment[] {
  const localRegions = JSON.parse(JSON.stringify(regions));
  
  // Implement a simple seeded random number generator
  let currentSeed = seed;
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  const points: LineSegment[] = [];
  const usedX = new Set<number>();
  const usedY = new Set<number>();
  
  const hasConflict = (x: number, y: number): boolean => {
    return usedX.has(x) || usedY.has(y);
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(seededRandom() * (max - min + 1)) + min;
  };

  // Try to generate points with a fixed number of attempts
  for (let attempts = 0; attempts < 500 && points.length < 5; attempts++) {
    const availableRegions = (Object.entries(localRegions) as [keyof typeof regions, Region][])
      .filter(([, config]) => config.count < config.required)
      .map(([name]) => name);
    
    if (availableRegions.length === 0) break;
    
    const regionName = availableRegions[Math.floor(seededRandom() * availableRegions.length)] as keyof typeof regions;
    const region = localRegions[regionName];
    
    const x = getRandomInt(region.minX, region.maxX);
    const y = getRandomInt(region.minY, region.maxY);
    
    if (!hasConflict(x, y)) {
      usedX.add(x);
      usedY.add(y);
      region.count++;
      
      points.push({
        point: {
          x: x - 0.5,
          y: y - 0.5
        },
        isVertical: seededRandom() < 0.5,
        region: regionName
      });
    }
  }

  return points;
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
  
  // Use state for line segments, initialized with null
  const [lineSegments, setLineSegments] = useState<LineSegment[] | null>(null);

  useEffect(() => {
    // Generate line segments only on the client side
    setLineSegments(generateRandomIntersectionPoints(Date.now()));
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

      {/* Line segments - only render when available */}
      {lineSegments?.map((segment, index) => (
        <div
          key={index}
          className="absolute" 
          style={{
            left: `calc(50% + ${segment.point.x * gridSize}px)`,
            top: `calc(50% + ${segment.point.y * gridSize}px)`,
            transform: 'translate(-50%, -50%)',
            width: segment.isVertical ? '0.5px' : `${gridSize * 2}px`,
            height: segment.isVertical ? `${gridSize * 2}px` : '0.5px',
            zIndex: 5,
            backgroundImage: segment.isVertical
              ? 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
            mixBlendMode: 'lighten',
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  );
};

export default GridBackground;