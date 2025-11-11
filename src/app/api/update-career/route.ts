import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";
import { sanitizeHtml, sanitizeText, sanitizeInput } from "@/lib/utils/sanitize";

/**
 * Normalize HTML entities to prevent cascading &nbsp; issues
 * This should be called before sanitizeHtml to clean up contentEditable artifacts
 */
const normalizeHtmlEntities = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/&nbsp;/g, ' ')     // Replace HTML entity
    .replace(/\u00A0/g, ' ')     // Replace Unicode non-breaking space
    .replace(/\s+/g, ' ')        // Normalize multiple spaces
    .trim();
};

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

    // Sanitize custom questions
    const sanitizedCustomQuestions = Array.isArray(customQuestions) 
      ? customQuestions.map((q: any) => ({
          ...q,
          question: sanitizeInput(q.question || ''),
          options: Array.isArray(q.options) ? q.options.map((o: string) => sanitizeInput(o || '')) : q.options,
        }))
      : [];

    // Sanitize team members
    const sanitizedTeamMembers = Array.isArray(teamMembers)
      ? teamMembers.map((member: any) => ({
          ...member,
          name: sanitizeText(member.name || ''),
          email: sanitizeText(member.email || ''),
          role: sanitizeText(member.role || ''),
        }))
      : [];

    // Sanitize pipeline stages
    const sanitizedPipelineStages = Array.isArray(pipelineStages)
      ? pipelineStages.map((stage: any) => ({
          ...stage,
          title: sanitizeText(stage.title || ''),
          substages: Array.isArray(stage.substages) 
            ? stage.substages.map((s: string) => sanitizeText(s || ''))
            : stage.substages,
        }))
      : [];

    const updateData = {
      jobTitle: sanitizeInput(jobTitle),
      description: sanitizeHtml(description),
      questions,
      location: sanitizeText(location),
      workSetup: sanitizeText(workSetup),
      workSetupRemarks: sanitizeInput(workSetupRemarks),
      updatedAt: new Date(),
      lastEditedBy,
      status: status || existingCareer.status,
      screeningSetting: sanitizeText(screeningSetting),
      requireVideo,
      lastActivityAt: new Date(),
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      minimumSalaryCurrency: sanitizeText(minimumSalaryCurrency || "PHP"),
      maximumSalaryCurrency: sanitizeText(maximumSalaryCurrency || "PHP"),
      country: sanitizeText(country),
      province: sanitizeText(province),
      employmentType: sanitizeText(employmentType),
      secretPrompt: sanitizeHtml(normalizeHtmlEntities(secretPrompt || "")),
      preScreeningQuestions: preScreeningQuestions || [],
      customQuestions: sanitizedCustomQuestions,
      askingMinSalary: askingMinSalary || "",
      askingMaxSalary: askingMaxSalary || "",
      askingMinCurrency: sanitizeText(askingMinCurrency || "PHP"),
      askingMaxCurrency: sanitizeText(askingMaxCurrency || "PHP"),
      teamMembers: sanitizedTeamMembers,
      aiInterviewSecretPrompt: sanitizeHtml(normalizeHtmlEntities(aiInterviewSecretPrompt || "")),
      aiInterviewScreeningSetting: sanitizeText(aiInterviewScreeningSetting || "Good Fit and above"),
      aiInterviewRequireVideo: aiInterviewRequireVideo !== undefined ? aiInterviewRequireVideo : true,
      aiInterviewQuestions: aiInterviewQuestions || [],
      pipelineStages: sanitizedPipelineStages,
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
