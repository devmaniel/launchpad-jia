"use client";

import { BasicInformationProps } from "./types";
import Image from "next/image";

export default function BasicInformationSection({
  jobTitle,
  setJobTitle,
  onJobTitleBlur,
  errors,
}: BasicInformationProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontWeight: 600, fontSize: 16, color: "#181D27" }}>
        Basic Information
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <span style={{ display: "block" }}>Job Title</span>
        <div style={{ position: "relative" }}>
          <input
            value={jobTitle}
            className={`form-control${errors?.jobTitle ? " error-input" : ""}`}
            placeholder="Enter job title"
            onChange={(e) => {
              setJobTitle(e.target.value || "");
            }}
            onBlur={onJobTitleBlur}
            style={{
              paddingRight: errors?.jobTitle ? "40px" : undefined,
            } as React.CSSProperties}
          />
          {errors?.jobTitle && (
            <Image
              src="/icons/alert-circle.svg"
              alt="Error"
              width={20}
              height={20}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </div>
        {errors?.jobTitle && (
          <span style={{ color: "#F04438", fontSize: "14px" }}>
            This is a required field.
          </span>
        )}
        <style jsx>{`
          .error-input,
          .error-input:focus {
            border: 1px solid #FDA29B !important;
            box-shadow: none !important;
          }
        `}</style>
      </div>
    </div>
  );
}
