"use client";

import { CareerInformationProps } from "./types";
import BasicInformationSection from "./BasicInformationSection";
import WorkSettingSection from "./WorkSettingSection";
import LocationSection from "./LocationSection";
import SalarySection from "./SalarySection";

export default function CareerInformation({
  jobTitle,
  setJobTitle,
  onJobTitleBlur,
  employmentType,
  setEmploymentType,
  onEmploymentTypeBlur,
  workSetup,
  setWorkSetup,
  onWorkSetupBlur,
  country,
  setCountry,
  province,
  setProvince,
  city,
  setCity,
  provinceList,
  cityList,
  setCityList,
  onProvinceBlur,
  onCityBlur,
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
}: CareerInformationProps) {
  return (
    <div>
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
            1. Career Information
          </span>
        </div>
        <div className="layered-card-content">
          <BasicInformationSection
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            onJobTitleBlur={onJobTitleBlur}
            errors={errors}
          />

          <WorkSettingSection
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            onEmploymentTypeBlur={onEmploymentTypeBlur}
            workSetup={workSetup}
            setWorkSetup={setWorkSetup}
            onWorkSetupBlur={onWorkSetupBlur}
            errors={errors}
          />

          <LocationSection
            country={country}
            setCountry={setCountry}
            province={province}
            setProvince={setProvince}
            city={city}
            setCity={setCity}
            provinceList={provinceList}
            cityList={cityList}
            setCityList={setCityList}
            onProvinceBlur={onProvinceBlur}
            onCityBlur={onCityBlur}
            errors={errors}
          />

          <SalarySection
            salaryNegotiable={salaryNegotiable}
            setSalaryNegotiable={setSalaryNegotiable}
            minimumSalary={minimumSalary}
            setMinimumSalary={setMinimumSalary}
            maximumSalary={maximumSalary}
            setMaximumSalary={setMaximumSalary}
            minimumSalaryCurrency={minimumSalaryCurrency}
            setMinimumSalaryCurrency={setMinimumSalaryCurrency}
            maximumSalaryCurrency={maximumSalaryCurrency}
            setMaximumSalaryCurrency={setMaximumSalaryCurrency}
            onMinimumSalaryBlur={onMinimumSalaryBlur}
            onMaximumSalaryBlur={onMaximumSalaryBlur}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
}
