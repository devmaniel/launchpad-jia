export const mockCandidates = [
  // CV SCREENING - Waiting for Submission (No assessment yet)
  {
    _id: "candidate-1",
    name: "Hector Castro",
    email: "hector.castro@gmail.com",
    image: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    currentStep: "CV Screening",
    cvStatus: "Waiting for Submission",
    jobFit: "N/A",
    cvScreeningReason: "",
    summary: "",
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: null,
      action: null
    }
  },
  
  // CV SCREENING - For Review (Strong Fit)
  {
    _id: "candidate-2",
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    image: "https://i.pravatar.cc/150?img=2",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    currentStep: "CV Screening",
    cvStatus: "Strong Fit",
    cvFile: true,
    jobFit: "N/A",
    cvScreeningReason: "Strong technical background",
    summary: "",
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Assessed"
    }
  },
  
  // CV SCREENING - For Review (Maybe Fit)
  {
    _id: "candidate-3",
    name: "Michael Chen",
    email: "michael.chen@gmail.com",
    image: "https://i.pravatar.cc/150?img=3",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    currentStep: "CV Screening",
    cvStatus: "Maybe Fit",
    cvFile: true,
    jobFit: "Maybe Fit",
    cvScreeningReason: "Some relevant experience",
    summary: "",
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Assessed"
    }
  },
  
  // CV SCREENING - For Review (Bad Fit)
  {
    _id: "candidate-4",
    name: "Lisa Wong",
    email: "lisa.wong@gmail.com",
    image: "https://i.pravatar.cc/150?img=10",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    currentStep: "CV Screening",
    cvStatus: "Bad Fit",
    cvFile: true,
    jobFit: "Maybe Fit",
    cvScreeningReason: "Insufficient experience",
    summary: "",
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Assessed"
    }
  },
  
  // AI INTERVIEW - Waiting Interview (No interview yet)
  {
    _id: "candidate-5",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@gmail.com",
    image: "https://i.pravatar.cc/150?img=4",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    currentStep: "AI Interview",
    status: "For Interview",
    cvStatus: "Approved",
    jobFit: "Maybe Fit",
    cvScreeningReason: "Passed CV screening",
    summary: "",
    aiInterviewCompleted: false,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Endorsed"
    }
  },
  
  // AI INTERVIEW - For Review (Strong Fit)
  {
    _id: "candidate-6",
    name: "David Park",
    email: "david.park@gmail.com",
    image: "https://i.pravatar.cc/150?img=5",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    currentStep: "AI Interview",
    status: "For AI Interview Review",
    cvStatus: "Approved",
    jobFit: "Strong Fit",
    cvScreeningReason: "Passed CV screening",
    summary: "Outstanding technical skills, excellent communication",
    aiInterviewCompleted: true,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Completed AI Interview"
    }
  },
  
  // AI INTERVIEW - For Review (Maybe Fit)
  {
    _id: "candidate-7",
    name: "James Wilson",
    email: "james.wilson@gmail.com",
    image: "https://i.pravatar.cc/150?img=6",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    currentStep: "AI Interview",
    status: "For AI Interview Review",
    cvStatus: "Approved",
    jobFit: "Maybe Fit",
    cvScreeningReason: "Passed CV screening",
    summary: "Good communication, needs improvement in technical areas",
    aiInterviewCompleted: true,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Completed AI Interview"
    }
  },
  
  // AI INTERVIEW - For Review (Bad Fit)
  {
    _id: "candidate-8",
    name: "Robert Taylor",
    email: "robert.taylor@gmail.com",
    image: "https://i.pravatar.cc/150?img=7",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    currentStep: "AI Interview",
    status: "For AI Interview Review",
    cvStatus: "Approved",
    jobFit: "Bad Fit",
    cvScreeningReason: "Passed CV screening",
    summary: "Poor communication skills, lacks technical knowledge",
    aiInterviewCompleted: true,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Completed AI Interview"
    }
  },
  
  // AI INTERVIEW - With Retake Request (Pending)
  {
    _id: "candidate-9",
    name: "Anna Martinez",
    email: "anna.martinez@gmail.com",
    image: "https://i.pravatar.cc/150?img=8",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    currentStep: "AI Interview",
    status: "For AI Interview Review",
    cvStatus: "Approved",
    jobFit: "Maybe Fit",
    cvScreeningReason: "Passed CV screening",
    summary: "Decent performance, requested retake",
    aiInterviewCompleted: true,
    applicationStatus: "Ongoing",
    retakeRequest: {
      status: "Pending",
      requestedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
      reason: "Technical issues during interview"
    },
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Completed AI Interview"
    }
  },
  
  // HUMAN INTERVIEW - Waiting Schedule
  {
    _id: "candidate-10",
    name: "Thomas Anderson",
    email: "thomas.anderson@gmail.com",
    image: "https://i.pravatar.cc/150?img=11",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    currentStep: "Human Interview",
    status: "For Schedule",
    cvStatus: "Approved",
    jobFit: "Strong Fit",
    humanInterviewScheduled: false,
    humanInterviewCompleted: false,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "/jia-avatar.png", name: "JIA", email: "jia@system.com" },
      action: "Endorsed"
    }
  },
  
  // HUMAN INTERVIEW - Waiting Interview
  {
    _id: "candidate-11",
    name: "Jennifer Lee",
    email: "jennifer.lee@gmail.com",
    image: "https://i.pravatar.cc/150?img=12",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    currentStep: "Human Interview",
    status: "For Human Interview",
    cvStatus: "Approved",
    jobFit: "Strong Fit",
    humanInterviewScheduled: true,
    humanInterviewCompleted: false,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "https://i.pravatar.cc/150?img=20", name: "John Recruiter", email: "john@company.com" },
      action: "Scheduled"
    }
  },
  
  // HUMAN INTERVIEW - For Review
  {
    _id: "candidate-12",
    name: "Kevin Brown",
    email: "kevin.brown@gmail.com",
    image: "https://i.pravatar.cc/150?img=13",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    currentStep: "Human Interview",
    status: "For Human Interview Review",
    cvStatus: "Approved",
    jobFit: "Strong Fit",
    humanInterviewScheduled: true,
    humanInterviewCompleted: true,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "https://i.pravatar.cc/150?img=20", name: "John Recruiter", email: "john@company.com" },
      action: "Interviewed"
    }
  },
  
  // JOB OFFER - For Final Review
  {
    _id: "candidate-13",
    name: "Rachel Green",
    email: "rachel.green@gmail.com",
    image: "https://i.pravatar.cc/150?img=14",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
    currentStep: "Job Offer",
    status: "For Final Review",
    cvStatus: "Approved",
    jobFit: "Strong Fit",
    humanInterviewScheduled: true,
    humanInterviewCompleted: true,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "https://i.pravatar.cc/150?img=20", name: "John Recruiter", email: "john@company.com" },
      action: "Endorsed"
    }
  },
  
  // JOB OFFER - Waiting for Acceptance
  {
    _id: "candidate-14",
    name: "Monica Geller",
    email: "monica.geller@gmail.com",
    image: "https://i.pravatar.cc/150?img=15",
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
    currentStep: "Job Offer",
    status: "Waiting for Acceptance",
    cvStatus: "Approved",
    jobFit: "Strong Fit",
    humanInterviewScheduled: true,
    humanInterviewCompleted: true,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "https://i.pravatar.cc/150?img=20", name: "John Recruiter", email: "john@company.com" },
      action: "Sent Offer"
    }
  },
  
  // JOB OFFER - For Contract Signing
  {
    _id: "candidate-15",
    name: "Chandler Bing",
    email: "chandler.bing@gmail.com",
    image: "https://i.pravatar.cc/150?img=16",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    currentStep: "Job Offer",
    status: "For Contract Signing",
    cvStatus: "Approved",
    jobFit: "Strong Fit",
    humanInterviewScheduled: true,
    humanInterviewCompleted: true,
    applicationStatus: "Ongoing",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "https://i.pravatar.cc/150?img=20", name: "John Recruiter", email: "john@company.com" },
      action: "Accepted Offer"
    }
  },
  
  // JOB OFFER - Hired
  {
    _id: "candidate-16",
    name: "Ross Geller",
    email: "ross.geller@gmail.com",
    image: "https://i.pravatar.cc/150?img=17",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago
    currentStep: "Job Offer",
    status: "Hired",
    cvStatus: "Approved",
    jobFit: "Strong Fit",
    humanInterviewScheduled: true,
    humanInterviewCompleted: true,
    applicationStatus: "Hired",
    applicationMetadata: {
      updatedAt: Date.now(),
      updatedBy: { image: "https://i.pravatar.cc/150?img=20", name: "John Recruiter", email: "john@company.com" },
      action: "Hired"
    }
  }
];
