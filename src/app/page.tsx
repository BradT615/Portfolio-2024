'use client'
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { SkillsTree } from '@/components/SkillsTree';
import ProjectSection from '@/components/ProjectSection';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div className="flex flex-col h-screen text-neutral-300">
      <header className='fixed top-0 left-0 right-0 z-50 flex items-center w-full h-16 px-6 bg-neutral-800/80 backdrop-blur-sm border-b border-neutral-800'>
        <div className='flex items-center justify-between w-full'>
          <Logo startColor="#f5f5f5" endColor="#f5f5f5" className="h-10 w-10"/>
          <nav className='flex items-center text-lg'>
              <Link href='https://www.linkedin.com/in/bradt615/' className='nav-link hover:text-neutral-400 transition-colors' target="_blank">LinkedIn</Link>
              <span className="mx-6">/</span>
              <Link href='https://github.com/BradT615' className='nav-link hover:text-neutral-400 transition-colors' target="_blank">Github</Link>
              <span className="mx-6">/</span>
              <a href='#' className='nav-link hover:text-neutral-400 transition-colors'>Email</a>
          </nav>
        </div>
      </header>

      <div className="h-16" />

      <div className="flex flex-1 overflow-hidden">
        <aside className="fixed top-16 left-0 bottom-0 w-80 select-none overflow-hidden">
          <SkillsTree />
        </aside>

        <main className='flex-1 ml-80 h-full overflow-y-auto custom-scrollbar'>
          <HeroSection />
          <div id="projects" className="h-screen bg-neutral-900">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-semibold mb-12">Projects</h2>
                <ProjectSection />
              </div>
          </div>
        </main>
      </div>
    </div>
  );
}