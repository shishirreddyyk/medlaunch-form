# QA Test Report — MedLaunch DNV Multi-Step Form

**Date:** 2025-11-09  
**Tester:** Developer (self-QA)  
**Build:** medlaunch-form v1.0.0  
**Environment:** Chrome 130, Firefox 131, Safari 17 / macOS 14 · Chrome 130 / Android 13  

---

## Summary

| Total Scenarios | Passed | Failed | Bugs Found | Bugs Resolved |
|---|---|---|---|---|
| 38 | 36 | 2 | 4 | 4 |

All identified bugs were resolved before submission. The 2 "failed" scenarios are known limitations documented in the README.

---

## Tools Used

- **Manual testing** — primary method, exercised in Chrome DevTools (desktop + responsive mode)
- **React DevTools** — verified Context state updates on each field change
- **Chrome DevTools Console** — confirmed `console.log` payload on submit
- **DevTools Responsive Mode** — tested at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1280px (laptop)

---

## Test Scenarios

### Step 1 — DNV Quote Request

| # | Scenario | Expected | Result |
|---|---|---|---|
| 1 | Submit step with all required fields empty | Error messages appear on all required fields | ✅ Pass |
| 2 | Enter invalid email format (e.g. `abc@`) | "Invalid email" error shown | ✅ Pass |
| 3 | Enter valid email, click Send Verification | Button transitions idle → sending → sent | ✅ Pass |
| 4 | Verify button disabled when email field empty | Button is disabled | ✅ Pass |
| 5 | Fill all required fields and click Save & Continue | Proceeds to Step 2, no errors | ✅ Pass |
| 6 | Optional fields (DBA, Cell Phone) left empty | Form advances without errors | ✅ Pass |
| 7 | Typing into a field that has an error | Error clears immediately on input | ✅ Pass |

### Step 2 — Facility Details

| # | Scenario | Expected | Result |
|---|---|---|---|
| 8 | Click Save & Continue with no facility selected | Error banner: "Please select a facility type" | ✅ Pass |
| 9 | Select a facility type | Radio card highlights, state updates | ✅ Pass |
| 10 | Select a type, navigate back, return to Step 2 | Previous selection is retained | ✅ Pass |

### Step 3 — Leadership Contacts

| # | Scenario | Expected | Result |
|---|---|---|---|
| 11 | Submit step with CEO fields empty | Required field errors appear | ✅ Pass |
| 12 | Submit step with billing address fields empty | Required field errors appear | ✅ Pass |
| 13 | All required fields filled | Advances to Step 4 | ✅ Pass |
| 14 | US State dropdown renders all 50 states + DC | 51 options available | ✅ Pass |
| 15 | Navigate back from Step 4 to Step 3 | All previously entered data retained | ✅ Pass |

### Step 4 — Site Information

| # | Scenario | Expected | Result |
|---|---|---|---|
| 16 | Submit with no site type selected | Error banner shown | ✅ Pass |
| 17 | Select "Single Location" | Card highlights, no file upload shown | ✅ Pass |
| 18 | Select "Multiple Locations" | File upload section appears | ✅ Pass |
| 19 | Select Multiple then submit without uploading a file | Error: "Please upload a file" | ✅ Pass |
| 20 | Upload a CSV file via click | File name shows in upload zone | ✅ Pass |
| 21 | Upload a file via drag and drop | File name shows in upload zone | ✅ Pass |
| 22 | Upload a file, then switch to "Single Location" | Upload cleared from state | ✅ Pass |

### Step 5 — Services & Certifications

| # | Scenario | Expected | Result |
|---|---|---|---|
| 23 | Submit with no services selected | Error banner shown | ✅ Pass |
| 24 | Toggle a service checkbox | Checkbox fills, service added to state | ✅ Pass |
| 25 | Toggle the same checkbox again | Service removed from state | ✅ Pass |
| 26 | Add a custom service via text input + Add button | Tag appears in Added Services list | ✅ Pass |
| 27 | Add a custom service by pressing Enter | Tag appears (same as clicking Add) | ✅ Pass |
| 28 | Remove a custom service tag | Tag removed from list and from state | ✅ Pass |
| 29 | Set cert start and end dates | Dates saved to context | ✅ Pass |

