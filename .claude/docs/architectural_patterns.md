# Architectural Patterns & Conventions

This document describes recurring patterns and design decisions used throughout the codebase.

## State Management: Zustand with Namespaces

The app uses a single Zustand store with logically grouped namespaces.

**Location**: `app/lib/puter.ts:114-480`

```
usePuterStore = {
  // Global state
  isLoading, error, puterReady,

  // Namespaced functionality
  auth: { user, isAuthenticated, signIn, signOut, ... },
  fs: { write, read, upload, delete },
  ai: { chat, img2txt, feedback },
  kv: { get, set, delete, list },

  // Initialization
  init,
}
```

**Usage pattern**:
```typescript
const { auth, ai, kv } = usePuterStore();
```

**Conventions**:
- Check `puterReady` before operations: `app/lib/puter.ts:155`
- Actions update `isLoading` and `error` states
- Namespace methods are async and return success/failure

---

## Hybrid Storage Strategy

Data persists in both localStorage (offline-first) and Puter KV (cloud sync).

**Files**:
- `app/lib/storage.ts` - Unified interface
- `app/utils/cvStorage.ts` - localStorage operations
- `app/utils/puterCVStorage.ts` - Puter KV operations

**Pattern**:
1. Auto-save drafts to localStorage on every change
2. Manual save syncs to Puter KV
3. On load: check cloud first, fall back to localStorage, use newer version

**Key prefixes**:
- `cv_builder_{id}_data` / `cv_builder_{id}_customization` - local drafts
- `cv_matchr_resume_{id}` - cloud builder resumes
- `resume:{uuid}` - cloud analyzed resumes

---

## Template Factory Pattern

CV templates are rendered via a factory/switch pattern.

**Location**: `app/components/cv-builder/templates/TemplateRenderer.tsx:22-59`

```typescript
switch (customization.template.id) {
  case "template-helsinki": return <HelsinkiTemplate ... />;
  case "template-seoul": return <SeoulTemplate ... />;
  // ... more templates
  default: return <BaseTemplate ... />;
}
```

**Template interface**: All templates receive `(data: CVData, customization: CVCustomization)` props.

**Adding a template**:
1. Create component extending the pattern in existing templates
2. Add case to `TemplateRenderer.tsx`
3. Register metadata in `app/constants/templates.ts`

---

## Section-Based Form Architecture

The CV editor uses a multi-step form with discrete section components.

**Location**: `app/components/cv-builder/EditMode.tsx:15-90`

**Pattern**:
- Each section is a standalone component in `app/components/cv-builder/sections/`
- Sections receive `(data, onUpdate, customization)` props
- Parent manages which section is active via step index
- Navigation: Previous/Next buttons + direct step selection

**Section components**:
- `PersonalDetailsSection.tsx`
- `ProfessionalSummarySection.tsx`
- `ProfessionalExperienceSection.tsx`
- `EducationSection.tsx`
- `SkillsSection.tsx`
- `LanguagesSection.tsx`
- `WebsitesAndSocialLinksSection.tsx`

---

## Input Sanitization Pattern

All user inputs pass through sanitization before storage.

**Location**: `app/utils/formValidation.ts`

**Functions**:
- `sanitizeInput(value)` - XSS prevention, strips dangerous characters
- `validateEmail()`, `validatePhone()`, `validateURL()` - format validation
- `validateDate()`, `validateDateRange()` - date validation
- `validateRequired()`, `validateLength()` - general validation

**Usage**: `app/components/cv-builder/sections/PersonalDetailsSection.tsx:25-36`
```typescript
const handleChange = (field: string, value: string) => {
  const sanitizedValue = sanitizeInput(value);
  onUpdate({ ...data, personalDetails: { ...data.personalDetails, [field]: sanitizedValue } });
};
```

---

## PDF Export Pipeline

Export uses html2canvas to render DOM to canvas, then jsPDF for PDF creation.

**Location**: `app/utils/pdfExport.ts:15-80`

