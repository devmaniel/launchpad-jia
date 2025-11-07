import React from "react";

export interface MemberAvatar {
  name: string;
  email: string;
  avatar?: string;
}

interface MemberListItemProps {
  member: MemberAvatar;
  onClick?: () => void;
  showHoverEffect?: boolean;
  disabled?: boolean;
}

export default function MemberListItem({
  member,
  onClick,
  showHoverEffect = true,
  disabled = false,
}: MemberListItemProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 14px",
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
        textAlign: "left",
      }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Avatar */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%" }} />
        ) : (
          <span style={{ fontSize: "18px", color: "#fff" }}>{member.name[0]}</span>
        )}
      </div>
      {/* Member Info */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "8px",
        flex: 1,
        minWidth: 0,
      }}>
        <span style={{ 
          fontWeight: "600",
          fontSize: "14px",
          color: disabled ? "#E9EAEB" : "#111827",
          flexShrink: 0,
        }}>
          {member.name}
        </span>
        <span style={{ 
          color: disabled ? "#E9EAEB" : "#6B7280",
          fontSize: "14px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
          minWidth: 0,
        }}>
          {member.email}
        </span>
      </div>
    </div>
  );
}

