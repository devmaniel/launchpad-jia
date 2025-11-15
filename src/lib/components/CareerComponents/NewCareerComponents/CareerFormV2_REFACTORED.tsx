"use client";

import { useAppContext } from "@/lib/context/AppContext";
import { errorToast } from "@/lib/Utils";
import CareerActionModal from "../CareerActionModal";
import FullScreenLoadingAnimation from "../FullScreenLoadingAnimation";
import FormHeader from "./FormHeader";
import Stepper from "./Stepper";
import StepRenderer from "./StepRenderer";
import { CareerFormV2Props } from "./types/careerFormProps.types";
import { useCareerFormState } from "./hooks/useCareerFormState";
import { useCareerFormValidation } from "./hooks/useCareerFormValidation";
import { useStepProgress } from "./hooks/useStepProgress";
import { useLocationData } from "./hooks/useLocationData";
import { useCareerFormSubmit } from "./hooks/useCareerFormSubmit";
import { useCareerFormStorage } from "./hooks/useCareerFormStorage";
import { useFieldHandlers } from "./hooks/useFieldHandlers";
import { useStepProps } from "./hooks/useStepProps";
import { useCareerFormEffects } from "./hooks/useCareerFormEffects";

export default function CareerFormV2({
  career,
  formType,
  setShowEditModal,
  currentStep = 1,
  forcePrefill = false,
}: CareerFormV2Props) {
  const { user, orgID } = useAppContext();
  const storageKey = career?._id ? `careerFormV2:${career._id}` : 'careerFormV2:new';

  // Core hooks
  const formState = useCareerFormState(career, user);
  const validation = useCareerFormValidation();
  const progress = useStepProgress();
  const location = useLocationData(career?.province);
  const handlers = useFieldHandlers(
    validation.setErrors,
    validation.setFieldTouched,
    validation.setCareerInfoTouched
  );
  
  // Submission with handlers
  const submission = useCareerFormSubmit(
    career,
    user,
    orgID,
    storageKey,
    formState.setHasChanges,
    formState,
    validation,
    progress
  );
  
  // Step props consolidation
  const stepProps = useStepProps(formState, validation, handlers, location);

  // Storage and side effects
  useCareerFormStorage(
    storageKey,
    formState,
    formState.hasChanges,
    formState.setHasChanges,
    formState.baselineRef
  );
  useCareerFormEffects(user, formState, validation, progress, location);

  // Handlers
  const handleStepClick = (stepId: number) => {
    if (stepId <= formState.furthestStep) formState.setActiveStep(stepId);
  };

  const isFormValid = () => {
    const stripped = validation.stripHtml(formState.description);
    const step1Valid = (
      (formState.jobTitle || "").trim().length > 0 &&
      stripped.length > 0 &&
      (formState.workSetup || "").trim().length > 0
    );

    // If on Step 3 or later, also check Step 3 validation
    if (formState.activeStep >= 3) {
      const step3Validation = validation.validateStep3(formState.aiQuestionsCount);
      return step1Valid && step3Validation.isValid;
    }

    return step1Valid;
  };

  return (
    <div className="col" style={{ marginBottom: "35px" }}>
      <FormHeader
        formType={formType}
        isFormValid={isFormValid()}
        isSavingCareer={submission.isSavingCareer}
        activeStep={formState.activeStep}
        isOnFurthestStep={formState.activeStep === formState.furthestStep}
        onSaveUnpublished={() => {
          if (formType === "add") {
            submission.confirmSaveCareer("inactive");
          } else {
            submission.handleSaveCareer("inactive");
          }
        }}
        onSavePublished={() => {
          if (formType === "add") {
            submission.confirmSaveCareer("active");
          } else {
            submission.handleSaveCareer("active");
          }
        }}
        onSaveAndContinue={submission.handleSaveAndContinue}
        onCancel={() => setShowEditModal?.(false)}
      />

      <div style={{ width: "100%", maxWidth: "1560px", margin: '0 auto', marginTop: 20, marginBottom: 8 }}>
        <Stepper
          currentStep={formState.activeStep}
          progressByStep={progress.stepProgress}
          errorsByStep={validation.stepErrors}
          onStepClick={handleStepClick}
          furthestStep={formState.furthestStep}
        />
      </div>

      <div style={{ width: "100%", marginTop: 24, marginBottom: 8 }}>
        <hr style={{ borderColor: "#EAECF5", borderWidth: "1px", borderStyle: "solid" }} />
      </div>

      <StepRenderer activeStep={formState.activeStep} stepProps={stepProps} />

      {submission.showSaveModal && (
        <CareerActionModal
          action={submission.showSaveModal}
          onAction={submission.handleSaveCareer}
        />
      )}
      
      {submission.isSavingCareer && (
        <FullScreenLoadingAnimation
          title={formType === "add" ? "Saving career..." : "Updating career..."}
          subtext={`Please wait while we are ${formType === "add" ? "saving" : "updating"} the career`}
        />
      )}
    </div>
  );
}
