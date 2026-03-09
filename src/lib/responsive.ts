import { BREAKPOINTS } from './constants';

export const getResponsiveClasses = (windowHeight: number) => ({
  iconSize: windowHeight <= BREAKPOINTS.SMALL_HEIGHT ? 'h-2.5 w-2.5' : windowHeight <= BREAKPOINTS.MEDIUM_HEIGHT ? 'h-3 w-3' : windowHeight <= BREAKPOINTS.COMPACT_HEIGHT ? 'h-3.5 w-3.5' : 'h-4 w-4',
  gap: windowHeight <= BREAKPOINTS.SMALL_HEIGHT ? 'gap-0.5' : windowHeight <= BREAKPOINTS.COMPACT_HEIGHT ? 'gap-1' : 'gap-2',
  padding: windowHeight <= BREAKPOINTS.SMALL_HEIGHT ? 'p-0.5' : windowHeight <= BREAKPOINTS.MEDIUM_HEIGHT ? 'p-1' : windowHeight <= BREAKPOINTS.COMPACT_HEIGHT ? 'p-1' : 'p-1.5',
  indent: windowHeight <= BREAKPOINTS.SMALL_HEIGHT ? 'pl-3' : windowHeight <= BREAKPOINTS.COMPACT_HEIGHT ? 'pl-4' : 'pl-6',
  fontSize: windowHeight <= 400 ? 'text-[8px] font-light' : windowHeight <= BREAKPOINTS.SMALL_HEIGHT ? 'text-[9px] font-light' : windowHeight <= BREAKPOINTS.MEDIUM_HEIGHT ? 'text-[11px] font-light' : windowHeight <= BREAKPOINTS.COMPACT_HEIGHT ? 'text-[13px] font-normal' : 'text-xs font-light xl:text-sm xl:font-normal',
  devIconSize: windowHeight <= BREAKPOINTS.SMALL_HEIGHT ? '10px' : windowHeight <= BREAKPOINTS.MEDIUM_HEIGHT ? '12px' : windowHeight <= BREAKPOINTS.COMPACT_HEIGHT ? '14px' : '16px',
  imageSize: windowHeight <= BREAKPOINTS.SMALL_HEIGHT ? 10 : windowHeight <= BREAKPOINTS.MEDIUM_HEIGHT ? 12 : windowHeight <= BREAKPOINTS.COMPACT_HEIGHT ? 14 : 16
});
