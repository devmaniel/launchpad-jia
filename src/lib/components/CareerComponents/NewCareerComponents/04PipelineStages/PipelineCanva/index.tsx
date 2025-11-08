"use client";

import React from "react";

const StageHeader = ({ title }: { title: string }) => (
  <div style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 12px 0 12px",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <img src="/icons/drag-indicator.svg" alt="drag" width={18} height={18} />
      <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{title}</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src="/icons/ellipsis-vertical.svg" alt="menu" width={18} height={18} />
    </div>
  </div>
);

const SubstageItem = ({ label }: { label: string }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #EAECF5",
    borderRadius: 12,
    padding: "12px 12px",
    background: "#fff",
  }}>
    <span style={{ fontSize: 14, color: "#111827" }}>{label}</span>
    <img src="/icons/plus.svg" alt="add" width={18} height={18} />
  </div>
);

const StageCard = ({
  title,
  substages,
}: {
  title: string;
  substages: string[];
}) => (
  <div style={{
    flex: 1,
    minWidth: 260,
    maxWidth: 360,
    background: "#F9FAFB",
    border: "1px solid #EAECF5",
    borderRadius: 16,
    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
  }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "#667085",
      fontSize: 12,
      padding: "10px 12px 0 12px",
    }}>
      <span>Core stage, cannot move</span>
    </div>
    <div style={{ paddingBottom: 12 }}>
      <StageHeader title={title} />
      <div style={{ padding: "0 12px 12px 12px" }}>
        <div style={{ fontSize: 12, color: "#667085", marginBottom: 8 }}>Substages</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {substages.map((s, idx) => (
            <SubstageItem key={idx} label={s} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function PipelineCanva() {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
        <StageCard
          title="CV Screening"
          substages={["Waiting Submission", "For Review"]}
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 1, height: "100%", background: "#EAECF5", borderRadius: 999 }} />
          <div style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid #EAECF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 12px", background: "#fff" }}>
            <img src="/icons/plus.svg" width={16} height={16} alt="add stage" />
          </div>
          <div style={{ width: 1, height: "100%", background: "#EAECF5", borderRadius: 999 }} />
        </div>

        <StageCard
          title="All Interview"
          substages={["Waiting Interview", "For Review"]}
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 1, height: "100%", background: "#EAECF5", borderRadius: 999 }} />
          <div style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid #EAECF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 12px", background: "#fff" }}>
            <img src="/icons/plus.svg" width={16} height={16} alt="add stage" />
          </div>
          <div style={{ width: 1, height: "100%", background: "#EAECF5", borderRadius: 999 }} />
        </div>

        <StageCard
          title="Final Human Interview"
          substages={["Waiting Schedule", "Waiting Interview", "For Review"]}
        />

        {/* separator with plus */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 1, height: "100%", background: "#EAECF5", borderRadius: 999 }} />
          <div style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid #EAECF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 12px", background: "#fff" }}>
            <img src="/icons/plus.svg" width={16} height={16} alt="add stage" />
          </div>
          <div style={{ width: 1, height: "100%", background: "#EAECF5", borderRadius: 999 }} />
        </div>

        <StageCard
          title="Job Offer"
          substages={["For Final Review", "Waiting Offer Acceptance", "For Contract Signing", "Hired"]}
        />
      </div>
    </div>
  );
}
