'use client'
import Header from './components/Header';
import HeroSection from './components/Hero';

export default function Home() {
    return (
      <div className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 flex items-center w-full mx-auto max-w-[2000px]">
            <HeroSection />
        </main>
      </div>
    );
  }