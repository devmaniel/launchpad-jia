# UploadCV - Refactored Component

A modern, maintainable refactor of the CV upload and screening component with improved architecture, TypeScript support, and better separation of concerns.

## 📁 Structure

```
UploadCV-Refactored/
├── index.tsx                          # Main export
├── UploadCV.tsx                       # Main container component
├── README.md                          # This file
├── components/                        # Sub-components
│   ├── CVHeader.tsx                   # Job application header
│   ├── ProgressSteps.tsx              # Step indicator
│   ├── CVUploadOptions.tsx            # Upload/Review options
│   ├── CVBuildingLoader.tsx           # CV processing loader
│   ├── CVDetailsForm.tsx              # CV sections editor
│   ├── CVSectionCard.tsx              # Individual CV section
│   ├── CVScreeningLoader.tsx          # Screening animation
│   └── CVResultDisplay.tsx            # Result screens
├── hooks/                             # Custom hooks
│   ├── useUploadCV.ts                 # Main state management
│   ├── useCVSubmission.ts             # File upload & processing
│   └── useCVScreening.ts              # CV screening logic
├── types/                             # TypeScript definitions
│   └── index.ts                       # All type definitions
├── constants/                         # Constants
│   └── index.ts                       # CV sections, steps, etc.
├── utils/                             # Utilities
│   └── cvHelpers.ts                   # CV-specific helpers
└── styles/                            # SCSS modules
    ├── UploadCV.module.scss           # Main styles
    └── components/                     # Component styles
        ├── CVHeader.module.scss
        ├── ProgressSteps.module.scss
        ├── CVUploadOptions.module.scss
        ├── CVBuildingLoader.module.scss
        ├── CVDetailsForm.module.scss
        ├── CVSectionCard.module.scss
        ├── CVScreeningLoader.module.scss
        └── CVResultDisplay.module.scss
```

## 🎯 Key Improvements

### 1. **Component Decomposition**
- **Before:** Single 698-line monolithic component
- **After:** 8 focused sub-components (~50-120 lines each)

### 2. **Custom Hooks**
- `useUploadCV` - Centralized state management
- `useCVSubmission` - File upload and digitalization
- `useCVScreening` - CV screening process

### 3. **TypeScript Support**
- Full type definitions for all data structures
- Type-safe props and state management
- Better IDE autocomplete and error detection

### 4. **Better Code Organization**
- Separated concerns (UI, logic, types, constants)
- Reusable utility functions
- Modular SCSS with component-specific styles

### 5. **Improved Maintainability**
- Clear file structure
- Single Responsibility Principle
- Easier to test and debug
- Better code documentation

## 🚀 Usage

### Basic Import
```tsx
import UploadCV from "@/lib/components/UploadCV-Refactored";

export default function Page() {
  return <UploadCV />;
}
```

### With Types
```tsx
import { UploadCV, type Interview, type UserCV } from "@/lib/components/UploadCV-Refactored";
```

## 📦 Components

### CVHeader
Displays job application information with organization logo and job title.

**Props:**
- `interview: Interview` - Interview data
- `onViewJobDescription: () => void` - Handler for viewing job description

### ProgressSteps
Visual step indicator showing current progress in the CV upload process.

**Props:**
- `currentStep: StepType | null` - Current step
- `userCV: UserCV | null` - User CV data
- `buildingCV: boolean` - Whether CV is being built

### CVUploadOptions
Initial screen with options to upload new CV or review existing one.

**Props:**
- `hasDigitalCV: boolean` - Whether user has existing CV
- `onFileSelected: (file: File) => void` - File selection handler
- `onReviewCV: () => void` - Review CV handler

### CVBuildingLoader
Loading animation shown while CV is being processed.

**Props:**
- `file: FileInfo` - File information

### CVDetailsForm
Form for editing all CV sections with file management.

