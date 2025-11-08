"use client";
import React from "react";
import AIInterviewScreeningDropdown from "./AIInterviewScreeningDropdown";
import ToolTip from "../../02CVReview&Pre-screening/CVReviewSettings/ToolTip";
import SecretPromptInput from "../../02CVReview&Pre-screening/CVReviewSettings/SecretPromptInput";

const AIInterviewSettings: React.FC = () => {
  const [screeningSetting, setScreeningSetting] = React.useState<string>("Good Fit and above");
  const [requireVideo, setRequireVideo] = React.useState<boolean>(true);
  const [secretPrompt, setSecretPrompt] = React.useState<string>("");
  const [showHelp, setShowHelp] = React.useState(false);
  const helpRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
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
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700, padding: "8px 0px 0px 12px" }}>
            1. AI Interview Settings
          </span>
        </div>
      </div>

      <div className="layered-card-content" style={{ gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: "#181D27" }}>AI Interview Screening</div>
            <div style={{ color: "#414651", fontSize: 16 }}>Jia automatically endorses candidates who meet the chosen criteria.</div>
          </div>
          <AIInterviewScreeningDropdown
            screeningSetting={screeningSetting}
            onSelectSetting={(v) => setScreeningSetting(v)}
          />
        </div>

        <hr style={{ borderColor: '#EAECF5', borderWidth: 1, height: 2, width: '100%', margin: '12px 0' }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: "#181D27" }}>Require Video on Interview</div>
            <div style={{ color: "#414651", fontSize: 16 }}>Require candidates to keep their camera on. Recordings will appear on their analysis page.</div>
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/icons/videocam.svg" alt="Video" style={{ width: 25, height: 25 }} />
              <span style={{ fontWeight: 400, fontSize: 16, color: "#414651" }}>Require Video Interview</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input type="checkbox" checked={requireVideo} onChange={() => setRequireVideo(!requireVideo)} />
                <span className="slider round"></span>
              </label>
              <span style={{ color: requireVideo ? '#414651' : '#6B7280', fontWeight: 400 }}>Yes</span>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: '#EAECF5', borderWidth: 1, height: 2, width: '100%', margin: '12px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/icons/sparkle-prompt-gradient-icon.svg" alt="Secret Prompt" style={{ width: 20, height: 20 }} />
            <span style={{ fontWeight: 600, fontSize: 16, color: '#181D27' }}>AI Interview Secret Prompt <span style={{ color: '#6B7280', fontWeight: 500 }}>(optional)</span></span>
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
          <div style={{ color: '#414651', fontWeight: 400, fontSize: 16, marginRight: 20}}>
            Secret Prompts give you extra control over Jia's evaluation style, complementing her accurate assessment of requirements from the job description.
          </div>
          <SecretPromptInput
            secretPrompt={secretPrompt}
            setSecretPrompt={setSecretPrompt}
            placeholder="Enter a secret prompt (e.g. Treat candidates who speak in Taglish, English, or Tagalog equally. Focus on clarity, coherence, and confidence rather than language preference or accent.)"
          />
        </div>
      </div>
    </div>
  );
};

export default AIInterviewSettings;

