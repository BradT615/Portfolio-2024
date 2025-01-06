"use client";

import React, { useState, ReactNode, useEffect, useRef } from "react";
import Image from "next/image";
import { FileIcon, FolderIcon, FolderOpenIcon, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FolderProps {
  name: string;
  children: ReactNode;
  activeSkills?: string[];
  defaultOpen?: boolean;
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
      <Image 
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`} 
        className="h-4 w-4"
        width={16}
        height={16} 
        loading="lazy"
        alt=""
      />
    );
  }

  return null;
};

export const File: React.FC<FileProps> = ({ name, icon, activeSkills = [] }) => {
  const isActive = activeSkills.includes(name);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative" data-skill-anchor={name}>
      <motion.div 
        data-skill={name}
        initial={{ opacity: isActive ? 1 : 0.7, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ 
          x: 2,
          opacity: isActive ? 1 : 1,
          transition: { duration: 0.1 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex items-center gap-2 p-1.5 text-sm rounded-sm relative group",
          isActive ? "text-white" : "text-neutral-400",
          isHovered && !isActive && "bg-neutral-800"
        )}
      >
        {isActive && (
          <div 
            className="absolute inset-0 rounded-sm opacity-20 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600"
            style={{
              mixBlendMode: 'screen'
            }}
          />
        )}
        <FileIcon className={cn(
          "h-4 w-4 relative z-10",
          isActive && "text-purple-400"
        )} />
        <div className="flex items-center gap-2 relative z-10">
          {renderTechIcon(icon)}
          <span className={cn(
            isActive && "bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent font-medium"
          )}>{name}</span>
        </div>
      </motion.div>
    </div>
  );
};

export const Folder: React.FC<FolderProps> = ({ name, children, activeSkills = [], defaultOpen }) => {
  const hasActiveSkills = React.Children.toArray(children).some((child) => {
    const element = child as FileOrFolderElement;
    if (element.type === File) {
      return activeSkills.includes(element.props.name);
    }
    return element.props.activeSkills?.some((skill: string) => activeSkills.includes(skill));
  });

  const [isOpen, setIsOpen] = useState(defaultOpen ?? hasActiveSkills);
  const [isHovered, setIsHovered] = useState(false);
  const wasManuallyToggled = useRef(false);

  useEffect(() => {
    if (!wasManuallyToggled.current) {
      setIsOpen(hasActiveSkills);
    }
  }, [activeSkills, hasActiveSkills]);

  const handleToggle = () => {
    wasManuallyToggled.current = true;
    setIsOpen(!isOpen);
  };

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
          hasActiveSkills ? "text-white" : "text-neutral-400"
        )}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          x: 2,
          opacity: hasActiveSkills ? 1 : 1,
          transition: { duration: 0.1 }
        }}
        initial={{ opacity: hasActiveSkills ? 1 : 0.7 }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0 }
        }}
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