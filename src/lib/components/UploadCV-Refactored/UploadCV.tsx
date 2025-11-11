/**
 * UploadCV - Main component for CV upload and screening process
 * Refactored version with improved structure and maintainability
 */

"use client";

import React from "react";
import Loader from "@/lib/components/commonV2/Loader";
import { useAppContext } from "@/lib/context/ContextV2";
import { STEPS } from "./constants";
import { useUploadCV } from "./hooks/useUploadCV";
import { useCVSubmission } from "./hooks/useCVSubmission";
import { useCVScreening } from "./hooks/useCVScreening";
import { CVHeader } from "./components/CVHeader";
import { ProgressSteps } from "./components/ProgressSteps";
import { CVUploadOptions } from "./components/CVUploadOptions";
import { CVBuildingLoader } from "./components/CVBuildingLoader";
import { CVDetailsForm } from "./components/CVDetailsForm";
import { CVScreeningLoader } from "./components/CVScreeningLoader";
import { CVResultDisplay } from "./components/CVResultDisplay";
import { PreScreeningQuestionsForm } from "./components/PreScreeningQuestionsForm";
import { JobDescriptionModal } from "./components/JobDescriptionModal";
import styles from "./styles/UploadCV.module.scss";

export default function UploadCV() {
  const { user } = useAppContext();
  const [preScreeningAnswers, setPreScreeningAnswers] = React.useState<Record<string, string>>({});
  const [isSubmittingPreScreening, setIsSubmittingPreScreening] = React.useState(false);
  const [showJobDescriptionModal, setShowJobDescriptionModal] = React.useState(false);

  // Mockup checkbox question for testing
  const mockupCheckboxQuestion = {
    id: "checkbox-skills",
    question: "Which skills do you have?",
    answerType: "checkbox" as const,
    options: ["JavaScript", "React", "TypeScript", "Node.js", "Python", "SQL"],
  };

  // Main state management
  const {
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
    setFile,
    setHasChanges,
    setUserCV,
    handleEditCV,
    handleRemoveFile,
    handleReviewCV,
    handleCVBuilt,
    handleCVBuildError,
    startBuildingCV,
    handleScreeningComplete,
    handleScreeningError,
    startScreening,
  } = useUploadCV({ userEmail: user?.email || "" });

  // CV submission hook
  const { submitFile } = useCVSubmission({
    userEmail: user?.email || "",
    onSuccess: handleCVBuilt,
    onError: (error) => {
      alert(error);
      handleCVBuildError();
    },
  });

  // CV screening hook
  const { screenCV } = useCVScreening({
    interviewID: interview?.interviewID || "",
    userEmail: user?.email || "",
    userName: user?.name || "",
    onSuccess: handleScreeningComplete,
    onError: (error) => {
      alert(error);
      handleScreeningError();
    },
  });

  // Handlers
  const handleModal = () => {
    setShowJobDescriptionModal(true);
  };

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    startBuildingCV();
    
    // Mock: Wait 5 seconds then build CV with mock data
    setTimeout(() => {
      const mockUserCV = {
        Introduction: "**Senior Software Engineer** with 6+ years of experience specializing in **Java** and **Spring Boot** backend development.",
        "Current Position": "**Senior Backend Engineer** at TechCorp Solutions (2021 - Present)",
        "Contact Info": "alex.chen@email.com | +1 (555) 123-4567 | San Francisco, CA",
        Skills: "Java, Spring Boot, Spring Security, Microservices, RESTful APIs, OAuth2, AWS, Docker, Kubernetes",
        Experience: "6+ years in backend development, microservices architecture, and cloud-native applications",
        Education: "Bachelor of Science in Computer Science - University of California, Berkeley (2014-2018)",
        Projects: "Open Source API Gateway, E-Commerce Microservices Platform, Healthcare API Integration System",
        Certifications: "AWS Certified Solutions Architect, Oracle Java SE 11 Developer, Spring Professional, CKAD",
        Awards: "Excellence in Engineering Award (2023), Best API Design (2022)",
      };
      handleCVBuilt("", mockUserCV);
    }, 5000);
  };

  const handleCVSubmit = async () => {
    // Check if there are pre-screening questions
    const hasPreScreeningQuestions = 
      (interview?.customQuestions && interview.customQuestions.length > 0) ||
      (interview?.preScreeningQuestions && interview.preScreeningQuestions.length > 0);

    if (hasPreScreeningQuestions) {
      // Move to pre-screening questions step
      startScreening();
    } else {
      // Skip pre-screening and go directly to screening
      startScreening();
      await screenCV(userCV, digitalCV, hasChanges, file, editingCV);
    }
  };

  const handlePreScreeningSubmit = async (answers: Record<string, string>) => {
    setPreScreeningAnswers(answers);
    setIsSubmittingPreScreening(true);
    // Mock: Wait 5 seconds then show Good Fit result
    setTimeout(() => {
      const mockScreeningResult = {
        status: "For AI Interview",
        applicationStatus: "Ongoing" as const,
      };
      handleScreeningComplete(mockScreeningResult);
      setIsSubmittingPreScreening(false);
    }, 5000);
  };

  const handleContinueFromStep2 = async () => {
    // Validate all questions are answered using the same logic as button disabled
    const allQuestions = [
      ...(interview?.customQuestions || []),
      ...(interview?.preScreeningQuestions || []),
      mockupCheckboxQuestion,
    ];
    
    const isComplete = allQuestions.every((q) => {
      // For asking-salary, check both min and max
      if (q.id === 'asking-salary') {
        const hasMin = preScreeningAnswers[`${q.id}-min`] && preScreeningAnswers[`${q.id}-min`].trim() !== '';
        const hasMax = preScreeningAnswers[`${q.id}-max`] && preScreeningAnswers[`${q.id}-max`].trim() !== '';
        return hasMin && hasMax;
      }
      // For checkbox questions (converted to comma-separated string)
      if (q.id === 'checkbox-skills' || ('answerType' in q && q.answerType === 'checkbox')) {
        const answer = preScreeningAnswers[q.id];
        return answer && answer.trim() !== '' && answer !== '[]';
      }
      // For other questions, check if answer exists and is not empty
      const answer = preScreeningAnswers[q.id];
      return answer && answer.trim() !== '';
    });
    
    if (!isComplete) {
      console.log("❌ Validation Failed:", {
        allQuestions: allQuestions.map(q => q.id),
        answers: preScreeningAnswers,
        missing: allQuestions.filter(q => {
          if (q.id === 'asking-salary') {
            const hasMin = preScreeningAnswers[`${q.id}-min`] && preScreeningAnswers[`${q.id}-min`].trim() !== '';
            const hasMax = preScreeningAnswers[`${q.id}-max`] && preScreeningAnswers[`${q.id}-max`].trim() !== '';
            return !hasMin || !hasMax;
          }
          if (q.id === 'checkbox-skills' || ('answerType' in q && q.answerType === 'checkbox')) {
            const answer = preScreeningAnswers[q.id];
            return !answer || answer.trim() === '' || answer === '[]';
          }
          const answer = preScreeningAnswers[q.id];
          return !answer || answer.trim() === '';
        }).map(q => q.id),
      });
      alert("Please answer all questions before continuing.");
      return;
    }
    
    console.log("✅ Validation Passed - Submitting...");
    // Submit the answers and trigger the screening flow
    setIsSubmittingPreScreening(true);
    await handlePreScreeningSubmit(preScreeningAnswers);
  };

  const handleBackToCV = () => {
    // Go back to step 1
    handleScreeningError();
  };

  // Debug logging
  React.useEffect(() => {
    console.log("🔍 DEBUG - Current Step:", currentStep);
    console.log("🔍 DEBUG - User CV:", userCV ? "Present" : "Null");
    console.log("🔍 DEBUG - Interview Questions:", {
      customQuestions: interview?.customQuestions?.length || 0,
      preScreeningQuestions: interview?.preScreeningQuestions?.length || 0,
    });
  }, [currentStep, userCV, interview]);

  // Loading state
  if (loading) {
    return <Loader loaderData={""} loaderType={""} />;
  }

  // No interview found
  if (!interview) {
    return null;
  }

  return (
    <div className={styles.uploadCVContainer}>
      {/* Job Description Modal */}
      {showJobDescriptionModal && interview && (
        <JobDescriptionModal
          interview={interview}
          onClose={() => setShowJobDescriptionModal(false)}
        />
      )}

      {/* Header Section */}
      <CVHeader interview={interview} onViewJobDescription={handleModal} />

      {/* Progress Steps */}
      <ProgressSteps
        currentStep={currentStep}
        userCV={userCV}
        buildingCV={buildingCV}
      />

      {/* Step 1: Submit CV */}
      {currentStep === STEPS[0] && (
        <>
          {/* Initial Options: Upload or Review */}
          {!buildingCV && !userCV && !file && (
            <CVUploadOptions
              hasDigitalCV={!!digitalCV}
              onFileSelected={handleFileSelected}
              onReviewCV={handleReviewCV}
            />
          )}

          {/* Building CV State */}
          {buildingCV && file && <CVBuildingLoader file={file} />}

          {/* CV Details Form */}
          {!buildingCV && userCV && (
            <CVDetailsForm
              userCV={userCV}
              file={file}
              editingCV={editingCV}
              onEditSection={handleEditCV}
              onUpdateCV={setUserCV}
              onFileSelected={handleFileSelected}
              onRemoveFile={handleRemoveFile}
              onSubmit={handleCVSubmit}
              onMarkChanges={() => setHasChanges(true)}
            />
          )}
        </>
      )}

      {/* Step 2: Pre-Screening Questions or CV Screening */}
      {currentStep === STEPS[1] && (
        <>
          {(() => {
            console.log("🔍 Step 2 Debug:", {
              isSubmittingPreScreening,
              answersCount: Object.keys(preScreeningAnswers).length,
            });
            
            // Show loader only when actually submitting
            return !isSubmittingPreScreening ? (
              <PreScreeningQuestionsForm
                customQuestions={[
                  ...(interview?.customQuestions || []),
                  mockupCheckboxQuestion,
                ]}
                preScreeningQuestions={interview?.preScreeningQuestions}
                onChange={setPreScreeningAnswers}
                onSubmit={handlePreScreeningSubmit}
              />
            ) : (
              <CVScreeningLoader />
            );
          })()}
        </>
      )}

      {/* Step 3: Review Results */}
      {currentStep === STEPS[2] && screeningResult && (
        <CVResultDisplay
          screeningResult={screeningResult}
          interviewID={interview.interviewID}
        />
      )}

      {/* Continue Button for Step 2 Only */}
      {currentStep === STEPS[1] && !isSubmittingPreScreening && (
        <div className={styles.buttonGroup}>
          <button 
            className={styles.continueButton} 
            onClick={handleContinueFromStep2}
            disabled={
              (() => {
                const allQuestions = [
                  ...(interview?.customQuestions || []),
                  ...(interview?.preScreeningQuestions || []),
                  mockupCheckboxQuestion,
                ];
                
                // Check each question
                const isComplete = allQuestions.every((q) => {
                  // For asking-salary, check both min and max
                  if (q.id === 'asking-salary') {
                    const hasMin = preScreeningAnswers[`${q.id}-min`] && preScreeningAnswers[`${q.id}-min`].trim() !== '';
                    const hasMax = preScreeningAnswers[`${q.id}-max`] && preScreeningAnswers[`${q.id}-max`].trim() !== '';
                    return hasMin && hasMax;
                  }
                  // For checkbox questions (converted to comma-separated string)
                  // Check if it has at least one value
                  if (q.id === 'checkbox-skills' || ('answerType' in q && q.answerType === 'checkbox')) {
                    const answer = preScreeningAnswers[q.id];
                    return answer && answer.trim() !== '' && answer !== '[]';
                  }
                  // For other questions, just check if answer exists and is not empty
                  const answer = preScreeningAnswers[q.id];
                  return answer && answer.trim() !== '';
                });
                
                console.log("🔍 Button Validation:", {
                  allQuestions: allQuestions.map(q => ({ id: q.id, answerType: 'answerType' in q ? q.answerType : 'N/A' })),
                  answers: preScreeningAnswers,
                  isComplete,
                  checkDetails: allQuestions.map(q => {
                    if (q.id === 'asking-salary') {
                      return {
                        id: q.id,
                        hasMin: !!preScreeningAnswers[`${q.id}-min`],
                        hasMax: !!preScreeningAnswers[`${q.id}-max`],
                        minValue: preScreeningAnswers[`${q.id}-min`],
                        maxValue: preScreeningAnswers[`${q.id}-max`],
                      };
                    }
                    return {
                      id: q.id,
                      hasAnswer: !!preScreeningAnswers[q.id],
                      value: preScreeningAnswers[q.id],
                      isEmpty: !preScreeningAnswers[q.id] || preScreeningAnswers[q.id].trim() === '',
                    };
                  }),
                });
                
                return !isComplete;
              })()
            }
          >
            Continue
            <img src="/temp/arrow-right.svg" alt="arrow" className={styles.buttonIcon} />
          </button>
        </div>
      )}
    </div>
  );
}
