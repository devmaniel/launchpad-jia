/**
 * Main export for UploadCV-Refactored component
 */

export { default } from "./UploadCV";
export { default as UploadCV } from "./UploadCV";

// Export types for external use
export type {
  Interview,
  FileInfo,
  CVSection,
  DigitalCV,
  UserCV,
  ScreeningResult,
  CVData,
  StepType,
  StepStatus,
  UploadCVState,
  CustomQuestion,
  PreScreeningQuestion,
} from "./types";

// Export constants
export { CV_SECTIONS, STEPS, STEP_STATUS } from "./constants";

// Export mock utilities
export { getMockDataByFileName } from "./mock/mockData";
export type { MockCVData } from "./mock/mockData";
