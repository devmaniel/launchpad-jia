"use client";
import { useState, useEffect, useRef } from "react";

export default function CustomDropdown(props) {
    const { onSelectSetting, screeningSetting, settingList, placeholder, containerStyle, hasError, onBlur } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wasTouched, setWasTouched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown and trigger blur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (dropdownOpen) {
          setDropdownOpen(false);
          // Trigger blur validation if dropdown was opened but no value selected
          if (wasTouched && !screeningSetting && onBlur) {
            onBlur();
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, wasTouched, screeningSetting, onBlur]);

  const handleDropdownToggle = () => {
    setDropdownOpen((v) => !v);
    if (!dropdownOpen) {
      setWasTouched(true);
    }
  };

  return (
        <div ref={dropdownRef} className="dropdown w-100" style={{ ...containerStyle, position: "relative" }}>
          <button
            disabled={settingList.length === 0}
            className="dropdown-btn"
            style={{ 
              width: "100%", 
              textTransform: "capitalize",
              border: hasError ? "1px solid #FDA29B !important" : undefined,
              borderColor: hasError ? "#FDA29B !important" : undefined,
            } as React.CSSProperties}
            type="button"
            onClick={handleDropdownToggle}
          >
            <span style={{ color: screeningSetting ? "#333" : "#717680" }}>
              <i
                className={
                  settingList.find(
                    (setting) => setting.name === screeningSetting
                  )?.icon
                }
              ></i>{" "}
              {screeningSetting?.replace("_", " ") || placeholder}
            </span>
            <i className="la la-angle-down"></i>
          </button>
          <div
            className="dropdown-menu w-100 mt-1"
            style={{
              display: dropdownOpen ? 'block' : 'none',
              padding: "10px",
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {settingList.map((setting, index) => (
              <div style={{ borderBottom: "1px solid #ddd" }} key={index}>
                <button
                  className="dropdown-item d-flex align-items-center"
                  style={{
                    minWidth: 220,
                    borderRadius: screeningSetting === setting.name ? 0 : 10,
                    overflow: "hidden",
                    paddingBottom: 10,
                    paddingTop: 10,
                    color: "#181D27",
                    fontWeight: screeningSetting === setting.name ? 700 : 500,
                    background: screeningSetting === setting.name ? "#F8F9FC" : "transparent",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    whiteSpace: "wrap",
                    textTransform: "capitalize",
                  }}
                  onClick={() => {
                    onSelectSetting(setting.name);
                    setDropdownOpen(false);
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
                  {setting.icon && <i className={setting.icon}></i>} {setting.name?.replace("_", " ")}
                  </div>
                  {setting.name === screeningSetting && (
                            <i
                                className="la la-check"
                                style={{
                                    fontSize: "20px",
                                    background: "linear-gradient(180deg, #9FCAED 0%, #CEB6DA 33%, #EBACC9 66%, #FCCEC0 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    color: "transparent"
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