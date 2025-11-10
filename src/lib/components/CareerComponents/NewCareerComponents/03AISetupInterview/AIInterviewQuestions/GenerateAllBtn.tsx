import React from "react";

const GenerateAllBtn: React.FC<{
  onClick?: () => void;
  loading?: boolean;
  progress?: { current: number; total: number } | null;
}> = ({ onClick, loading = false, progress }) => {
  const getButtonText = () => {
    if (loading) {
      return "Generating...";
    }
    return "Generate all questions";
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "center",
        background: loading ? "#6B7280" : "#111827",
        color: "#fff",
        border: 0,
        borderRadius: 999,
        padding: "8px 15px",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: 600,
        fontSize: 14,
        opacity: loading ? 0.7 : 1,
        transition: "all 0.2s ease",
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
          <span>{getButtonText()}</span>
        </>
      ) : (
        <>
          <img src="/icons/auto_awesome_white.svg" alt="icon" style={{ width: 20, height: 20 }} />
          <span>{getButtonText()}</span>
        </>
      )}
    </button>
  );
};

export default GenerateAllBtn;