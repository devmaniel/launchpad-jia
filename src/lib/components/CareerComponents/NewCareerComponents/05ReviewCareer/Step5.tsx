"use client";
import React from 'react';
import Image from 'next/image';
import { Question } from "../02CVReview&Pre-screening/PreScreeningQuestions/types";

type Step5Props = {
  screeningSetting: string;
  secretPrompt: string;
  preScreeningQuestions: Question[];
  minimumSalary: string;
  maximumSalary: string;
  minimumSalaryCurrency: string;
  maximumSalaryCurrency: string;
  salaryNegotiable: boolean;
  onEditClick?: () => void;
};

const Step5 = ({
  screeningSetting,
  secretPrompt,
  preScreeningQuestions,
  minimumSalary,
  maximumSalary,
  minimumSalaryCurrency,
  maximumSalaryCurrency,
  salaryNegotiable,
  onEditClick,
}: Step5Props) => {
  const ratingLabel = (screeningSetting || "").split("and")[0]?.trim() || screeningSetting;
  const promptLines = (secretPrompt || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const fmtMoney = (val: string) => {
    const n = Number(val);
    if (!n || isNaN(n)) return null;
    return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const salaryLabel = (() => {
    if (salaryNegotiable) return "Negotiable";
    const min = fmtMoney(minimumSalary);
    const max = fmtMoney(maximumSalary);
    const cur = minimumSalaryCurrency || maximumSalaryCurrency || "PHP";
    if (min && max) return `${cur} ${min} -  ${cur} ${max}`;
    if (min) return `${cur} ${min}`;
    if (max) return `${cur} ${max}`;
    return "";
  })();

  const optionsForId = (id: string): string[] => {
    if (id === "notice-period") return ["Immediately", "< 30 days", "> 30 days"];
    if (id === "work-setup") return [
      "At most 1-2x a week",
      "At most 3-4x a week",
      "Open to fully onsite work",
      "Only open to fully remote work",
    ];
    if (id === "asking-salary") return salaryLabel ? [`Preferred: ${salaryLabel}`] : [];
    return [];
  };

  return (
    <div style={{ width: "100%", maxWidth: "1560px", margin: "0 auto" }}>
      <div style={{ width: "100%", border: "1px solid #EAECF5", borderRadius: 16, padding: 16, backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ marginBottom: 0, fontSize: 16, fontWeight: 700, color: "#1F2430" }}>CV Review & Pre-Screening Questions</p>
          <button onClick={onEditClick} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}>
            <Image src="/temp/edit-pen-circle-btn.svg" alt="edit" width={32} height={32} />
          </button>
        </div>

        <div style={{ marginTop: 16, border: "1px solid #EAECF5", borderRadius: 12, padding: 16, backgroundColor: "#F8F9FC" }}>
          <p style={{ marginBottom: 8, fontSize: 12, fontWeight: 700, color: "#414651" }}>CV Screening</p>
          <p style={{ marginBottom: 0, fontSize: 14, color: "#414651" }}>
            Automatically endorse candidates who are{" "}
            <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 999, backgroundColor: "#EEF4FF", color: "#3538CD", fontSize: 12, fontWeight: 700 }}>
              {ratingLabel}
            </span>{" "}
            and above
          </p>

          <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <Image src="/temp/interpreter_mode.svg" alt="prompt" width={18} height={18} />
            <p style={{ marginBottom: 0, fontSize: 14, fontWeight: 700, color: "#1E1F3B" }}>CV Secret Prompt</p>
          </div>

          {promptLines.length > 0 ? (
            <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
              {promptLines.map((line, idx) => (
                <li key={idx} style={{ fontSize: 14, color: "#414651", marginBottom: 4 }}>{line}</li>
              ))}
            </ul>
          ) : (
            <p style={{ marginBottom: 0, fontSize: 14, color: "#717680" }}>No prompt set.</p>
          )}

          <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ marginBottom: 0, fontSize: 12, fontWeight: 700, color: "#414651" }}>Pre-Screening Questions</p>
            <div style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: "#F2F4F7", display: "flex", alignItems: "center", justifyContent: "center", color: "#414651", fontSize: 12, fontWeight: 700 }}>
              {Array.isArray(preScreeningQuestions) ? preScreeningQuestions.length : 0}
            </div>
          </div>

          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.isArray(preScreeningQuestions) && preScreeningQuestions.map((q, i) => {
              const opts = optionsForId(q.id);
              const questionText = (q.description || q.title || "").trim();
              return (
                <div key={q.id || i}>
                  <p style={{ marginBottom: 4, fontSize: 14, fontWeight: 600, color: "#1E1F3B" }}>
                    {i + 1}. {questionText}
                  </p>
                  {opts.length > 0 && (
                    <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
                      {opts.map((o, j) => (
                        <li key={j} style={{ fontSize: 14, color: "#414651", marginBottom: 4 }}>{o}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5;