"use client";

import React from "react";

interface Props {
  onClick?: () => void;
  disabled?: boolean;
}

export default function RestoreToDefaultButton({ onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        background: "#fff",
        color: "#414651",
        border: "1px solid #D5D7DA",
        borderRadius: 999,
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <img src="/icons/rotate-ccw.svg" alt="Restore" width={16} height={16} />
      <span style={{ fontSize: 14, fontWeight: 500 }}>Restore to default</span>
    </button>
  );
}
