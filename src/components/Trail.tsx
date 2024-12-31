import React from 'react';

interface TrailProps {
  position: number;
  direction: 'top' | 'right' | 'bottom' | 'left';
  fixedPosition: number;
  gridSize: number;
}

export const Trail: React.FC<TrailProps> = ({
  position,
  direction,
  fixedPosition,
  gridSize
}) => {
  const isVertical = direction === 'top' || direction === 'bottom';
  const rectX = isVertical ? fixedPosition : position;
  const rectY = isVertical ? position : fixedPosition;
  const width = isVertical ? 0.5 : gridSize;
  const height = isVertical ? gridSize : 0.5;

  // Calculate gradient rotation and flip based on direction
  const getGradientSettings = () => {
    switch (direction) {
      case 'top': 
        return {
          rotation: 90,
          x1: "0%",
          y1: "100%",
          x2: "0%",
          y2: "0%"
        };
      case 'right':
        return {
          rotation: 0,
          x1: "0%",
          y1: "0%",
          x2: "100%",
          y2: "0%"
        };
      case 'bottom':
        return {
          rotation: 90,
          x1: "0%",
          y1: "0%",
          x2: "0%",
          y2: "100%"
        };
      case 'left':
        return {
          rotation: 0,
          x1: "100%",
          y1: "0%",
          x2: "0%",
          y2: "0%"
        };
      default:
        return {
          rotation: 0,
          x1: "0%",
          y1: "0%",
          x2: "100%",
          y2: "0%"
        };
    }
  };

  const gradientSettings = getGradientSettings();
  const gradientId = `trail-gradient-${direction}-${position}-${fixedPosition}`;
  
  return (
    <>
      <defs>
        <linearGradient 
          id={gradientId} 
          x1={gradientSettings.x1}
          y1={gradientSettings.y1}
          x2={gradientSettings.x2}
          y2={gradientSettings.y2}
        >
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
        </linearGradient>
      </defs>
      <rect
        x={rectX}
        y={rectY}
        width={width}
        height={height}
        fill={`url(#${gradientId})`}
      />
    </>
  );
};