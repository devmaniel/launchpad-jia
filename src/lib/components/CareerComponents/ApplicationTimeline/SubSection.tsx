import ApplicantCards from "./ApplicantCards";

interface SubSectionProps {
  title: string;
  count: number;
  candidates: any[];
  stage: string;
  isSingleSubsection?: boolean;
  handleCandidateMenuOpen: (candidate: any) => void;
  handleCandidateCVOpen: (candidate: any) => void;
  handleEndorseCandidate: (candidate: any) => void;
  handleDropCandidate: (candidate: any) => void;
  handleCandidateHistoryOpen: (candidate: any) => void;
  handleRetakeInterview: (candidate: any) => void;
  emptyMessage?: string;
}

export default function SubSection({
  title,
  count,
  candidates,
  stage,
  isSingleSubsection = false,
  handleCandidateMenuOpen,
  handleCandidateCVOpen,
  handleEndorseCandidate,
  handleDropCandidate,
  handleCandidateHistoryOpen,
  handleRetakeInterview,
  emptyMessage = "No candidates in this section"
}: SubSectionProps) {
  return (
    <div
      style={{
        background: "#F8F9FC",
        borderRadius: 8,
        padding: "12px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
        flex: "1 1 0",
        minWidth: 340,
        width: isSingleSubsection ? 340 : "auto"
      }}
    >
      {/* Sub-section Header */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        width: "100%"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img 
            src="/temp/zap-circle-green.svg" 
            alt={title} 
            style={{ width: 25, height: 25 }}
          />
          <span style={{ fontSize: 16, fontWeight: 500, color: "#1E1F3B", whiteSpace: "nowrap" }}>
            {title}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 18,
              height: 18,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #D5D9EB",
              padding: "0 4px"
            }}
          >
            <span style={{ fontSize: 11, color: "#363F72", fontWeight: 700 }}>
              {count}
            </span>
          </div>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer" }}>
          <img 
            src="/temp/more-vertical.svg" 
            alt="More options" 
            style={{ width: 20, height: 20 }}
          />
        </button>
      </div>

      {/* Candidates */}
      <ApplicantCards
        candidates={candidates}
        stage={stage}
        handleCandidateMenuOpen={handleCandidateMenuOpen}
        handleCandidateCVOpen={handleCandidateCVOpen}
        handleEndorseCandidate={handleEndorseCandidate}
        handleDropCandidate={handleDropCandidate}
        handleCandidateHistoryOpen={handleCandidateHistoryOpen}
        handleRetakeInterview={handleRetakeInterview}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}
