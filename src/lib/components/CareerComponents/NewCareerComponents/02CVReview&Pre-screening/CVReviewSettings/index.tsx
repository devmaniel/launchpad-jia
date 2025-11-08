"use client";
import React, { useEffect, useRef, useState } from "react";
import ToolTip from "./ToolTip";
import SecretPromptInput from "./SecretPromptInput";
import CriteriaDropdown from "./CriteriaDropdown";

interface CVReviewSettingsProps {
  screeningSetting: string;
  setScreeningSetting: (val: string) => void;
  secretPrompt: string;
  setSecretPrompt: (val: string) => void;
}

const CVReviewSettings = ({
  screeningSetting,
  setScreeningSetting,
  secretPrompt,
  setSecretPrompt,
}: CVReviewSettingsProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setShowHelp(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowHelp(false);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);
  return (
    <div className="layered-card-middle">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 16,
            color: "#181D27",
            fontWeight: 700,
            padding: "8px 0px 0px 12px",
          }}
        >
          1. CV Review Settings
        </span>
      </div>
      <div className="layered-card-content" style={{ gap: 0 }}>
        <div>
          <span
            style={{
              fontWeight: 600,
              fontSize: 16,
              color: "#181D27",
              display: "block",
            }}
          >
            CV Screening
          </span>
          <p style={{ fontSize: 16, fontWeight: 400, color: "#6B7280", marginTop: 6 }}>
            Jia automatically endorses candidates who meet the chosen criteria.
          </p>
        </div>

        <div style={{ marginTop: 8 }}>
          <CriteriaDropdown
            screeningSetting={screeningSetting}
            onSelectSetting={setScreeningSetting}
            placeholder="Good Fit and above"
          />
        </div>

        <hr style={{ borderColor: "#EAECF5", borderWidth: 2, width: "100%", margin: "8px 0" }} />

        <div style={{ marginTop: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <img 
                src="/icons/sparkle-prompt-gradient-icon.svg" 
                alt="sparkle" 
                style={{ width: 18, height: 18 }}
              />
              <span style={{ fontWeight: 600, fontSize: 16, color: "#181D27" }}>
                CV Secret Prompt
              </span>
            </div>
            <span style={{ color: "#6B7280", fontSize: 16, fontWeight: 600 }}>(optional)</span>
            <div ref={helpRef} style={{ position: 'relative', display: 'inline-block', marginLeft: 0 }}>
              <img
                src="/icons/help_icon_circle.svg"
                alt="help"
                style={{ width: 18, height: 18, cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHelp((s) => !s);
                }}
              />
              {showHelp && (
                <ToolTip
                  content={
                    <>These prompts remain hidden from candidates and the public job portal. Additionally, only Admins and the Job Owner can view the secret prompt.</>
                  }
                />
              )}
            </div>
          </div>
          <p style={{ fontSize: 16, fontWeight: 400, color: "#6B7280", marginBottom: 12, lineHeight: '20px' }}>
            Secret Prompts give you extra control over Jia's evaluation style, complementing her accurate assessment of requirements from the job description.
          </p>
          <SecretPromptInput
            secretPrompt={secretPrompt}
            setSecretPrompt={setSecretPrompt}
          />
        </div>
      </div>
    </div>
  );
};

export default CVReviewSettings;
