/* Original lesson content. Reference PDFs remain read-only and are not bundled. */
(() => {
  'use strict';

  const loop = `participant_count = int(input("Number of runners: "))

for runner in range(1, participant_count + 1):
    print("Runner", runner)
    laps = int(input("Laps completed: "))
    print("Recorded laps:", laps)`;

  const total = `participant_count = int(input("Number of runners: "))
total_laps = 0

for runner in range(1, participant_count + 1):
    print("Runner", runner)
    laps = int(input("Laps completed: "))
    total_laps = total_laps + laps

print("Total laps:", total_laps)`;

  const full = `participant_count = int(input("Number of runners: "))
total_laps = 0
certificate_count = 0
rate_per_lap = 2

for runner in range(1, participant_count + 1):
    print("Runner", runner)
    laps = int(input("Laps completed: "))
    total_laps = total_laps + laps

    if laps >= 5:
        print("Certificate earned")
        certificate_count = certificate_count + 1
    else:
        print("No certificate yet")

funds_raised = total_laps * rate_per_lap
print("Total laps:", total_laps)
print("Certificates:", certificate_count)
print("Funds raised: RM", funds_raised)`;

  const pseudocode = `participantCount ← USERINPUT
totalLaps ← 0
certificateCount ← 0
ratePerLap ← 2

FOR runner ← 1 TO participantCount
    laps ← USERINPUT
    totalLaps ← totalLaps + laps
    IF laps >= 5 THEN
        OUTPUT "Certificate earned"
        certificateCount ← certificateCount + 1
    ELSE
        OUTPUT "No certificate yet"
    ENDIF
ENDFOR

fundsRaised ← totalLaps * ratePerLap
OUTPUT totalLaps, certificateCount, fundsRaised`;

  const task1Scaffold = `participant_count = int(input("Number of runners: "))
total_laps = 0

# Repair the stop value so every runner is processed.
for runner in range(1, participant_count):
    print("Runner", runner)
    laps = int(input("Laps completed: "))
    # Add this runner's laps to the running total here.

print("Total laps:", total_laps)`;

  const task2Scaffold = `participant_count = int(input("Number of runners: "))
total_laps = 0
certificate_count = 0
rate_per_lap = 2

for runner in range(1, participant_count + 1):
    print("Runner", runner)
    laps = int(input("Laps completed: "))
    total_laps = total_laps + laps

    if laps >= 5:
        print("Certificate earned")
        # Increase certificate_count by one here.
    else:
        print("No certificate yet")

# Replace 0 with a calculation using total_laps and rate_per_lap.
funds_raised = 0
print("Total laps:", total_laps)
print("Certificates:", certificate_count)
print("Funds raised: RM", funds_raised)`;

  const test = (id, label, inputs, totalLaps, certificates, funds) => ({
    id, label, inputs,
    expected: `Total laps: ${totalLaps}\nCertificates: ${certificates}\nFunds raised: RM ${funds}`,
    checks: { totalLaps, certificates, funds }
  });

  const ksu = [
    {
      id: 'ksu1', kind: 'Knowledge', title: 'K1: Recognise definite iteration and its bounds',
      can: 'I can recognise definite iteration and explain that pseudocode includes its final bound but Python range excludes its stop.',
      evidence: 'Explain why the known runner count suits a FOR loop, and compare FOR 1 TO 3 with range(1, 4).',
      spec: ['3.1.1', '3.2.2'],
      support: 'Write the runner numbers 1, 2, 3. Identify the final included value and the excluded Python stop.'
    },
    {
      id: 'ksu2', kind: 'Knowledge', title: 'K2: Distinguish a counter from an accumulator',
      can: 'I can distinguish a counter that counts events from an accumulator that adds variable values.',
      evidence: 'Explain why certificate_count adds 1 for a qualifying event but total_laps adds the runner’s lap value.',
      spec: ['3.2.2', '3.2.3'],
      support: 'Ask what each variable measures: number of qualifying runners, or number of completed laps?'
    },
    {
      id: 'ksu3', kind: 'Skills', title: 'S1: Write and trace FOR loops and pseudocode',
      can: 'I can write and trace a definite FOR loop in Python and matching pseudocode.',
      evidence: 'Process every runner once, trace 2 / 5 / 4 laps, and match the Python bounds to inclusive pseudocode bounds.',
      spec: ['3.1.1', '3.2.2'],
      support: 'Trace one runner at a time. In pseudocode use FOR runner ← 1 TO participantCount; in Python add 1 to the stop.'
    },
    {
      id: 'ksu4', kind: 'Skills', title: 'S2: Combine input, selection, updates and testing',
      can: 'I can combine integer input, selection and updates inside a FOR loop, then test the complete program.',
      evidence: 'Use int(input(...)), update both variables in the correct places, calculate RM2 per lap, and run the given tests.',
      spec: ['3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.2.7', '3.2.8'],
      support: 'Build in stages: input and total first; certificate decision and counter next; final calculation and tests last.'
    },
    {
      id: 'ksu5', kind: 'Understanding', title: 'U1: Explain where initialisation, updates and summaries belong',
      can: 'I can explain why variables initialise before the loop, update inside it, and appear in a summary after it.',
      evidence: 'Explain why resetting total_laps inside the loop loses earlier laps, and why the final report is outside the loop.',
      spec: ['3.1.1', '3.2.2', '3.2.3'],
      support: 'Use three locations: initialise before; update inside; report after.'
    },
    {
      id: 'ksu6', kind: 'Understanding', title: 'U2: Explain errors and justify boundary tests',
      can: 'I can explain an off-by-one or comparison error and justify tests that reveal it.',
      evidence: 'Explain why the single-runner test reveals a skipped final iteration and why 4 / 5 / 6 checks the certificate boundary.',
      spec: ['3.1.1', '3.2.2', '3.2.4'],
      support: 'Name the boundary, predict the expected result, compare actual output, and explain the cause before repairing it.'
    }
  ];

  const extensions = [
    {
      id: 'ext1', title: 'The zero-lap check',
      scenario: 'A registered runner may finish zero laps. The organiser needs a separate count of these runners, without changing the normal lap total, certificate rule, or RM2 sponsorship rate.',
      requirements: [
        'Keep all three original summary results.',
        'Count a runner as zero-lap only when laps equals 0.',
        'Print the zero-lap count after processing every runner.'
      ],
      inputs: ['4', '0', '5', '0', '2'],
      expected: 'Total laps: 7\nCertificates: 1\nFunds raised: RM 14\nZero-lap runners: 2',
      hint: 'Use a new counter, initially 0. Its update belongs inside a separate equality check.',
      scaffold: full
    },
    {
      id: 'ext2', title: 'Three-lap encouragement badges',
      scenario: 'The school adds an encouragement badge for everyone completing at least three laps. Certificates still require at least five laps, and every lap still raises RM2.',
      requirements: [
        'Keep the original certificate counter and lap total.',
        'Add a badge counter for laps >= 3.',
        'A certificate winner may also receive a badge; do not make the two awards mutually exclusive.'
      ],
      inputs: ['4', '2', '3', '5', '6'],
      expected: 'Total laps: 16\nCertificates: 2\nFunds raised: RM 32\nEncouragement badges: 3',
      hint: 'Two separate IF decisions can both be true for the same runner.',
      scaffold: full
    },
    {
      id: 'ext3', title: 'Check the certificate register',
      scenario: 'The organiser wants both the number receiving certificates and the number not yet qualifying. These two counts should account for every registered runner.',
      requirements: [
        'Count runners with fewer than five laps in the existing else branch.',
        'Print both counts after the loop.',
        'Print the sum of the two counts so the organiser can compare it with the participant count.'
      ],
      inputs: ['4', '0', '4', '5', '7'],
      expected: 'Total laps: 16\nCertificates: 2\nFunds raised: RM 32\nNot yet qualifying: 2\nRunners accounted for: 4',
      hint: 'Each runner follows exactly one side of the certificate selection.',
      scaffold: full
    },
    {
      id: 'ext4', title: 'The RM1 matching sponsor',
      scenario: 'A local sponsor adds RM1 for every completed lap, on top of the school’s original RM2 per lap. The organiser must show the two amounts separately.',
      requirements: [
        'Keep the original school funds calculation at RM2 per lap.',
        'Calculate the extra matching amount at RM1 per lap after the loop.',
        'Print school funds, matching funds, and their combined amount.'
      ],
      inputs: ['3', '2', '5', '4'],
      expected: 'Total laps: 11\nCertificates: 1\nFunds raised: RM 22\nMatching funds: RM 11\nCombined funds: RM 33',
      hint: 'One lap total can be used in several different calculations after the loop.',
      scaffold: full
    },
    {
      id: 'ext5', title: 'Certificate bonus sponsorship',
      scenario: 'A donor offers an extra RM10 for each certificate winner. The standard sponsorship remains RM2 for every lap, including laps from runners who do not qualify.',
      requirements: [
        'Keep the original lap-based funds result.',
        'Calculate the bonus from the certificate count, not the lap total.',
        'Print the bonus and the overall amount after the loop.'
      ],
      inputs: ['3', '4', '5', '6'],
      expected: 'Total laps: 15\nCertificates: 2\nFunds raised: RM 30\nCertificate bonus: RM 20\nOverall funds: RM 50',
      hint: 'Use the quantity that the donor is paying for: winners, not laps.',
      scaffold: full
    },
    {
      id: 'ext6', title: 'Eight-lap achievement shout-out',
      scenario: 'The organiser adds a special shout-out for runners completing at least eight laps. These runners must still be included in the normal certificate count.',
      requirements: [
        'Keep the five-lap certificate condition unchanged.',
        'Add a separate counter for laps >= 8.',
        'Print the shout-out message for qualifying runners and a final shout-out count.'
      ],
      inputs: ['4', '4', '5', '8', '9'],
      expected: 'Total laps: 26\nCertificates: 3\nFunds raised: RM 52\nShout-outs: 2',
      hint: 'A runner with eight laps meets both conditions. Check both separately.',
      scaffold: full
    },
    {
      id: 'ext7', title: 'How close to a certificate?',
      scenario: 'For runners below the certificate threshold, the organiser wants a helpful message showing how many more laps would be needed to reach five.',
      requirements: [
        'Keep the certificate message for runners with at least five laps.',
        'For other runners, calculate 5 - laps and print the number of additional laps needed.',
        'Do not add imaginary laps to the event total.'
      ],
      inputs: ['3', '0', '4', '5'],
      expected: 'Runner 1 needs 5 more laps.\nRunner 2 needs 1 more lap.\nRunner 3 earns a certificate.\nTotal laps: 9\nCertificates: 1\nFunds raised: RM 18',
      hint: 'Calculate the shortfall inside the else branch. It is a message, not a contribution to total_laps.',
      scaffold: full
    },
    {
      id: 'ext8', title: 'Live event scoreboard',
      scenario: 'After each runner is entered, the announcer wants to see the running lap total and the sponsorship raised so far. The final summary is still required.',
      requirements: [
        'Print a running lap total after adding the latest runner’s laps.',
        'Print the running funds at RM2 per lap inside the loop.',
        'Keep the normal final lap, certificate, and funds summary after the loop.'
      ],
      inputs: ['3', '2', '5', '4'],
      expected: 'After runner 1: 2 laps, RM 4\nAfter runner 2: 7 laps, RM 14\nAfter runner 3: 11 laps, RM 22\nTotal laps: 11\nCertificates: 1\nFunds raised: RM 22',
      hint: 'Indentation decides whether a message appears after each runner or only once at the end.',
      scaffold: full
    },
    {
      id: 'ext9', title: 'The class ten-lap goal',
      scenario: 'The school’s first event goal is ten laps in total. Once every runner has been processed, the organiser needs to know whether the whole group reached that goal.',
      requirements: [
        'Keep all original summary results.',
        'After the loop, use selection to check total_laps >= 10.',
        'Print “Group goal reached” when true; otherwise print the number of laps short of ten.',
        'Test totals of 9 and 10 so the equality boundary is checked.'
      ],
      inputs: ['2', '4', '6'],
      expected: 'Total laps: 10\nCertificates: 1\nFunds raised: RM 20\nGroup goal reached\nAdditional test: inputs 2, 4, 5 give 9 laps and “1 lap short”.',
      hint: 'This decision concerns the whole event. Put it after the loop, using the accumulated total.',
      scaffold: full
    },
    {
      id: 'ext10', title: 'Morning and afternoon laps',
      scenario: 'Each registered runner has a morning lap count and an afternoon lap count. Their two counts are combined before checking the certificate rule. Every completed lap still raises RM2.',
      requirements: [
        'Keep a single FOR loop controlled by the known participant count.',
        'Inside the loop, input the morning count followed by the afternoon count.',
        'Add the two inputs to obtain that runner’s laps, then use that value for the total and certificate check.',
        'Do not count morning and afternoon as separate runners.'
      ],
      inputs: ['3', '1', '1', '2', '3', '4', '2'],
      expected: 'Runner totals: 2, 5, 6\nTotal laps: 13\nCertificates: 2\nFunds raised: RM 26',
      hint: 'Replace the single lap input with two integer inputs and one addition. The existing total and selection can then stay in place.',
      scaffold: full
    }
  ];

  window.LESSON = {
    id: 'year10-sponsored-run-for-loops',
    title: 'Sponsored Run: FOR Loops, Totals and Counters',
    topic: 'FOR loops, counters and running totals',
    branding: 'Tenby Schools · CS with Mr Dave',
    duration: 60,
    timer60: 60,
    wagba: 'We are getting better at using a definite FOR loop to process a known number of inputs, build a running total, and count outcomes selected by a condition.',
    keywords: [
      { word: 'definite iteration', meaning: 'Repetition whose number of iterations is known before the loop begins.' },
      { word: 'FOR loop', meaning: 'A loop that repeats its body for each value in a specified sequence.' },
      { word: 'loop body', meaning: 'The indented instructions repeated for each runner.' },
      { word: 'running total / accumulator', meaning: 'A variable that builds an amount by adding each new value.' },
      { word: 'counter', meaning: 'A variable that counts occurrences, usually increasing by one.' },
      { word: 'off-by-one error', meaning: 'A boundary mistake that causes one too many or one too few repetitions.' },
      { word: 'selection', meaning: 'Choosing a branch of instructions according to a condition.' },
      { word: 'boundary test', meaning: 'A test at, just below, or just above a decision threshold.' }
    ],
    challenge: 'Can you process every runner exactly once, total all completed laps, and count only the runners who earn certificates?',
    assumptions: [
      'The organiser knows the number of runners before entering their lap counts.',
      'The participant count is a valid positive whole number.',
      'Every lap input is a valid non-negative whole number, including 0.',
      'No input validation, lists, functions, or new loop type is required in this lesson.',
      'Each completed lap raises RM2; at least 5 laps earns one certificate.'
    ],
    ksu,
    stages: [
      {
        id: 'ready', title: 'Get ready: the Sponsored Run', minutes: 2,
        html: `<p>You are writing a program for the school’s Sponsored Run organiser. The organiser knows how many runners took part. For each runner, enter their completed laps.</p>
          <p>Every lap raises <strong>RM2</strong>. A runner earns a certificate for <strong>at least 5 laps</strong>. The final report must show total laps, the number of certificates, and funds raised.</p>
          <p>Use whole-number inputs. Assume the runner count is positive and lap counts are zero or more. We are practising the program’s structure, not input validation.</p>
          <ol><li>Join using your teacher’s invitation link and keep this page open.</li><li>You will write and run real Python here. Enter each input on its own line before pressing Run.</li><li>Check your name at the top of the workspace. Your class is Year 10.</li></ol>`,
        fields: []
      },
      {
        id: 'starter', title: 'Starter: input and the five-lap rule', minutes: 5,
        html: `<p>This is a quick recall check of <strong>input, integers, and comparison</strong>. You do not need to write a new loop yet.</p>
          <pre><code>laps = int(input("Laps completed: "))
if laps &gt;= 5:
    print("Certificate earned")</code></pre>
          <ol><li>In one short phrase, explain why <code>int</code> is used around <code>input</code>.</li><li>For lap counts <strong>4, 5, and 6</strong>, write whether the condition is true or false.</li><li>Copy the comparison symbol that includes the runner who completes exactly five laps.</li></ol>
          <p>We will check these together. This starter is evidence for choosing your next learning target, not a test of FOR loops you have not studied yet.</p>`,
        fields: [
          { id: 'starterRecall', label: 'My short answers: int; 4 / 5 / 6; the comparison', type: 'textarea', placeholder: 'int is used because …\n4: …  5: …  6: …\nThe comparison is …' }
        ]
      },
      {
        id: 'types', title: 'Choose a learning target', minutes: 3,
        html: `<p>Now use your starter evidence and the six KSU statements to choose a useful target. <strong>K = knowledge, S = skill, U = understanding.</strong> A target should say what you will be able to show, not just “get better at Python”.</p>
          <p>Identify what you can already show. The starter checks input and comparisons, not the new loop concepts: choose “Not yet / not sure” for a concept you have not met. That is a starting point, not a low grade.</p>
          <p><strong>Knowledge:</strong> remember and distinguish the rules. <strong>Skills:</strong> practise writing and testing code. <strong>Understanding:</strong> explain why the structure and tests work. You may be developing all three; choose one small priority.</p>
          <p>Choose one priority KSU below and name the evidence that will show progress by the end. It is fine to change your target after the model.</p>`,
        ksuReflection: true,
        fields: [
          { id: 'learningFocus', label: 'My learning focus and evidence', type: 'text', placeholder: 'For example: U2 — pass the one-runner test and explain the range stop.' }
        ]
      },
      {
        id: 'model', title: 'Read, trace and build with the teacher', minutes: 9,
        html: `<p><strong>Original reading:</strong> A definite loop is suitable when we know how many times a set of instructions should repeat. Here, the organiser enters the number of runners first. Each repetition then handles one runner.</p>
          <p>In Python, <code>range(1, 4)</code> supplies <strong>1, 2, 3</strong>: the start is included, but the stop is excluded. To include the last runner, use <code>range(1, participant_count + 1)</code>.</p>
          <p>A running total starts at zero <strong>before</strong> the loop. Inside the loop, add the latest lap count to the old total. Show the final total <strong>after</strong> the loop, once all runners are processed.</p>
          <p>Follow the model line by line using the manual step buttons. The input sequence is <strong>3 runners, then 2, 5, 4 laps</strong>. Read what changes before moving on. You may explain in writing; speaking is optional.</p>
          <table><thead><tr><th>Moment</th><th>New laps</th><th>Running total</th></tr></thead><tbody><tr><td>Before the loop</td><td>—</td><td>0</td></tr><tr><td>After runner 1</td><td>2</td><td>2</td></tr><tr><td>After runner 2</td><td>5</td><td>7</td></tr><tr><td>After runner 3</td><td>4</td><td>11</td></tr></tbody></table>
          <p>For the complete event report, only the five-lap runner earns a certificate. So this same example must eventually give <strong>11 total laps, 1 certificate, and RM22</strong>. Task 1 builds the lap total; Task 2 adds that decision and counter.</p>
          <details><summary>Pseudocode bounds and Python bounds</summary><p>Our pseudocode <code>FOR runner ← 1 TO participantCount</code> includes the final runner. Python’s <code>range</code> excludes its stop, so its stop expression is one higher. Do not transfer the bounds unchanged.</p><pre><code>FOR runner ← 1 TO participantCount
    laps ← USERINPUT
    totalLaps ← totalLaps + laps
ENDFOR</code></pre><p><code>totalLaps ← 0</code> belongs before this pseudocode loop.</p></details>
          <p class="source-note">Reading is paraphrased in original wording. Textbook reference: printed pp. 44–45 (PDF pp. 48–49) and printed p. 50 (PDF p. 54). OxfordAQA 9210 specification v3.4: 3.1.1, 3.2.1, 3.2.2, 3.2.3, 3.2.4, 3.2.7 and 3.2.8.</p>`,
        fields: [
          { id: 'modelExplain', label: 'One explanation from the model', type: 'text', placeholder: 'Why does participant_count + 1 include the final runner?' }
        ],
        code: total,
        inputs: ['3', '2', '5', '4'],
        expected: 'Total laps: 11',
        guidedSteps: [
          { line: 1, explanation: 'Read the known number of runners before any repetition. int converts the entered text into a whole number.', values: 'participant_count = 3' },
          { line: 2, explanation: 'Create the running total once. No laps have been entered yet.', values: 'total_laps = 0' },
          { line: 4, explanation: 'range(1, 3 + 1) supplies runner numbers 1, 2 and 3. Each number starts one repetition.', values: 'runner = 1 → 2 → 3' },
          { line: 5, explanation: 'This indented print runs once for each runner. It helps the organiser enter the right runner’s laps.', values: 'Runner 1; Runner 2; Runner 3' },
          { line: 6, explanation: 'Read a fresh lap count inside each repetition. Reusing the variable is enough; no list is needed.', values: 'laps = 2, then 5, then 4' },
          { line: 7, explanation: 'Add the current runner’s laps to the amount already accumulated. Do not replace the total with laps alone.', values: '0 + 2 = 2; 2 + 5 = 7; 7 + 4 = 11' },
          { line: 9, explanation: 'The indentation has ended, so this final report runs once after all three runners.', values: 'Total laps: 11' }
        ],
        tests: [{ id: 'model-three', label: 'Teacher example: 3 runners', inputs: ['3', '2', '5', '4'], expected: 'Total laps: 11', checks: { totalLaps: 11 } }]
      },
      {
        id: 'task1', title: 'Task 1: repair the bounds and build the total', minutes: 13,
        html: `<p>The organiser’s starter program has <strong>two unfinished parts</strong>: its loop misses the final runner, and it does not add lap inputs to the total yet. Repair it to report total laps only.</p>
          <ol><li>Read the runner count before the loop and keep the total initialised at zero.</li><li>Change the loop bounds so runner numbers go from 1 through the participant count.</li><li>Inside the loop, add each new lap input to the existing total.</li><li>Keep the final total print after the loop.</li><li>Run both tests below. Compare expected and actual results before moving on.</li></ol>
          <p><strong>Test A:</strong> inputs <code>3, 2, 5, 4</code> must give <code>Total laps: 11</code>. <strong>Test B:</strong> inputs <code>1, 5</code> must give <code>Total laps: 5</code>. The one-runner case catches a missing final iteration.</p>
          <details><summary>Small-step support</summary><ol><li>List the values in <code>range(1, 3)</code>, then in <code>range(1, 4)</code>.</li><li>For the update, read “new total equals old total plus this runner’s laps”.</li><li>Check that the update is indented inside the loop, but initialisation is not.</li></ol></details>`,
        fields: [
          { id: 'task1Evidence', label: 'Task 1 evidence', type: 'textarea', placeholder: 'Three-runner result: …\nOne-runner result: …\nI repaired the stop because …' },
          { id: 'task1Pseudocode', label: 'Write the matching loop in OxfordAQA pseudocode', type: 'textarea', help: 'Write the total initialisation, FOR bounds, input, total update, ENDFOR and final output. Use the model’s pseudocode panel for support. Remember: TO includes the final runner; Python’s range stop does not.', placeholder: 'totalLaps ← …\nFOR runner ← … TO …\n    …\nENDFOR\nOUTPUT …' }
        ],
        code: task1Scaffold,
        inputs: ['3', '2', '5', '4'],
        tests: [
          { id: 'task1-three', label: 'A: 3 runners, 2 / 5 / 4 laps', inputs: ['3', '2', '5', '4'], expected: 'Total laps: 11', checks: { totalLaps: 11 } },
          { id: 'task1-one', label: 'B: 1 runner, 5 laps', inputs: ['1', '5'], expected: 'Total laps: 5', checks: { totalLaps: 5 } }
        ]
      },
      {
        id: 'task2', title: 'Task 2: certificates, a counter and RM2 per lap', minutes: 12,
        html: `<p>Now complete the same Sponsored Run program. The organiser needs a certificate decision for each runner and three final summary values.</p>
          <p><strong>Total and counter have different jobs.</strong> <code>total_laps</code> adds the number of laps on every repetition. <code>certificate_count</code> adds <strong>1</strong> only for a runner whose laps are at least 5.</p>
          <ol><li>Keep the correct loop and lap-total update from Task 1.</li><li>Start <code>certificate_count</code> at zero before the loop.</li><li>Inside the <code>if laps &gt;= 5</code> branch, increase that counter by one. Keep non-qualifying runners out of this counter.</li><li>After the loop, calculate funds as total laps multiplied by the rate per lap.</li><li>Print total laps, certificate count, and funds raised after the loop.</li><li>Predict each result, run the tests, and compare.</li></ol>
          <p><strong>Worked check:</strong> 2, 5 and 4 laps add to 11; just one runner qualifies; <code>11 × 2 = RM22</code>. With a single five-lap runner, the report is 5 laps, 1 certificate and RM10.</p>
          <p><strong>Boundary check:</strong> 4, 5 and 6 laps total 15. The four-lap runner does not qualify; the five- and six-lap runners do. Expected report: <strong>15 laps, 2 certificates, RM30</strong>.</p>
          <details><summary>Small-step support</summary><p>First get the certificate count right, then add the funds calculation. If the total is right but certificates are wrong, inspect the condition and the counter’s indentation. If only the funds are wrong, inspect the calculation after the loop.</p></details>`,
        fields: [
          { id: 'task2Evidence', label: 'Task 2 test evidence', type: 'textarea', placeholder: '2 / 5 / 4 → total …, certificates …, funds …\nSingle 5 → …\n4 / 5 / 6 → …\nOne change I made, and why: …' }
        ],
        code: task2Scaffold,
        modelCode: full,
        guidedSteps: [
          { line: 2, explanation: 'The lap accumulator starts at zero once, before the loop. This variable measures laps, not runners.', values: 'total_laps = 0' },
          { line: 3, explanation: 'The certificate counter also starts at zero before the loop. It counts qualifying runners.', values: 'certificate_count = 0' },
          { line: 6, explanation: 'For three registered runners, range(1, 4) processes runners 1, 2 and 3 exactly once each.', values: 'runner: 1 → 2 → 3' },
          { line: 9, explanation: 'Every runner’s lap count is added, including lap counts below the certificate threshold.', values: 'Inputs 2, 5, 4: total_laps becomes 2 → 7 → 11' },
          { line: 11, explanation: 'Compare this runner’s laps with five. The >= includes exactly five laps.', values: '2 >= 5: False; 5 >= 5: True; 4 >= 5: False' },
          { line: 13, explanation: 'Increase by one only inside the qualifying branch. The value counts people receiving certificates, not laps completed.', values: 'certificate_count: 0 → 1 → 1' },
          { line: 17, explanation: 'The loop has finished. Multiply the accumulated lap total by RM2 per lap once.', values: 'funds_raised = 11 * 2 = 22' },
          { line: 18, explanation: 'The three final summary prints are outside the loop, so the complete event report is displayed once.', values: 'Total laps: 11; Certificates: 1; Funds raised: RM 22' }
        ],
        inputs: ['3', '2', '5', '4'],
        tests: [
          test('task2-three', 'A: worked example, 2 / 5 / 4', ['3', '2', '5', '4'], 11, 1, 22),
          test('task2-one', 'B: single runner on the threshold', ['1', '5'], 5, 1, 10),
          test('task2-boundary', 'C: boundary values, 4 / 5 / 6', ['3', '4', '5', '6'], 15, 2, 30)
        ]
      },
      {
        id: 'extension', title: 'Choose one original practice extension', minutes: 8,
        html: `<p>When the core tests pass, choose <strong>one</strong> extension. These are ten original, small programming exercises in an explicit requirements-and-example style. They are not copied from a course exercise bank.</p>
          <ol><li>Read the organiser’s new requirement and its example input order.</li><li>Use your working Task 2 program as the starting point.</li><li>Write a one-sentence plan identifying the new variable, calculation, or decision.</li><li>Make the smallest useful change. Stay with integer input, FOR, selection, arithmetic, totals and counters.</li><li>Run the example and compare it with the required results.</li></ol>
          <p>If a core test is not passing yet, return to Task 1 or Task 2 and use this time to repair it with the support steps. A correct, explained core program is stronger evidence than an unfinished extension.</p>`,
        fields: [
          { id: 'extensionEvidence', label: 'My extension plan and evidence, or core repair', type: 'textarea', placeholder: 'Chosen task: …\nMy plan: …\nExpected and actual results: …\nIf repairing the core: the issue and the test I reran …' }
        ],
        code: full,
        inputs: ['3', '2', '5', '4'],
        extensionChooser: true
      },
      {
        id: 'pit', title: 'Learning Pit Stop: what can you do now?', minutes: 3,
        html: `<p>Pause <strong>after practice</strong>. For each KSU statement, distinguish evidence of what you can do from how this learning currently feels. These are personal reflections, not automatically awarded marks.</p>
          <ul><li><strong>New learning:</strong> I am learning something new with manageable challenge and making progress.</li><li><strong>Consolidating:</strong> I am strengthening and using what I already know.</li><li><strong>Treading water:</strong> This feels easy and is not stretching me; I need a suitable next challenge.</li><li><strong>Drowning / needing help:</strong> This feels too hard right now; I need a smaller step and support. Asking for help is useful.</li></ul>
          <p>Choose honestly, then name a precise success or sticking point. Useful evidence names a line, a test, or a concept: “my one-runner test skips the input” is more actionable than “it does not work”.</p>`,
        fields: [
          { id: 'nextStep', label: 'My precise next step or support request', type: 'text', placeholder: 'For example: my counter counts 4 laps; I need help locating its update.' }
        ]
      },
      {
        id: 'plenary', title: 'Plenary: explain the structure', minutes: 3,
        html: `<p>Return to your chosen KSU target. Use your actual program and test results as evidence.</p>
          <ol><li>Why does this event use a definite FOR loop?</li><li>Why is the Python stop expression one greater than the final runner number?</li><li>What is the difference between adding <code>laps</code> to a total and adding <code>1</code> to a counter?</li><li>Why are the final reports outside the loop?</li></ol>
          <p>Answer any <strong>two</strong> prompts briefly, then identify one piece of evidence that shows progress towards your target. If you still need help, name the smallest next step.</p>`,
        ksuReflection: true,
        fields: [
          { id: 'plenaryExplain', label: 'Two explanations and my target evidence', type: 'textarea', placeholder: 'Prompt …: …\nPrompt …: …\nMy target evidence / next step: …' }
        ]
      },
      {
        id: 'submit', title: 'Check and hand in your evidence', minutes: 2,
        html: `<p>Check that your saved work identifies you, includes your latest core program, and records the tests you actually ran.</p>
          <ol><li>Save your latest Task 1 and Task 2 code.</li><li>Check your name and class, target, test evidence and learning-pit response.</li><li>Export or download your response using the page’s hand-in controls.</li><li>Submit that response in the place your teacher specifies. A local download alone is not a submission to your teacher.</li></ol>
          <p>Keep any unfinished issue visible and describe it honestly. Do not claim an expected result as an actual test result unless you ran the program.</p>`,
        fields: []
      }
    ],
    extensions,
    models: { loop, total, full, pseudocode, main1: total, main2: full },
    sources: [
      {
        title: 'OxfordAQA International GCSE Computer Science 9210 specification, v3.4',
        url: 'https://www.oxfordaqa.com/wp-content/uploads/2026/06/oxfordaqa-gcse-computer-science-specification.pdf',
        note: 'Sections 3.1.1 (algorithms), 3.2.1 (data types), 3.2.2 (programming concepts), 3.2.3 (arithmetic), 3.2.4 (comparisons), 3.2.7 (input/output) and 3.2.8 (string conversion).'
      },
      {
        title: 'Oxford AQA International GCSE Computer Science textbook — project reference',
        note: 'Printed pp. 44–45 (PDF pp. 48–49) and printed p. 50 (PDF p. 54). Used as a read-only reference; explanations and exercises here are original paraphrases. The textbook PDF is not redistributed.'
      },
      {
        title: 'Python documentation: the range type',
        url: 'https://docs.python.org/3/library/stdtypes.html#ranges',
        note: 'For a positive step, generated values remain below the stop value; the stop is excluded.'
      }
    ]
  };
})();
