import { Project } from '@/lib/projects';

export type { Project };

export interface ProjectCardProps {
  onProjectChange?: (skills: string[], projectIndex: number) => void;
  projectRef?: React.RefObject<HTMLDivElement>;
  onAnimationComplete?: () => void;
  onTopScroll?: () => void;
  currentIndex?: number;
  isSkillsConnected?: boolean;
}
