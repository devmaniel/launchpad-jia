# Mock Data System

This folder contains mock data utilities for testing the CV upload and screening process when the API is down.

## How It Works

The mock system returns different CV data and screening results based on the uploaded file name.

## File Name Patterns

### ✅ Good Fit - `resumev1`
**File names containing "resumev1"** (e.g., `resumev1.pdf`, `john_resumev1.pdf`)

- **Profile**: Senior Full-Stack Developer with 8+ years of experience
- **Skills**: React, TypeScript, Node.js, Next.js, GraphQL, AWS, Docker, Kubernetes
- **Education**: Master's from Stanford, Bachelor's from MIT
- **Result**: **"For AI Interview"** - Application Status: **Ongoing**

### ⚠️ Maybe Fit - `resumev2`
**File names containing "resumev2"** (e.g., `resumev2.pdf`, `jane_resumev2.pdf`)

- **Profile**: Software Developer with 3 years of experience
- **Skills**: JavaScript, React, HTML/CSS, Basic Node.js
- **Education**: Bachelor's from University of Texas
- **Result**: **"For Review"** - Application Status: **Ongoing**

### ❌ Bad Fit - `resumev3`
**File names containing "resumev3"** (e.g., `resumev3.pdf`, `bob_resumev3.pdf`)

- **Profile**: Junior Developer with 1 year of experience
- **Skills**: HTML, CSS, Basic JavaScript, WordPress
- **Education**: Associate Degree from Community College
- **Result**: **"Not Qualified"** - Application Status: **Dropped**

## Usage Example

```typescript
import { getMockDataByFileName } from './mock/mockData';

// Upload a file named "resumev1.pdf"
const mockData = getMockDataByFileName("resumev1.pdf");

console.log(mockData.userCV); // Good Fit CV data
console.log(mockData.screeningResult); // { status: "For AI Interview", applicationStatus: "Ongoing" }
```

## Testing Workflow

1. **Upload a file** with one of the specific names (resumev1, resumev2, or resumev3)
2. **Wait 5 seconds** for the CV to be "built" (mock delay)
3. **Review the CV data** - it will match the profile for that file name
4. **Submit the CV** and answer pre-screening questions
5. **Wait 5 seconds** for screening results (mock delay)
6. **See the result** - it will match the expected outcome for that file name

## Default Behavior

If the file name doesn't contain any of the specific patterns, it defaults to the **Good Fit** scenario.

## File Extensions

The system automatically strips common file extensions (`.pdf`, `.doc`, `.docx`, `.txt`) and is case-insensitive, so these all work:
- `resumev1.pdf`
- `ResumeV1.PDF`
- `my_resumev1_final.pdf`
- `RESUMEV1.docx`
