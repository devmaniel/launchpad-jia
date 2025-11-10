"use client";
import { useState, useEffect, useRef } from "react";

interface RoleSetting {
  name: string;
  description: string;
}

interface RoleDropdownProps {
  onSelectRole: (value: string) => void;
  selectedRole: string;
  roleList: RoleSetting[];
  placeholder: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function RoleDropdown({
  onSelectRole,
  selectedRole,
  roleList,
  placeholder,
  isOpen,
  onToggle,
}: RoleDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const internalOpen = isOpen !== undefined ? isOpen : dropdownOpen;
  const internalToggle = onToggle !== undefined ? onToggle : setDropdownOpen;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
        disabled={roleList.length === 0}
        className="dropdown-btn"
        style={{
            height: "48px !important",
          width: "240px",
          border: '1px solid #D5D7DA !important',
          textTransform: "capitalize",
        }}
        type="button"
        onClick={() => internalToggle(!internalOpen)}
      >
        <span style={{ color: selectedRole ? "#333" : "#717680" }}>
          {selectedRole?.replace("_", " ") || placeholder}
        </span>
        <i className="la la-angle-down"></i>
      </button>
      <div
        className="dropdown-menu"
        style={{
          display: internalOpen ? 'block' : 'none',
          padding: "8px",
          bottom: "100%",
          top: "auto",
          marginBottom: "8px",
          marginTop: "0",
          width: "300px",
          position: "absolute",
          border: "1px solid #F5F5F5",
          borderTop: "none",
          borderRadius: "8px",
        }}
      >
        {roleList.map((role, index) => (
          <div key={index}>
            <button
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                padding: "14px 10px",
                marginBottom: index < roleList.length - 1 ? "12px" : "0",
                color: "#181D27",
                fontWeight: 600,
                background:
                  selectedRole === role.name ? "#EEF4FF !important" : "transparent",
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
                onSelectRole(role.name);
                internalToggle(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EEF4FF";
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== role.name) {
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
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#181D27",
                    }}
                  >
                    {role.name?.replace("_", " ")}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#6B7280",
                    lineHeight: "1.5",
                    marginTop: "4px",
                  }}
                >
                  {role.description}
                </div>
              </div>
              {role.name === selectedRole && (
                <i
                  className="la la-check"
                  style={{
                    fontSize: "20px",
                    marginLeft: "12px",
                    background:
                      "linear-gradient(180deg, #9FCAED 0%, #CEB6DA 33%, #EBACC9 66%, #FCCEC0 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    flexShrink: 0,
                  }}
                ></i>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
