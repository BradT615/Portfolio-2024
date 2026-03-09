import { useState, useEffect, RefObject } from 'react';

export const useMousePosition = (containerRef: RefObject<HTMLDivElement>) => {
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
