/* Original lesson content. No textbook or past-paper questions are reproduced. */
(() => {
  'use strict';
  const warmup = 'ready = input("Type Y to start: ")\n\nwhile ready != "Y":\n    print("Please type Y.")\n    ready = input("Type Y to start: ")\n\nprint("Donation record ready.")';
  const validator = 'books = int(input("Books donated (0-20): "))\n\nwhile books < 0 or books > 20:\n    print("Enter a whole number from 0 to 20.")\n    books = int(input("Books donated (0-20): "))\n\nprint("Accepted donation:", books)';
  const scaffold = 'books = int(input("Books donated (0-20): "))\n\n# Add a WHILE loop that rejects out-of-range numbers.\n# Inside it, display the range message and ask for books again.\n\nprint("Accepted donation:", books)';
  const once = 'books = int(input("Books donated (0-20): "))\n\nif books < 0 or books > 20:\n    print("Invalid number.")\n\nprint("Input check finished.")';
  const img = {
    flow:{src:'assets/01-while-loop-flowchart.png',alt:'Ask for books. If books is below zero or above twenty, show the range message and ask again, then return to the condition. Otherwise output the accepted donation and end.',caption:'The return arrow goes to the condition, not to the first input.'},
    trace:{src:'assets/02-changing-input-trace.png',alt:'Successive inputs replace books with minus one, twenty-one and eight. The first two make the invalid condition true; eight makes it false and leaves the loop.',caption:'A study example: each new input replaces the previous value of the same variable.'},
    compare:{src:'assets/03-start-and-end-conditions.png',alt:'WHILE checks before its repeated body and continues when true. REPEAT UNTIL checks afterwards and stops when true. With first input Y, the WHILE body runs zero times and the REPEAT body once.',caption:'OxfordAQA pseudocode. The input before WHILE is outside its repeated body.'},
    range:{src:'assets/04-range-validation-or.png',alt:'Integer donations from zero to twenty inclusive are accepted. Values below zero or above twenty are rejected. Both endpoints are included, and either outside region requires another input.',caption:'Whole-number range validation: 0 and 20 are accepted boundaries.'}
  };
  const ksu = [
    {id:'K',name:'Knowledge',short:'Know when a loop repeats or stops.',can:'I can explain when WHILE repeats and how a start check differs from an end check.',proof:'Predict the zero-iteration case and compare WHILE with REPEAT...UNTIL.'},
    {id:'S',name:'Skills',short:'Build and test a validation loop.',can:'I can write a WHILE range validator and test replacement inputs and both boundaries.',proof:'Save a working program, an invalid-to-valid run, and boundary runs for 0 and 20.'},
    {id:'U',name:'Understanding',short:'Explain the condition and changing input.',can:'I can explain why OR detects invalid values and why replacement input belongs inside the loop.',proof:'Explain the replacement-input line and the difference between OR and AND.'}
  ];
  const groups = [
    {id:'ready',name:'Get ready',minutes:0},
    {id:'starter',name:'Starter · Do Now',minutes:5},
    {id:'types',name:'Types of Learning',minutes:3},
    {id:'main1',name:'Main Activity 1 · Read and trace',minutes:17},
    {id:'main2',name:'Main Activity 2 · Build and test',minutes:21},
    {id:'extension',name:'Extension · Choose one',minutes:5},
    {id:'pit',name:'Learning Pit Stop',minutes:4},
    {id:'plenary',name:'Plenary',minutes:5},
    {id:'finish',name:'Save and submit',minutes:0}
  ];
  const pages=[];
  function p(id,group,kind,title,options={}) { pages.push({id,group,kind,title,ksu:'K',syllabus:['3.2.2'],...options}); }
  const choice=(id,label,why)=>({id,label,why});
  p('ready','ready','choice','A familiar donation drive. A new kind of loop.',{
    studyCheck:true,
    read:['Our school library accepts a donation of 0 to 20 books from one tutor group. If someone enters a number outside that range, the program must ask for a replacement. It must keep asking until the number is allowed.',
      'A FOR loop repeats a set number of times in the programs we have studied. Here, we cannot predict how many attempts the user will need. We will use a condition to decide whether to repeat.',
      'Work through one page at a time. Study the explanation, then answer its short check on the same page. In Main Activity 2, your program stays with you between steps.'],
    note:'Today’s core validator checks the numeric range. Assume whole-number inputs. It does not yet safely handle text such as hello; we will name that limitation explicitly.',
    reading:'Before starting: input() reads text; int(...) converts a whole-number entry. An identifier is a variable’s name, such as books. Its value is the current data stored under that name. A comparison produces True or False.',
    evidence:'Your answers, code, runs and reflections are saved on this device. PDF export is available throughout, including unfinished attempts.',
    prompt:'Before the user begins, do we know exactly how many replacement inputs will be needed?',
    options:[choice('unknown','No. It depends on how many invalid entries the user makes.','The user may get it right immediately or need several attempts.'),choice('four','Yes. There must always be four replacement inputs.','The number of attempts is not fixed like the earlier four-group FOR task.'),choice('one','Yes. Every user must enter one invalid value first.','The first value might already be allowed, so no replacement would be needed.')],
    correct:'unknown',hint:'Could one user enter 8 immediately while another enters -1, 21 and then 8?',
    success:'Correct. The number of attempts is not known in advance. A condition decides whether another input is needed.'
  });
  p('starter-valid','starter','choice','Is this donation allowed?',{
    context:'The librarian accepts whole-number donations from 0 to 20 inclusive. Inclusive means that both 0 and 20 are allowed.',
    prompt:'A group enters 21. Should the program accept it?',
    options:[choice('reject','Reject it and request another number.','21 is greater than the upper limit, 20.'),choice('accept','Accept it.','Check the maximum: the allowed range ends at 20.'),choice('unsure','I am not sure yet.','Compare 21 with the maximum allowed value, 20.')],
    correct:'reject',hint:'Find the upper limit in the rule. Is 21 above it?',success:'Yes. 21 is outside the allowed range. The program needs another input.',syllabus:['3.2.4','3.2.12']
  });
  p('starter-once','starter','choice','What does checking once actually do?',{
    context:'This earlier version uses selection. The librarian enters 21 at its input prompt.',
    code:once,prompt:'Which two messages are printed, in order?',
    options:[choice('both','Invalid number. → Input check finished.','Both print statements are reached: one inside the if and one after it.'),choice('invalid','Only Invalid number.','The final print is outside the if. It still runs.'),choice('repeat','Invalid number. → another input prompt','There is no second input instruction and no loop in this program.')],
    correct:'both',hint:'Follow the indentation. Which print is outside the if?',success:'Correct. The error message does not prevent the final print from running.',ksu:'S'
  });
  p('starter-gap','starter','choice','What is missing from this version?',{
    context:'The same program rejects 21, but then finishes its check.',code:once,prompt:'Which change would let the program obtain an acceptable replacement?',
    options:[choice('loop','Repeat the input request while the number is invalid.','The user might make more than one mistake.'),choice('message','Make the error message longer.','A clearer message helps, but does not repeat the input request.'),choice('print','Print the entered number twice.','Printing does not replace the stored input.')],
    correct:'loop',hint:'Does an error message itself run input() again?',success:'Exactly. Selection checks once; a loop can keep requesting replacement input.',ksu:'U',syllabus:['3.2.2','3.2.12']
  });
  for(const k of ksu) p('types-'+k.id.toLowerCase(),'types','baseline',k.name+': where am I starting?',{
    ksu:k.id,prompt:k.can,context:k.id==='K'?'Use the starter as evidence. Knowing comparisons is useful prior knowledge; WHILE may still be new.':k.id==='S'?'Predicting the if program is an existing skill. Building a repeating input check is the skill we will practise next.':'Think about the reason for repeating input, not just whether you recognise the word loop.',
    evidence:k.proof,options:[choice('independent','I can do this independently.',''),choice('support','I can do some of this with an example.',''),choice('notyet','This is new or I need help to start.','')]
  });
  p('types-focus','types','focus','Choose one useful learning focus.',{
    prompt:'Which next step would help you most today?',context:'Choose based on what you can actually explain or do, not on what sounds most advanced.',
    options:[choice('K','Knowledge · Explain when a WHILE loop continues and stops.',''),choice('S','Skills · Build and test the repeating input check.',''),choice('U','Understanding · Explain why the input changes and why OR is used.','')],
    success:'Your focus is saved. We will revisit the same KSU statements near the end.'
  });
  p('m1-learn','main1','choice','A condition controls the repetition.',{
    studyCheck:true,
    read:['Study the flowchart for the donation record first. After each input, the program decides whether the value is outside the allowed range.',
      'WHILE checks its condition before its repeated body. When the condition is True, the body runs. The program then checks the condition again. When it is False, execution moves to the first instruction after the loop.',
      'The first input happens before the loop. The replacement input inside it can change books. If the first donation is already valid, the repeated body is skipped.'],
    image:img.flow,reading:'Textbook: printed pp. 46–47, Condition loops. This explanation is original lesson writing, not a verbatim extract.',
    note:'Follow the return arrow, then answer the check below. The next page shows a guided Python example. You do not need to write code yet.',
    prompt:'After a replacement input changes books to 8, where does the flowchart go next?',
    options:[choice('recheck','Check the WHILE condition again; leave the loop when it is False.','Each completed body returns to the condition before any decision to repeat or leave.'),choice('restart','Return to the first input before WHILE.','The return arrow does not go to the first input before WHILE.'),choice('skip','Skip the condition and always print the accepted output.','A replacement could still be invalid. The program must check it before accepting it.')],
    correct:'recheck',hint:'Follow the return arrow from the replacement input to the decision.',
    success:'Correct. Recheck the condition using the new value. Because 8 makes it False, execution continues after the loop.'
  });
  p('m1-predict','main1','number','Predict before running.',{
    studyCheck:true,
    context:'Before opening a record, the librarian must type Y. Any other response should cause another request. In this run, the first response is N and the next is Y. Follow the highlighted code, then count the reminder messages.',
    model:warmup,guideTitle:'Follow the Y-response example one step at a time',
    guide:[
      {line:1,description:'First input: the librarian enters N.',value:'ready = "N"'},
      {line:3,description:'N is not Y. The condition is True; enter the body.',value:'"N" != "Y" → True'},
      {line:4,description:'The program prints its reminder.',value:'Output: Please type Y.'},
      {line:5,description:'Replacement input: the librarian now enters Y.',value:'ready = "Y" (replaces N)'},
      {line:3,description:'Check again. Y is not different from Y, so leave the loop.',value:'"Y" != "Y" → False'},
      {line:7,description:'Run the output after the loop once.',value:'Output: Donation record ready.'}
    ],
    prompt:'How many times will Please type Y. be printed?',answer:'1',hint:'Only count the reminder inside the loop. The first input makes the condition True; the second makes it False.',
    success:'One time. N enters the body; Y makes the next condition check False.',ksu:'S'
  });
  p('m1-zero','main1','number','What if the first input is already correct?',{
    context:'This time the librarian enters Y at the very first prompt.',code:warmup,prompt:'How many times does the WHILE body execute?',answer:'0',
    hint:'The condition is checked before the body. Is Y different from Y?',success:'Zero. The initial input happens, but the repeated body is skipped because the condition is False.',ksu:'K'
  });
  p('m1-update','main1','choice','Find the line that makes progress possible.',{
    context:'The librarian first enters N. A later input must be able to replace it.',code:warmup,prompt:'Which line lets ready change after the loop has begun?',
    options:[choice('5','Line 5 · ready = input("Type Y to start: ")','This replacement input runs inside the repeated body.'),choice('1','Line 1 · the first input','Line 1 happens before the loop; the return to the condition does not repeat it.'),choice('4','Line 4 · print("Please type Y.")','Printing a reminder does not change ready.')],
    correct:'5',hint:'Look for an assignment inside the indented body, not just before it.',success:'Line 5 replaces ready. Without replacement input, N would keep the condition True.',ksu:'U',
    supplement:img.trace
  });
  p('m1-end-check','main1','choice','Check before, or check after?',{
    studyCheck:true,
    read:['OxfordAQA also expects you to understand a loop with its condition at the end. In REPEAT...UNTIL, the body runs before the first condition check.',
      'WHILE continues when its condition is True. REPEAT...UNTIL stops when its condition is True. Notice that their conditions express opposite decisions in this example.',
      'The WHILE example reads ready once before the body. The REPEAT example reads ready inside the body. If the first input is Y, the WHILE body runs zero times but the REPEAT body has already run once.'],
    image:img.compare,reading:'Textbook: printed pp. 50–51, Loops in pseudocode; pp. 52–53, End-conditional.',
    note:'Python has no native REPEAT...UNTIL statement. Read this as OxfordAQA pseudocode, not Python to paste into the Editor.',
    prompt:'In REPEAT...UNTIL, what happens when the UNTIL condition becomes True?',
    options:[choice('stop','The loop stops; execution continues after it.','UNTIL expresses the stopping condition.'),choice('repeat','The body repeats because True always means repeat.','True means continue for WHILE, but stop for UNTIL.'),choice('start','The program restarts from its first instruction.','Leaving a loop continues the program; it does not restart the entire program.')],
    correct:'stop',hint:'Read UNTIL as “repeat up to the point when this condition is True”.',
    success:'Correct. REPEAT...UNTIL stops when its condition is True. WHILE continues when its condition is True.'
  });
  p('m1-end-question','main1','choice','Explain the difference between the checks.',{
    context:'Use the two examples below. First input is Y in both cases.',image:img.compare,prompt:'Which explanation is accurate?',
    options:[choice('correct','WHILE checks before its body; REPEAT...UNTIL checks after its body.','The condition’s position changes the minimum number of body executions.'),choice('always','Both bodies must execute at least once.','WHILE can skip its body if the first condition is False.'),choice('true','Both loops stop when their condition is True.','WHILE continues when its condition is True; UNTIL stops when True.')],
    correct:'correct',hint:'Find the input line inside each repeated body. Where does its first condition check happen?',success:'Correct. Remember both the position of the check and what True means for that structure.'
  });
  p('m2-rules','main2','choice','Build the librarian’s range validator.',{
    studyCheck:true,
    ksu:'S',syllabus:['3.2.2','3.2.5','3.2.12'],
    read:['We now return to the real donation record for one tutor group. A whole-number donation from 0 to 20 is allowed. Zero means the group has no books to donate today.',
      'Your program must ask for books, reject an out-of-range number, explain the rule, and ask again. The user may need several attempts. Only after an allowed value is entered should it print Accepted donation: followed by that value.',
      'A valid number is at least 0 AND at most 20. A number is invalid if it is below 0 OR above 20. Either outside region is enough to require another input.'],
    image:img.range,reading:'Textbook: printed pp. 92–94, Validation. Selected reading supports the range rule and repetition.',
    note:'Use integer inputs for this core task. int(input(...)) is not a safe conversion for arbitrary text. This lesson’s program is a range validator, not a complete input parser.',
    model:validator,
    prompt:'The first donation entered is 20. What should the program do?',
    options:[choice('accept-boundary','Accept 20 immediately, without requesting a replacement.','20 is the included upper boundary.'),choice('reject-boundary','Reject 20 because it equals the maximum.','Inclusive means the maximum itself is allowed.'),choice('fixed-inputs','Ask four more times before deciding whether 20 is valid.','This validator repeats only while the value is invalid, not a fixed number of times.')],
    correct:'accept-boundary',hint:'Check whether the endpoint at 20 is included in the allowed range.',
    success:'Correct. 20 is allowed. The invalid-range condition is False, so the repeated body is skipped.'
  });
  p('m2-condition','main2','choice','Choose the condition that asks again.',{
    ksu:'U',syllabus:['3.2.4','3.2.5','3.2.12'],context:'We want the loop to repeat for -1 and 21, but to stop for 0, 8 and 20.',image:img.range,prompt:'Which Python condition belongs after while?',
    options:[choice('or','books < 0 or books > 20','Either outside region is invalid.'),choice('and','books < 0 and books > 20','No number can be below 0 and above 20 at the same time.'),choice('valid','books >= 0 and books <= 20','This describes valid values. Used directly after while, it would repeat for valid input.')],
    correct:'or',hint:'The WHILE condition must describe when we still need another input.',success:'Use OR. A value only needs to break one of the two range limits to be invalid.'
  });
  p('m2-build','main2','code','Make the input check repeat.',{
    ksu:'S',syllabus:['3.2.2','3.2.5','3.2.12'],workspace:'validator',initial:scaffold,model:validator,
    context:'The first input and final output are ready. Complete the missing loop in between. Keep the same books variable for replacement input.',
    prompt:'Complete a program that keeps asking while books is outside 0–20.',
    steps:['After the first input, write the invalid-range WHILE condition with a colon.','Inside the body, print Enter a whole number from 0 to 20.','Still inside the body, ask for books again using int(input(...)).','Keep the Accepted donation output outside the loop.'],
    evidence:'Save your code. Run / F5 executes it; answer each prompt directly in the Shell. The app records the source, actual inputs, outputs and errors automatically.',
    hint:'The repeated body needs both a message and a new assignment to books. Use four spaces for each body line.',
    support:validator,
    guide:[
      {line:1,description:'Read an integer before the first condition check.',value:'First input example: books = -1'},
      {line:3,description:'Check the two invalid regions with OR.',value:'-1 < 0 or -1 > 20 → True'},
      {line:4,description:'Tell the user the allowed range.',value:'This print does not change books.'},
      {line:5,description:'Request a replacement and store it in books.',value:'A new value replaces the old value.'},
      {line:3,description:'Return to the condition with the new value.',value:'If the new value is 8: False or False → False'},
      {line:7,description:'Only a value accepted by the range check reaches this output.',value:'Accepted donation: 8'}
    ]
  });
  p('m2-sequence','main2','test','Test two rejections, then acceptance.',{
    ksu:'S',syllabus:['3.2.12'],workspace:'validator',initial:scaffold,test:{id:'sequence',inputs:['-2','25','12'],accepted:12,rejections:2},
    context:'Use the SAME program from the previous page. These values are different from the study image so you can check the rule independently.',
    prompt:'Demonstrate that -2 and 25 are rejected before 12 is accepted.',
    steps:['Select Run / F5.','At successive Shell prompts, enter -2, then 25, then 12. Press Enter after each.','The range message should appear twice. The final output should be Accepted donation: 12.','Select Check this run to compare your recorded inputs and outputs with this test.'],
    evidence:'One complete run with all three actual inputs. No screenshot is required: the run record includes its source and Shell output.'
  });
  p('m2-lower','main2','test','Test the lower boundary.',{
    ksu:'S',syllabus:['3.2.12'],workspace:'validator',initial:scaffold,test:{id:'lower',inputs:['0'],accepted:0,rejections:0},
    context:'Zero is an allowed donation. A group might not have any books today.',prompt:'Demonstrate that 0 is accepted immediately.',
    steps:['Run the same program again.','Enter 0 at its first prompt.','It should print Accepted donation: 0 without displaying the range-error message.','Select Check this run.'],
    evidence:'A separate actual run with input 0. Its source is saved with that run.'
  });
  p('m2-upper','main2','test','Test the upper boundary.',{
    ksu:'S',syllabus:['3.2.12'],workspace:'validator',initial:scaffold,test:{id:'upper',inputs:['20'],accepted:20,rejections:0},
    context:'Twenty is the maximum allowed donation, but it is still inside the range.',prompt:'Demonstrate that 20 is accepted immediately.',
    steps:['Run the same program again.','Enter 20 at its first prompt.','It should print Accepted donation: 20 without displaying the range-error message.','Select Check this run.'],
    evidence:'A separate actual run with input 20. Passing only the middle value is not enough to establish correct boundaries.'
  });
  p('m2-explain','main2','text','Explain why the input line belongs inside.',{
    ksu:'U',syllabus:['3.2.2','3.2.12'],referenceWorkspace:'validator',
    prompt:'After an invalid first input, what would happen if you removed the replacement-input line from the loop?',
    context:'Use your own program below as a reference. Explain what happens to books, the condition and repetition. Two or three sentences are enough.',
    hint:'Which value would books still hold? Would the next condition check change?',
    criteria:['The invalid value would remain unchanged.','The condition would stay True.','The loop would repeat without reaching the accepted output.'],
    modelAnswer:'books would keep its invalid first value because no new input replaces it. The condition would remain True, so the loop would repeatedly print the error message and would not reach the final accepted output.'
  });
  p('extension-menu','extension','extensions','Choose one useful challenge.',{
    ksu:'S',read:['First finish the three core tests, or continue them with support. You do not need to complete the whole extension bank.',
      'Each challenge has its own saved workspace. Opening a challenge never replaces your core validator. Choose one that strengthens your next step, then return here when you are ready.'],
    note:'The lesson has five minutes for extension. An unfinished attempt is valid evidence; you can return to the permalink for more practice.'
  });
  const extensionBank=[
    {id:'ex-repair',title:'Repair the impossible condition',level:'Explain and repair',context:'A colleague accidentally joined the two invalid regions with and. The record now accepts out-of-range integers.',prompt:'Repair the condition and demonstrate that -1 is rejected before 8 is accepted.',initial:validator.replace('or books > 20','and books > 20'),hint:'Can a number be below 0 and above 20 simultaneously?',testText:'Enter -1, then 8. Expected: one range message, then Accepted donation: 8.'},
    {id:'ex-counter',title:'Count rejected attempts',level:'Adapt your program',context:'The librarian wants to know how often a user needed another attempt, without counting the accepted entry.',prompt:'Add a counter for rejected entries and print it after acceptance.',initial:validator,hint:'Initialise rejected_attempts before the loop. Increase it by 1 inside the invalid-input body.',testText:'Enter -1, 21, 8. Expected: accepted value 8; rejected attempts 2.'},
    {id:'ex-new-range',title:'Change the collection limit',level:'Transfer the rule',context:'For a special event, one group may donate between 1 and 50 books inclusive. Zero is no longer allowed.',prompt:'Adapt the range validator to accept 1–50 inclusive.',initial:validator,hint:'Change both limits, every prompt and the explanatory message. Test both new boundaries.',testText:'Separate runs: 1 accepts; 50 accepts. Run 0, 51, 12: two rejections, then 12 accepts.'},
    {id:'ex-age',title:'Check volunteer age',level:'Transfer the rule',context:'Library volunteers must be aged 11–16 inclusive. The organiser enters a whole-number age.',prompt:'Write a loop that requests age until it is from 11 to 16, then prints Volunteer age: followed by that age.',initial:'# Ask for age, repeat while invalid, then confirm it.\n',hint:'The two outside regions are age < 11 and age > 16.',testText:'Enter 10, 17, 13. Expected: two rejections, then Volunteer age: 13. Also test 11 and 16 separately.'},
    {id:'ex-grade',title:'Validate a percentage',level:'Transfer the rule',context:'A teacher records an integer percentage. Values below 0 or above 100 must not reach the report.',prompt:'Validate a percentage from 0 to 100 inclusive and print Accepted percentage: with its value.',initial:'# Keep asking for an integer percentage in range.\n',hint:'Do not reject the two valid endpoints.',testText:'Enter -1, 101, 75. Expected accepted percentage: 75. Separate runs: 0 and 100 accept immediately.'},
    {id:'ex-menu',title:'Accept either Y or N',level:'Boolean reasoning',context:'The librarian asks whether to open another donation record. Only the exact uppercase strings Y and N are allowed.',prompt:'Keep asking until the response is Y or N; then print Choice: followed by the accepted response.',initial:'choice = input("Another record? Y or N: ")\n\n# Repeat while choice is neither allowed response.\n\nprint("Choice:", choice)',hint:'For invalid input here, both comparisons must be True: choice != "Y" and choice != "N".',testText:'Enter X, then N. Expected: reject X and finish with Choice: N. Separate first input Y should finish immediately.'},
    {id:'ex-name-length',title:'Check a username’s length',level:'Use earlier string learning',context:'A demo username must contain 3–12 characters inclusive. This task checks length only, not identity or security.',prompt:'Use len() and a WHILE loop to request a username until its length is allowed.',initial:'username = input("Username (3-12 characters): ")\n\n# Repeat while its length is outside the range.\n\nprint("Accepted username:", username)',hint:'Use len(username) < 3 or len(username) > 12. A new input must replace username.',testText:'Enter Jo, then BookClub. Expected: reject Jo, accept BookClub. Separately test exactly 3 and exactly 12 characters.'},
    {id:'ex-presence',title:'Reject an empty entry',level:'Use earlier string learning',context:'A record needs a non-empty group name. For this small task, reject only the empty string; whitespace-only text is not handled yet.',prompt:'Ask for a group name until the input is not empty, then print Group: with the name.',initial:'group_name = input("Group name: ")\n\n# Repeat while the string is empty.\n\nprint("Group:", group_name)',hint:'Compare group_name == "" or use len(group_name) == 0. Pressing Enter at input() supplies an empty string.',testText:'Press Enter without typing, then enter 10T. Expected: another prompt, then Group: 10T.'},
    {id:'ex-repeat-theory',title:'Rewrite the algorithm in pseudocode',level:'Examination explanation',kind:'text',context:'Use the range rule 0–20 inclusive. An end-condition version should ask inside its repeated body.',prompt:'Write OxfordAQA REPEAT...UNTIL pseudocode that obtains an allowed donation.',referenceCode:validator,hint:'The UNTIL condition describes acceptance, not rejection: books >= 0 AND books <= 20.',modelAnswer:'REPEAT\n    books ← USERINPUT\nUNTIL books >= 0 AND books <= 20\nOUTPUT books',criteria:['Input is inside REPEAT.','UNTIL uses the valid range with AND.','The accepted value is output after the loop.']},
    {id:'ex-two-groups',title:'Validate two groups separately',level:'Stretch using previous FOR learning',context:'The librarian now records two tutor groups. Each group must supply one valid whole-number donation from 0 to 20.',prompt:'Put a validation routine inside a two-group FOR loop and print each group number with its accepted donation.',initial:'for group in range(1, 3):\n    # Read books, validate it, then print this group and books.\n    pass',hint:'The first input for books belongs inside FOR. Its WHILE loop requests replacements before FOR advances to the next group.',testText:'Enter -1, 5 for group 1, then 21, 0 for group 2. Expected accepted pairs: group 1, 5; group 2, 0.'}
  ];
  for(const e of extensionBank) p(e.id,'extension',e.kind||'code',e.title,{
    ...e,workspace:e.kind==='text'?undefined:e.id,ksu:e.kind==='text'?'U':'S',optional:true,
    syllabus:e.id==='ex-repeat-theory'?['3.2.2','3.2.5']:['3.2.2','3.2.12'],
    evidence:'Your source and each actual run are recorded in this separate challenge workspace. Keep an unfinished attempt if time runs out.',
    steps:e.kind==='text'?undefined:['Read the changed requirement and expected test.','Adapt the starting program in this challenge only.','Run the stated test in the Shell and compare what actually happened.'],
    model:e.id==='ex-counter'?'rejected_attempts = 0\n'+validator.replace('    print("Enter','    rejected_attempts = rejected_attempts + 1\n    print("Enter')+'\nprint("Rejected attempts:", rejected_attempts)':undefined
  });
  for(const k of ksu) p('pit-'+k.id.toLowerCase(),'pit','reflection',k.name+': what does my work show?',{
    ksu:k.id,prompt:k.can,evidence:k.proof,context:'Choose how this part of your learning feels now. This is a support signal, not a grade or a permanent label.',
    options:[
      choice('new','New learning · I am working through something new.','Next: trace one more example with written guidance.'),
      choice('consolidating','Consolidating · I can do more of this with growing independence.','Next: repeat a test or explanation without the model.'),
      choice('treading','Treading water · This is easy and I need more stretch.','Next: choose a different rule or the rejected-attempt counter.'),
      choice('help','Drowning / needing help · I need a smaller next step.','Next: request written help, a worked example or an agreed pause.')
    ]
  });
  p('pit-target','pit','text','Set one practical next step.',{
    ksu:'U',prompt:'What will you practise next, and how will you know it improved?',
    context:'Choose a real gap from your work. One specific action is enough. For example: “I will test 0 and 20 again and check that both are accepted without a range message.”',
    hint:'Name the line, comparison, boundary test or explanation you will practise. Avoid only writing “get better at coding”.',
    criteria:['Names a particular skill or concept.','Gives a practical action.','Identifies evidence that would show improvement.']
  });
  p('exit-zero','plenary','choice','One final check: zero iterations.',{
    prompt:'Can the body of a WHILE loop execute zero times?',
    options:[choice('yes','Yes, if its condition is False at the first check.','The check happens before the repeated body.'),choice('no','No, every loop body must run once.','That minimum applies to REPEAT...UNTIL, not WHILE.')],
    correct:'yes',hint:'Where is the WHILE condition checked?',success:'Yes. Be precise: the repeated body can be skipped, even though earlier input instructions may already have run.'
  });
  p('exit-or','plenary','text','Explain the OR decision.',{
    ksu:'U',syllabus:['3.2.5','3.2.12'],prompt:'Why does books < 0 or books > 20 detect invalid donations, but the same comparisons joined with and do not?',
    context:'Use -1 or 21 to support your explanation. Two sentences are enough.',
    hint:'An invalid number breaks either limit. Could one number break both of these limits simultaneously?',
    criteria:['Either outside region is enough to be invalid.','AND would require the number to be both below 0 and above 20.'],
    modelAnswer:'OR is True when either range limit is broken, so -1 or 21 causes another input. AND would require a number to be below 0 and above 20 at the same time, which is impossible.'
  });
  p('exit-limit','plenary','choice','Know what your validator does not yet check.',{
    ksu:'U',syllabus:['3.2.12'],context:'The core program starts with books = int(input(...)).',prompt:'What happens if the user types hello instead of a whole number?',
    options:[choice('error','int(...) raises a conversion error before the range loop can check it.','This program checks numeric range, not arbitrary text input.'),choice('safe','The loop safely rejects hello and always asks again.','The conversion runs before the numeric comparisons. It is not protected here.')],
    correct:'error',hint:'Can int(\"hello\") produce an integer?',success:'Correct. A range check alone is not complete input robustness. We would need an additional safe-input strategy to handle non-numeric text.'
  });
  p('finish','finish','finish','Save your evidence. Then turn it in.',{
    read:['Export your PDF even if some work is unfinished. The report labels saved attempts, unchecked responses, run results, reflections and missing evidence honestly.',
      'Open the saved PDF and check that your name, class, code, Shell outputs and any screenshot evidence are readable.',
      'In Microsoft Teams, open Year 10 Computer Science → Assignments → the WHILE loops and validation assignment. Choose Add work / Attach, upload this PDF, then select Turn in. If your teacher has not created the assignment yet, keep the file and ask where to submit it.'],
    note:'Exporting a PDF or marking the notebook complete does not upload or turn in an assignment in Teams.'
  });
  window.WHILE_LESSON=Object.freeze({
    id:'year10_while_loops_validation',version:'while-slide-v1',title:'WHILE loops · Keep asking until it is valid',duration:60,
    wagba:'Control repetition and explain how a program accepts valid input.',ksu,groups,pages,models:{warmup,validator,scaffold},images:img,
    sources:[
      {title:'OxfordAQA 9210 specification · 3.2.2, 3.2.4, 3.2.5 and 3.2.12',url:'https://www.oxfordaqa.com/wp-content/uploads/2023/10/oxfordaqa-gcse-computer-science-specification.pdf'},
      {title:'OxfordAQA teaching guidance · pseudocode WHILE and REPEAT...UNTIL',url:'https://www.oxfordaqa.com/oaqaresources/computer-science/9210-international-gcse-computer-science-teaching-guidance-v1.0.pdf'},
      {title:'Textbook reading · printed pp. 46–47, 50–53 and 92–94',note:'Use your class copy. PDF page numbers are four pages higher than printed page numbers. No book pages are redistributed here.'},
      {title:'Python documentation · while statement',url:'https://docs.python.org/3/reference/compound_stmts.html#the-while-statement'},
      {title:'Teach Computing · reading, tracing and PRIMM',url:'https://teachcomputing.org/pedagogy'},
      {title:'W3C · clear step-by-step instructions',url:'https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/'}
    ]
  });
})();
