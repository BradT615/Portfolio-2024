// Define the project type for better type safety
export interface Project {
    title: string;
    description: string;
    imageUrl: string;
    liveLink: string;
    repoLink: string;
    skills: string[];
  }
  
export const projects: Project[] = [
  {
    title: "Full Stack Spotify Clone",
    description: "A web app built using the Spotify API and SDK. It integrates OAuth 2.0 for authentication, employs RESTful services, and uses AJAX for real-time data interactions, delivering a dynamic user experience reminiscent of the original platform.",
    imageUrl: "/images/spotifyCloneThumbnail.png",
    liveLink: "#",
    repoLink: "https://github.com/BradT615/Spotify-Clone",
    skills: ["React", "OAuth 2.0", "REST API", "AJAX"]
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
    skills: ["JavaScript", "Algorithms", "HTML5", "CSS3"]
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