import Link from 'next/link';
import { Logo } from '@/components/Logo';
import EmailModal from '@/components/ui/EmailModal';
import { TextEffect } from './core/text-effect';

interface HeaderProps {
  currentSection?: 'hero' | 'projects';
}

export default function Header({ currentSection = 'hero' }: HeaderProps) {
  return (
    <header className='fixed w-full z-10'>
      <div className='flex items-center px-5 h-20 justify-between w-full'>
        <div className="flex items-center">
          <Logo startColor="#f5f5f5" endColor="#f5f5f5" className="h-12 w-12"/>

            {currentSection === 'projects' && (
              
                <TextEffect per='char' preset='fade' className="pl-4 text-3xl text-neutral-400 font-light tracking-wide">Projects</TextEffect>

            )}

        </div>
        <nav className='flex items-center text-lg'>
          <Link href='https://www.linkedin.com/in/bradt615/' className='nav-link' target="_blank">LinkedIn</Link>
          <span className="mx-6">/</span>
          <Link href='https://github.com/BradT615' className='nav-link' target="_blank">Github</Link>
          <span className="mx-6">/</span>
          <EmailModal />
        </nav>
      </div>
    </header>
  );
}