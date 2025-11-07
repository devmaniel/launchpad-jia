"use client";

import React, { useState } from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import CareerFormV2 from "@/lib/components/CareerComponents/CareerFormV2";

export default function NewCareerPage() {
    const [currentStep] = useState(1);
    return (
        <>
        <HeaderBar activeLink="Careers" currentPage="Add new career" icon="la la-suitcase" />
        <div className="container-fluid mt--7" style={{ paddingTop: "6rem", display: "flex", justifyContent: "center" }}>
          <div className="row" style={{ width: "100%" }}>
            <CareerFormV2 formType="add" currentStep={currentStep} />
          </div>
        </div>
      </>
    )
}
