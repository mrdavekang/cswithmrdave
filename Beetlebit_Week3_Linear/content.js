/* Week 3: one linear Next/Back journey. */
window.BeaconContent={
  "title": [
    "Make a rescue beacon",
    "구조 신호등 만들기"
  ],
  "wagba": [
    "Build, test and improve sequences, then control a micro:bit signal by radio.",
    "명령의 순서를 만들고 확인하고 개선한 뒤, 무선으로 micro:bit 신호를 조종해요."
  ],
  "goals": {
    "K": [
      "Know that order matters and radio sends messages between micro:bits.",
      "명령의 순서가 중요하고 radio가 micro:bit 사이에 메시지를 보낸다는 것을 알아요."
    ],
    "S": [
      "Arrange instructions, build a beacon, then program a controller and receiver.",
      "명령을 순서대로 놓고 신호등을 만든 뒤, 송신기와 수신기를 코딩해요."
    ],
    "U": [
      "Explain how a received message starts a sequence on the other micro:bit.",
      "메시지를 받으면 다른 micro:bit에서 명령이 어떻게 시작되는지 설명해요."
    ]
  },
  "cards": [
    {
      "id": "read",
      "stage": [
        "Read now",
        "읽고 시작하기"
      ],
      "title": [
        "A signal the rescue team can see.",
        "구조 팀이 볼 수 있는 신호를 만들어요."
      ],
      "intro": [
        "The robot parts have not arrived. Today, your micro:bit becomes a rescue beacon.",
        "아직 로봇 부품이 도착하지 않았어요. 오늘은 micro:bit를 구조 신호등으로 만들어요."
      ],
      "mins": 5,
      "teacher": "Linear 22-screen journey. Pupils only need the fixed Back and Next buttons. Three sequencing challenges appear separately, then the local MakeCode build and both radio challenges. These are the same activities, divided into smaller steps; the overall pacing remains 90 minutes. Support can be used at any step and completion does not lock navigation. Teacher mode alone provides direct jumping. No motors or compulsory functions. Label board pairs CONTROLLER and BEACON, assign distinct groups, and share coding/testing roles.",
      "section": "start"
    },
    {
      "id": "recall",
      "stage": [
        "Do now",
        "바로 해 보기"
      ],
      "title": [
        "Find what starts the program.",
        "무엇이 프로그램을 시작할까요?"
      ],
      "intro": [
        "Read the small block guide. Predict before pressing a button.",
        "작은 블록 안내를 읽어요. 버튼을 누르기 전에 예상해요."
      ],
      "mins": 5,
      "teacher": "Diagnostic retrieval: event → output. Do not assume that Week 1 or 2 attendance equals independent editor use. Accept pointing, Korean or English. The guide shows a Diamond icon inside Button A, not a complete blinking beacon.",
      "section": "start"
    },
    {
      "id": "goals",
      "stage": [
        "Types of learning",
        "배움의 종류"
      ],
      "title": [
        "Know it. Build it. Explain it.",
        "알고, 만들고, 설명해요."
      ],
      "intro": [
        "The goal is a program you can change and explain—not a long worksheet.",
        "목표는 긴 활동지를 채우는 것이 아니라, 직접 바꾸고 설명할 수 있는 프로그램을 만드는 거예요."
      ],
      "mins": 3,
      "teacher": "Core vocabulary: sequence, event, pause, debug. Most computing time belongs in MakeCode. Language goal: name a block, describe an order, and explain one deliberate change. Korean support is independent of computing readiness.",
      "section": "start"
    },
    {
      "id": "map",
      "stage": [
        "Main task 1 · Sequence 1 of 3",
        "주요 활동 1 · 순서 도전 1 / 3"
      ],
      "title": [
        "Fix the turn.",
        "회전 명령을 고쳐요."
      ],
      "intro": [
        "One instruction is wrong. Change it, then test the short route.",
        "명령 하나가 잘못됐어요. 바꾼 뒤 짧은 경로를 확인해요."
      ],
      "mins": 5,
      "teacher": "Supported four-command repair: F R F S. The turn changes the heading without changing square. Next opens Sequence 2, not the MakeCode editor.",
      "section": "sequence"
    },
    {
      "id": "map-long",
      "stage": [
        "Main task 1 · Sequence 2 of 3",
        "주요 활동 1 · 순서 도전 2 / 3"
      ],
      "title": [
        "Build a route with two turns.",
        "두 번 도는 경로를 만들어요."
      ],
      "intro": [
        "Use eight commands to reach the flag. Stay out of the blocked squares.",
        "명령 여덟 개로 깃발에 도착해요. 막힌 칸은 피해서 가요."
      ],
      "mins": 5,
      "teacher": "Five F, two R, one S. Solution: F F R F F R F S. Start bottom left, facing up; the second right turn points down. Pupils needing help can trace with a partner. Next always opens Sequence 3; there is no hidden tab.",
      "section": "sequence"
    },
    {
      "id": "signal",
      "stage": [
        "Main task 1 · Sequence 3 of 3",
        "주요 활동 1 · 순서 도전 3 / 3"
      ],
      "title": [
        "Put the signal in order.",
        "신호를 순서대로 놓아요."
      ],
      "intro": [
        "Move the blocks up or down: diamond, wait, dark gap, wait, tick.",
        "블록을 위아래로 옮겨요. 마름모, 기다리기, 끄기, 기다리기, 체크 표시 순서예요."
      ],
      "mins": 5,
      "teacher": "Target: diamond, pause, clear screen, pause, tick. The two pause tiles are interchangeable. This remains a browser model; the following screen begins the real MakeCode build.",
      "section": "sequence"
    },
    {
      "id": "editor",
      "stage": [
        "Main task 2 · MakeCode",
        "주요 활동 2 · MakeCode"
      ],
      "title": [
        "Open MakeCode. Light it up.",
        "MakeCode를 열고 불을 켜요."
      ],
      "intro": [
        "Find the toolbox and workspace. Make Button A show a diamond.",
        "블록 목록과 작업 공간을 찾아요. A 버튼을 누르면 마름모가 나타나게 만들어요."
      ],
      "mins": 7,
      "teacher": "Students build in the actual MakeCode Blocks editor, not this lesson page. A simplified editor-location guide is provided, explicitly not a live editor. New project preserves earlier radio work. Remove unused forever, place on button A pressed from Input, then show icon (Diamond) from Basic. Optional starter contains only A → Diamond and an initial tick, not the completed animation. Check each partner can identify the event container.",
      "section": "build"
    },
    {
      "id": "beacon-one",
      "stage": [
        "Main task 2 · Beacon build 1 of 3",
        "주요 활동 2 · 신호 만들기 1 / 3"
      ],
      "title": [
        "Make one flash.",
        "한 번 깜박이게 만들어요."
      ],
      "intro": [
        "Keep your diamond. Add a pause, clear screen and another pause.",
        "마름모는 그대로 두어요. pause, clear screen, pause를 차례로 추가해요."
      ],
      "mins": 4,
      "teacher": "First beacon-building step only. A → Diamond → pause 500 → clear screen → pause 500. Check the dark gap. The fixed Next button opens the second-flash screen.",
      "section": "build"
    },
    {
      "id": "beacon-two",
      "stage": [
        "Main task 2 · Beacon build 2 of 3",
        "주요 활동 2 · 신호 만들기 2 / 3"
      ],
      "title": [
        "Add the second flash and tick.",
        "두 번째 깜박임과 체크 표시를 넣어요."
      ],
      "intro": [
        "Repeat the four instructions once more. Put a tick at the very end.",
        "네 명령을 한 번 더 넣어요. 맨 끝에 체크 표시를 넣어요."
      ],
      "mins": 4,
      "teacher": "Keep the first four commands, copy them once, then append Yes. Add Yes to on start. One-flash consolidation support remains available. Next opens the dedicated test screen.",
      "section": "build"
    },
    {
      "id": "beacon",
      "stage": [
        "Main task 2 · Beacon build 3 of 3",
        "주요 활동 2 · 신호 만들기 3 / 3"
      ],
      "title": [
        "Test your two-flash program.",
        "두 번 깜박이는 프로그램을 확인해요."
      ],
      "intro": [
        "Press A in MakeCode. Watch for two flashes, dark gaps and a finishing tick.",
        "MakeCode에서 A를 눌러요. 두 번 깜박이고 사이에 꺼진 뒤 체크 표시가 나오는지 봐요."
      ],
      "mins": 2,
      "teacher": "Core sequence: on A → Diamond, pause 500, clear screen, pause 500; repeat these four commands as a second copied section; then show icon Yes. Loops are optional later. Add Yes to on start. The pause following clear screen creates a visible dark gap. showIcon includes its own default interval (600 ms), so do not describe total lit time as exactly 500 ms. Wait for completion before pressing again; no emergency-stop claim. A supported pupil may secure one flash and a tick before adding the second.",
      "section": "build"
    },
    {
      "id": "transfer",
      "stage": [
        "Main task 2 · Transfer and test",
        "주요 활동 2 · 옮기고 확인하기"
      ],
      "title": [
        "Put your code on the micro:bit.",
        "만든 코드를 micro:bit로 옮겨요."
      ],
      "intro": [
        "Test in MakeCode first. Transfer your code, then press the real A button.",
        "먼저 MakeCode에서 확인해요. 코드를 옮긴 뒤 실제 기기의 A 버튼을 눌러요."
      ],
      "mins": 8,
      "teacher": "Device-specific instructions follow the micro:bit Foundation guidance checked 16 Sep 2026. Computers: data USB cable; Download/pair or save .hex and copy to MICROBIT. iPad: official micro:bit iOS app for Bluetooth transfer, not desktop USB steps. Android: compatible USB data/OTG route in Chrome/Edge or official app. Prepare apps/permissions/cables before the session; keep a teacher transfer station. Simulator-only is an honest fallback, not hardware success. The editable .mkcd file is NOT firmware.",
      "section": "build"
    },
    {
      "id": "play",
      "stage": [
        "Main task 2 · Change and play",
        "주요 활동 2 · 바꾸고 탐색하기"
      ],
      "title": [
        "Change it. Play. Test it again.",
        "바꾸고, 탐색하고, 다시 확인해요."
      ],
      "intro": [
        "Swap roles. Try one small change, then take your signal wireless.",
        "역할을 바꿔요. 한 가지를 바꿔 본 뒤 무선 신호에 도전해요."
      ],
      "mins": 4,
      "teacher": "A brief choice, not three compulsory tasks. Swap roles. Change one pause to compare timing, draw a team LED symbol, OR add B → Happy for a separate local input. Then save the local beacon before creating separate controller/receiver projects. This local B event is not the radio B → SAFE event. A and B display handlers do not cancel each other; wait for the sequence to finish. Oral explanation is sufficient.",
      "section": "build"
    },
    {
      "id": "radio1",
      "stage": [
        "Main task 2 · Radio 1 · Sender",
        "주요 활동 2 · 무선 도전 1 · 송신기"
      ],
      "title": [
        "Radio 1: make the controller.",
        "무선 도전 1: 송신기를 만들어요."
      ],
      "intro": [
        "Pressing A will send HELP to your partner’s micro:bit. Build the sender first.",
        "A를 누르면 친구의 micro:bit로 HELP를 보내요. 먼저 송신기를 만들어요."
      ],
      "mins": 3,
      "teacher": "Radio 1, step 1 of 3. Preserve the local beacon; create W3-Controller. Add the assigned group to on start, and A → radio send string HELP. The block guide is visible. Next builds the receiver.",
      "section": "radio"
    },
    {
      "id": "radio1-receiver",
      "stage": [
        "Main task 2 · Radio 1 · Receiver",
        "주요 활동 2 · 무선 도전 1 · 수신기"
      ],
      "title": [
        "Radio 1: make the beacon listen.",
        "무선 도전 1: 신호등이 메시지를 받게 해요."
      ],
      "intro": [
        "Receiving HELP should start the flashing sequence on the other board.",
        "다른 기기에서 HELP를 받으면 깜박이는 순서가 시작되게 해요."
      ],
      "mins": 4,
      "teacher": "Radio 1, step 2 of 3. Copy the local beacon to W3-Receiver; use the same group. Move A’s blocks into if receivedString = HELP inside the single radio receive-string event. Remove the old empty A event. Supported receiver starter is available. Next transfers and tests both boards.",
      "section": "radio"
    },
    {
      "id": "radio1-test",
      "stage": [
        "Main task 2 · Radio 1 · Test",
        "주요 활동 2 · 무선 도전 1 · 확인"
      ],
      "title": [
        "Radio 1: test the remote signal.",
        "무선 도전 1: 무선 신호를 확인해요."
      ],
      "intro": [
        "Transfer both projects. Press A on CONTROLLER and watch BEACON.",
        "프로젝트 두 개를 전송해요. 송신기의 A를 누르고 수신기를 살펴봐요."
      ],
      "mins": 3,
      "teacher": "Radio 1, step 3 of 3. Transfer to correctly labelled boards. Test CONTROLLER A → BEACON flashes, wait, then repeat with roles swapped. The transfer help opens a dialog at the current step; closing it never changes the step. Keep peer tracing separate from hardware tests. Group-mismatch question and troubleshooting are on this screen.",
      "section": "radio"
    },
    {
      "id": "radio2",
      "stage": [
        "Main task 2 · Radio 2 · Sender",
        "주요 활동 2 · 무선 도전 2 · 송신기"
      ],
      "title": [
        "Radio 2: give B a new message.",
        "무선 도전 2: B에 새 메시지를 넣어요."
      ],
      "intro": [
        "Keep A → HELP. Add B → SAFE on the controller.",
        "A → HELP는 유지해요. 송신기에 B → SAFE를 추가해요."
      ],
      "mins": 3,
      "teacher": "Radio 2, step 1 of 4. Same controller as Radio 1. Preserve A and add the B event sending the exact literal SAFE. Consolidation is allowed; no new completion gate.",
      "section": "radio"
    },
    {
      "id": "radio2-receiver",
      "stage": [
        "Main task 2 · Radio 2 · Receiver",
        "주요 활동 2 · 무선 도전 2 · 수신기"
      ],
      "title": [
        "Radio 2: make SAFE show a heart.",
        "무선 도전 2: SAFE를 받으면 하트를 보여요."
      ],
      "intro": [
        "Add a second message check inside the same receive event.",
        "같은 수신 이벤트 안에 두 번째 메시지 확인을 추가해요."
      ],
      "mins": 3,
      "teacher": "Radio 2, step 2 of 4. Keep the ONE receive-string handler. Add else if receivedString = SAFE → Heart. HELP retains the flash sequence. The visible guide is deliberately a reuse structure, not a second receive handler.",
      "section": "radio"
    },
    {
      "id": "radio2-test",
      "stage": [
        "Main task 2 · Radio 2 · Test",
        "주요 활동 2 · 무선 도전 2 · 확인"
      ],
      "title": [
        "Radio 2: test both buttons.",
        "무선 도전 2: 두 버튼을 확인해요."
      ],
      "intro": [
        "A should flash the beacon. After it finishes, B should show a heart.",
        "A를 누르면 신호등이 깜박여요. 끝난 뒤 B를 누르면 하트가 나와야 해요."
      ],
      "mins": 2,
      "teacher": "Radio 2, step 3 of 4. Re-transfer both edited programs, then test A and B in order. SAFE is an LED status message, not a cancellation command. Evidence and explanation belong on this screen; the next screen exposes the debugging question.",
      "section": "radio"
    },
    {
      "id": "radio2-debug",
      "stage": [
        "Main task 2 · Radio 2 · Debug",
        "주요 활동 2 · 무선 도전 2 · 오류 고치기"
      ],
      "title": [
        "Radio 2: spot the message mistake.",
        "무선 도전 2: 메시지 오류를 찾아요."
      ],
      "intro": [
        "HELP and HLEP look similar. Will the receiver treat them as the same message?",
        "HELP와 HLEP는 비슷해 보여요. 수신기는 같은 메시지로 알아볼까요?"
      ],
      "mins": 2,
      "teacher": "Radio 2, step 4 of 4. Predict the effect of HLEP, then optionally change only sender text, test, restore HELP, transfer again and retest. The question is visible, not behind a task tab. Preserve group numbers. Oral explanation is accepted.",
      "section": "radio"
    },
    {
      "id": "pit",
      "stage": [
        "Learning Pit Stop",
        "배움 점검"
      ],
      "title": [
        "Show your next step.",
        "다음 단계를 정해요."
      ],
      "intro": [
        "Use your real program to show what you can do now.",
        "직접 만든 프로그램으로 지금 할 수 있는 것을 보여 줘요."
      ],
      "mins": 4,
      "teacher": "Use temporary learning phases, not ability labels. Teacher listens to a demonstration in either language. Drowning: rebuild A → icon; New Learning: one flash with a dark gap; Consolidating: two flashes and explain a change; Treading Water: use repeat or add a new input. Acknowledged oral explanation is learner-reported, not recorded audio or automatic teacher certification.",
      "section": "reflect"
    },
    {
      "id": "extension",
      "stage": [
        "Extension or consolidation",
        "더 도전하거나 다시 익히기"
      ],
      "title": [
        "One useful next challenge.",
        "도움이 되는 도전 하나를 골라요."
      ],
      "intro": [
        "Secure your first signal, use a repeat, or try a shake input.",
        "첫 신호를 확실히 익히거나, 반복 또는 흔들기 입력에 도전해요."
      ],
      "mins": 4,
      "teacher": "Available early to pupils who are ready. Consolidation is fully valid: one clear flash ending with a tick. Repeat 2 times groups the four flash instructions; final Yes stays outside. Shake: separate on shake event shows a chosen icon, tested when A has finished. No new external sensor, V2-only sound, motor or required functions. Handle board by edges and keep cable slack; never shake by the lead.",
      "section": "reflect"
    },
    {
      "id": "plenary",
      "stage": [
        "Plenary",
        "마무리"
      ],
      "title": [
        "Show your program—not another map.",
        "지도가 아니라 프로그램을 보여 줘요."
      ],
      "intro": [
        "Demonstrate one input, explain one change and save your work.",
        "입력 하나를 시연하고, 바꾼 부분을 설명한 뒤 활동을 저장해요."
      ],
      "mins": 5,
      "teacher": "Individual evidence: locate the event, demonstrate the light sequence, explain a deliberate change, and distinguish simulator from physical-board testing. No assessment of English fluency. Keep an editable project, optional link, and brief learning record. Export is local, not submission. Teacher mode is a review convenience, not secured authentication. Include the two project names and radio evidence when attempted; unattempted stretch work is not a failure.",
      "section": "reflect"
    }
  ],
  "questions": {
    "recall": {
      "q": [
        "Which action runs the instructions inside this event?",
        "어떤 행동을 하면 이 이벤트 안의 명령이 실행될까요?"
      ],
      "options": [
        [
          "a",
          [
            "Press and release Button A.",
            "A 버튼을 눌렀다 놓아요."
          ]
        ],
        [
          "b",
          [
            "Press Button B.",
            "B 버튼을 눌러요."
          ]
        ],
        [
          "screen",
          [
            "Touch a red LED.",
            "빨간 LED를 만져요."
          ]
        ]
      ],
      "answer": "a",
      "good": [
        "Yes. Button A is the input that starts these instructions.",
        "맞아요. A 버튼이 이 명령을 시작하는 입력이에요."
      ],
      "hint": [
        "Read the top of the pink event block. Which letter is selected?",
        "분홍색 이벤트 블록의 맨 위를 읽어요. 어떤 글자가 선택되어 있나요?"
      ]
    },
    "gap": {
      "q": [
        "Which pair of blocks makes a visible dark gap between flashes?",
        "깜박임 사이에 불이 꺼진 시간이 보이게 하는 블록은 무엇일까요?"
      ],
      "options": [
        [
          "clearPause",
          [
            "clear screen → pause",
            "화면 지우기 → 잠시 기다리기"
          ]
        ],
        [
          "twoIcons",
          [
            "show icon → show icon",
            "아이콘 보여 주기 → 아이콘 보여 주기"
          ]
        ],
        [
          "name",
          [
            "Change the project name.",
            "프로젝트 이름 바꾸기."
          ]
        ]
      ],
      "answer": "clearPause",
      "good": [
        "Exactly. Clear the LEDs, then wait before lighting them again.",
        "맞아요. LED를 지운 뒤 잠시 기다렸다가 다시 켜요."
      ],
      "hint": [
        "The screen must be dark—and stay dark long enough to notice.",
        "화면이 꺼져야 하고, 알아볼 수 있을 만큼 잠시 꺼져 있어야 해요."
      ]
    },
    "exit": {
      "q": [
        "You changed the code in MakeCode. How does the real micro:bit get the new version?",
        "MakeCode에서 코드를 바꿨어요. 실제 micro:bit에 새 코드를 넣으려면 어떻게 해야 할까요?"
      ],
      "options": [
        [
          "transfer",
          [
            "Download / transfer the updated program again.",
            "바뀐 프로그램을 다시 내려받아 기기로 옮겨요."
          ]
        ],
        [
          "auto",
          [
            "It changes automatically because I edited the blocks.",
            "블록을 바꾸었으니 기기의 코드도 자동으로 바뀌어요."
          ]
        ],
        [
          "map",
          [
            "Run the rescue map again.",
            "구조 지도를 다시 실행해요."
          ]
        ]
      ],
      "answer": "transfer",
      "good": [
        "Yes. Editing the browser program does not, by itself, update a physical board.",
        "맞아요. 브라우저에서 코드를 바꾸는 것만으로 실제 기기의 코드가 바뀌지는 않아요."
      ],
      "hint": [
        "The editor and the physical board each have their own copy of the program.",
        "편집기와 실제 기기는 각각 프로그램의 사본을 가지고 있어요."
      ]
    },
    "radioStart": {
      "q": [
        "Which button should you press to test remote control?",
        "원격 조종을 확인하려면 어느 버튼을 눌러야 할까요?"
      ],
      "options": [
        [
          "controller",
          [
            "A on the CONTROLLER; watch the BEACON.",
            "송신기의 A를 누르고 수신기를 살펴봐요."
          ]
        ],
        [
          "receiver",
          [
            "A on the BEACON.",
            "수신기의 A를 눌러요."
          ]
        ],
        [
          "both",
          [
            "A on both boards at exactly the same time.",
            "두 기기의 A를 정확히 동시에 눌러요."
          ]
        ]
      ],
      "answer": "controller",
      "good": [
        "Yes. The controller sends HELP. The receiver runs the flashing sequence.",
        "맞아요. 송신기가 HELP를 보내면 수신기가 깜박이는 순서를 실행해요."
      ],
      "hint": [
        "Which board has the radio send string block? That is the board to press.",
        "어느 기기에 radio send string 블록이 있나요? 그 기기의 버튼을 눌러요."
      ]
    },
    "radioGroup": {
      "q": [
        "The controller uses group 23. The receiver uses group 24. What should you fix?",
        "송신기는 그룹 23, 수신기는 그룹 24예요. 무엇을 고쳐야 할까요?"
      ],
      "options": [
        [
          "same",
          [
            "Set both to the same teacher-assigned group and transfer the changed code.",
            "두 기기를 선생님이 정한 같은 그룹으로 바꾸고, 수정한 코드를 옮겨요."
          ]
        ],
        [
          "pause",
          [
            "Add a longer pause to the receiver.",
            "수신기에 더 긴 pause를 넣어요."
          ]
        ],
        [
          "all",
          [
            "Put the whole class on group 23.",
            "학급 전체를 그룹 23으로 바꿔요."
          ]
        ]
      ],
      "answer": "same",
      "good": [
        "Correct. Both boards in a team need the same group. Other teams use their own groups.",
        "맞아요. 같은 팀의 두 기기는 같은 그룹을 사용해요. 다른 팀은 다른 그룹을 사용해요."
      ],
      "hint": [
        "Compare the radio set group blocks on the two boards. Do their numbers match?",
        "두 기기의 radio set group 블록을 비교해요. 숫자가 같나요?"
      ]
    },
    "radioSpelling": {
      "q": [
        "You send HLEP, but the receiver checks for HELP. What happens?",
        "HLEP를 보냈지만 수신기는 HELP인지 확인해요. 어떻게 될까요?"
      ],
      "options": [
        [
          "no",
          [
            "The HELP sequence does not start. The message does not match.",
            "메시지가 일치하지 않아 HELP 순서가 시작되지 않아요."
          ]
        ],
        [
          "auto",
          [
            "The micro:bit fixes the spelling for you.",
            "micro:bit가 철자를 자동으로 고쳐 줘요."
          ]
        ],
        [
          "heart",
          [
            "The receiver shows SAFE automatically.",
            "수신기가 SAFE를 자동으로 보여 줘요."
          ]
        ]
      ],
      "answer": "no",
      "good": [
        "Yes. Restore HELP exactly, transfer the edited sender program, and retest.",
        "맞아요. 철자를 HELP로 고치고, 수정한 송신기 코드를 옮긴 뒤 다시 확인해요."
      ],
      "hint": [
        "Read the letters one at a time. The receiver only runs the matching branch.",
        "글자를 하나씩 읽어요. 수신기는 일치하는 조건의 명령만 실행해요."
      ]
    }
  },
  "words": [
    [
      [
        "Sequence",
        "순서"
      ],
      [
        "Instructions in the order they run.",
        "명령이 실행되는 차례예요."
      ]
    ],
    [
      [
        "Event",
        "이벤트"
      ],
      [
        "Something that starts a set of instructions, such as a button press.",
        "버튼 누르기처럼 명령 실행을 시작하게 하는 일이에요."
      ]
    ],
    [
      [
        "Pause",
        "잠시 기다리기"
      ],
      [
        "Add waiting time. 1000 milliseconds means 1 second.",
        "기다리는 시간을 더해요. 1000밀리초는 1초예요."
      ]
    ],
    [
      [
        "Debug",
        "잘못된 부분 찾아 고치기"
      ],
      [
        "Find a mistake, change it, then test again.",
        "잘못된 부분을 찾아 고친 뒤 다시 확인해요."
      ]
    ],
    [
      [
        "Simulator",
        "시뮬레이터"
      ],
      [
        "The on-screen micro:bit where you test your code.",
        "코드를 확인할 수 있는 화면 속 micro:bit예요."
      ]
    ],
    [
      [
        "Transfer / Download",
        "코드를 기기로 옮기기"
      ],
      [
        "Send the program to the physical micro:bit.",
        "실제 micro:bit로 프로그램을 보내요."
      ]
    ],
    [
      [
        "Radio",
        "무선 통신"
      ],
      [
        "Send a message from one micro:bit to another nearby micro:bit.",
        "한 micro:bit에서 가까운 다른 micro:bit로 메시지를 보내요."
      ]
    ],
    [
      [
        "Controller / sender",
        "송신기"
      ],
      [
        "The micro:bit with the button that sends the message.",
        "버튼을 눌러 메시지를 보내는 micro:bit예요."
      ]
    ],
    [
      [
        "Receiver / beacon",
        "수신기 / 신호등"
      ],
      [
        "The micro:bit that receives the message and shows the signal.",
        "메시지를 받아 신호를 보여 주는 micro:bit예요."
      ]
    ],
    [
      [
        "Radio group",
        "무선 그룹"
      ],
      [
        "Use the same teacher-assigned number on both boards in your team.",
        "같은 팀의 두 기기에 선생님이 정한 같은 숫자를 사용해요."
      ]
    ],
    [
      [
        "Message",
        "메시지"
      ],
      [
        "An exact piece of text. Keep HELP and SAFE unchanged in both languages.",
        "정확히 일치해야 하는 글자예요. 언어를 바꿔도 HELP와 SAFE는 그대로 써요."
      ]
    ],
    [
      [
        "If / else if",
        "조건에 따라 선택하기"
      ],
      [
        "Check the message, then run the matching instructions.",
        "메시지를 확인하고 일치하는 명령을 실행해요."
      ]
    ]
  ],
  "sources": [
    [
      "Buttons / events",
      "https://makecode.microbit.org/reference/input/on-button-pressed"
    ],
    [
      "Basic blocks",
      "https://makecode.microbit.org/reference/basic"
    ],
    [
      "Show icon (including default interval)",
      "https://makecode.microbit.org/reference/basic/show-icon"
    ],
    [
      "Pause",
      "https://makecode.microbit.org/reference/basic/pause"
    ],
    [
      "Custom LED pictures",
      "https://makecode.microbit.org/reference/basic/show-leds"
    ],
    [
      "Repeat blocks",
      "https://makecode.microbit.org/blocks/loops/repeat"
    ],
    [
      "Shake input",
      "https://makecode.microbit.org/reference/input/on-gesture"
    ],
    [
      "Transfer code: computer, iPad, Android",
      "https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/"
    ],
    [
      "Mobile-app guidance",
      "https://microbit.org/get-started/user-guide/mobile/"
    ],
    [
      "Radio group (0–255)",
      "https://makecode.microbit.org/reference/radio/set-group"
    ],
    [
      "Send a string",
      "https://makecode.microbit.org/reference/radio/send-string"
    ],
    [
      "Receive a string (one handler)",
      "https://makecode.microbit.org/reference/radio/on-received-string"
    ],
    [
      "Official radio classroom activity",
      "https://makecode.microbit.org/courses/csintro/radio/activity"
    ],
    [
      "If / else if and the + control",
      "https://makecode.microbit.org/blocks/logic/if"
    ]
  ]
};
