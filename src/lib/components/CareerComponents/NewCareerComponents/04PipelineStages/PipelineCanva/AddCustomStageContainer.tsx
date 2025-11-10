import React, { useState, useEffect } from "react";
import Image from "next/image";

interface AddCustomStageContainerProps {
  stageId: number;
  onDelete: (stageId: number) => void;
  onDragStart?: (stageId: number) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent, stageId: number) => void;
  onDrop?: (stageId: number) => void;
  isDragging?: boolean;
  initialIcon?: string;
  initialTitle?: string;
  initialSubstages?: string[];
  onStageUpdate?: (stageId: number, data: { icon: string; title: string; substages: string[] }) => void;
}

type IconType = "personality-test" | "coding-test";

const AddCustomStageContainer: React.FC<AddCustomStageContainerProps> = ({ 
  stageId, 
  onDelete, 
  onDragStart,
  onDragEnd, 
  onDragOver, 
  onDrop,
  isDragging,
  initialIcon = '/temp/personality-test.svg',
  initialTitle = '',
  initialSubstages = [],
  onStageUpdate
}) => {
  const [selectedIcon, setSelectedIcon] = useState<IconType>(
    initialIcon.includes('coding-test') ? 'coding-test' : 'personality-test'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stageName, setStageName] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [substages, setSubstages] = useState<{ id: number; name: string; isEditing: boolean }[]>(
    initialSubstages.map((name, idx) => ({ id: idx + 1, name, isEditing: false }))
  );
  const [nextSubstageId, setNextSubstageId] = useState(initialSubstages.length + 1);
  const [contextMenuSubstageId, setContextMenuSubstageId] = useState<number | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const iconOptions: { value: IconType; icon: string }[] = [
    { value: "personality-test", icon: "/temp/personality-test.svg" },
    { value: "coding-test", icon: "/temp/coding-test.svg" },
  ];

  // Helper to sync stage data to parent
  const syncStageData = (updatedSubstages?: { id: number; name: string; isEditing: boolean }[]) => {
    if (onStageUpdate) {
      const icon = iconOptions.find(opt => opt.value === selectedIcon)?.icon || '/temp/personality-test.svg';
      const currentSubstages = updatedSubstages || substages;
      const substageNames = currentSubstages.map(s => s.name).filter(name => name.trim() !== '');
      onStageUpdate(stageId, {
        icon,
        title: stageName,
        substages: substageNames
      });
    }
  };

  // Sync when icon or title changes
  useEffect(() => {
    syncStageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIcon, stageName]);

  const handleAddSubstage = () => {
    const newSubstages = [...substages, { id: nextSubstageId, name: "", isEditing: false }];
    setSubstages(newSubstages);
    setNextSubstageId(nextSubstageId + 1);
    syncStageData(newSubstages);
  };

  const handleDeleteSubstage = (substageId: number) => {
    const newSubstages = substages.filter(s => s.id !== substageId);
    setSubstages(newSubstages);
    syncStageData(newSubstages);
  };

  const handleSubstageNameChange = (substageId: number, newName: string) => {
    const newSubstages = substages.map(s => 
      s.id === substageId ? { ...s, name: newName } : s
    );
    setSubstages(newSubstages);
    syncStageData(newSubstages);
  };

  const handleSubstageEditToggle = (substageId: number, isEditing: boolean) => {
    setSubstages(substages.map(s => 
      s.id === substageId ? { ...s, isEditing } : s
    ));
  };

  const handleSubstageContextMenu = (e: React.MouseEvent, substageId: number) => {
    e.preventDefault();
    setContextMenuSubstageId(substageId);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenuSubstageId(null);
    setContextMenuPosition(null);
  };

  const handleEditSubstage = (substageId: number) => {
    handleSubstageEditToggle(substageId, true);
    handleCloseContextMenu();
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenuPosition) {
        handleCloseContextMenu();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenuPosition]);
  return (
    <div
      draggable
      onDragStart={() => onDragStart?.(stageId)}
      onDragEnd={() => onDragEnd?.()}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e, stageId);
      }}
      onDrop={() => onDrop?.(stageId)}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        borderRadius: 16,
        position: "relative",
        background: isDragging ? "#F9FAFB" : "transparent",
        boxShadow: isDragging ? "0 4px 16px rgba(16, 24, 40, 0.12)" : undefined,
        opacity: isDragging ? 0.9 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px dashed #D5D7DA",
          borderRadius: 16,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          padding: 16,
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Image
          src="/temp/drag_indicator.svg"
          alt="drag"
          width={20}
          height={20}
          style={{ filter: "invert(0.3)" }}
        />
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#535862",
            marginBottom: 0,
          }}
        >
          Drag to reorder Stage
        </p>
      </div>

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backgroundColor: "#F8F9FC",
          padding: 16,
          borderRadius: 16,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={iconOptions.find(opt => opt.value === selectedIcon)?.icon || "/temp/personality-test.svg"}
                  alt="custom-stage"
                  width={16}
                  height={16}
                />
              </button>
              
              {isDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: 4,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #D5D7DA",
                    borderRadius: 8,
                    padding: 8,
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minWidth: 40,
                  }}
                >
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedIcon(option.value);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        background: selectedIcon === option.value ? "#F0F0F0" : "transparent",
                        border: "none",
                        padding: "4px 8px",
                        cursor: "pointer",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src={option.icon}
                        alt={option.value}
                        width={16}
                        height={16}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <p
                onClick={() => setIsEditing(true)}
                style={{
                  color: "#1E1F3B",
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 0,
                  cursor: "pointer",
                  opacity: isEditing ? 0 : 1,
                }}
              >
                {stageName || "Custom Stage Example"}
              </p>
              {isEditing && (
                <input
                  type="text"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  onBlur={() => {
                    if (!stageName.trim()) {
                      setStageName("");
                    }
                    setIsEditing(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!stageName.trim()) {
                        setStageName("");
                      }
                      setIsEditing(false);
                    }
                  }}
                  autoFocus
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    border: "none",
                    backgroundColor: "transparent",
                    color: "#1E1F3B",
                    fontSize: 14,
                    fontWeight: 500,
                    outline: "none",
                    padding: 0,
                    margin: 0,
                    fontFamily: "inherit",
                    minWidth: "100px",
                    lineHeight: "1.4",
                    height: "auto",
                    zIndex: 10,
                  }}
                />
              )}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/temp/more-vertical.svg"
                alt="more-options"
                width={16}
                height={16}
              />
            </button>
            
            {isMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 4,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D5D7DA",
                  borderRadius: 8,
                  padding: 8,
                  zIndex: 1000,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minWidth: 40,
                }}
              >
                <button
                  onClick={() => {
                    onDelete(stageId);
                    setIsMenuOpen(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FEE2E2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Image
                    src="/temp/delete-svgrepo-com.svg"
                    alt="delete"
                    width={16}
                    height={16}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#DC2626",
                    }}
                  >
                    Delete
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Substages Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#717680",
              marginBottom: 0,
            }}
          >
            Substages
          </p>

          {/* Existing Substages */}
          {substages.map((substage) => (
            <div
              key={substage.id}
              onContextMenu={(e) => handleSubstageContextMenu(e, substage.id)}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                border: "1px solid #D5D7DA",
                padding: "16px 10px",
                borderRadius: 16,
                cursor: "default",
              }}
            >
              <div style={{ position: "relative", flex: 1 }}>
                {!substage.isEditing ? (
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#414651",
                      marginBottom: 0,
                    }}
                  >
                    {substage.name || "Custom Substages"}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={substage.name}
                    onChange={(e) => handleSubstageNameChange(substage.id, e.target.value)}
                    onBlur={() => {
                      if (!substage.name.trim()) {
                        handleSubstageNameChange(substage.id, "");
                      }
                      handleSubstageEditToggle(substage.id, false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (!substage.name.trim()) {
                          handleSubstageNameChange(substage.id, "");
                        }
                        handleSubstageEditToggle(substage.id, false);
                      }
                    }}
                    autoFocus
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#414651",
                      fontSize: 14,
                      fontWeight: 400,
                      outline: "none",
                      padding: 0,
                      margin: 0,
                      fontFamily: "inherit",
                      width: "100%",
                      lineHeight: "1.4",
                      height: "auto",
                    }}
                  />
                )}
              </div>
              <Image
                src="/temp/zap-circle-btn.svg"
                alt="zap-circle-btn"
                width={35}
                height={35}
              />
            </div>
          ))}

          {/* Add Substages Button */}
          <button
            onClick={handleAddSubstage}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              border: "1px dashed #D5D7DA",
              padding: "16px 10px",
              borderRadius: 16,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F9FAFB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Image
              src="/temp/temporary-add-icon.svg"
              alt="add"
              width={16}
              height={16}
            />
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#717680",
                marginBottom: 0,
              }}
            >
              Add Substages
            </p>
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenuPosition && contextMenuSubstageId !== null && (
        <div
          style={{
            position: "fixed",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            backgroundColor: "#FFFFFF",
            border: "1px solid #D5D7DA",
            borderRadius: 8,
            padding: 8,
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 120,
            boxShadow: "0 4px 16px rgba(16, 24, 40, 0.12)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleEditSubstage(contextMenuSubstageId)}
            style={{
              background: "none",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              textAlign: "left",
              fontSize: 14,
              fontWeight: 500,
              color: "#414651",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F9FAFB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              handleDeleteSubstage(contextMenuSubstageId);
              handleCloseContextMenu();
            }}
            style={{
              background: "none",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              textAlign: "left",
              fontSize: 14,
              fontWeight: 500,
              color: "#DC2626",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FEE2E2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default AddCustomStageContainer;