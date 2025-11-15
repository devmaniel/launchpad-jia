import { useState, useRef } from "react";
import { CareerFormState, TeamMember } from "../types/careerForm.types";
import { DEFAULT_PIPELINE_STAGES, DEFAULT_CURRENCY, DEFAULT_COUNTRY, DEFAULT_SCREENING_SETTING } from "../constants/defaultValues.constants";

/**
 * Hook to manage all career form state
 */
export function useCareerFormState(career: any, user: any) {
  // Step 1: Career Details & Team Access
  const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
  const [description, setDescription] = useState(career?.description || "");
  const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
  const [workSetupRemarks, setWorkSetupRemarks] = useState(career?.workSetupRemarks || "");
  const [employmentType, setEmploymentType] = useState(career?.employmentType || "");
  const [salaryNegotiable, setSalaryNegotiable] = useState(career?.salaryNegotiable ?? false);
  const [minimumSalary, setMinimumSalary] = useState(career?.minimumSalary || "");
  const [maximumSalary, setMaximumSalary] = useState(career?.maximumSalary || "");
  const [minimumSalaryCurrency, setMinimumSalaryCurrency] = useState(career?.minimumSalaryCurrency || DEFAULT_CURRENCY);
  const [maximumSalaryCurrency, setMaximumSalaryCurrency] = useState(career?.maximumSalaryCurrency || DEFAULT_CURRENCY);
  const [country, setCountry] = useState(career?.country || DEFAULT_COUNTRY);
  const [province, setProvince] = useState(career?.province || "");
  const [city, setCity] = useState(career?.location || "");
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    (user && user.email)
      ? [{ name: user.name, email: user.email, role: "Job Owner", isOwner: true, avatar: user.image }]
      : []
  );

  // Step 2: CV Review & Pre-screening
  const [screeningSetting, setScreeningSetting] = useState(career?.screeningSetting || DEFAULT_SCREENING_SETTING);
  const [requireVideo, setRequireVideo] = useState(career?.requireVideo ?? false);
  const [secretPrompt, setSecretPrompt] = useState(career?.secretPrompt || "");
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<any[]>(
    Array.isArray(career?.preScreeningQuestions) ? career.preScreeningQuestions : []
  );
  const [customQuestions, setCustomQuestions] = useState<any[]>(
    Array.isArray((career as any)?.customQuestions) ? (career as any).customQuestions : []
  );
  const [askingMinSalary, setAskingMinSalary] = useState<string>(
    (career as any)?.askingMinSalary ?? (career?.minimumSalary || "")
  );
  const [askingMaxSalary, setAskingMaxSalary] = useState<string>(
    (career as any)?.askingMaxSalary ?? (career?.maximumSalary || "")
  );
  const [askingMinCurrency, setAskingMinCurrency] = useState<string>(
    (career as any)?.askingMinCurrency ?? (career?.minimumSalaryCurrency || DEFAULT_CURRENCY)
  );
  const [askingMaxCurrency, setAskingMaxCurrency] = useState<string>(
    (career as any)?.askingMaxCurrency ?? (career?.maximumSalaryCurrency || DEFAULT_CURRENCY)
  );

  // Step 3: AI Interview Setup
  const [aiInterviewSecretPrompt, setAiInterviewSecretPrompt] = useState(career?.aiInterviewSecretPrompt || "");
  const [aiInterviewScreeningSetting, setAiInterviewScreeningSetting] = useState(
    career?.aiInterviewScreeningSetting || DEFAULT_SCREENING_SETTING
  );
  const [aiInterviewRequireVideo, setAiInterviewRequireVideo] = useState(career?.aiInterviewRequireVideo ?? false);
  const [aiInterviewQuestions, setAiInterviewQuestions] = useState<any[]>([]);
  const [aiQuestionsCount, setAiQuestionsCount] = useState<number>(0);

  // Step 4: Pipeline Stages
  const [pipelineStages, setPipelineStages] = useState<any[]>(career?.pipelineStages || DEFAULT_PIPELINE_STAGES);

  // Navigation state
  const [activeStep, setActiveStep] = useState<number>(1);
  const [furthestStep, setFurthestStep] = useState<number>(1);
  const [step3Visited, setStep3Visited] = useState(false);

  // Change tracking
  const [hasChanges, setHasChanges] = useState(false);
  const baselineRef = useRef<any>(null);

  return {
    // Step 1
    jobTitle, setJobTitle,
    description, setDescription,
    workSetup, setWorkSetup,
    workSetupRemarks, setWorkSetupRemarks,
    employmentType, setEmploymentType,
    salaryNegotiable, setSalaryNegotiable,
    minimumSalary, setMinimumSalary,
    maximumSalary, setMaximumSalary,
    minimumSalaryCurrency, setMinimumSalaryCurrency,
    maximumSalaryCurrency, setMaximumSalaryCurrency,
    country, setCountry,
    province, setProvince,
    city, setCity,
    teamMembers, setTeamMembers,
    
    // Step 2
    screeningSetting, setScreeningSetting,
    requireVideo, setRequireVideo,
    secretPrompt, setSecretPrompt,
    preScreeningQuestions, setPreScreeningQuestions,
    customQuestions, setCustomQuestions,
    askingMinSalary, setAskingMinSalary,
    askingMaxSalary, setAskingMaxSalary,
    askingMinCurrency, setAskingMinCurrency,
    askingMaxCurrency, setAskingMaxCurrency,
    
    // Step 3
    aiInterviewSecretPrompt, setAiInterviewSecretPrompt,
    aiInterviewScreeningSetting, setAiInterviewScreeningSetting,
    aiInterviewRequireVideo, setAiInterviewRequireVideo,
    aiInterviewQuestions, setAiInterviewQuestions,
    aiQuestionsCount, setAiQuestionsCount,
    
    // Step 4
    pipelineStages, setPipelineStages,
    
    // Navigation
    activeStep, setActiveStep,
    furthestStep, setFurthestStep,
    step3Visited, setStep3Visited,
    
    // Change tracking
    hasChanges, setHasChanges,
    baselineRef,
  };
}
