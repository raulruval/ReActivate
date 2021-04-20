import { IPoseTrackerResults } from '~/pose-tracker-engine/types/pose-tracker-results.interface';
import Phaser from 'phaser';
import { IPoseTrackerRenderElementsSettings } from '~/pose-tracker-engine/types/pose-tracker-dender-elements-settings.interface';

export interface IOnPoseTrackerResultsUpdate {
  renderElementsSettings: IPoseTrackerRenderElementsSettings;
  beforePaint: (poseTrackerResults: IPoseTrackerResults, canvasTexture: Phaser.Textures.CanvasTexture) => void;
  afterPaint: (poseTrackerResults: IPoseTrackerResults) => void;
}
