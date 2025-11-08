"use client";

import React from "react";
import CareerInformation from "./01Careerinformation/CareerInformation";
import JobDescription from "./02JobDescription/JobDescription";
import TeamAccess from "./03TeamAccess/TeamAccess";
import TipsContainer from "../TipsContainer";

interface Step1Props {
  jobTitle: string;
  setJobTitle: (value: string) => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  workSetup: string;
  setWorkSetup: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  province: string;
  setProvince: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  provinceList: any[];
  cityList: any[];
  setCityList: (value: any[]) => void;
  salaryNegotiable: boolean;
  setSalaryNegotiable: (value: boolean) => void;
  minimumSalary: string;
  setMinimumSalary: (value: string) => void;
  maximumSalary: string;
  setMaximumSalary: (value: string) => void;
  minimumSalaryCurrency: string;
  setMinimumSalaryCurrency: (value: string) => void;
  maximumSalaryCurrency: string;
  setMaximumSalaryCurrency: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onJobTitleBlur?: () => void;
  descriptionError?: boolean;
  onDescriptionBlur?: () => void;
  onMinimumSalaryBlur?: () => void;
  onMaximumSalaryBlur?: () => void;
  teamMembers: any[];
  setTeamMembers: (value: any[]) => void;
  errors?: {
    jobTitle?: boolean;
    employmentType?: boolean;
    workSetup?: boolean;
    province?: boolean;
    city?: boolean;
    minimumSalary?: boolean;
    maximumSalary?: boolean;
  };
  onTeamAccessOpen?: () => void;
}

const Step1 = ({
  jobTitle,
  setJobTitle,
  employmentType,
  setEmploymentType,
  workSetup,
  setWorkSetup,
  country,
  setCountry,
  province,
  setProvince,
  city,
  setCity,
  provinceList,
  cityList,
  setCityList,
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
  description,
  setDescription,
  onJobTitleBlur,
  descriptionError,
  onDescriptionBlur,
  onMinimumSalaryBlur,
  onMaximumSalaryBlur,
  teamMembers,
  setTeamMembers,
  errors,
  onTeamAccessOpen,
}: Step1Props) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1560px",
          margin: '0 auto',
          gap: 16,
          alignItems: "flex-start",
          marginTop: 16,
        }}
      >
        {/* Left Column - Main Content */}
        <div
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <CareerInformation
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            workSetup={workSetup}
            setWorkSetup={setWorkSetup}
            country={country}
            setCountry={setCountry}
            province={province}
            setProvince={setProvince}
            city={city}
            setCity={setCity}
            provinceList={provinceList}
            cityList={cityList}
            setCityList={setCityList}
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
            onJobTitleBlur={onJobTitleBlur}
            onMinimumSalaryBlur={onMinimumSalaryBlur}
            onMaximumSalaryBlur={onMaximumSalaryBlur}
            errors={errors}
          />

          <JobDescription
            description={description}
            setDescription={setDescription}
            descriptionError={descriptionError}
            onDescriptionBlur={onDescriptionBlur}
          />

          <TeamAccess
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            onOpen={onTeamAccessOpen}
          />
        </div>

        {/* Right Column - Tips Sidebar */}
        <TipsContainer />
      </div>
    </>
  );
};

export default Step1;
