# Roman Numeral Converter - Test Cases Definition

> Note: This essay was made by Juan Ramirez (alu.163243) and Pablo Villarte (alu.156336).

## 1. Introduction  

The goal of this task is to define two sets of functional test cases for the Roman numeral converter developed in previous tasks.  
The assignment requires:

- A first set of test cases manually designed by us, covering the function that converts integers to Roman numerals.
- A second set of test cases created with the help of an AI system, covering the function that converts Roman numerals to integers.

Both sets aim to verify correctness, robustness, and proper handling of invalid inputs.  
The report explains the methodology used for the manual suite, the prompts used for the AI-assisted suite, and a comparison between both approaches.

---

## 2. Methodology for Manual Test Case Design (Set A)

To design the manual test suite for the *integer → Roman* function, we applied the systematic black-box testing techniques studied in Unit 3.5. These techniques help avoid the trap of testing only “obvious” values and instead ensure a structured exploration of all the possible input values.

### Technique 1 - Domain Partition (Equivalence Partitioning)

We divided the input domain into partitions where all values are expected to behave similarly.  
For integer→Roman, the partitions were:

- Valid integers: 1-3999  
- Invalid integers: 0, negative values, >3999  
- Invalid types: non-integers, non-numeric input  

Each partition was represented by at least one test case.

### Technique 2 - Boundary Value Analysis (BVA)

Bugs often appear at the edges of partitions.  
We selected values just below, at, and just above the boundaries:

- 1, 2, 3  
- 3998, 3999, 4000  

We also applied BVA to subtractive patterns (e.g., IV, IX, XL, XC, CD, CM), which are common sources of off-by-one or rule-ordering errors.

### Technique 3 - Decision Tables (Testing Matrices)

Roman numeral construction rules depend on several independent conditions:

- Valid characters  
- Valid repetition rules  
- Valid subtractive rules  
- Valid range  

Decision tables help test combinations of these conditions, not just numeric ranges.  
Although the integer→Roman function has fewer interacting conditions than the reverse conversion, it still produces outputs that depend on multiple rules acting together, especially in composite subtractive cases (e.g., XLIV, CMXLIV). Using decision-table thinking ensured that we considered these interactions systematically rather than relying only on representative values.

This combination of techniques produced a systematic and representative manual test suite.

---

## 3. Manual Test Cases (Set A) - Integer → Roman

| ID | Input | Expected Output | Partition | Notes |
| ---- | -------- | ----------------- | ----------- | ------- |
| TC-A1 | 1 | "I" | Valid | Lower boundary |
| TC-A2 | 2 | "II" | Valid | BVA |
| TC-A3 | 3 | "III" | Valid | BVA |
| TC-A4 | 4 | "IV" | Valid | Subtractive |
| TC-A5 | 5 | "V" | Valid | Representative |
| TC-A6 | 9 | "IX" | Valid | Subtractive |
| TC-A7 | 14 | "XIV" | Valid | Mixed subtractive |
| TC-A8 | 40 | "XL" | Valid | Tens subtractive |
| TC-A9 | 44 | "XLIV" | Valid | Composite subtractive |
| TC-A10 | 58 | "LVIII" | Valid | Representative |
| TC-A11 | 90 | "XC" | Valid | Tens subtractive |
| TC-A12 | 400 | "CD" | Valid | Hundreds subtractive |
| TC-A13 | 944 | "CMXLIV" | Valid | Complex |
| TC-A14 | 1999 | "MCMXCIX" | Valid | Representative |
| TC-A15 | 3998 | "MMMCMXCVIII" | Valid | Upper boundary -1 |
| TC-A16 | 3999 | "MMMCMXCIX" | Valid | Upper boundary |
| TC-A17 | 0 | Error | Invalid | Zero not allowed |
| TC-A18 | -1 | Error | Invalid | Negative |
| TC-A19 | 4000 | Error | Invalid | >3999 |
| TC-A20 | 50000 | Error | Invalid | Far out of range |
| TC-A21 | 3.5 | Error | Invalid | Non-integer |
| TC-A22 | "abc" | Error | Invalid | Non-numeric |
| TC-A23 | null | Error | Invalid | Null input |
| TC-A24 | undefined | Error | Invalid | Undefined input |

---

## 4. AI-Assisted Test Case Design (Set B)

The second suite covers the *Roman → integer* function and was created with the assistance of an AI system.  
We initially provided the AI with the rules of Roman numeral validity, the valid range (1-3999), and examples of invalid patterns. This was enough for the AI to generate a conceptually correct set of test cases, but the initial output did not fully match the structure, tone, or level of detail of our manual suite, and it was difficult to understand quickly the reasoning behind the chosen examples.

The issue was not the quality of the test cases themselves, but rather stylistic and structural inconsistencies. The AI defaulted to its own formatting conventions, which differed from the methodology-driven layout we were using. This made the two suites difficult to compare and reduced the coherence of the overall solution.

