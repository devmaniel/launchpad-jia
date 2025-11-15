import { useState, useRef } from "react";
import axios from "axios";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { sanitizeHtml, sanitizeText, sanitizeInput } from "@/lib/utils/sanitize";
import { CustomQuestion } from "../02CVReview&Pre-screening/customQuestionTypes";
import { disableBeforeUnloadWarning } from "./useCareerFormStorage";

/**
 * Hook to handle career form submission (create and update)
 * Extended to include validation and save handlers
 */
export function useCareerFormSubmit(
  career: any,
  user: any,
  orgID: string,
  storageKey: string,
  setHasChanges: (value: boolean) => void,
  formState: any,
  validation: any,
  progress: any
) {
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState("");
  const savingCareerRef = useRef(false);

  /**
   * Sanitize custom questions
   */
  const sanitizeCustomQuestions = (questions: CustomQuestion[]) => {
    return questions.map((q: CustomQuestion) => ({
      ...q,
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options.map(o => o || '') : q.options,
      minValue: q.minValue || undefined,
      maxValue: q.maxValue || undefined,
    }));
  };

  /**
   * Sanitize pre-screening questions
   */
  const sanitizePreScreeningQuestions = (questions: any[]) => {
    return questions.map((q: any) => ({
      ...q,
      options: Array.isArray(q.options) ? q.options.map((o: string) => o || '') : q.options,
      answerType: q.answerType || undefined,
      minValue: q.minValue || undefined,
      maxValue: q.maxValue || undefined,
    }));
  };

  /**
   * Sanitize team members
   */
  const sanitizeTeamMembers = (members: any[]) => {
    return members.map((member: any) => ({
      ...member,
      name: sanitizeText(member.name || ''),
      email: sanitizeText(member.email || ''),
      role: sanitizeText(member.role || ''),
    }));
  };

  /**
   * Sanitize pipeline stages
   */
  const sanitizePipelineStages = (stages: any[]) => {
    return stages.map((stage: any) => ({
      ...stage,
      title: sanitizeText(stage.title || ''),
      substages: Array.isArray(stage.substages) ? stage.substages.map((s: string) => sanitizeText(s || '')) : stage.substages,
    }));
  };

  /**
   * Update existing career
   */
  const updateCareer = async (status: string, formData: any) => {
    setIsSavingCareer(true);
    
    const userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };
    
    const updatedCareer = {
      _id: career._id,
      jobTitle: sanitizeInput(formData.jobTitle),
      description: sanitizeHtml(formData.description),
      workSetup: sanitizeText(formData.workSetup),
      workSetupRemarks: sanitizeInput(formData.workSetupRemarks),
      lastEditedBy: userInfoSlice,
      status,
      updatedAt: Date.now(),
      screeningSetting: sanitizeText(formData.screeningSetting),
      requireVideo: formData.requireVideo,
      salaryNegotiable: formData.salaryNegotiable,
      minimumSalary: isNaN(Number(formData.minimumSalary)) ? null : Number(formData.minimumSalary),
      maximumSalary: isNaN(Number(formData.maximumSalary)) ? null : Number(formData.maximumSalary),
      minimumSalaryCurrency: sanitizeText(formData.minimumSalaryCurrency),
      maximumSalaryCurrency: sanitizeText(formData.maximumSalaryCurrency),
      country: sanitizeText(formData.country),
      province: sanitizeText(formData.province),
      location: sanitizeText(formData.city),
      employmentType: sanitizeText(formData.employmentType),
      secretPrompt: formData.secretPrompt,
      preScreeningQuestions: sanitizePreScreeningQuestions(formData.preScreeningQuestions),
      customQuestions: sanitizeCustomQuestions(formData.customQuestions),
      askingMinSalary: formData.askingMinSalary,
      askingMaxSalary: formData.askingMaxSalary,
      askingMinCurrency: sanitizeText(formData.askingMinCurrency),
      askingMaxCurrency: sanitizeText(formData.askingMaxCurrency),
      teamMembers: sanitizeTeamMembers(formData.teamMembers),
      aiInterviewSecretPrompt: formData.aiInterviewSecretPrompt,
      aiInterviewScreeningSetting: sanitizeText(formData.aiInterviewScreeningSetting),
      aiInterviewRequireVideo: formData.aiInterviewRequireVideo,
      aiInterviewQuestions: formData.aiInterviewQuestions,
      pipelineStages: sanitizePipelineStages(formData.pipelineStages),
    };
    
    try {
      const response = await axios.post("/api/update-career", updatedCareer);
      if (response.status === 200) {
        // Show success toast
        const toastContent = document.createElement('div');
        toastContent.style.display = 'flex';
        toastContent.style.flexDirection = 'row';
        toastContent.style.alignItems = 'center';
        toastContent.style.gap = '8px';
        toastContent.style.marginLeft = '8px';
        toastContent.innerHTML = '<span style="font-size: 14px; font-weight: 700; color: #181D27;">Career updated</span>';
        
        const toastIcon = document.createElement('i');
        toastIcon.className = 'la la-check-circle';
        toastIcon.style.color = '#039855';
        toastIcon.style.fontSize = '32px';
        
        candidateActionToast(toastContent, 1300, toastIcon);
        
        setTimeout(() => {
          window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
        }, 1300);
      }
    } catch (error: any) {
      errorToast(error.response?.data?.error || "Failed to update career", 3000);
    } finally {
      setIsSavingCareer(false);
    }
  };

  /**
   * Create new career
   */
  const saveCareer = async (status: string, formData: any) => {
    setShowSaveModal("");
    if (!status || savingCareerRef.current) return;

    savingCareerRef.current = true;
    setIsSavingCareer(true);

    const userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    const career = {
      jobTitle: sanitizeInput(formData.jobTitle),
      description: sanitizeHtml(formData.description),
      workSetup: sanitizeText(formData.workSetup),
      workSetupRemarks: sanitizeInput(formData.workSetupRemarks),
      lastEditedBy: userInfoSlice,
      createdBy: userInfoSlice,
      screeningSetting: sanitizeText(formData.screeningSetting),
      orgID,
      requireVideo: formData.requireVideo,
      salaryNegotiable: formData.salaryNegotiable,
      minimumSalary: isNaN(Number(formData.minimumSalary)) ? null : Number(formData.minimumSalary),
      maximumSalary: isNaN(Number(formData.maximumSalary)) ? null : Number(formData.maximumSalary),
      minimumSalaryCurrency: sanitizeText(formData.minimumSalaryCurrency),
      maximumSalaryCurrency: sanitizeText(formData.maximumSalaryCurrency),
      country: sanitizeText(formData.country),
      province: sanitizeText(formData.province),
      location: sanitizeText(formData.city),
      status,
      employmentType: sanitizeText(formData.employmentType),
      secretPrompt: formData.secretPrompt,
      preScreeningQuestions: sanitizePreScreeningQuestions(formData.preScreeningQuestions),
      customQuestions: sanitizeCustomQuestions(formData.customQuestions),
      askingMinSalary: formData.askingMinSalary,
      askingMaxSalary: formData.askingMaxSalary,
      askingMinCurrency: sanitizeText(formData.askingMinCurrency),
      askingMaxCurrency: sanitizeText(formData.askingMaxCurrency),
      teamMembers: sanitizeTeamMembers(formData.teamMembers),
      aiInterviewSecretPrompt: formData.aiInterviewSecretPrompt,
      aiInterviewScreeningSetting: sanitizeText(formData.aiInterviewScreeningSetting),
      aiInterviewRequireVideo: formData.aiInterviewRequireVideo,
      aiInterviewQuestions: formData.aiInterviewQuestions,
      pipelineStages: sanitizePipelineStages(formData.pipelineStages),
    };

    try {
      const response = await axios.post("/api/add-career", career);
      if (response.status === 200) {
        // Show success toast
        const toastContent = document.createElement('div');
        toastContent.style.display = 'flex';
        toastContent.style.flexDirection = 'row';
        toastContent.style.alignItems = 'center';
        toastContent.style.gap = '8px';
        toastContent.style.marginLeft = '8px';
        toastContent.innerHTML = `<span style="font-size: 14px; font-weight: 700; color: #181D27;">Career added ${status === "active" ? "and published" : ""}</span>`;
        
        const toastIcon = document.createElement('i');
        toastIcon.className = 'la la-check-circle';
        toastIcon.style.color = '#039855';
        toastIcon.style.fontSize = '32px';
        
        candidateActionToast(toastContent, 1300, toastIcon);
        
        setTimeout(() => {
          window.location.href = `/recruiter-dashboard/careers`;
        }, 1300);
      }
    } catch (error: any) {
      errorToast(error.response?.data?.error || "Failed to add career", 3000);
    } finally {
      savingCareerRef.current = false;
      setIsSavingCareer(false);
    }
  };

  /**
   * Handle Save and Continue - validates current step and advances
   */
  const handleSaveAndContinue = () => {
    let validationResult;
    let progressValue: number;

    switch (formState.activeStep) {
      case 1:
        validationResult = validation.validateStep1({
          jobTitle: formState.jobTitle,
          description: formState.description,
          employmentType: formState.employmentType,
          workSetup: formState.workSetup,
          province: formState.province,
          city: formState.city,
          salaryNegotiable: formState.salaryNegotiable,
          minimumSalary: formState.minimumSalary,
          maximumSalary: formState.maximumSalary,
          teamMembers: formState.teamMembers,
        });
        progressValue = progress.calculateStep1Progress({
          jobTitle: formState.jobTitle,
          description: formState.description,
          employmentType: formState.employmentType,
          workSetup: formState.workSetup,
          province: formState.province,
          city: formState.city,
          teamMembers: formState.teamMembers,
        });
        break;
      case 2:
        validationResult = validation.validateStep2();
        progressValue = 1;
        break;
      case 3:
        validationResult = validation.validateStep3(formState.aiQuestionsCount);
        progressValue = progress.calculateStep3Progress(formState.aiQuestionsCount);
        break;
      case 4:
        validationResult = validation.validateStep4();
        progressValue = 1;
        break;
      default:
        return;
    }

    if (!validationResult.isValid) {
      validation.setStepErrors((prev: any) => ({
        ...prev,
        [formState.activeStep]: { hasError: true, messages: validationResult.errors }
      }));
      errorToast(validationResult.errors[0], 3000);
      return;
    }

    progress.setStepProgress((prev: any) => ({ ...prev, [formState.activeStep]: progressValue }));
    validation.setStepErrors((prev: any) => ({ ...prev, [formState.activeStep]: { hasError: false } }));

    if (formState.activeStep < 5) {
      const nextStep = formState.activeStep + 1;
      formState.setActiveStep(nextStep);
      if (nextStep > formState.furthestStep) {
        formState.setFurthestStep(nextStep);
      }
    }
  };

  /**
   * Confirm save career (with validation)
   */
  const confirmSaveCareer = (status: string) => {
    if (
      Number(formState.minimumSalary) &&
      Number(formState.maximumSalary) &&
      Number(formState.minimumSalary) > Number(formState.maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }
    
    if (status === "active") {
      const validationResult = validation.validateForm({
        jobTitle: formState.jobTitle,
        description: formState.description,
        employmentType: formState.employmentType,
        workSetup: formState.workSetup,
        province: formState.province,
        city: formState.city,
        salaryNegotiable: formState.salaryNegotiable,
        minimumSalary: formState.minimumSalary,
        maximumSalary: formState.maximumSalary,
        teamMembers: formState.teamMembers,
        aiQuestionsCount: formState.aiQuestionsCount,
        pipelineStages: formState.pipelineStages,
      });
      
      if (!validationResult.isValid) {
        errorToast(validationResult.errors[0], 3000);
        return;
      }
    } else {
      if (!(formState.jobTitle || "").trim()) {
        errorToast("Job title is required", 3000);
        return;
      }
    }

    setShowSaveModal(status);
  };

  /**
   * Handle save career - builds form data and calls appropriate save method
   */
  const handleSaveCareer = (status: string) => {
    // CRITICAL: Disable beforeunload warning IMMEDIATELY when modal button is clicked
    disableBeforeUnloadWarning();
    
    // Clear sessionStorage
    try { 
      sessionStorage.removeItem('hasChanges'); 
      sessionStorage.removeItem(storageKey); 
    } catch {}
    
    setHasChanges(false);
    
    const formData = {
      jobTitle: formState.jobTitle,
      description: formState.description,
      workSetup: formState.workSetup,
      workSetupRemarks: formState.workSetupRemarks,
      screeningSetting: formState.screeningSetting,
      employmentType: formState.employmentType,
      requireVideo: formState.requireVideo,
      salaryNegotiable: formState.salaryNegotiable,
      minimumSalary: formState.minimumSalary,
      maximumSalary: formState.maximumSalary,
      minimumSalaryCurrency: formState.minimumSalaryCurrency,
      maximumSalaryCurrency: formState.maximumSalaryCurrency,
      country: formState.country,
      province: formState.province,
      city: formState.city,
      teamMembers: formState.teamMembers,
      secretPrompt: formState.secretPrompt,
      preScreeningQuestions: formState.preScreeningQuestions,
      customQuestions: formState.customQuestions,
      askingMinSalary: formState.askingMinSalary,
      askingMaxSalary: formState.askingMaxSalary,
      askingMinCurrency: formState.askingMinCurrency,
      askingMaxCurrency: formState.askingMaxCurrency,
      aiInterviewSecretPrompt: formState.aiInterviewSecretPrompt,
      aiInterviewScreeningSetting: formState.aiInterviewScreeningSetting,
      aiInterviewRequireVideo: formState.aiInterviewRequireVideo,
      aiInterviewQuestions: formState.aiInterviewQuestions,
      pipelineStages: formState.pipelineStages,
    };

    if (career) {
      updateCareer(status, formData);
    } else {
      saveCareer(status, formData);
    }
  };

  return {
    isSavingCareer,
    showSaveModal,
    setShowSaveModal,
    updateCareer,
    saveCareer,
    handleSaveAndContinue,
    confirmSaveCareer,
    handleSaveCareer,
  };
}