**Pipeline**:
```
DOM Element (CV Preview)
    ↓
Clone element (prevent mutation)
    ↓
Render via html2canvas (A4: 952×1346px at 96 DPI)
    ↓
Convert to PDF via jsPDF
    ↓
Download
```

**Constants**:
- `A4_WIDTH_PX`: 952
- `A4_HEIGHT_PX`: 1346
- Canvas scale: 2x for quality

---

## Responsive A4 Preview

The CV preview scales dynamically to fit container width while maintaining A4 proportions.

**Location**: `app/components/cv-builder/CVPreview.tsx:41-58`

**Scaling rules**:
- Desktop (≥1024px): 1:1 scale
- Tablet (768-1023px): fit to width
- Mobile (<768px): fit with padding
- Range: 50% - 200%

---

## Route Authentication Pattern

Protected routes redirect unauthenticated users to login.

**Location**: `app/routes/dashboard.tsx:52-56`

```typescript
useEffect(() => {
  if (!isLoading && !auth.isAuthenticated) {
    navigate("/?next=/dashboard/myresumes");
  }
}, [isLoading, auth.isAuthenticated, navigate]);
```

**Convention**: Pass `?next=` param to redirect back after auth.

---

## Puter SDK Access Pattern

Puter.js is accessed via window global with null-safety.

**Location**: `app/lib/puter.ts:48-52`

```typescript
const getPuter = () => window.puter ?? null;

// Usage
const puter = getPuter();
if (!puter) throw new Error("Puter not available");
```

**Initialization**: `app/root.tsx:35-39` calls `init()` on mount.

---

## Error Handling Conventions

### Async Operations
**Location**: `app/lib/puter.ts:176-181`

```typescript
try {
  // Operation
} catch (err) {
  const msg = err instanceof Error ? err.message : "Operation failed";
  setError(msg);
  return false;
}
```

### Storage Operations
**Location**: `app/utils/cvStorage.ts:18-20`

```typescript
try {
  localStorage.setItem(key, JSON.stringify(data));
} catch (error) {
  console.error("Failed to save CV data:", error);
}
```

### UI Boundaries
**Location**: `app/components/common/ErrorBoundary.tsx`

Wraps template rendering to catch and display errors gracefully.

---

## AI Integration Pattern

AI features use context-building functions to create structured prompts.

**Location**: `app/utils/aiWriter.ts:54-79`

```typescript
export async function generateProfessionalSummary(aiChat, cvData) {
  const context = buildContextFromCV(cvData);  // Build context
  const prompt = `[ATS-friendly instructions...]`;
  // Call Puter AI
}
```

**AI Model**: Uses Puter AI's chat interface (gpt-5.2 or Claude 3.7 Sonnet).

---

## Type Definitions

### Core CV Types
**Location**: `app/types/cv-builder.ts:1-207`

Key interfaces:
- `CVData` - Complete CV content
- `CVCustomization` - Template, colors, fonts, spacing
- `CVPersonalDetails`, `CVProfessionalExperience`, `CVEducation`

### Global Types
**Location**: `types/index.d.ts:1-67`

Key interfaces:
- `Resume` - Uploaded resume with feedback
- `Feedback` - AI analysis scores and tips
- `Job` - Job listing data

---

## Component Props Convention

Section components follow a consistent props interface:

```typescript
interface SectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  customization: CVCustomization;
}
```

Template components:
```typescript
interface TemplateProps {
  data: CVData;
  customization: CVCustomization;
}
```

---

## CSS Conventions

### Tailwind Theme Variables
**Location**: `app/app.css:1-100`

```css
--font-sans: "Mona Sans", ui-sans-serif, system-ui
--color-dark-200: #475467
--color-badge-green: #d5faf1
--color-badge-red: #f9e3e2
```

### Component Classes
- `.app-container` - Main layout
- `.primary-button` - CTA buttons
- `.text-gradient` - Gradient text effect
- `.gradient-border` - Gradient border box