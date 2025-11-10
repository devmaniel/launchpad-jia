import React from "react";
import Image from "next/image";

interface TeamMember {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface TeamAccessProps {
  teamMembers: TeamMember[];
  onEditClick?: () => void;
}

export default function TeamAccess({ teamMembers, onEditClick }: TeamAccessProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const Avatar = ({ src, alt, size = 40 }: { src?: string; alt: string; size?: number }) => {
    const [err, setErr] = React.useState(false);
    if (err || !src) {
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#EAECF5",
          }}
        />
      );
    }
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ borderRadius: size / 2, backgroundColor: "#EAECF5" }}
        onError={() => setErr(true)}
      />
    );
  };

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #EAECF5",
        borderRadius: 16,
        padding: 16,
        backgroundColor: "#F8F9FC",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() => setIsOpen((p) => !p)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen((p) => !p);
            }
          }}
          aria-expanded={isOpen}
          aria-controls="team-access-content"
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        >
          <Image
            src="/icons/chevron.svg"
            alt=""
            width={20}
            height={20}
            style={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)",
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#1F2430",
            }}
          >
            Team Access
          </p>
        </div>
        {onEditClick && (
          <button
            onClick={onEditClick}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <Image
              src="/temp/edit-pen-circle-btn.svg"
              alt="edit"
              width={32}
              height={32}
            />
          </button>
        )}
      </div>

      {isOpen && (
        <div id="team-access-content" style={{ marginTop: 16 }}>
          <div
            style={{
              border: "1px solid #EAECF5",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {teamMembers && teamMembers.length > 0 ? (
              teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar src={member.avatar} alt={member.name} size={40} />
                    <div>
                      <p style={{ margin: 0, fontSize: 14, color: "#414651", fontWeight: 600 }}>
                        {member.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 14, color: "#717680", fontWeight: 400 }}>
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: "#414651", fontWeight: 400 }}>
                    {member.role || "Member"}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: "#717680", textAlign: "center" }}>
                No team members assigned
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
