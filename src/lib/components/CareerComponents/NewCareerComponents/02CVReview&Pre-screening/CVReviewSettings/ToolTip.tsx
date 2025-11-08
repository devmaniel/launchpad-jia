import React from "react";

interface ToolTipProps {
  content: React.ReactNode;
  width?: number;
  backgroundColor?: string;
  offset?: number; // distance from the trigger
}

const ToolTip: React.FC<ToolTipProps> = ({
  content,
  width = 500,
  backgroundColor = "#111827",
  offset = 10,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: `calc(100% + ${offset}px)`,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor,
        color: "#fff",
        padding: "8px",
        borderRadius: 8,
        fontSize: 13,
        lineHeight: "20px",
        width: 460,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        zIndex: 1000,
        whiteSpace: "normal",
      }}
    >
      <div style={{ textAlign: "center", fontWeight: 500}}>{content}</div>
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `8px solid ${backgroundColor}`,
        }}
      />
    </div>
  );
};

export default ToolTip;

