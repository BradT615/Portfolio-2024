export interface Trail {
  id: number;
  position: number;
  isVertical: boolean;
  fixedPosition: number;
  active: boolean;
  startDelay: number;
  elapsedTime: number;
}