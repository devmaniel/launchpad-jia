/**
 * Constants for UploadCV component
 */

import { StepType, StepStatus } from "../types";

export const CV_SECTIONS = [
  "Introduction",
  "Current Position",
  "Contact Info",
  "Skills",
  "Experience",
  "Education",
  "Projects",
  "Certifications",
  "Awards",
] as const;

export const STEPS: StepType[] = [
  "Submit CV",
  "Pre-Screening Question",
  "Review",
];

export const STEP_STATUS: StepStatus[] = [
  "Completed",
  "Pending",
  "In Progress",
];

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FILE_ACCEPT_STRING = ".pdf,.doc,.docx,.txt";
