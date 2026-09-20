# Teacher guide — Making decisions

## Preparation and timing

Students need their usual Python IDE. No installs or new Python libraries required. Keep the three initial values as assignments so input conversion does not compete with today's new selection concepts. Valid ages 12–18 assumed; no validation loop.

0–6 starter; 6–9 types of learning; 9–25 Main 1; 25–48 Main 2; 48–53 paper extension or supported consolidation; 53–56 pit stop; 56–60 plenary and export. These are flexible pacing cues, not deadlines.

Main 1 A covers all six relational operators. Main 1 B explicitly practises AND, OR and NOT; the ID/pass desk rule is separate from booking acceptance. Main 2 A models one selection chain, B introduces nesting and matching pseudocode, C completes the scaffold and records four tests. Stronger students can proceed; others can complete one test with help. Do not mark unrun tests as completed.

## Important explanations

- Python = assigns; == compares. Exam pseudocode comparison = is different notation, not different logic.
- OR is inclusive. True OR True remains True.
- With Boolean operands, NOT reverses the value.
- Conditions later in an if/elif/else chain may be skipped, not evaluated as False.
- A 16-year-old meets both >=14 and >=16; the first selected branch wins. Test the higher boundary first for this chain.
- A nested block is reached only if the containing branch is taken.
- In Python, each else aligns with its own if. Four/eight spaces in these examples illustrate the levels; do not use colour alone to explain belonging.
- The line pointer is a prepared model, not a Python execution engine. Students must run their own code to produce authentic test evidence.

## Core feedback

Starter: 14; integer; permission and cancelled; True. “Above” excludes 14; “14 or above” includes 14.

Main 1 comparisons for age 16: True, False, False, True, True, False. Boolean practice: False; False; True; False; school_id or guest_pass. False permission and False cancellation is rejected by AND but incorrectly accepted by OR.

Main 2 predictions: age12 Junior; age15 Intermediate; age18 Senior. permission=False skips all age comparisons. Final else belongs to permission and not cancelled. Pseudocode outer condition is Permission AND NOT Cancelled; the outer ELSE outputs Booking cannot proceed.

Scaffold blanks: `permission and not cancelled`; `age >= 14`; `Junior group`.

Tests:
1. 14, True, False → Intermediate group.
2. 16, False, False → Booking cannot proceed.
3. 13, True, True → Booking cannot proceed.
4. 16, True, False → Senior group.

Plenary: True; inclusive OR description; No. Explanation: the outer condition is False, so the outer else branch executes and the inner age block is skipped.

Automatic checks do not assess explanation quality, code correctness or unaided work. Review pasted code, test output and students' explanation of branches. A student's chosen phase is not a grade. Consider a private check-in if “needing help” is selected.

## Paper extension: exact preparation

From your supplied files, print original question paper pages **8–9**:

`9210-2-QP-InternationalComputerScience-G-29May24-07-00-GMT.pdf`

Teacher marking reference: `AQA-9210-2-Final-MS-Jun24-v1.0.pdf`, page **10**.

Both are in the AQA CS project's read-only `sources` directory. Do not publish a mark scheme into student resources. The app supplies the citation and handover workflow, not a paper download.

Suggested order: Q05.2 (1 mark), Q05.3 (1 mark), Q05.1 (2 marks). All four marks are AO2 in the official mark scheme. This is a stretch after guided nesting, not essential completion in five minutes.

Q05.2: **12**.
Q05.3: **8x**.
Q05.1: coefficient 3 then 9; power 3 then 2; output **9x^2**. Award one mark for first power value and correct coefficient column; one for final power value and correct output. The mark scheme ignores repeated values and empty cells; maximum one if table contains incorrect values. Use the original mark scheme for final marking decisions.

Support: <> means not equal. Quoted x and ^ are literal characters output by the algorithm. Students need no differentiation/calculus knowledge. If trace tables have not been taught, model their recording convention or defer Q05.1. Record scaffolding given.

## Evidence report

Export includes all registered fields, unfinished fields, every checked attempt, before/after K/S/U, learning phases, paper handover timestamps, tutor line visits, code, test records and all attached images/captions. It cannot capture work done in an IDE unless the student pastes or uploads that work. It cannot mark or capture the separate paper submission automatically.

Review the PDF preview before students close their browser. Encourage a JSON backup as well. No publication, Git push or Teams upload has been performed by creating this app.
