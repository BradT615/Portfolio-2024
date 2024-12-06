'use client';
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
};

export function Spotlight({ className, size = 800 }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left - size / 2,
        y: e.clientY - rect.top - size / 2
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseenter', handleMouseEnter);
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseenter', handleMouseEnter);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_100%)] blur-2xl',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: position.x,
        top: position.y,
        transition: 'opacity 0.2s'
      }}
    />
  );
}