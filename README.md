# MedLaunch DNV Accreditation — Multi-Step Form

A fully functional multi-step accreditation quote request form built for the MedLaunch Frontend Developer Interview Assessment.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/medlaunch-form.git
cd medlaunch-form

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Other Scripts

```bash
npm run build     # Production build (output: /dist)
npm run preview   # Preview the production build locally
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 (JavaScript) | Specified in brief |
| Build tool | Vite 5 | Fast HMR, minimal config |
| Styling | Pure CSS (no frameworks) | Specified in brief — custom properties for theming |
| State management | React Context API + useState | Lightweight, no external dependency needed |
| Form validation | Custom `useValidation` hook | Keeps validation logic isolated and testable |
| Routing | None required | Single-page form, no URL-based routing needed |

---

## Project Structure

```
src/
├── components/         # Reusable UI primitives
│   ├── Field.jsx       # Field, Input, Select, Row, SectionTitle wrappers
│   ├── Field.css
│   ├── Header.jsx      # Top navigation bar with user name display
│   ├── Header.css
│   ├── Stepper.jsx     # Progress indicator (steps 1–6)
│   └── Stepper.css
├── context/
│   └── FormContext.jsx # Global form state and navigation (step, data, update, next, back, goTo)
├── hooks/
│   └── useValidation.js # Per-step validation logic and error state
├── steps/              # One component per form step
│   ├── StepDNVQuote.jsx
│   ├── StepFacilityDetails.jsx
│   ├── StepLeadershipContacts.jsx
│   ├── StepSiteInformation.jsx
│   ├── StepServicesCertifications.jsx
│   ├── StepReviewSubmit.jsx
│   └── Steps.css       # Shared step styles
├── App.jsx             # Form shell, footer navigation, support chat widget
├── App.css
├── index.css           # CSS custom properties / design tokens
└── main.jsx
```

---

## Development Approach

### Architecture

The form is driven by a single `FormContext` that holds all field data in a flat object (`initialData`) and exposes `update`, `next`, `back`, and `goTo` helpers. This means any step can read or write any field — important for the review step which needs data from all previous steps.

Validation is deliberately kept out of Context and in its own hook (`useValidation`). This makes it easy to test rules in isolation and keeps Context purely about data, not UI concerns.

### Step Design

Each step is a self-contained component that:
1. Reads from Context via `useForm()`
2. Calls `update({fieldName: value})` on every change
3. Receives `errors` and `clearError` props from the parent shell

This means steps never manage their own local state for controlled inputs — the single source of truth is always Context.

### Navigation & Validation

`handleNext` in `App.jsx` runs the current step's validation rules before calling `next()`. If any errors exist the step stays visible and error messages appear inline. The Back button skips validation intentionally (going backwards should never block the user).

On the final Review & Submit step, clicking "Submit Quote Request" calls `console.log('Form submitted:', data)` with the full payload as specified.

### Support Chat Widget

A bonus support chat widget lives in `App.jsx` as a floating action button. It uses local state only (no Context) since chat history doesn't need to persist across sessions or be included in form submission.

### Responsive Design

Media queries at `600px` handle the primary mobile breakpoint:
- The stepper collapses to a compact single-line layout
- The site selection cards stack to a single column
- Checkbox grids collapse from 2-column to 1-column
- The chat window uses `left: 12px; right: 12px` (full width) on mobile

---

## Assumptions Made

1. **No Figma access in isolation** — the UI was built to reflect a professional healthcare/accreditation product aesthetic (navy, white, clean card layouts) consistent with DNV branding conventions.
2. **Email verification is simulated** — no real email sending service is wired up. The "Send Verification" button transitions through `idle → sending → sent` states to demonstrate the UX pattern.
3. **File upload stored in state** — the uploaded File object is held in React state. In a real application it would be uploaded to a server or cloud storage on submission.
4. **Step 6 is review-only** — the submit action logs to console as specified. In production this would POST to an API endpoint.
5. **No routing** — the brief did not require URL-based navigation between steps. If deep-linking to a specific step were a requirement, React Router could be added with minimal refactoring.
6. **Single page, no auth** — user authentication and session persistence are out of scope for this assessment.

---

## Known Issues & Limitations

- **No real email verification** — the verify button is a UI simulation only.
- **File object not serialized in payload** — `data.uploadedFile` is a `File` object; a real submission would need to handle multipart form data or a pre-signed upload URL.
- **No accessibility audit tooling** — ARIA roles and labels have been added manually but the app has not been tested with a screen reader (NVDA/VoiceOver).
- **No unit tests** — given the 12–18 hour scope, tests were not included. The validation hook is structured to be easily unit-tested with Vitest.
- **IE/legacy browser support** — CSS custom properties and modern JS features are used throughout. No polyfills are included.
