/**
 * Utility functions for CV processing
 */

import { StepType, StepStatus, UserCV, DigitalCV } from "../types";
import { CV_SECTIONS, STEPS, STEP_STATUS } from "../constants";

/**
 * Determines the status of a step based on current progress
 */
export function getStepStatus(
  currentStep: StepType | null,
  stepIndex: number,
  isAdvance: boolean = false,
  userCV: UserCV | null = null,
  buildingCV: boolean = false
): StepStatus {
  if (!currentStep) return STEP_STATUS[1]; // Pending

  const currentStepIndex = STEPS.indexOf(currentStep);

  if (currentStepIndex === stepIndex) {
    if (stepIndex === STEP_STATUS.length - 1) {
      return STEP_STATUS[0]; // Completed
    }
    return isAdvance || userCV || buildingCV ? STEP_STATUS[2] : STEP_STATUS[1];
  }

  if (currentStepIndex > stepIndex) {
    return STEP_STATUS[0]; // Completed
  }

  return STEP_STATUS[1]; // Pending
}

/**
 * Formats user CV data for API submission
 */
export function formatUserCVForSubmission(userCV: UserCV): DigitalCV["digitalCV"] {
  return CV_SECTIONS.map((section) => ({
    name: section,
    content: userCV[section]?.trim() || "",
  }));
}

/**
 * Parses digital CV JSON string to UserCV object
 */
export function parseDigitalCVToUserCV(digitalCVString: string): UserCV {
  const parsedCV = JSON.parse(digitalCVString);
  const formattedCV: UserCV = {};

  CV_SECTIONS.forEach((section, index) => {
    formattedCV[section] = parsedCV.digitalCV[index].content.trim() || "";
  });

  return formattedCV;
}

/**
 * Validates if CV has any content
 */
export function hasCVContent(userCV: UserCV | null): boolean {
  if (!userCV) return false;
  
  return Object.values(userCV).some((value) => value.trim() !== "");
}

/**
 * Checks if all CV sections are empty
 */
export function isAllCVEmpty(userCV: UserCV | null): boolean {
  if (!userCV) return true;
  
  return Object.values(userCV).every((value) => value.trim() === "");
}

/**
 * Gets the asset key for step status icon
 */
export function getStepStatusAssetKey(status: StepStatus): string {
  return status.toLowerCase().replace(" ", "_");
}
