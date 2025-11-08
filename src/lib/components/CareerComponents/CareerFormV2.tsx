"use client";

import { useEffect, useRef, useState } from "react";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "./CareerActionModal";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";
import FormHeader from "./NewCareerComponents/FormHeader";
import Step1 from "./NewCareerComponents/01CareerDetails&TeamAccess/Step1";
import Stepper from "./NewCareerComponents/Stepper";
import Step2 from "./NewCareerComponents/02CVReview&Pre-screening/Step2";
import Step3 from "./NewCareerComponents/03AISetupInterview/Step3";
import Step4 from "./NewCareerComponents/04PipelineStages/Step4";
import Step5 from "./NewCareerComponents/05ReviewCareer/Step5";

export default function CareerFormV2({
  career,
  formType,
  setShowEditModal,
  currentStep = 1,
}: {
  career?: any;
  formType: string;
  setShowEditModal?: (show: boolean) => void;
  currentStep?: number;
}) {
  const storageKey = career?._id ? `careerFormV2:${career._id}` : 'careerFormV2:new';
  const [activeStep, setActiveStep] = useState<number>(currentStep);
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
    career?.requireVideo || true
  );
  const [salaryNegotiable, setSalaryNegotiable] = useState(
    career?.salaryNegotiable || true
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
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<any[]>(
    Array.isArray(career?.preScreeningQuestions) ? career?.preScreeningQuestions : []
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
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [careerInfoTouched, setCareerInfoTouched] = useState(false);
  const [teamAccessTouched, setTeamAccessTouched] = useState(false);

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
        if (typeof data.descriptionTouched === 'boolean') setDescriptionTouched(data.descriptionTouched);
        if (typeof data.careerInfoTouched === 'boolean') setCareerInfoTouched(data.careerInfoTouched);
        if (typeof data.teamAccessTouched === 'boolean') setTeamAccessTouched(data.teamAccessTouched);
      }
    } catch {}
  }, []);

  // Prefill defaults for quick testing when adding and no saved draft exists
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = sessionStorage.getItem(storageKey);
      if (raw) return; // don't override existing draft
      if (formType === 'add') {
        if (!jobTitle) setJobTitle('Software Engineer');
        if (!employmentType) setEmploymentType('Full-time');
        if (!workSetup) setWorkSetup('Hybrid');
        if (!country) setCountry('Philippines');
        if (!province) setProvince('Metro Manila');
        if (!city) setCity('Makati City');
        if (salaryNegotiable !== true) setSalaryNegotiable(true);
        if (!description) setDescription('We are looking for a Software Engineer to build and maintain web applications.');
        // Step 2: sensible defaults
        if (!secretPrompt) setSecretPrompt('Assess candidates based on the job description with emphasis on practical experience, communication, and problem-solving.');
        if (!Array.isArray(preScreeningQuestions) || preScreeningQuestions.length === 0) {
          // Match Step2 expected Question shape and built-in IDs so components render
          setPreScreeningQuestions([
            { id: 'notice-period', title: 'Notice Period', description: 'How long is your notice period?' },
            { id: 'work-setup', title: 'Work Setup', description: 'How often are you willing to report to the office each week?' },
            { id: 'asking-salary', title: 'Asking Salary', description: 'What is your expected monthly salary?' },
          ] as any[]);
        }
        // Ensure at least one collaborator beyond the owner
        setTeamMembers((prev: any[]) => {
          const hasNonOwner = Array.isArray(prev) && prev.some((m) => !m?.isOwner);
          if (hasNonOwner) return prev;
          const placeholder = { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Reviewer', isOwner: false } as any;
          return [...(Array.isArray(prev) ? prev : []), placeholder];
        });
      }
    } catch {}
  }, [formType, storageKey]);

  const isFormValid = () => {
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
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }
    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };
    const updatedCareer = {
      _id: career._id,
      jobTitle,
      description,
      workSetup,
      workSetupRemarks,
      lastEditedBy: userInfoSlice,
      status,
      updatedAt: Date.now(),
      screeningSetting,
      requireVideo,
      salaryNegotiable,
      minimumSalary: isNaN(Number(minimumSalary))
        ? null
        : Number(minimumSalary),
      maximumSalary: isNaN(Number(maximumSalary))
        ? null
        : Number(maximumSalary),
      country,
      province,
      location: city,
      employmentType,
      secretPrompt,
      preScreeningQuestions,
    };
    try {
      setIsSavingCareer(true);
      const response = await axios.post("/api/update-career", updatedCareer);
      if (response.status === 200) {
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
    } catch (error) {
      console.error(error);
      errorToast("Failed to update career", 1300);
    } finally {
      setIsSavingCareer(false);
    }
  };

  const confirmSaveCareer = (status: string) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }

    setShowSaveModal(status);
  };

  const saveCareer = async (status: string) => {
    setShowSaveModal("");
    if (!status) {
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
      const career = {
        jobTitle,
        description,
        workSetup,
        workSetupRemarks,
        lastEditedBy: userInfoSlice,
        createdBy: userInfoSlice,
        screeningSetting,
        orgID,
        requireVideo,
        salaryNegotiable,
        minimumSalary: isNaN(Number(minimumSalary))
          ? null
          : Number(minimumSalary),
        maximumSalary: isNaN(Number(maximumSalary))
          ? null
          : Number(maximumSalary),
        country,
        province,
        location: city,
        status,
        employmentType,
        secretPrompt,
        preScreeningQuestions,
      };

      try {
        const response = await axios.post("/api/add-career", career);
        if (response.status === 200) {
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
          setTimeout(() => {
            window.location.href = `/recruiter-dashboard/careers`;
          }, 1300);
        }
      } catch (error) {
        errorToast("Failed to add career", 1300);
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

  const handleJobTitleBlur = () => {
    setCareerInfoTouched(true);
    setErrors((prev) => ({ ...prev, jobTitle: (jobTitle || "").trim().length === 0 }));
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
  const salaryValid = salaryNegotiable
    ? true
    : (minimumSalary || "").trim().length > 0 && (maximumSalary || "").trim().length > 0;

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
    addCheck((minimumSalary || "").trim().length > 0);
    addCheck((maximumSalary || "").trim().length > 0);
  }
  addCheck(jobDescriptionValid);
  addCheck(teamAccessValid);
  const step1Progress = totalChecks > 0 ? satisfied / totalChecks : 0;

  const step1Messages: string[] = [];
  if (careerInfoTouched) {
    if (!jobTitleValid) step1Messages.push("Job title is required");
    if (!employmentTypeValid) step1Messages.push("Employment type is required");
    if (!workSetupValid) step1Messages.push("Work setup is required");
    if (!provinceValid) step1Messages.push("Province is required");
    if (!cityValid) step1Messages.push("City is required");
    if (!salaryNegotiable) {
      if (!(minimumSalary || "").trim().length) step1Messages.push("Minimum salary is required");
      if (!(maximumSalary || "").trim().length) step1Messages.push("Maximum salary is required");
    }
  }
  if (descriptionTouched && !jobDescriptionValid) step1Messages.push("Description is required");
  if (teamAccessTouched && !teamAccessValid) step1Messages.push("Add a Job Owner");

  const step1HasError = step1Messages.length > 0;

  // Step 2 progress and errors (auto-complete when CriteriaDropdown has initial value)
  const step2HasInitial = (screeningSetting || '').trim().length > 0;
  const step2Progress = step2HasInitial ? 1 : 0;

  const step3Progress = aiQuestionsCount >= 5 ? 1 : 0.5;
  const step4Progress = 0; // pipeline setup progress (static for now)

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
        descriptionTouched,
        careerInfoTouched,
        teamAccessTouched,
        activeStep,
      } as any;
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    } catch {}
  }, [jobTitle, description, workSetup, workSetupRemarks, screeningSetting, employmentType, requireVideo, salaryNegotiable, minimumSalary, maximumSalary, minimumSalaryCurrency, maximumSalaryCurrency, country, province, city, teamMembers, secretPrompt, preScreeningQuestions, descriptionTouched, careerInfoTouched, teamAccessTouched, activeStep, storageKey]);

  return (
    <div className="col" style={{ marginBottom: "35px" }}>
      <FormHeader
        formType={formType}
        isFormValid={isFormValid()}
        isSavingCareer={isSavingCareer}
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
        onCancel={() => {
          setShowEditModal?.(false);
        }}
      />

      <div style={{ width: "100%", marginTop: 30, marginBottom: 8 }}>
        <Stepper
          currentStep={activeStep}
          progressByStep={{ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }}
          errorsByStep={{ 1: { hasError: false }, 2: { hasError: false }, 3: { hasError: false }, 4: { hasError: false }, 5: { hasError: false } }}
          onStepClick={(id) => setActiveStep(id)}
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
            setErrors((prev) => ({ ...prev, employmentType: !(val && val.trim().length > 0) }));
          }}
          workSetup={workSetup}
          setWorkSetup={(val: string) => {
            setWorkSetup(val);
            setCareerInfoTouched(true);
            setErrors((prev) => ({ ...prev, workSetup: !(val && val.trim().length > 0) }));
          }}
          country={country}
          setCountry={setCountry}
          province={province}
          setProvince={(val: string) => {
            setProvince(val);
            setCareerInfoTouched(true);
          }}
          city={city}
          setCity={(val: string) => {
            setCity(val);
            setCareerInfoTouched(true);
          }}
          provinceList={provinceList}
          cityList={cityList}
          setCityList={setCityList}
          salaryNegotiable={salaryNegotiable}
          setSalaryNegotiable={(val: boolean) => {
            setSalaryNegotiable(val);
            setCareerInfoTouched(true);
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
          onDescriptionBlur={() => setDescriptionTouched(true)}
          onMinimumSalaryBlur={() => {
            setCareerInfoTouched(true);
            setErrors((prev) => ({ ...prev, minimumSalary: (minimumSalary || "").trim().length === 0 }));
          }}
          onMaximumSalaryBlur={() => {
            setCareerInfoTouched(true);
            setErrors((prev) => ({ ...prev, maximumSalary: (maximumSalary || "").trim().length === 0 }));
          }}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          errors={errors}
          onTeamAccessOpen={() => setTeamAccessTouched(true)}
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
        />
      )}

      {activeStep === 3 && (
        <Step3 onQuestionsCountChange={(n: number) => setAiQuestionsCount(n)} />
      )}

      {activeStep === 4 && (
        <Step4 />
      )}

      {activeStep === 5 && (
        <Step5
          screeningSetting={screeningSetting}
          secretPrompt={secretPrompt}
          preScreeningQuestions={preScreeningQuestions as any}
          minimumSalary={minimumSalary}
          maximumSalary={maximumSalary}
          minimumSalaryCurrency={minimumSalaryCurrency}
          maximumSalaryCurrency={maximumSalaryCurrency}
          salaryNegotiable={salaryNegotiable}
          onEditClick={() => setActiveStep(2)}
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
