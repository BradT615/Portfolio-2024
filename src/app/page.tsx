import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { SkillsTree } from '@/components/SkillsTree';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const projects = [
    {
      title: "Full Stack Spotify Clone",
      description: "A web app built using the Spotify API and SDK. It integrates OAuth 2.0 for authentication, employs RESTful services, and uses AJAX for real-time data interactions, delivering a dynamic user experience reminiscent of the original platform.",
      imageUrl: "/images/spotifyCloneThumbnail.png",
      liveLink: "#", // Add the live link if available
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

  return (
    <div className="flex flex-col h-screen text-neutral-300">
      {/* Fixed Header */}
      <header className='fixed top-0 left-0 right-0 z-50 flex items-center w-full h-16 px-5 bg-neutral-800 border-b border-neutral-800'>
        <div className='flex items-center w-full'>
          <Logo 
            startColor="#f5f5f5" 
            endColor="#f5f5f5" 
            className="h-10 w-10 mr-2"
          />
          <div className='flex items-center gap-4'>
            <h1 className='text-xl font-bold'>Brad Titus</h1>
            <button className='px-3 py-1.5 text-sm font-semibold text-neutral-900 bg-neutral-300 rounded-lg hover:bg-neutral-200 transition-colors'>
              Resume
            </button>
          </div>
          <div className='flex-1' />
          <nav className='flex items-center text-lg'>
            <Link href='https://www.linkedin.com/in/bradt615/' className='nav-link hover:text-neutral-400 transition-colors' target="_blank">LinkedIn</Link>
            <span className="mx-6">/</span>
            <Link href='https://github.com/BradT615' className='nav-link hover:text-neutral-400 transition-colors' target="_blank">Github</Link>
            <span className="mx-6">/</span>
            <a href='#' className='nav-link hover:text-neutral-400 transition-colors'>Email</a>
          </nav>
        </div>
      </header>

      {/* Main Content with Fixed Sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Fixed Sidebar */}
        <aside className="fixed top-16 left-0 bottom-0 w-80 overflow-y-auto bg-neutral-800 border-r border-neutral-800">
          <div className='p-4'>
            <SkillsTree />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className='flex-1 ml-80 p-8 bg-neutral-900'>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8">Projects</h2>
            <div className="flex flex-col gap-8">
              {projects.map((project, index) => (
                <ProductCard key={index} {...project} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}