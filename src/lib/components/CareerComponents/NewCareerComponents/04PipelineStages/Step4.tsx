"use client";

import React from "react";
import Step4Header from "./Step4Header";
import PipelineCanva from "./PipelineCanva/index";

export default function Step4() {
  return (
    <div style={{ width: "100%", maxWidth: 1560, margin: "0 auto" }}>
      <Step4Header />

      <div style={{ width: "100%", marginTop: 16, marginBottom: 16 }}>
        <hr style={{ borderColor: "#EAECF5", borderWidth: 1, borderStyle: "solid" }} />
      </div>

      <PipelineCanva />
    </div>
  );
}

