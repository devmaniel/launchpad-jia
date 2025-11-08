"use client";

import React, { useState } from "react";

export type AskingSalaryInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  hasError?: boolean;
  onBlur?: () => void;
  disabled?: boolean;
};

const currencyOptions = [
  { value: "PHP", label: "PHP" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const AskingSalaryInput: React.FC<AskingSalaryInputProps> = ({
  label,
  value,
  onChange,
  currency,
  onCurrencyChange,
  hasError,
  onBlur,
  disabled = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectedCurrencyLabel =
    currencyOptions.find((o) => o.value === currency)?.label || "PHP";

  return (
    <div>
      <span style={{ display: "block" }}>{label}</span>
      <div
        style={{
          display: "flex",
          gap: 0,
          marginTop: 6,
          position: "relative",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#717680",
              fontSize: 16,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            ₱
          </span>
          <input
            type="number"
            className={`form-control salary-input${hasError && !disabled ? " error-input" : ""}`}
            style={{
              paddingLeft: 28,
              paddingRight: hasError && !disabled ? 120 : 100,
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
            min={0}
            value={value}
            onChange={(e) => {
              if (!disabled) onChange(e.target.value || "");
            }}
            onBlur={onBlur}
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
            }}
            disabled={disabled}
          />

          <div
            style={{
              position: "absolute",
              right: 1,
              top: 1,
              bottom: 1,
              width: 80,
              height: "calc(100% - 2px)",
            }}
          >
            <button
              type="button"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 8px",
                fontSize: 14,
                color: "#333",
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
              }}
              onClick={() => setIsDropdownOpen((v) => !v)}
            >
              <span>{selectedCurrencyLabel}</span>
              <i className="la la-angle-down" style={{ fontSize: 16 }}></i>
            </button>

            {isDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "0 0 7px 7px",
                  zIndex: 1000,
                  maxHeight: 200,
                  overflowY: "auto",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {currencyOptions.map((option) => (
                  <div
                    key={option.value}
                    style={{
                      padding: 10,
                      cursor: "pointer",
                      borderBottom: "none",
                      backgroundColor:
                        currency === option.value ? "#F8F9FC" : "transparent",
                      fontWeight: currency === option.value ? 600 : 400,
                    }}
                    onClick={() => {
                      onCurrencyChange(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .error-input:not(:disabled),
        .error-input:not(:disabled):focus {
          border: 1px solid #FDA29B !important;
          box-shadow: none !important;
        }
        input:disabled::placeholder { color: #717680 !important; }
      `}</style>
    </div>
  );
};

export default AskingSalaryInput;
