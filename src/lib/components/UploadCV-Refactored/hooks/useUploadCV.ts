/**
 * Main hook for UploadCV component state management
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { pathConstants } from "@/lib/utils/constantsV2";
import { Interview, ScreeningResult, UserCV, StepType } from "../types";
import { STEPS } from "../constants";
import { parseDigitalCVToUserCV } from "../utils/cvHelpers";

interface UseUploadCVProps {
  userEmail: string;
}

export function useUploadCV({ userEmail }: UseUploadCVProps) {
  const [buildingCV, setBuildingCV] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepType | null>(null);
  const [digitalCV, setDigitalCV] = useState<string | null>(null);
  const [editingCV, setEditingCV] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const [userCV, setUserCV] = useState<UserCV | null>(null);

  // Initialize: Load stored CV and fetch interview
  useEffect(() => {
    const storedSelectedCareer = sessionStorage.getItem("selectedCareer");
    const storedCV = localStorage.getItem("userCV");

    if (storedCV && storedCV !== "null") {
      setDigitalCV(storedCV);
    }

    if (storedSelectedCareer) {
      const parseStoredSelectedCareer = JSON.parse(storedSelectedCareer);
      fetchInterview(parseStoredSelectedCareer.id);
    } else {
      alert("No application is currently being managed.");
      window.location.href = pathConstants.dashboard;
    }
  }, []);

  // Track changes in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("hasChanges", JSON.stringify(hasChanges));
  }, [hasChanges]);

  const fetchInterview = async (interviewID: string) => {
    try {
      const response = await axios({
        method: "POST",
        url: "/api/job-portal/fetch-interviews",
        data: { email: userEmail, interviewID },
      });

      const result = response.data;

      if (result.error) {
        alert(result.error);
        window.location.href = pathConstants.dashboard;
      } else {
        if (result[0].cvStatus) {
          alert("This application has already been processed.");
          window.location.href = pathConstants.dashboard;
        } else {
          // Walkthrough mode - Start from Step 1
          const interviewData = result[0];
          
          // Always override customQuestions for testing
          interviewData.customQuestions = [
            {
              id: "custom-1",
              question: "Have you worked with Spring Framework before?",
              answerType: "dropdown",
              options: ["Yes", "No"],
            },
            {
              id: "short-answer-1",
              question: "What is your current job title?",
              answerType: "short-answer",
            },
            {
              id: "long-answer-1",
              question: "Tell us about your experience and why you're interested in this role?",
              answerType: "long-answer",
            },
          ];
          
          // Always override preScreeningQuestions for testing with correct structure
          interviewData.preScreeningQuestions = [
            { id: "notice-period", question: "", type: "notice-period" },
            { id: "work-setup", question: "", type: "work-setup" },
            { id: "asking-salary", question: "", type: "asking-salary" },
          ];
          
          // Start from Step 1 for walkthrough
          setCurrentStep(STEPS[0]);
          setInterview(interviewData);
          setLoading(false);
        }
      }
    } catch (err) {
      alert("Error fetching existing applied jobs.");
      window.location.href = pathConstants.dashboard;
      console.error(err);
    }
  };

  const handleEditCV = (section: string | null) => {
    setEditingCV(section);

    if (section !== null) {
      setTimeout(() => {
        const sectionDetails = document.getElementById(section);
        if (sectionDetails) {
          sectionDetails.focus();
        }
      }, 100);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setHasChanges(false);
    setUserCV(null);

    const storedCV = localStorage.getItem("userCV");

    if (storedCV !== "null") {
      setDigitalCV(storedCV);
    } else {
      setDigitalCV(null);
    }
  };

  const handleReviewCV = () => {
    if (!digitalCV) return;

    const userCV = parseDigitalCVToUserCV(digitalCV);
    const parsedUserCV = JSON.parse(digitalCV);

    setFile(parsedUserCV.fileInfo);
    setUserCV(userCV);
  };

  const handleCVBuilt = (digitalCVString: string, userCVData: UserCV) => {
    setDigitalCV(digitalCVString);
    setUserCV(userCVData);
    setBuildingCV(false);
  };

  const handleCVBuildError = () => {
    setBuildingCV(false);
  };

  const startBuildingCV = () => {
    setBuildingCV(true);
    setHasChanges(true);
  };

  const handleScreeningComplete = (result: ScreeningResult) => {
    setCurrentStep(STEPS[2]);
    setScreeningResult(result);
    setHasChanges(false);
  };

  const handleScreeningError = () => {
    setCurrentStep(STEPS[0]);
  };

  const startScreening = () => {
    setCurrentStep(STEPS[1]);
  };

  return {
    // State
    buildingCV,
    currentStep,
    digitalCV,
    editingCV,
    file,
    hasChanges,
    loading,
    interview,
    screeningResult,
    userCV,
    // Setters
    setFile,
    setHasChanges,
    setUserCV,
    // Handlers
    handleEditCV,
    handleRemoveFile,
    handleReviewCV,
    handleCVBuilt,
    handleCVBuildError,
    startBuildingCV,
    handleScreeningComplete,
    handleScreeningError,
    startScreening,
  };
}
