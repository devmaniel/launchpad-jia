import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const {
      _id,
      jobTitle,
      description,
      questions,
      lastEditedBy,
      screeningSetting,
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
    if (!_id || !jobTitle || !description || !location || !workSetup) {
      return NextResponse.json(
        {
          error:
            "Career ID, job title, description, location and work setup are required",
        },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    // Check if career exists
    const existingCareer = await db.collection("careers").findOne({ _id: new ObjectId(_id) });
    if (!existingCareer) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }

    const updateData = {
      jobTitle,
      description,
      questions,
      location,
      workSetup,
      workSetupRemarks,
      updatedAt: new Date(),
      lastEditedBy,
      status: status || existingCareer.status,
      screeningSetting,
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

    await db.collection("careers").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    return NextResponse.json({
      message: "Career updated successfully",
      career: { _id, ...updateData },
    });
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { error: "Failed to update career" },
      { status: 500 }
    );
  }
}
