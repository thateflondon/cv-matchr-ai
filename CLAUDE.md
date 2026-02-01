# CV Matchr - Project Guide

## Overview
CV Matchr is a full-stack resume builder and analyzer. Users can upload resumes for AI-powered feedback or build new resumes from scratch with customizable templates.

## Tech Stack
- **Framework**: React Router 7 (SSR enabled) + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Backend**: Puter.js (auth, file storage, AI, KV store)
- **PDF/Export**: jsPDF, html2canvas, docx
- **Testing**: Vitest + React Testing Library

## Project Structure
```
app/
├── routes/              # Page routes (file-based routing)
├── components/
│   ├── cv-builder/      # CV builder feature
│   │   ├── templates/   # 8 CV templates (Helsinki, Seoul, Paris, etc.)
│   │   ├── customize/   # Layout, colors, text panels
│   │   └── sections/    # Editable CV sections
│   ├── dashboard/       # Dashboard tabs
│   └── common/          # Shared components (RichTextEditor, FormInput)
├── lib/
│   ├── puter.ts         # Zustand store (auth, fs, ai, kv)
│   └── storage.ts       # Unified storage interface
├── utils/               # Domain utilities (export, validation, AI)
├── types/
│   └── cv-builder.ts    # CV data structures
└── constants/
    └── templates.ts     # Template definitions
```

## Key Files
| File | Purpose |
|------|---------|
| `app/lib/puter.ts:114-480` | Main Zustand store with namespaced state |
| `app/lib/storage.ts` | Hybrid localStorage + Puter KV interface |
| `app/types/cv-builder.ts` | CVData, CVCustomization types |
| `app/components/cv-builder/templates/TemplateRenderer.tsx` | Template factory |
| `app/utils/pdfExport.ts` | PDF generation pipeline |
| `app/utils/formValidation.ts` | Input sanitization & validation |

## Commands
```bash
# Development
npm run dev              # Start dev server with HMR
npm run typecheck        # Type check + generate routes

# Production
npm run build            # Build for production
npm run start            # Serve production build

# Testing
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:coverage    # Generate coverage report
```

## Routes
| Route | File | Purpose |
|-------|------|---------|
| `/` | `routes/_index.tsx` | Landing page |
| `/upload` | `routes/upload.tsx` | Resume upload |
| `/dashboard/:tab?` | `routes/dashboard.tsx` | User dashboard (auth required) |
| `/resume/:id` | `routes/resume.tsx` | Resume analysis view |

## Data Flow
1. **CV Editing**: User edits → auto-save to localStorage → manual save syncs to Puter KV
2. **Resume Analysis**: Upload PDF → AI extracts text → AI generates feedback → store in KV
3. **Export**: DOM → html2canvas → jsPDF → download

## Storage Keys
- `cv_builder_{id}_data` / `cv_builder_{id}_customization` - localStorage drafts
- `cv_matchr_resume_{id}` - Puter KV for builder resumes
- `resume:{uuid}` - Puter KV for analyzed resumes

## External Dependencies
- **Puter.js**: Injected via script tag in `root.tsx:53`. Provides auth, file storage, AI chat, and KV store.
- **Google Fonts**: 10 fonts loaded via CDN in `root.tsx:16-26`

## Testing Setup
- Vitest with JSDOM environment
- Mocks for localStorage, matchMedia, ResizeObserver in `tests/setup.ts`
- Use `@testing-library/react` for component tests

## Common Tasks

### Adding a New Template
1. Create component in `app/components/cv-builder/templates/`
2. Add to switch in `TemplateRenderer.tsx:22-59`
3. Add metadata to `app/constants/templates.ts`

### Adding a CV Section
1. Create component in `app/components/cv-builder/sections/`
2. Add to `EditMode.tsx` steps array
3. Update `CVData` type in `app/types/cv-builder.ts`

### Modifying Storage
- Local operations: `app/utils/cvStorage.ts`
- Cloud operations: `app/utils/puterCVStorage.ts`
- Unified interface: `app/lib/storage.ts`

---

## Additional Documentation

Check these files for detailed guidance:

| Topic | File |
|-------|------|
| Architectural patterns & conventions | `.claude/docs/architectural_patterns.md` |