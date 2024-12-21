import Link from 'next/link';
import { Logo } from '@/components/Logo';
import EmailModal from '@/components/ui/EmailModal';
import { TextEffect } from './core/text-effect';
import { motion } from 'framer-motion';

interface HeaderProps {
  currentSection?: 'hero' | 'projects';
}

export default function Header({ currentSection = 'hero' }: HeaderProps) {
  return (
    <motion.header 
      className='fixed w-full z-10'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex items-center px-5 h-20 justify-between w-full'>
        <div className="flex items-center">
          <Logo className="h-12 w-12" />

          {currentSection === 'projects' && (
            <TextEffect 
              per='char' 
              preset='fade' 
              className="pl-4 text-3xl text-neutral-400 font-light tracking-wide"
            >
              Projects
            </TextEffect>
          )}
        </div>

        <nav className='flex items-center text-lg'>
          <Link 
            href='https://www.linkedin.com/in/bradt615/' 
            className='nav-link hover:text-neutral-300 transition-colors' 
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Link>
          <span className="mx-6 text-neutral-400">/</span>
          <Link 
            href='https://github.com/BradT615' 
            className='nav-link hover:text-neutral-300 transition-colors' 
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </Link>
          <span className="mx-6 text-neutral-400">/</span>
          <EmailModal />
        </nav>
      </div>
    </motion.header>
  );
}