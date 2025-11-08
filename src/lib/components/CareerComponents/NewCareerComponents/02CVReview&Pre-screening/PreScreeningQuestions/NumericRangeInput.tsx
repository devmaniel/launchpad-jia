"use client";

import React from "react";

export type NumericRangeInputProps = {
  minLabel?: string;
  maxLabel?: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
};

const NumericRangeInput: React.FC<NumericRangeInputProps> = ({
  minLabel = "Minimum",
  maxLabel = "Maximum",
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  hasError,
  disabled = false,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <span style={{ display: "block" }}>{minLabel}</span>
          <input
            type="number"
            className={`form-control${hasError && !disabled ? " error-input" : ""}`}
            style={{
              appearance: "textfield" as any,
              MozAppearance: "textfield",
              WebkitAppearance: "none",
              backgroundColor: disabled ? "#FAFAFA" : "inherit",
              border: disabled
                ? "1px solid #E9EAEB"
                : hasError && !disabled
                ? "1px solid #FDA29B"
                : ("inherit" as any),
              color: disabled ? "#717680" : ("inherit" as any),
            } as React.CSSProperties}
            placeholder="0"
            value={minValue}
            min={0}
            onChange={(e) => {
              if (!disabled) {
                const v = e.target.value;
                if (v === "") { onMinChange(""); return; }
                onMinChange(Number(v) < 0 ? "0" : v);
              }
            }}
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
              if (e.key === "-") e.preventDefault();
            }}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ display: "block" }}>{maxLabel}</span>
          <input
            type="number"
            className={`form-control${hasError && !disabled ? " error-input" : ""}`}
            style={{
              appearance: "textfield" as any,
              MozAppearance: "textfield",
              WebkitAppearance: "none",
              backgroundColor: disabled ? "#FAFAFA" : "inherit",
              border: disabled
                ? "1px solid #E9EAEB"
                : hasError && !disabled
                ? "1px solid #FDA29B"
                : ("inherit" as any),
              color: disabled ? "#717680" : ("inherit" as any),
            } as React.CSSProperties}
            placeholder="0"
            value={maxValue}
            min={0}
            onChange={(e) => {
              if (!disabled) {
                const v = e.target.value;
                if (v === "") { onMaxChange(""); return; }
                onMaxChange(Number(v) < 0 ? "0" : v);
              }
            }}
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
              if (e.key === "-") e.preventDefault();
            }}
            disabled={disabled}
          />
        </div>
      </div>
      <style jsx>{`
        .error-input:not(:disabled),
        .error-input:not(:disabled):focus {
          border: 1px solid #FDA29B !important;
          box-shadow: none !important;
        }
        input:disabled::placeholder { color: #717680 !important; }
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] { -moz-appearance: textfield; appearance: textfield; }
        input[type='number']::-moz-number-spin-box,
        input[type='number']::-moz-number-spin-up,
        input[type='number']::-moz-number-spin-down,
        input[type='number']::-moz-number-spin-text {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default NumericRangeInput;
