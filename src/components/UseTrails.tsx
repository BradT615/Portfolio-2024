import { useState, useCallback, useEffect, useRef } from 'react';

interface Trail {
  id: number;
  position: number;
  direction: 'top' | 'right' | 'bottom' | 'left';
  fixedPosition: number;
  active: boolean;
  startDelay: number;
  elapsedTime: number;
}

interface UseTrailsProps {
  dimensions: { width: number; height: number };
  gridSize: number;
  maxTrails: number;
}

export const useTrails = ({ dimensions, gridSize, maxTrails }: UseTrailsProps) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const occupiedLines = useRef<Set<number>>(new Set());
  const initializedRef = useRef(false);
  const pendingTrailsRef = useRef(maxTrails);

  const getAvailableLine = useCallback((isVertical: boolean) => {
    const size = isVertical ? dimensions.width : dimensions.height;
    const numLines = Math.floor(size / gridSize);
    
    const bufferZoneStart = gridSize;
    const bufferZoneEnd = (numLines - 1) * gridSize;
    
    const hasNearbyOccupied = (pos: number) => {
      for (let i = -1; i <= 1; i++) {
        const neighborPos = pos + (i * gridSize);
        if (occupiedLines.current.has(neighborPos)) {
          return true;
        }
      }
      return false;
    };

    const availableLines = Array.from({ length: numLines }, (_, i) => i * gridSize)
      .filter(pos => 
        pos >= bufferZoneStart && 
        pos <= bufferZoneEnd && 
        !occupiedLines.current.has(pos) && 
        !hasNearbyOccupied(pos)
      );
    
    if (availableLines.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableLines.length);
    return availableLines[randomIndex];
  }, [dimensions, gridSize]);

  const createNewTrail = useCallback((id: number, isInitial: boolean = false) => {
    const directions: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    const isVertical = direction === 'top' || direction === 'bottom';
    const fixedPosition = getAvailableLine(isVertical);
    
    if (fixedPosition === null) return null;
    
    occupiedLines.current.add(fixedPosition);
    
    // For each direction, set where the trail starts
    let initialPosition;
    switch (direction) {
      case 'top':
        initialPosition = dimensions.height; // Start at bottom, will move up
        break;
      case 'right':
        initialPosition = 0; // Start at left edge, will move right
        break;
      case 'bottom':
        initialPosition = 0; // Start at top edge, will move down
        break;
      case 'left':
        initialPosition = dimensions.width; // Start at right edge, will move left
        break;
      default:
        initialPosition = 0;
    }
    
    const baseDelay = isInitial ? 200 : 0;
    const staggerDelay = isInitial 
      ? baseDelay + (id * 200) + (Math.random() * 100)
      : baseDelay + (Math.random() * 200);
    
    return {
      id,
      position: initialPosition,
      direction,
      fixedPosition,
      active: false,
      startDelay: staggerDelay,
      elapsedTime: 0
    };
  }, [getAvailableLine, gridSize, dimensions]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || initializedRef.current) return;

    const initialTrails: Trail[] = [];
    pendingTrailsRef.current = maxTrails;

    for (let i = 0; i < maxTrails; i++) {
      const trail = createNewTrail(i, true);
      if (trail) {
        initialTrails.push(trail);
        pendingTrailsRef.current--;
      }
    }

    if (initialTrails.length > 0) {
      setTrails(initialTrails);
      initializedRef.current = true;
    }
    
    return () => {
      occupiedLines.current.clear();
      initializedRef.current = false;
      pendingTrailsRef.current = maxTrails;
    };
  }, [dimensions, maxTrails, createNewTrail]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(currentTrails => {
        let updatedTrails = [...currentTrails];
        
        while (updatedTrails.length < maxTrails && pendingTrailsRef.current > 0) {
          const newTrail = createNewTrail(updatedTrails.length, false);
          if (newTrail) {
            updatedTrails.push(newTrail);
            pendingTrailsRef.current--;
          } else {
            break;
          }
        }

        return updatedTrails.map(trail => {
          const newElapsedTime = trail.elapsedTime + 50;
          
          if (!trail.active && newElapsedTime >= trail.startDelay) {
            return { ...trail, active: true, elapsedTime: newElapsedTime };
          }
          
          if (trail.active) {
            const speed = 1.5;
            let newPosition;
            
            // Update position based on direction
            switch (trail.direction) {
              case 'top':
                newPosition = trail.position - speed; // Move up by decreasing Y
                break;
              case 'right':
                newPosition = trail.position + speed; // Move right by increasing X
                break;
              case 'bottom':
                newPosition = trail.position + speed; // Move down by increasing Y
                break;
              case 'left':
                newPosition = trail.position - speed; // Move left by decreasing X
                break;
              default:
                newPosition = trail.position;
            }
            
            // Check if trail has reached the end of its path
            let hasReachedEnd = false;
            switch (trail.direction) {
              case 'top':
                hasReachedEnd = newPosition <= 0; // Reached top edge
                break;
              case 'right':
                hasReachedEnd = newPosition >= dimensions.width; // Reached right edge
                break;
              case 'bottom':
                hasReachedEnd = newPosition >= dimensions.height; // Reached bottom edge
                break;
              case 'left':
                hasReachedEnd = newPosition <= 0; // Reached left edge
                break;
            }
            
            if (hasReachedEnd) {
              occupiedLines.current.delete(trail.fixedPosition);
              pendingTrailsRef.current++;
              const newTrail = createNewTrail(trail.id, false);
              return newTrail || trail;
            }
            
            return { ...trail, position: newPosition, elapsedTime: newElapsedTime };
          }
          
          return { ...trail, elapsedTime: newElapsedTime };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [dimensions, createNewTrail, maxTrails, gridSize]);

  return trails;
};