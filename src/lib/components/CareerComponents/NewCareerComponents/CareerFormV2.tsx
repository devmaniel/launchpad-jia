"use client";

import { useEffect, useRef, useState } from "react";
import philippineCitiesAndProvinces from "../../../../../public/philippines-locations.json";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "../CareerActionModal";
import FullScreenLoadingAnimation from "../FullScreenLoadingAnimation";
import FormHeader from "./FormHeader";
import Step1 from "./01CareerDetails&TeamAccess/Step1";
import Stepper from "./Stepper";
import Step2 from "./02CVReview&Pre-screening/Step2";
import Step3 from "./03AISetupInterview/Step3";
import Step4 from "./04PipelineStages/Step4";
import Step5 from "./05ReviewCareer/Step5";
import { CustomQuestion } from "./02CVReview&Pre-screening/customQuestionTypes";
import { sanitizeHtml, sanitizeText, sanitizeInput } from "@/lib/utils/sanitize";

export default function CareerFormV2({
  career,
  formType,
  setShowEditModal,
  currentStep = 1,
  forcePrefill = false,
}: {
  career?: any;
  formType: string;
  setShowEditModal?: (show: boolean) => void;
  currentStep?: number;
  forcePrefill?: boolean;
}) {
  const PREFILL_ENABLED = process.env.NEXT_PUBLIC_PREFILL_CAREER_FORM === 'true';
  const storageKey = career?._id ? `careerFormV2:${career._id}` : 'careerFormV2:new';
  const [activeStep, setActiveStep] = useState<number>(currentStep);
  const [furthestStep, setFurthestStep] = useState<number>(currentStep);
  const { user, orgID } = useAppContext();
  const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
  const [description, setDescription] = useState(career?.description || "");
  const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
  const [workSetupRemarks, setWorkSetupRemarks] = useState(
    career?.workSetupRemarks || ""
  );
  const [screeningSetting, setScreeningSetting] = useState(
    career?.screeningSetting || "Good Fit and above"
  );
  const [employmentType, setEmploymentType] = useState(
    career?.employmentType || ""
  );
  const [requireVideo, setRequireVideo] = useState(
    career?.requireVideo ?? false
  );
  const [salaryNegotiable, setSalaryNegotiable] = useState(
    career?.salaryNegotiable ?? false
  );
  const [minimumSalary, setMinimumSalary] = useState(
    career?.minimumSalary || ""
  );
  const [maximumSalary, setMaximumSalary] = useState(
    career?.maximumSalary || ""
  );
  const [minimumSalaryCurrency, setMinimumSalaryCurrency] = useState(
    career?.minimumSalaryCurrency || "PHP"
  );
  const [maximumSalaryCurrency, setMaximumSalaryCurrency] = useState(
    career?.maximumSalaryCurrency || "PHP"
  );
  const [secretPrompt, setSecretPrompt] = useState(career?.secretPrompt || "");
  const [aiInterviewSecretPrompt, setAiInterviewSecretPrompt] = useState(
    career?.aiInterviewSecretPrompt || ""
  );
  const [aiInterviewScreeningSetting, setAiInterviewScreeningSetting] = useState(
    career?.aiInterviewScreeningSetting || "Good Fit and above"
  );
  const [aiInterviewRequireVideo, setAiInterviewRequireVideo] = useState(
    career?.aiInterviewRequireVideo ?? false
  );
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<any[]>(
    Array.isArray(career?.preScreeningQuestions) ? career?.preScreeningQuestions : []
  );
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>(
    Array.isArray((career as any)?.customQuestions) ? (career as any).customQuestions : []
  );
  // Asking Salary for Pre-Screening (Step 2) – separate from Step 1 job salary
  const [askingMinSalary, setAskingMinSalary] = useState<string>(
    (career as any)?.askingMinSalary ?? (career?.minimumSalary || "")
  );
  const [askingMaxSalary, setAskingMaxSalary] = useState<string>(
    (career as any)?.askingMaxSalary ?? (career?.maximumSalary || "")
  );
  const [askingMinCurrency, setAskingMinCurrency] = useState<string>(
    (career as any)?.askingMinCurrency ?? (career?.minimumSalaryCurrency || "PHP")
  );
  const [askingMaxCurrency, setAskingMaxCurrency] = useState<string>(
    (career as any)?.askingMaxCurrency ?? (career?.maximumSalaryCurrency || "PHP")
  );
  const [country, setCountry] = useState(career?.country || "Philippines");
  const [province, setProvince] = useState(career?.province || "");
  const [city, setCity] = useState(career?.location || "");
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState("");
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const savingCareerRef = useRef(false);
  const [teamMembers, setTeamMembers] = useState(
    (user && user.email)
      ? ([{ name: user.name, email: user.email, role: "Job Owner", isOwner: true, avatar: user.image }] as any[])
      : ([] as any[])
  );
  const [aiQuestionsCount, setAiQuestionsCount] = useState<number>(0);
  const [aiInterviewQuestions, setAiInterviewQuestions] = useState<any[]>([]);
  const [pipelineStages, setPipelineStages] = useState<any[]>(
    career?.pipelineStages || [
      {
        icon: "/temp/user-temp.svg",
        title: "CV Screening",
        substages: ["Waiting Submission", "For Review"],
        isCore: true,
      },
      {
        icon: "/temp/mic.svg",
        title: "AI Interview",
        substages: ["Waiting Interview", "For Review"],
        isCore: true,
      },
      {
        icon: "/temp/user-temp.svg",
        title: "Final Human Interview",
        substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"],
        isCore: true,
      },
      {
        icon: "/temp/user-temp.svg",
        title: "Job Offer",
        substages: ["For Final Interview", "Waiting Offer Acceptance", "For Contract Signing", "Hired"],
        isCore: true,
      },
    ]
  );

  const baselineRef = useRef<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Step progress tracking (0-1 for each step)
  const [stepProgress, setStepProgress] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });

  // Step error tracking
  const [stepErrors, setStepErrors] = useState<Record<number, { hasError: boolean; messages?: string[] }>>({
    1: { hasError: false },
    2: { hasError: false },
    3: { hasError: false },
    4: { hasError: false },
    5: { hasError: false },
  });

  // Track if Step 3 has been visited
  const [step3Visited, setStep3Visited] = useState(false);

  // Handle step click navigation
  const handleStepClick = (stepId: number) => {
    // Only allow navigation to steps that have been unlocked (at or before furthest step)
    if (stepId <= furthestStep) {
      setActiveStep(stepId);
    }
  };

  // Ensure current user is present as Job Owner once user context is ready
  useEffect(() => {
    if (user?.email) {
      const hasOwner = teamMembers.some((m: any) => m.email === user.email && m.isOwner);
      if (!hasOwner) {
        setTeamMembers((prev: any[]) => [{ name: user.name, email: user.email, role: "Job Owner", isOwner: true, avatar: user.image }, ...prev]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // Error state - set to true to show errors
  const [errors, setErrors] = useState({
    jobTitle: false,
    employmentType: false,
    workSetup: false,
    province: false,
    city: false,
    minimumSalary: false,
    maximumSalary: false,
  });
  
  // Individual touched states for each field
  const [fieldTouched, setFieldTouched] = useState({
    jobTitle: false,
    description: false,
    employmentType: false,
    workSetup: false,
    province: false,
    city: false,
    minimumSalary: false,
    maximumSalary: false,
    teamAccess: false,
  });
  
  // Legacy touched states (kept for compatibility)
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [careerInfoTouched, setCareerInfoTouched] = useState(false);
  const [teamAccessTouched, setTeamAccessTouched] = useState(false);

  // Calculate progress for Step 1 (Career Details & Team Access)
  const calculateStep1Progress = () => {
    let filled = 0;
    let total = 6; // jobTitle, description, employmentType, workSetup, location, teamOwner

    if ((jobTitle || "").trim().length > 0) filled++;
    
    const stripped = (description || "")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();
    if (stripped.length > 0) filled++;
    
    if ((employmentType || "").trim().length > 0) filled++;
    if ((workSetup || "").trim().length > 0) filled++;
    if ((province || "").trim().length > 0 && (city || "").trim().length > 0) filled++;
    
    const hasOwner = teamMembers.some((m: any) => m.isOwner);
    if (hasOwner) filled++;

    return filled / total;
  };

  // Calculate progress for Step 3 (AI Interview Setup)
  const calculateStep3Progress = () => {
    // Need 5 AI Interview Questions
    const questionCount = aiInterviewQuestions?.length || 0;
    return Math.min(questionCount / 5, 1);
  };

  // Update step progress dynamically as user fills form (but don't mark as complete)
  useEffect(() => {
    if (activeStep === 1) {
      const progress = calculateStep1Progress();
      // Only update if not already complete (< 1)
      if (stepProgress[1] < 1) {
        setStepProgress(prev => ({ ...prev, 1: progress }));
      }
    } else if (activeStep === 2) {
      // Step 2 is optional - don't auto-complete, only mark complete after Save and Continue
      // Keep progress at 0 unless already marked complete (via Save and Continue)
      if (stepProgress[2] < 1) {
        setStepProgress(prev => ({ ...prev, 2: 0 }));
      }
    } else if (activeStep === 3) {
      const progress = calculateStep3Progress();
      // Only update if not already complete (< 1)
      if (stepProgress[3] < 1) {
        setStepProgress(prev => ({ ...prev, 3: progress }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitle, description, employmentType, workSetup, province, city, teamMembers, aiInterviewQuestions, activeStep, screeningSetting]);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.activeStep === 'number') setActiveStep(data.activeStep);
        if (typeof data.jobTitle === 'string') setJobTitle(data.jobTitle);
        if (typeof data.description === 'string') setDescription(data.description);
        if (typeof data.workSetup === 'string') setWorkSetup(data.workSetup);
        if (typeof data.workSetupRemarks === 'string') setWorkSetupRemarks(data.workSetupRemarks);
        if (typeof data.screeningSetting === 'string') setScreeningSetting(data.screeningSetting);
        if (typeof data.employmentType === 'string') setEmploymentType(data.employmentType);
        if (typeof data.requireVideo === 'boolean') setRequireVideo(data.requireVideo);
        if (typeof data.salaryNegotiable === 'boolean') setSalaryNegotiable(data.salaryNegotiable);
        if (typeof data.minimumSalary === 'string') setMinimumSalary(data.minimumSalary);
        if (typeof data.maximumSalary === 'string') setMaximumSalary(data.maximumSalary);
        if (typeof data.minimumSalaryCurrency === 'string') setMinimumSalaryCurrency(data.minimumSalaryCurrency);
        if (typeof data.maximumSalaryCurrency === 'string') setMaximumSalaryCurrency(data.maximumSalaryCurrency);
        if (typeof data.country === 'string') setCountry(data.country);
        if (typeof data.province === 'string') setProvince(data.province);
        if (typeof data.city === 'string') setCity(data.city);
        if (Array.isArray(data.teamMembers)) setTeamMembers(data.teamMembers);
        if (typeof data.secretPrompt === 'string') setSecretPrompt(data.secretPrompt);
        if (Array.isArray(data.preScreeningQuestions)) setPreScreeningQuestions(data.preScreeningQuestions);
        if (Array.isArray(data.customQuestions)) setCustomQuestions(data.customQuestions);
        if (typeof data.askingMinSalary === 'string') setAskingMinSalary(data.askingMinSalary);
        if (typeof data.askingMaxSalary === 'string') setAskingMaxSalary(data.askingMaxSalary);
        if (typeof data.askingMinCurrency === 'string') setAskingMinCurrency(data.askingMinCurrency);
        if (typeof data.askingMaxCurrency === 'string') setAskingMaxCurrency(data.askingMaxCurrency);
        if (typeof data.descriptionTouched === 'boolean') setDescriptionTouched(data.descriptionTouched);
        if (typeof data.careerInfoTouched === 'boolean') setCareerInfoTouched(data.careerInfoTouched);
        if (typeof data.teamAccessTouched === 'boolean') setTeamAccessTouched(data.teamAccessTouched);
        if (data.fieldTouched && typeof data.fieldTouched === 'object') setFieldTouched(data.fieldTouched);

        baselineRef.current = {
          jobTitle: data.jobTitle ?? '',
          description: data.description ?? '',
          workSetup: data.workSetup ?? '',
          workSetupRemarks: data.workSetupRemarks ?? '',
          screeningSetting: data.screeningSetting ?? 'Good Fit and above',
          employmentType: data.employmentType ?? '',
          requireVideo: typeof data.requireVideo === 'boolean' ? data.requireVideo : false,
          salaryNegotiable: typeof data.salaryNegotiable === 'boolean' ? data.salaryNegotiable : false,
          minimumSalary: data.minimumSalary ?? '',
          maximumSalary: data.maximumSalary ?? '',
          minimumSalaryCurrency: data.minimumSalaryCurrency ?? 'PHP',
          maximumSalaryCurrency: data.maximumSalaryCurrency ?? 'PHP',
          country: data.country ?? 'Philippines',
          province: data.province ?? '',
          city: data.city ?? '',
          teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : [],
          secretPrompt: data.secretPrompt ?? '',
          preScreeningQuestions: Array.isArray(data.preScreeningQuestions) ? data.preScreeningQuestions : [],
          customQuestions: Array.isArray(data.customQuestions) ? data.customQuestions : [],
          askingMinSalary: data.askingMinSalary ?? (data.minimumSalary ?? ''),
          askingMaxSalary: data.askingMaxSalary ?? (data.maximumSalary ?? ''),
          askingMinCurrency: data.askingMinCurrency ?? (data.minimumSalaryCurrency ?? 'PHP'),
          askingMaxCurrency: data.askingMaxCurrency ?? (data.maximumSalaryCurrency ?? 'PHP'),
        };
      }
      else {
        baselineRef.current = {
          jobTitle,
          description,
          workSetup,
          workSetupRemarks,
          screeningSetting,
          employmentType,
          requireVideo,
          salaryNegotiable,
          minimumSalary,
          maximumSalary,
          minimumSalaryCurrency,
          maximumSalaryCurrency,
          country,
          province,
          city,
          teamMembers,
          secretPrompt,
          preScreeningQuestions,
          customQuestions,
          askingMinSalary,
          askingMaxSalary,
          askingMinCurrency,
          askingMaxCurrency,
        };
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const current = {
        jobTitle,
        description,
        workSetup,
        workSetupRemarks,
        screeningSetting,
        employmentType,
        requireVideo,
        salaryNegotiable,
        minimumSalary,
        maximumSalary,
        minimumSalaryCurrency,
        maximumSalaryCurrency,
        country,
        province,
        city,
        teamMembers,
        secretPrompt,
        preScreeningQuestions,
        customQuestions,
        askingMinSalary,
        askingMaxSalary,
        askingMinCurrency,
        askingMaxCurrency,
      } as any;

      if (!baselineRef.current) {
        baselineRef.current = current;
      }

      const base = baselineRef.current as any;
      const keys = Object.keys(base);
      let dirty = false;
      for (const k of keys) {
        const a = base[k];
        const b = (current as any)[k];
        const isArray = Array.isArray(a) || Array.isArray(b);
        if (isArray) {
          if (JSON.stringify(a) !== JSON.stringify(b)) {
            dirty = true;
            break;
          }
        } else if (a !== b) {
          dirty = true;
          break;
        }
      }
      setHasChanges(dirty);
      sessionStorage.setItem('hasChanges', dirty ? 'true' : 'false');
    } catch {}
  }, [jobTitle, description, workSetup, workSetupRemarks, screeningSetting, employmentType, requireVideo, salaryNegotiable, minimumSalary, maximumSalary, minimumSalaryCurrency, maximumSalaryCurrency, country, province, city, teamMembers, secretPrompt, preScreeningQuestions, customQuestions, askingMinSalary, askingMaxSalary, askingMinCurrency, askingMaxCurrency]);

  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  useEffect(() => {
    const onPopState = () => {
      try {
        if (typeof window === 'undefined') return;
        const dirty = sessionStorage.getItem('hasChanges') === 'true';
        if (dirty) {
          const confirmed = window.confirm(
            "You have unsaved changes. Are you sure you want to leave this page?"
          );
          if (!confirmed) {
            history.go(1);
          }
        }
      } catch {}
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const onPageHide = () => {
      try {
        sessionStorage.removeItem('hasChanges');
        sessionStorage.removeItem(storageKey);
      } catch {}
    };
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [storageKey]);

  useEffect(() => {
    return () => {
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('hasChanges');
          sessionStorage.removeItem(storageKey);
        }
      } catch {}
    };
  }, []);


  const validateForm = () => {
    const errors: string[] = [];
    
    // Step 1: Career Details & Team Access
    const stripped = (description || "")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();
    
    if (!(jobTitle || "").trim()) errors.push("Job title is required");
    if (!stripped) errors.push("Job description is required");
    if (!(employmentType || "").trim()) errors.push("Employment type is required");
    if (!(workSetup || "").trim()) errors.push("Work setup is required");
    if (!(province || "").trim()) errors.push("Province is required");
    if (!(city || "").trim()) errors.push("City is required");
    if (!salaryNegotiable) {
      if (!(minimumSalary || "").trim()) errors.push("Minimum salary is required");
      if (!(maximumSalary || "").trim()) errors.push("Maximum salary is required");
    }
    
    // Check for at least 1 Job Owner
    const hasJobOwner = teamMembers.some((m: any) => m?.isOwner);
    if (!hasJobOwner) errors.push("At least one Job Owner is required in Team Access");
    
    // Step 2: CV Review & Pre-screening (all optional)
    // No validation needed
    
    // Step 3: AI Interview Questions - must have at least 5 questions
    if (aiQuestionsCount < 5) {
      errors.push("AI Interview must have at least 5 questions");
    }
    
    // Step 4: Pipeline Stages - core 4 stages must exist (default)
    const coreStageCount = pipelineStages.filter((s: any) => s.isCore).length;
    if (coreStageCount < 4) {
      errors.push("All 4 core pipeline stages are required");
    }
    
    return { isValid: errors.length === 0, errors };
  };

  // Validate Step 1
  const validateStep1 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!(jobTitle || "").trim()) errors.push("Job Title is required");
    
    const stripped = (description || "")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();
    if (!stripped) errors.push("Job Description is required");
    
    if (!(employmentType || "").trim()) errors.push("Employment Type is required");
    if (!(workSetup || "").trim()) errors.push("Work Setup is required");
    if (!(province || "").trim() || !(city || "").trim()) errors.push("Location (Province and City) is required");
    
    // Only validate salary if not negotiable
    if (!salaryNegotiable) {
      if (!(minimumSalary || "").trim()) errors.push("Minimum salary is required");
      if (!(maximumSalary || "").trim()) errors.push("Maximum salary is required");
    }
    
    const hasOwner = teamMembers.some((m: any) => m.isOwner);
    if (!hasOwner) errors.push("At least one Job Owner is required");

    return { isValid: errors.length === 0, errors };
  };

  // Calculate progress for Step 2 (CV Review & Pre-screening) - Optional step
  const calculateStep2Progress = () => {
    // Step 2 is optional, so we consider it complete if user has visited and clicked continue
    return stepProgress[2];
  };

  // Validate Step 2 - Always valid since it's optional
  const validateStep2 = (): { isValid: boolean; errors: string[] } => {
    return { isValid: true, errors: [] };
  };

  // Validate Step 3
  const validateStep3 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const questionCount = aiInterviewQuestions?.length || 0;
    
    if (questionCount < 5) {
      errors.push(`AI Interview requires 5 questions (currently ${questionCount})`);
    }

    return { isValid: errors.length === 0, errors };
  };

  // Calculate progress for Step 4 (Pipeline Stages) - Core data already set
  const calculateStep4Progress = () => {
    // Step 4 is considered complete if user has visited and clicked continue
    return stepProgress[4];
  };

  // Validate Step 4 - Always valid since core pipeline is already set
  const validateStep4 = (): { isValid: boolean; errors: string[] } => {
    return { isValid: true, errors: [] };
  };

  // Save and Continue handler
  const handleSaveAndContinue = () => {
    let validation: { isValid: boolean; errors: string[] };
    let progress: number;

    switch (activeStep) {
      case 1:
        validation = validateStep1();
        progress = calculateStep1Progress();
        break;
      case 2:
        validation = validateStep2();
        progress = 1; // Mark as complete when continuing
        break;
      case 3:
        validation = validateStep3();
        progress = calculateStep3Progress();
        break;
      case 4:
        validation = validateStep4();
        progress = 1; // Mark as complete when continuing
        break;
      default:
        return;
    }

    if (!validation.isValid) {
      setStepErrors(prev => ({
        ...prev,
        [activeStep]: { hasError: true, messages: validation.errors }
      }));
      errorToast(validation.errors[0], 3000);
      return;
    }

    // Update progress and clear errors
    setStepProgress(prev => ({ ...prev, [activeStep]: progress }));
    setStepErrors(prev => ({
      ...prev,
      [activeStep]: { hasError: false }
    }));

    // Move to next step
    if (activeStep < 5) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      // Update furthest step if we're progressing forward
      if (nextStep > furthestStep) {
        setFurthestStep(nextStep);
      }
    }
  };

  const isFormValid = () => {
    // Basic validation for enabling buttons
    const stripped = (description || "")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();
    return (
      (jobTitle || "").trim().length > 0 &&
      stripped.length > 0 &&
      (workSetup || "").trim().length > 0
    );
  };

  const updateCareer = async (status: string) => {
    console.log('=== UPDATE CAREER STARTED ===');
    console.log('Status:', status);
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }
    
    // Validate before publishing
    if (status === "active") {
      const validation = validateForm();
      console.log('Validation result:', validation);
      if (!validation.isValid) {
        errorToast(validation.errors[0], 3000);
        return;
      }
    }
    
    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };
    console.log('AI Questions Count:', aiQuestionsCount);
    console.log('AI Interview Questions:', aiInterviewQuestions);
    console.log('Team Members:', teamMembers);
    console.log('Pipeline Stages:', pipelineStages);
    
    // Sanitize all user-provided text fields before saving to database
    const sanitizedCustomQuestions = customQuestions.map((q: CustomQuestion) => ({
      ...q,
      question: sanitizeInput(q.question || ''),
      options: Array.isArray(q.options) ? q.options.map(o => sanitizeInput(o || '')) : q.options,
    }));

    const sanitizedTeamMembers = teamMembers.map((member: any) => ({
      ...member,
      name: sanitizeText(member.name || ''),
      email: sanitizeText(member.email || ''),
      role: sanitizeText(member.role || ''),
    }));

    const sanitizedPipelineStages = pipelineStages.map((stage: any) => ({
      ...stage,
      title: sanitizeText(stage.title || ''),
      substages: Array.isArray(stage.substages) ? stage.substages.map((s: string) => sanitizeText(s || '')) : stage.substages,
    }));
    
    const updatedCareer = {
      _id: career._id,
      jobTitle: sanitizeInput(jobTitle),
      description: sanitizeHtml(description),
      workSetup: sanitizeText(workSetup),
      workSetupRemarks: sanitizeInput(workSetupRemarks),
      lastEditedBy: userInfoSlice,
      status,
      updatedAt: Date.now(),
      screeningSetting: sanitizeText(screeningSetting),
      requireVideo,
      salaryNegotiable,
      minimumSalary: isNaN(Number(minimumSalary))
        ? null
        : Number(minimumSalary),
      maximumSalary: isNaN(Number(maximumSalary))
        ? null
        : Number(maximumSalary),
      minimumSalaryCurrency: sanitizeText(minimumSalaryCurrency),
      maximumSalaryCurrency: sanitizeText(maximumSalaryCurrency),
      country: sanitizeText(country),
      province: sanitizeText(province),
      location: sanitizeText(city),
      employmentType: sanitizeText(employmentType),
      secretPrompt: sanitizeHtml(secretPrompt),
      preScreeningQuestions,
      customQuestions: sanitizedCustomQuestions,
      askingMinSalary,
      askingMaxSalary,
      askingMinCurrency: sanitizeText(askingMinCurrency),
      askingMaxCurrency: sanitizeText(askingMaxCurrency),
      teamMembers: sanitizedTeamMembers,
      aiInterviewSecretPrompt: sanitizeHtml(aiInterviewSecretPrompt),
      aiInterviewScreeningSetting: sanitizeText(aiInterviewScreeningSetting),
      aiInterviewRequireVideo,
      aiInterviewQuestions,
      pipelineStages: sanitizedPipelineStages,
    };
    console.log('=== UPDATED CAREER OBJECT TO BE POSTED ===');
    console.log(JSON.stringify(updatedCareer, null, 2));
    
    try {
      setIsSavingCareer(true);
      console.log('Posting to /api/update-career...');
      const response = await axios.post("/api/update-career", updatedCareer);
      console.log('Response:', response);
      if (response.status === 200) {
        // Clear all change tracking to prevent browser warning
        setHasChanges(false);
        try { 
          sessionStorage.removeItem('hasChanges'); 
          sessionStorage.removeItem(storageKey); 
        } catch {}
        candidateActionToast(
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginLeft: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
              Career updated
            </span>
          </div>,
          1300,
          <i
            className="la la-check-circle"
            style={{ color: "#039855", fontSize: 32 }}
          ></i>
        );
        setTimeout(() => {
          window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
        }, 1300);
      }
    } catch (error: any) {
      console.error('=== ERROR UPDATING CAREER ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error response data:', error.response?.data);
      errorToast(error.response?.data?.error || "Failed to update career", 3000);
    } finally {
      setIsSavingCareer(false);
    }
  };

  const confirmSaveCareer = (status: string) => {
    console.log('=== CONFIRM SAVE CAREER ===');
    console.log('Status:', status);
    
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }
    
    // Only validate strictly when publishing (active)
    if (status === "active") {
      const validation = validateForm();
      console.log('Validation for publish:', validation);
      if (!validation.isValid) {
        errorToast(validation.errors[0], 3000);
        return;
      }
    } else {
      // For unpublished (drafts), only check basic fields
      if (!(jobTitle || "").trim()) {
        errorToast("Job title is required", 3000);
        return;
      }
      console.log('Saving as unpublished - minimal validation passed');
    }

    setShowSaveModal(status);
  };

  const saveCareer = async (status: string) => {
    console.log('=== SAVE CAREER STARTED ===');
    console.log('Status:', status);
    console.log('Is Publishing:', status === 'active');
    setShowSaveModal("");
    if (!status) {
      console.log('No status provided, aborting');
      return;
    }

    if (!savingCareerRef.current) {
      setIsSavingCareer(true);
      savingCareerRef.current = true;
      let userInfoSlice = {
        image: user.image,
        name: user.name,
        email: user.email,
      };
      console.log('User Info:', userInfoSlice);
      console.log('AI Questions Count:', aiQuestionsCount);
      console.log('AI Interview Questions:', aiInterviewQuestions);
      console.log('Team Members:', teamMembers);
      console.log('Pipeline Stages:', pipelineStages);
      
      // Sanitize all user-provided text fields before saving to database
      const sanitizedCustomQuestions = customQuestions.map((q: CustomQuestion) => ({
        ...q,
        question: sanitizeInput(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(o => sanitizeInput(o || '')) : q.options,
      }));

      const sanitizedTeamMembers = teamMembers.map((member: any) => ({
        ...member,
        name: sanitizeText(member.name || ''),
        email: sanitizeText(member.email || ''),
        role: sanitizeText(member.role || ''),
      }));

      const sanitizedPipelineStages = pipelineStages.map((stage: any) => ({
        ...stage,
        title: sanitizeText(stage.title || ''),
        substages: Array.isArray(stage.substages) ? stage.substages.map((s: string) => sanitizeText(s || '')) : stage.substages,
      }));

      const career = {
        jobTitle: sanitizeInput(jobTitle),
        description: sanitizeHtml(description),
        workSetup: sanitizeText(workSetup),
        workSetupRemarks: sanitizeInput(workSetupRemarks),
        lastEditedBy: userInfoSlice,
        createdBy: userInfoSlice,
        screeningSetting: sanitizeText(screeningSetting),
        orgID,
        requireVideo,
        salaryNegotiable,
        minimumSalary: isNaN(Number(minimumSalary))
          ? null
          : Number(minimumSalary),
        maximumSalary: isNaN(Number(maximumSalary))
          ? null
          : Number(maximumSalary),
        minimumSalaryCurrency: sanitizeText(minimumSalaryCurrency),
        maximumSalaryCurrency: sanitizeText(maximumSalaryCurrency),
        country: sanitizeText(country),
        province: sanitizeText(province),
        location: sanitizeText(city),
        status,
        employmentType: sanitizeText(employmentType),
        secretPrompt: sanitizeHtml(secretPrompt),
        preScreeningQuestions,
        customQuestions: sanitizedCustomQuestions,
        askingMinSalary,
        askingMaxSalary,
        askingMinCurrency: sanitizeText(askingMinCurrency),
        askingMaxCurrency: sanitizeText(askingMaxCurrency),
        teamMembers: sanitizedTeamMembers,
        aiInterviewSecretPrompt: sanitizeHtml(aiInterviewSecretPrompt),
        aiInterviewScreeningSetting: sanitizeText(aiInterviewScreeningSetting),
        aiInterviewRequireVideo,
        aiInterviewQuestions,
        pipelineStages: sanitizedPipelineStages,
      };

      console.log('=== CAREER OBJECT TO BE POSTED ===');
      console.log(JSON.stringify(career, null, 2));
      
      try {
        console.log('Posting to /api/add-career...');
        const response = await axios.post("/api/add-career", career);
        console.log('Response:', response);
        if (response.status === 200) {
          // Clear all change tracking to prevent browser warning
          setHasChanges(false);
          try { 
            sessionStorage.removeItem('hasChanges'); 
            sessionStorage.removeItem(storageKey); 
          } catch {}
          candidateActionToast(
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginLeft: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
                Career added {status === "active" ? "and published" : ""}
              </span>
            </div>,
            1300,
            <i
              className="la la-check-circle"
              style={{ color: "#039855", fontSize: 32 }}
            ></i>
          );
          const successMessage = status === 'active' ? 'and published' : 'as draft';
          setTimeout(() => {
            console.log('Redirecting to careers page...');
            window.location.href = `/recruiter-dashboard/careers`;
          }, 1300);
        }
      } catch (error: any) {
        console.error('=== ERROR ADDING CAREER ===');
        console.error('Error object:', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        console.error('Error response data:', error.response?.data);
        errorToast(error.response?.data?.error || "Failed to add career", 3000);
      } finally {
        savingCareerRef.current = false;
        setIsSavingCareer(false);
      }
    }
  };

  useEffect(() => {
    const parseProvinces = () => {
      setProvinceList(philippineCitiesAndProvinces.provinces);
      // Only set default cities if a province is already selected
      if (career?.province) {
        const provinceObj = philippineCitiesAndProvinces.provinces.find(
          (p) => p.name === career.province
        );
        if (provinceObj) {
          const cities = philippineCitiesAndProvinces.cities.filter(
            (city) => city.province === provinceObj.key
          );
          setCityList(cities);
        }
      }
    };
    parseProvinces();
  }, [career]);

  useEffect(() => {
    const provinceObj = philippineCitiesAndProvinces.provinces.find((p: any) => p.name === province);
    if (provinceObj) {
      const cities = philippineCitiesAndProvinces.cities.filter((c: any) => c.province === provinceObj.key);
      setCityList(cities);
    } else {
      setCityList([] as any);
    }
  }, [province]);

  // Clear salary field errors and touched states when salaryNegotiable is toggled on
  useEffect(() => {
    if (salaryNegotiable) {
      setErrors((prev) => ({ 
        ...prev, 
        minimumSalary: false,
        maximumSalary: false 
      }));
      setFieldTouched((prev) => ({
        ...prev,
        minimumSalary: false,
        maximumSalary: false
      }));
    }
  }, [salaryNegotiable]);

  const handleJobTitleBlur = () => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, jobTitle: true }));
    setErrors((prev) => ({ ...prev, jobTitle: (jobTitle || "").trim().length === 0 }));
  };

  const handleProvinceBlur = () => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, province: true }));
    setErrors((prev) => ({ ...prev, province: (province || "").trim().length === 0 }));
  };

  const handleCityBlur = () => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, city: true }));
    setErrors((prev) => ({ ...prev, city: (city || "").trim().length === 0 }));
  };

  const handleEmploymentTypeBlur = () => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, employmentType: true }));
    setErrors((prev) => ({ ...prev, employmentType: (employmentType || "").trim().length === 0 }));
  };

  const handleWorkSetupBlur = () => {
    setCareerInfoTouched(true);
    setFieldTouched((prev) => ({ ...prev, workSetup: true }));
    setErrors((prev) => ({ ...prev, workSetup: (workSetup || "").trim().length === 0 }));
  };

  const descriptionStripped = (description || "")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim();
  const descriptionError = descriptionTouched && descriptionStripped.length === 0;

  const jobTitleValid = (jobTitle || "").trim().length > 0;
  const employmentTypeValid = (employmentType || "").trim().length > 0;
  const workSetupValid = (workSetup || "").trim().length > 0;
  const provinceValid = (province || "").trim().length > 0;
  const cityValid = (city || "").trim().length > 0;
  
  // Salary is valid if negotiable OR if both min/max have values (including "0")
  const minimumSalaryValid = (minimumSalary || "").trim().length > 0;
  const maximumSalaryValid = (maximumSalary || "").trim().length > 0;
  const salaryValid = salaryNegotiable ? true : (minimumSalaryValid && maximumSalaryValid);

  const jobDescriptionValid = descriptionStripped.length > 0;
  // Team Access is valid only when there is at least one collaborator beyond the owner
  const teamAccessValid = Array.isArray(teamMembers) && teamMembers.some((m: any) => m?.isOwner);

  // Compute granular progress across individual inputs
  let totalChecks = 0;
  let satisfied = 0;
  const addCheck = (valid: boolean) => { totalChecks += 1; if (valid) satisfied += 1; };
  addCheck(jobTitleValid);
  addCheck(employmentTypeValid);
  addCheck(workSetupValid);
  addCheck(provinceValid);
  addCheck(cityValid);
  // Salary: negotiable counts as pass; otherwise min and max are separate checks
  if (salaryNegotiable) {
    addCheck(true);
  } else {
    addCheck(minimumSalaryValid);
    addCheck(maximumSalaryValid);
  }
  addCheck(jobDescriptionValid);
  addCheck(teamAccessValid);
  const step1Progress = totalChecks > 0 ? satisfied / totalChecks : 0;

  // Step 1 has error if ANY touched field is invalid
  // Check each field individually - only show error for fields that have been touched
  const step1HasError = 
    (fieldTouched.jobTitle && !jobTitleValid) ||
    (fieldTouched.description && !jobDescriptionValid) ||
    (fieldTouched.employmentType && !employmentTypeValid) ||
    (fieldTouched.workSetup && !workSetupValid) ||
    (fieldTouched.province && !provinceValid) ||
    (fieldTouched.city && !cityValid) ||
    (fieldTouched.minimumSalary && !salaryNegotiable && !minimumSalaryValid) ||
    (fieldTouched.maximumSalary && !salaryNegotiable && !maximumSalaryValid) ||
    (fieldTouched.teamAccess && !teamAccessValid);

  // Step 2 progress and errors (auto-complete when CriteriaDropdown has initial value)
  const step2HasInitial = (screeningSetting || '').trim().length > 0;
  const step2Progress = step2HasInitial ? 1 : 0;

  // Step 3 progress: 0 if no questions, proportional progress up to 5 questions
  const step3Progress = aiQuestionsCount >= 5 ? 1 : (aiQuestionsCount / 5);
  const step3HasError = aiQuestionsCount < 5;
  const step4Progress = activeStep >= 4 ? 1 : 0; // pipeline setup progress (static for now)

  // Mark Step 3 as visited when entering it
  useEffect(() => {
    if (activeStep === 3) {
      setStep3Visited(true);
    }
  }, [activeStep]);

  // Update stepErrors based on field validation
  useEffect(() => {
    setStepErrors(prev => ({
      ...prev,
      1: { hasError: step1HasError },
      3: { hasError: step3Visited && step3HasError },
    }));
  }, [step1HasError, step3HasError, step3Visited, fieldTouched, jobTitle, description, employmentType, workSetup, province, city, minimumSalary, maximumSalary, salaryNegotiable, teamMembers]);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const data = {
        jobTitle,
        description,
        workSetup,
        workSetupRemarks,
        screeningSetting,
        employmentType,
        requireVideo,
        salaryNegotiable,
        minimumSalary,
        maximumSalary,
        minimumSalaryCurrency,
        maximumSalaryCurrency,
        country,
        province,
        city,
        teamMembers,
        secretPrompt,
        preScreeningQuestions,
        customQuestions,
        descriptionTouched,
        careerInfoTouched,
        teamAccessTouched,
        fieldTouched,
        activeStep,
        askingMinSalary,
        askingMaxSalary,
        askingMinCurrency,
        askingMaxCurrency,
      } as any;
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    } catch {}
  }, [jobTitle, description, workSetup, workSetupRemarks, screeningSetting, employmentType, requireVideo, salaryNegotiable, minimumSalary, maximumSalary, minimumSalaryCurrency, maximumSalaryCurrency, country, province, city, teamMembers, secretPrompt, preScreeningQuestions, customQuestions, descriptionTouched, careerInfoTouched, teamAccessTouched, fieldTouched, activeStep, storageKey, askingMinSalary, askingMaxSalary, askingMinCurrency, askingMaxCurrency]);

  return (
    <div className="col" style={{ marginBottom: "35px" }}>
      <FormHeader
        formType={formType}
        isFormValid={isFormValid()}
        isSavingCareer={isSavingCareer}
        activeStep={activeStep}
        isOnFurthestStep={activeStep === furthestStep}
        onSaveUnpublished={() => {
          if (formType === "add") {
            confirmSaveCareer("inactive");
          } else {
            updateCareer("inactive");
          }
        }}
        onSavePublished={() => {
          if (formType === "add") {
            confirmSaveCareer("active");
          } else {
            updateCareer("active");
          }
        }}
        onSaveAndContinue={handleSaveAndContinue}
        onCancel={() => {
          setShowEditModal?.(false);
        }}
      />

      <div style={{ width: "100%", maxWidth: "1560px", margin: '0 auto', marginTop: 20, marginBottom: 8 }}>
        <Stepper
          currentStep={activeStep}
          progressByStep={stepProgress}
          errorsByStep={stepErrors}
          onStepClick={handleStepClick}
          furthestStep={furthestStep}
        />
      </div>

      <div style={{ width: "100%", marginTop: 24, marginBottom: 8 }}>
        <hr style={{ borderColor: "#EAECF5", borderWidth: "1px", borderStyle: "solid" }} />
      </div>

      {activeStep === 1 && (
        <Step1
          jobTitle={jobTitle}
          setJobTitle={(val: string) => {
            setJobTitle(val);
            if ((val || "").trim().length > 0) {
              setErrors((prev) => ({ ...prev, jobTitle: false }));
            }
          }}
          employmentType={employmentType}
          setEmploymentType={(val: string) => {
            setEmploymentType(val);
            setCareerInfoTouched(true);
            setFieldTouched((prev) => ({ ...prev, employmentType: true }));
            // Clear error if value is provided, set error if empty
            if (val && val.trim().length > 0) {
              setErrors((prev) => ({ ...prev, employmentType: false }));
            }
          }}
          onEmploymentTypeBlur={handleEmploymentTypeBlur}
          workSetup={workSetup}
          setWorkSetup={(val: string) => {
            setWorkSetup(val);
            setCareerInfoTouched(true);
            setFieldTouched((prev) => ({ ...prev, workSetup: true }));
            // Clear error if value is provided, set error if empty
            if (val && val.trim().length > 0) {
              setErrors((prev) => ({ ...prev, workSetup: false }));
            }
          }}
          onWorkSetupBlur={handleWorkSetupBlur}
          country={country}
          setCountry={setCountry}
          province={province}
          setProvince={(val: string) => {
            setProvince(val);
            setCareerInfoTouched(true);
            setFieldTouched((prev) => ({ ...prev, province: true }));
            // Clear error if value is provided
            if (val && val.trim().length > 0) {
              setErrors((prev) => ({ ...prev, province: false }));
            }
          }}
          city={city}
          setCity={(val: string) => {
            setCity(val);
            setCareerInfoTouched(true);
            setFieldTouched((prev) => ({ ...prev, city: true }));
            // Clear error if value is provided
            if (val && val.trim().length > 0) {
              setErrors((prev) => ({ ...prev, city: false }));
            }
          }}
          provinceList={provinceList}
          cityList={cityList}
          setCityList={setCityList}
          onProvinceBlur={handleProvinceBlur}
          onCityBlur={handleCityBlur}
          salaryNegotiable={salaryNegotiable}
          setSalaryNegotiable={(val: boolean) => {
            setSalaryNegotiable(val);
            setCareerInfoTouched(true);
            // Clear salary errors when toggling to negotiable
            if (val) {
              setErrors((prev) => ({ ...prev, minimumSalary: false, maximumSalary: false }));
            }
          }}
          minimumSalary={minimumSalary}
          setMinimumSalary={(val: string) => {
            setMinimumSalary(val);
            setCareerInfoTouched(true);
            if ((val || "").trim().length > 0) {
              setErrors((prev) => ({ ...prev, minimumSalary: false }));
            }
          }}
          maximumSalary={maximumSalary}
          setMaximumSalary={(val: string) => {
            setMaximumSalary(val);
            setCareerInfoTouched(true);
            if ((val || "").trim().length > 0) {
              setErrors((prev) => ({ ...prev, maximumSalary: false }));
            }
          }}
          minimumSalaryCurrency={minimumSalaryCurrency}
          setMinimumSalaryCurrency={setMinimumSalaryCurrency}
          maximumSalaryCurrency={maximumSalaryCurrency}
          setMaximumSalaryCurrency={setMaximumSalaryCurrency}
          description={description}
          setDescription={setDescription}
          onJobTitleBlur={handleJobTitleBlur}
          descriptionError={descriptionError}
          onDescriptionBlur={() => {
            setDescriptionTouched(true);
            setFieldTouched((prev) => ({ ...prev, description: true }));
          }}
          onMinimumSalaryBlur={() => {
            setCareerInfoTouched(true);
            setFieldTouched((prev) => ({ ...prev, minimumSalary: true }));
            if (!salaryNegotiable) {
              setErrors((prev) => ({ ...prev, minimumSalary: (minimumSalary || "").trim().length === 0 }));
            }
          }}
          onMaximumSalaryBlur={() => {
            setCareerInfoTouched(true);
            setFieldTouched((prev) => ({ ...prev, maximumSalary: true }));
            if (!salaryNegotiable) {
              setErrors((prev) => ({ ...prev, maximumSalary: (maximumSalary || "").trim().length === 0 }));
            }
          }}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          errors={errors}
          onTeamAccessOpen={() => {
            setTeamAccessTouched(true);
            setFieldTouched((prev) => ({ ...prev, teamAccess: true }));
          }}
        />
      )}

      {activeStep === 2 && (
        <Step2
          screeningSetting={screeningSetting}
          setScreeningSetting={setScreeningSetting}
          secretPrompt={secretPrompt}
          setSecretPrompt={setSecretPrompt}
          preScreeningQuestions={preScreeningQuestions}
          setPreScreeningQuestions={setPreScreeningQuestions}
          customQuestions={customQuestions}
          setCustomQuestions={setCustomQuestions}
          askingMinSalary={askingMinSalary}
          askingMaxSalary={askingMaxSalary}
          askingMinCurrency={askingMinCurrency}
          askingMaxCurrency={askingMaxCurrency}
          onAskingMinSalaryChange={setAskingMinSalary}
          onAskingMaxSalaryChange={setAskingMaxSalary}
          onAskingMinCurrencyChange={setAskingMinCurrency}
          onAskingMaxCurrencyChange={setAskingMaxCurrency}
        />
      )}

      {activeStep === 3 && (
        <Step3 
          onQuestionsCountChange={(n: number) => setAiQuestionsCount(n)}
          onQuestionsChange={(questions: any[]) => setAiInterviewQuestions(questions)}
          aiInterviewSecretPrompt={aiInterviewSecretPrompt}
          setAiInterviewSecretPrompt={setAiInterviewSecretPrompt}
          aiInterviewScreeningSetting={aiInterviewScreeningSetting}
          setAiInterviewScreeningSetting={setAiInterviewScreeningSetting}
          aiInterviewRequireVideo={aiInterviewRequireVideo}
          setAiInterviewRequireVideo={setAiInterviewRequireVideo}
          jobTitle={jobTitle}
          jobDescription={description}
          employmentType={employmentType}
          workSetup={workSetup}
        />
      )}

      {activeStep === 4 && (
        <Step4 pipelineStages={pipelineStages} setPipelineStages={setPipelineStages} />
      )}

      {activeStep === 5 && (
        <Step5
          screeningSetting={screeningSetting}
          secretPrompt={secretPrompt}
          preScreeningQuestions={preScreeningQuestions as any}
          customQuestions={customQuestions}
          jobTitle={jobTitle}
          employmentType={employmentType}
          workSetup={workSetup}
          country={country}
          province={province}
          city={city}
          descriptionHtml={description}
          teamMembers={teamMembers as any}
          minimumSalary={minimumSalary}
          maximumSalary={maximumSalary}
          minimumSalaryCurrency={minimumSalaryCurrency}
          maximumSalaryCurrency={maximumSalaryCurrency}
          salaryNegotiable={salaryNegotiable}
          askingMinSalary={askingMinSalary}
          askingMaxSalary={askingMaxSalary}
          askingMinCurrency={askingMinCurrency}
          askingMaxCurrency={askingMaxCurrency}
          pipelineStages={pipelineStages}
          aiInterviewSecretPrompt={aiInterviewSecretPrompt}
          aiInterviewScreeningSetting={aiInterviewScreeningSetting}
          aiInterviewRequireVideo={aiInterviewRequireVideo}
          onEditCareerDetails={() => setActiveStep(1)}
          onEditCVScreening={() => setActiveStep(2)}
          onEditAIInterview={() => setActiveStep(3)}
          onEditPipelineStages={() => setActiveStep(4)}
        />
      )}

      {showSaveModal && (
        <CareerActionModal
          action={showSaveModal}
          onAction={(action) => saveCareer(action)}
        />
      )}
      {isSavingCareer && (
        <FullScreenLoadingAnimation
          title={formType === "add" ? "Saving career..." : "Updating career..."}
          subtext={`Please wait while we are ${
            formType === "add" ? "saving" : "updating"
          } the career`}
        />
      )}
    </div>
  );
}
