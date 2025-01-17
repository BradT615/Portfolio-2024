export interface Project {
  title: string;
  description?: string;
  imageUrl?: string;
  liveLink?: string;
  repoLink: string;
  skills: string[];
  videoUrl?: string;
  isGithubCard?: boolean;
}

export const projects: Project[] = [
  {
    title: "Full Stack Spotify Clone",
    description: "A web app built using the Spotify API and SDK. It integrates OAuth 2.0 for authentication, RESTful services, and uses AJAX for real-time data interactions.",
    imageUrl: "/images/spotifyCloneThumbnail.png",
    liveLink: "#",
    repoLink: "https://github.com/BradT615/Spotify-Clone",
    skills: ["React", "OAuth 2.0", "REST API", "AJAX"],
    videoUrl: "https://www.youtube.com/embed/JxVoxpzr56o?vq=hd1080&si=Uf2WXvw_tWpaWtWD"
  },
  {
    title: "Algorithm Visualizer",
    description: "A React-based web application showcasing 16 unique sorting algorithms with interactive visualizations.",
    imageUrl: "/images/AlgorithmThumbnail.png",
    liveLink: "https://bradt615algorithm.netlify.app/",
    repoLink: "https://github.com/BradT615/Algorithm-Visualizer",
    skills: ["React", "JavaScript", "Algorithms", "Data Structures"]
  },
  {
    title: "Habit Tracker",
    description: "A React habit tracker app with Firebase, featuring secure authentication and real-time Firestore data syncing.",
    imageUrl: "/images/StreakThumbnail.png",
    liveLink: "https://bradt615-streaks.web.app/",
    repoLink: "https://github.com/BradT615/Streaks",
    skills: ["React", "Firebase", "Firestore", "Authentication"]
  },
  {
    title: "Sudoku Game",
    description: "A web platform for generating Sudoku puzzles with a recursive algorithm, offering diverse challenges and advanced solving tools for an optimal user experience.",
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
  },
  {
    title: "More Projects on GitHub",
    repoLink: "https://github.com/BradT615",
    skills: ["C#", "C", "Rust", "Python", "Java", "MySQL", "Amazon Web Services"],
    isGithubCard: true
  }
];