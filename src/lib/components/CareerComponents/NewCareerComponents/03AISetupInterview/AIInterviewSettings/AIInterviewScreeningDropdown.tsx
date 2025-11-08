"use client";
import { useEffect, useRef, useState } from "react";

interface CriteriaOption {
  name: string;
  description?: string;
}

interface AIInterviewScreeningDropdownProps {
  onSelectSetting: (value: string) => void;
  screeningSetting: string;
  placeholder?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function AIInterviewScreeningDropdown({
  onSelectSetting,
  screeningSetting,
  placeholder = "Select criteria",
  isOpen,
  onToggle,
}: AIInterviewScreeningDropdownProps) {
  const options: CriteriaOption[] = [
    { name: "Good Fit and above" },
    { name: "Only Strong Fit" },
    { name: "No Automatic Promotion" },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const internalOpen = isOpen !== undefined ? isOpen : dropdownOpen;
  const internalToggle = onToggle !== undefined ? onToggle : setDropdownOpen;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen === undefined) {
          setDropdownOpen(false);
        } else if (onToggle && internalOpen) {
          internalToggle(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [internalOpen, onToggle, isOpen]);

  return (
    <div ref={dropdownRef} className="dropdown" style={{ height: "48px" }}>
      <button
        className="dropdown-btn fade-in-bottom"
        style={{
          height: "48px !important",
          width: "300px",
          border: "1px solid #D5D7DA !important",
          textTransform: "capitalize",
        }}
        type="button"
        onClick={() => internalToggle(!internalOpen)}
      >
        <span style={{ color: screeningSetting ? "#333" : "#717680", display: "flex", alignItems: "center", gap: 8, fontWeight: screeningSetting ? 400 : 600 }}>
          {screeningSetting ? (
            <img src="/icons/check-default-black.svg" alt="selected" style={{ width: 18, height: 18 }} />
          ) : null}
          {screeningSetting || placeholder}
        </span>
        <i className="la la-angle-down"></i>
      </button>
      <div
        className={`dropdown-menu org-dropdown-anim${internalOpen ? " show" : ""}`}
        style={{
          padding: "8px",
          top: "100%",
          bottom: "auto",
          marginTop: "8px",
          marginBottom: "0",
          width: "360px",
          position: "absolute",
          border: "1px solid #F5F5F5",
          borderTop: "none",
          borderRadius: "8px",
        }}
      >
        {options.map((opt, index) => (
          <div key={index}>
            <button
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                padding: "14px 10px",
                marginBottom: index < options.length - 1 ? "12px" : "0",
                color: "#181D27",
                fontWeight: 600,
                background:
                  screeningSetting === opt.name ? "#EEF4FF !important" : "transparent",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                whiteSpace: "normal",
                textAlign: "left",
                border: "none",
                transition: "background 0.2s ease",
                width: "100%",
                cursor: "pointer",
              }}
              onClick={() => {
                onSelectSetting(opt.name);
                internalToggle(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EEF4FF";
              }}
              onMouseLeave={(e) => {
                if (screeningSetting !== opt.name) {
                  e.currentTarget.style.background = "transparent";
                } else {
                  e.currentTarget.style.background = "#EEF4FF";
                }
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: opt.description ? "4px" : 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#181D27",
                    }}
                  >
                    {opt.name}
                  </span>
                </div>
                {opt.description && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#6B7280",
                      lineHeight: "1.5",
                      marginTop: "4px",
                    }}
                  >
                    {opt.description}
                  </div>
                )}
              </div>
              {opt.name === screeningSetting && (
                <img
                  src="/icons/check-default-black.svg"
                  alt="selected"
                  style={{ width: 20, height: 20, marginLeft: "12px", flexShrink: 0 }}
                />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
