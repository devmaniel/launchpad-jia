// TODO (Vince) - For Merging

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Mock data fallback for when API quota is exceeded
function getMockCVData() {
  return {
    errorRemarks: null,
    digitalCV: [
      {
        name: "Introduction",
        content: "**Senior Software Engineer** with 6+ years of experience specializing in **Java** and **Spring Boot** backend development. Proven track record in designing and implementing scalable microservices architectures, RESTful APIs, and cloud-native applications. Strong expertise in API-first development, OAuth2 security implementations, and CI/CD pipelines. Passionate about writing clean, maintainable code and delivering high-performance backend solutions."
      },
      {
        name: "Current Position",
        content: "**Senior Backend Engineer** at TechCorp Solutions (2021 - Present)\n\nLead backend development for enterprise-grade microservices handling 10M+ daily requests. Architect and implement RESTful APIs using Spring Boot and Quarkus, with focus on OAuth2/JWT authentication. Reduced API response times by 40% through caching strategies and performance optimization."
      },
      {
        name: "Contact Info",
        content: "**Email:** alex.chen@email.com\n\n**Phone:** +1 (555) 123-4567\n\n**Location:** San Francisco, CA\n\n**LinkedIn:** [linkedin.com/in/alexchen-dev](https://linkedin.com/in/alexchen-dev)\n\n**GitHub:** [github.com/alexchen-dev](https://github.com/alexchen-dev)"
      },
      {
        name: "Skills",
        content: "**Backend Development:**\n- Java (8, 11, 17), Spring Boot, Spring Security, Spring Data JPA\n- Quarkus, Hibernate, Maven, Gradle\n\n**API Development:**\n- RESTful API Design, OpenAPI/Swagger, API-First Development\n- OAuth2, JWT, TLS/SSL, API Gateway patterns\n- GraphQL, gRPC\n\n**Microservices & Architecture:**\n- Microservices Architecture, Event-Driven Design\n- Apache Kafka, RabbitMQ, Redis\n- Circuit Breaker patterns (Resilience4j)\n\n**Cloud & DevOps:**\n- AWS (EC2, ECS, Lambda, RDS, S3), Docker, Kubernetes\n- CI/CD (Jenkins, GitLab CI, GitHub Actions)\n- Terraform, Helm Charts\n\n**Databases:**\n- PostgreSQL, MySQL, MongoDB, Redis\n- Database optimization and indexing strategies\n\n**Testing & Quality:**\n- JUnit, Mockito, TestContainers, REST Assured\n- Performance testing (JMeter, Gatling)\n- SonarQube, code quality best practices"
      },
      {
        name: "Experience",
        content: "**Senior Backend Engineer** | TechCorp Solutions | 2021 - Present\n- Architected and developed 15+ microservices using Spring Boot and Quarkus serving 10M+ daily users\n- Implemented OAuth2 authorization server with JWT tokens, reducing authentication latency by 35%\n- Designed API-first architecture using OpenAPI specifications, improving team collaboration and reducing integration time by 50%\n- Built event-driven systems using Apache Kafka for real-time data processing (500K+ events/hour)\n- Optimized database queries and implemented Redis caching, improving API response times by 40%\n- Led CI/CD pipeline improvements using Jenkins and Docker, reducing deployment time from 2 hours to 15 minutes\n- Mentored 4 junior engineers on Spring Boot best practices and microservices patterns\n\n**Software Engineer** | DataFlow Systems | 2019 - 2021\n- Developed RESTful APIs using Spring Boot for financial transaction processing system\n- Implemented rate-limiting and circuit breaker patterns using Resilience4j for high-availability services\n- Integrated third-party payment APIs with robust error handling and retry mechanisms\n- Wrote comprehensive unit and integration tests achieving 85%+ code coverage\n- Collaborated with DevOps team to containerize applications using Docker and deploy to AWS ECS\n\n**Junior Java Developer** | StartupHub Inc | 2018 - 2019\n- Built backend services using Spring Boot and PostgreSQL for e-commerce platform\n- Developed RESTful endpoints for user authentication, product catalog, and order management\n- Participated in agile sprints and code reviews, following TDD practices\n- Implemented API documentation using Swagger/OpenAPI specifications"
      },
      {
        name: "Education",
        content: "**Bachelor of Science in Computer Science**\n\nUniversity of California, Berkeley | 2014 - 2018\n\n- GPA: 3.7/4.0\n- Relevant Coursework: Data Structures, Algorithms, Database Systems, Distributed Systems, Software Engineering\n- Senior Project: Built a microservices-based social media platform using Spring Boot and React"
      },
      {
        name: "Projects",
        content: "**Open Source API Gateway** | [github.com/alexchen-dev/api-gateway](https://github.com/alexchen-dev/api-gateway)\n- Built lightweight API Gateway using Spring Cloud Gateway with OAuth2 integration\n- Implemented rate limiting, request routing, and circuit breaker patterns\n- 500+ GitHub stars, actively maintained\n\n**E-Commerce Microservices Platform**\n- Personal project demonstrating microservices architecture with Spring Boot\n- Services: User Management, Product Catalog, Order Processing, Payment Gateway\n- Technologies: Spring Boot, Kafka, Redis, PostgreSQL, Docker, Kubernetes\n- Implemented saga pattern for distributed transactions\n\n**Healthcare API Integration System**\n- Developed HIPAA-compliant API integration layer for healthcare data exchange\n- Implemented TLS encryption, audit logging, and data anonymization\n- Technologies: Spring Boot, OAuth2, PostgreSQL, AWS"
      },
      {
        name: "Certifications",
        content: "**AWS Certified Solutions Architect – Associate** | Amazon Web Services | 2022\n\n**Oracle Certified Professional: Java SE 11 Developer** | Oracle | 2021\n\n**Spring Professional Certification** | VMware | 2020\n\n**Certified Kubernetes Application Developer (CKAD)** | Cloud Native Computing Foundation | 2023"
      },
      {
        name: "Awards",
        content: "**Excellence in Engineering Award** | TechCorp Solutions | 2023\n- Recognized for architecting high-performance microservices platform that improved system reliability from 99.5% to 99.95% uptime\n\n**Best API Design** | Internal Hackathon | 2022\n- Won first place for designing elegant RESTful API architecture following OpenAPI standards\n\n**Outstanding Contributor** | Apache Kafka Community | 2021\n- Acknowledged for contributing bug fixes and documentation improvements to Apache Kafka project"
      }
    ]
  };
}

