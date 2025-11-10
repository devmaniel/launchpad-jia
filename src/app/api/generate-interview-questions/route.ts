import { NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * API to generate AI interview questions based on job details
 */
export async function POST(request: Request) {
  try {
    const { jobTitle, jobDescription, employmentType, workSetup, category, count = 1 } = await request.json();

    // Convert HTML to plain text
    const plainTextDescription = jobDescription
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();

    const categoryPrompts = {
      "CV Validation / Experience": "Create questions that validate the candidate's work experience, projects, and career progression. Focus on understanding their past roles, achievements, and real-world impact.",
      "Technical": "Create technical questions relevant to the role that assess problem-solving skills, technical knowledge, and hands-on experience with tools, frameworks, or methodologies.",
      "Behavioral": "Create behavioral questions using the STAR method to understand how the candidate handled past situations, conflicts, teamwork, and challenges.",
      "Analytical": "Create questions that assess the candidate's analytical thinking, data-driven decision making, and problem-solving approach.",
      "Others": "Create general questions about motivation, career goals, cultural fit, and why they're interested in this specific role and company."
    };

    const categoryGuidance = categoryPrompts[category] || categoryPrompts["Others"];

    const prompt = `You are an expert HR interviewer creating interview questions for a job position.

Job Details:
- Job Title: ${jobTitle}
- Employment Type: ${employmentType}
- Work Setup: ${workSetup}
- Job Description:
${plainTextDescription}

Category: ${category}
Category Guidance: ${categoryGuidance}

Instructions:
- Generate ${count} interview question${count > 1 ? 's' : ''} for the "${category}" category
- Questions should be tailored to the specific job title and description
- Make questions open-ended and insightful
- Questions should be clear, concise, and professional
- Each question should help assess the candidate's fit for this specific role
- Avoid generic questions - make them specific to the job description details

Return ONLY a JSON array of questions in this exact format:
${count === 1 ? '["Question text here"]' : '["Question 1 text", "Question 2 text", "Question 3 text", ...]'}

DO NOT include any markdown formatting, explanations, or additional text. Return only the JSON array.`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    let result = completion.choices[0].message.content;

    // Clean up the response
    result = result.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const questions = JSON.parse(result);
      
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }

      return NextResponse.json({
        success: true,
        questions,
        category,
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw response:", result);
      
      return NextResponse.json({
        success: false,
        error: "Failed to parse AI response",
        rawResponse: result,
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to generate questions",
    }, { status: 500 });
  }
}
