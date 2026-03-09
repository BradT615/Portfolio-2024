import React, { useState, ReactNode, useEffect, useRef } from "react";
import Image from "next/image";
import { FileIcon, FolderIcon, FolderOpenIcon, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useWindowHeight } from "@/hooks/useWindowHeight";
import { getResponsiveClasses } from "@/lib/responsive";

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

const renderTechIcon = ({ type, path, font }: FileProps['icon'], windowHeight: number) => {
  const { devIconSize, imageSize } = getResponsiveClasses(windowHeight);
  
  if (type === 'font' && font) {
    return (
      <i 
        className={`devicon-${font.name} colored`} 
        style={{ 
          fontSize: devIconSize,
          color: font.color 
        }} 
      />
    );
  }
  
  if (type === 'devicon' && path) {
    return (
      <Image 
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`} 
        className={`h-${imageSize/4} w-${imageSize/4}`}
        width={imageSize}
        height={imageSize}
        loading="lazy"
        alt=""
      />
    );
  }

  return null;
};

export const File: React.FC<FileProps> = ({ name, icon, activeSkills = [] }) => {
  const windowHeight = useWindowHeight();
  const { iconSize, gap, padding, fontSize } = getResponsiveClasses(windowHeight);
  const isActive = activeSkills.includes(name);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative" data-skill-anchor={name}>
      <motion.div 
        data-skill={name}
        initial={{ x: -10 }}
        animate={{ x: 0 }}
        whileHover={{ x: 2, transition: { duration: 0.1 } }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex items-center relative group",
          gap,
          padding,
          fontSize,
          "rounded-sm",
          isActive ? "text-white" : "",
          isHovered && !isActive && "text-[#97a1b8]"
        )}
        layout
        transition={{ layout: { duration: 0.3 } }}
      >
        {isActive && (
          <div className="absolute inset-0 rounded-sm bg-[#4a37b9] opacity-40" />
        )}
        <FileIcon className={cn(iconSize, "relative z-10", isActive && "text-white")} />
        <div className={cn("flex items-center relative z-10", gap)}>
          {renderTechIcon(icon, windowHeight)}
          <span className={cn(isActive && "text-white")}>{name}</span>
        </div>
      </motion.div>
    </div>
  );
};

export const Folder: React.FC<FolderProps> = ({ name, children, activeSkills = [], defaultOpen }) => {
  const windowHeight = useWindowHeight();
  const { iconSize, gap, padding, indent, fontSize } = getResponsiveClasses(windowHeight);
  
  const hasActiveSkills = React.Children.toArray(children).some((child) => {
    const element = child as FileOrFolderElement;
    if (element.type === File) return activeSkills.includes(element.props.name);
    return element.props.activeSkills?.some((skill: string) => activeSkills.includes(skill));
  });

  const [isOpen, setIsOpen] = useState(defaultOpen ?? hasActiveSkills);
  const [isHovered, setIsHovered] = useState(false);
  const wasManuallyToggled = useRef(false);
  const prevActiveSkills = useRef(activeSkills);

  useEffect(() => {
    if (
      prevActiveSkills.current.length !== activeSkills.length ||
      !prevActiveSkills.current.every(skill => activeSkills.includes(skill))
    ) {
      wasManuallyToggled.current = false;
    }
    prevActiveSkills.current = activeSkills;

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
      layout
    >
      <motion.div 
        className={cn(
          "flex items-center cursor-pointer rounded-sm",
          gap,
          padding,
          fontSize,
          isHovered && "",
          (hasActiveSkills || isOpen) ? "text-[#d1dfff]" : ""
        )}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ x: 2, opacity: 1, transition: { duration: 0.1 } }}
        initial={{ opacity: hasActiveSkills ? 1 : 0.7 }}
        whileTap={{ scale: 0.98, transition: { duration: 0 } }}
        layout
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className={iconSize} />
        </motion.div>
        {isOpen ? (
          <FolderOpenIcon className={iconSize} />
        ) : (
          <FolderIcon className={iconSize} />
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
            className={cn("overflow-hidden", indent)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};