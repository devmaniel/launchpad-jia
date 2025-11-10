"use client";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAppContext } from "../../../context/AppContext";
import DirectInterviewLinkV2 from "../DirectInterviewLinkV2";
import CareerLink from "../CareerLink";
import CareerDetailsTeamAccess from "./CareerDetails&TeamAccess";
import CVScreeningContainer from "../NewCareerComponents/05ReviewCareer/CVScreeningContainer";
import AIInterviewSetup from "../NewCareerComponents/05ReviewCareer/AIInterviewSetup";
import PipeLaneStages from "../NewCareerComponents/05ReviewCareer/PipeLaneStages";
import AdvancedSettings from "./AdvancedSettings";
import TeamAccess from "./TeamAccess";

export default function JobDescriptionV2({ formData, setFormData, isEditing, setIsEditing, handleCancelEdit }: { formData: any, setFormData: (formData: any) => void, isEditing: boolean, setIsEditing: (isEditing: boolean) => void, handleCancelEdit: () => void }) {
    const { user } = useAppContext();

    async function updateCareer() {
      const userInfoSlice = {
        image: user.image,
        name: user.name,
        email: user.email,
      };
        const input = {
            _id: formData._id,
            jobTitle: formData.jobTitle,
            updatedAt: Date.now(),
            questions: formData.questions,
            status: formData.status,
            screeningSetting: formData.screeningSetting,
            requireVideo: formData.requireVideo,
            description: formData.description,
            lastEditedBy: userInfoSlice,
            createdBy: userInfoSlice,
        };

        Swal.fire({
            title: "Updating career...",
            text: "Please wait while we update the career...",
            allowOutsideClick: false,
        });

        try {
            const response = await axios.post("/api/update-career", input);
            
            if (response.status === 200) {
                Swal.fire({
                    title: "Success",
                    text: "Career updated successfully",
                    icon: "success",
                    allowOutsideClick: false,
                }).then(() => {
                   setIsEditing(false);
                   window.location.reload();
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update career",
                icon: "error",
                allowOutsideClick: false,
            });
        }
    }

    return (
        <div style={{   display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", gap: 16, width: "100%" }}>
                {/* Left Column - Takes remaining space */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
                    <CareerDetailsTeamAccess
                      jobTitle={formData.jobTitle}
                      employmentType={formData.employmentType}
                      workSetup={formData.workSetup}
                      country="Philippines"
                      state={formData.province || ""}
                      city={formData.location || ""}
                      minimumSalary={formData.minimumSalary || ""}
                      maximumSalary={formData.maximumSalary || ""}
                      minimumSalaryCurrency={formData.minimumSalaryCurrency || "PHP"}
                      maximumSalaryCurrency={formData.maximumSalaryCurrency || "PHP"}
                      salaryNegotiable={formData.salaryNegotiable || false}
                      descriptionHtml={formData.description}
                      onEditClick={() => console.log("Edit Career Details")}
                    />
                    <CVScreeningContainer
                      screeningSetting={formData.screeningSetting || "Auto"}
                      secretPrompt={formData.secretPrompt || ""}
                      preScreeningQuestions={formData.preScreeningQuestions || []}
                      customQuestions={formData.customQuestions || []}
                      askingMinSalary={formData.askingMinSalary || ""}
                      askingMaxSalary={formData.askingMaxSalary || ""}
                      askingMinCurrency={formData.askingMinCurrency || "PHP"}
                      askingMaxCurrency={formData.askingMaxCurrency || "PHP"}
                      onEditClick={() => console.log("Edit CV Screening")}
                    />
                    <AIInterviewSetup
                      aiInterviewSecretPrompt={formData.aiInterviewSecretPrompt || ""}
                      aiInterviewScreeningSetting={formData.aiInterviewScreeningSetting || "Auto"}
                      aiInterviewRequireVideo={formData.aiInterviewRequireVideo || false}
                      onEditClick={() => console.log("Edit AI Interview")}
                    />
                    <PipeLaneStages stages={formData.pipelineStages} onEditClick={() => console.log("Edit Pipeline Stages")} />
                </div>

                {/* Right Column - Fixed 420px width */}
                <div style={{ width: 420, display: "flex", flexDirection: "column", gap: 24 }}>
                    <TeamAccess teamMembers={formData.teamMembers || []} onEditClick={() => console.log("Edit Team Access")} />
                    <CareerLink career={formData} />
                    <DirectInterviewLinkV2 formData={formData} setFormData={setFormData} />
                    <AdvancedSettings careerId={formData._id} onEditClick={() => console.log("Edit Advanced Settings")} />
                </div>
            </div>
        </div>
    )
}