'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import EmailModal from '@/components/ui/EmailModal';
import { motion } from 'framer-motion';
import { TextEffect } from '@/components/core/text-effect';

export default function Header() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  const logoSize = animationComplete ? 'h-12 w-12' : 'h-52 w-52';

  return (
    <>
      <motion.div 
        className="fixed z-40"
        initial={{ 
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={animationComplete ? { 
          left: "16px",
          top: "16px",
          x: "0%",
          y: "0%",
        } : {}}
        transition={{
          duration: 1,
          ease: [0.25, 0.1, 0.6, 1]
        }}
      >
        <Logo className={`${logoSize} -mt-1 transition-all duration-1000 ease-out delay-100`} />
      </motion.div>

      <motion.header 
        className="w-full z-40 h-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center px-4 h-full w-full text-[#97a1b8]">
          <div className={`${animationComplete ? 'h-12 w-12' : 'h-32 w-32'}`} />
          
          <motion.nav 
            className="flex items-center text-lg ml-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              href="https://www.linkedin.com/in/bradt615/" 
              className="nav-link hover:text-white transition-colors pointer-events-auto" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <TextEffect
                per="char"
                preset="fade"
                trigger={animationComplete}
                delay={0.5}
              >
                LinkedIn
              </TextEffect>
            </Link>
            <motion.span 
              className="mx-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationComplete ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            >
              /
            </motion.span>
            <Link 
              href="https://github.com/BradT615" 
              className="nav-link hover:text-white transition-colors pointer-events-auto" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <TextEffect
                per="char"
                preset="fade"
                trigger={animationComplete}
                delay={1}
              >
                Github
              </TextEffect>
            </Link>
            <motion.span 
              className="mx-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationComplete ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 1.5 }}
            >
              /
            </motion.span>
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="nav-link hover:text-white transition-colors pointer-events-auto"
            >
              <TextEffect
                per="char"
                preset="fade"
                trigger={animationComplete}
                delay={1.3}
              >
                Email
              </TextEffect>
            </button>
          </motion.nav>
        </div>
      </motion.header>

      <EmailModal 
        open={isEmailModalOpen} 
        onOpenChange={setIsEmailModalOpen}
      />
    </>
  );
}