import React from "react";

interface StepperProps {
  currentStep: number;
  errorsByStep?: Record<number, { hasError: boolean; messages?: string[] }>; 
  progressByStep?: Record<number, number>; // 0..1 per step
  onStepClick?: (stepId: number) => void;
  furthestStep?: number;
}

const steps = [
  { id: 1, label: "Career Details & Team Access" },
  { id: 2, label: "CV Review & Pre-screening" },
  { id: 3, label: "AI Interview Setup" },
  { id: 4, label: "Pipeline Stages" },
  { id: 5, label: "Review Career" },
];

const Stepper = ({ currentStep, errorsByStep, progressByStep, onStepClick, furthestStep }: StepperProps) => {
  // Use the explicitly passed furthestStep instead of calculating it
  // This ensures users can only navigate to steps they've unlocked via "Save and Continue"
  const furthestUnlocked = furthestStep ?? currentStep;

  return (
    <div style={{ width: "100%", maxWidth: "1560px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          gap: 0,
        }}
      >{/* Circles and Lines Row */}
        {steps.map((step, index) => (
          <div
            key={step.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flex: index === steps.length - 1 ? "none" : 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              {(() => {
                const isAllowed = step.id <= furthestUnlocked;
                const pRaw = Math.max(0, Math.min(1, (progressByStep?.[step.id] ?? 0)));
                const p = isAllowed ? pRaw : 0;
                const hasError = !!errorsByStep?.[step.id]?.hasError;
                const isComplete = p >= 1 && !hasError;
                const isInProgress = p > 0 && p < 1;
                const isLast = index === steps.length - 1;
                const showBorder = !hasError && (!isComplete || isLast); // keep border on last step even if complete
                return (
                  <div
                    title={hasError ? ((errorsByStep?.[step.id]?.messages || []).join("\n") || "This step has errors") : undefined}
                    style={{
                      width: 20,
                      height: 20,
                      minWidth: 20,
                      borderRadius: "50%",
                      boxSizing: "border-box",
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: hasError
                        ? "none"
                        : (showBorder ? `inset 0 0 0 2px ${step.id === currentStep ? "#181D27" : "#D5D7DA"}` : "none"),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {hasError && (
                      <img
                        src="/icons/alert-triangle.svg"
                        alt="Step has errors"
                        width={20}
                        height={17}
                        style={{ display: "block" }}
                      />
                    )}
                    {!hasError && isComplete && (
                      isLast ? (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: step.id === currentStep ? "#181D27" : "#D5D7DA",
                          }}
                        />
                      ) : (
                        <img
                          src="/icons/step-progress-check.svg"
                          alt="Step complete"
                          width={20}
                          height={20}
                          style={{ display: "block" }}
                        />
                      )
                    )}
                    {!hasError && !isComplete && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: step.id === currentStep ? "#181D27" : "#D5D7DA",
                        }}
                      />
                    )}
                  </div>
                );
              })()}

              {index < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    backgroundColor: "#EAECF5",
                    marginLeft: 8,
                    marginRight: 8,
                    borderRadius: 999,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {(() => {
                    const isAllowed = step.id <= furthestUnlocked;
                    const p = isAllowed ? Math.max(0, Math.min(1, (progressByStep?.[step.id] ?? 0))) : 0;
                    const hasError = !!errorsByStep?.[step.id]?.hasError;
                    const isComplete = p >= 1 && !hasError;
                    // Show error background if there's an error
                    if (hasError) {
                      return (
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "100%",
                            background: "#FEE4E2",
                          }}
                        />
                      );
                    }
                    if (isComplete) {
                      return (
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "100%",
                            background: "linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%)",
                          }}
                        />
                      );
                    }
                    if (p > 0) {
                      return (
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${p * 100}%`,
                            background: "linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%)",
                          }}
                        />
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>

            {/* Labels Row */}
            <span
              onClick={() => {
                // Allow clicking on unlocked steps to navigate back
                if (step.id <= furthestUnlocked && onStepClick) {
                  onStepClick(step.id);
                }
              }}
              style={{
                marginTop: 6,
                fontSize: 13,
                lineHeight: "18px",
                color: step.id === currentStep ? "#181D27" : step.id <= furthestUnlocked ? "#9CA3AF" : "#D5D7DA",
                fontWeight: step.id === currentStep ? 600 : 400,
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                cursor: step.id <= furthestUnlocked && onStepClick ? "pointer" : "default",
                userSelect: "none",
              }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;