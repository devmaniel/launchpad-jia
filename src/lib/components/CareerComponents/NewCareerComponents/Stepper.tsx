import React from "react";

interface StepperProps {
  currentStep: number;
  errorsByStep?: Record<number, { hasError: boolean; messages?: string[] }>; 
  progressByStep?: Record<number, number>; // 0..1 per step
  onStepClick?: (stepId: number) => void;
}

const steps = [
  { id: 1, label: "Career Details & Team Access" },
  { id: 2, label: "CV Review & Pre-screening" },
  { id: 3, label: "AI Interview Setup" },
  { id: 4, label: "Pipeline Stages" },
  { id: 5, label: "Review Career" },
];

const Stepper = ({ currentStep, errorsByStep, progressByStep, onStepClick }: StepperProps) => {
  const stepsOrder = steps.map((s) => s.id);
  let furthestUnlocked = stepsOrder[stepsOrder.length - 1];
  for (const s of steps) {
    const p = Math.max(0, Math.min(1, (progressByStep?.[s.id] ?? 0)));
    const hasError = !!errorsByStep?.[s.id]?.hasError;
    if (p < 1 || hasError) {
      furthestUnlocked = s.id;
      break;
    }
  }

  return (
    <div style={{ width: "100%" }}>
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
              flex: 1,
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
                const showBorder = !hasError && !isComplete; // remove border when complete
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
                      border: hasError
                        ? "none"
                        : (showBorder ? `2px solid ${step.id === currentStep ? "#181D27" : "#D5D7DA"}` : "none"),
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
                      <img
                        src="/icons/step-progress-check.svg"
                        alt="Step complete"
                        width={20}
                        height={20}
                        style={{ display: "block" }}
                      />
                    )}
                    {!hasError && !isComplete && isInProgress && step.id === currentStep && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#181D27",
                        }}
                      />
                    )}
                    {!hasError && !isComplete && (!isInProgress || step.id !== currentStep) && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#D5D7DA",
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
              role={onStepClick ? "button" : undefined}
              tabIndex={onStepClick ? 0 : undefined}
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
                cursor: onStepClick ? (step.id <= furthestUnlocked ? "pointer" : "not-allowed") : "default",
              }}
              onClick={() => {
                if (onStepClick && step.id <= furthestUnlocked) onStepClick(step.id);
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