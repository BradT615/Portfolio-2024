'use client'
import { useState } from 'react';
import GridBackground from '@/components/GridBackground';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [currentSection] = useState<'hero' | 'projects'>('hero');

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <GridBackground currentSection={currentSection} />
      </motion.div>
      
      <main className="h-full w-full flex items-center justify-center z-20">
        <Image 
          src="/logo.svg"
          alt="Brad Titus Logo"
          width={300}
          height={315}
          priority
        />
      </main>
    </div>
  );
}