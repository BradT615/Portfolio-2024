import React, { useEffect, useRef, useState } from 'react';

const ROWS = 15;
const ANIMATION_DURATION = 150;

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

const AnimatedInteractiveGrid = ({
  baseColor = 'rgb(31, 34, 60)',
  highlightColor = 'rgba(41, 196, 222, 0.4)',
  currentSection = 'hero',
  className = ''
}) => {
  const containerRef = useRef(null);
  const { position: mousePosition, isHovering } = useMousePosition(containerRef);
  const [cellSize, setCellSize] = useState(0);
  const [gridColumns, setGridColumns] = useState(ROWS);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [animationProgress, setAnimationProgress] = useState(0);

  const getAdjacentCells = (cellId: number, columns: number) => {
    return [
      cellId - columns,
      cellId + columns,
      cellId - 1,
      cellId + 1
    ].filter(id => {
      if (id < 0 || id >= ROWS * columns) return false;
      const currentRow = Math.floor(cellId / columns);
      const adjacentRow = Math.floor(id / columns);
      return Math.abs(currentRow - adjacentRow) <= 1;
    });
  };

  // Animation progress tracking
  useEffect(() => {
    const startTime = performance.now();
    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
      const progress = (elapsed % ANIMATION_DURATION) / ANIMATION_DURATION;
      setAnimationProgress(progress);
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Handle initial cell highlighting
  useEffect(() => {
    const sectionsX = 4;
    const sectionsY = 3;
    const totalHighlights = 60;
    const highlightedCells = new Set();
    
    const sectionWidth = Math.floor(gridColumns / sectionsX);
    const sectionHeight = Math.floor(ROWS / sectionsY);
    const highlightsPerSection = Math.floor(totalHighlights / (sectionsX * sectionsY));
    
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

  // Handle resize
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const newCellSize = Math.ceil(viewportHeight / ROWS);
      const columnsNeeded = Math.ceil(viewportWidth / newCellSize) + 1;
      
      setCellSize(newCellSize);
      setGridColumns(columnsNeeded);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Get the current gradient value based on section
  const gradientStart = currentSection === 'projects' ? '30%' : '10%';

  // Create grid rows with animation clone
  const createGridRows = (offset = 0) => {
    return Array.from({ length: ROWS }, (_, rowIndex) =>
      Array.from({ length: gridColumns }, (_, colIndex) => ({
        id: (rowIndex * gridColumns + colIndex + offset)
      }))
    );
  };




  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 flex items-center justify-center overflow-hidden ${className}`}
    >
      <style>
        {`
          .grid-container {
            display: flex;
            animation: slideLeft ${ANIMATION_DURATION}s linear infinite;
          }

          .grid-section {
            display: grid;
            grid-template-columns: repeat(${gridColumns}, ${cellSize}px);
            grid-template-rows: repeat(${ROWS}, ${cellSize}px);
            position: relative;
          }

          @keyframes slideLeft {
            from { transform: translateX(0); }
            to { transform: translateX(-${cellSize * gridColumns}px); }
          }

          .grid-cell {
            border-right: 1px solid ${baseColor};
            border-bottom: 1px solid ${baseColor};
            position: relative;
            width: ${cellSize}px;
            height: ${cellSize}px;
            transition: background-color 0.3s ease;
          }

          .grid-cell.highlighted {
            background: rgb(11, 13, 38);
          }

          .grid-section:last-child .grid-cell:nth-child(${gridColumns}n) {
            border-right: none;
          }

          .grid-cell:nth-child(n+${gridColumns * ROWS}) {
            border-bottom: none;
          }

          .mask-container {
            mask-image: 
              linear-gradient(to bottom, transparent, black 30%, black 70%, transparent),
              linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: 
              linear-gradient(to bottom, transparent, black 30%, black 70%, transparent),
              linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-composite: intersect;
            -webkit-mask-composite: source-in;
          }
        `}
      </style>

      <div className="mask-container w-full h-full">
        <div className="grid-container">
          {[0, 1].map((gridIndex) => (
            <div key={gridIndex} className="grid-section">
              {createGridRows(gridIndex * gridColumns * ROWS).map((row, rowIndex) =>
                row.map(({ id }, colIndex) => (
                  <div
                    key={`${gridIndex}-${rowIndex}-${colIndex}`}
                    className={`grid-cell ${highlightedCells.has(id % (gridColumns * ROWS)) ? 'highlighted' : ''}`}
                    data-cell-id={id}
                  />
                ))
              )}
            </div>
          ))}
        </div>

        <div 
          className="absolute inset-0 transition-opacity duration-600"
          style={{
            opacity: isHovering ? 1 : 0,
            backgroundImage: `
              linear-gradient(${highlightColor} 1px, transparent 1px),
              linear-gradient(90deg, ${highlightColor} 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundPosition: `${(-animationProgress * cellSize * gridColumns) - 2}px -1px`,
            maskImage: mousePosition ? `
              radial-gradient(circle ${cellSize * 1.5}px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent),
              linear-gradient(to bottom, transparent, black 30%, black 70%, transparent),
              linear-gradient(to right, transparent, black ${gradientStart}, black 90%, transparent)
            ` : '',
            WebkitMaskImage: mousePosition ? `
              radial-gradient(circle ${cellSize * 1.5}px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent),
              linear-gradient(to bottom, transparent, black 30%, black 70%, transparent),
              linear-gradient(to right, transparent, black ${gradientStart}, black 90%, transparent)
            ` : '',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
            mixBlendMode: 'lighten',
            zIndex: 10
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedInteractiveGrid;