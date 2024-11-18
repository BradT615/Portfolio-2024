"use client";

import React, { useState, ReactNode, useRef, useEffect } from "react";
import { FileIcon, FolderIcon, FolderOpenIcon, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TreeProps {
  children: ReactNode;
}

interface FolderProps {
  element: string;
  children: ReactNode;
}

interface FileProps {
  children: ReactNode;
}

interface TechIconProps {
  iconPath?: string;
  useFont?: {
    name: string;
    color: string;
  };
}

const Tree: React.FC<TreeProps> = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col gap-0.5"
    >
      {children}
    </motion.div>
  );
};

const Folder: React.FC<FolderProps> = ({ element, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
      <motion.div 
        className={cn(
          "flex items-center gap-2 p-1.5 text-sm cursor-pointer rounded-sm",
          isHovered && "bg-neutral-800"
        )}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.div>
        {isOpen ? (
          <FolderOpenIcon className="h-4 w-4" />
        ) : (
          <FolderIcon className="h-4 w-4" />
        )}
        <span>{element}</span>
      </motion.div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: { 
                height: { duration: 0.2 },
                opacity: { duration: 0.2 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { 
                height: { duration: 0.2 },
                opacity: { duration: 0.1 }
              }
            }}
            className="pl-6 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const File: React.FC<FileProps> = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ 
        x: 4,
        backgroundColor: "rgba(38, 38, 38, 0.8)",
        transition: { duration: 0.1 }
      }}
      className="flex items-center gap-2 p-1.5 text-sm rounded-sm"
    >
      <FileIcon className="h-4 w-4" />
      {children}
    </motion.div>
  );
};

const renderTechIcon = ({ iconPath, useFont }: TechIconProps) => {
  if (useFont) {
    return (
      <i 
        className={`devicon-${useFont.name} colored`} 
        style={{ 
          fontSize: '16px',
          color: useFont.color 
        }} 
      />
    );
  }
  
  if (iconPath) {
    return (
      <img 
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconPath}`} 
        className="h-4 w-4"
        loading="lazy"
        alt=""
      />
    );
  }

  return null;
};

export const SkillsTree: React.FC = () => {
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    setShowTopShadow(scrollTop > 0);
    setShowBottomShadow(Math.ceil(scrollTop + clientHeight) < scrollHeight);
  };

  useEffect(() => {
    if (containerRef.current) {
      handleScroll({ currentTarget: containerRef.current } as React.UIEvent<HTMLDivElement>);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-auto px-4 py-2 custom-scrollbar"
      >
        <Tree>
          <Folder element="Skills">
            <Folder element="Front-End">
              <Folder element="Core">
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "html5/html5-original.svg" })}
                    <span>HTML5</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "css3/css3-original.svg" })}
                    <span>CSS3</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "javascript/javascript-original.svg" })}
                    <span>JavaScript</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "typescript/typescript-original.svg" })}
                    <span>TypeScript</span>
                  </div>
                </File>
              </Folder>
              <Folder element="Frameworks">
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "nextjs/nextjs-original.svg" })}
                    <span>Next.js</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "react/react-original.svg" })}
                    <span>React</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "angularjs/angularjs-original.svg" })}
                    <span>Angular</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ useFont: { name: "wordpress-plain", color: "#FFFFFF" } })}
                    <span>WordPress</span>
                  </div>
                </File>
              </Folder>
              <Folder element="Styling">
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "tailwindcss/tailwindcss-original.svg" })}
                    <span>Tailwind CSS</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "bootstrap/bootstrap-original.svg" })}
                    <span>Bootstrap</span>
                  </div>
                </File>
              </Folder>
            </Folder>
            <Folder element="Back-End">
              <Folder element="Languages">
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "csharp/csharp-original.svg" })}
                    <span>C#</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "c/c-original.svg" })}
                    <span>C</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ useFont: { name: "rust-plain", color: "#F46623" } })}
                    <span>Rust</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "java/java-original.svg" })}
                    <span>Java</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "python/python-original.svg" })}
                    <span>Python</span>
                  </div>
                </File>
              </Folder>
              <Folder element="Databases">
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "mongodb/mongodb-original.svg" })}
                    <span>MongoDB</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "firebase/firebase-plain.svg" })}
                    <span>Firebase</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "mysql/mysql-original.svg" })}
                    <span>MySQL</span>
                  </div>
                </File>
                <File>
                  <div className="flex items-center gap-2">
                    {renderTechIcon({ iconPath: "supabase/supabase-original.svg" })}
                    <span>Supabase</span>
                  </div>
                </File>
              </Folder>
            </Folder>
            <Folder element="Cloud Services">
              <File>
                <div className="flex items-center gap-2">
                  {renderTechIcon({ iconPath: "amazonwebservices/amazonwebservices-plain-wordmark.svg" })}
                  <span>Amazon Web Services</span>
                </div>
              </File>
            </Folder>
          </Folder>
        </Tree>
      </div>
      <div 
        className={`absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${
          showTopShadow && isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div 
        className={`absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${
          showBottomShadow && isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </motion.div>
  );
};

export default SkillsTree;