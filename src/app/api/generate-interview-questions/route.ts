import { NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * Fallback questions for software engineering roles when API fails
 */
const FALLBACK_QUESTIONS = {
  "CV Validation / Experience": [
    "Walk me through your most challenging project. What was your role, and what technical decisions did you make?",
    "Describe a situation where you had to learn a new technology or framework quickly. How did you approach it?",
    "Tell me about a time when you had to debug a critical production issue. What was your process?",
    "What's the most impactful feature or system you've built? What made it successful?",
    "Describe your experience with version control and collaboration in a team environment.",
    "Tell me about a project where you had to balance technical debt with feature development.",
    "What's your experience with code reviews? Can you share an example of valuable feedback you've given or received?",
    "Describe a time when you had to refactor legacy code. What approach did you take?"
  ],
  "Technical": [
    "Explain the difference between synchronous and asynchronous programming. When would you use each?",
    "How do you approach optimizing application performance? Can you walk through your methodology?",
    "What's your understanding of RESTful API design principles? How do you ensure APIs are well-designed?",
    "Explain the concept of database indexing and when you would use it.",
    "How do you handle error handling and logging in your applications?",
    "What's your approach to writing testable code? What testing strategies do you prefer?",
    "Explain the differences between SQL and NoSQL databases. When would you choose one over the other?",
    "How do you ensure application security in your code? What are common vulnerabilities you watch for?",
    "Describe your experience with CI/CD pipelines. What tools have you used?",
    "What design patterns are you familiar with? Can you explain when you'd use the Singleton pattern?"
  ],
  "Behavioral": [
    "Tell me about a time when you disagreed with a team member about a technical approach. How did you handle it?",
    "Describe a situation where you had to meet a tight deadline. How did you prioritize your work?",
    "Share an example of when you received critical feedback. How did you respond?",
    "Tell me about a time when you had to explain a complex technical concept to a non-technical stakeholder.",
    "Describe a situation where you made a mistake in your code that reached production. What did you learn?",
    "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
    "Share an example of when you took initiative to improve a process or system without being asked.",
    "Describe a time when you had to balance multiple competing priorities. How did you manage?"
  ],
  "Analytical": [
    "How would you design a URL shortening service like bit.ly? Walk me through your approach.",
    "If you had to improve the performance of a slow database query, what steps would you take?",
    "How would you approach debugging an issue that only occurs in production but not in development?",
    "Explain how you would design a caching strategy for a high-traffic web application.",
    "How would you estimate the server capacity needed for an application with 1 million daily active users?",
    "Walk me through how you would troubleshoot a memory leak in an application.",
    "How would you approach migrating a monolithic application to microservices?",
    "Describe how you would design a notification system that needs to handle millions of users."
  ],
  "Others": [
    "What interests you most about this role and our company?",
    "Where do you see yourself in your career in the next 3-5 years?",
    "What's your preferred work environment and team structure?",
    "How do you stay updated with new technologies and industry trends?",
    "What motivates you as a software engineer?",
    "What type of projects or problems do you find most engaging?",
    "How do you approach work-life balance in a demanding technical role?",
    "What's your ideal team culture and how do you contribute to it?"
  ]
};

/**
 * API to generate AI interview questions based on job details
 */
export async function POST(request: Request) {
  let requestBody;
  
  try {
    requestBody = await request.json();
    const { jobTitle, jobDescription, employmentType, workSetup, category, count = 1 } = requestBody;

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
    console.log("Using fallback questions due to API error");
    
    // Use fallback questions when API fails
    if (!requestBody) {
      return NextResponse.json({
        success: false,
        error: "Invalid request body",
      }, { status: 400 });
    }
    
    const { category, count = 1 } = requestBody;
    const fallbackPool = FALLBACK_QUESTIONS[category] || FALLBACK_QUESTIONS["Others"];
    
    // Randomly select questions from the fallback pool
    const shuffled = [...fallbackPool].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, count);
    
    return NextResponse.json({
      success: true,
      questions,
      category,
      usedFallback: true,
      message: "AI service unavailable. Using curated questions."
    });
  }
}
