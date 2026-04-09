# Roman Numeral Converter - Test Automation Report  

> Note: This essay was made by Juan Ramirez (alu.163243) and Pablo Villarte (alu.156336).

## 1. Introduction

This report summarizes the automated testing performed on the Roman Numeral Converter module, which includes the functions `integerToRoman`, `romanToInteger`, and `validateRomanStrict`. All test cases defined in the original tables were implemented in `test.js`, and the converter implementation in `romanConverter.js` passed 100% of them.

The objective was to ensure correctness across all valid and invalid partitions, verify boundary behavior, and confirm that structural and lexical rules for Roman numerals are enforced consistently in an automated manner.

---

## Test Suite Structure

The test suite is organized into clear functional categories that mirror the logical structure of the converter:

- **integerToRoman**
  - Valid inputs [1–3999]
  - Invalid inputs  
    - Out-of-range values  
    - Non-integer or non-numeric values  

- **romanToInteger**
  - Valid Roman numerals (canonical form)
  - Invalid Roman numerals  
    - Invalid repetitions  
    - Invalid subtractive pairs  
    - Invalid characters  
    - Empty or null input  

This grouping makes the suite easier to navigate and helps quickly identify which specific rule or partition a failing test belongs to. It also aligns the automated tests with the conceptual partitions defined during test-case design.

---

## Assertion Strategy

Each test case uses **two assertions**, and this is intentional and required by the design of the converter API.

The converter functions return structured results:

- For valid inputs: `{ ok: true, value: <result> }`
- For invalid inputs: `{ ok: false, error: <message> }`

Because the output is a **tuple of status + payload**, a single assertion is not sufficient. Each test must verify:

1. **The classification**  
   Whether the function correctly identifies the input as valid or invalid (`ok: true/false`).

2. **The payload**  
   Whether the returned value or error message matches the expected one.

These are not “two tests in one”; they are **two checks on a single result**, ensuring both correctness and clarity of error reporting. This is especially important because the converter distinguishes between different types of invalid inputs (e.g., invalid characters, illegal subtractive pairs, non-canonical forms).

---

## Conclusions

- All test cases from the original specification were implemented exactly as defined.
- The implementation in `romanConverter.js` passed all automated tests without modification.
- The two-assertion pattern is justified by the structured result format and ensures complete validation of both success/failure and the associated value or message.
- Grouping the tests into semantic subcategories improves readability, debugging efficiency, and long-term maintainability.

The converter behaves correctly across all defined partitions, including boundary values, canonical form validation, structural rule enforcement, and error handling.
