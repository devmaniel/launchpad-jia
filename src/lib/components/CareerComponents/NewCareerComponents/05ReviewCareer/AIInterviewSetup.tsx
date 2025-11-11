import React from "react";
import Image from "next/image";

type AIInterviewSetupProps = {
  onEditClick?: () => void;
  aiInterviewSecretPrompt: string;
  aiInterviewScreeningSetting: string;
  aiInterviewRequireVideo: boolean;
};

const AIInterviewSetup = ({ 
  onEditClick,
  aiInterviewSecretPrompt,
  aiInterviewScreeningSetting,
  aiInterviewRequireVideo,
}: AIInterviewSetupProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  // Parse screening setting to extract rating label
  const ratingLabel = aiInterviewScreeningSetting.replace(" and above", "");
  
  const looksLikeHtml = (s: string) => /<(ul|ol|li|p|br|div|strong|em|b|i|u)\b/i.test(s);
  
  const convertParagraphsToLists = (content: string): string => {
    if (typeof window === 'undefined') return content;
    
    // First check if it's plain text or HTML
    const isHtml = /<[^>]+>/.test(content);
    let html = content;
    
    // If plain text, convert line breaks to p tags first
    if (!isHtml) {
      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      html = lines.map(line => `<p>${line}</p>`).join('');
    }
    
    const container = document.createElement('div');
    container.innerHTML = html;
    
    const paragraphs = Array.from(container.querySelectorAll('p'));
    let currentList: HTMLUListElement | HTMLOListElement | null = null;
    let listType: 'ul' | 'ol' | null = null;
    
    paragraphs.forEach((p) => {
      const text = p.textContent?.trim() || '';
      const ulMatch = /^\s*(?:[-*•])\s+(.+)$/.exec(text);
      const olMatch = /^\s*(\d+)[\.)\s]+(.+)$/.exec(text);
      
      if (ulMatch) {
        if (listType !== 'ul') {
          currentList = document.createElement('ul');
          listType = 'ul';
          p.parentNode?.insertBefore(currentList, p);
        }
        const li = document.createElement('li');
        li.textContent = ulMatch[1];
        currentList?.appendChild(li);
        p.remove();
      } else if (olMatch) {
        if (listType !== 'ol') {
          currentList = document.createElement('ol');
          listType = 'ol';
          p.parentNode?.insertBefore(currentList, p);
        }
        const li = document.createElement('li');
        li.textContent = olMatch[2];
        currentList?.appendChild(li);
        p.remove();
      } else {
        currentList = null;
        listType = null;
      }
    });
    
    return container.innerHTML;
  };
  
  const hasContent = (aiInterviewSecretPrompt || "").trim().length > 0;
  const displayHtml = hasContent ? convertParagraphsToLists(aiInterviewSecretPrompt) : '';
  
  const requireVideoValue = aiInterviewRequireVideo;
  const questionGroups: { title: string; items: string[] }[] = [
    {
      title: "CV Validation / Experience",
      items: [
        "What specific experience do you have with Java solutions, and how have you applied that in previous roles?",
        "Describe your experience with Java. Can you provide an example of a complex query you have worked on?",
      ],
    },
    {
      title: "Technical",
      items: [
        "Can you explain how you would approach developing a custom API for integrating Java with a third-party system?",
        "How do you ensure that your code is optimized for performance and scalability?",
      ],
    },
    {
      title: "Behavioral",
      items: [
        "Can you describe a situation where you faced an ethical dilemma in a project? How did you handle it?",
        "Tell us about a time when you had to take responsibility for a mistake in your work. What did you learn from it?",
        "What aspects of our company culture resonate most with you, and how do you see yourself contributing to that culture?",
      ],
    },
    {
      title: "Analytical",
      items: [
        "How do you prioritize your tasks when working on multiple projects with tight deadlines?",
      ],
    },
    {
      title: "Others",
      items: [
        "How do you handle constructive criticism from team members or supervisors?",
        "Can you give an example of how you've successfully collaborated with a cross-functional team?",
      ],
    },
  ];
  const totalQuestions = questionGroups.reduce((sum, g) => sum + g.items.length, 0);

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
                  {requireVideoValue ? "Yes" : "No"}
                </p>
                {requireVideoValue && (
                  <Image src="/temp/circle-green-check.svg" alt="" width={20} height={20} />
                )}
              </div>
            </div>

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

            {hasContent ? (
              <div 
                dangerouslySetInnerHTML={{ __html: displayHtml }}
                className="secret-prompt-display"
                style={{ 
                  fontSize: 16, 
                  color: "#414651",
                }}
              />
            ) : (
              <p style={{ marginBottom: 0, fontSize: 16, fontWeight: 400, color: "#414651" }}>No prompt set.</p>
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
              {(() => {
                let idx = 1;
                return (
                  <div>
                    {questionGroups.map((group, gi) => (
                      <div key={gi} style={{ marginBottom: 8 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#414651" }}>
                          {group.title}
                        </p>
                        {group.items.map((question, qi) => (
                          <p
                            key={qi}
                            style={{
                              marginBottom: 4,
                              fontSize: 16,
                              fontWeight: 400,
                              color: "#414651",
                            }}
                          >
                            {idx++}. {question}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        :global(.secret-prompt-display ul),
        :global(.secret-prompt-display ol) {
          margin: 0 0 8px 0 !important;
          margin-block-start: 0 !important;
          margin-block-end: 8px !important;
          padding-left: 0 !important;
          padding-inline-start: 0 !important;
          margin-left: 0 !important;
          margin-inline-start: 0 !important;
          list-style-position: inside !important;
        }
        :global(.secret-prompt-display ul:first-child),
        :global(.secret-prompt-display ol:first-child) {
          margin-top: 0 !important;
        }
        :global(.secret-prompt-display ul:last-child),
        :global(.secret-prompt-display ol:last-child) {
          margin-bottom: 0 !important;
        }
        :global(.secret-prompt-display li) {
          margin: 0 !important;
          padding-left: 0 !important;
        }
        :global(.secret-prompt-display li > p) {
          margin: 0 !important;
        }
        :global(.secret-prompt-display p) {
          margin: 0 0 8px 0 !important;
        }
        :global(.secret-prompt-display p:last-child) {
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default AIInterviewSetup;