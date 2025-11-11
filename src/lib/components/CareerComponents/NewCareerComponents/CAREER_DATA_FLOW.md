# Career Form Data Flow Documentation

This document outlines the data collected at each stage of the career creation/editing process and the final structure posted to the database.

## Overview

The career form is a 5-step wizard that collects comprehensive job posting information:
1. **Career Details & Team Access**
2. **CV Review & Pre-screening**
3. **AI Interview Setup**
4. **Pipeline Stages**
5. **Review Career**

---

## Step 1: Career Details & Team Access

### Data Collected

#### Basic Job Information
| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `jobTitle` | string | ✅ Yes | "" | `sanitizeInput()` |
| `description` | string (HTML) | ✅ Yes | "" | `sanitizeHtml()` |
| `employmentType` | string | ✅ Yes | "" | `sanitizeText()` |

#### Work Setup & Location
| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `workSetup` | string | ✅ Yes | "" | `sanitizeText()` |
| `workSetupRemarks` | string | ❌ No | "" | `sanitizeInput()` |
| `country` | string | ✅ Yes | "Philippines" | `sanitizeText()` |
| `province` | string | ✅ Yes | "" | `sanitizeText()` |
| `location` (city) | string | ✅ Yes | "" | `sanitizeText()` |

#### Salary Information
| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `salaryNegotiable` | boolean | ❌ No | false | N/A |
| `minimumSalary` | number | ✅ Yes* | null | N/A |
| `maximumSalary` | number | ✅ Yes* | null | N/A |
| `minimumSalaryCurrency` | string | ❌ No | "PHP" | `sanitizeText()` |
| `maximumSalaryCurrency` | string | ❌ No | "PHP" | `sanitizeText()` |

*Required only if `salaryNegotiable` is `false`

#### Team Access
| Field | Type | Required | Structure | Sanitization |
|-------|------|----------|-----------|--------------|
| `teamMembers` | array | ✅ Yes (min 1 owner) | See below | Per field |

**Team Member Structure:**
```typescript
{
  name: string,           // sanitizeText()
  email: string,          // sanitizeText()
  role: string,           // sanitizeText()
  isOwner: boolean,       // N/A
  avatar?: string         // N/A
}
```

### Validation Rules
- At least one team member must have `isOwner: true`
- Job description must contain visible text (HTML tags stripped for validation)
- If salary is not negotiable, both min and max salary are required
- Minimum salary cannot exceed maximum salary

---

## Step 2: CV Review & Pre-screening

### Data Collected

#### CV Screening Settings
| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `screeningSetting` | string | ❌ No | "Good Fit and above" | `sanitizeText()` |
| `requireVideo` | boolean | ❌ No | false | N/A |
| `secretPrompt` | string (HTML) | ❌ No | "" | `sanitizeHtml()` |

#### Pre-screening Questions
| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `preScreeningQuestions` | array | ❌ No | [] | N/A |

**Pre-screening Question Structure:**
```typescript
{
  id: string,
  question: string,
  // Additional fields based on question type
}
```

#### Asking Salary (for candidates)
| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `askingMinSalary` | string | ❌ No | "" | N/A |
| `askingMaxSalary` | string | ❌ No | "" | N/A |
| `askingMinCurrency` | string | ❌ No | "PHP" | `sanitizeText()` |
| `askingMaxCurrency` | string | ❌ No | "PHP" | `sanitizeText()` |

#### Custom Questions
| Field | Type | Required | Structure | Sanitization |
|-------|------|----------|-----------|--------------|
| `customQuestions` | array | ❌ No | [] | Per field |

**Custom Question Structure:**
```typescript
{
  id: string,                    // N/A
  question: string,              // sanitizeInput()
  answerType: 'short_answer' | 'long_answer' | 'dropdown' | 'checkboxes' | 'range',
  options?: string[],            // Each option: sanitizeInput()
  minValue?: string,             // N/A
  maxValue?: string              // N/A
}
```

### Validation Rules
- All fields in this step are optional
- Step auto-completes when `screeningSetting` has a value

---

## Step 3: AI Interview Setup

### Data Collected

#### AI Interview Settings
| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `aiInterviewSecretPrompt` | string (HTML) | ❌ No | "" | `sanitizeHtml()` |
| `aiInterviewScreeningSetting` | string | ❌ No | "Good Fit and above" | `sanitizeText()` |
| `aiInterviewRequireVideo` | boolean | ❌ No | true | N/A |

#### AI Interview Questions
| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `aiInterviewQuestions` | array | ✅ Yes (min 5) | [] | N/A |

**AI Interview Question Structure:**
```typescript
{
  id: string,
  question: string,
  // Additional fields based on AI question configuration
}
```

### Validation Rules
- **Minimum 5 AI interview questions required** for publishing
- Questions are generated based on job details from Step 1

---

## Step 4: Pipeline Stages

### Data Collected

| Field | Type | Required | Default | Sanitization |
|-------|------|----------|---------|--------------|
| `pipelineStages` | array | ✅ Yes (4 core stages) | See below | Per field |

**Pipeline Stage Structure:**
```typescript
{
  icon: string,              // N/A
  title: string,             // sanitizeText()
  substages: string[],       // Each substage: sanitizeText()
  isCore: boolean            // N/A
}
```

### Default Pipeline Stages

1. **CV Screening** (Core)
   - Substages: ["Waiting Submission", "For Review"]

2. **AI Interview** (Core)
   - Substages: ["Waiting Interview", "For Review"]

3. **Final Human Interview** (Core)
   - Substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"]

