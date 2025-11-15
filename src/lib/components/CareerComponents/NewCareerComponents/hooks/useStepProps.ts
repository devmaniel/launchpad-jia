/**
 * Hook to consolidate all step component props
 * Reduces prop-drilling boilerplate in main component
 */
export function useStepProps(
  formState: any,
  validation: any,
  handlers: any,
  location: any
) {
  return {
    step1: {
      jobTitle: formState.jobTitle,
      setJobTitle: (val: string) => {
        formState.setJobTitle(val);
        if ((val || "").trim().length > 0) {
          validation.setErrors((prev: any) => ({ ...prev, jobTitle: false }));
        }
      },
      employmentType: formState.employmentType,
      setEmploymentType: (val: string) => {
        formState.setEmploymentType(val);
        validation.setCareerInfoTouched(true);
        validation.setFieldTouched((prev: any) => ({ ...prev, employmentType: true }));
        if (val && val.trim().length > 0) {
          validation.setErrors((prev: any) => ({ ...prev, employmentType: false }));
        }
      },
      onEmploymentTypeBlur: () => handlers.handleEmploymentTypeBlur(formState.employmentType),
      workSetup: formState.workSetup,
      setWorkSetup: (val: string) => {
        formState.setWorkSetup(val);
        validation.setCareerInfoTouched(true);
        validation.setFieldTouched((prev: any) => ({ ...prev, workSetup: true }));
        if (val && val.trim().length > 0) {
          validation.setErrors((prev: any) => ({ ...prev, workSetup: false }));
        }
      },
      onWorkSetupBlur: () => handlers.handleWorkSetupBlur(formState.workSetup),
      country: formState.country,
      setCountry: formState.setCountry,
      province: formState.province,
      setProvince: (val: string) => {
        formState.setProvince(val);
        validation.setCareerInfoTouched(true);
        validation.setFieldTouched((prev: any) => ({ ...prev, province: true }));
        if (val && val.trim().length > 0) {
          validation.setErrors((prev: any) => ({ ...prev, province: false }));
        }
      },
      city: formState.city,
      setCity: (val: string) => {
        formState.setCity(val);
        validation.setCareerInfoTouched(true);
        validation.setFieldTouched((prev: any) => ({ ...prev, city: true }));
        if (val && val.trim().length > 0) {
          validation.setErrors((prev: any) => ({ ...prev, city: false }));
        }
      },
      provinceList: location.provinceList,
      cityList: location.cityList,
      setCityList: location.setCityList,
      onProvinceBlur: () => handlers.handleProvinceBlur(formState.province),
      onCityBlur: () => handlers.handleCityBlur(formState.city),
      salaryNegotiable: formState.salaryNegotiable,
      setSalaryNegotiable: (val: boolean) => {
        formState.setSalaryNegotiable(val);
        validation.setCareerInfoTouched(true);
        if (val) {
          validation.setErrors((prev: any) => ({ ...prev, minimumSalary: false, maximumSalary: false }));
        }
      },
      minimumSalary: formState.minimumSalary,
      setMinimumSalary: (val: string) => {
        formState.setMinimumSalary(val);
        validation.setCareerInfoTouched(true);
        if ((val || "").trim().length > 0) {
          validation.setErrors((prev: any) => ({ ...prev, minimumSalary: false }));
        }
      },
      maximumSalary: formState.maximumSalary,
      setMaximumSalary: (val: string) => {
        formState.setMaximumSalary(val);
        validation.setCareerInfoTouched(true);
        if ((val || "").trim().length > 0) {
          validation.setErrors((prev: any) => ({ ...prev, maximumSalary: false }));
        }
      },
      minimumSalaryCurrency: formState.minimumSalaryCurrency,
      setMinimumSalaryCurrency: formState.setMinimumSalaryCurrency,
      maximumSalaryCurrency: formState.maximumSalaryCurrency,
      setMaximumSalaryCurrency: formState.setMaximumSalaryCurrency,
      description: formState.description,
      setDescription: formState.setDescription,
      onJobTitleBlur: () => handlers.handleJobTitleBlur(formState.jobTitle),
      descriptionError: validation.descriptionTouched && validation.stripHtml(formState.description).length === 0,
      onDescriptionBlur: () => {
        validation.setDescriptionTouched(true);
        validation.setFieldTouched((prev: any) => ({ ...prev, description: true }));
      },
      onMinimumSalaryBlur: () => handlers.handleMinimumSalaryBlur(formState.minimumSalary, formState.salaryNegotiable),
      onMaximumSalaryBlur: () => handlers.handleMaximumSalaryBlur(formState.maximumSalary, formState.salaryNegotiable),
      teamMembers: formState.teamMembers,
      setTeamMembers: formState.setTeamMembers,
      errors: validation.errors,
      onTeamAccessOpen: () => {
        validation.setTeamAccessTouched(true);
        validation.setFieldTouched((prev: any) => ({ ...prev, teamAccess: true }));
      },
    },
    step2: {
      screeningSetting: formState.screeningSetting,
      setScreeningSetting: formState.setScreeningSetting,
      secretPrompt: formState.secretPrompt,
      setSecretPrompt: formState.setSecretPrompt,
      preScreeningQuestions: formState.preScreeningQuestions,
      setPreScreeningQuestions: formState.setPreScreeningQuestions,
      customQuestions: formState.customQuestions,
      setCustomQuestions: formState.setCustomQuestions,
      askingMinSalary: formState.askingMinSalary,
      askingMaxSalary: formState.askingMaxSalary,
      askingMinCurrency: formState.askingMinCurrency,
      askingMaxCurrency: formState.askingMaxCurrency,
      onAskingMinSalaryChange: formState.setAskingMinSalary,
      onAskingMaxSalaryChange: formState.setAskingMaxSalary,
      onAskingMinCurrencyChange: formState.setAskingMinCurrency,
      onAskingMaxCurrencyChange: formState.setAskingMaxCurrency,
    },
    step3: {
      onQuestionsCountChange: (n: number) => formState.setAiQuestionsCount(n),
      onQuestionsChange: (questions: any[]) => formState.setAiInterviewQuestions(questions),
      aiInterviewSecretPrompt: formState.aiInterviewSecretPrompt,
      setAiInterviewSecretPrompt: formState.setAiInterviewSecretPrompt,
      aiInterviewScreeningSetting: formState.aiInterviewScreeningSetting,
      setAiInterviewScreeningSetting: formState.setAiInterviewScreeningSetting,
      aiInterviewRequireVideo: formState.aiInterviewRequireVideo,
      setAiInterviewRequireVideo: formState.setAiInterviewRequireVideo,
      jobTitle: formState.jobTitle,
      jobDescription: formState.description,
      employmentType: formState.employmentType,
      workSetup: formState.workSetup,
      initialQuestions: formState.aiInterviewQuestions,
    },
    step4: {
      pipelineStages: formState.pipelineStages,
      setPipelineStages: formState.setPipelineStages,
    },
    step5: {
      screeningSetting: formState.screeningSetting,
      secretPrompt: formState.secretPrompt,
      preScreeningQuestions: formState.preScreeningQuestions,
      customQuestions: formState.customQuestions,
      jobTitle: formState.jobTitle,
      employmentType: formState.employmentType,
      workSetup: formState.workSetup,
      country: formState.country,
      province: formState.province,
      city: formState.city,
      descriptionHtml: formState.description,
      teamMembers: formState.teamMembers,
      minimumSalary: formState.minimumSalary,
      maximumSalary: formState.maximumSalary,
      minimumSalaryCurrency: formState.minimumSalaryCurrency,
      maximumSalaryCurrency: formState.maximumSalaryCurrency,
      salaryNegotiable: formState.salaryNegotiable,
      askingMinSalary: formState.askingMinSalary,
      askingMaxSalary: formState.askingMaxSalary,
      askingMinCurrency: formState.askingMinCurrency,
      askingMaxCurrency: formState.askingMaxCurrency,
      pipelineStages: formState.pipelineStages,
      aiInterviewSecretPrompt: formState.aiInterviewSecretPrompt,
      aiInterviewScreeningSetting: formState.aiInterviewScreeningSetting,
      aiInterviewRequireVideo: formState.aiInterviewRequireVideo,
      onEditCareerDetails: () => formState.setActiveStep(1),
      onEditCVScreening: () => formState.setActiveStep(2),
      onEditAIInterview: () => formState.setActiveStep(3),
      onEditPipelineStages: () => formState.setActiveStep(4),
    },
  };
}
