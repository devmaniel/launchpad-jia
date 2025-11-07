import { useState } from 'react';
import RoleDropdown from "./RoleDropdown";

interface TeamMember {
  name: string;
  email: string;
  role: string;
  isOwner: boolean;
  avatar?: string;
}

interface TeamMembersListProps {
  teamMembers: TeamMember[];
  setTeamMembers: (value: TeamMember[]) => void;
}

export default function TeamMembersList({
  teamMembers,
  setTeamMembers,
}: TeamMembersListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  
  // Check if there's a job owner
  const hasJobOwner = teamMembers.some(member => member.role === "Job Owner");

  const handleDropdownToggle = (index: number, isOpen: boolean) => {
    if (isOpen) {
      setOpenDropdownIndex(index);
    } else if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    }
  };

  return (
    <>
      

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid #E9EAEB', margin: '0px 0px 0px' }} />

      {/* Alert for missing job owner */}
      {!hasJobOwner && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0px 0px",
          }}
        >
          <img
            src="/icons/alert-triangle.svg"
            alt="Alert"
            style={{ width: 20, height: 17, flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 14,
              color: "#F04438",
              fontWeight: 400,
            }}
          >
            Career must have a job owner. Please assign a job owner.
          </span>
        </div>
      )}

      {/* Team Members List */}
      {teamMembers.map((member, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 0px 0px 0px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 600,
                color: "#6B7280",
                overflow: "hidden",
              }}
            >
              {member.avatar && typeof member.avatar === 'string' && member.avatar.startsWith('http') ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : member.avatar && typeof member.avatar === 'string' && member.avatar.length <= 3 ? (
                member.avatar
              ) : (
                <i className="la la-user"></i>
              )}
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#181D27",
                  marginBottom: 2,
                }}
              >
                {member.name} {member.isOwner && <span style={{ color: "#717680" }}>(You)</span>}
              </div>
              <div style={{ fontSize: 14, color: "#717680" }}>
                {member.email}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <RoleDropdown
                onSelectRole={(role) => {
                  // Handle role change
                  const updatedMembers = [...teamMembers];
                  updatedMembers[index] = { ...member, role };
                  setTeamMembers(updatedMembers);
                }}
                selectedRole={member.role}
                roleList={[
                  { 
                    name: "Job Owner",
                    description: "Leads the hiring process for assigned jobs. Has access with all career settings."
                  },
                  { 
                    name: "Contributor",
                    description: "Helps evaluate candidates and assist with hiring tasks. Can move candidates through the pipeline, but cannot change any career settings."
                  },
                  { 
                    name: "Reviewer",
                    description: "Reviews candidates and provides feedback. Can only view candidate profiles and comment."
                  },
                ]}
                placeholder="Select role"
                isOpen={openDropdownIndex === index}
                onToggle={(isOpen) => handleDropdownToggle(index, isOpen)}
              />
            </div>
            <button
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                const updatedMembers = teamMembers.filter((_, i) => i !== index);
                setTeamMembers(updatedMembers);
              }}
              style={{
                background: 'transparent',
                cursor: "pointer",
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D5D7DA",
              }}
            >
              <img
                src={hoveredIndex === index ? "/icons/trash-2-active.svg" : "/icons/trash-2.svg"}
                alt="Delete"
                style={{ width: 20, height: 20 }}
              />
            </button>
          </div>
        </div>
      ))}

      <span
        style={{
          fontSize: 12,
          color: "#6B7280",
          display: "block",
          fontStyle: "italic",
        }}
      >
        *Admins can view all careers regardless of specific access settings.
      </span>
    </>
  );
}
