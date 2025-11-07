"use client";

import { SalaryProps } from "./types";
import SalaryInput from "./SalaryInput";

export default function SalarySection({
  salaryNegotiable,
  setSalaryNegotiable,
  minimumSalary,
  setMinimumSalary,
  maximumSalary,
  setMaximumSalary,
  minimumSalaryCurrency,
  setMinimumSalaryCurrency,
  maximumSalaryCurrency,
  setMaximumSalaryCurrency,
  onMinimumSalaryBlur,
  onMaximumSalaryBlur,
  errors,
}: SalaryProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: "#181D27",
          }}
        >
          Salary
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label className="switch" style={{ marginTop: "7px" }}>
            <input
              type="checkbox"
              checked={salaryNegotiable}
              onChange={() => setSalaryNegotiable(!salaryNegotiable)}
            />
            <span className="slider round"></span>
          </label>
          <span
            style={{
              fontSize: 14,
              color: "#414651",
              height: "44px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Negotiable
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div>
          <SalaryInput
            label="Minimum Salary"
            value={minimumSalary}
            onChange={setMinimumSalary}
            currency={minimumSalaryCurrency}
            onCurrencyChange={setMinimumSalaryCurrency}
            hasError={errors?.minimumSalary}
            onBlur={onMinimumSalaryBlur}
            disabled={salaryNegotiable}
          />
          {errors?.minimumSalary && !salaryNegotiable && (
            <span style={{ color: "#F04438", fontSize: "14px", marginTop: "6px", display: "block" }}>
              This is a required field.
            </span>
          )}
        </div>

        <div>
          <SalaryInput
            label="Maximum Salary"
            value={maximumSalary}
            onChange={setMaximumSalary}
            currency={maximumSalaryCurrency}
            onCurrencyChange={setMaximumSalaryCurrency}
            hasError={errors?.maximumSalary}
            onBlur={onMaximumSalaryBlur}
            disabled={salaryNegotiable}
          />
          {errors?.maximumSalary && !salaryNegotiable && (
            <span style={{ color: "#F04438", fontSize: "14px", marginTop: "6px", display: "block" }}>
              This is a required field.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
