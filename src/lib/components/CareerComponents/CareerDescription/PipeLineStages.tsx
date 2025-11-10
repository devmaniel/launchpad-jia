import React from "react";
import Image from "next/image";

type Stage = {
  icon: string;
  title: string;
  substages: string[];
};

type PipeLaneStagesProps = {
  onEditClick?: () => void;
  stages?: Stage[];
};

const defaultStages: Stage[] = [
  {
    icon: "/temp/user-temp.svg",
    title: "CV Screening",
    substages: ["Waiting Submission", "For Review"],
  },
  {
    icon: "/temp/mic.svg",
    title: "AI Interview",
    substages: ["Waiting Interview", "For Review"],
  },
  {
    icon: "/temp/personality-test.svg",
    title: "Personality Test",
    substages: ["Waiting Submission", "For Review"],
  },
  {
    icon: "/temp/coding-test.svg",
    title: "Coding Test",
    substages: ["Waiting Submission", "For Review"],
  },
  {
    icon: "/temp/user-temp.svg",
    title: "Final Human Interview",
    substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"],
  },
  {
    icon: "/temp/user-temp.svg",
    title: "Job Offer",
    substages: ["For Final Interview", "Waiting Offer Acceptance", "For Contract Signing", "Hired"],
  },
];

const badgeStyle: React.CSSProperties = {
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
};

const substagePillStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  backgroundColor: "#FFFFFF",
  border: "1px solid #E9EAEB",
  color: "#414651",
  fontSize: 14,
  fontWeight: 500,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #EAECF5",
  borderRadius: 12,
  backgroundColor: "#F8F9FC",
  padding: 16,
  height: "100%",
  minHeight: 297,
  display: "flex",
  flexDirection: "column",
};

const PipeLaneStages = ({ onEditClick, stages }: PipeLaneStagesProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const displayStages = stages || defaultStages;

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
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar-x {
          scrollbar-width: thin;
          scrollbar-color: #E9EAEB transparent;
        }
        .custom-scrollbar-x::-webkit-scrollbar {
          height: 20px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-thumb {
          background-color: #E9EAEB;
          border-radius: 10px;
          border: 6px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar-x::-webkit-scrollbar-corner {
          background: transparent;
        }
      `,
        }}
      />
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
          aria-controls="pipeline-stages-content"
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        >
          <Image
            src="/icons/chevron.svg"
            alt=""
            width={20}
            height={20}
            style={{ transition: "transform 0.2s ease", transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)" }}
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
            Pipeline Stages
            <span style={badgeStyle}>{displayStages.length}</span>
          </p>
        </div>

        <button
          onClick={onEditClick}
          style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
        >
          <Image src="/temp/edit-pen-circle-btn.svg" alt="edit" width={32} height={32} />
        </button>
      </div>

      {isOpen && (
        <div id="pipeline-stages-content" style={{ marginTop: 16, height: "auto" }}>
          <div style={{ height: "100%"}}>
            <div
              className="custom-scrollbar-x"
              style={{
                backgroundColor: "#FFFFFF",  
                height: "100%",   
                padding: "16px 24px",
                overflowX: "auto",
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: 16,
                   height: "100%",
                  flexWrap: "nowrap",
                  padding: 2,
                  width: "max-content",
                  minHeight: 220,
                }}
              >
                {displayStages.map((stage, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...cardStyle,
                      width: 320,
                      flex: "0 0 320px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Image src={stage.icon} alt="" width={20} height={20} />
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1F2430" }}>{stage.title}</p>
                    </div>
                    {stage.substages && stage.substages.length > 0 && (
                      <>
                        <p style={{ margin: 0, fontSize: 14, color: "#717680", fontWeight: 400, marginBottom: 8 }}>
                          Substages
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {stage.substages.map((ss, sidx) => (
                            <div key={sidx} style={substagePillStyle}>
                              {ss}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipeLaneStages;
