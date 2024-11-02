import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { SkillsTree } from '@/components/SkillsTree';

export default function Home() {
  return (
    <div className="flex flex-col w-full max-w-screen-2xl h-full mx-auto text-neutral-300">
      <header className='flex justify-between items-center w-full p-5 border-b-2 border-neutral-800'>
        <Logo 
          startColor="#f5f5f5" 
          endColor="#f5f5f5" 
          className="h-8"
        />
        <nav className='flex items-center text-lg'>
          <Link href='https://www.linkedin.com/in/bradt615/' className='nav-link' target="_blank">LinkedIn</Link>
          <span className="mx-6">/</span>
          <Link href='https://github.com/BradT615' className='nav-link' target="_blank">Github</Link>
          <span className="mx-6">/</span>
          <a href='#' className='nav-link'>Email</a>
        </nav>
      </header>

      <main className='flex flex-col flex-1 w-full p-6'>
        <section className='flex flex-col items-center mb-12'>
          <h1 className='text-4xl font-bold mb-2'>Brad Titus</h1>
          <p className='text-xl text-neutral-400'>Software Engineer</p>
          <button className='mt-4 px-4 py-2 text-lg font-semibold text-neutral-900 bg-neutral-300 rounded-lg'>Resume</button>
        </section>
        
        <section className='grid grid-cols-2 gap-8'>
          <div className='flex flex-col items-center p-4 border-2 border-neutral-800 rounded-lg'>
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <SkillsTree />
          </div>
          <div className='flex flex-col items-center p-4 border-2 border-neutral-800 rounded-lg'>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            {/* Projects content */}
          </div>
        </section>
      </main>
    </div>
  );
}