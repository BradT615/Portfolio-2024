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
        viewBox="114.258 140.430 172.038 124.036"
        initial="hidden"
        animate="visible"
        onClick={handleClick}
      >
        <motion.path
          variants={pathVariants}
          d="M114.258 145.411 L114.258 264.466 142.334 264.395 
          C167.947 264.331,170.547 264.295,171.973 263.990 
          C172.832 263.805,174.063 263.565,174.707 263.456 
          C176.444 263.161,179.969 262.145,180.045 261.917 
          C180.081 261.808,180.336 261.719,180.610 261.719 
          C181.677 261.719,187.281 258.962,189.548 257.322 
          C204.689 246.370,209.788 228.218,202.126 212.552 
          C200.310 208.841,198.531 206.465,194.882 202.881 
          L191.949 200.000 194.882 197.119 
          C201.908 190.217,205.195 183.077,205.589 173.860 
          L205.724 170.703 193.705 170.703 
          L181.686 170.703 181.712 173.193 
          C181.798 181.390,177.291 186.367,168.491 187.794 
          C167.128 188.015,164.899 188.085,159.174 188.085 
          C152.681 188.086,151.590 188.128,151.215 188.390 
          L150.781 188.694 150.781 200.000 
          L150.781 211.306 151.215 211.610 
          C151.590 211.872,152.681 211.914,159.174 211.915 
          C168.716 211.916,171.157 212.275,174.896 214.227 
          C180.761 217.288,183.397 224.858,180.717 230.946 
          C178.631 235.685,174.701 238.360,168.457 239.289 
          C166.715 239.548,139.837 239.592,139.423 239.337 
          C139.332 239.281,139.258 223.749,139.258 204.822 
          L139.258 170.409 126.758 157.910 
          L114.258 145.411"
          fill="white"
          stroke="white"
          strokeWidth="2"
        />
        <motion.path
          variants={pathVariants}
          d="M119.239 140.430 L286.296 140.610 
          C286.260 140.709,280.899 146.070,274.384 152.524 
          L262.537 164.258 254.022 164.258 
          L245.508 164.258 245.508 214.355 
          L245.508 264.453 232.422 264.453 
          L219.336 264.453 219.336 214.355 
          L219.336 164.258 181.201 164.258 
          L143.065 164.258 131.152 152.344 
          L119.239 140.430"
          fill="white"
          stroke="white"
          strokeWidth="2"
        />
      </motion.svg>
    </AnimatePresence>
  );
};

export default Logo;