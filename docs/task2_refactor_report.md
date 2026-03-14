# Roman Numeral Converter – Refactor Report

> Note: This refactor was carried out collaboratively by Juan Ramírez (alu.163243) and Pablo Villarte (alu.156336) using pair programming and shared code reviews.

## 1. Introduction

The objective of this task was to refactor the Roman numeral converter created in Task 1.  
The goal was not to add new features, but to improve the internal structure, readability, and maintainability of the code using refactoring techniques studied in class.  
All changes were reviewed in pairs, and Git was used to track the evolution of the codebase.

---

## 2. Initial Situation

Before the refactor, the project consisted of:

- `index.html`
- `styles.css`
- `app.js` (UI + logic mixed together)
- `romanConverter.js` (large, monolithic logic)

Although the system worked correctly, the structure made it harder to maintain, test, or extend.  
Functions were long, responsibilities were mixed, and some logic was duplicated.

---

## 3. Refactoring Summary

The refactor focused on reorganizing the code into smaller, clearer units while keeping the behaviour identical.

### Main improvements

- **Separation of concerns:**  
  UI logic and conversion logic were fully separated.

- **File modularization:**  
  The converter was split into:
  - `romanConstants.js`
  - `romanUtils.js`
  - `romanConverter.js`
  - `app.js`

- **Helper extraction:**  
  Repeated or complex logic was extracted into helpers such as:
  - `Ok` / `Err`
  - `normalizeUpper`
  - `updateRepeatCount`
  - `$` DOM lookup helper

- **Improved naming and structure:**  
  Functions were renamed for clarity, and large methods were broken into smaller ones.

- **Centralized error messages:**  
  All error strings were grouped in a single place for consistency.

- **Browser-friendly architecture:**  
  To keep the project runnable by simply opening `index.html`, the final version uses classic `<script>` tags instead of ES modules.

The final result is a cleaner, more maintainable codebase that preserves the simplicity of the original project.

---

## 4. Tools and Prompts Used

The refactor was performed using:

- **Git** for version control  
- **Pair programming** sessions (screen sharing, joint reviews)  
- **ChatGPT / Copilot** for code-review-oriented prompts

### Relevant prompts used during the refactor

- "check for code smells in the following files"
- "extract this into a helper"
- "improve naming"
- "separate UI and logic"
- "split the converter into multiple files"
- "simplify this function"

These prompts were used to guide the restructuring, but all decisions were reviewed manually by both developers.

---

## 5. Commit Summary

The refactor was done incrementally. Some representative commits include:

- `refactor: extract resetForm helper in UI`
- `refactor: introduce $ helper for DOM lookups in UI`
- `refactor: extract updateRepeatCount helper in validateStructure`
- `refactor: improve naming consistency in converter module`
- `refactor: centralize converter error messages`
- `refactor: extract shared string normalization helper`
- `refactor: introduce Ok/Err helpers and replace inline result objects`
- `refactor: reorganized methods order (main ones first, helpers late)`
- `refactor: validateRomanStrict big method refactored in several smaller ones`
- `Separate UI and logic in two different files.`
- `Organized src and docs in different folders`

---

## 6. Conclusion

The refactor improved the clarity, structure, and maintainability of the Roman numeral converter without altering its functionality.  
The codebase is now easier to understand, extend, and review, and it remains fully compatible with simple browser execution.
