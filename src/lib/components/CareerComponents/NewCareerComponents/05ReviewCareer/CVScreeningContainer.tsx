import React from "react";
import Image from "next/image";
import { Question } from "../02CVReview&Pre-screening/PreScreeningQuestions/types";
import { CustomQuestion } from "../02CVReview&Pre-screening/customQuestionTypes";
import { sanitizeHtml, sanitizeText } from "@/lib/utils/sanitize";

type CVScreeningContainerProps = {
  screeningSetting: string;
  secretPrompt: string;
  preScreeningQuestions: Question[];
  customQuestions: CustomQuestion[];
  askingMinSalary: string;
  askingMaxSalary: string;
  askingMinCurrency: string;
  askingMaxCurrency: string;
  onEditClick?: () => void;
};

const CVScreeningContainer = ({
  screeningSetting,
  secretPrompt,
  preScreeningQuestions,
  customQuestions,
  askingMinSalary,
  askingMaxSalary,
  askingMinCurrency,
  askingMaxCurrency,
  onEditClick,
}: CVScreeningContainerProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const ratingLabel =
    (screeningSetting || "").split("and")[0]?.trim() || screeningSetting;
  
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
      const olMatch = /^\s*(\d+)[\.)\ s]+(.+)$/.exec(text);
      
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
  
  const hasContent = (secretPrompt || "").trim().length > 0;
  const displayHtml = hasContent ? sanitizeHtml(convertParagraphsToLists(secretPrompt)) : '';

  const fmtMoney = (val: string) => {
    const empty = val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
    const n = empty ? 0 : Number(val);
    if (isNaN(n) || n < 0) return null;
    return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const salaryLabel = (() => {
    const min = fmtMoney(askingMinSalary);
    const max = fmtMoney(askingMaxSalary);
    const cur = askingMinCurrency || askingMaxCurrency || "PHP";
    if (min && max) return `${cur} ${min} -  ${cur} ${max}`;
    if (min) return `${cur} ${min}`;
    if (max) return `${cur} ${max}`;
    return "";
  })();

  const optionsForId = (id: string): string[] => {
    if (id === "notice-period")
      return ["Immediately", "< 30 days", "> 30 days"];
    if (id === "work-setup")
      return [
        "At most 1-2x a week",
        "At most 3-4x a week",
        "Open to fully onsite work",
        "Only open to fully remote work",
      ];
    if (id === "asking-salary")
      return salaryLabel ? [`Preferred: ${salaryLabel}`] : [];
    return [];
  };

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
          aria-controls="cv-screening-content"
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
            CV Review & Pre-Screening Questions
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
        <div id="cv-screening-content" style={{ marginTop: 16 }}>
          <div
            style={{
              border: "1px solid #EAECF5",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#FFFFFF",
            }}
          >
            <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#181D27" }}>
              CV Screening
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
                {sanitizeText(ratingLabel)}
              </span>{" "}
              and above
            </p>

            <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <Image src="/icons/sparkle-prompt-gradient-icon.svg" alt="prompt" width={20} height={20} />
              <p style={{ marginBottom: 0, fontSize: 14, fontWeight: 600, color: "#181D27" }}>
                CV Secret Prompt
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
              <p style={{ marginBottom: 0, fontSize: 14, fontWeight: 600, color: "#181D27" }}>
                Pre-Screening Questions
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
                {(Array.isArray(preScreeningQuestions) ? preScreeningQuestions.length : 0) + (Array.isArray(customQuestions) ? customQuestions.length : 0)}
              </div>
            </div>

            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.isArray(customQuestions) && customQuestions.length > 0 &&
                customQuestions.map((q, i) => {
                  const questionText = q.question || "";
                  const answerTypeLabel = {
                    short_answer: "Short Answer",
                    long_answer: "Long Answer",
                    checkboxes: "Checkboxes",
                    range: "Range"
                  }[q.answerType];
                  
                  return (
                    <div key={q.id || i}>
                      <p style={{ marginBottom: 4, fontSize: 16, fontWeight: 400, color: "#414651" }}>
                        {i + 1}. {sanitizeText(questionText)}
                        {answerTypeLabel && <span style={{ color: "#6B7280", fontSize: 14 }}> ({answerTypeLabel})</span>}
                      </p>
                      {q.answerType === 'dropdown' ? (
                        q.options && q.options.length > 0 && (
                          <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
                            {q.options.map((o, j) => (
                              <li key={j} style={{ fontSize: 16, color: "#414651", marginBottom: 4, fontWeight: 400 }}>
                                {sanitizeText(o || `Option ${j + 1}`)}
                              </li>
                            ))}
                          </ul>
                        )
                      ) : q.answerType === 'checkboxes' ? (
                        q.options && q.options.length > 0 && (
                          <div style={{ marginBottom: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                            {q.options.map((o, j) => (
                              <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Image src="/temp/checkbox-svgrepo-com.svg" alt="checkbox" width={16} height={16} />
                                <span style={{ fontSize: 16, color: "#414651", fontWeight: 400 }}>
                                  {sanitizeText(o || `Option ${j + 1}`)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      ) : q.answerType === 'range' ? (
                        <p style={{ marginBottom: 0, fontSize: 16, color: "#414651", fontWeight: 400 }}>
                          Min: {q.minValue || "0"} - Max: {q.maxValue || "0"}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              {Array.isArray(preScreeningQuestions) &&
                preScreeningQuestions.map((q, i) => {
                  const offset = Array.isArray(customQuestions) ? customQuestions.length : 0;
                  const opts = optionsForId(q.id);
                  const questionText = (q.description || q.title || "").trim();
                  return (
                    <div key={q.id || i}>
                      <p style={{ marginBottom: 4, fontSize: 16, fontWeight: 400, color: "#414651" }}>
                        {offset + i + 1}. {sanitizeText(questionText)}
                      </p>
                      {opts.length > 0 && (
                        <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
                          {opts.map((o, j) => (
                            <li key={j} style={{ fontSize: 16, color: "#414651", marginBottom: 4, fontWeight: 400 }}>
                              {o}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
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

export default CVScreeningContainer;
