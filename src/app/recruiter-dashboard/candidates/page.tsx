"use client";

import React from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import CandidatesTableV2 from "@/lib/components/DataTables/CandidatesTableV2";
import { headerConfig } from "@/app/recruiter-dashboard/headerConfig";


export default function () {

  return (
    <>
      <HeaderBar 
        activeLink={headerConfig.candidates.activeLink} 
        currentPage={headerConfig.candidates.pages.overview.currentPage} 
        iconPath={headerConfig.candidates.iconPath} 
      />
      <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
        <div className="row">
          <div className="col">
            <CandidatesTableV2 />
          </div>
        </div>
      </div>
    </>
  );
}