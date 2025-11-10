import React from "react";
import Image from "next/image";
import { sanitizeHtml, sanitizeText } from "@/lib/utils/sanitize";

const CareerDetails = ({
  jobTitle,
  employmentType,
  workSetup,
  country,
  state,
  city,
  minimumSalary,
  maximumSalary,
  minimumSalaryCurrency,
  maximumSalaryCurrency,
  salaryNegotiable,
  descriptionHtml,
  onEditClick,
}: {
  jobTitle: string;
  employmentType: string;
  workSetup: string;
  country: string;
  state: string;
  city: string;
  minimumSalary: string;
  maximumSalary: string;
  minimumSalaryCurrency: string;
  maximumSalaryCurrency: string;
  salaryNegotiable: boolean;
  descriptionHtml: string;
  onEditClick?: () => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const fmtMoney = (val: string) => {
    const n = Number(val);
    if (!n || isNaN(n)) return null;
    return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 12,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 6 }}>{label}</span>
      <span style={{ fontSize: 16, color: "#414651" }}>{value || "-"}</span>
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
          aria-controls="career-details-content"
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
            Career Details & Team Access
          </p>
        </div>
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
      </div>

      {isOpen && (
        <div id="career-details-content" style={{ marginTop: 16 }}>
          <div
            style={{
              border: "1px solid #EAECF5",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #EAECF5" }}>
                <div style={{ gridColumn: "1 / span 3" }}>
                  <InfoRow label="Job Title" value={sanitizeText(jobTitle)} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #EAECF5" }}>
                <InfoRow label="Employment Type" value={sanitizeText(employmentType)} />
                <InfoRow label="Work Arrangement" value={sanitizeText(workSetup)} />
                <div />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #EAECF5" }}>
                <InfoRow label="Country" value={sanitizeText(country)} />
                <InfoRow label="State / Province" value={sanitizeText(state)} />
                <InfoRow label="City" value={sanitizeText(city)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
                <InfoRow
                  label="Minimum Salary"
                  value={salaryNegotiable
                    ? "Negotiable"
                    : (() => {
                        const min = fmtMoney(minimumSalary);
                        const cur = minimumSalaryCurrency || maximumSalaryCurrency || "PHP";
                        return min ? `${cur} ${min}` : "-";
                      })()
                  }
                />
                <InfoRow
                  label="Maximum Salary"
                  value={salaryNegotiable
                    ? "Negotiable"
                    : (() => {
                        const max = fmtMoney(maximumSalary);
                        const cur = minimumSalaryCurrency || maximumSalaryCurrency || "PHP";
                        return max ? `${cur} ${max}` : "-";
                      })()
                  }
                />
                <div />
              </div>
            </div>

            <div style={{ height: 1, backgroundColor: "#EAECF5", margin: "16px 0" }} />

            <div>
              <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#181D27" }}>
                Job Description
              </p>
              <div
                style={{ marginTop: 0, marginBottom: 12, fontSize: 16, color: "#414651", fontWeight: 400 }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(descriptionHtml || "") }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerDetails;
