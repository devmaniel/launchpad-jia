import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { guid } from "@/lib/Utils";
import { ObjectId } from "mongodb";
import { getOrganizationPlanInfo, canCreateNewCareer } from "@/lib/utils/organizationPlanUtils";

export async function POST(request: Request) {
  try {
    const {
      jobTitle,
      description,
      questions,
      lastEditedBy,
      createdBy,
      screeningSetting,
      orgID,
      requireVideo,
      location,
      workSetup,
      workSetupRemarks,
      status,
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      minimumSalaryCurrency,
      maximumSalaryCurrency,
      country,
      province,
      employmentType,
      secretPrompt,
      preScreeningQuestions,
      customQuestions,
      askingMinSalary,
      askingMaxSalary,
      askingMinCurrency,
      askingMaxCurrency,
      teamMembers,
      aiInterviewSecretPrompt,
      aiInterviewScreeningSetting,
      aiInterviewRequireVideo,
      aiInterviewQuestions,
      pipelineStages,
    } = await request.json();
    // Validate required fields
    if (!jobTitle || !description || !location || !workSetup) {
      return NextResponse.json(
        {
          error:
            "Job title, description, location and work setup are required",
        },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    console.log('=== ADD CAREER API ===');
    console.log('OrgID received:', orgID);
    console.log('Job Title:', jobTitle);
    console.log('Status:', status);

    const orgDetails = await db.collection("organizations").aggregate([
      {
        $match: {
          _id: new ObjectId(orgID)
        }
      },
      {
        $lookup: {
            from: "organization-plans",
            let: { planId: "$planId" },
            pipeline: [
                {
                    $addFields: {
                        _id: { $toString: "$_id" }
                    }
                },
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$$planId"] }
                    }
                }
            ],
            as: "plan"
        }
      },
      {
        $unwind: "$plan"
      },
    ]).toArray();

    console.log('Org details found:', orgDetails.length);
    
    // Check if organization exists (simplified check without plan requirement)
    const orgExists = await db.collection("organizations").findOne({ _id: new ObjectId(orgID) });
    console.log('Organization exists:', !!orgExists);
    
    if (!orgExists) {
      return NextResponse.json({ 
        error: "Organization not found. Please ensure your organization is set up correctly.",
        orgID 
      }, { status: 404 });
    }

    // Only do plan validation if org has plan details
    if (orgDetails && orgDetails.length > 0) {
      const totalActiveCareers = await db.collection("careers").countDocuments({ orgID, status: "active" });

      // Use the new utility function to get plan information
      const planInfo = getOrganizationPlanInfo(orgDetails[0]);
      const canCreate = canCreateNewCareer(planInfo.totalJobSlots, totalActiveCareers, planInfo.hasValidPlan);

      console.log("add-career: Plan validation:", {
        orgID,
        planInfo,
        totalActiveCareers,
        canCreate
      });

      if (!canCreate.canCreate) {
        return NextResponse.json({ 
          error: canCreate.reason || "Cannot create new career",
          planInfo: {
            totalJobSlots: planInfo.totalJobSlots,
            activeJobs: totalActiveCareers,
            hasValidPlan: planInfo.hasValidPlan,
            planType: planInfo.planType
          }
        }, { status: 400 });
      }
    } else {
      console.log('Organization exists but no plan details found, allowing career creation');
    }

    const career = {
      id: guid(),
      jobTitle,
      description,
      questions,
      location,
      workSetup,
      workSetupRemarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedBy,
      createdBy,
      status: status || "active",
      screeningSetting,
      orgID,
      requireVideo,
      lastActivityAt: new Date(),
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      minimumSalaryCurrency: minimumSalaryCurrency || "PHP",
      maximumSalaryCurrency: maximumSalaryCurrency || "PHP",
      country,
      province,
      employmentType,
      secretPrompt: secretPrompt || "",
      preScreeningQuestions: preScreeningQuestions || [],
      customQuestions: customQuestions || [],
      askingMinSalary: askingMinSalary || "",
      askingMaxSalary: askingMaxSalary || "",
      askingMinCurrency: askingMinCurrency || "PHP",
      askingMaxCurrency: askingMaxCurrency || "PHP",
      teamMembers: teamMembers || [],
      aiInterviewSecretPrompt: aiInterviewSecretPrompt || "",
      aiInterviewScreeningSetting: aiInterviewScreeningSetting || "Good Fit and above",
      aiInterviewRequireVideo: aiInterviewRequireVideo !== undefined ? aiInterviewRequireVideo : true,
      aiInterviewQuestions: aiInterviewQuestions || [],
      pipelineStages: pipelineStages || [],
    };

    console.log('Inserting career into database...');
    const insertResult = await db.collection("careers").insertOne(career);
    console.log('Insert result:', insertResult);
    console.log('Career created successfully with ID:', insertResult.insertedId);

    return NextResponse.json({
      message: "Career added successfully",
      career: { ...career, _id: insertResult.insertedId },
    });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json(
      { error: "Failed to add career" },
      { status: 500 }
    );
  }
}
