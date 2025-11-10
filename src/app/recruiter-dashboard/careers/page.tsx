"use client";

import React from "react";
import CareersV2Table from "@/lib/components/DataTables/CareersTableV2";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import { headerConfig } from "@/app/recruiter-dashboard/headerConfig";

export default function () {
  return (
    <>
      <HeaderBar 
        activeLink={headerConfig.careers.activeLink} 
        currentPage={headerConfig.careers.pages.overview.currentPage} 
        iconPath={headerConfig.careers.iconPath} 
      />
      <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
        <div className="row">
          <div className="col">
            <CareersV2Table />
          </div>
        </div>
      </div>
    </>
  );
}