export async function POST(req: NextRequest) {
  const { chunks } = await req.json();
  const corePrompt = `
    You are a helpful assistant that will extract the following data from the CV:
    
    CV chunks:
    ${chunks.map((chunk: any) => chunk.pageContent).join("\n")}

    Extract the following data from the CV:
      - Name
      - Email
      - Phone
      - Address
      - LinkedIn
      - GitHub
      - Twitter

    JSON template: 
    {
      errorRemarks: <error remarks>,
      digitalCV:
        [
          {name: "Introduction", content: <Introduction content markdown format>},
          {name: "Current Position", content: <Current Position content markdown format>},
          {name: "Contact Info", content: <Contact Info content markdown format>},
          {name: "Skills", content: <Skills content markdown format>},
          {name: "Experience", content: <Experience content markdown format>},
          {name: "Education", content: <Education content markdown format>},
          {name: "Projects", content: <Projects content markdown format>},
          {name: "Certifications", content: <Certifications content markdown format>},
          {name: "Awards", content: <Awards content markdown format>},
        ]
    }

    Processing Instructions:
      - follow the JSON template strictly
      - for contact info content make sure links are formatted as markdown links,
      - give detailed info in the content field.
      - in Awards content field give details of each award.
      - make sure the markdown format is correct, all section headlines are in bold. all paragraphs are in normal text, all lists are in bullet points, etc.
      - make sure all markdown lead text are equivalent to h2 tags in html,
      - for the Error Remarks, give a message if the chunks does seem to be a curriculum vitae, otherwise set it to null,
      - Do not include any other text or comments in the JSON output.
      - Only return the JSON output.
      - DO NOT include \`\`\`json or \`\`\` around the response.
    `;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const models = ["gpt-4o-mini", "gpt-3.5-turbo"] as const;
  let lastError: any = null;
  for (const model of models) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: corePrompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      });

      return NextResponse.json({
        result: completion.choices[0].message.content,
      });
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.response?.status;
      const code = err?.code || err?.response?.data?.error?.code;
      if (status === 429 || code === "insufficient_quota") {
        // try next model
        continue;
      }
      // Non-quota error: rethrow
      throw err;
    }
  }

  // Fallback to mock data when API quota is exceeded
  console.warn("⚠️ OpenAI API quota exceeded, returning mock CV data");
  const mockData = getMockCVData();
  return NextResponse.json({
    result: JSON.stringify(mockData),
    _mock: true, // Flag to indicate this is mock data
  });
}
