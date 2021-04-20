import { IPoseLandmark } from '~/pose-tracker-engine/types/pose-landmark.interface';

export interface IPoseTrackerResults {
  image: CanvasImageSource;
  poseLandmarks?: IPoseLandmark[];
}
