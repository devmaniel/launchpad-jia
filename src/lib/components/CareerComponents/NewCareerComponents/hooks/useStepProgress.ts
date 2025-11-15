import { useState, useEffect } from "react";
import { StepProgress } from "../types/careerForm.types";
import { DEFAULT_STEP_PROGRESS, MIN_AI_INTERVIEW_QUESTIONS } from "../constants/defaultValues.constants";

/**
 * Hook to manage step progress tracking
 */
export function useStepProgress() {
  const [stepProgress, setStepProgress] = useState<StepProgress>(DEFAULT_STEP_PROGRESS);

  /**
   * Calculate progress for Step 1 (Career Details & Team Access)
   */
  const calculateStep1Progress = (formData: {
    jobTitle: string;
    description: string;
    employmentType: string;
    workSetup: string;
    province: string;
    city: string;
    teamMembers: any[];
  }): number => {
    let filled = 0;
    let total = 6; // jobTitle, description, employmentType, workSetup, location, teamOwner

    if ((formData.jobTitle || "").trim().length > 0) filled++;
    
    const stripped = (formData.description || "")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();
    if (stripped.length > 0) filled++;
    
    if ((formData.employmentType || "").trim().length > 0) filled++;
    if ((formData.workSetup || "").trim().length > 0) filled++;
    if ((formData.province || "").trim().length > 0 && (formData.city || "").trim().length > 0) filled++;
    
    const hasOwner = formData.teamMembers.some((m: any) => m.isOwner);
    if (hasOwner) filled++;

    return filled / total;
  };

  /**
   * Calculate progress for Step 2 (CV Review & Pre-screening)
   * Optional step - returns current progress value
   */
  const calculateStep2Progress = (): number => {
    return stepProgress[2];
  };

  /**
   * Calculate progress for Step 3 (AI Interview Setup)
   */
  const calculateStep3Progress = (aiQuestionsCount: number): number => {
    return Math.min(aiQuestionsCount / MIN_AI_INTERVIEW_QUESTIONS, 1);
  };

  /**
   * Calculate progress for Step 4 (Pipeline Stages)
   * Returns current progress value
   */
  const calculateStep4Progress = (): number => {
    return stepProgress[4];
  };

  return {
    stepProgress,
    setStepProgress,
    calculateStep1Progress,
    calculateStep2Progress,
    calculateStep3Progress,
    calculateStep4Progress,
  };
}
