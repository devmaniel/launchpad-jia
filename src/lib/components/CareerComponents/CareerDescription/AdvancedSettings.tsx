import React from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

interface AdvancedSettingsProps {
  careerId: string;
  onEditClick?: () => void;
}

export default function AdvancedSettings({ careerId, onEditClick }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  async function deleteCareer() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting career...",
          text: "Please wait while we delete the career...",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          const response = await axios.post("/api/delete-career", {
            id: careerId,
          });

          if (response.data.success) {
            Swal.fire({
              title: "Deleted!",
              text: "The career has been deleted.",
              icon: "success",
              allowOutsideClick: false,
            }).then(() => {
              window.location.href = "/recruiter-dashboard/careers";
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.data.error || "Failed to delete the career",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting career:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the career",
            icon: "error",
          });
        }
      }
    });
  }

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
          aria-controls="advanced-settings-content"
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
            Advanced Settings
          </p>
        </div>
        {onEditClick && (
          <button
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
        <div id="advanced-settings-content" style={{ marginTop: 16 }}>
          <div
            style={{
              border: "1px solid #EAECF5",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button 
              onClick={() => {
                deleteCareer();
              }}
              style={{ 
                display: "flex", 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 8,
                backgroundColor: "#FEF3F2", 
                color: "#B32318", 
                borderRadius: 60, 
                padding: "8px 16px", 
                border: "1px solid #FEF3F2", 
                cursor: "pointer", 
                fontWeight: 700, 
                fontSize: 14,
                width: "100%"
              }}
            >
              <img src="/temp/delete-trash.svg" alt="Delete" style={{ width: 20, height: 20 }} />
              <span>Delete this career</span>
            </button>
            <p style={{ margin: 0, fontSize: 14, color: "#717680", textAlign: "center", fontWeight: 400 }}>
              Be careful, this action cannot be undone.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
