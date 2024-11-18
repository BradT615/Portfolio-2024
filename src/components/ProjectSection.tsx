// components/ProjectSection.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    {
      title: "Full Stack Spotify Clone",
      description: "A web app built using the Spotify API and SDK. It integrates OAuth 2.0 for authentication, employs RESTful services, and uses AJAX for real-time data interactions, delivering a dynamic user experience reminiscent of the original platform.",
      imageUrl: "/images/spotifyCloneThumbnail.png",
      liveLink: "#",
      repoLink: "https://github.com/BradT615/Spotify-Clone",
      skills: ["React", "Spotify API", "OAuth 2.0", "RESTful", "AJAX"]
    },
    {
      title: "Algorithm Visualizer",
      description: "A React-based web application showcasing 16 unique sorting algorithms with interactive visualizations, offering an engaging, user-friendly experience for learning and exploring algorithm dynamics.",
      imageUrl: "/images/AlgorithmThumbnail.png",
      liveLink: "https://bradt615algorithm.netlify.app/",
      repoLink: "https://github.com/BradT615/Algorithm-Visualizer",
      skills: ["React", "JavaScript", "Algorithms", "Data Structures"]
    },
    {
      title: "Habit Tracker",
      description: "A React-powered habit tracking app, deployed using Firebase, leveraging robust Firebase authentication and efficient Firestore integration for secure user management and real-time data synchronization.",
      imageUrl: "/images/StreakThumbnail.png",
      liveLink: "https://bradt615-streaks.web.app/",
      repoLink: "https://github.com/BradT615/Streaks",
      skills: ["React", "Firebase", "Firestore", "Authentication"]
    },
    {
      title: "Sudoku Game",
      description: "A dynamic web platform that generates Sudoku puzzles using a sophisticated recursive algorithm. This ensures diverse and challenging puzzles for users. Tailored for optimal user experience, the site offers both puzzle creation and advanced solving tools.",
      imageUrl: "/images/sudokuThumbnail.png",
      liveLink: "https://bradt615sudoku.netlify.app",
      repoLink: "https://github.com/BradT615/Sudoku",
      skills: ["JavaScript", "Algorithms", "HTML", "CSS"]
    },
    {
      title: "Movie Database",
      description: "A web app powered by the TMDb API, allowing users to find movies and view their details such as title, image, rating, and summary.",
      imageUrl: "/images/movieDatabaseThumbnail.png",
      liveLink: "https://bradt615movie.netlify.app",
      repoLink: "https://github.com/BradT615/MovieDatabase",
      skills: ["React", "TMDb API", "REST API", "Tailwind CSS"]
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div id="projects" className="relative">
      <div className="relative overflow-hidden h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all">
              <div className="h-[400px] overflow-hidden">
                <img 
                  src={projects[currentIndex].imageUrl} 
                  alt={projects[currentIndex].title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold">{projects[currentIndex].title}</h3>
                  <div className="flex gap-3">
                    <Link 
                      href={projects[currentIndex].repoLink} 
                      className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                      target="_blank"
                    >
                      <Github size={24} />
                    </Link>
                    <Link 
                      href={projects[currentIndex].liveLink} 
                      className="hover:text-neutral-400 transition-colors p-2 rounded-full hover:bg-neutral-800" 
                      target="_blank"
                    >
                      <ExternalLink size={24} />
                    </Link>
                  </div>
                </div>
                <p className="text-neutral-400 text-lg mb-6 leading-relaxed">
                  {projects[currentIndex].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {projects[currentIndex].skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 text-sm bg-neutral-800 rounded-full text-neutral-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-neutral-800 rounded-full text-neutral-300 hover:bg-neutral-700"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-neutral-800 rounded-full text-neutral-300 hover:bg-neutral-700"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </motion.button>

      <div className="flex justify-center mt-6 gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-neutral-300' : 'bg-neutral-700'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectSection;