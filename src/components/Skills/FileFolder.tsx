"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { FileIcon, FolderIcon, FolderOpenIcon, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface FolderProps {
  name: string;
  children: ReactNode;
  activeSkills?: string[];
  forceOpen?: boolean;
}

interface FileProps {
  name: string;
  icon: {
    type: 'devicon' | 'font';
    path?: string;
    font?: {
      name: string;
      color: string;
    };
  };
  activeSkills?: string[];
}

type FileOrFolderElement = React.ReactElement<FileProps | FolderProps>;

const renderTechIcon = ({ type, path, font }: FileProps['icon']) => {
  if (type === 'font' && font) {
    return (
      <i 
        className={`devicon-${font.name} colored`} 
        style={{ 
          fontSize: '16px',
          color: font.color 
        }} 
      />
    );
  }
  
  if (type === 'devicon' && path) {
    return (
      <img 
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`} 
        className="h-4 w-4"
        loading="lazy"
        alt=""
      />
    );
  }

  return null;
};

export const File: React.FC<FileProps> = ({ name, icon, activeSkills = [] }) => {
  const isActive = activeSkills.includes(name);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ 
        x: 4,
        backgroundColor: "rgba(38, 38, 38, 0.8)",
        transition: { duration: 0.1 }
      }}
      className={cn(
        "flex items-center gap-2 p-1.5 text-sm rounded-sm transition-colors duration-200",
        isActive ? "text-white" : "text-neutral-400"
      )}
    >
      <FileIcon className="h-4 w-4" />
      <div className="flex items-center gap-2">
        {renderTechIcon(icon)}
        <span>{name}</span>
      </div>
    </motion.div>
  );
};

export const Folder: React.FC<FolderProps> = ({ name, children, activeSkills = [], forceOpen }) => {
  const hasActiveSkills = React.Children.toArray(children).some((child) => {
    const element = child as FileOrFolderElement;
    if (element.type === File) {
      return activeSkills.includes(element.props.name);
    }
    return element.props.activeSkills?.some((skill: string) => activeSkills.includes(skill));
  });

  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (forceOpen !== undefined) {
      setIsOpen(forceOpen && hasActiveSkills);
    }
  }, [forceOpen, hasActiveSkills]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
      <motion.div 
        className={cn(
          "flex items-center gap-2 p-1.5 text-sm cursor-pointer rounded-sm",
          isHovered && "bg-neutral-800",
          activeSkills.length > 0 ? (
            hasActiveSkills ? "text-white" : "text-neutral-400"
          ) : "text-white"
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
        <span>{name}</span>
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