import React from "react";
import Image from "next/image";

interface InterviewQuestionsProps {
  questions: any[];
  onEditClick?: () => void;
}

export default function InterviewQuestions({ questions, onEditClick }: InterviewQuestionsProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const totalQuestions = questions?.reduce((acc, group) => acc + (group.questions?.length || 0), 0) || 0;

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
          aria-controls="interview-questions-content"
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
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Interview Questions
            <span
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
            </span>
          </p>
        </div>
        {onEditClick && (
          <button
            onClick={onEditClick}
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
        <div id="interview-questions-content" style={{ marginTop: 16 }}>
          <div
            style={{
              border: "1px solid #EAECF5",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
