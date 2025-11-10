import React from "react";
import Image from "next/image";
import ScreeningSettingButton from "./ScreeningSettingButton";

interface AdditionalDetailsProps {
  formData: any;
  isEditing: boolean;
  setFormData: (formData: any) => void;
  onEditClick?: () => void;
}

export default function AdditionalDetails({ formData, isEditing, setFormData, onEditClick }: AdditionalDetailsProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>{label}</span>
      <span style={{ fontSize: 16, color: "#414651", fontWeight: 400 }}>{value || "-"}</span>
    </div>
  );

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
          aria-controls="additional-details-content"
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
            Additional Details
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
        <div id="additional-details-content" style={{ marginTop: 16 }}>
          <div
            style={{
              border: "1px solid #EAECF5",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#FFFFFF",
            }}
          >
            <InfoRow label="Employment Type" value={formData.employmentType || "Full-time"} />
            <InfoRow label="Work Arrangement" value={formData.workSetup || "-"} />
            <InfoRow label="Work Arrangement Remarks" value={formData.workSetupRemarks || "-"} />
            <InfoRow label="Salary" value={formData.salaryNegotiable ? "Negotiable" : "Fixed"} />
            <InfoRow label="Minimum Salary" value={formData.minimumSalary || "-"} />
            <InfoRow label="Maximum Salary" value={formData.maximumSalary || "-"} />
            
            <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />
            
            <InfoRow label="Country" value="Philippines" />
            <InfoRow label="State/Province" value={formData.province || "-"} />
            <InfoRow label="City" value={formData.location || "-"} />
            
            <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>Screening Setting</span>
              {isEditing ? (
                <ScreeningSettingButton 
                  screeningSetting={formData.screeningSetting} 
                  onSelectSetting={(setting) => setFormData({ ...formData, screeningSetting: setting })} 
                />
              ) : (
                <span style={{ fontSize: 16, color: "#414651", fontWeight: 400, textTransform: "capitalize" }}>{formData.screeningSetting}</span>
              )}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>Require Video</span>
              {isEditing ? (
                <button
                  className={`button-primary ${formData.requireVideo ? "" : "negative"}`}
                  onClick={() => {
                    setFormData({ ...formData, requireVideo: !formData.requireVideo });
                  }}
                >
                  <i
                    className={`la ${
                      formData.requireVideo ? "la-video" : "la-video-slash"
                    }`}
                  ></i>{" "}
                  {formData.requireVideo ? "On" : "Off"}
                </button>
              ) : (
                <span style={{ fontSize: 16, color: "#414651", fontWeight: 400 }}>{formData.requireVideo ? "Yes" : "No"}</span>
              )}
            </div>

            <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>Created By</span>
              {formData.createdBy && (
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Image src={formData.createdBy.image} alt="created by" width={32} height={32} style={{ borderRadius: "50%" }} />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>{formData.createdBy.name}</span>
                    <span style={{ fontSize: 12, color: "#717680" }}>
                      on {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "-"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>Last Updated By</span>
              {formData.lastEditedBy && (
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Image src={formData.lastEditedBy.image} alt="updated by" width={32} height={32} style={{ borderRadius: "50%" }} />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>{formData.lastEditedBy.name}</span>
                    <span style={{ fontSize: 12, color: "#717680" }}>
                      on {formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "-"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
