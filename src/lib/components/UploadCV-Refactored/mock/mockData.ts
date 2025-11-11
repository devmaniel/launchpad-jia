/**
 * Mock data for CV upload testing
 * Returns different CV data and screening results based on file name
 */

import { UserCV, ScreeningResult } from "../types";

export interface MockCVData {
  userCV: UserCV;
  screeningResult: ScreeningResult;
}

/**
 * Get mock data based on file name
 * @param fileName - Name of the uploaded file (without extension)
 * @returns Mock CV data and screening result
 */
export function getMockDataByFileName(fileName: string): MockCVData {
  // Remove file extension and convert to lowercase for comparison
  const normalizedFileName = fileName.toLowerCase().replace(/\.(pdf|docx?|txt)$/i, "");

  // Check if filename contains "resumev1" (Good Fit)
  if (normalizedFileName.includes("resumev1")) {
    return {
      userCV: {
        Introduction:
          "**Senior Full-Stack Developer** with 8+ years of experience specializing in **React**, **Node.js**, and **TypeScript**. Proven track record of building scalable web applications and leading development teams.",
        "Current Position":
          "**Lead Software Engineer** at Tech Innovations Inc. (2020 - Present)",
        "Contact Info":
          "john.goodfit@email.com | +1 (555) 987-6543 | San Francisco, CA",
        Skills:
          "React, TypeScript, Node.js, Next.js, GraphQL, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, CI/CD, Agile/Scrum",
        Experience:
          "8+ years in full-stack development, 3+ years in technical leadership, expertise in microservices architecture and cloud-native applications",
        Education:
          "Master of Science in Computer Science - Stanford University (2013-2015)\nBachelor of Science in Software Engineering - MIT (2009-2013)",
        Projects:
          "E-Commerce Platform (React, Node.js, 1M+ users), Real-time Analytics Dashboard (Next.js, GraphQL), Open Source Contributor (React ecosystem)",
        Certifications:
          "AWS Certified Solutions Architect Professional, Google Cloud Professional Developer, Certified Kubernetes Administrator (CKA)",
        Awards:
          "Tech Excellence Award (2023), Innovation Leader of the Year (2022), Best Project Award (2021)",
      },
      screeningResult: {
        status: "For AI Interview",
        applicationStatus: "Ongoing",
        jobFit: "Strong Fit",
      },
    };
  }

  // Check if filename contains "resumev2" (Maybe Fit)
  if (normalizedFileName.includes("resumev2")) {
    return {
      userCV: {
        Introduction:
          "**Software Developer** with 3 years of experience in web development. Familiar with **JavaScript** and **React**. Looking to grow skills in modern web technologies.",
        "Current Position":
          "**Junior Developer** at StartupCo (2021 - Present)",
        "Contact Info":
          "jane.maybefit@email.com | +1 (555) 456-7890 | Austin, TX",
        Skills:
          "JavaScript, React, HTML/CSS, Git, REST APIs, Basic Node.js, MySQL",
        Experience:
          "3 years in web development, primarily frontend work with some backend exposure",
        Education:
          "Bachelor of Science in Information Technology - University of Texas (2017-2021)",
        Projects:
          "Company Website Redesign (React), Internal Dashboard (JavaScript), Personal Portfolio",
        Certifications: "FreeCodeCamp Responsive Web Design, Udemy React Course",
        Awards: "Employee of the Month (2022)",
      },
      screeningResult: {
        status: "For Review",
        applicationStatus: "Ongoing",
        jobFit: "Maybe Fit",
      },
    };
  }

  // Check if filename contains "resumev3" (Bad Fit)
  if (normalizedFileName.includes("resumev3")) {
    return {
      userCV: {
        Introduction:
          "**Junior Developer** with 1 year of experience. Recently graduated and learning web development fundamentals.",
        "Current Position":
          "**Intern Developer** at Small Tech Company (2023 - Present)",
        "Contact Info":
          "bob.badfit@email.com | +1 (555) 123-0000 | Remote",
        Skills:
          "HTML, CSS, Basic JavaScript, jQuery, WordPress",
        Experience:
          "1 year as intern, mostly working on WordPress sites and basic HTML/CSS modifications",
        Education:
          "Associate Degree in Web Design - Community College (2021-2023)",
        Projects:
          "Personal Blog (WordPress), Simple Landing Page (HTML/CSS)",
        Certifications: "None",
        Awards: "None",
      },
      screeningResult: {
        status: "Not Qualified",
        applicationStatus: "Dropped",
        jobFit: "Bad Fit",
      },
    };
  }

  // Default fallback (Good Fit)
  return {
    userCV: {
      Introduction:
        "**Senior Software Engineer** with 6+ years of experience specializing in **Java** and **Spring Boot** backend development.",
      "Current Position":
        "**Senior Backend Engineer** at TechCorp Solutions (2021 - Present)",
      "Contact Info":
        "alex.chen@email.com | +1 (555) 123-4567 | San Francisco, CA",
      Skills:
        "Java, Spring Boot, Spring Security, Microservices, RESTful APIs, OAuth2, AWS, Docker, Kubernetes",
      Experience:
        "6+ years in backend development, microservices architecture, and cloud-native applications",
      Education:
        "Bachelor of Science in Computer Science - University of California, Berkeley (2014-2018)",
      Projects:
        "Open Source API Gateway, E-Commerce Microservices Platform, Healthcare API Integration System",
      Certifications:
        "AWS Certified Solutions Architect, Oracle Java SE 11 Developer, Spring Professional, CKAD",
      Awards:
        "Excellence in Engineering Award (2023), Best API Design (2022)",
    },
    screeningResult: {
      status: "For AI Interview",
      applicationStatus: "Ongoing",
      jobFit: "Strong Fit",
    },
  };
}
