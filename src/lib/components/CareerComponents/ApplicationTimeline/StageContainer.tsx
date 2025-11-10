interface StageContainerProps {
  title: string;
  totalCount: number;
  droppedCount: number;
  onDroppedCandidatesClick: () => void;
  children: React.ReactNode;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export default function StageContainer({
  title,
  totalCount,
  droppedCount,
  onDroppedCandidatesClick,
  children,
  onDragOver,
  onDragLeave,
  onDrop
}: StageContainerProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1E1F3B", whiteSpace: "nowrap" }}>
            {title}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#F8F9FC",
              border: "1px solid #D5D9EB",
            }}
          >
            <span style={{ fontSize: 12, color: "#363F72", fontWeight: 700 }}>
              {totalCount}
            </span>
          </div>
        </div>
        <button
          onClick={onDroppedCandidatesClick}
          style={{
            background: "transparent",
            border: "1px solid #D5D7DA",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: "#414651",
            padding: "6px 12px",
            borderRadius: 999,
          }}
        >
          <img 
            src="/temp/user-x.svg" 
            alt="Dropped Candidates" 
            style={{ width: 20, height: 20 }}
          />
          <span>{droppedCount} Dropped Candidates</span>
        </button>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
