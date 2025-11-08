"use client";

import React from "react";
import Step4Header from "./Step4Header";
import PipelineCanva from "./PipelineCanva/index";

export default function Step4() {
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
        <Step4Header />
        <PipelineCanva />
      </div>
    </div>
  );
}
