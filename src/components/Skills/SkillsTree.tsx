"use client";

import React from "react";
import { motion } from "framer-motion";
import { File, Folder } from "./FileFolder";

export const SkillsTree: React.FC<{ activeSkills?: string[] }> = ({ activeSkills = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full relative"
    >
      <div className="px-4 py-6 custom-scrollbar">
        <Folder name="Skills" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
          <Folder name="Front-End" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
            <Folder name="Core" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
              <File 
                name="HTML5"
                icon={{ type: 'devicon', path: "html5/html5-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="CSS3"
                icon={{ type: 'devicon', path: "css3/css3-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="JavaScript"
                icon={{ type: 'devicon', path: "javascript/javascript-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="TypeScript"
                icon={{ type: 'devicon', path: "typescript/typescript-original.svg" }}
                activeSkills={activeSkills}
              />
            </Folder>
            <Folder name="Frameworks" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
              <File 
                name="React"
                icon={{ type: 'devicon', path: "react/react-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="Next.js"
                icon={{ type: 'devicon', path: "nextjs/nextjs-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="Angular"
                icon={{ type: 'devicon', path: "angularjs/angularjs-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="WordPress"
                icon={{ type: 'font', font: { name: "wordpress-plain", color: "#FFFFFF" } }}
                activeSkills={activeSkills}
              />
            </Folder>
            <Folder name="Styling" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
              <File 
                name="Tailwind CSS"
                icon={{ type: 'devicon', path: "tailwindcss/tailwindcss-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="Bootstrap"
                icon={{ type: 'devicon', path: "bootstrap/bootstrap-original.svg" }}
                activeSkills={activeSkills}
              />
            </Folder>
            <Folder name="APIs & Integration" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
              <File 
                name="REST API"
                icon={{ type: 'font', font: { name: "api-plain", color: "#FFFFFF" } }}
                activeSkills={activeSkills}
              />
              <File 
                name="Spotify API"
                icon={{ type: 'font', font: { name: "spotify-plain", color: "#1DB954" } }}
                activeSkills={activeSkills}
              />
              <File 
                name="TMDb API"
                icon={{ type: 'font', font: { name: "api-plain", color: "#FFFFFF" } }}
                activeSkills={activeSkills}
              />
              <File 
                name="AJAX"
                icon={{ type: 'font', font: { name: "ajax-plain", color: "#FFFFFF" } }}
                activeSkills={activeSkills}
              />
            </Folder>
          </Folder>
          <Folder name="Back-End" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
            <Folder name="Languages" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
              <File 
                name="C#"
                icon={{ type: 'devicon', path: "csharp/csharp-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="C"
                icon={{ type: 'devicon', path: "c/c-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="Rust"
                icon={{ type: 'font', font: { name: "rust-plain", color: "#F46623" } }}
                activeSkills={activeSkills}
              />
              <File 
                name="Java"
                icon={{ type: 'devicon', path: "java/java-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="Python"
                icon={{ type: 'devicon', path: "python/python-original.svg" }}
                activeSkills={activeSkills}
              />
            </Folder>
            <Folder name="Databases" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
              <File 
                name="MongoDB"
                icon={{ type: 'devicon', path: "mongodb/mongodb-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="Firebase"
                icon={{ type: 'devicon', path: "firebase/firebase-plain.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="MySQL"
                icon={{ type: 'devicon', path: "mysql/mysql-original.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="Supabase"
                icon={{ type: 'devicon', path: "supabase/supabase-original.svg" }}
                activeSkills={activeSkills}
              />
            </Folder>
            <Folder name="Services & Authentication" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
              <File 
                name="Firebase"
                icon={{ type: 'devicon', path: "firebase/firebase-plain.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="Firestore"
                icon={{ type: 'devicon', path: "firebase/firebase-plain.svg" }}
                activeSkills={activeSkills}
              />
              <File 
                name="OAuth 2.0"
                icon={{ type: 'font', font: { name: "oauth-plain", color: "#FFFFFF" } }}
                activeSkills={activeSkills}
              />
              <File 
                name="Authentication"
                icon={{ type: 'font', font: { name: "authentication-plain", color: "#FFFFFF" } }}
                activeSkills={activeSkills}
              />
            </Folder>
          </Folder>
          <Folder name="Cloud Services" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
            <File 
              name="Amazon Web Services"
              icon={{ type: 'devicon', path: "amazonwebservices/amazonwebservices-plain-wordmark.svg" }}
              activeSkills={activeSkills}
            />
          </Folder>
          <Folder name="Computer Science" activeSkills={activeSkills} forceOpen={activeSkills.length > 0}>
            <File 
              name="Algorithms"
              icon={{ type: 'font', font: { name: "algorithm-plain", color: "#FFFFFF" } }}
              activeSkills={activeSkills}
            />
            <File 
              name="Data Structures"
              icon={{ type: 'font', font: { name: "datastructures-plain", color: "#FFFFFF" } }}
              activeSkills={activeSkills}
            />
          </Folder>
        </Folder>
      </div>
      <div className="absolute top-0 left-0 right-0 h-8 w-11/12 bg-gradient-to-b from-neutral-900 to-transparent pointer-events-none z-10 transition-opacity duration-200" />
      <div className="absolute bottom-0 left-0 right-0 h-8 w-11/12 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none z-10 transition-opacity duration-200" />
    </motion.div>
  );
};

export default SkillsTree;