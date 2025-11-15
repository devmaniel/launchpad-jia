import { useEffect } from "react";

/**
 * Hook to consolidate all form side effects
 * Reduces clutter in main component
 */
export function useCareerFormEffects(
  user: any,
  formState: any,
  validation: any,
  progress: any,
  location: any
) {
  // Initialize current user as Job Owner
  useEffect(() => {
    if (user?.email) {
      const hasOwner = formState.teamMembers.some((m: any) => m.email === user.email && m.isOwner);
      if (!hasOwner) {
        formState.setTeamMembers((prev: any[]) => [
          { name: user.name, email: user.email, role: "Job Owner", isOwner: true, avatar: user.image },
          ...prev
        ]);
      }
    }
  }, [user?.email]);

  // Update city list when province changes
  useEffect(() => {
    location.updateCityList(formState.province);
  }, [formState.province]);

  // Clear salary errors when toggling negotiable
  useEffect(() => {
    if (formState.salaryNegotiable) {
      validation.setErrors((prev: any) => ({ 
        ...prev, 
        minimumSalary: false,
        maximumSalary: false 
      }));
      validation.setFieldTouched((prev: any) => ({
        ...prev,
        minimumSalary: false,
        maximumSalary: false
      }));
    }
  }, [formState.salaryNegotiable]);

  // Mark Step 3 as visited
  useEffect(() => {
    if (formState.activeStep === 3) {
      formState.setStep3Visited(true);
    }
  }, [formState.activeStep]);

  // Update step progress dynamically
  useEffect(() => {
    if (formState.activeStep === 1 && progress.stepProgress[1] < 1) {
      const prog = progress.calculateStep1Progress({
        jobTitle: formState.jobTitle,
        description: formState.description,
        employmentType: formState.employmentType,
        workSetup: formState.workSetup,
        province: formState.province,
        city: formState.city,
        teamMembers: formState.teamMembers,
      });
      progress.setStepProgress((prev: any) => ({ ...prev, 1: prog }));
    } else if (formState.activeStep === 3 && progress.stepProgress[3] < 1) {
      const prog = progress.calculateStep3Progress(formState.aiQuestionsCount);
      progress.setStepProgress((prev: any) => ({ ...prev, 3: prog }));
    }
  }, [
    formState.activeStep,
    formState.jobTitle,
    formState.description,
    formState.employmentType,
    formState.workSetup,
    formState.province,
    formState.city,
    formState.teamMembers,
    formState.aiQuestionsCount,
  ]);

  // Validate Step 3 and update stepErrors (only after Step 3 has been visited)
  useEffect(() => {
    // Only show errors if user has visited Step 3
    if (formState.step3Visited) {
      const step3Validation = validation.validateStep3(formState.aiQuestionsCount);
      validation.setStepErrors((prev: any) => ({
        ...prev,
        3: {
          hasError: !step3Validation.isValid,
          messages: step3Validation.errors,
        }
      }));
    }
  }, [formState.aiQuestionsCount, formState.step3Visited]);
}
