"use client";

import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import { WorkSettingProps } from "./types";
import { workSetupOptions, employmentTypeOptions } from "./constants";

export default function WorkSettingSection({
  employmentType,
  setEmploymentType,
  workSetup,
  setWorkSetup,
  errors,
}: WorkSettingProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontWeight: 600,
          fontSize: 16,
          color: "#181D27",
          display: "block",
        }}
      >
        Work Setting
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div>
          <span style={{ display: "block" }}>Employment Type</span>
          <CustomDropdown
            onSelectSetting={(employmentType) => {
              setEmploymentType(employmentType);
            }}
            screeningSetting={employmentType}
            settingList={employmentTypeOptions}
            placeholder="Choose employment type"
            containerStyle={{ marginTop: 6 }}
            hasError={errors?.employmentType}
          />
          {errors?.employmentType && (
            <span style={{ color: "#F04438", fontSize: "14px", marginTop: "6px", display: "block" }}>
              This is a required field.
            </span>
          )}
        </div>

        <div>
          <span style={{ display: "block" }}>Arrangement</span>
          <CustomDropdown
            onSelectSetting={(setting) => {
              setWorkSetup(setting);
            }}
            screeningSetting={workSetup}
            settingList={workSetupOptions}
            placeholder="Choose work arrangement"
            containerStyle={{ marginTop: 6 }}
            hasError={errors?.workSetup}
          />
          {errors?.workSetup && (
            <span style={{ color: "#F04438", fontSize: "14px", marginTop: "6px", display: "block" }}>
              This is a required field.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
