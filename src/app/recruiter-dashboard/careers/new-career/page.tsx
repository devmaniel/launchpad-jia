"use client";

import React, { useEffect, useState } from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import CareerFormV2 from "@/lib/components/CareerComponents/NewCareerComponents/CareerFormV2_REFACTORED";
import { useSearchParams } from "next/navigation";
import { headerConfig } from "@/app/recruiter-dashboard/headerConfig";

export default function NewCareerPage() {
    const [currentStep] = useState(1);
    const [ready, setReady] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('careerFormV2:new');
                sessionStorage.removeItem('hasChanges');
            }
        } catch {}
        setReady(true);
    }, []);

    if (!ready) return null;

    const forcePrefill = searchParams?.get('prefill') === '1';

    return (
        <>
        <HeaderBar 
          activeLink={headerConfig.careers.activeLink} 
          currentPage={headerConfig.careers.pages.newCareer.currentPage} 
          iconPath={headerConfig.careers.iconPath} 
        />
        <div className="container-fluid mt--7" style={{ paddingTop: "6rem", display: "flex", justifyContent: "center" }}>
          <div className="row" style={{ width: "100%" }}>
            <CareerFormV2 formType="add" currentStep={currentStep} forcePrefill={forcePrefill} />
          </div>
        </div>
      </>
    )
}
