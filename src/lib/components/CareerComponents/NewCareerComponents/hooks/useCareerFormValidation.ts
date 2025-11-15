import { useState, useEffect } from "react";
import { FieldErrors, FieldTouched, StepErrors, ValidationResult } from "../types/careerForm.types";
import { DEFAULT_FIELD_ERRORS, DEFAULT_FIELD_TOUCHED, DEFAULT_STEP_ERRORS, MIN_AI_INTERVIEW_QUESTIONS, MIN_CORE_PIPELINE_STAGES } from "../constants/defaultValues.constants";

/**
 * Hook to manage form validation and error states
 */
export function useCareerFormValidation() {
  const [errors, setErrors] = useState<FieldErrors>(DEFAULT_FIELD_ERRORS);
  const [fieldTouched, setFieldTouched] = useState<FieldTouched>(DEFAULT_FIELD_TOUCHED);
  const [stepErrors, setStepErrors] = useState<StepErrors>(DEFAULT_STEP_ERRORS);
  
  // Legacy touched states (kept for compatibility)
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [careerInfoTouched, setCareerInfoTouched] = useState(false);
  const [teamAccessTouched, setTeamAccessTouched] = useState(false);

  /**
   * Strip HTML from description
   */
  const stripHtml = (html: string): string => {
    return (html || "")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();
  };

  /**
   * Validate Step 1: Career Details & Team Access
   */
  const validateStep1 = (formData: {
    jobTitle: string;
    description: string;
    employmentType: string;
    workSetup: string;
    province: string;
    city: string;
    salaryNegotiable: boolean;
    minimumSalary: string;
    maximumSalary: string;
    teamMembers: any[];
  }): ValidationResult => {
    const errors: string[] = [];
    
    if (!(formData.jobTitle || "").trim()) errors.push("Job Title is required");
    
    const stripped = stripHtml(formData.description);
    if (!stripped) errors.push("Job Description is required");
    
    if (!(formData.employmentType || "").trim()) errors.push("Employment Type is required");
    if (!(formData.workSetup || "").trim()) errors.push("Work Setup is required");
    if (!(formData.province || "").trim() || !(formData.city || "").trim()) {
      errors.push("Location (Province and City) is required");
    }
    
    // Only validate salary if not negotiable
    if (!formData.salaryNegotiable) {
      if (!(formData.minimumSalary || "").trim()) errors.push("Minimum salary is required");
      if (!(formData.maximumSalary || "").trim()) errors.push("Maximum salary is required");
    }
    
    const hasOwner = formData.teamMembers.some((m: any) => m.isOwner);
    if (!hasOwner) errors.push("At least one Job Owner is required");

    return { isValid: errors.length === 0, errors };
  };

  /**
   * Validate Step 2: CV Review & Pre-screening (always valid - optional step)
   */
  const validateStep2 = (): ValidationResult => {
    return { isValid: true, errors: [] };
  };

  /**
   * Validate Step 3: AI Interview Setup
   */
  const validateStep3 = (aiQuestionsCount: number): ValidationResult => {
    const errors: string[] = [];
    
    if (aiQuestionsCount < MIN_AI_INTERVIEW_QUESTIONS) {
      errors.push(`AI Interview requires ${MIN_AI_INTERVIEW_QUESTIONS} questions (currently ${aiQuestionsCount})`);
    }

    return { isValid: errors.length === 0, errors };
  };

  /**
   * Validate Step 4: Pipeline Stages (always valid - core stages already set)
   */
  const validateStep4 = (): ValidationResult => {
    return { isValid: true, errors: [] };
  };

  /**
   * Validate entire form for publishing
   */
  const validateForm = (formData: {
    jobTitle: string;
    description: string;
    employmentType: string;
    workSetup: string;
    province: string;
    city: string;
    salaryNegotiable: boolean;
    minimumSalary: string;
    maximumSalary: string;
    teamMembers: any[];
    aiQuestionsCount: number;
    pipelineStages: any[];
  }): ValidationResult => {
    const errors: string[] = [];
    
    // Step 1 validation
    const step1Result = validateStep1(formData);
    errors.push(...step1Result.errors);
    
    // Step 3 validation
    if (formData.aiQuestionsCount < MIN_AI_INTERVIEW_QUESTIONS) {
      errors.push("AI Interview must have at least 5 questions");
    }
    
    // Step 4 validation
    const coreStageCount = formData.pipelineStages.filter((s: any) => s.isCore).length;
    if (coreStageCount < MIN_CORE_PIPELINE_STAGES) {
      errors.push("All 4 core pipeline stages are required");
    }
    
    return { isValid: errors.length === 0, errors };
  };

  return {
    errors,
    setErrors,
    fieldTouched,
    setFieldTouched,
    stepErrors,
    setStepErrors,
    descriptionTouched,
    setDescriptionTouched,
    careerInfoTouched,
    setCareerInfoTouched,
    teamAccessTouched,
    setTeamAccessTouched,
    stripHtml,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateForm,
  };
}