4. **Job Offer** (Core)
   - Substages: ["For Final Interview", "Waiting Offer Acceptance", "For Contract Signing", "Hired"]

### Validation Rules
- All 4 core pipeline stages must exist
- Users can add custom stages beyond the core 4

---

## Step 5: Review Career

This step displays a summary of all collected data for review. No new data is collected here.

---

## Final Database Structure

When the career is saved (via `/api/add-career` or `/api/update-career`), the following object is posted:

### Complete Career Object

```typescript
{
  // System Fields (auto-generated)
  id: string,                    // GUID (add only)
  _id: ObjectId,                 // MongoDB ID (update only)
  orgID: string,                 // Organization ID
  createdAt: Date,               // Creation timestamp (add only)
  updatedAt: Date,               // Last update timestamp
  lastActivityAt: Date,          // Last activity timestamp
  status: "active" | "inactive", // Publication status
  
  // User Info
  createdBy: {                   // Add only
    image: string,
    name: string,
    email: string
  },
  lastEditedBy: {
    image: string,
    name: string,
    email: string
  },
  
  // Step 1: Career Details & Team Access
  jobTitle: string,              // sanitizeInput()
  description: string,           // sanitizeHtml()
  employmentType: string,        // sanitizeText()
  workSetup: string,             // sanitizeText()
  workSetupRemarks: string,      // sanitizeInput()
  country: string,               // sanitizeText()
  province: string,              // sanitizeText()
  location: string,              // sanitizeText() (city)
  salaryNegotiable: boolean,
  minimumSalary: number | null,
  maximumSalary: number | null,
  minimumSalaryCurrency: string, // sanitizeText()
  maximumSalaryCurrency: string, // sanitizeText()
  teamMembers: [
    {
      name: string,              // sanitizeText()
      email: string,             // sanitizeText()
      role: string,              // sanitizeText()
      isOwner: boolean,
      avatar?: string
    }
  ],
  
  // Step 2: CV Review & Pre-screening
  screeningSetting: string,      // sanitizeText()
  requireVideo: boolean,
  secretPrompt: string,          // sanitizeHtml()
  preScreeningQuestions: any[],
  customQuestions: [
    {
      id: string,
      question: string,          // sanitizeInput()
      answerType: string,
      options?: string[],        // Each: sanitizeInput()
      minValue?: string,
      maxValue?: string
    }
  ],
  askingMinSalary: string,
  askingMaxSalary: string,
  askingMinCurrency: string,     // sanitizeText()
  askingMaxCurrency: string,     // sanitizeText()
  
  // Step 3: AI Interview Setup
  aiInterviewSecretPrompt: string,        // sanitizeHtml()
  aiInterviewScreeningSetting: string,    // sanitizeText()
  aiInterviewRequireVideo: boolean,
  aiInterviewQuestions: any[],
  
  // Step 4: Pipeline Stages
  pipelineStages: [
    {
      icon: string,
      title: string,             // sanitizeText()
      substages: string[],       // Each: sanitizeText()
      isCore: boolean
    }
  ],
  
  // Legacy field (may be deprecated)
  questions: any
}
```

---

## API Endpoints

### POST `/api/add-career`
Creates a new career posting.

**Required Fields:**
- `jobTitle`
- `description`
- `location` (city)
- `workSetup`

**Validation:**
- Organization must exist
- Plan limits are checked (if applicable)
- When status is "active", all required fields must be valid

### POST `/api/update-career`
Updates an existing career posting.

**Required Fields:**
- `_id` (career ID)
- `jobTitle`
- `description`
- `location` (city)
- `workSetup`

**Validation:**
- Career must exist
- Same validation rules as add-career

---

## Security: XSS Prevention

All user-provided text fields are sanitized before being stored in the database using three sanitization functions:

1. **`sanitizeInput()`** - For plain text fields
   - Job title, work setup remarks, custom question text and options

2. **`sanitizeHtml()`** - For rich text fields
   - Job description, secret prompts (CV and AI interview)

3. **`sanitizeText()`** - For structured data
   - Location, work setup, currencies, team member info, pipeline stages

### Defense-in-Depth Strategy
- **Client-side sanitization** in `CareerFormV2.tsx` (first line of defense)
- **Server-side sanitization** in API routes (prevents direct API exploitation)
- **DOMPurify library** for whitelist-based HTML sanitization
- **HTML entity escaping** to prevent tag injection

---

## Validation Summary

### For Publishing (status: "active")
All of the following must be valid:
- ✅ Job title
- ✅ Job description (with visible text)
- ✅ Employment type
- ✅ Work setup
- ✅ Province and city
- ✅ Salary (if not negotiable)
- ✅ At least 1 Job Owner in team
- ✅ Minimum 5 AI interview questions
- ✅ All 4 core pipeline stages

### For Drafts (status: "inactive")
Only basic validation:
- ✅ Job title

---

## Session Storage

The form uses session storage to preserve user input:
- **Key format:** `careerFormV2:${careerId}` or `careerFormV2:new`
- **Cleared on:** Page unload, successful save, or manual clear
- **Change tracking:** Warns users before leaving with unsaved changes

---

## Notes

- All numeric salary fields are stored as numbers (or null if not provided)
- Asking salary fields are stored as strings
- Boolean fields default to `false` unless explicitly set
- Arrays default to empty arrays `[]` if not provided
- The form supports both "add" and "edit" modes
- Step progress is tracked individually (0-1 scale per step)
- Validation errors are shown per-step and per-field
