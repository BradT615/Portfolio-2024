import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen bg-neutral-900 text-neutral-100">
      <header className='flex justify-between items-center w-full max-w-screen-2xl mx-auto p-6 border-b-2 border-neutral-800'>
        <Logo 
          startColor="#f5f5f5" 
          endColor="#f5f5f5" 
          className="h-12"
        />
        <nav className='flex gap-2 items-center text-neutral-300 text-lg'>
          <Link href='https://www.linkedin.com/in/bradt615/' className='nav-link' target="_blank">LinkedIn</Link>
          /
          <Link href='https://github.com/BradT615' className='nav-link' target="_blank">Github</Link>
          /
          <a href='#' className='nav-link'>Email</a>
        </nav>
      </header>
      <main className='flex flex-col items-center justify-center w-full h-fit'>
        <Logo 
          startColor="#f5f5f5" 
          endColor="#f5f5f5" 
          className=""
        />
        <h1 className='text-2xl'>Brad Titus</h1>
        <p className=' text-lg'>Software Engineer</p>
      </main>
    </div>
  );
}