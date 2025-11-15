import { CustomQuestion } from "../02CVReview&Pre-screening/customQuestionTypes";

/**
 * Main form state for Career Form
 */
export interface CareerFormState {
  // Step 1: Career Details
  jobTitle: string;
  description: string;
  workSetup: string;
  workSetupRemarks: string;
  employmentType: string;
  salaryNegotiable: boolean;
  minimumSalary: string;
  maximumSalary: string;
  minimumSalaryCurrency: string;
  maximumSalaryCurrency: string;
  country: string;
  province: string;
  city: string;
  teamMembers: TeamMember[];
  
  // Step 2: CV Review & Pre-screening
  screeningSetting: string;
  requireVideo: boolean;
  secretPrompt: string;
  preScreeningQuestions: any[];
  customQuestions: CustomQuestion[];
  askingMinSalary: string;
  askingMaxSalary: string;
  askingMinCurrency: string;
  askingMaxCurrency: string;
  
  // Step 3: AI Interview Setup
  aiInterviewSecretPrompt: string;
  aiInterviewScreeningSetting: string;
  aiInterviewRequireVideo: boolean;
  aiInterviewQuestions: any[];
  aiQuestionsCount: number;
  
  // Step 4: Pipeline Stages
  pipelineStages: PipelineStage[];
}

/**
 * Team member structure
 */
export interface TeamMember {
  name: string;
  email: string;
  role: string;
  isOwner: boolean;
  avatar?: string;
}

/**
 * Pipeline stage structure
 */
export interface PipelineStage {
  icon: string;
  title: string;
  substages: string[];
  isCore: boolean;
}

/**
 * Field error tracking
 */
export interface FieldErrors {
  jobTitle: boolean;
  employmentType: boolean;
  workSetup: boolean;
  province: boolean;
  city: boolean;
  minimumSalary: boolean;
  maximumSalary: boolean;
}

/**
 * Field touched tracking
 */
export interface FieldTouched {
  jobTitle: boolean;
  description: boolean;
  employmentType: boolean;
  workSetup: boolean;
  province: boolean;
  city: boolean;
  minimumSalary: boolean;
  maximumSalary: boolean;
  teamAccess: boolean;
}

/**
 * Step progress tracking (0-1 for each step)
 */
export type StepProgress = Record<number, number>;

/**
 * Step error tracking
 */
export interface StepError {
  hasError: boolean;
  messages?: string[];
}

export type StepErrors = Record<number, StepError>;

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Location data
 */
export interface LocationData {
  provinceList: any[];
  cityList: any[];
}
