window.LESSON = {
  id: 'y11-pre-mock-review-v1',
  title: 'Find the gap. Repair it. Prove it.',
  wagba: 'Using precise computer science knowledge to explain answers, solve problems and recognise what we need to practise next.',
  stages: [
    ['start','Read first','3 min'], ['starter','Do Now','7 min'], ['types','Types of learning','2 min'],
    ['repair','Main Task 1','13 min'], ['read','Focused reading','8 min'],
    ['exam','Main Task 2','17 min'], ['pit','Learning Pit Stop','3 min'], ['extension','Extension','If ready'], ['exit','Plenary','7 min'], ['tracker','My revision record','Ongoing']
  ],
  topics: [
    {id:'E',name:'Embedded systems',spec:'3.4.4',ref:'Chapter 7.1: Embedded systems, pp. 202–203',
      skills:[['E1','Define an embedded system'],['E2','Distinguish embedded and general-purpose systems']],
      reading:[
        'An embedded system is a computer system that forms part of a larger electrical or mechanical system. It is designed to carry out one task or a limited set of specific tasks. A washing-machine controller monitors inputs and controls the washing cycle; it is not intended to run an arbitrary range of applications.',
        'A general-purpose computer, such as a desktop computer, can run different applications for different purposes. Both kinds of system can contain a processor and memory. Having a processor does not distinguish one from the other: their purpose and how they are used do.',
        'Embedded does not mean “simple”, “not connected to the internet” or “unable to receive updates”. Some embedded systems are complex and connected. For an exam comparison, use a clear paired difference: a dedicated control purpose versus running a range of applications.'
      ],
      example:'A controller built into a lift reads button and position-sensor inputs and controls the motor and floor display. A laptop can run a spreadsheet, browser and image editor. Explain their different purposes rather than claiming that only one has memory.',
      task:'A dishwasher has a built-in controller. It reads door and temperature sensors and controls the heater and water pump. A technician also uses a laptop for email, reports and diagnostics. Explain why the dishwasher controller is embedded and give a precise comparison with the laptop.',
      prompts:['What larger system contains the controller? What specific purpose does it serve?','Write one paired difference about the software or range of tasks.'],
      answers:['The controller is a computer within the dishwasher, dedicated to controlling its washing cycle.','The controller runs software for a limited control purpose; the laptop can run different applications for many purposes. Both may contain processors and memory.'],
      check:'Would adding Wi-Fi to the dishwasher make its controller general-purpose? Explain.',
      checkAnswer:'No. A network connection does not change its dedicated role within the dishwasher.'},
    {id:'N',name:'Networks',spec:'3.5',ref:'Chapter 8: Networks and protocols, pp. 226–239; network security, pp. 248–249',
      skills:[['N1','Identify and explain topology'],['N2','Explain LAN/WAN and network benefits/risks'],['N3','Choose a medium for a scenario'],['N4','Explain protocol purposes and TCP/IP layers'],['N5','Explain authentication, encryption, firewalls and MAC filtering']],
      reading:[
        'A computer network connects computers or other devices so that they can communicate and share resources. A LAN normally covers a small geographical area and is usually managed by one organisation. A WAN connects devices across a wider geographical area; geographical scale matters more than the number of devices.',
        'In a star topology, each device connects to a central switch. If one device cable fails, the other connections can still work. If the central switch fails, communication through it is affected. In a bus topology, devices share a backbone cable. A backbone failure can prevent communication across the network. Be explicit about which component fails.',
        'Copper carries electrical signals and is often economical for shorter fixed connections. Fibre carries light and is suitable for higher-bandwidth or longer links and is resistant to electromagnetic interference. Wireless supports mobile devices but has coverage, interference and security considerations.',
        'A protocol supplies rules for communication. SMTP sends email; IMAP accesses server-held email; HTTPS protects web communication using encryption. In the four-layer TCP/IP model, applications use the application layer, TCP/UDP operate at transport, IP at network, and network hardware at link. Do not confuse a transport-layer protocol with a web protocol.'
      ],
      example:'For fixed office desktops near a cabinet, copper may be economical. For a 350 m connection near electrical equipment carrying large video files, fibre is more suitable. “Faster” alone is less convincing than linking bandwidth, distance and interference to the stated requirements.',
      task:'A school LAN uses a star topology. Each of 12 desktops has its own cable to a switch. A media building 350 m away transfers large video files and is close to electrical machinery. Mobile tablets are used in the library. Annotate the supplied diagram and justify suitable connections.',
      prompts:['Explain separately what happens if one desktop cable fails and if the switch fails.','Choose a medium for the media-building link and a method for the tablets. Link each choice to the scenario.'],
      answers:['A single desktop cable failure disconnects that desktop, not all other desktops. A switch failure prevents the connected devices communicating through that switch.','Fibre: suitable for the distance, large transfers and resistance to electrical interference. Wireless/Wi-Fi: permits the tablets to move without a physical cable.'],
      check:'Two distant campuses each have a LAN. What type of network connects the campuses? What does IMAP do?',
      checkAnswer:'A WAN links the distant sites. IMAP accesses and manages email held on an email server; SMTP is used to send email.'},
    {id:'C',name:'Cyber security',spec:'3.6–3.6.2',ref:'Chapter 9: Security, pp. 240–253',
      skills:[['C1','Explain a threat and its mechanism'],['C2','Justify a suitable protection'],['C3','Explain penetration testing'],['C4','Distinguish social engineering techniques'],['C5','Explain biometrics, passwords, CAPTCHA and email confirmations']],
      reading:[
        'Cyber security uses processes, practices and technologies to protect networks, computers, programs and data from attack, damage or unauthorised access. Naming a threat is only the beginning: explain how it can cause harm.',
        'Phishing uses deceptive messages to persuade someone to disclose information or follow a harmful link. Pharming redirects users to a fraudulent website. Blagging uses an invented story to obtain information, and shoulder surfing involves observing confidential information. Distinguish how the attack reaches the victim.',
        'Malware is malicious software. A virus attaches to other programs or files and can spread when infected code runs. A worm can spread across networks; a Trojan appears legitimate while hiding harmful functionality. Unpatched software can retain known vulnerabilities, and incorrectly assigned access rights can allow someone to view or change data they should not access.',
        'Choose protection for the mechanism: staff training and checking a message through a trusted route address phishing; updates patch vulnerabilities; appropriate access rights limit unauthorised actions. Authentication checks identity; encryption protects data from being understood without the necessary key. Penetration testing is authorised testing for exploitable weaknesses, not permission for students to attack a live system.'
      ],
      example:'“Use security” is too vague. A stronger explanation is: automatic updates install patches for known vulnerabilities, reducing the opportunity for an attacker to exploit those weaknesses.',
      task:'An employee receives an email claiming to be from the school IT team. It links to a look-alike login page and asks for a password. Separately, a shared computer has not received security updates for six months. Identify the two risks and explain an appropriate response to each.',
      prompts:['Explain how the deceptive message could lead to unauthorised access.','Explain why updates address the second risk; distinguish this from protecting against the deceptive email.'],
      answers:['Phishing: the message tricks the employee into entering credentials on a fraudulent page, allowing an attacker to use them. Verify requests through a known contact route and avoid entering credentials through the suspicious link.','Unpatched software may contain known vulnerabilities. Installing security updates patches those weaknesses. Updates alone do not stop an employee voluntarily disclosing a password.'],
      check:'An administrator gives all users permission to delete payroll records. Why is a strong password alone insufficient?',
      checkAnswer:'Authenticated users still have inappropriate permissions. Correct access rights are needed to prevent those users deleting records.'},
    {id:'D',name:'Databases and SQL',spec:'3.7.1–3.7.3',ref:'Chapter 10: Database design and SQL, pp. 254–271',
      skills:[['D1','Explain primary/foreign keys and relationships'],['D2','Retrieve related records using SQL'],['D3','Modify only the intended records'],['D4','Explain redundancy/inconsistency and field design']],
      reading:[
        'A table stores records with the same fields. A primary key uniquely identifies each record. A foreign key is a field used to reference a key in another table; in the simple designs used here it references that table’s primary key. Foreign-key values may repeat: many bookings can belong to one member.',
        'Storing a member’s contact details once in a Member table avoids copying them into every booking. Repeated data is redundancy. Conflicting copies, such as two different phone numbers for the same member, create inconsistency. A relational design reduces these problems by storing related data in linked tables.',
        'SELECT chooses output fields, FROM identifies source tables, and WHERE selects matching records. A two-table query also needs the linking condition: Member.MemberID = Booking.MemberID. Without it, unrelated records can be combined.',
        'INSERT INTO adds a record; UPDATE changes existing records; DELETE FROM removes records. Use a precise WHERE condition when changing only particular records. UPDATE Booking SET Session = "PM" WHERE BookingID = 502 changes one booking. Without WHERE, every booking would change. Use the exact field and table names given in the question.'
      ],
      example:'SELECT Member.Name, Booking.Session FROM Member, Booking WHERE Member.MemberID = Booking.MemberID AND Booking.Session = "PM" returns member names and sessions for the matching PM bookings, not all possible combinations of members and bookings.',
      task:'The Member and Booking tables are shown beside the task. Explain their relationship. Write a query listing each member name and session for PM bookings, then write a command changing only BookingID 502 to the AM session. Predict the records affected before checking.',
      prompts:['Identify both primary keys and the foreign key. Explain why the foreign key can repeat.','Write the SELECT query and the UPDATE command. Explain the linking condition and WHERE condition.'],
      answers:['Member.MemberID and Booking.BookingID are primary keys. Booking.MemberID is the foreign key referencing Member.MemberID. It can repeat because a member may have multiple bookings.','SELECT Member.Name, Booking.Session FROM Member, Booking WHERE Member.MemberID = Booking.MemberID AND Booking.Session = "PM"; UPDATE Booking SET Session = "AM" WHERE BookingID = 502; initially the SELECT returns Ali / PM and Bea / PM. The UPDATE affects only booking 502.'],
      check:'Why should Session not be the primary key of Booking? What would happen if the UPDATE had no WHERE?',
      checkAnswer:'Several bookings can have the same session, so Session is not unique. Omitting WHERE changes every Booking record.'},
    {id:'P',name:'Core programming',spec:'3.1.1; 3.2.2, 3.2.4–3.2.5, 3.2.12',ref:'Chapters 2 and 3: selection, iteration, validation, testing and trace tables',
      skills:[['P1','Trace selection and iteration'],['P2','Construct a range-validation algorithm'],['P3','Choose and justify test data'],['P4','Explain algorithm, abstraction and decomposition'],['P5','Use data types, operators and data structures'],['P6','Explain file handling and subroutines'],['P7','Apply string operations and random number generation']],
      reading:[
        'Assignment stores a value in a variable. Selection chooses which instructions execute; iteration repeats instructions. When tracing, follow execution order rather than guessing the final result. Record the initial values and then each change. Read whether a loop includes its end value.',
        'A range check tests whether a value lies within stated limits. If valid integers are 1 to 7 inclusive, the invalid condition is Day < 1 OR Day > 7. OR is needed because either violation is invalid. Using AND would require a number to be below 1 and above 7 at the same time.',
        'Normal test data is typical valid input, such as 4. Boundary tests examine the stated limits and values close to them: 1 and 7 should be accepted, while 0 and 8 should be rejected for this range. A value outside the permitted range is also erroneous data. State the expected result for every test; a label alone is not enough.',
        'For a question that states input is an integer, solve the stated numeric validation problem. Do not add string conversion or exception-handling requirements that the question has not asked for. A validation loop must request a new input after an invalid value, not endlessly test the same invalid value.'
      ],
      example:'For valid integer scores 0 to 20 inclusive, Score < 0 OR Score > 20 identifies invalid values. Test 10 (accept), 0 and 20 (accept), -1 and 21 (reject). Follow the exact range and assumptions in the question.',
      task:'First trace the supplied algorithm with Values = [2, 7, 4]. Record initial Total and every update. Then plan a flowchart that requests an integer Day from 1 to 7 inclusive, rejects out-of-range values and requests another input until the value is valid. All inputs in this task are integers.',
      prompts:['Complete the trace table and explain why only some values increase Total.','Write the invalid condition, show where input is requested again, and give test data with expected outcomes.'],
      answers:['Initial Total = 0. At Index 0, Value 2 does not exceed 3 so Total remains 0. At Index 1, Value 7 makes Total 7. At Index 2, Value 4 makes Total 11. Output is 11.','Day < 1 OR Day > 7; request input again inside the invalid loop. Accept 4, 1 and 7; reject 0 and 8. Include an input such as 0 followed by 4 to check that re-input terminates correctly.'],
      check:'A valid Day has been entered, but the program asks for input forever. What part of the algorithm would you inspect first?',
      checkAnswer:'Inspect the loop condition, the point where Day receives a new value, and whether the condition is re-evaluated. The loop should stop once Day is in the valid range.'}
  ],
  starter: [
    {id:'S-E',topic:'E',skill:'E2',max:2,question:'A washing-machine controller is built into the machine to control washing cycles. A laptop runs email, spreadsheets and games. Explain why the controller is an embedded system and state one difference in purpose from the laptop.',answer:'1 mark: a computer system within the washing machine / larger system. 1 mark: it has a dedicated or limited control purpose whereas the laptop runs a range of applications.'},
    {id:'S-N',topic:'N',skill:'N3',max:2,question:'A media building is 350 m from a server room. The link carries large video files and passes near electrical equipment. Choose copper or fibre and explain one relevant reason for your choice.',answer:'1 mark: fibre. 1 mark: a linked reason such as suitability for the longer distance, higher bandwidth for the video transfers, or resistance to electromagnetic interference.'},
    {id:'S-C',topic:'C',skill:'C2',max:2,question:'A computer has missed security updates for six months. Explain how installing the updates can reduce the risk of an attack.',answer:'1 mark: updates install patches/fixes for known security vulnerabilities. 1 mark: this reduces the opportunity for attackers to exploit those vulnerabilities. Do not credit only “makes it safer”.'},
    {id:'S-D',topic:'D',skill:'D3',max:2,question:'Booking has fields BookingID, MemberID and Session. Explain the effect of this command: UPDATE Booking SET Session = "PM" WHERE BookingID = 502.',answer:'1 mark: changes the Session value to PM. 1 mark: only the record with BookingID 502 is changed; other records are unchanged.'},
    {id:'S-P',topic:'P',skill:'P2',max:2,question:'All inputs are integers. Valid Day values are 1 to 7 inclusive. Write a Boolean condition that is true for an invalid Day and give one invalid value.',answer:'1 mark: Day < 1 OR Day > 7, or equivalent NOT (Day >= 1 AND Day <= 7). 1 mark: an integer below 1 or above 7, such as 0 or 8.'}
  ],
  routes:[
    {id:'A',name:'Embedded systems + networks',marks:10,items:[['A-E1','2019-06','13.1',1,'E1'],['A-E2','2019-06','13.2',2,'E2'],['A-N1','2019-06','03.1',1,'N1'],['A-N2','2019-06','03.2',1,'N2'],['A-N3','2022-06','10.1',1,'N2'],['A-N4','2022-06','10.2',4,'N2']],images:['a-embedded','a-topology','a-networks']},
    {id:'B',name:'Cyber security + databases',marks:11,items:[['B-D1','2020-11','10.1',2,'D1'],['B-D2','2020-11','10.2',4,'D2'],['B-D3','2020-11','10.3',1,'D3'],['B-C1','2024-06','10.1',3,'C1'],['B-C2','2024-06','10.2',1,'C1']],images:['b-database-1','b-database-2','b-malware']},
    {id:'C',name:'Core programming + validation',marks:12,items:[['C-P1','2022-06','07.1',5,'P1'],['C-P2','2022-06','07.2',1,'P1'],['C-P3','2023-11','01.1',2,'P4'],['C-P4','2023-11','01.2',4,'P2']],images:['c-trace','c-flowchart-1','c-flowchart-2']}
  ],
  extension:{marks:11,items:[['X-C1','2019-06','03.3',6,'C2'],['X-N1','2019-06','03.4',1,'N4'],['X-N2','2019-06','03.5',1,'N4'],['X-C2','2025-06','08.2',1,'C5'],['X-C3','2025-06','08.3',2,'C2']]},
  traceCode:'Values ← [2, 7, 4]\nTotal ← 0\nFOR Index ← 0 TO 2\n    IF Values[Index] > 3 THEN\n        Total ← Total + Values[Index]\n    ENDIF\nENDFOR\nOUTPUT Total',
  schoolTypes:['Knowledge: recall the terms and rules.','Skills: perform a trace, construct a query or build a precise explanation.','Understanding: explain why a method works and transfer it to another situation.'],
  phases:['New learning','Consolidating','Treading water','Drowning'],
  phaseActions:{'New learning':'Try a fresh example with less help.','Consolidating':'Apply the idea to a different situation.','Treading water':'Ask for the extension or a more demanding application.','Drowning':'Identify the first unclear step and ask for a worked example or teacher help.'}
};
