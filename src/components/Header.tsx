import Link from 'next/link';
import { Logo } from '@/components/Logo';
import EmailModal from '@/components/ui/EmailModal';

export default function Header() {
  return (
    <header className='flex items-center h-16 px-6'>
      <div className='flex items-center justify-between w-full'>
        <Logo startColor="#f5f5f5" endColor="#f5f5f5" className="h-10 w-10"/>
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