/**
 * Type definitions for UploadCV component
 */

export interface CustomQuestion {
  id: string;
  question: string;
  answerType: "dropdown" | "text";
  options?: string[];
}

export interface PreScreeningQuestion {
  id: string;
  question: string;
  type: "notice-period" | "work-setup" | "asking-salary";
}

export interface Interview {
  _id?: string;
  interviewID: string;
  jobTitle: string;
  cvStatus: boolean;
  customQuestions?: CustomQuestion[];
  preScreeningQuestions?: PreScreeningQuestion[];
  organization?: {
    name: string;
    image: string;
  };
  description?: string;
  location?: string;
  workSetup?: string;
  createdAt?: number;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface CVSection {
  name: string;
  content: string;
}

export interface DigitalCV {
  errorRemarks: string | null;
  digitalCV: CVSection[];
}

export interface UserCV {
  [key: string]: string;
}

export interface ScreeningResult {
  applicationStatus: "Dropped" | "Ongoing" | "Accepted";
  status: "For AI Interview" | "For Review" | string;
}

export interface CVData {
  name: string;
  cvData: DigitalCV;
  email: string;
  fileInfo: FileInfo | null;
}

export type StepType = "Submit CV" | "Pre-Screening Question" | "Review";
export type StepStatus = "Completed" | "Pending" | "In Progress";

export interface UploadCVState {
  buildingCV: boolean;
  currentStep: StepType | null;
  digitalCV: string | null;
  editingCV: string | null;
  file: File | null;
  hasChanges: boolean;
  loading: boolean;
  interview: Interview | null;
  screeningResult: ScreeningResult | null;
  userCV: UserCV | null;
}
