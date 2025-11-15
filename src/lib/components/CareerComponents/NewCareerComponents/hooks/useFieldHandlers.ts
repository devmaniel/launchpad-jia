import { FieldErrors, FieldTouched } from "../types/careerForm.types";

/**
 * Hook to create field blur and change handlers
 */
export function useFieldHandlers(
  setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
  setFieldTouched: React.Dispatch<React.SetStateAction<FieldTouched>>,
  setCareerInfoTouched: (value: boolean) => void
) {
  const handleJobTitleBlur = (jobTitle: string) => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, jobTitle: true }));
    setErrors((prev) => ({ ...prev, jobTitle: (jobTitle || "").trim().length === 0 }));
  };

  const handleProvinceBlur = (province: string) => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, province: true }));
    setErrors((prev) => ({ ...prev, province: (province || "").trim().length === 0 }));
  };

  const handleCityBlur = (city: string) => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, city: true }));
    setErrors((prev) => ({ ...prev, city: (city || "").trim().length === 0 }));
  };

  const handleEmploymentTypeBlur = (employmentType: string) => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, employmentType: true }));
    setErrors((prev) => ({ ...prev, employmentType: (employmentType || "").trim().length === 0 }));
  };

  const handleWorkSetupBlur = (workSetup: string) => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, workSetup: true }));
    setErrors((prev) => ({ ...prev, workSetup: (workSetup || "").trim().length === 0 }));
  };

  const handleMinimumSalaryBlur = (minimumSalary: string, salaryNegotiable: boolean) => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, minimumSalary: true }));
    if (!salaryNegotiable) {
      setErrors((prev) => ({ ...prev, minimumSalary: (minimumSalary || "").trim().length === 0 }));
    }
  };

  const handleMaximumSalaryBlur = (maximumSalary: string, salaryNegotiable: boolean) => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, maximumSalary: true }));
    if (!salaryNegotiable) {
      setErrors((prev) => ({ ...prev, maximumSalary: (maximumSalary || "").trim().length === 0 }));
    }
  };

  const handleDescriptionBlur = () => {
    setFieldTouched((prev) => ({ ...prev, description: true }));
  };

  const handleTeamAccessOpen = () => {
    setFieldTouched((prev) => ({ ...prev, teamAccess: true }));
  };

  return {
    handleJobTitleBlur,
    handleProvinceBlur,
    handleCityBlur,
    handleEmploymentTypeBlur,
    handleWorkSetupBlur,
    handleMinimumSalaryBlur,
    handleMaximumSalaryBlur,
    handleDescriptionBlur,
    handleTeamAccessOpen,
  };
}
