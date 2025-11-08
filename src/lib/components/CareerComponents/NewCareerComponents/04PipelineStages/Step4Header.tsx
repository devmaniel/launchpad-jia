"use client";

import React from "react";
import RestoreToDefaultButton from "./RestoreToDefaultButton";
import CopyPipeLineButton from "./CopyPipeLineButton";

interface Props {
  onRestoreDefault?: () => void;
  onCopyFromExisting?: () => void;
}

export default function Step4Header({ onRestoreDefault, onCopyFromExisting }: Props) {
  return (
    <div style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#181D27" }}>Customize pipeline stages</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#717680", fontWeight:400, width: "100%" }}>
            Create, modify, reorder, and delete stages and sub-stages. Core stages are fixed and can’t be moved or edited as they are essential to Jia’s system logic.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <RestoreToDefaultButton onClick={onRestoreDefault} />
          <CopyPipeLineButton onClick={onCopyFromExisting} />
        </div>
      </div>
    </div>
  );
}

