"use client";

import { useState } from 'react';
import AddMember from "./AddMember";
import TeamMembersList from "./TeamMembersList";
import { useAppContext } from "@/lib/context/AppContext";

interface TeamMember {
  name: string;
  email: string;
  role: string;
  isOwner: boolean;
  avatar?: string;
}

interface TeamAccessProps {
  teamMembers: TeamMember[];
  setTeamMembers: (value: TeamMember[]) => void;
  onOpen?: () => void;
}

export default function TeamAccess({
  teamMembers,
  setTeamMembers,
  onOpen,
}: TeamAccessProps) {
  const { user } = useAppContext();
  const meOption = user?.email
    ? [{ name: "Me", email: user.email, avatar: user.image }]
    : [];
  const defaultList = [
    { name: "Darlene Santo Tomas", email: "darlene@whitecloak.com", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { name: "Demi Wilkinson", email: "demi@whitecloak.com", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Drew Cano", email: "drew@whitecloak.com", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "Candice Wu", email: "candice@whitecloak.com", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
    { name: "Lana Steiner", email: "lana@whitecloak.com", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
    { name: "Natali Craig", email: "natali@whitecloak.com", avatar: "https://randomuser.me/api/portraits/women/6.jpg" },
  ];
  const combinedList = [...meOption, ...defaultList].filter((m, idx, arr) => arr.findIndex(x => x.email === m.email) === idx);
  return (
    <div className="">
      <div className="layered-card-middle">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "#181D27",
              fontWeight: 700,
              padding: "8px 0px 0px 12px",
            }}
          >
            3. Team Access
          </span>
        </div>
        <div className="layered-card-content" style={{gap: '16px !important'}}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#181D27",
                  display: "block",
                }}
              >
                Add more members
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  display: "block",
                }}
              >
                You can add other members to collaborate on this career.
              </span>
            </div>
            <div >
              <AddMember
                onSelectMember={(member) => {
                  const isMe = !!user?.email && member.email === user.email;
                  const newMember = {
                    name: isMe && user?.name ? user.name : member.name,
                    email: member.email,
                    role: isMe ? "Job Owner" : "Reviewer",
                    isOwner: !!isMe,
                    avatar: isMe ? user?.image : member.avatar,
                  };
                  const exists = teamMembers.some((m) => m.email === newMember.email);
                  if (!exists) {
                    setTeamMembers([...teamMembers, newMember]);
                  }
                }}
                memberList={combinedList}
                disabledEmails={teamMembers.map((m) => m.email)}
                placeholder="Add member"
                containerStyle={{ marginTop: 0 }}
                onOpen={onOpen}
              />
            </div>
          </div>

          <TeamMembersList 
            teamMembers={teamMembers} 
            setTeamMembers={setTeamMembers} 
          />
        </div>
      </div>
    </div>
  );
}
