import React from "react";
import Image from "next/image";

interface AIInterviewSetupProps {
  questions: any[];
  screeningSetting: string;
  requireVideo: boolean;
  secretPrompt?: string;
  onEditClick?: () => void;
}

export default function AIInterviewSetup({ 
  questions,
  screeningSetting,
  requireVideo,
  secretPrompt,
  onEditClick,
}: AIInterviewSetupProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  
  // Parse screening setting to extract rating label
  const ratingLabel = screeningSetting?.replace(" and above", "") || screeningSetting;
  
  const totalQuestions = questions?.reduce((acc, group) => acc + (group.questions?.length || 0), 0) || 0;
  const hasPromptContent = (secretPrompt || "").trim().length > 0;

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #EAECF5",
        borderRadius: 16,
        padding: 16,
        backgroundColor: "#F8F9FC",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() => setIsOpen((p) => !p)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen((p) => !p);
            }
          }}
          aria-expanded={isOpen}
          aria-controls="ai-interview-setup-content"
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        >
          <Image
            src="/icons/chevron.svg"
            alt=""
            width={20}
            height={20}
            style={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)",
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#1F2430",
            }}
          >
            AI Interview Setup
          </p>
        </div>
        {onEditClick && (
          <button
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <Image
              src="/temp/edit-pen-circle-btn.svg"
              alt="edit"
              width={32}
              height={32}
            />
          </button>
        )}
      </div>

      {isOpen && (
        <div id="ai-interview-setup-content" style={{ marginTop: 16 }}>
          <div
            style={{
              border: "1px solid #EAECF5",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#FFFFFF",
            }}
          >
            <p
              style={{
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#181D27",
              }}
            >
              AI Interview Screening
            </p>
            <p style={{ marginBottom: 0, fontWeight: 400, fontSize: 16, color: "#414651" }}>
              Automatically endorse candidates who are{" "}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 8px",
                  borderRadius: 999,
                  backgroundColor: "#EFF8FF",
                  border: "1px solid #B2DDFF",
                  color: "#175CD3",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {ratingLabel}
              </span>{" "}
              and above
            </p>

            <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p
                style={{
                  marginBottom: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#181D27",
                }}
              >
                Require Video on Interview
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <p style={{ marginBottom: 0, fontSize: 16, color: "#414651", fontWeight: 400 }}>
                  {requireVideo ? "Yes" : "No"}
                </p>
                {requireVideo && (
                  <Image src="/temp/circle-green-check.svg" alt="" width={20} height={20} />
                )}
              </div>
            </div>

            {hasPromptContent && (
              <>
                <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Image
                    src="/icons/sparkle-prompt-gradient-icon.svg"
                    alt="prompt"
                    width={20}
                    height={20}
                  />
                  <p
                    style={{
                      marginBottom: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#181D27",
                    }}
                  >
                    AI Interview Secret Prompt
                  </p>
                </div>

                <div 
                  dangerouslySetInnerHTML={{ __html: secretPrompt || "" }}
                  style={{ 
                    fontSize: 16, 
                    color: "#414651",
                    fontWeight: 400,
                  }}
                />
              </>
            )}

            <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p
                style={{
                  marginBottom: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#181D27",
                }}
              >
                Interview Questions
              </p>
              <div
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#F8F9FC",
                  border: "1px solid #D5D9EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#363F72",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {totalQuestions}
              </div>
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {questions?.length > 0 && questions?.map((questionGroup: any, groupIndex: number) => (
                <div key={groupIndex}>
                  <p style={{ margin: 0, marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#181D27" }}>
                    {questionGroup.category}
                  </p>
                  {questionGroup?.questions?.length > 0 && questionGroup?.questions?.map((question: any, qIndex: number) => (
                    <p
                      key={qIndex}
                      style={{
                        marginBottom: 4,
                        fontSize: 16,
                        fontWeight: 400,
                        color: "#414651",
                      }}
                    >
                      • {question.question}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
