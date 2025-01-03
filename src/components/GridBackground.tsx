import React, { useEffect, useRef, useState } from 'react';

const FIXED_LINE_SEGMENTS = [
  { x: -10.5, y: -3.5 },
  { x: 9.5, y: -4.5 },
  { x: 5.5, y: -1.5 },
  { x: -5.5, y: 0.5 }
];

const ANIMATION_DELAYS = [0, 0.7, 1.4, 2.1];

const ROWS = 15;

// Custom hook to track mouse position relative to a container
const useMousePosition = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isWithinBounds, setIsWithinBounds] = useState(false);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      
      const withinBounds = 
        x >= 0 && 
        x <= rect.width && 
        y >= 0 && 
        y <= rect.height;

      setIsWithinBounds(withinBounds);
      if (withinBounds) {
        setMousePosition({ x, y });
      }
    };

    const handleMouseLeave = () => {
      setIsWithinBounds(false);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef]);

  return { position: mousePosition, isHovering: isWithinBounds };
};

const GridBg = ({
  baseColor = 'rgba(255, 255, 255, 0.1)',
  highlightColor = 'rgba(255, 255, 255, 0.4)',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { position: mousePosition, isHovering } = useMousePosition(containerRef);
  const [cellSize, setCellSize] = useState(0);
  const [gridColumns, setGridColumns] = useState(ROWS);
  const [highlightedCells, setHighlightedCells] = useState(new Set());

  // Create a grid array that covers the full viewport
  const rows = Array.from({ length: ROWS }, (_, rowIndex) =>
    Array.from({ length: gridColumns }, (_, colIndex) => ({
      id: rowIndex * gridColumns + colIndex
    }))
  );

  useEffect(() => {
    // Select 30 random cells
    const totalCells = ROWS * gridColumns;
    const randomCells = new Set();
    
    while (randomCells.size < 30) {
      const randomCell = Math.floor(Math.random() * totalCells);
      randomCells.add(randomCell);
    }
    
    setHighlightedCells(randomCells);
  }, [gridColumns]);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const newCellSize = Math.ceil(viewportHeight / ROWS);
      const columnsNeeded = Math.ceil(viewportWidth / newCellSize);
      
      setCellSize(newCellSize);
      setGridColumns(columnsNeeded);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none ${className}`}
    >
      <style>
        {`
          .grid-container {
            display: grid;
            grid-template-columns: repeat(${gridColumns}, ${cellSize}px);
            grid-template-rows: repeat(${ROWS}, ${cellSize}px);
            position: relative;
            mask-image: 
              linear-gradient(to bottom, transparent, black 30%, black 70%, transparent),
              linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: 
              linear-gradient(to bottom, transparent, black 30%, black 70%, transparent),
              linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-composite: intersect;
            -webkit-mask-composite: source-in;
          }

          .grid-cell {
            border-right: 1px solid ${baseColor};
            border-bottom: 1px solid ${baseColor};
            position: relative;
            width: ${cellSize}px;
            height: ${cellSize}px;
          }

          .grid-cell.highlighted {
            background: rgba(255, 255, 255, 0.01);
          }

          .grid-cell:nth-child(${gridColumns}n) {
            border-right: none;
          }

          .grid-cell:nth-child(n+${gridColumns * ROWS}) {
            border-bottom: none;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.9; }
          }
        `}
      </style>

      {/* Main Grid */}
      <div className="grid-container">
        {rows.map((row, rowIndex) =>
          row.map(({ id }, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-cell ${highlightedCells.has(id) ? 'highlighted' : ''}`}
              data-cell-id={id}
            />
          ))
        )}
      </div>

      {/* Highlight Layer */}
      <div 
        className="absolute inset-0 transition-opacity duration-600"
        style={{
          opacity: isHovering ? 1 : 0,
          backgroundImage: `
            linear-gradient(${highlightColor} 1px, transparent 1px),
            linear-gradient(90deg, ${highlightColor} 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          backgroundPosition: 'center center',
          maskImage: mousePosition ? `
            radial-gradient(circle ${cellSize * 1.5}px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent),
            linear-gradient(to bottom, transparent, black 30%, black 70%, transparent),
            linear-gradient(to right, transparent, black 10%, black 90%, transparent)
          ` : '',
          WebkitMaskImage: mousePosition ? `
            radial-gradient(circle ${cellSize * 1.5}px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent),
            linear-gradient(to bottom, transparent, black 30%, black 70%, transparent),
            linear-gradient(to right, transparent, black 10%, black 90%, transparent)
          ` : '',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
          mixBlendMode: 'lighten',
          zIndex: 10
        }}
      />

      {/* Fixed Line Segments */}
      {FIXED_LINE_SEGMENTS.map((segment, index) => (
        <div
          key={index}
          className="absolute transition-opacity"
          style={{
            left: `calc(50% + ${segment.x * cellSize}px)`,
            top: `calc(50% + ${segment.y * cellSize}px)`,
            transform: 'translate(-50%, -50%)',
            width: '1px',
            height: `${cellSize * 2}px`,
            zIndex: 5,
            backgroundImage: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)',
            mixBlendMode: 'lighten',
            pointerEvents: 'none',
            animation: `pulse ${7 - index}s ease-in-out infinite`,
            animationDelay: `${ANIMATION_DELAYS[index]}s`
          }}
        />
      ))}
    </div>
  );
};

export default GridBg;