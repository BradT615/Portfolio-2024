import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { File, Folder } from "./FileFolder";

export const SkillsTree: React.FC<{ activeSkills?: string[] }> = ({ activeSkills = [] }) => {
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 701);
  const shouldShowAllSkills = windowHeight > 750;

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (e: React.WheelEvent) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const canScrollUp = scrollTop > 0;
    const canScrollDown = scrollTop < scrollHeight - clientHeight;
    e.stopPropagation();
    if (!canScrollUp && e.deltaY < 0) return;
    if (!canScrollDown && e.deltaY > 0) return;
    element.scrollTop += e.deltaY;
  };

  const shouldRenderFolder = (childrenArray: React.ReactNode[]): boolean => {
    if (shouldShowAllSkills) return true;
    return childrenArray.some((child: any) => {
      if (!child?.props) return false;
      if (child.type === File) {
        return activeSkills.includes(child.props.name);
      }
      return shouldRenderFolder(React.Children.toArray(child.props.children));
    });
  };

  const renderChildren = (children: React.ReactNode): React.ReactNode[] => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.map((child: any) => {
      if (!child?.props) return null;
      
      if (child.type === File) {
        if (shouldShowAllSkills || activeSkills.includes(child.props.name)) {
          return child;
        }
        return null;
      }
      
      if (child.type === Folder) {
        const folderChildren = React.Children.toArray(child.props.children);
        if (!shouldRenderFolder(folderChildren)) return null;
        
        return React.cloneElement(child, {
          ...child.props,
          children: renderChildren(child.props.children)
        });
      }
      
      return child;
    }).filter(Boolean);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col relative"
      onWheel={handleScroll}
    >
      <div 
        className={`flex-1 px-2 lg:px-4 custom-scrollbar overflow-y-auto ${
          windowHeight <= 600 ? 'text-[10px] px-2' : 
          windowHeight <= 600 ? 'text-[10px] px-2' : 
          windowHeight <= 700 ? 'text-[11px] px-2' : 
          'text-xs xl:text-sm'
        }`}
        style={{
          paddingTop: windowHeight <= 500 ? "0.5rem" : windowHeight <= 600 ? "1rem" : windowHeight <= 750 ? "1.5rem" : "2rem",
          paddingBottom: windowHeight <= 500 ? "0.5rem" : windowHeight <= 600 ? "1rem" : windowHeight <= 750 ? "1.5rem" : "2rem",
          minHeight: "0"
        }}
      >
        <Folder name="Skills" activeSkills={activeSkills}>
          {renderChildren([
            <Folder key="front-end" name="Front-End" activeSkills={activeSkills}>
              <Folder name="Core" activeSkills={activeSkills}>
                <File name="HTML5" icon={{ type: 'devicon', path: "html5/html5-original.svg" }} activeSkills={activeSkills} />
                <File name="CSS3" icon={{ type: 'devicon', path: "css3/css3-original.svg" }} activeSkills={activeSkills} />
                <File name="JavaScript" icon={{ type: 'devicon', path: "javascript/javascript-original.svg" }} activeSkills={activeSkills} />
                <File name="TypeScript" icon={{ type: 'devicon', path: "typescript/typescript-original.svg" }} activeSkills={activeSkills} />
              </Folder>
              <Folder name="Frameworks" activeSkills={activeSkills}>
                <File name="React" icon={{ type: 'devicon', path: "react/react-original.svg" }} activeSkills={activeSkills} />
                <File name="Next.js" icon={{ type: 'devicon', path: "nextjs/nextjs-original.svg" }} activeSkills={activeSkills} />
                <File name="Angular" icon={{ type: 'devicon', path: "angularjs/angularjs-original.svg" }} activeSkills={activeSkills} />
                <File name="WordPress" icon={{ type: 'font', font: { name: "wordpress-plain", color: "#FFFFFF" } }} activeSkills={activeSkills} />
              </Folder>
              <Folder name="Styling" activeSkills={activeSkills}>
                <File name="Tailwind CSS" icon={{ type: 'devicon', path: "tailwindcss/tailwindcss-original.svg" }} activeSkills={activeSkills} />
                <File name="Bootstrap" icon={{ type: 'devicon', path: "bootstrap/bootstrap-original.svg" }} activeSkills={activeSkills} />
              </Folder>
              <Folder name="APIs & Integration" activeSkills={activeSkills}>
                <File name="jQuery" icon={{ type: 'devicon', path: "jquery/jquery-original.svg" }} activeSkills={activeSkills} />
                <File name="AJAX" icon={{ type: 'font', font: { name: "ajax-plain", color: "#FFFFFF" } }} activeSkills={activeSkills} />
                <File name="REST API" icon={{ type: 'font', font: { name: "api-plain", color: "#FFFFFF" } }} activeSkills={activeSkills} />
              </Folder>
            </Folder>,
            <Folder key="back-end" name="Back-End" activeSkills={activeSkills}>
              <Folder name="Languages" activeSkills={activeSkills}>
                <File name="C#" icon={{ type: 'devicon', path: "csharp/csharp-original.svg" }} activeSkills={activeSkills} />
                <File name="C" icon={{ type: 'devicon', path: "c/c-original.svg" }} activeSkills={activeSkills} />
                <File name="Rust" icon={{ type: 'font', font: { name: "rust-plain", color: "#F46623" } }} activeSkills={activeSkills} />
                <File name="Java" icon={{ type: 'devicon', path: "java/java-original.svg" }} activeSkills={activeSkills} />
                <File name="Python" icon={{ type: 'devicon', path: "python/python-original.svg" }} activeSkills={activeSkills} />
              </Folder>
              <Folder name="Databases" activeSkills={activeSkills}>
                <File name="MongoDB" icon={{ type: 'devicon', path: "mongodb/mongodb-original.svg" }} activeSkills={activeSkills} />
                <File name="Firebase" icon={{ type: 'devicon', path: "firebase/firebase-plain.svg" }} activeSkills={activeSkills} />
                <File name="MySQL" icon={{ type: 'devicon', path: "mysql/mysql-original.svg" }} activeSkills={activeSkills} />
                <File name="Supabase" icon={{ type: 'devicon', path: "supabase/supabase-original.svg" }} activeSkills={activeSkills} />
              </Folder>
              <Folder name="Services & Authentication" activeSkills={activeSkills}>
                <File name="Firestore" icon={{ type: 'devicon', path: "firebase/firebase-plain.svg" }} activeSkills={activeSkills} />
                <File name="OAuth 2.0" icon={{ type: 'font', font: { name: "oauth-plain", color: "#FFFFFF" } }} activeSkills={activeSkills} />
                <File name="Authentication" icon={{ type: 'font', font: { name: "authentication-plain", color: "#FFFFFF" } }} activeSkills={activeSkills} />
              </Folder>
            </Folder>,
            <Folder key="cloud" name="Cloud Services" activeSkills={activeSkills}>
              <File name="Amazon Web Services" icon={{ type: 'devicon', path: "amazonwebservices/amazonwebservices-plain-wordmark.svg" }} activeSkills={activeSkills} />
            </Folder>,
            <Folder key="cs" name="Computer Science" activeSkills={activeSkills}>
              <File name="Algorithms" icon={{ type: 'font', font: { name: "algorithm-plain", color: "#FFFFFF" } }} activeSkills={activeSkills} />
              <File name="Data Structures" icon={{ type: 'font', font: { name: "datastructures-plain", color: "#FFFFFF" } }} activeSkills={activeSkills} />
            </Folder>
          ])}
        </Folder>
      </div>
      <div className={`absolute top-0 left-0 right-0 w-full pointer-events-none z-10 transition-opacity duration-200 bg-gradient-to-b from-[#080b23] to-transparent ${
          windowHeight <= 500 ? 'h-2' :
          windowHeight <= 600 ? 'h-4' :
          windowHeight <= 750 ? 'h-6' :
          'h-8'
        }`} />
      <div className={`absolute bottom-0 left-0 right-0 w-full pointer-events-none z-10 transition-opacity duration-200 bg-gradient-to-t from-[#080b23] to-transparent ${
          windowHeight <= 500 ? 'h-2' :
          windowHeight <= 600 ? 'h-4' :
          windowHeight <= 750 ? 'h-6' :
          'h-8'
        }`} />
    </motion.div>
  );
};

export default SkillsTree;