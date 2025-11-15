import { PipelineStage, FieldErrors, FieldTouched, StepProgress, StepErrors } from "../types/careerForm.types";

/**
 * Default pipeline stages for new careers
 */
export const DEFAULT_PIPELINE_STAGES: PipelineStage[] = [
  {
    icon: "/temp/user-temp.svg",
    title: "CV Screening",
    substages: ["Waiting Submission", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/mic.svg",
    title: "AI Interview",
    substages: ["Waiting Interview", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/user-temp.svg",
    title: "Final Human Interview",
    substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/user-temp.svg",
    title: "Job Offer",
    substages: ["For Final Interview", "Waiting Offer Acceptance", "For Contract Signing", "Hired"],
    isCore: true,
  },
];

/**
 * Default field errors state
 */
export const DEFAULT_FIELD_ERRORS: FieldErrors = {
  jobTitle: false,
  employmentType: false,
  workSetup: false,
  province: false,
  city: false,
  minimumSalary: false,
  maximumSalary: false,
};

/**
 * Default field touched state
 */
export const DEFAULT_FIELD_TOUCHED: FieldTouched = {
  jobTitle: false,
  description: false,
  employmentType: false,
  workSetup: false,
  province: false,
  city: false,
  minimumSalary: false,
  maximumSalary: false,
  teamAccess: false,
};

/**
 * Default step progress
 */
export const DEFAULT_STEP_PROGRESS: StepProgress = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

/**
 * Default step errors
 */
export const DEFAULT_STEP_ERRORS: StepErrors = {
  1: { hasError: false },
  2: { hasError: false },
  3: { hasError: false },
  4: { hasError: false },
  5: { hasError: false },
};

/**
 * Default currency
 */
export const DEFAULT_CURRENCY = "PHP";

/**
 * Default country
 */
export const DEFAULT_COUNTRY = "Philippines";

/**
 * Default screening setting
 */
export const DEFAULT_SCREENING_SETTING = "Good Fit and above";

/**
 * Minimum required AI interview questions
 */
export const MIN_AI_INTERVIEW_QUESTIONS = 5;

/**
 * Minimum required core pipeline stages
 */
export const MIN_CORE_PIPELINE_STAGES = 4;
