import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Logo = ({ className = '' }) => {
  const [key, setKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const pathVariants = {
    hidden: { 
      pathLength: 0,
      fill: 'rgba(255, 255, 255, 0)'
    },
    visible: {
      pathLength: 1,
      fill: 'rgba(255, 255, 255, 1)',
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut" },
        fill: { duration: 0.6, delay: 1.4 }
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2100); // Match total animation duration (1.5s path + 0.6s fill)

    return () => clearTimeout(timer);
  }, [key]);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setKey(prev => prev + 1);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.svg
        key={key}
        className={`${className} ${isAnimating ? 'cursor-default' : 'cursor-pointer'}`}
        xmlns="http://www.w3.org/2000/svg"
        width="160"
        height="160"
        viewBox="109 135 182 135"
        initial="hidden"
        animate="visible"
        onClick={handleClick}
      >
        <motion.path
          variants={pathVariants}
          d="M 114.258 145.411
          L 114.258 263.990
          L 171.973 263.990
          C 180.000 263.990 187.281 258.962 189.548 257.322
          C 204.689 246.370 209.788 228.218 202.126 212.552
          C 200.310 208.841 198.531 206.465 194.882 202.881
          L 191.949 200.000
          L 194.882 197.119
          C 201.908 190.217 205.195 183.077 205.589 173.860
          L 205.724 170.703
          L 181.686 170.703
          L 181.712 173.193 
          C 181.798 181.390 177.291 186.367 168.491 187.794
          C 167.128 188.015 164.899 188.085 159.174 188.085
          L 151.215 188.085
          L 151.215 211.915
          L 159.174 211.915
          C 168.716 211.916 171.157 212.275 174.896 214.227
          C 180.761 217.288 183.397 224.858 180.717 230.946
          C 178.631 235.685 174.701 238.360 168.457 239.289
          C 166.715 239.548 139.258 239.592 139.258 239.592
          L 139.258 170.409
          L 114.258 145.411
          Z"
          fill="transparent" 
          stroke="white"
          strokeWidth="2"
        />
        <motion.path
          variants={pathVariants}
          d="M 119.239 140.430
          L 119.239 140.430
          L 286.296 140.430
          L 262.537 164.258
          L 245.508 164.258
          L 245.508 264.453
          L 219.336 264.453
          L 219.336 164.258
          L 143.065 164.258
          Z"
          fill="none" 
          stroke="white"
          strokeWidth="2"
        />
      </motion.svg>
    </AnimatePresence>
  );
};

export default Logo;