To address this, we provided the AI with our entire manual suite (Set A) as a template. With a concrete reference for the expected structure (including column layout, naming conventions, and descriptive style) the AI adapted its output to align with our approach. This produced a consistent and easy to interpret test suite that integrated well into the project.

### Prompt used

> Generate functional test cases for a function that converts Roman numerals to integers. Follow the same structure, tone, and table format as the following manual test suite: [SET A PASTED HERE] Include valid and invalid inputs, boundary values, subtractive patterns, illegal combinations, and malformed numerals. Ensure the style matches the structure of the provided test suite. Add additional invalid Roman numerals, including invalid repetitions (IIII, VV), invalid subtractive patterns (IC, XM), and invalid characters.

---

## 5. AI-Generated Test Cases (Set B) - Roman → Integer

| ID | Input | Expected Output | Partition | Notes |
| ---- | -------- | ----------------- | ----------- | ------- |
| TC-B1 | "I" | 1 | Valid | Lower boundary |
| TC-B2 | "III" | 3 | Valid | Repetition within rules |
| TC-B3 | "IV" | 4 | Valid | Subtractive |
| TC-B4 | "VIII" | 8 | Valid | Representative |
| TC-B5 | "XIX" | 19 | Valid | Mixed subtractive |
| TC-B6 | "XLIX" | 49 | Valid | Composite subtractive |
| TC-B7 | "XCIX" | 99 | Valid | Tens subtractive |
| TC-B8 | "CDXLIV" | 444 | Valid | Hundreds + tens subtractive |
| TC-B9 | "DCCCLXXXVIII" | 888 | Valid | Large additive numeral |
| TC-B10 | "MDCLXVI" | 1666 | Valid | Representative |
| TC-B11 | "MMXXIII" | 2023 | Valid | Representative |
| TC-B12 | "MMMCMXCIX" | 3999 | Valid | Upper boundary |
| TC-B13 | "IIII" | Error | Invalid | Repetition rule violation |
| TC-B14 | "IIV" | Error | Invalid | Illegal subtractive pattern |
| TC-B15 | "VX" | Error | Invalid | Invalid subtractive pair |
| TC-B16 | "LC" | Error | Invalid | L cannot subtract C |
| TC-B17 | "DM" | Error | Invalid | D cannot subtract M |
| TC-B18 | "IC" | Error | Invalid | Illegal subtractive pattern |
| TC-B19 | "XM" | Error | Invalid | Illegal subtractive pattern |
| TC-B20 | "A" | Error | Invalid | Invalid character |
| TC-B21 | "MMZ" | Error | Invalid | Contains invalid character |
| TC-B22 | "" | Error | Invalid | Empty input |
| TC-B23 | null | Error | Invalid | Null input |

---

## 6. Comparison Between Both Sets

The manual suite is based on the systematic techniques studied in class.

- Equivalence Partitioning ensured that all meaningful categories of input were represented.
- Boundary Value Analysis strengthened the suite by targeting the edges where defects are most likely to appear.
- Decision-table reasoning helped us consider interactions between Roman numeral construction rules, especially in composite subtractive cases.

The AI-generated suite, in contrast, excels at breadth and speed. It produced a wide variety of valid and invalid Roman numerals, including malformed patterns that complemented our manual reasoning. However, the AI’s initial output did not fully match the structure, tone, or level of detail of our manual suite. This was not due to poor test selection, but rather to style inconsistencies: the AI defaulted to its own formatting conventions, which did not align with the methodology-driven structure we were using.

Once we provided the AI with our manual suite as a template, the results improved significantly. The AI adapted its output to match our column layout, naming conventions, and descriptive style. This alignment made the two suites coherent and easier to compare, and it integrated the AI-generated tests more naturally into our overall solution.

The two approaches therefore differ in nature: the manual suite is systematic and technique-driven, while the AI suite is expansive and example-driven. Together, they provide stronger coverage than either approach alone.

---

## 7. Conclusion

The manual suite provides strong, methodological coverage of the integer→Roman function, especially at boundaries and in invalid combinations. It reflects a deliberate application of Equivalence Partitioning, Boundary Value Analysis, and Decision-Table reasoning.

The AI-assisted suite complements it by adding variety and generating additional cases quickly for the Roman→integer function. The AI was particularly effective at producing a wide variety of valid and invalid Roman numerals, including malformed patterns that enriched our coverage. However, its initial output did not follow our structure or style, which made it harder to interpret and integrate. Once we provided the manual suite as a template, the AI adapted its output to match our methodology, resulting in a coherent and comparable test suite.

Using both approaches together results in a more complete and robust test suite than either method alone. The manual suite ensures systematic coverage, while the AI suite expands the range of examples and accelerates the creation of comprehensive test data.
