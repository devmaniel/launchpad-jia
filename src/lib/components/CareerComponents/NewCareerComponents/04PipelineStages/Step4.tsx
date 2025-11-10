"use client";

import React, { useState } from "react";
import Step4Header from "./Step4Header";
import PipelineCanva from "./PipelineCanva/index";
import RestoreConfirmationModal from "./RestoreConfirmationModal";

interface Step4Props {
  pipelineStages?: any[];
  setPipelineStages?: (stages: any[]) => void;
}

// Default core pipeline stages
const DEFAULT_PIPELINE_STAGES = [
  {
    icon: "/temp/user-temp.svg",
    title: "CV Screening",
    substages: ["Waiting Submission", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/mic.svg",
    title: "AI Interview",
    substages: ["Waiting Interview", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/user-temp.svg",
    title: "Final Human Interview",
    substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/user-temp.svg",
    title: "Job Offer",
    substages: ["For Final Interview", "Waiting Offer Acceptance", "For Contract Signing", "Hired"],
    isCore: true,
  },
];

export default function Step4({ pipelineStages, setPipelineStages }: Step4Props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleRestoreDefault = () => {
    // Check if there are custom stages (non-core stages)
    const hasCustomStages = pipelineStages && pipelineStages.some((stage: any) => !stage.isCore);
    
    if (hasCustomStages) {
      // Show confirmation modal if there are custom stages
      setShowConfirmModal(true);
    } else {
      // Directly restore if no custom stages
      restoreToDefault();
    }
  };

  const restoreToDefault = () => {
    if (setPipelineStages) {
      setPipelineStages(DEFAULT_PIPELINE_STAGES);
    }
    setShowConfirmModal(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Step4Header onRestoreDefault={handleRestoreDefault} />
        <PipelineCanva pipelineStages={pipelineStages} setPipelineStages={setPipelineStages} />
      </div>
      
      {showConfirmModal && (
        <RestoreConfirmationModal
          onConfirm={restoreToDefault}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}
