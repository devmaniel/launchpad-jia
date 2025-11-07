"use client";
import { useState } from "react";
import MemberListItem from "./MemberListItem";
import SearchBar from "./SearchBar";

export interface Member {
  name: string;
  email: string;
  avatar?: string;
}

interface AddMemberProps {
  onSelectMember: (member: Member) => void;
  memberList: Member[];
  placeholder?: string;
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  onOpen?: () => void;
  disabledEmails?: string[];
}

export default function AddMember({
  onSelectMember,
  memberList,
  placeholder = "Add member",
  containerStyle,
  style,
  onOpen,
  disabledEmails = [],
}: AddMemberProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = memberList.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #E9EAEB transparent;
          border-radius: 10px !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 20px;
          border-radius: 10px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E9EAEB;
          border-radius: 10px;
        }
      `}} />
      <div className="dropdown" style={{ ...containerStyle, padding: "0px !important", position: "relative" }}>
      <button
        disabled={memberList.length === 0}
        className="dropdown-btn fade-in-bottom"
        style={{
          height: "48px",
          width: "240px",
          border: "1px solid #D5D7DA",
          textTransform: "capitalize",
          ...style,
        }}
        type="button"
        onClick={() => {
          onOpen?.();
          setDropdownOpen((v) => !v);
        }}
      >
        <span style={{ color: "#717680", display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/user_new.svg" alt="add user" style={{ width: "18px", height: "18px" }} />
          {placeholder}
        </span>
        <i className="la la-angle-down"></i>
      </button>
      <div
        className={`dropdown-menu org-dropdown-anim${
          dropdownOpen ? " show" : ""
        }`}
        style={{
          padding: "0px !important",
          bottom: "100%",
          top: "auto",
          marginBottom: "8px",
          marginTop: "0",
          marginLeft: "-120px",
          width: "360px",
          position: "absolute",
          maxHeight: "320px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #D5D7DA",
          borderTop: "none",
        }}
      >
        {/* Search Input */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search member"
        />

        {/* Members List */}
        <div
          style={{
            overflowY: "auto",
            maxHeight: "240px",
            padding: "0 4px",
          }}
          className="custom-scrollbar"
        >
          {filteredMembers.length === 0 ? (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#9CA3AF",
                fontSize: "14px",
              }}
            >
              No members found
            </div>
          ) : (
            filteredMembers.map((member, index) => {
              const isDisabled = disabledEmails.includes(member.email);
              return (
                <MemberListItem
                  key={index}
                  member={member}
                  disabled={isDisabled}
                  onClick={isDisabled ? undefined : () => {
                    onSelectMember(member);
                    setDropdownOpen(false);
                    setSearchQuery("");
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
    </>
  );
}