"use client";

import React, { createContext, useContext, useState } from "react";
import { FileIcon, FolderOpenIcon } from "lucide-react";

type TreeContextType = {
  selectedId: string | undefined;
  selectItem: (id: string) => void;
};

const TreeContext = createContext<TreeContextType | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};

type TreeProps = {
  children: React.ReactNode;
  className?: string;
};

function Tree({ children, className = "" }: TreeProps) {
  const [selectedId, setSelectedId] = useState<string>();
  const selectItem = (id: string) => setSelectedId(id);

  return (
    <TreeContext.Provider value={{ selectedId, selectItem }}>
      <div className={`w-full flex flex-col gap-0.5 ${className}`}>
        {children}
      </div>
    </TreeContext.Provider>
  );
}

type FolderProps = {
  element: string;
  children: React.ReactNode;
  className?: string;
};

function Folder({ element, children, className = "" }: FolderProps) {
  return (
    <div className="flex flex-col">
      <div className={`flex items-center gap-2 p-1.5 text-sm ${className}`}>
        <FolderOpenIcon className="h-4 w-4" />
        <span>{element}</span>
      </div>
      <div className="pl-6">
        {children}
      </div>
    </div>
  );
}

type FileProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

function File({ value, children, className = "" }: FileProps) {
  const { selectedId, selectItem } = useTree();
  const isSelected = selectedId === value;

  return (
    <div
      onClick={() => selectItem(value)}
      className={`
        flex items-center gap-2 p-1.5 text-sm rounded-sm cursor-pointer
        ${isSelected ? 'bg-neutral-800' : 'hover:bg-neutral-800'}
        ${className}
      `}
    >
      <FileIcon className="h-4 w-4" />
      {children}
    </div>
  );
}

export const SkillsTree = () => {
  let idCounter = 1;
  const getId = () => (idCounter++).toString();

  const renderTechIcon = (iconPath: string, useFont?: { name: string; color: string }) => {
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
    
    return (
      <img 
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconPath}`} 
        className="h-4 w-4"
        loading="lazy"
        alt=""
      />
    );
  };

  return (
    <div className="w-full max-w-md p-4 rounded-lg bg-neutral-900">
      <Tree className="bg-neutral-900">
        <Folder element="Skills">
          <Folder element="Front-End">
            <Folder element="Core">
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("html5/html5-original.svg")}
                  <span>HTML5</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("css3/css3-original.svg")}
                  <span>CSS3</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("javascript/javascript-original.svg")}
                  <span>JavaScript</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("typescript/typescript-original.svg")}
                  <span>TypeScript</span>
                </div>
              </File>
            </Folder>
            <Folder element="Frameworks">
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("nextjs/nextjs-original.svg")}
                  <span>Next.js</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("react/react-original.svg")}
                  <span>React</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("angularjs/angularjs-original.svg")}
                  <span>Angular</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("", { name: "wordpress-plain", color: "#FFFFFF" })}
                  <span>WordPress</span>
                </div>
              </File>
            </Folder>
            <Folder element="Styling">
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("tailwindcss/tailwindcss-original.svg")}
                  <span>Tailwind CSS</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("bootstrap/bootstrap-original.svg")}
                  <span>Bootstrap</span>
                </div>
              </File>
            </Folder>
          </Folder>
          <Folder element="Back-End">
            <Folder element="Languages">
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("csharp/csharp-original.svg")}
                  <span>C#</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("c/c-original.svg")}
                  <span>C</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("", { name: "rust-plain", color: "#F46623" })}
                  <span>Rust</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("java/java-original.svg")}
                  <span>Java</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("python/python-original.svg")}
                  <span>Python</span>
                </div>
              </File>
            </Folder>
            <Folder element="Databases">
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("mongodb/mongodb-original.svg")}
                  <span>MongoDB</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("firebase/firebase-plain.svg")}
                  <span>Firebase</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("mysql/mysql-original.svg")}
                  <span>MySQL</span>
                </div>
              </File>
              <File value={getId()}>
                <div className="flex items-center gap-2">
                  {renderTechIcon("supabase/supabase-original.svg")}
                  <span>Supabase</span>
                </div>
              </File>
            </Folder>
          </Folder>
          <Folder element="Cloud Services">
            <File value={getId()}>
              <div className="flex items-center gap-2">
                {renderTechIcon("amazonwebservices/amazonwebservices-plain-wordmark.svg")}
                <span>Amazon Web Services</span>
              </div>
            </File>
          </Folder>
        </Folder>
      </Tree>
    </div>
  );
};

export default SkillsTree;