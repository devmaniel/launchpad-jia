"use client";

import React from "react";

interface Props {
  onClick?: () => void;
  disabled?: boolean;
}

export default function CopyPipeLineButton({ onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: 263,
        padding: "8px 14px",
        background: "#fff",
        color: "#414651",
        border: "1px solid #D5D7DA",
        borderRadius: 999,
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500 }}>Copy pipeline from existing job</span>
      <img src="/icons/chevron.svg" alt="More" width={16} height={16} style={{ marginLeft: 2 }} />
    </button>
  );
}
