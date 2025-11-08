"use client";
import React, { useState } from "react";

const PillButton: React.FC<{
  label: string;
  variant?: "primary" | "outline";
  onClick?: () => void;
  iconSrc?: string;
}> = ({ label, variant = "primary", onClick, iconSrc }) => {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "center",
        background: isPrimary ? "#111827" : "#fff",
        color: isPrimary ? "#fff" : "#111827",
        border: isPrimary ? 0 : "1px solid #D5D9EB",
        borderRadius: 999,
        padding: "8px 15px",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {iconSrc ? (
        <img src={iconSrc} alt="icon" style={{ width: 20, height: 20 }} />
      ) : null}
      <span>{label}</span>
    </button>
  );
};

type Question = { id: string; text: string };

const CategoryRow: React.FC<
  {
    title: string;
    groupId: number;
    questions: Question[];
    numToAsk: number | null;
    onReorderQuestion: (groupId: number, draggedId: string, overId: string) => void;
    onMoveQuestion: (draggedId: string, fromGroupId: number, toGroupId: number, insertIndex?: number) => void;
    onDeleteQuestion: (groupId: number, questionId: string) => void;
    onEditQuestion?: (groupId: number, questionId: string) => void;
    onChangeNumToAsk: (groupId: number, value: number | null) => void;
    onGenerate?: (groupId: number) => void;
    onAddManually?: (groupId: number) => void;
    onUpdateQuestionText?: (groupId: number, questionId: string, text: string) => void;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({
  title,
  groupId,
  questions,
  numToAsk,
  onReorderQuestion,
  onMoveQuestion,
  onDeleteQuestion,
  onEditQuestion,
  onChangeNumToAsk,
  onGenerate,
  onAddManually,
  onUpdateQuestionText,
  ...rest
}) => {
  const onDragStart = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("questionId", id);
    e.dataTransfer.setData("fromGroupId", String(groupId));
  };

  const Card: React.FC<{ q: Question; idx: number }> = ({ q, idx }) => {
    const [dragging, setDragging] = useState(false);
    const [editing, setEditing] = useState<boolean>((q.text ?? "").trim() === "");
    const [draft, setDraft] = useState<string>(q.text ?? "");
    return (
      <div
        draggable={!editing}
        onDragStart={(e) => {
          if (editing) return;
          onDragStart(q.id)(e);
          setDragging(true);
          try {
            const node = e.currentTarget as HTMLElement;
            e.dataTransfer.setDragImage(node, 24, 16);
          } catch {}
        }}
        onDragEnd={() => setDragging(false)}
        onDragOver={(e) => {
          // only prevent default to allow drop; do not reorder here to avoid jitter
          e.preventDefault();
          const target = e.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();
          const mid = rect.top + rect.height / 2;
          if (e.clientY > mid) {
            target.style.borderBottom = "2px solid";
            target.style.borderImage = "linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%) 1";
            target.style.borderTop = "1px solid #EAECF5";
          } else {
            target.style.borderTop = "2px solid";
            target.style.borderImage = "linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%) 1";
            target.style.borderBottom = "1px solid #EAECF5";
          }
        }}
        onDragLeave={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.borderTop = "1px solid #EAECF5";
          target.style.borderBottom = "1px solid #EAECF5";
          target.style.borderImage = "unset";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const target = e.currentTarget as HTMLElement;
          target.style.borderTop = "1px solid #EAECF5";
          target.style.borderBottom = "1px solid #EAECF5";
          target.style.borderImage = "unset";
          const draggedQuestionId = e.dataTransfer.getData("questionId");
          const fromGroupId = Number(e.dataTransfer.getData("fromGroupId"));
          if (draggedQuestionId && !isNaN(fromGroupId)) {
            const rect = target.getBoundingClientRect();
            const mid = rect.top + rect.height / 2;
            const insertIndex = e.clientY > mid ? idx + 1 : idx;
            onMoveQuestion(draggedQuestionId, fromGroupId, groupId, insertIndex);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid #EAECF5",
          borderRadius: 12,
          padding: 16,
          background: dragging ? "#F9FAFB" : "#fff",
          boxShadow: dragging ? "0 4px 16px rgba(16, 24, 40, 0.12)" : undefined,
          opacity: dragging ? 0.9 : 1,
          cursor: editing ? "auto" : dragging ? "grabbing" : "grab",
        }}
      >
        {!editing && (
          <img src="/icons/drag-indicator.svg" alt="drag" style={{ width: 18, height: 18, opacity: 0.8 }} />
        )}
        <div style={{ flex: 1, color: "#414651", lineHeight: 1.5 }}>
          {editing ? (
            <input
              autoFocus
              placeholder="Type your question..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={(e) => {
                const trimmed = e.target.value.trim();
                if (trimmed === "") {
                  onDeleteQuestion(groupId, q.id);
                } else {
                  onUpdateQuestionText?.(groupId, q.id, trimmed);
                  setEditing(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.currentTarget as HTMLInputElement;
                  const trimmed = input.value.trim();
                  if (trimmed === "") {
                    onDeleteQuestion(groupId, q.id);
                  } else {
                    onUpdateQuestionText?.(groupId, q.id, trimmed);
                    setEditing(false);
                  }
                  input.blur();
                }
              }}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                outline: "none",
                fontSize: 14,
                color: "#111827",
              }}
            />
          ) : (
            q.text
          )}
        </div>
        {!editing && (
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid #D5D7DA",
              background: "#fff",
              borderRadius: 999,
              padding: "6px 18px",
              cursor: "pointer",
              color: "#414651",
              fontWeight: 500,
            }}
            onClick={() => {
              // enter inline edit mode for this card
              setDraft(q.text ?? "");
              setEditing(true);
            }}
          >
            <img src="/icons/edit-2.svg" alt="edit" style={{ width: 21, height: 21 }} />
            <span>Edit</span>
          </button>
        )}
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 999,
            border: "1px solid #FDA29B",
            background: "#fff",
            cursor: "pointer",
          }}
          onClick={() => onDeleteQuestion(groupId, q.id)}
        >
          <img src="/icons/trash-2-warning.svg" alt="delete" style={{ width: 21, height: 21 }} />
        </button>
      </div>
    );
  };

  return (
    <div {...rest}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontWeight: 700, color: "#181D27" }}>{title}</div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const draggedQuestionId = e.dataTransfer.getData("questionId");
            const fromGroupId = Number(e.dataTransfer.getData("fromGroupId"));
            if (draggedQuestionId && !isNaN(fromGroupId)) {
              // append to end if dropped on empty space in the list
              onMoveQuestion(draggedQuestionId, fromGroupId, groupId, questions.length);
            }
          }}
        >
          {questions.map((q, i) => (
            <Card key={q.id} q={q} idx={i} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PillButton iconSrc="/icons/auto_awesome_white.svg" label="Generate questions" onClick={() => onGenerate?.(groupId)} />
            <PillButton variant="outline" label="Manually add" iconSrc="/icons/plus-circle.svg" onClick={() => onAddManually?.(groupId)} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#717680", fontWeight: 400 }}># of questions to ask</span>
            <div
              style={{
                width: 40,
                height: 36,
                borderRadius: 10,
                padding: "0 13px",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
                display: "flex",
                alignItems: "center",
                color: "#111827",
                fontWeight: 400,
                fontSize: 14,
              }}
            >
              {questions.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryRow;
