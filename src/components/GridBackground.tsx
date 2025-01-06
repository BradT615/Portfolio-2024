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
  highlightColor = 'rgba(30, 234, 252, 0.4)',
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

  const getAdjacentCells = (cellId: number, columns: number) => {
    return [
      cellId - columns, // top
      cellId + columns, // bottom
      cellId - 1, // left
      cellId + 1  // right
    ].filter(id => {
      if (id < 0 || id >= ROWS * columns) return false;
      const currentRow = Math.floor(cellId / columns);
      const adjacentRow = Math.floor(id / columns);
      return Math.abs(currentRow - adjacentRow) <= 1;
    });
  };

  useEffect(() => {
    const sectionsX = 4;
    const sectionsY = 3;
    const totalHighlights = 60;
    const highlightedCells = new Set();
    
    // Calculate cells per section
    const sectionWidth = Math.floor(gridColumns / sectionsX);
    const sectionHeight = Math.floor(ROWS / sectionsY);
    const highlightsPerSection = Math.floor(totalHighlights / (sectionsX * sectionsY));
    
    // Distribute highlights across sections
    for (let sy = 0; sy < sectionsY; sy++) {
      for (let sx = 0; sx < sectionsX; sx++) {
        let attempts = 0;
        let sectionHighlights = 0;
        
        while (sectionHighlights < highlightsPerSection && attempts < 100) {
          const startX = sx * sectionWidth;
          const startY = sy * sectionHeight;
          const endX = startX + sectionWidth;
          const endY = startY + sectionHeight;
          
          const x = startX + Math.floor(Math.random() * (endX - startX));
          const y = startY + Math.floor(Math.random() * (endY - startY));
          const cellId = y * gridColumns + x;
          
          // Check if the cell or any orthogonally adjacent cells are already highlighted
          const adjacentCells = getAdjacentCells(cellId, gridColumns);
          const hasAdjacentHighlight = adjacentCells.some(id => highlightedCells.has(id));
          
          if (!highlightedCells.has(cellId) && !hasAdjacentHighlight) {
            highlightedCells.add(cellId);
            sectionHighlights++;
          }
          
          attempts++;
        }
      }
    }
    
    setHighlightedCells(highlightedCells);
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

      {FIXED_LINE_SEGMENTS.map((segment, index) => (
        <React.Fragment key={index}>
          <div
            className="absolute transition-opacity"
            style={{
              left: `calc(50% + ${segment.x * cellSize}px)`,
              top: `calc(50% + ${segment.y * cellSize}px)`,
              transform: 'translate(-50%, -50%)',
              width: '1px',
              height: `${cellSize * 2}px`,
              zIndex: 5,
              backgroundImage: 'linear-gradient(180deg, transparent 0%, rgba(30, 234, 252, 0.7) 50%, transparent 100%)',
              mixBlendMode: 'lighten',
              pointerEvents: 'none',
              animation: `pulse ${7 - index}s ease-in-out infinite`,
              animationDelay: `${ANIMATION_DELAYS[index]}s`
            }}
          />
          <div
            className="absolute transition-opacity"
            style={{
              left: `calc(50% + ${segment.x * cellSize}px)`,
              top: `calc(50% + ${segment.y * cellSize}px)`,
              transform: 'translate(-50%, -50%)',
              width: `${cellSize / 6}px`,
              height: '1px',
              zIndex: 5,
              backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(30, 234, 252, 0.4) 50%, transparent 100%)',
              mixBlendMode: 'lighten',
              pointerEvents: 'none',
              animation: `pulse ${7 - index}s ease-in-out infinite`,
              animationDelay: `${ANIMATION_DELAYS[index]}s`
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default GridBg;