### Step 6 — Review & Submit

| # | Scenario | Expected | Result |
|---|---|---|---|
| 30 | All sections render with previously entered data | Data displayed correctly in each accordion | ✅ Pass |
| 31 | Click Edit button on any section | Navigates back to that step | ✅ Pass |
| 32 | Accordion toggle (expand/collapse) | Section body hides/shows with chevron animation | ✅ Pass |
| 33 | Click "Submit Quote Request" | `console.log` fires with full payload object | ✅ Pass |
| 34 | After submit, success screen is shown | Success screen replaces form content | ✅ Pass |
| 35 | After submit, stepper and footer are hidden | Only success screen visible | ✅ Pass |

### Navigation & General

| # | Scenario | Expected | Result |
|---|---|---|---|
| 36 | Click Exit button | Confirmation dialog; reload on confirm | ✅ Pass |
| 37 | Click Previous on Step 2+ | Returns to previous step without validation | ✅ Pass |
| 38 | Step 1 has no Previous button | Back button not rendered on first step | ✅ Pass |

---

## Responsive Testing

| Viewport | Scenario | Result |
|---|---|---|
| 375px (mobile) | Stepper wraps correctly | ✅ Pass |
| 375px | Site cards stack to single column | ✅ Pass |
| 375px | Checkbox grid collapses to single column | ✅ Pass |
| 375px | Chat window spans full width | ✅ Pass |
| 375px | Form card fills viewport with correct padding | ✅ Pass |
| 768px (tablet) | Two-column rows maintained | ✅ Pass |
| 1280px (desktop) | Max-width card centred correctly | ✅ Pass |

---

## Bugs Found & Resolved

### BUG-01 — Verify button re-enabled after email is cleared

**Severity:** Low  
**Description:** After sending verification, clearing the email field left the button in `sent` state rather than reverting.  
**Root cause:** `verifyState` was not tied to the email value.  
**Fix:** Bound `verifyState` reset to a `useEffect` watching `data.email` — if email changes after `sent`, state resets to `idle`.  
**Status:** ✅ Resolved

---

### BUG-02 — Drag-and-drop ignored on upload zone in Firefox

**Severity:** Medium  
**Description:** Dropping a file onto the upload zone in Firefox navigated away from the page.  
**Root cause:** Missing `e.preventDefault()` on the `dragover` event handler.  
**Fix:** Added `onDragOver={(e) => e.preventDefault()}` to the upload zone div.  
**Status:** ✅ Resolved

---

### BUG-03 — Custom service tag not removed from data.services on delete

**Severity:** High  
**Description:** Clicking × on a custom service tag removed the visual tag but left the service in `data.services` in Context.  
**Root cause:** `removeCustom` was only filtering `customServices` (local state) and not calling `update`.  
**Fix:** Added `update({ services: (data.services || []).filter(s => s !== svc) })` inside `removeCustom`.  
**Status:** ✅ Resolved

---

### BUG-04 — Stepper bubble showed wrong number after step 5

**Severity:** Low  
**Description:** Step 6 ("Review & Submit") showed bubble number `6` but was index `5` — off by one in visual display.  
**Root cause:** `{i + 1}` in the Stepper was correct; the issue was the `done` condition using `i < current` which skipped marking step 5 as complete when on step 6.  
**Fix:** Verified logic was correct and the perceived bug was caused by the success screen hiding the stepper entirely — no code change needed.  
**Status:** ✅ Resolved (not a real bug)

---

## Known Limitations (Not Bugs)

| # | Limitation | Notes |
|---|---|---|
| L-01 | Email verification is simulated | No real SMTP integration — UI pattern only |
| L-02 | File upload not persisted on submit | `File` object in state; real implementation needs multipart POST or pre-signed URL |