**Props:**
- `userCV: UserCV` - User CV data
- `file: File | null` - Uploaded file
- `editingCV: string | null` - Currently editing section
- `onEditSection: (section: string | null) => void` - Edit handler
- `onUpdateCV: (updatedCV: UserCV) => void` - Update handler
- `onFileSelected: (file: File) => void` - File selection handler
- `onRemoveFile: () => void` - File removal handler
- `onSubmit: () => void` - Submit handler
- `onMarkChanges: () => void` - Mark changes handler

### CVSectionCard
Individual CV section with edit capability.

**Props:**
- `section: string` - Section name
- `content: string` - Section content
- `isEditing: boolean` - Edit state
- `onEdit: () => void` - Edit handler
- `onSave: () => void` - Save handler
- `onChange: (value: string) => void` - Change handler

### CVScreeningLoader
Loading animation during CV screening process.

**Props:** None

### CVResultDisplay
Displays screening results (accepted, rejected, or under review).

**Props:**
- `screeningResult: ScreeningResult` - Screening result data
- `interviewID: string` - Interview ID

## 🔧 Custom Hooks

### useUploadCV
Main state management hook for the entire CV upload flow.

**Returns:**
- State variables (buildingCV, currentStep, etc.)
- State setters
- Event handlers

### useCVSubmission
Handles file upload and CV digitalization.

**Parameters:**
- `userEmail: string` - User email
- `onSuccess: (digitalCV: string, userCV: UserCV) => void` - Success callback
- `onError: (error: string) => void` - Error callback

**Returns:**
- `isProcessing: boolean` - Processing state
- `submitFile: (file: File) => Promise<void>` - Submit function

### useCVScreening
Handles CV screening against job requirements.

**Parameters:**
- `interviewID: string` - Interview ID
- `userEmail: string` - User email
- `userName: string` - User name
- `onSuccess: (result: ScreeningResult) => void` - Success callback
- `onError: (error: string) => void` - Error callback

**Returns:**
- `isScreening: boolean` - Screening state
- `screenCV: (...) => Promise<boolean>` - Screen function

## 📝 Type Definitions

See `types/index.ts` for complete type definitions:
- `Interview` - Interview data structure
- `FileInfo` - File information
- `CVSection` - CV section structure
- `DigitalCV` - Digital CV format
- `UserCV` - User CV object
- `ScreeningResult` - Screening result
- `CVData` - CV data for API
- `StepType` - Step types
- `StepStatus` - Step status types
- `UploadCVState` - Complete state structure

## 🎨 Styling

All styles use SCSS modules with CSS custom properties for theming:
- `--Text-text-primary` - Primary text color
- `--Text-text-secondary` - Secondary text color
- `--Text-text-tertiary` - Tertiary text color
- `--Border-primary` - Primary border color
- `--Surface-white` - White surface color
- `--Button-bg-secondary` - Secondary button background

## 🔄 Migration from Original

To migrate from the original UploadCV component:

1. **Update imports:**
   ```tsx
   // Before
   import UploadCV from "@/lib/components/screens/UploadCV";
   
   // After
   import UploadCV from "@/lib/components/UploadCV-Refactored";
   ```

2. **No prop changes required** - The refactored component maintains the same external API

3. **Test thoroughly** - Verify all functionality works as expected

## 🧪 Testing Checklist

- [ ] File upload (drag & drop)
- [ ] File upload (button click)
- [ ] File validation (size, type)
- [ ] CV digitalization
- [ ] CV section editing
- [ ] CV section saving
- [ ] File removal
- [ ] Review existing CV
- [ ] CV screening
- [ ] Result display (all scenarios)
- [ ] Navigation to dashboard
- [ ] Navigation to interview
- [ ] Mobile responsiveness
- [ ] Error handling

## 📚 Dependencies

- `react` - UI framework
- `react-markdown` - Markdown rendering
- `axios` - HTTP client
- `sass` - CSS preprocessor
- `@/lib/context/ContextV2` - App context
- `@/lib/utils/constantsV2` - Constants
- `@/lib/utils/helpersV2` - Helper functions
- `@/lib/Utils` - Core utilities
- `@/lib/components/commonV2/Loader` - Loader component

## 🐛 Known Issues

None currently. Report issues to the development team.

## 📄 License

Internal use only - Part of Launchpad Jia project.
