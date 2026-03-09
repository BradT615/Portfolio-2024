import Link from 'next/link';
import { IoLogoGithub } from "react-icons/io";
import { TextShimmer } from '../core/text-shimmer';
import { Project } from './types';

export const LandscapeGithubCard = ({ project }: { project: Project }) => (
  <div className="flex flex-col items-center justify-center w-[50vw] max-w-3xl h-fit max-h-[90vh] relative bg-[#101328] rounded-lg border-2 border-[#222441] shadow-2xl overflow-hidden">
    <div className="flex flex-col justify-center items-center gap-[2vh] p-4">
      <IoLogoGithub className='h-28 w-28 [@media(min-height:550px)]:h-48 [@media(min-height:550px)]:w-48' />
      <button className="w-fit rounded-full border-[1px] border-[#222441] px-6 py-2 text-[#97a1b8] hover:border-[#97a1b8] transition-colors">
        <Link href={project.repoLink} target="_blank">
          <TextShimmer
            className="font-mono text-lg"
            duration={1}
            repeat={Infinity}
            delay={2}
            spread={3}
          >
            View my GitHub
          </TextShimmer>
        </Link>
      </button>
    </div>
  </div>
);

export const VerticalGithubCard = ({ project }: { project: Project }) => (
  <div className="flex flex-col items-center justify-center w-[40vw] max-w-2xl h-[50vh] relative bg-[#101328] rounded-lg border-2 border-[#222441] shadow-2xl overflow-hidden">
    <div className="flex flex-col justify-center items-center gap-8 p-4">
      <IoLogoGithub className="h-28 w-28 lg:h-48 lg:w-48" />
      <button className="w-fit rounded-full border-[1px] border-[#222441] px-6 py-2 text-[#97a1b8] hover:border-[#97a1b8] transition-colors">
        <Link href={project.repoLink} target="_blank">
          <TextShimmer
            className="font-mono text-lg"
            duration={1}
            repeat={Infinity}
            delay={2}
            spread={3}
          >
            View my GitHub
          </TextShimmer>
        </Link>
      </button>
    </div>
  </div>
);
