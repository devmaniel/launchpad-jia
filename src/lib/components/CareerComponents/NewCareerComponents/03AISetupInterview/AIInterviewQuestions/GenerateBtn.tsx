import React from "react";

const GenerateBtn: React.FC<{
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}> = ({ onClick, loading = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "center",
        background: loading || disabled ? "#6B7280" : "#111827",
        color: "#fff",
        border: 0,
        borderRadius: 999,
        padding: "8px 15px",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
        opacity: loading || disabled ? 0.7 : 1,
      }}
    >
      {loading ? (
        <>
          <div style={{ 
            width: 16, 
            height: 16, 
            border: "2px solid #fff", 
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <img src="/icons/auto_awesome_white.svg" alt="icon" style={{ width: 20, height: 20 }} />
          <span>Generate questions</span>
        </>
      )}
    </button>
  );
};

export default GenerateBtn;
