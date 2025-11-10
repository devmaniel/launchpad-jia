import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  containerStyle?: React.CSSProperties;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search member",
  containerStyle,
}: SearchBarProps) {
  return (
    <div
      style={{
        padding: "0px !important",
        ...containerStyle,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "14px 0px 0px 0px !important"
        }}
      >
        <img 
          src="/icons/search.svg" 
          alt="search" 
          style={{
            position: "absolute",
            left: "25px",
            width: "16px",
            height: "16px"
          }}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px 10px 34px",
            marginLeft: "14px",
            marginRight: "14px",
            fontWeight: 500,
            border: "1px solid #E5E7EB !important",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid #9400FF"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5E7EB";
          }}
        />
      </div>
      {/* Divider */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #F5F5F5",
          margin: "12px 0 0 0",
        }}
      />
    </div>
  );
}
