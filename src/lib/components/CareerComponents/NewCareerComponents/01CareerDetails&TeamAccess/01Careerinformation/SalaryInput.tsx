"use client";

import React, { useState } from "react";
import { SalaryInputProps } from "./types";
import { currencyOptions } from "./constants";
import Image from "next/image";

export default function SalaryInput({
  label,
  value,
  onChange,
  currency,
  onCurrencyChange,
  hasError,
  onBlur,
  disabled = false,
}: SalaryInputProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get the selected currency label
  const selectedCurrencyLabel = currencyOptions.find(option => option.value === currency)?.label || "PHP";

  return (
    <div>
      <span style={{ display: "block" }}>{label}</span>
      <div
        style={{
          display: "flex",
          gap: "0px",
          marginTop: 6,
          position: "relative",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#717680",
              fontSize: "16px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            ₱
          </span>
          <input
            type="number"
            className={`form-control salary-input${hasError && !disabled ? " error-input" : ""}`}
            style={
              {
                paddingLeft: "28px",
                paddingRight: hasError && !disabled ? "120px" : "100px",
                appearance: "textfield",
                MozAppearance: "textfield",
                WebkitAppearance: "none",
                backgroundColor: disabled ? "#FAFAFA" : "inherit",
                border: disabled ? "1px solid #E9EAEB" : (hasError && !disabled ? "1px solid #FDA29B" : "inherit"),
                color: disabled ? "#717680" : "inherit",
              } as React.CSSProperties
            }
            placeholder="0"
            min={0}
            value={value}
            onChange={(e) => {
              if (!disabled) {
                onChange(e.target.value || "");
              }
            }}
            onBlur={onBlur}
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            disabled={disabled}
          />
          {hasError && !disabled && (
            <Image
              src="/icons/alert-circle.svg"
              alt="Error"
              width={20}
              height={20}
              style={{
                position: "absolute",
                right: "90px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            />
          )}
          <div 
            style={{
              position: "absolute",
              right: "1px",
              top: "1px",
              bottom: "1px",
              width: "80px",
              height: "calc(100% - 2px)",
            }}
          >
            {/* Custom Dropdown Button */}
            <button
              type="button"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 8px",
                fontSize: "14px",
                color: "#333",
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
              }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedCurrencyLabel}</span>
              <i className="la la-angle-down" style={{ fontSize: "16px" }}></i>
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "0 0 7px 7px",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {currencyOptions.map((option) => (
                  <div
                    key={option.value}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "none",
                      backgroundColor: currency === option.value ? "#F8F9FC" : "transparent",
                      fontWeight: currency === option.value ? "600" : "normal",
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
        
        input:disabled::placeholder {
          color: #717680 !important;
        }
      `}</style>
    </div>
  );
}
