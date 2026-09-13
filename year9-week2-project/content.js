/* Authored lesson and language support. These are explanations, not grading keywords. */
const B=(en,ms,zh)=>({en,ms,zh});
const O=(value,en,ms,zh)=>({value,label:B(en,ms,zh)});
const UI={
 start:B('Start the lesson →','Mulakan pelajaran →','开始学习 →'),back:B('← Back','← Kembali','← 返回'),next:B('Continue →','Teruskan →','继续 →'),report:B('My report','Laporan saya','我的报告'),leave:B('Leave','Keluar','退出'),language:B('Language','Bahasa','语言'),saved:B('Saved on this device','Disimpan pada peranti ini','已保存在此设备'),saving:B('Saving…','Menyimpan…','正在保存…'),saveError:B('Storage full or unavailable. Export a backup now.','Storan penuh atau tidak tersedia. Eksport sandaran sekarang.','存储已满或不可用。请立即导出备份。'),
 knowledge:B('Knowledge','Pengetahuan','知识'),skills:B('Skills','Kemahiran','技能'),understanding:B('Understanding','Pemahaman','理解'),wagba:B("Plan a message helper for Sam: ask about one warning sign, choose useful advice, test both answers and improve the plan.","Rancang pembantu mesej untuk Sam: tanya tentang satu tanda amaran, pilih nasihat berguna, uji kedua-dua jawapan dan baiki pelan.","为 Sam 规划消息助手：询问一种警示、选择有用建议、测试两种答案并改进计划。"),kGoal:{"en": "Recognise warning signs; identify your helper’s input, decision and outputs.", "ms": "Kenal pasti tanda amaran serta input, keputusan dan output pembantu anda.", "zh": "识别警示，并指出助手的输入、判断和输出。"},sGoal:B("Write and explain both routes; predict, test, revise and retest.","Tulis dan terangkan kedua-dua laluan; ramal, uji, baiki dan uji semula.","写出并解释两条路径；预测、测试、修改、再测试。"),uGoal:B("Explain what your check can tell Sam, what it cannot, and what he should check next.","Terangkan apa yang semakan boleh dan tidak boleh beritahu Sam, serta apa yang perlu disemak seterusnya.","解释检查能告诉 Sam 什么、不能确定什么，以及他下一步应核实什么。"),
 translate:B('Show translation','Lihat terjemahan','显示翻译'),compare:B('Compare both languages','Bandingkan kedua-dua bahasa','双语对照'),focus:B('Focus: one language','Fokus: satu bahasa','专注：一种语言'),ownWords:B('Use your own words, in any language or a mix. Your teacher reviews the meaning.','Gunakan kata-kata sendiri, dalam mana-mana bahasa atau campuran. Guru akan menilai maksudnya.','可用自己的话，以任何语言或混合语言表达。老师会查看你的意思。'),optional:B('Optional','Pilihan','可选'),check:B('Get feedback','Dapatkan maklum balas','查看反馈'),choose:B('Choose…','Pilih…','请选择…'),savedResponse:B('Response saved for your teacher. You can continue.','Jawapan disimpan untuk guru. Anda boleh teruskan.','回答已保存给老师，可以继续。'),notGrade:B('Progress is not a grade. You can always continue.','Kemajuan bukan gred. Anda sentiasa boleh teruskan.','进度不是成绩，随时可以继续。'),
 glossary:B('Word help for this card','Bantuan istilah untuk kad ini','本卡片的词汇帮助'),hint:B('Need a starting point?','Perlukan titik permulaan?','需要起步提示吗？'),paper:B('Prefer paper or discussion?','Lebih suka kertas atau perbincangan?','想用纸笔或口头讨论吗？'),paperGuide:B('Use the same task on paper: add a title, your question, both YES/NO responses, and arrows showing the order. For a discussion, explain your plan to a partner or teacher. Add a photo or a short note below so the report can include your work.','Gunakan tugasan yang sama di atas kertas: tambah tajuk, soalan anda, kedua-dua respons YES/NO dan anak panah yang menunjukkan urutan. Untuk perbincangan, terangkan pelan kepada rakan atau guru. Tambah foto atau nota ringkas di bawah untuk laporan.','纸上完成同一任务：写标题、问题、YES/NO 两种回应，并用箭头表示顺序。口头讨论时，向同伴或老师解释计划。请在下方添加照片或简短记录，以便纳入报告。'),paperNote:B('What did you make or explain?','Apakah yang anda hasilkan atau terangkan?','你制作或解释了什么？'),upload:B('Add a photo or screenshot','Tambah foto atau tangkap layar','添加照片或截图'),paste:B('You can also paste a copied image here.','Anda juga boleh tampal imej yang disalin di sini.','也可在此粘贴已复制的图片。'),remove:B('Remove','Buang','移除'),yes:B('YES','YA','是'),no:B('NO','TIDAK','否'),
 modelLabel:B('Worked example · Sam’s choice','Contoh berpandu · pilihan Sam','完整示例 · Sam 的选择'),modelQuestion:B('Does the message pressure you to act immediately?','Adakah mesej mendesak anda bertindak segera?','消息是否催促你立即行动？'),modelYes:B('Pressure reported: pause and check with a trusted source before acting.','Desakan dilaporkan: berhenti seketika dan semak dengan sumber dipercayai sebelum bertindak.','报告了催促：先暂停，行动前向可信来源核实。'),modelNo:B('No pressure reported. Check for other warning signs.','Tiada desakan dilaporkan. Semak tanda amaran lain.','未报告催促，请检查其他警示信号。'),tryBoth:B('Changing the answer changes the advice—not the original message.','Menukar jawapan mengubah nasihat, bukan mesej asal.','改变答案会改变建议，不会改变原来的消息。'),emptyOutput:B('Predict the advice first, then run the helper.','Ramalkan nasihat dahulu, kemudian jalankan pembantu.','先预测建议，再运行助手。'),
 preview:B('My design so far','Reka bentuk saya setakat ini','我的当前设计'),emptyDraft:B('Your own question and advice will appear here as you write them. Nothing here is submitted as your answer until you enter it.','Soalan dan nasihat anda akan muncul di sini apabila ditulis. Tiada jawapan dihantar sehingga anda memasukkannya.','写下的问题和建议会出现在这里。只有你实际输入的内容才会计入回答。'),question:B('Question','Soalan','问题'),yesAdvice:B('When the answer is YES','Apabila jawapan ialah YES','回答为 YES 时'),noAdvice:B('When the answer is NO','Apabila jawapan ialah NO','回答为 NO 时'),needsDraft:B('Add your question and both responses in Main Task 1 to preview your plan. You can still continue if you need support.','Tambah soalan dan kedua-dua respons dalam Tugasan Utama 1 untuk melihat pelan. Anda masih boleh teruskan jika perlukan bantuan.','请在主任务一填写问题及两种回应，才能预览计划。需要帮助时仍可继续。'),goDesign:B('Return to my question','Kembali kepada soalan saya','返回我的问题'),
 showPlan:B('View my current instructions','Lihat arahan semasa saya','查看当前指令'),step:B('Follow the next instruction','Ikut arahan seterusnya','执行下一条指令'),restart:B('Restart walkthrough','Mulakan semula panduan','重新逐步执行'),testAnswer:B('Test answer','Jawapan ujian','测试输入'),expected:B('Before testing: what exact advice do you expect?','Sebelum menguji: apakah nasihat tepat yang dijangka?','测试前：你预计显示哪条具体建议？'),observed:B('What did the walkthrough or partner actually display?','Apakah yang sebenarnya dipaparkan oleh panduan atau rakan?','逐步执行或同伴实际显示了什么？'),runTest:B('Try my plan','Cuba pelan saya','试运行我的计划'),saveTest:B('Save this test record','Simpan rekod ujian ini','保存本次测试'),match:B('Did the result match your prediction?','Adakah hasil sepadan dengan ramalan?','结果与你的预测一致吗？'),recordedTests:B('Your saved tests','Ujian yang disimpan','已保存的测试'),testMethod:B('How are you testing?','Bagaimanakah anda menguji?','如何测试？'),solo:B('On-screen walkthrough','Panduan pada skrin','屏幕逐步执行'),partner:B('Partner follows my plan','Rakan mengikut pelan saya','同伴按计划执行'),paperTest:B('Paper plan / discussion','Pelan kertas / perbincangan','纸上计划／讨论'),
 orderPrompt:B('Arrange your instructions. Use the arrows; read the whole plan after each move.','Susun arahan anda. Gunakan anak panah; baca keseluruhan pelan selepas setiap perubahan.','用箭头排列指令，每次移动后读一遍整个计划。'),up:B('Move up','Gerak ke atas','上移'),down:B('Move down','Gerak ke bawah','下移'),resetOrder:B('Try the mixed instructions again','Cuba arahan bercampur semula','重新尝试乱序指令'),checkOrder:B('Check my instruction order','Semak urutan arahan saya','检查指令顺序'),orderGood:B('This order receives the answer before checking it, and gives one response for each branch. Now explain what your own outputs mean.','Urutan ini menerima jawapan sebelum menyemaknya dan memberikan satu respons bagi setiap cabang. Sekarang terangkan maksud output anda.','此顺序先接收答案，再判断，并为每条分支提供一个回应。现在解释你所写输出的意思。'),orderTry:B('Read from the top. The program must receive warning before testing it. Put the YES output after IF, the NO output after ELSE, and ENDIF last. You can revise or continue with support.','Baca dari atas. Program mesti menerima warning sebelum mengujinya. Letak output YES selepas IF, output NO selepas ELSE dan ENDIF di akhir. Anda boleh baiki atau teruskan dengan bantuan.','从上往下读：必须先接收 warning 再判断。YES 输出放在 IF 后，NO 输出在 ELSE 后，最后是 ENDIF。可以修改，也可以继续并寻求帮助。'),
 extensions:B('Optional challenges','Cabaran pilihan','可选挑战'),noAttempts:B('Nothing recorded here yet. Try an activity or add paper evidence; blank tasks are not added to your report.','Belum ada rekod di sini. Cuba aktiviti atau tambah bukti kertas; tugasan kosong tidak dimasukkan dalam laporan.','尚无记录。尝试活动或添加纸上证据；空白任务不会加入报告。'),reportIntro:B('This report includes only your responses, tests, selected support and uploaded evidence. It is not an automatic grade.','Laporan ini hanya mengandungi jawapan, ujian, bantuan dipilih dan bukti dimuat naik. Ini bukan gred automatik.','报告只包含你的回答、测试、所选支持和上传的证据，不会自动评分。'),print:B('Save PDF / Print','Simpan PDF / Cetak','保存 PDF／打印'),backup:B('Download full backup','Muat turun sandaran penuh','下载完整备份'),restore:B('Restore a backup','Pulihkan sandaran','恢复备份'),teams:B('Submit in Microsoft Teams → Week 2 Project. Check your name and pages, attach the PDF, then select Turn in if this is an assignment.','Hantar dalam Microsoft Teams → Week 2 Project. Semak nama dan halaman, lampirkan PDF, kemudian pilih Turn in jika ini tugasan.','提交到 Microsoft Teams → Week 2 Project。检查姓名和页面，附上 PDF；若为作业，再选择 Turn in。'),printHelp:B('In the print window choose Save as PDF. On iPad, use the print preview and Share → Save to Files. This keeps Chinese and Malay text readable. Return here if you cancel.','Dalam tetingkap cetakan pilih Save as PDF. Pada iPad, gunakan pratonton cetakan dan Share → Save to Files. Ini mengekalkan teks Cina dan Melayu. Kembali ke sini jika dibatalkan.','打印窗口选择“另存为 PDF”。iPad 可使用打印预览和“共享 → 存储到文件”。这可保留中文及马来文。取消后可返回。'),saveHtml:B('Download readable report','Muat turun laporan boleh dibaca','下载可阅读报告'),lastChanged:B('Last changed','Kali terakhir diubah','最后修改'),stale:B('Your plan changed after this test. Keep the evidence, then test the revised version.','Pelan berubah selepas ujian ini. Simpan bukti, kemudian uji versi baharu.','此测试后计划已更改。保留证据，再测试新版本。'),
 helpNotice:B('This records your request; it does not send a live alert. Show this card to your teacher.','Ini merekodkan permintaan; ia tidak menghantar amaran langsung. Tunjukkan kad ini kepada guru.','这会记录你的请求，但不会实时通知老师。请把此卡片展示给老师。'),needHelp:B('I need support with this card','Saya perlukan bantuan untuk kad ini','这张卡片我需要帮助'),helpSaved:B('Support request saved. You can continue or show your teacher this card.','Permintaan bantuan disimpan. Anda boleh teruskan atau tunjuk kad ini kepada guru.','帮助请求已保存。可以继续，也可向老师展示此卡片。'),
 name:B('Full name','Nama penuh','姓名'),className:B('Class','Kelas','班级'),entryTitle:B('Open your design notebook','Buka buku reka bentuk anda','打开设计笔记'),entryIntro:B('Plan a small helper that asks about a message and gives advice. Today you will design and test a plan, not build a complete Python program.','Rancang pembantu kecil yang bertanya tentang mesej dan memberi nasihat. Hari ini anda mereka bentuk dan menguji pelan, bukan membina program Python lengkap.','规划一个询问消息情况并提供建议的小助手。今天设计和测试计划，不需要完成完整的 Python 程序。'),outcome:B('A clear question, two responses and instructions that a partner can follow.','Soalan yang jelas, dua respons dan arahan yang boleh diikuti rakan.','一个清晰的问题、两种回应，以及同伴可以执行的指令。'),privacy:B('Work saves in this browser on this device. Export it before using a shared device or clearing browser data.','Kerja disimpan dalam pelayar pada peranti ini. Eksport sebelum berkongsi peranti atau memadam data pelayar.','作品保存在此设备的浏览器中。共享设备或清除浏览器数据前请先导出。'),entryNote:B('Read one language at a time. Open a translation or compare languages whenever it helps.','Baca satu bahasa pada satu masa. Buka terjemahan atau bandingkan bahasa apabila membantu.','一次阅读一种语言，需要时打开翻译或双语对照。')
};
const GROUPS=[B('Read & Do Now','Baca & Aktiviti Mula','阅读与开始活动'),B('Types of Learning','Jenis Pembelajaran','学习类型'),B('Try an example','Cuba contoh','尝试示例'),B('Main Task 1','Tugasan Utama 1','主任务一'),B('Main Task 2','Tugasan Utama 2','主任务二'),B('Learning Pitstop','Hentian Pembelajaran','学习加油站'),B('Plenary','Rumusan','总结'),B('Exit & report','Refleksi & laporan','反思与报告')];
const FIELD={};
const Q=(id,prompt,options=null,extra={})=>{const q={id,prompt,options,...extra};FIELD[id]=q;return q;};
const YESNO=[O('yes','YES','YA','是'),O('no','NO','TIDAK','否')];
const EXAMPLE={
 steps:[B('1 · Watch Sam','1 · Lihat Sam','1 · 看 Sam 的示例'),B('2 · Read the rule','2 · Baca peraturan','2 · 阅读规则'),B('3 · Your turn','3 · Giliran anda','3 · 轮到你')],
 intro:B('Follow one worked example, see its rule, then predict and try a different message. This is a small model to learn from, not a finished scam detector.','Ikuti satu contoh berpandu, lihat peraturannya, kemudian ramal dan cuba mesej lain. Ini model kecil untuk pembelajaran, bukan pengesan penipuan yang lengkap.','先看一个完整示例，了解规则，再预测并测试另一条消息。这是用于学习的小模型，不是完整的诈骗检测器。'),
 watchTitle:B('Sam receives a gaming message','Sam menerima mesej permainan','Sam 收到游戏消息'),
 fictional:B('Fictional message · read it here; there is nothing to open','Mesej rekaan · baca di sini; tiada apa-apa untuk dibuka','虚构消息 · 在这里阅读，无需打开任何链接'),
 samMessage:B('Your free game coins expire in 10 minutes. Claim them NOW!','Syiling permainan percuma anda tamat dalam 10 minit. Tuntut SEKARANG!','你的免费游戏币将在 10 分钟后到期。立即领取！'),
 roles:B('Sam reads the message. The helper only receives Sam’s YES or NO answer—it cannot read or check the message itself.','Sam membaca mesej. Pembantu hanya menerima jawapan YES atau NO daripada Sam; ia tidak boleh membaca atau menyemak mesej itu sendiri.','Sam 负责阅读消息。助手只接收 Sam 的 YES 或 NO 回答，本身不能阅读或核查消息。'),
 think:B('Sam thinks: “10 minutes” and “NOW” push me to hurry, so I answer YES. I am reporting pressure, not proving that this is a scam.','Sam berfikir: “10 minit” dan “SEKARANG” mendesak saya bergegas, jadi saya jawab YES. Saya melaporkan desakan, bukan membuktikan penipuan.','Sam 想：“10 分钟”和“立即”在催我赶快，所以我回答 YES。我是在报告催促，并不是证明这是诈骗。'),
 result:B('The helper follows the YES route and displays:','Pembantu mengikut laluan YES dan memaparkan:','助手沿 YES 路径显示：'),
 ruleTitle:B('How does the helper choose its advice?','Bagaimanakah pembantu memilih nasihat?','助手怎样选择建议？'),
 ruleIntro:B('Pseudocode is a readable plan for a program, not runnable Python. Here, urgent is the name of a place that stores the answer to the question above. INPUT stores the answer; OUTPUT displays advice.','Pseudokod ialah pelan program yang mudah dibaca, bukan Python yang boleh dijalankan. Di sini, urgent ialah nama tempat menyimpan jawapan kepada soalan tadi. INPUT menyimpan jawapan; OUTPUT memaparkan nasihat.','伪代码是易读的程序计划，不是可以运行的 Python。这里 urgent 是保存刚才问题答案的位置名称。INPUT 接收并保存答案，OUTPUT 显示建议。'),
 ruleMeaning:B('IF means “check this condition”. When urgent is YES, use the first OUTPUT. Otherwise, use the OUTPUT after ELSE. ENDIF ends this choice. The helper displays only one of the two pieces of advice.','IF bermaksud “semak syarat ini”. Jika urgent ialah YES, gunakan OUTPUT pertama. Jika tidak, gunakan OUTPUT selepas ELSE. ENDIF menamatkan pilihan ini. Pembantu memaparkan hanya satu daripada dua nasihat.','IF 表示“检查这个条件”。urgent 为 YES 时，执行第一条 OUTPUT；否则执行 ELSE 后的 OUTPUT。ENDIF 结束这次选择。助手只显示两条建议中的一条。'),
 samRoute:B('For Sam: INPUT YES → the condition is true → display the first advice. Skip the other OUTPUT.','Bagi Sam: INPUT YES → syarat benar → paparkan nasihat pertama. Langkau OUTPUT yang lain.','Sam 的路径：输入 YES → 条件为真 → 显示第一条建议，跳过另一条 OUTPUT。'),
 practiceTitle:B('A different message: coding club','Mesej lain: kelab pengekodan','另一条消息：编程社团'),
 clubMessage:B('Coding club meets in Room 12 on Thursday at lunchtime. Bring your project ideas.','Kelab pengekodan bertemu di Bilik 12 pada hari Khamis waktu makan tengah hari. Bawa idea projek anda.','编程社团周四午餐时间在 12 号教室见。请带上你的项目想法。'),
 practiceIntro:B('Read the new message. Choose the answer you would give, then predict the advice in a short phrase. Run the helper to compare. You may look back at the rule.','Baca mesej baharu. Pilih jawapan anda, kemudian ramalkan nasihat dalam frasa ringkas. Jalankan pembantu untuk membandingkan. Anda boleh lihat semula peraturan.','阅读新消息，选择你会给出的答案，再用一个短语预测建议。运行助手进行比较，可以回看规则。'),
 run:B('Run with my answer','Jalankan dengan jawapan saya','用我的答案运行'),
 needPrediction:B('Choose YES or NO and add a prediction first. Any short phrase or language is fine. This does not stop you continuing to the next card.','Pilih YES atau NO dan tambah ramalan dahulu. Frasa ringkas dalam mana-mana bahasa diterima. Anda masih boleh terus ke kad seterusnya.','请先选择 YES 或 NO 并写下预测，任何语言的短语都可以。这不会阻止你继续下一张卡。'),
 observed:B('What the helper actually displayed','Apa yang sebenarnya dipaparkan pembantu','助手实际显示的内容'),
 evidence:B('In the club message, Thursday is a meeting time, not a demand to act immediately. NO is the observation this example supports. The helper still follows whichever answer you give it.','Dalam mesej kelab, Khamis ialah masa pertemuan, bukan desakan untuk bertindak segera. Pemerhatian yang disokong contoh ini ialah NO. Pembantu tetap mengikut jawapan yang anda beri.','社团消息里的周四是活动时间，不是在要求立即行动，因此这条消息支持 NO。助手仍然只会按照你提供的答案运行。'),
 limitation:B('This checks pressure only. It does not check who sent the message, any link, or whether the claim is true. “No pressure” does not mean “definitely safe”.','Ini hanya menyemak desakan. Ia tidak menyemak penghantar, pautan atau kebenaran dakwaan. “Tiada desakan” tidak bermaksud “pasti selamat”.','这里只检查是否催促，不检查发送者、链接或内容真假。“没有催促”不等于“肯定安全”。'),
 changed:B('Your answer or prediction has changed since the last run. Run again to see advice for this version; your earlier attempt is still in your report.','Jawapan atau ramalan berubah sejak ujian terakhir. Jalankan semula untuk melihat nasihat versi ini; percubaan terdahulu kekal dalam laporan.','上次运行后，你更改了答案或预测。请重新运行查看当前版本的建议；报告仍保留先前的尝试。'),
 back:B('← Previous example step','← Langkah contoh sebelumnya','← 上一步示例'),next:B('Next example step →','Langkah contoh seterusnya →','下一步示例 →')
};
const RISKS={
 link:{name:B('Unexpected link','Pautan tidak dijangka','意外链接'),read:B('Sam did not expect a link. The helper can ask about that observation. It must not open the link to investigate it.','Sam tidak menjangka pautan. Pembantu boleh bertanya tentang pemerhatian itu. Ia tidak boleh membuka pautan untuk menyiasat.','Sam 没有预期会收到链接。助手可询问这一观察，但不能打开链接来调查。'),question:B('Does the message contain a link you did not expect?','Adakah mesej mengandungi pautan yang tidak dijangka?','消息中是否有你没预料到的链接？')},
 signin:{name:B('Sign-in request','Permintaan log masuk','登录请求'),read:B('The message asks Sam to sign in. Your helper asks whether this request is present; it never asks for a username or password.','Mesej meminta Sam log masuk. Pembantu bertanya sama ada permintaan ini wujud; ia tidak meminta nama pengguna atau kata laluan.','消息要求 Sam 登录。助手只询问是否有这个要求，绝不索要用户名或密码。'),question:B('Does the message ask you to sign in to claim something?','Adakah mesej meminta anda log masuk untuk menuntut sesuatu?','消息是否要求你登录以领取某样东西？')},
 reward:{name:B('Unexpected reward','Ganjaran tidak dijangka','意外奖励'),read:B('Sam does not remember entering a competition. An unexpected reward is a reason to pause and check, not proof of a scam.','Sam tidak ingat menyertai pertandingan. Ganjaran tidak dijangka ialah sebab untuk berhenti dan menyemak, bukan bukti penipuan.','Sam 不记得参加过比赛。意外奖励是暂停核实的理由，并不能证明诈骗。'),question:B('Does the message offer a reward you did not expect?','Adakah mesej menawarkan ganjaran yang tidak dijangka?','消息是否提供了你没预料到的奖励？')}
};
const BRIEF={
 messageTitle:B('Keep Sam’s message in view','Lihat mesej Sam semasa merancang','规划时对照 Sam 的消息'),
 jobTitle:B('What you are making','Apa yang anda akan hasilkan','你要设计什么'),
 job:B('A small message helper: it asks Sam one YES/NO question and gives advice for each answer. Sam reads the message; the helper only uses his answer. It must not open links or collect passwords.','Pembantu mesej kecil: ia bertanya satu soalan YES/NO kepada Sam dan memberi nasihat bagi setiap jawapan. Sam membaca mesej; pembantu hanya menggunakan jawapannya. Ia tidak boleh membuka pautan atau mengumpul kata laluan.','一个小型消息助手：向 Sam 提出一个 YES/NO 问题，并根据答案给出建议。Sam 阅读消息，助手只使用他的回答，不得打开链接或收集密码。'),
 scope:B('On this card, choose what to check and explain why it would help Sam. On the next cards, you will write the question, the two pieces of advice and the rule, then test the plan. No Python code is needed yet.','Pada kad ini, pilih perkara untuk disemak dan terangkan bagaimana ia membantu Sam. Pada kad seterusnya, anda akan menulis soalan, dua nasihat dan peraturan, kemudian menguji pelan. Kod Python belum diperlukan.','这张卡先选要检查的内容，并解释它为什么能帮助 Sam。接下来的卡片再写问题、两种建议和规则，然后测试计划。现在不需要写 Python 代码。'),
 choiceIntro:B('The teacher’s example checked pressure to hurry. Choose a DIFFERENT sign below. All three are valid choices; you only need one.','Contoh guru menyemak desakan supaya bergegas. Pilih tanda LAIN di bawah. Ketiga-tiganya boleh dipilih; anda hanya perlu satu.','教师示例检查了催促赶快行动的语言。下面选择另一种警示，三种都可以，只需选一种。'),
 clueLabel:B('Notice in Sam’s situation','Perhatikan situasi Sam','留意 Sam 的情况'),
 thinkLabel:B('Think before writing','Fikir sebelum menulis','写之前想一想'),
 noChoice:B('Start with one sign above. Then use the message and the guidance that appears to explain the job of your check. If you are unsure, talk through one choice with a partner or teacher.','Mulakan dengan satu tanda di atas. Kemudian gunakan mesej dan panduan yang muncul untuk menerangkan tugas semakan anda. Jika tidak pasti, bincangkan satu pilihan dengan rakan atau guru.','先选上面的一种警示，再结合消息和出现的提示说明检查的作用。不确定时，可以和同伴或老师讨论一种选择。'),
 writeGuide:B('In one or two sentences, name what you want Sam to notice and explain how this could help him decide what to check before acting. You are describing the purpose, not writing the YES/NO question yet. Your own wording is welcome.','Dalam satu atau dua ayat, nyatakan perkara yang anda mahu Sam perhatikan dan bagaimana ia membantu Sam menentukan apa yang perlu disemak sebelum bertindak. Anda menerangkan tujuan, bukan menulis soalan YES/NO lagi. Gunakan kata-kata sendiri.','用一两句话说明你希望 Sam 注意什么，以及这怎样帮助他决定行动前要核实什么。这里是在说明目的，还不用写 YES/NO 问题。欢迎用自己的话表达。'),
 modelTitle:B('See a purpose example — the teacher’s pressure check','Lihat contoh tujuan — semakan desakan oleh guru','查看目的示例——教师的催促检查'),
 model:B('“Sam may rush because the message says ACT NOW. My check helps him notice that pressure so he pauses to check the offer before acting.” This names a clue and explains why noticing it helps. Use your own chosen sign; do not copy this example.','“Sam mungkin tergesa-gesa kerana mesej menyebut BERTINDAK SEKARANG. Semakan saya membantu Sam menyedari desakan itu supaya dia berhenti seketika untuk menyemak tawaran sebelum bertindak.” Ini menamakan petunjuk dan menerangkan manfaat menyedarinya. Gunakan tanda pilihan anda; jangan salin contoh ini.','“消息说立即行动，Sam 可能会匆忙行事。我的检查帮助他留意这种催促，从而先暂停并核实奖励再行动。”这段话指出线索，也解释了注意它的作用。请使用你自己选择的警示，不要照抄示例。'),
 retained:B('Your saved explanation is still here. Check that it fits the sign you have selected; change it only if you need to.','Penerangan yang disimpan masih ada. Semak bahawa ia sesuai dengan tanda pilihan anda; ubah hanya jika perlu.','已保存的解释仍在这里。检查它是否符合当前选择的警示，需要时再修改。'),
 purposeLabel:B('The purpose you described','Tujuan yang anda terangkan','你写下的目的'),
 risks:{
  link:{clue:B('The message contains rewards-check.example, a link Sam was not expecting.','Mesej mengandungi rewards-check.example, pautan yang tidak dijangka oleh Sam.','消息中有 rewards-check.example，这是 Sam 没预料到的链接。'),think:B('Sam is deciding whether to follow that link. What should he stop to check first? You can consider checking the offer through the game’s usual app instead of opening this link.','Sam sedang memutuskan sama ada mahu membuka pautan itu. Apakah yang patut disemak dahulu? Anda boleh pertimbangkan untuk menyemak tawaran melalui aplikasi permainan yang biasa digunakan, bukan membuka pautan ini.','Sam 正在考虑是否打开链接。他应该先核实什么？可以考虑通过平时使用的游戏应用核实奖励，而不是打开这个链接。')},
  signin:{clue:B('The message says “Sign in to claim”. Sam would be using his account details if he followed this request.','Mesej menyebut “Log masuk untuk menuntut”. Sam akan menggunakan maklumat akaunnya jika mengikut permintaan ini.','消息说“登录即可领取”。如果照做，Sam 就会使用自己的账户资料。'),think:B('Why should Sam pause before entering account details? Think about helping him check whether the request really comes from the game. Your helper must never ask him to type a password.','Mengapakah Sam patut berhenti seketika sebelum memasukkan maklumat akaun? Fikirkan cara membantu Sam menyemak sama ada permintaan benar-benar daripada pihak permainan. Pembantu anda tidak boleh meminta kata laluan.','为什么 Sam 输入账户资料前应该先停下来？想想怎样帮助他核实请求是否真的来自游戏方。你的助手绝不能要求他输入密码。')},
  reward:{clue:B('The message promises 5,000 game coins, but Sam does not remember entering a competition.','Mesej menjanjikan 5,000 syiling permainan, tetapi Sam tidak ingat menyertai pertandingan.','消息承诺奖励 5,000 游戏币，但 Sam 不记得参加过比赛。'),think:B('Why might Sam be tempted to claim it? What would he need to confirm about this unexpected offer before acting? An attractive reward is not, by itself, proof that the message is genuine or a scam.','Mengapakah Sam mungkin tertarik untuk menuntutnya? Apakah yang perlu disahkan tentang tawaran tidak dijangka ini sebelum bertindak? Ganjaran menarik sahaja bukan bukti mesej itu sah atau penipuan.','为什么 Sam 可能想领取奖励？行动前他需要核实这份意外奖励的什么情况？奖励很吸引人，本身并不能证明消息真实或属于诈骗。')}
 }
};
const LEARNING={
outcomeTitle:B("Your task today","Tugasan anda hari ini","今天的任务"),
outcome:B("Help Sam decide what to check before acting on his gaming-reward message. Use the teacher’s pressure check as a model, then plan ONE different check: an unexpected link, a sign-in request or an unexpected reward. Your finished work is a question, two advice outputs, an ordered algorithm, YES and NO test records, and an explanation of an improvement or a check you made. This plan prepares you to write Python next lesson.","Bantu Sam menentukan apa yang perlu disemak sebelum bertindak atas mesej ganjaran permainan. Gunakan semakan desakan guru sebagai model, kemudian rancang SATU semakan lain: pautan tidak dijangka, permintaan log masuk atau ganjaran tidak dijangka. Hasil kerja anda ialah satu soalan, dua output nasihat, algoritma tersusun, rekod ujian YES dan NO, serta penerangan tentang penambahbaikan atau semakan yang dibuat. Pelan ini menyediakan anda untuk menulis Python pada pelajaran seterusnya.","帮助 Sam 决定收到游戏奖励消息后，行动前应核实什么。以教师的催促检查为示例，再规划一项不同的检查：意外链接、登录请求或意外奖励。完成的作品包括一个问题、两条建议输出、顺序清楚的算法、YES 和 NO 测试记录，以及对一次修改或检查的解释。这份计划为下节课编写 Python 做准备。"),
knowledgeTitle:B("Knowledge · Know the parts of your plan","Pengetahuan · Kenali bahagian pelan anda","知识 · 认识计划的各个部分"),
knowledgeIntro:B("Know what each term means and point to it in YOUR helper. The person reads the message; this version of the program receives only their answer.","Ketahui maksud setiap istilah dan tunjukkan bahagiannya dalam pembantu ANDA. Pengguna membaca mesej; versi program ini hanya menerima jawapan mereka.","理解每个术语，并在自己的助手中指出对应部分。消息由人阅读；这个版本的程序只接收人的回答。"),
input:B("INPUT is information the program receives: the person’s YES or NO answer, stored as warning. The question asks for that information; the whole message is not the input in this version.","INPUT ialah maklumat yang diterima program: jawapan YES atau NO pengguna, disimpan sebagai warning. Soalan meminta maklumat itu; keseluruhan mesej bukan input dalam versi ini.","INPUT 是程序接收的信息：使用者的 YES 或 NO 回答，保存为 warning。问题用于获取这个信息；在此版本中，整条消息并不作为输入。"),
decision:B("PROCESS includes the decision: IF warning = YES checks whether the answer is YES. A condition is a check with a true or false result. It selects the YES route or the alternative ELSE route.","PROCESS merangkumi keputusan: IF warning = YES menyemak sama ada jawapan ialah YES. Syarat ialah semakan dengan hasil benar atau palsu. Ia memilih laluan YES atau laluan alternatif ELSE.","PROCESS 包括判断：IF warning = YES 检查答案是否为 YES。条件检查的结果为真或假，据此选择 YES 路径或另一条 ELSE 路径。"),
output:B("OUTPUT is information the program gives back: the advice on the selected route. Write two possible outputs, but display only one for each answer.","OUTPUT ialah maklumat yang diberikan semula oleh program: nasihat pada laluan dipilih. Tulis dua output yang mungkin, tetapi paparkan satu sahaja bagi setiap jawapan.","OUTPUT 是程序给出的信息：所选路径上的建议。需要写出两种可能的输出，但每个答案只显示其中一种。"),
knowledgeTask:B("Your task: in your question and algorithm, label the answer as INPUT, the IF check as the decision, and both advice messages as OUTPUT. Explain to a partner how changing YES to NO changes the route and the advice.","Tugasan anda: dalam soalan dan algoritma anda, labelkan jawapan sebagai INPUT, semakan IF sebagai keputusan, dan kedua-dua nasihat sebagai OUTPUT. Terangkan kepada rakan bagaimana menukar YES kepada NO mengubah laluan dan nasihat.","你的任务：在问题和算法中，将答案标为 INPUT、IF 检查标为判断、两条建议标为 OUTPUT。向同伴解释，把 YES 改为 NO 会怎样改变路径和建议。"),
knowledgeEvidence:B("You can show progress when you can identify all three parts in your own plan and explain their jobs, without copying the teacher’s labels.","Anda menunjukkan kemajuan apabila boleh mengenal pasti ketiga-tiga bahagian dalam pelan sendiri dan menerangkan tugasnya tanpa menyalin label guru.","进步的证据：你能在自己的计划中识别这三个部分，并解释它们的作用，而不只是照抄教师的标签。"),
skillsTitle:B("Skills · Make a plan someone else can follow","Kemahiran · Hasilkan pelan yang boleh diikuti orang lain","技能 · 制作别人能执行的计划"),
plan:B("PLAN: choose one warning sign and explain why Sam needs that check. Write a clear YES/NO question and useful advice for each answer. Arrange INPUT, IF, the YES output, ELSE, the NO output and ENDIF in order. Set a success criterion: “If the input is ___, the helper should display ___.”","RANCANG: pilih satu tanda amaran dan terangkan mengapa Sam memerlukan semakan itu. Tulis soalan YES/NO yang jelas dan nasihat berguna bagi setiap jawapan. Susun INPUT, IF, output YES, ELSE, output NO dan ENDIF mengikut urutan. Tetapkan kriteria kejayaan: “Jika input ialah ___, pembantu patut memaparkan ___.”","规划：选择一种警示，解释 Sam 为什么需要这项检查。写出清晰的 YES/NO 问题及两种答案对应的有用建议。按顺序排列 INPUT、IF、YES 输出、ELSE、NO 输出和 ENDIF。写出成功标准：“如果输入是___，助手应显示___。”"),
explain:B("EXPLAIN: tell a partner what your question checks. Follow the instructions for YES, then for NO, pointing out which output is used and which is skipped. Explain why each piece of advice helps Sam.","TERANGKAN: beritahu rakan apa yang disemak oleh soalan anda. Ikut arahan untuk YES, kemudian NO, sambil menunjukkan output yang digunakan dan dilangkau. Terangkan mengapa setiap nasihat membantu Sam.","解释：告诉同伴你的问题检查什么。先按 YES 执行指令，再按 NO 执行，指出显示哪个输出、跳过哪个输出，并解释每条建议如何帮助 Sam。"),
test:B("TEST: before trying each answer, predict its output. Ask a partner to follow your written plan or use the walkthrough. Record the actual output for both YES and NO, compare it with your prediction, and note any step that needed guessing.","UJI: sebelum mencuba setiap jawapan, ramalkan outputnya. Minta rakan mengikut pelan bertulis atau gunakan panduan pelaksanaan. Rekod output sebenar bagi YES dan NO, bandingkan dengan ramalan, dan catat langkah yang memerlukan tekaan.","测试：尝试每个答案前，先预测输出。请同伴执行书面计划，或使用屏幕执行功能。记录 YES 和 NO 的实际输出，与预测比较，并记下哪些步骤需要猜测。"),
improve:B("IMPROVE: use that evidence to revise a question, instruction or piece of advice, then test both routes again. For example, replace “Be careful” with a specific action and where to check. If both routes already work, ask a partner to challenge the wording and explain what you checked.","BAIKI: gunakan bukti itu untuk membaiki soalan, arahan atau nasihat, kemudian uji kedua-dua laluan semula. Contohnya, gantikan “Berhati-hati” dengan tindakan khusus dan tempat untuk menyemak. Jika kedua-dua laluan sudah berfungsi, minta rakan menilai kejelasan perkataan dan terangkan apa yang disemak.","改进：根据证据修改问题、指令或建议，再测试两条路径。例如，把“小心”改成具体行动及核实渠道。如果两条路径都已正常工作，请同伴检查措辞，并解释你检查了什么。"),
skillsEvidence:B("You can show progress with a plan a partner follows without guessing, two recorded tests, and a reason for your revision or review. Explain “My test showed ___, so I changed or checked ___.”","Anda menunjukkan kemajuan melalui pelan yang boleh diikuti tanpa tekaan, dua rekod ujian dan sebab bagi pindaan atau semakan. Terangkan “Ujian saya menunjukkan ___, jadi saya mengubah atau menyemak ___.”","进步的证据：同伴能不靠猜测执行你的计划；你有两次测试记录，并能说明修改或复查的理由：“测试显示___，所以我修改或检查了___。”"),
understandingTitle:B("Understanding · Match your advice to what you actually know","Pemahaman · Padankan nasihat dengan apa yang benar-benar diketahui","理解 · 建议要符合实际掌握的信息"),
limit:B("“This check does not prove safety” means the helper cannot promise that a message is genuine or that its link is safe to open. It only uses the answer to your one question. It has not verified the sender, opened the link or checked whether a reward really exists. A correct output shows that the rule was followed; it does not show that the message can be trusted.","“Semakan ini tidak membuktikan keselamatan” bermaksud pembantu tidak boleh menjamin mesej itu sah atau pautannya selamat dibuka. Ia hanya menggunakan jawapan kepada satu soalan anda. Ia belum mengesahkan penghantar, membuka pautan atau menyemak sama ada ganjaran benar-benar wujud. Output yang betul menunjukkan peraturan diikuti; ia tidak menunjukkan mesej boleh dipercayai.","“这项检查不能证明安全”是指：助手不能保证消息真实，也不能保证链接可以安全打开。它只使用你的一个问题的答案，并没有核实发件人、打开链接或查证奖励是否存在。输出正确只说明规则被执行，并不说明消息可信。"),
contrast:B("For the teacher’s pressure check, a genuine school message saying “The bus leaves in five minutes” could get YES. A fake prize message saying “Claim whenever you like” could get NO. Urgency alone cannot settle whether either message is genuine. NO means this particular warning sign was not reported, not that every possible risk has been checked.","Bagi semakan desakan guru, mesej sekolah yang sah seperti “Bas bertolak lima minit lagi” boleh mendapat YES. Mesej hadiah palsu seperti “Tuntut bila-bila masa” boleh mendapat NO. Desakan sahaja tidak menentukan sama ada mesej itu sah. NO bermaksud tanda amaran tertentu ini tidak dilaporkan, bukannya semua risiko sudah disemak.","在教师的催促检查中，真实的学校消息“校车五分钟后出发”可能得到 YES；虚假的领奖消息“随时都可以领取”可能得到 NO。仅凭是否催促，无法确定消息真假。NO 只表示使用者没有报告这一种警示，不表示所有风险都已经检查过。"),
understandingTask:B("Your task: check both pieces of your own advice. For YES, name the warning sign and a useful next step. For NO, explain that this sign was not identified and suggest a further check, such as checking the offer in the game’s usual app. Explain one thing your rule cannot establish. Avoid promising “safe” or declaring “definitely a scam” from one answer.","Tugasan anda: semak kedua-dua nasihat sendiri. Bagi YES, nyatakan tanda amaran dan langkah seterusnya yang berguna. Bagi NO, terangkan bahawa tanda ini tidak dikenal pasti dan cadangkan semakan lanjut, seperti menyemak tawaran dalam aplikasi permainan yang biasa digunakan. Terangkan satu perkara yang tidak dapat dipastikan oleh peraturan anda. Elakkan menjanjikan “selamat” atau menyatakan “pasti penipuan” daripada satu jawapan.","你的任务：检查自己写的两条建议。YES 时指出警示及有用的下一步；NO 时说明没有发现这一种警示，并建议进一步核实，例如在平时使用的游戏应用中查看奖励。解释一件你的规则无法确定的事。不要根据一个答案就保证“安全”或断言“一定是诈骗”。"),
understandingEvidence:B("You can show progress when you explain: “My helper knows ___ because the user answered ___. It still does not know ___. Sam should check ___ before acting.” Use this reasoning in your advice and plenary answer.","Anda menunjukkan kemajuan apabila boleh menerangkan: “Pembantu saya tahu ___ kerana pengguna menjawab ___. Ia masih tidak tahu ___. Sam patut menyemak ___ sebelum bertindak.” Gunakan alasan ini dalam nasihat dan jawapan penutup.","进步的证据：你能解释：“因为使用者回答了___，我的助手知道___。它仍不知道___。Sam 行动前应该核实___。”将这段推理用在你的建议和课堂总结回答中。"),
connection:B("Together, these meet today’s WAGBA: knowledge gives you the parts to use; skills turn them into a testable plan; understanding helps you choose advice that is useful without claiming more than the check can tell you. Use all three, then choose where you need the most practice.","Ketiga-tiganya mencapai WAGBA hari ini: pengetahuan memberi bahagian yang diperlukan; kemahiran menjadikannya pelan yang boleh diuji; pemahaman membantu memilih nasihat berguna tanpa mendakwa lebih daripada maklumat semakan. Gunakan ketiga-tiganya, kemudian pilih bidang yang paling memerlukan latihan.","三者共同实现今天的 WAGBA：知识让你认识所需部分，技能让你把它们组成可测试的计划，理解帮助你给出有用且不超出检查能力的建议。三方面都要运用，再选择最需要练习的一项。"),
guideLink:B("Learning tasks and examples","Tugasan dan contoh pembelajaran","学习任务与示例")
};
const STARTER={
 "steps": [
  {
   "en": "Read first",
   "ms": "Baca dahulu",
   "zh": "先阅读"
  },
  {
   "en": "Do Now · Knowledge",
   "ms": "Aktiviti Mula · Pengetahuan",
   "zh": "开始活动 · 知识"
  },
  {
   "en": "Do Now · Skills",
   "ms": "Aktiviti Mula · Kemahiran",
   "zh": "开始活动 · 技能"
  },
  {
   "en": "Do Now · Understanding",
   "ms": "Aktiviti Mula · Pemahaman",
   "zh": "开始活动 · 理解"
  }
 ],
 "titles": [
  {
   "en": "Before the Do Now: read, notice, stay safe",
   "ms": "Sebelum Aktiviti Mula: baca, perhatikan, kekal selamat",
   "zh": "开始活动前：阅读、观察、保护自己"
  },
  {
   "en": "1–4 · Recognise the problem and safe actions",
   "ms": "1–4 · Kenal pasti masalah dan tindakan selamat",
   "zh": "1–4 · 识别问题与安全行动"
  },
  {
   "en": "5–8 · Turn observations into a program plan",
   "ms": "5–8 · Tukar pemerhatian kepada pelan program",
   "zh": "5–8 · 把观察转成程序计划"
  },
  {
   "en": "9–12 · Explain and improve the advice",
   "ms": "9–12 · Terangkan dan baiki nasihat",
   "zh": "9–12 · 解释并改进建议"
  }
 ],
 "intros": [
  {
   "en": "Study the reading and Sam’s message before answering. Then work through three sets of four questions. You can return to the reading, discuss your ideas and revise any answer. All examples are fictional; there is no link to investigate.",
   "ms": "Kaji bacaan dan mesej Sam sebelum menjawab. Kemudian jawab tiga set dengan empat soalan setiap satu. Anda boleh kembali kepada bacaan, berbincang dan membaiki jawapan. Semua contoh rekaan; tiada pautan untuk disiasat.",
   "zh": "先阅读材料并研究 Sam 的消息，再完成三组题目，每组四题。可以回看阅读、讨论想法并修改答案。所有示例均为虚构，无需调查任何链接。"
  },
  {
   "en": "Use evidence from Sam’s message. Explain what makes you pause and what Sam should do before acting.",
   "ms": "Gunakan bukti daripada mesej Sam. Terangkan apa yang membuat anda berhenti seketika dan apa yang Sam patut lakukan sebelum bertindak.",
   "zh": "使用 Sam 消息中的证据，解释哪些内容让你停下来思考，以及 Sam 行动前应该做什么。"
  },
  {
   "en": "Use the small pressure-check plan below. You are practising how a person’s observation becomes an input, a decision and advice.",
   "ms": "Gunakan pelan semakan desakan ringkas di bawah. Anda berlatih menukar pemerhatian seseorang kepada input, keputusan dan nasihat.",
   "zh": "使用下面的小型催促检查计划，练习怎样把人的观察转成输入、判断和建议。"
  },
  {
   "en": "A useful helper explains its limits. Apply the reading to a new message, improve an unsafe output and describe the purpose of your own helper.",
   "ms": "Pembantu yang berguna menerangkan hadnya. Gunakan bacaan pada mesej baharu, baiki output tidak selamat dan huraikan tujuan pembantu sendiri.",
   "zh": "有用的助手会说明自己的局限。把阅读知识用于新消息，改进不安全的输出，并描述你自己助手的用途。"
  }
 ],
 "readAgain": {
  "en": "Revisit the reading",
  "ms": "Lihat bacaan semula",
  "zh": "回看阅读"
 },
 "reviewLabel": {
  "en": "Compare my explanation",
  "ms": "Bandingkan penerangan saya",
  "zh": "对照检查我的解释"
 },
 "reviewNote": {
  "en": "Use these points to review your reasoning. This is guidance, not an automatic mark. Revise your answer if you notice a gap.",
  "ms": "Gunakan perkara ini untuk menyemak alasan anda. Ini panduan, bukan markah automatik. Baiki jawapan jika ada kekurangan.",
  "zh": "用这些要点检查你的推理。这是学习指导，不是自动评分。发现遗漏时请修改答案。"
 },
 "reviewEmpty": {
  "en": "Write a short explanation first, or discuss it and return later. Any language is welcome.",
  "ms": "Tulis penerangan ringkas dahulu, atau bincang dan kembali kemudian. Sebarang bahasa diterima.",
  "zh": "请先写一段简短解释，也可以先讨论再回来填写。可以使用任何语言。"
 },
 "outcomeTitle": {
  "en": "What you will accomplish today",
  "ms": "Apa yang akan anda capai hari ini",
  "zh": "今天你要完成什么"
 },
 "outcome": {
  "en": "By the end, produce a message-helper plan for Sam: explain his need, choose one warning sign, write a YES/NO question and two useful advice messages, order the instructions, record YES and NO tests, and explain what you improved or checked. The starter prepares you for those decisions; you will develop your own plan in the main tasks.",
  "ms": "Pada akhir pelajaran, hasilkan pelan pembantu mesej untuk Sam: terangkan keperluannya, pilih satu tanda amaran, tulis soalan YES/NO dan dua nasihat berguna, susun arahan, rekod ujian YES dan NO, serta terangkan apa yang dibaiki atau disemak. Aktiviti mula menyediakan anda untuk keputusan itu; anda akan membina pelan sendiri dalam tugasan utama.",
  "zh": "本课结束时，完成 Sam 的消息助手计划：解释他的需要、选择一种警示、写一个 YES/NO 问题和两条有用建议、排列指令、记录 YES 和 NO 测试，并解释修改或检查了什么。开始活动帮助你为这些决定做准备；主任务中再发展自己的计划。"
 },
 "definitionTitle": {
  "en": "1 · What is a fake message?",
  "ms": "1 · Apakah mesej palsu?",
  "zh": "1 · 什么是假消息？"
 },
 "definition": {
  "en": "A fake or scam message tries to mislead someone into doing something that benefits the sender. Phishing is a trick that impersonates a trusted person or service to steal information or draw someone to a harmful link. It can arrive through email, texts, gaming chats or social media. A familiar name, polished spelling or a logo does not verify the sender.",
  "ms": "Mesej palsu atau penipuan cuba memperdaya seseorang supaya melakukan sesuatu yang menguntungkan penghantar. Phishing ialah helah menyamar sebagai individu atau perkhidmatan dipercayai untuk mencuri maklumat atau menarik pengguna ke pautan berbahaya. Ia boleh tiba melalui e-mel, SMS, sembang permainan atau media sosial. Nama dikenali, ejaan kemas atau logo tidak mengesahkan penghantar.",
  "zh": "假消息或诈骗消息试图误导人做出有利于发送者的行动。网络钓鱼（phishing）会冒充可信的人或服务，骗取信息或引人打开有害链接。它可能出现在邮件、短信、游戏聊天或社交媒体中。熟悉的名称、正确的拼写或标志，都不能核实发送者身份。"
 },
 "scenarioTitle": {
  "en": "2 · Study Sam’s situation",
  "ms": "2 · Kaji situasi Sam",
  "zh": "2 · 研究 Sam 的情境"
 },
 "scenario": {
  "en": "Sam is 13. He receives this gaming-reward message but does not remember entering a competition. He is tempted by the coins and unsure whether to follow the link and sign in. Read what it asks him to do, then connect each clue to a concern.",
  "ms": "Sam berumur 13 tahun. Dia menerima mesej ganjaran permainan ini tetapi tidak ingat menyertai pertandingan. Dia tertarik dengan syiling itu dan tidak pasti sama ada patut membuka pautan dan log masuk. Baca permintaannya, kemudian hubungkan setiap petunjuk dengan kebimbangan.",
  "zh": "Sam 13 岁，收到这条游戏奖励消息，但不记得参加过比赛。他很想要游戏币，却不确定该不该打开链接并登录。阅读消息要求他做什么，再把每个线索与可能的问题联系起来。"
 },
 "clues": [
  {
   "en": "“ACT NOW” / “expires today”: pressure may stop Sam thinking before acting.",
   "ms": "“BERTINDAK SEKARANG” / “tamat hari ini”: desakan boleh menghalang Sam berfikir sebelum bertindak.",
   "zh": "“立即行动”／“今天到期”：催促可能让 Sam 来不及思考就行动。"
  },
  {
   "en": "“5,000 coins”: an unexpected reward can make an unverified offer tempting.",
   "ms": "“5,000 syiling”: ganjaran tidak dijangka boleh menjadikan tawaran belum disahkan menarik.",
   "zh": "“5,000 游戏币”：意外奖励可能让未经核实的消息很有吸引力。"
  },
  {
   "en": "“Sign in to claim”: following a fake sign-in page could expose account details.",
   "ms": "“Log masuk untuk menuntut”: menggunakan halaman log masuk palsu boleh mendedahkan maklumat akaun.",
   "zh": "“登录即可领取”：使用假的登录页面可能泄露账户资料。"
  },
  {
   "en": "An unexpected link and the name “PrizePulse Alerts”: neither proves a connection to the real game. Here, .example is a fictional placeholder, not a real address to visit.",
   "ms": "Pautan tidak dijangka dan nama “PrizePulse Alerts”: kedua-duanya tidak membuktikan kaitan dengan permainan sebenar. Di sini, .example ialah alamat rekaan, bukan alamat sebenar untuk dilawati.",
   "zh": "意外链接和“PrizePulse Alerts”名称：两者都不能证明消息来自真正的游戏方。这里的 .example 是虚构占位地址，不是真实访问地址。"
  }
 ],
 "safeTitle": {
  "en": "3 · Pause, verify, get help",
  "ms": "3 · Berhenti, sahkan, dapatkan bantuan",
  "zh": "3 · 暂停、核实、求助"
 },
 "safeSteps": [
  {
   "en": "Pause. Do not use a suspicious message’s link, attachment or QR code, reply with details, or share a password or login code.",
   "ms": "Berhenti seketika. Jangan gunakan pautan, lampiran atau kod QR mesej mencurigakan, balas dengan maklumat peribadi, atau kongsi kata laluan atau kod log masuk.",
   "zh": "先暂停。不要使用可疑消息中的链接、附件或二维码，不要回复个人资料，也不要分享密码或登录验证码。"
  },
  {
   "en": "Check independently. Open the game’s usual app yourself or use contact details you already trust. For a school claim, ask the teacher directly. Asking the suspicious sender to confirm their own claim is not independent checking.",
   "ms": "Semak secara bebas. Buka sendiri aplikasi permainan yang biasa digunakan atau gunakan maklumat hubungan yang sudah dipercayai. Bagi dakwaan sekolah, tanya guru secara langsung. Meminta penghantar mencurigakan mengesahkan dakwaannya sendiri bukan semakan bebas.",
   "zh": "独立核实。自行打开平时使用的游戏应用，或使用已知可信的联系方式。学校相关消息可直接问老师。让可疑发送者确认自己的说法，不算独立核实。"
  },
  {
   "en": "Ask a trusted adult or teacher if unsure. Use the platform’s report feature with their help. If you already clicked or shared details, tell them promptly; do not hide it. If a password was shared, change it through the real service and change it on other accounts where you reused it.",
   "ms": "Tanya orang dewasa dipercayai atau guru jika tidak pasti. Gunakan ciri laporan platform dengan bantuan mereka. Jika sudah klik atau kongsi maklumat, beritahu segera; jangan sembunyikan. Jika kata laluan dikongsi, tukar melalui perkhidmatan sebenar dan pada akaun lain yang menggunakan kata laluan sama.",
   "zh": "不确定时，向可信的成人或老师求助，在其帮助下使用平台举报功能。如果已经点击或分享资料，请及时告诉他们，不要隐瞒。若泄露了密码，通过真正的服务更改密码，并更改其他重复使用该密码的账户。"
  }
 ],
 "limitTitle": {
  "en": "4 · A clue is a reason to check",
  "ms": "4 · Petunjuk ialah sebab untuk menyemak",
  "zh": "4 · 线索意味着需要核实"
 },
 "limit": {
  "en": "A real school message can be urgent. A fake offer can be calm and well written. You can identify suspicious features, but one feature cannot settle whether a message is genuine. If a pressure check returns NO, it means “no pressure reported”, not “all risks checked”.",
  "ms": "Mesej sekolah sebenar boleh mendesak. Tawaran palsu boleh tenang dan ditulis dengan kemas. Anda boleh mengenal pasti ciri mencurigakan, tetapi satu ciri tidak menentukan kesahihan mesej. Jika semakan desakan mendapat NO, maksudnya “tiada desakan dilaporkan”, bukan “semua risiko sudah disemak”.",
  "zh": "真实的学校消息也可能很急迫；假奖励消息也可能语气平静、措辞规范。你可以识别可疑特征，但单个特征不能确定消息真假。催促检查得到 NO，只表示“未报告催促”，不表示“已检查所有风险”。"
 },
 "programTitle": {
  "en": "5 · How could a program help?",
  "ms": "5 · Bagaimanakah program boleh membantu?",
  "zh": "5 · 程序能怎样帮助人？"
 },
 "program": {
  "en": "An advice helper asks a person about one warning sign and displays a next step. A learning quiz could explain clues after an answer; a checklist could remind users what to verify. Today, plan the advice helper. The person reads the message; the program only receives their answer. It does not inspect links or ask for passwords.",
  "ms": "Pembantu nasihat bertanya kepada pengguna tentang satu tanda amaran dan memaparkan langkah seterusnya. Kuiz pembelajaran boleh menerangkan petunjuk selepas jawapan; senarai semak boleh mengingatkan pengguna apa yang perlu disahkan. Hari ini, rancang pembantu nasihat. Pengguna membaca mesej; program hanya menerima jawapannya. Ia tidak memeriksa pautan atau meminta kata laluan.",
  "zh": "建议助手可以询问一种警示，并显示下一步行动。学习测验可以在回答后解释线索；检查清单可以提醒用户需要核实什么。今天规划的是建议助手：人阅读消息，程序只接收人的回答，不检查链接，也不索取密码。"
 },
 "modelTitle": {
  "en": "Small model · the teacher’s pressure check",
  "ms": "Model ringkas · semakan desakan guru",
  "zh": "小型示例 · 教师的催促检查"
 },
 "modelQuestion": {
  "en": "Question: “Does the message pressure you to act immediately?”",
  "ms": "Soalan: “Adakah mesej mendesak anda bertindak segera?”",
  "zh": "问题：“消息是否催促你立即行动？”"
 },
 "modelParts": [
  {
   "en": "INPUT: receive the person’s YES/NO answer and store it as urgent.",
   "ms": "INPUT: terima jawapan YES/NO pengguna dan simpan sebagai urgent.",
   "zh": "INPUT：接收使用者的 YES/NO 答案，保存为 urgent。"
  },
  {
   "en": "DECISION: IF urgent = YES, select the pressure advice; ELSE select the other advice. Only one output is shown.",
   "ms": "KEPUTUSAN: IF urgent = YES, pilih nasihat desakan; ELSE pilih nasihat lain. Hanya satu output dipaparkan.",
   "zh": "判断：IF urgent = YES，选择催促建议；ELSE 选择另一条建议。只显示一个输出。"
  },
  {
   "en": "OUTPUT for YES: “Pressure reported. Pause and check in the game’s usual app before acting.”",
   "ms": "OUTPUT bagi YES: “Desakan dilaporkan. Berhenti seketika dan semak dalam aplikasi permainan biasa sebelum bertindak.”",
   "zh": "YES 的 OUTPUT：“报告了催促。先暂停，行动前在平时使用的游戏应用中核实。”"
  },
  {
   "en": "OUTPUT for NO: “No pressure reported. Other risks may remain; check the offer in the game’s usual app.”",
   "ms": "OUTPUT bagi NO: “Tiada desakan dilaporkan. Risiko lain mungkin masih ada; semak tawaran dalam aplikasi permainan biasa.”",
   "zh": "NO 的 OUTPUT：“未报告催促。仍可能有其他风险；在平时使用的游戏应用中核实奖励。”"
  }
 ],
 "testModel": {
  "en": "To test the plan, predict the advice for YES, follow the instructions and compare the actual output. Repeat for NO. A testable success criterion says which output should follow a particular input. If an output is missing or misleading, revise it and retest. Matching predictions checks the instructions; a person must also judge whether the advice is useful.",
  "ms": "Untuk menguji pelan, ramalkan nasihat bagi YES, ikut arahan dan bandingkan output sebenar. Ulang bagi NO. Kriteria kejayaan yang boleh diuji menyatakan output bagi input tertentu. Jika output hilang atau mengelirukan, baiki dan uji semula. Padanan ramalan menyemak arahan; manusia juga perlu menilai sama ada nasihat berguna.",
  "zh": "测试计划时，先预测 YES 的建议，再执行指令并比较实际输出；对 NO 重复操作。可测试的成功标准应说明某个输入对应哪个输出。如果输出缺失或误导，就修改并重新测试。预测匹配可以检查指令，但仍需要人判断建议是否有用。"
 },
 "transfer": {
  "en": "Your addition later will check an unexpected link, a sign-in request or an unexpected reward. Use the same input → decision → output pattern, with a question and advice suited to your chosen sign.",
  "ms": "Tambahan anda nanti akan menyemak pautan tidak dijangka, permintaan log masuk atau ganjaran tidak dijangka. Gunakan corak input → keputusan → output yang sama, dengan soalan dan nasihat sesuai untuk tanda dipilih.",
  "zh": "你后面的新增部分将检查意外链接、登录请求或意外奖励。使用相同的“输入 → 判断 → 输出”结构，问题和建议要符合所选警示。"
 },
 "newMessage": {
  "en": "A new fictional message says: “The school bus leaves in five minutes. Please come to reception now.” It asks for immediate action but does not ask for a password.",
  "ms": "Mesej rekaan baharu menyatakan: “Bas sekolah bertolak lima minit lagi. Sila datang ke kaunter sekarang.” Ia meminta tindakan segera tetapi tidak meminta kata laluan.",
  "zh": "一条新的虚构消息说：“校车五分钟后出发，请现在到接待处。”它要求立即行动，但没有索取密码。"
 },
 "sourcesLabel": {
  "en": "Safety guidance behind this reading",
  "ms": "Panduan keselamatan di sebalik bacaan ini",
  "zh": "阅读所依据的安全指南"
 },
 "groups": [
  [
   "clue",
   "starterEvidence",
   "starterPhishing",
   "starterSafe"
  ],
  [
   "starterQuestion",
   "starterInput",
   "starterOutput",
   "starterTest"
  ],
  [
   "starterUrgent",
   "starterLimit",
   "starterImprove",
   "starterPurpose"
  ]
 ],
 "items": [
  {
   "id": "starterEvidence",
   "prompt": {
    "en": "2. Apart from pressure, identify ONE other clue in Sam’s message. Quote or name it and explain why Sam should check before acting.",
    "ms": "2. Selain desakan, kenal pasti SATU petunjuk lain dalam mesej Sam. Petik atau namakannya dan terangkan mengapa Sam patut menyemak sebelum bertindak.",
    "zh": "2. 除了催促，在 Sam 的消息中指出另一条线索。引用或说出该内容，并解释 Sam 为什么应先核实再行动。"
   },
   "review": {
    "en": "Link evidence to a reason: the unexpected coins need confirmation, or the sign-in request could expose account details on a fake page. Naming a clue alone is not the explanation. You do not have to prove that the message is fake.",
    "ms": "Hubungkan bukti dengan sebab: syiling tidak dijangka perlu disahkan, atau permintaan log masuk boleh mendedahkan maklumat akaun pada halaman palsu. Menamakan petunjuk sahaja bukan penerangan. Anda tidak perlu membuktikan mesej itu palsu.",
    "zh": "把证据与理由联系起来：意外游戏币需要核实，或登录请求可能让账户资料泄露到假页面。只说出线索还不算解释。你不需要证明消息是假的。"
   }
  },
  {
   "id": "starterPhishing",
   "prompt": {
    "en": "3. Which description best explains phishing?",
    "ms": "3. Penerangan manakah paling tepat tentang phishing?",
    "zh": "3. 哪个描述最能解释网络钓鱼？"
   },
   "options": [
    {
     "value": "typo",
     "label": {
      "en": "Any message containing a spelling mistake",
      "ms": "Sebarang mesej dengan kesalahan ejaan",
      "zh": "任何有拼写错误的消息"
     }
    },
    {
     "value": "impersonate",
     "label": {
      "en": "A trick that pretends to be trusted to obtain information or lead you to a harmful link",
      "ms": "Helah menyamar sebagai pihak dipercayai untuk mendapatkan maklumat atau membawa ke pautan berbahaya",
      "zh": "冒充可信对象，骗取信息或引人打开有害链接的骗局"
     }
    },
    {
     "value": "reward",
     "label": {
      "en": "Every message offering a reward",
      "ms": "Setiap mesej menawarkan ganjaran",
      "zh": "所有提供奖励的消息"
     }
    }
   ],
   "answer": "impersonate",
   "choiceFeedback": {
    "typo": {
     "en": "Spelling is not a reliable definition. Fake messages can be polished, and genuine people make mistakes. Look at the attempt to mislead.",
     "ms": "Ejaan bukan definisi yang boleh dipercayai. Mesej palsu boleh kemas, dan orang sebenar boleh tersilap. Perhatikan cubaan memperdaya.",
     "zh": "拼写不能定义网络钓鱼。假消息可以写得很规范，真实的人也会写错。要关注是否在试图误导。"
    },
    "impersonate": {
     "en": "Yes. The deception uses apparent trust to get information or a risky action. The sender’s appearance alone does not verify identity.",
     "ms": "Ya. Penipuan menggunakan kepercayaan yang kelihatan untuk mendapatkan maklumat atau tindakan berisiko. Penampilan penghantar sahaja tidak mengesahkan identiti.",
     "zh": "对。骗局利用表面上的可信感，骗取信息或诱导风险行动。发送者的外观不能核实身份。"
    },
    "reward": {
     "en": "A reward is a reason to check its source and conditions. Rewards can be genuine; phishing involves deception.",
     "ms": "Ganjaran ialah sebab untuk menyemak sumber dan syaratnya. Ganjaran boleh sah; phishing melibatkan penipuan.",
     "zh": "奖励值得核实来源和条件，但也可能真实。网络钓鱼的关键是欺骗。"
    }
   },
   "feedback": {
    "en": "Yes. The deception uses apparent trust to get information or a risky action. The sender’s appearance alone does not verify identity.",
    "ms": "Ya. Penipuan menggunakan kepercayaan yang kelihatan untuk mendapatkan maklumat atau tindakan berisiko. Penampilan penghantar sahaja tidak mengesahkan identiti.",
    "zh": "对。骗局利用表面上的可信感，骗取信息或诱导风险行动。发送者的外观不能核实身份。"
   }
  },
  {
   "id": "starterSafe",
   "prompt": {
    "en": "4. What should Sam do next?",
    "ms": "4. Apakah yang Sam patut lakukan seterusnya?",
    "zh": "4. Sam 下一步应该做什么？"
   },
   "options": [
    {
     "value": "click",
     "label": {
      "en": "Open the message’s link to see whether it looks official",
      "ms": "Buka pautan mesej untuk melihat sama ada kelihatan rasmi",
      "zh": "打开消息链接，看看像不像官方网站"
     }
    },
    {
     "value": "reply",
     "label": {
      "en": "Reply and ask the sender whether the prize is real",
      "ms": "Balas dan tanya penghantar sama ada hadiah itu benar",
      "zh": "回复发送者，问奖励是不是真的"
     }
    },
    {
     "value": "independent",
     "label": {
      "en": "Open the game’s usual app independently and ask a trusted adult if unsure",
      "ms": "Buka aplikasi permainan biasa secara bebas dan tanya orang dewasa dipercayai jika tidak pasti",
      "zh": "自行打开平时使用的游戏应用核实，不确定时向可信成人求助"
     }
    }
   ],
   "answer": "independent",
   "choiceFeedback": {
    "click": {
     "en": "Do not investigate through the suspicious link. A fake page can look official. Use a route Sam already trusts.",
     "ms": "Jangan siasat melalui pautan mencurigakan. Halaman palsu boleh kelihatan rasmi. Gunakan laluan yang sudah dipercayai Sam.",
     "zh": "不要通过可疑链接调查。假页面也可以看起来很正式。应使用 Sam 已知可信的渠道。"
    },
    "reply": {
     "en": "The same sender can repeat a false claim. Independent checking means using a different, trusted route.",
     "ms": "Penghantar sama boleh mengulangi dakwaan palsu. Semakan bebas bermaksud menggunakan laluan lain yang dipercayai.",
     "zh": "同一个发送者可以继续说假话。独立核实意味着使用另一条可信渠道。"
    },
    "independent": {
     "en": "This checks the claim without using the suspicious link. If Sam is unsure, a trusted adult can help him verify and report it.",
     "ms": "Ini menyemak dakwaan tanpa menggunakan pautan mencurigakan. Jika tidak pasti, orang dewasa dipercayai boleh membantu mengesahkan dan melaporkan.",
     "zh": "这样可在不使用可疑链接的情况下核实说法。不确定时，可信成人可以帮助核实和举报。"
    }
   },
   "feedback": {
    "en": "This checks the claim without using the suspicious link. If Sam is unsure, a trusted adult can help him verify and report it.",
    "ms": "Ini menyemak dakwaan tanpa menggunakan pautan mencurigakan. Jika tidak pasti, orang dewasa dipercayai boleh membantu mengesahkan dan melaporkan.",
    "zh": "这样可在不使用可疑链接的情况下核实说法。不确定时，可信成人可以帮助核实和举报。"
   }
  },
  {
   "id": "starterQuestion",
   "prompt": {
    "en": "5. Which question gives the pressure-check helper an observation it can use?",
    "ms": "5. Soalan manakah memberi pemerhatian yang boleh digunakan pembantu semakan desakan?",
    "zh": "5. 哪个问题能给催促检查助手提供可用的观察信息？"
   },
   "options": [
    {
     "value": "verdict",
     "label": {
      "en": "Is this definitely a scam?",
      "ms": "Adakah ini pasti penipuan?",
      "zh": "这肯定是诈骗吗？"
     }
    },
    {
     "value": "pressure",
     "label": {
      "en": "Does the message pressure you to act immediately?",
      "ms": "Adakah mesej mendesak anda bertindak segera?",
      "zh": "消息是否催促你立即行动？"
     }
    },
    {
     "value": "password",
     "label": {
      "en": "What is your game password?",
      "ms": "Apakah kata laluan permainan anda?",
      "zh": "你的游戏密码是什么？"
     }
    }
   ],
   "answer": "pressure",
   "choiceFeedback": {
    "verdict": {
     "en": "This asks Sam to make the final judgement he needs help with. Ask about a feature he can observe instead.",
     "ms": "Ini meminta Sam membuat keputusan akhir yang memerlukan bantuan. Sebaliknya, tanya tentang ciri yang boleh diperhatikan.",
     "zh": "这要求 Sam 先做出他本来需要帮助才能做的最终判断。应询问他能够观察的特征。"
    },
    "pressure": {
     "en": "This is specific, answerable with YES/NO and linked to the rule. The helper can choose advice from the answer.",
     "ms": "Ini khusus, boleh dijawab YES/NO dan berkait dengan peraturan. Pembantu boleh memilih nasihat daripada jawapan.",
     "zh": "这个问题具体、可用 YES/NO 回答，并与规则相关。助手能根据答案选择建议。"
    },
    "password": {
     "en": "The helper does not need a password to explain a warning sign. Ask about the message, not secret account details.",
     "ms": "Pembantu tidak memerlukan kata laluan untuk menerangkan tanda amaran. Tanya tentang mesej, bukan maklumat akaun rahsia.",
     "zh": "助手不需要密码来解释警示。应询问消息特征，而不是秘密账户资料。"
    }
   },
   "feedback": {
    "en": "This is specific, answerable with YES/NO and linked to the rule. The helper can choose advice from the answer.",
    "ms": "Ini khusus, boleh dijawab YES/NO dan berkait dengan peraturan. Pembantu boleh memilih nasihat daripada jawapan.",
    "zh": "这个问题具体、可用 YES/NO 回答，并与规则相关。助手能根据答案选择建议。"
   }
  },
  {
   "id": "starterInput",
   "prompt": {
    "en": "6. Sam answers YES to the pressure question. What is the program’s input in this version?",
    "ms": "6. Sam menjawab YES kepada soalan desakan. Apakah input program dalam versi ini?",
    "zh": "6. Sam 对催促问题回答 YES。在这个版本中，程序输入是什么？"
   },
   "options": [
    {
     "value": "message",
     "label": {
      "en": "The whole gaming message",
      "ms": "Keseluruhan mesej permainan",
      "zh": "整条游戏消息"
     }
    },
    {
     "value": "advice",
     "label": {
      "en": "The advice shown on screen",
      "ms": "Nasihat dipaparkan pada skrin",
      "zh": "屏幕上显示的建议"
     }
    },
    {
     "value": "yes",
     "label": {
      "en": "Sam’s YES answer, stored as urgent",
      "ms": "Jawapan YES Sam, disimpan sebagai urgent",
      "zh": "Sam 的 YES 答案，保存为 urgent"
     }
    }
   ],
   "answer": "yes",
   "choiceFeedback": {
    "message": {
     "en": "Sam reads the message. This version receives only his answer; it does not read the whole message itself.",
     "ms": "Sam membaca mesej. Versi ini hanya menerima jawapannya; ia tidak membaca keseluruhan mesej sendiri.",
     "zh": "Sam 阅读消息。这个版本只接收他的答案，本身不读取整条消息。"
    },
    "advice": {
     "en": "Advice is the output: information produced after the decision. The input arrives before that decision.",
     "ms": "Nasihat ialah output: maklumat dihasilkan selepas keputusan. Input tiba sebelum keputusan itu.",
     "zh": "建议是输出：判断后产生的信息。输入在判断之前进入程序。"
    },
    "yes": {
     "en": "Correct. The input is YES. The IF condition compares urgent with YES to choose the route.",
     "ms": "Betul. Input ialah YES. Syarat IF membandingkan urgent dengan YES untuk memilih laluan.",
     "zh": "正确。输入是 YES。IF 条件比较 urgent 是否为 YES，据此选择路径。"
    }
   },
   "feedback": {
    "en": "Correct. The input is YES. The IF condition compares urgent with YES to choose the route.",
    "ms": "Betul. Input ialah YES. Syarat IF membandingkan urgent dengan YES untuk memilih laluan.",
    "zh": "正确。输入是 YES。IF 条件比较 urgent 是否为 YES，据此选择路径。"
   }
  },
  {
   "id": "starterOutput",
   "prompt": {
    "en": "7. For urgent = YES, what should the model display?",
    "ms": "7. Bagi urgent = YES, apakah yang patut dipaparkan model?",
    "zh": "7. urgent = YES 时，示例应显示什么？"
   },
   "options": [
    {
     "value": "yesAdvice",
     "label": {
      "en": "Only the pressure advice: pause and check in the usual app",
      "ms": "Hanya nasihat desakan: berhenti dan semak dalam aplikasi biasa",
      "zh": "只显示催促建议：暂停并在常用应用中核实"
     }
    },
    {
     "value": "both",
     "label": {
      "en": "Both pieces of advice, one after the other",
      "ms": "Kedua-dua nasihat, satu demi satu",
      "zh": "两条建议依次显示"
     }
    },
    {
     "value": "safe",
     "label": {
      "en": "The message is definitely safe",
      "ms": "Mesej itu pasti selamat",
      "zh": "消息肯定安全"
     }
    }
   ],
   "answer": "yesAdvice",
   "choiceFeedback": {
    "yesAdvice": {
     "en": "The IF condition is true, so the YES output is selected and the ELSE output is skipped. The advice names a next step.",
     "ms": "Syarat IF benar, jadi output YES dipilih dan output ELSE dilangkau. Nasihat menyatakan langkah seterusnya.",
     "zh": "IF 条件为真，因此选择 YES 输出并跳过 ELSE 输出。建议指出了下一步行动。"
    },
    "both": {
     "en": "IF/ELSE selects one route for one answer. Trace YES again and skip the output after ELSE.",
     "ms": "IF/ELSE memilih satu laluan bagi satu jawapan. Jejak YES semula dan langkau output selepas ELSE.",
     "zh": "IF/ELSE 为一个答案选择一条路径。再按 YES 执行一次，跳过 ELSE 后的输出。"
    },
    "safe": {
     "en": "YES reports pressure; it cannot establish safety. Follow the stated rule and use its pressure advice.",
     "ms": "YES melaporkan desakan; ia tidak boleh memastikan keselamatan. Ikut peraturan yang dinyatakan dan gunakan nasihat desakan.",
     "zh": "YES 表示报告了催促，不能确定安全。应按照给定规则显示催促建议。"
    }
   },
   "feedback": {
    "en": "The IF condition is true, so the YES output is selected and the ELSE output is skipped. The advice names a next step.",
    "ms": "Syarat IF benar, jadi output YES dipilih dan output ELSE dilangkau. Nasihat menyatakan langkah seterusnya.",
    "zh": "IF 条件为真，因此选择 YES 输出并跳过 ELSE 输出。建议指出了下一步行动。"
   }
  },
  {
   "id": "starterTest",
   "prompt": {
    "en": "8. Which test plan would give useful evidence before writing Python?",
    "ms": "8. Pelan ujian manakah memberi bukti berguna sebelum menulis Python?",
    "zh": "8. 编写 Python 前，哪种测试计划能提供有用证据？"
   },
   "options": [
    {
     "value": "one",
     "label": {
      "en": "Try YES once; if advice appears, call the plan finished",
      "ms": "Cuba YES sekali; jika nasihat muncul, anggap pelan siap",
      "zh": "测试一次 YES，出现建议就算完成"
     }
    },
    {
     "value": "both",
     "label": {
      "en": "Predict each output, test YES and NO, compare actual results and revise any unclear step",
      "ms": "Ramalkan setiap output, uji YES dan NO, bandingkan hasil sebenar dan baiki langkah kurang jelas",
      "zh": "预测每个输出，测试 YES 和 NO，比较实际结果并修改不清楚的步骤"
     }
    },
    {
     "value": "looks",
     "label": {
      "en": "Check that the screen looks attractive",
      "ms": "Semak skrin kelihatan menarik",
      "zh": "检查屏幕是否好看"
     }
    }
   ],
   "answer": "both",
   "choiceFeedback": {
    "one": {
     "en": "That leaves the NO route untested. A missing or misleading NO output could be missed.",
     "ms": "Itu membiarkan laluan NO tidak diuji. Output NO yang hilang atau mengelirukan boleh terlepas.",
     "zh": "这样没有测试 NO 路径，可能漏掉缺失或误导性的 NO 输出。"
    },
    "both": {
     "en": "This gives an expected and actual result for each branch. A criterion could be: “For NO, display the no-pressure advice.” Retest after a revision.",
     "ms": "Ini memberi hasil dijangka dan sebenar bagi setiap cabang. Kriteria boleh berbunyi: “Bagi NO, papar nasihat tiada desakan.” Uji semula selepas pindaan.",
     "zh": "这样每条分支都有预期和实际结果。标准可以是：“输入 NO 时，显示未报告催促的建议。”修改后应重新测试。"
    },
    "looks": {
     "en": "Appearance does not test the instructions. Choose inputs and compare the resulting advice with predictions.",
     "ms": "Penampilan tidak menguji arahan. Pilih input dan bandingkan nasihat terhasil dengan ramalan.",
     "zh": "外观不能测试指令。应选择输入，并把实际建议与预测进行比较。"
    }
   },
   "feedback": {
    "en": "This gives an expected and actual result for each branch. A criterion could be: “For NO, display the no-pressure advice.” Retest after a revision.",
    "ms": "Ini memberi hasil dijangka dan sebenar bagi setiap cabang. Kriteria boleh berbunyi: “Bagi NO, papar nasihat tiada desakan.” Uji semula selepas pindaan.",
    "zh": "这样每条分支都有预期和实际结果。标准可以是：“输入 NO 时，显示未报告催促的建议。”修改后应重新测试。"
   }
  },
  {
   "id": "starterUrgent",
   "prompt": {
    "en": "9. What can we conclude from the bus message’s urgency?",
    "ms": "9. Apakah kesimpulan daripada desakan mesej bas?",
    "zh": "9. 从校车消息的急迫性可以得出什么结论？"
   },
   "options": [
    {
     "value": "fake",
     "label": {
      "en": "Urgent means definitely fake",
      "ms": "Mendesak bermaksud pasti palsu",
      "zh": "急迫就代表一定是假的"
     }
    },
    {
     "value": "school",
     "label": {
      "en": "A school-related message must be genuine",
      "ms": "Mesej berkaitan sekolah mesti sah",
      "zh": "学校相关消息一定是真的"
     }
    },
    {
     "value": "check",
     "label": {
      "en": "It reports urgency; check the school claim with a teacher through a trusted route",
      "ms": "Ia menunjukkan desakan; semak dakwaan sekolah dengan guru melalui laluan dipercayai",
      "zh": "它表现出急迫性；通过可信渠道向老师核实学校相关说法"
     }
    }
   ],
   "answer": "check",
   "choiceFeedback": {
    "fake": {
     "en": "Genuine messages can have real deadlines. Urgency is a clue, not proof of deception.",
     "ms": "Mesej sah boleh mempunyai tarikh akhir sebenar. Desakan ialah petunjuk, bukan bukti penipuan.",
     "zh": "真实消息也可能有真正的截止时间。急迫是线索，不是欺骗的证明。"
    },
    "school": {
     "en": "A message can claim to be from school without being genuine. The label is not independent evidence.",
     "ms": "Mesej boleh mendakwa daripada sekolah tanpa benar-benar sah. Label itu bukan bukti bebas.",
     "zh": "消息可以冒称来自学校。这个称呼不是独立证据。"
    },
    "check": {
     "en": "The pressure rule would receive YES, but a trusted check is still needed. The same YES input can occur in genuine and fake contexts.",
     "ms": "Peraturan desakan akan menerima YES, tetapi semakan dipercayai masih diperlukan. Input YES sama boleh berlaku dalam konteks sah dan palsu.",
     "zh": "催促规则会接收 YES，但仍需要可信的核实。同一个 YES 输入可能出现在真实和虚假的情境中。"
    }
   },
   "feedback": {
    "en": "The pressure rule would receive YES, but a trusted check is still needed. The same YES input can occur in genuine and fake contexts.",
    "ms": "Peraturan desakan akan menerima YES, tetapi semakan dipercayai masih diperlukan. Input YES sama boleh berlaku dalam konteks sah dan palsu.",
    "zh": "催促规则会接收 YES，但仍需要可信的核实。同一个 YES 输入可能出现在真实和虚假的情境中。"
   }
  },
  {
   "id": "starterLimit",
   "prompt": {
    "en": "10. Both program tests match their predictions. What have you shown?",
    "ms": "10. Kedua-dua ujian program sepadan dengan ramalan. Apakah yang telah ditunjukkan?",
    "zh": "10. 两次程序测试都符合预测。你证明了什么？"
   },
   "options": [
    {
     "value": "all",
     "label": {
      "en": "Every message receiving NO is safe",
      "ms": "Setiap mesej yang mendapat NO selamat",
      "zh": "所有得到 NO 的消息都安全"
     }
    },
    {
     "value": "routes",
     "label": {
      "en": "The tested inputs followed the planned routes; the advice still needs human review",
      "ms": "Input diuji mengikut laluan dirancang; nasihat masih perlu semakan manusia",
      "zh": "测试输入沿计划路径执行；建议仍需由人检查"
     }
    },
    {
     "value": "sender",
     "label": {
      "en": "The program has verified the real sender",
      "ms": "Program telah mengesahkan penghantar sebenar",
      "zh": "程序已经核实了真正的发送者"
     }
    }
   ],
   "answer": "routes",
   "choiceFeedback": {
    "all": {
     "en": "NO only says this warning sign was not reported. It does not cover every risk or every future message.",
     "ms": "NO hanya menyatakan tanda amaran ini tidak dilaporkan. Ia tidak meliputi setiap risiko atau mesej akan datang.",
     "zh": "NO 只表示没有报告这一种警示，不涵盖所有风险或未来所有消息。"
    },
    "routes": {
     "en": "Correct. Tests check whether the plan behaves as expected. A person must also check whether the advice explains the limits and gives a useful action.",
     "ms": "Betul. Ujian menyemak sama ada pelan bertindak seperti dijangka. Manusia juga perlu menyemak sama ada nasihat menerangkan had dan memberi tindakan berguna.",
     "zh": "正确。测试检查计划是否按预期运行。人还需要检查建议是否说明局限，并提供有用行动。"
    },
    "sender": {
     "en": "The only input was a YES/NO answer. No sender verification happened, even when both outputs matched.",
     "ms": "Satu-satunya input ialah jawapan YES/NO. Tiada pengesahan penghantar berlaku walaupun kedua-dua output sepadan.",
     "zh": "唯一输入只是 YES/NO 答案。即使两次输出都匹配，也没有进行发送者核实。"
    }
   },
   "feedback": {
    "en": "Correct. Tests check whether the plan behaves as expected. A person must also check whether the advice explains the limits and gives a useful action.",
    "ms": "Betul. Ujian menyemak sama ada pelan bertindak seperti dijangka. Manusia juga perlu menyemak sama ada nasihat menerangkan had dan memberi tindakan berguna.",
    "zh": "正确。测试检查计划是否按预期运行。人还需要检查建议是否说明局限，并提供有用行动。"
   }
  },
  {
   "id": "starterImprove",
   "prompt": {
    "en": "11. A draft NO output says “No pressure, so it is safe. Click the link.” Rewrite it to explain the limit and give Sam a useful next step.",
    "ms": "11. Draf output NO menyatakan “Tiada desakan, jadi selamat. Klik pautan.” Tulis semula untuk menerangkan had dan memberi Sam langkah seterusnya yang berguna.",
    "zh": "11. 一条 NO 输出草稿写着：“没有催促，所以安全。点击链接吧。”请改写它，说明局限，并给 Sam 有用的下一步。"
   },
   "review": {
    "en": "Does your revision say only that no pressure was reported, avoid promising safety, and give a specific independent check? For example: “No pressure reported. Other risks may remain. Check the offer in the game’s usual app before acting.” Explain to a partner why that change matters.",
    "ms": "Adakah pindaan hanya menyatakan tiada desakan dilaporkan, mengelakkan jaminan keselamatan dan memberi semakan bebas khusus? Contohnya: “Tiada desakan dilaporkan. Risiko lain mungkin ada. Semak tawaran dalam aplikasi permainan biasa sebelum bertindak.” Terangkan kepada rakan mengapa perubahan itu penting.",
    "zh": "你的修改是否只说明未报告催促、没有保证安全，并给出具体的独立核实方法？例如：“未报告催促。仍可能有其他风险。行动前在平时使用的游戏应用中核实奖励。”向同伴解释这一修改为什么重要。"
   }
  },
  {
   "id": "starterPurpose",
   "prompt": {
    "en": "12. What could YOUR helper help Sam notice and do? Choose an unexpected link, a sign-in request or an unexpected reward. Explain why asking about it and giving advice would help him make a more informed decision.",
    "ms": "12. Pembantu ANDA boleh membantu Sam menyedari dan melakukan apa? Pilih pautan tidak dijangka, permintaan log masuk atau ganjaran tidak dijangka. Terangkan mengapa bertanya tentangnya dan memberi nasihat membantu dia membuat keputusan lebih bermaklumat.",
    "zh": "12. 你自己的助手可以帮助 Sam 注意什么、采取什么行动？选择意外链接、登录请求或意外奖励。解释询问该特征并给出建议，为什么能帮助他作出更有依据的决定。"
   },
   "review": {
    "en": "Look for a user need, one observable warning sign, and a useful action linked to that sign. “It detects all scams” overclaims. Your idea should help Sam pause and verify something specific. In Main Task 1, develop this into one question, two outputs and a testable success criterion.",
    "ms": "Cari keperluan pengguna, satu tanda amaran boleh diperhatikan dan tindakan berguna berkait dengannya. “Ia mengesan semua penipuan” ialah dakwaan berlebihan. Idea anda patut membantu Sam berhenti dan mengesahkan sesuatu yang khusus. Dalam Tugasan Utama 1, kembangkan kepada satu soalan, dua output dan kriteria kejayaan boleh diuji.",
    "zh": "检查回答是否包含用户需要、一个可观察的警示，以及与该警示相关的有用行动。“能检测所有诈骗”说得过头了。你的想法应帮助 Sam 暂停并核实某个具体内容。在主任务一中，再把它发展成一个问题、两个输出和可测试的成功标准。"
   }
  }
 ]
};
const REFLECTION={
 "beforeTitle": {
  "en": "Types of Learning · my starting point",
  "ms": "Jenis Pembelajaran · titik permulaan saya",
  "zh": "学习类型 · 我的起点"
 },
 "afterTitle": {
  "en": "Learning Pit Stop · what can I demonstrate now?",
  "ms": "Hentian Pembelajaran · apakah yang boleh saya tunjukkan sekarang?",
  "zh": "学习加油站 · 现在我能展示什么？"
 },
 "beforeIntro": {
  "en": "Look back at your starter before setting a target. Recognise what you already knew and what you have just learned. Use the nine checks below to identify what you can demonstrate and what would help you improve. You may choose targets in more than one area.",
  "ms": "Lihat semula aktiviti mula sebelum menetapkan sasaran. Kenal pasti apa yang sudah diketahui dan apa yang baru dipelajari. Gunakan sembilan semakan di bawah untuk mengenal pasti kebolehan yang boleh ditunjukkan dan bantuan untuk maju. Anda boleh memilih sasaran dalam lebih daripada satu bidang.",
  "zh": "设定目标前先回看开始活动，承认自己原本会的内容以及刚学到的内容。用下面九项检查判断能展示什么、怎样改进。可以在多个领域选择目标。"
 },
 "afterIntro": {
  "en": "After the main work and any extension, revisit the SAME checks. Compare your earlier evidence and support with what you can demonstrate now. Then choose a learning phase for each specific check you want to reflect on. Your results do not choose a phase for you.",
  "ms": "Selepas tugasan utama dan sebarang cabaran, kembali kepada semakan yang SAMA. Bandingkan bukti dan bantuan dahulu dengan apa yang boleh ditunjukkan sekarang. Kemudian pilih fasa pembelajaran bagi setiap semakan khusus yang ingin direnungkan. Hasil anda tidak menentukan fasa secara automatik.",
  "zh": "完成主任务及所选拓展后，回到相同的检查。比较之前的证据和帮助程度与现在的表现，再分别为想反思的具体项目选择学习阶段。结果不会自动决定阶段。"
 },
 "purpose": {
  "en": "WAGBA: turn Sam’s real problem into a clear, testable message-helper plan. By the end, show one question, two useful outputs, ordered instructions, YES/NO tests and a reasoned improvement or review. These checks explain the knowledge, skills and understanding that contribute to that outcome.",
  "ms": "WAGBA: tukarkan masalah sebenar Sam kepada pelan pembantu mesej yang jelas dan boleh diuji. Pada akhir, tunjukkan satu soalan, dua output berguna, arahan tersusun, ujian YES/NO dan penambahbaikan atau semakan bersebab. Semakan ini menerangkan pengetahuan, kemahiran dan pemahaman yang menyumbang kepada hasil itu.",
  "zh": "WAGBA：把 Sam 的实际问题转成清晰、可测试的消息助手计划。最终展示一个问题、两条有用输出、顺序清楚的指令、YES/NO 测试，以及有理由的修改或复查。以下检查对应完成这一成果所需的知识、技能和理解。"
 },
 "distinction": {
  "en": "Knowing what INPUT means is knowledge. Writing a question and tracing the answer through IF/ELSE is a skill. Explaining why the chosen advice helps Sam, and why the rule cannot establish safety, shows understanding. Knowing a definition already can be a strength; your target may be using it or explaining a choice instead.",
  "ms": "Mengetahui maksud INPUT ialah pengetahuan. Menulis soalan dan menjejak jawapan melalui IF/ELSE ialah kemahiran. Menerangkan mengapa nasihat membantu Sam dan mengapa peraturan tidak dapat memastikan keselamatan menunjukkan pemahaman. Definisi yang sudah diketahui ialah kekuatan; sasaran anda mungkin menggunakannya atau menerangkan pilihan.",
  "zh": "知道 INPUT 的含义属于知识；写出问题并沿 IF/ELSE 执行答案属于技能；解释建议为什么帮助 Sam、规则为什么不能确定安全，则展示理解。已经掌握的定义可以是优势；你的目标可能是运用它，或更清楚地解释选择。"
 },
 "evidenceRule": {
  "en": "These are your evidence-based judgments, not automatic marks. A selected answer can be a clue, but it does not prove that you can explain it or work independently. Cite the answer, instruction or test and say what it demonstrates. A skill you have only read about can be “not yet attempted”. Reading-language support alone does not mean you needed help with the computing idea.",
  "ms": "Ini penilaian anda berdasarkan bukti, bukan markah automatik. Jawapan dipilih boleh menjadi petunjuk, tetapi tidak membuktikan anda boleh menerangkannya atau bekerja sendiri. Rujuk jawapan, arahan atau ujian dan nyatakan apa yang ditunjukkan. Kemahiran yang hanya dibaca boleh ditanda “belum dicuba”. Bantuan bahasa sahaja tidak bermaksud anda memerlukan bantuan konsep pengkomputeran.",
  "zh": "这是你依据证据作出的判断，不是自动评分。选择题答案可以提供线索，但不能证明你能解释它或独立完成。请指出答案、指令或测试，并说明它展示什么。只读过而没有实践的技能可以标为“尚未尝试”。仅使用语言支持，并不代表你在计算概念上需要帮助。"
 },
 "guide": {
  "en": "Review the lesson’s learning guide",
  "ms": "Lihat panduan pembelajaran pelajaran",
  "zh": "查看本课学习指南"
 },
 "statusLabel": {
  "en": "What can I demonstrate for this check?",
  "ms": "Apakah yang boleh saya tunjukkan bagi semakan ini?",
  "zh": "这一项我能展示到什么程度？"
 },
 "evidenceLabel": {
  "en": "My evidence: point to my work and explain what it shows",
  "ms": "Bukti saya: rujuk kerja dan terangkan apa yang ditunjukkan",
  "zh": "我的证据：指出作品内容，并解释它展示什么"
 },
 "priorLabel": {
  "en": "Was this already knowledge or an ability I had before today?",
  "ms": "Adakah ini pengetahuan atau kebolehan yang saya miliki sebelum hari ini?",
  "zh": "这是我今天之前就掌握的知识或能力吗？"
 },
 "targetLabel": {
  "en": "Make this one of my targets today",
  "ms": "Jadikan ini salah satu sasaran saya hari ini",
  "zh": "把这一项设为我今天的目标"
 },
 "targetOn": {
  "en": "Selected as a target today",
  "ms": "Dipilih sebagai sasaran hari ini",
  "zh": "已选为今天的目标"
 },
 "nextLabel": {
  "en": "My next step: what exactly will I do, and what support or challenge will help?",
  "ms": "Langkah seterusnya: apa sebenarnya akan saya lakukan, dan bantuan atau cabaran apa akan membantu?",
  "zh": "我的下一步：具体做什么，需要什么帮助或挑战？"
 },
 "useAction": {
  "en": "Use this suggested next step",
  "ms": "Gunakan cadangan langkah ini",
  "zh": "采用这项建议的下一步"
 },
 "suggested": {
  "en": "A possible next step",
  "ms": "Cadangan langkah seterusnya",
  "zh": "可行的下一步"
 },
 "phaseLabel": {
  "en": "How am I experiencing THIS part of the learning?",
  "ms": "Bagaimanakah pengalaman saya dalam bahagian pembelajaran INI?",
  "zh": "我在这一具体项目上的学习体验如何？"
 },
 "phaseReason": {
  "en": "Why this phase? Use a specific part of my work and describe the effort, progress or difficulty",
  "ms": "Mengapa fasa ini? Gunakan bahagian kerja yang khusus dan huraikan usaha, kemajuan atau kesukaran",
  "zh": "为什么选这个阶段？结合具体作品，描述努力、进步或困难"
 },
 "phaseRule": {
  "en": "Choose each phase yourself. Correct work may still take a lot of effort, or it may feel too easy. Different checks can be in different phases. If you have not tried something, leave its phase unchosen and plan a first attempt; it has not been marked wrong.",
  "ms": "Pilih setiap fasa sendiri. Kerja betul mungkin masih memerlukan usaha besar, atau mungkin terasa terlalu mudah. Semakan berbeza boleh berada dalam fasa berbeza. Jika belum mencuba sesuatu, biarkan fasanya belum dipilih dan rancang percubaan pertama; ia tidak ditanda salah.",
  "zh": "每项阶段由你自己选择。正确完成也可能很费力，或已经太容易。不同项目可以处于不同阶段。尚未尝试的项目可以暂不选阶段，先计划首次尝试；它没有被判错。"
 },
 "earlier": {
  "en": "Earlier · after the starter",
  "ms": "Dahulu · selepas aktiviti mula",
  "zh": "之前 · 开始活动后"
 },
 "now": {
  "en": "Now · after the main work and extension",
  "ms": "Sekarang · selepas tugasan utama dan cabaran",
  "zh": "现在 · 主任务与拓展后"
 },
 "noEarlier": {
  "en": "No earlier judgment recorded for this check. Record what you can show now; do not invent a starting score.",
  "ms": "Tiada penilaian awal direkodkan untuk semakan ini. Rekod apa yang boleh ditunjukkan sekarang; jangan cipta skor permulaan.",
  "zh": "这一项没有记录早期判断。请记录现在能展示什么，不要补造起始分数。"
 },
 "sourceTitle": {
  "en": "Look at relevant work before judging",
  "ms": "Lihat kerja berkaitan sebelum menilai",
  "zh": "判断前查看相关作品"
 },
 "snapshot": {
  "en": "Work available when this judgment was recorded",
  "ms": "Kerja tersedia semasa penilaian ini direkodkan",
  "zh": "记录这次判断时可见的作品"
 },
 "emptySource": {
  "en": "No relevant work recorded here yet. You may refer to paper or discussion in your evidence, try the check now, or record “not yet attempted”.",
  "ms": "Belum ada kerja berkaitan direkodkan di sini. Anda boleh merujuk kertas atau perbincangan dalam bukti, mencuba semakan sekarang, atau merekod “belum dicuba”.",
  "zh": "这里尚无相关作品记录。可以在证据中注明纸上作品或讨论，也可以现在尝试，或记录“尚未尝试”。"
 },
 "notRecorded": {
  "en": "No judgment recorded",
  "ms": "Tiada penilaian direkodkan",
  "zh": "尚未记录判断"
 },
 "sourceNote": {
  "en": "These are your recorded responses, not certified answers or a measure of independence. Explain why they meet the check. Saved evidence keeps the work as it was when you recorded the judgment.",
  "ms": "Ini respons anda yang direkodkan, bukan jawapan yang disahkan atau ukuran kebolehan bekerja sendiri. Terangkan mengapa ia memenuhi semakan. Bukti tersimpan mengekalkan kerja seperti semasa penilaian direkodkan.",
  "zh": "这些是你记录的回答，不是经认证的正确答案，也不衡量独立程度。请解释它们为何符合检查要求。保存的证据保留记录判断时的作品内容。"
 },
 "priorStrength": {
  "en": "Acknowledge this as an existing strength if your evidence supports it. You do not need to choose it as a target simply because it appears here.",
  "ms": "Akui ini sebagai kekuatan sedia ada jika bukti menyokongnya. Anda tidak perlu memilihnya sebagai sasaran hanya kerana ia disenaraikan di sini.",
  "zh": "如果证据支持，请承认这是已有优势。不必仅仅因为它出现在这里就把它设为目标。"
 },
 "changePrompt": {
  "en": "Compare the same check: “Earlier I needed ___ to ___. Now my ___ shows ___. Next I will ___.” Explain any change in support as well as accuracy; progress does not have to mean a higher count.",
  "ms": "Bandingkan semakan sama: “Dahulu saya memerlukan ___ untuk ___. Sekarang ___ saya menunjukkan ___. Seterusnya saya akan ___.” Terangkan perubahan bantuan serta ketepatan; kemajuan tidak semestinya bilangan lebih tinggi.",
  "zh": "比较同一项：“之前我需要___才能___。现在我的___展示了___。接下来我会___。”除了正确程度，也要说明帮助程度的变化；进步不一定意味着数量增加。"
 },
 "comparisonLabel": {
  "en": "What has changed in this area, and what evidence shows it?",
  "ms": "Apakah yang berubah dalam bidang ini, dan bukti apa menunjukkannya?",
  "zh": "这个领域发生了什么变化？有哪些证据？"
 },
 "targetsTitle": {
  "en": "My chosen targets and next steps",
  "ms": "Sasaran dan langkah seterusnya yang dipilih",
  "zh": "我选择的目标与下一步"
 },
 "noTargets": {
  "en": "No targets selected yet. You can choose more than one specific check across knowledge, skills and understanding. Use the evidence to decide; secure prior learning does not have to become a target.",
  "ms": "Belum ada sasaran dipilih. Anda boleh memilih lebih daripada satu semakan khusus merentas pengetahuan, kemahiran dan pemahaman. Gunakan bukti untuk memutuskan; pembelajaran terdahulu yang kukuh tidak perlu menjadi sasaran.",
  "zh": "尚未选择目标。可以跨知识、技能、理解选择多个具体项目。请根据证据决定；已扎实掌握的内容不必成为目标。"
 },
 "noAction": {
  "en": "Next step not recorded yet",
  "ms": "Langkah seterusnya belum direkodkan",
  "zh": "尚未记录下一步"
 },
 "helpNotice": {
  "en": "This saves your reflection; it does not send a live alert. Show your teacher the exact check and your question if you need help.",
  "ms": "Ini menyimpan refleksi, bukan menghantar amaran langsung. Jika perlukan bantuan, tunjukkan semakan tepat dan soalan anda kepada guru.",
  "zh": "这里会保存反思，但不会实时通知老师。需要帮助时，请把具体检查项和问题展示给老师。"
 },
 "statuses": {
  "independent": {
   "en": "Demonstrated independently",
   "ms": "Ditunjukkan secara sendiri",
   "zh": "已独立展示"
  },
  "supported": {
   "en": "Demonstrated with an example or reminder",
   "ms": "Ditunjukkan dengan contoh atau peringatan",
   "zh": "借助示例或提醒已展示"
  },
  "help": {
   "en": "Attempted; still need help to demonstrate it",
   "ms": "Sudah dicuba; masih perlu bantuan untuk menunjukkannya",
   "zh": "已尝试，仍需帮助才能展示"
  },
  "notyet": {
   "en": "Not yet attempted",
   "ms": "Belum dicuba",
   "zh": "尚未尝试"
  }
 },
 "prior": {
  "already": {
   "en": "I could already demonstrate this before today",
   "ms": "Saya sudah boleh menunjukkannya sebelum hari ini",
   "zh": "今天之前我就能展示"
  },
  "today": {
   "en": "I learned or clarified this today",
   "ms": "Saya mempelajari atau menjelaskannya hari ini",
   "zh": "今天学会或弄清楚的"
  },
  "unsure": {
   "en": "I am not sure yet",
   "ms": "Saya belum pasti",
   "zh": "暂不确定"
  }
 },
 "phases": {
  "new": {
   "en": "New learning · a good struggle; I am making progress",
   "ms": "Pembelajaran baharu · usaha mencabar; saya semakin maju",
   "zh": "新学习 · 有挑战，但我在进步"
  },
  "consolidating": {
   "en": "Consolidating · using what I know more accurately or independently",
   "ms": "Mengukuhkan · menggunakan pengetahuan dengan lebih tepat atau sendiri",
   "zh": "巩固 · 更准确或更独立地运用已有知识"
  },
  "treading": {
   "en": "Treading water · this is too easy; I need a useful challenge",
   "ms": "Tidak tercabar · terlalu mudah; saya perlu cabaran berguna",
   "zh": "原地踏步 · 太容易，需要有用的挑战"
  },
  "help": {
   "en": "Drowning / need help · I cannot yet move forward with this part",
   "ms": "Terlalu sukar / perlu bantuan · saya belum dapat maju dalam bahagian ini",
   "zh": "感到困难／需要帮助 · 这一项暂时无法推进"
  }
 },
 "phaseLeads": {
  "new": {
   "en": "Build on the progress you are making. Use only the support you need for the next attempt.",
   "ms": "Bina atas kemajuan anda. Gunakan hanya bantuan yang diperlukan bagi percubaan seterusnya.",
   "zh": "在已有进步上继续尝试，只使用下一次尝试所需的帮助。"
  },
  "consolidating": {
   "en": "Practise on a fresh example and reduce the reminders you use.",
   "ms": "Berlatih dengan contoh baharu dan kurangkan peringatan yang digunakan.",
   "zh": "用新示例练习，并减少提醒。"
  },
  "treading": {
   "en": "Choose a task that asks you to transfer or defend your reasoning.",
   "ms": "Pilih tugasan yang meminta anda memindahkan atau mempertahankan alasan.",
   "zh": "选择需要迁移知识或论证理由的任务。"
  },
  "help": {
   "en": "Show your teacher the exact point where you get stuck and ask to work through it together.",
   "ms": "Tunjukkan kepada guru titik tepat anda tersekat dan minta bimbingan bersama.",
   "zh": "向老师指出具体卡在哪里，请求一起完成这一步。"
  }
 },
 "areas": [
  {
   "id": "k",
   "label": {
    "en": "Knowledge",
    "ms": "Pengetahuan",
    "zh": "知识"
   },
   "intro": {
    "en": "Facts and meanings I can explain: warning signs, input/output and the IF/ELSE decision. Use starter questions 1–3 and 6–7. A correct choice is useful evidence only if you can explain the idea.",
    "ms": "Fakta dan maksud yang boleh diterangkan: tanda amaran, input/output dan keputusan IF/ELSE. Gunakan soalan mula 1–3 dan 6–7. Pilihan betul berguna jika anda boleh menerangkan idea.",
    "zh": "我能解释的事实与含义：警示、输入／输出和 IF/ELSE 判断。参考开始活动第1–3、6–7题。选对答案还需要能解释概念。"
   }
  },
  {
   "id": "s",
   "label": {
    "en": "Skills",
    "ms": "Kemahiran",
    "zh": "技能"
   },
   "intro": {
    "en": "Things I can actually do: write the plan, follow both routes and test it. Starter questions 5–8 introduce these actions; selecting a good method is not yet evidence that you carried it out. Use your written plan or try a small example; otherwise record not yet attempted.",
    "ms": "Perkara yang boleh dilakukan: menulis pelan, mengikut kedua-dua laluan dan mengujinya. Soalan mula 5–8 memperkenalkan tindakan ini; memilih kaedah baik belum membuktikan anda melakukannya. Gunakan pelan bertulis atau cuba contoh kecil; jika belum, rekod belum dicuba.",
    "zh": "我实际能做的事：写计划、沿两条路径执行并测试。开始活动第5–8题介绍这些行动；选出好方法还不能证明已经实践。请用书面计划或尝试小示例；否则记录尚未尝试。"
   }
  },
  {
   "id": "u",
   "label": {
    "en": "Understanding",
    "ms": "Pemahaman",
    "zh": "理解"
   },
   "intro": {
    "en": "Reasons I can explain and apply: why the helper is useful, where its limits are and why a revision improves it. Use starter questions 9–12 and your own design. “It is better” is not enough: explain the cause and the benefit.",
    "ms": "Sebab yang boleh diterangkan dan digunakan: mengapa pembantu berguna, hadnya dan mengapa pindaan menambah baik. Gunakan soalan mula 9–12 dan reka bentuk sendiri. “Lebih baik” tidak cukup: terangkan sebab dan manfaat.",
    "zh": "我能解释并运用的理由：助手为什么有用、局限在哪里、修改为什么有效。参考开始活动第9–12题及自己的设计。“更好”不够，要解释原因和作用。"
   }
  }
 ],
 "checks": [
  {
   "id": "k1",
   "area": "k",
   "title": {
    "en": "K1 · Warning signs",
    "ms": "K1 · Tanda amaran",
    "zh": "K1 · 警示"
   },
   "criterion": {
    "en": "Identify two features of a suspicious message and explain what each asks or encourages the reader to do. Distinguish a warning sign from proof of a scam.",
    "ms": "Kenal pasti dua ciri mesej mencurigakan dan terangkan apa yang diminta atau digalakkan. Bezakan tanda amaran daripada bukti penipuan.",
    "zh": "识别可疑消息的两个特征，并解释各自在要求或诱导读者做什么。区分警示与诈骗的证明。"
   },
   "probe": {
    "en": "Name or quote the two clues and explain them. For example, which wording creates pressure, and which request might expose account details?",
    "ms": "Namakan atau petik dua petunjuk dan terangkan. Contohnya, perkataan mana mencipta desakan dan permintaan mana boleh mendedahkan maklumat akaun?",
    "zh": "说出或引用两条线索并解释。例如，哪些措辞造成催促，哪个请求可能泄露账户资料？"
   },
   "before": [
    "clue",
    "starterEvidence",
    "starterPhishing"
   ],
   "after": [
    "risk",
    "need",
    "clue",
    "starterEvidence",
    "ext3_work"
   ],
   "help": {
    "en": "Revisit the annotated message. Ask someone to explain one clue, then explain a different clue yourself.",
    "ms": "Lihat mesej beranotasi. Minta penerangan satu petunjuk, kemudian terangkan petunjuk lain sendiri.",
    "zh": "重看带解释的消息。请别人说明一条线索，再自己解释另一条。"
   },
   "practice": {
    "en": "Identify and explain two clues in a different fictional message without the annotations.",
    "ms": "Kenal pasti dan terangkan dua petunjuk dalam mesej rekaan lain tanpa anotasi.",
    "zh": "不看注释，在另一条虚构消息中找出并解释两条线索。"
   },
   "challenge": {
    "en": "Create a plausible message with a warning sign and explain why you still need an independent check.",
    "ms": "Cipta mesej munasabah dengan tanda amaran dan terangkan mengapa semakan bebas masih perlu.",
    "zh": "创作含有警示但看似合理的消息，解释为什么仍需独立核实。"
   }
  },
  {
   "id": "k2",
   "area": "k",
   "title": {
    "en": "K2 · Input, stored answer and output",
    "ms": "K2 · Input, jawapan tersimpan dan output",
    "zh": "K2 · 输入、保存的答案与输出"
   },
   "criterion": {
    "en": "Explain what INPUT and OUTPUT mean here. Identify the YES/NO answer stored in urgent or warning, and distinguish it from the whole message and the advice.",
    "ms": "Terangkan maksud INPUT dan OUTPUT di sini. Kenal pasti jawapan YES/NO disimpan dalam urgent atau warning, dan bezakan daripada mesej penuh dan nasihat.",
    "zh": "解释这里 INPUT 和 OUTPUT 的含义。指出 urgent 或 warning 保存的 YES/NO 答案，区分答案、整条消息和建议。"
   },
   "probe": {
    "en": "Point to an input value, its storage name and an output in your work. Explain who reads the original message.",
    "ms": "Tunjukkan nilai input, nama simpanannya dan output dalam kerja anda. Terangkan siapa membaca mesej asal.",
    "zh": "指出作品中的输入值、保存它的名称及一条输出。解释谁阅读原消息。"
   },
   "before": [
    "starterInput",
    "starterOutput"
   ],
   "after": [
    "draftQuestion",
    "description",
    "draftYes",
    "draftNo",
    "ext1_work"
   ],
   "help": {
    "en": "Label the person’s answer, its variable and the advice in the worked example; explain each job aloud.",
    "ms": "Label jawapan pengguna, pemboleh ubah dan nasihat dalam contoh; terangkan setiap tugas secara lisan.",
    "zh": "在示例中标出人的答案、变量和建议，口头解释各自作用。"
   },
   "practice": {
    "en": "Without the model, label the input and outputs in your own helper and explain what warning stores.",
    "ms": "Tanpa model, label input dan output pembantu sendiri dan terangkan kandungan warning.",
    "zh": "不看示例，标出自己助手的输入和输出，并解释 warning 保存什么。"
   },
   "challenge": {
    "en": "Explain how the input would change if your helper accepted UNSURE as well as YES/NO.",
    "ms": "Terangkan perubahan input jika pembantu menerima TIDAK PASTI selain YES/NO.",
    "zh": "解释如果助手还接受 UNSURE，输入会发生什么变化。"
   }
  },
  {
   "id": "k3",
   "area": "k",
   "title": {
    "en": "K3 · The decision and its branches",
    "ms": "K3 · Keputusan dan cabang",
    "zh": "K3 · 判断与分支"
   },
   "criterion": {
    "en": "Explain the condition warning = YES (or urgent = YES), what IF and ELSE do, and why one answer selects only one output.",
    "ms": "Terangkan syarat warning = YES (atau urgent = YES), fungsi IF dan ELSE, serta mengapa satu jawapan memilih satu output sahaja.",
    "zh": "解释条件 warning = YES（或 urgent = YES）、IF 和 ELSE 的作用，以及为什么一个答案只选择一个输出。"
   },
   "probe": {
    "en": "Explain the true and false results of the condition in your own words; name the route used in each case.",
    "ms": "Terangkan hasil benar dan palsu syarat dengan kata sendiri; namakan laluan bagi setiap kes.",
    "zh": "用自己的话解释条件为真、为假时的结果，分别指出对应路径。"
   },
   "before": [
    "starterOutput",
    "starterInput"
   ],
   "after": [
    "readPrediction",
    "description",
    "ext1_work",
    "ext2_work"
   ],
   "help": {
    "en": "Use the model to compare YES with the condition, then NO. Ask for help with the first keyword you cannot explain.",
    "ms": "Gunakan model untuk membandingkan YES dengan syarat, kemudian NO. Minta bantuan bagi kata kunci pertama yang tidak difahami.",
    "zh": "用示例比较 YES 与条件，再比较 NO。对第一个无法解释的关键词求助。"
   },
   "practice": {
    "en": "Explain why the unused OUTPUT is skipped, first with the model and then with your own rule.",
    "ms": "Terangkan mengapa OUTPUT tidak digunakan dilangkau, mula dengan model kemudian peraturan sendiri.",
    "zh": "先用示例、再用自己的规则解释为什么跳过另一条 OUTPUT。"
   },
   "challenge": {
    "en": "Explain what would change if the IF condition checked NO instead of YES; predict both routes.",
    "ms": "Terangkan perubahan jika syarat IF menyemak NO, bukan YES; ramalkan kedua-dua laluan.",
    "zh": "解释如果 IF 改为检查 NO 会怎样，并预测两条路径。"
   }
  },
  {
   "id": "s1",
   "area": "s",
   "title": {
    "en": "S1 · Write the question and advice",
    "ms": "S1 · Tulis soalan dan nasihat",
    "zh": "S1 · 写问题与建议"
   },
   "criterion": {
    "en": "Write one clear YES/NO question about an observable warning sign and two different, useful advice outputs. Do not ask for a password.",
    "ms": "Tulis satu soalan YES/NO jelas tentang tanda amaran yang boleh diperhatikan dan dua output nasihat berbeza yang berguna. Jangan minta kata laluan.",
    "zh": "针对可观察警示写一个清晰的 YES/NO 问题，以及两条不同且有用的建议输出。不索取密码。"
   },
   "probe": {
    "en": "Show your actual question and both outputs, or refer to your paper draft. Choosing the best question in starter Q5 does not show you have written all three parts yet.",
    "ms": "Tunjukkan soalan sebenar dan kedua-dua output, atau rujuk draf kertas. Memilih soalan terbaik dalam Q5 belum menunjukkan anda menulis ketiga-tiga bahagian.",
    "zh": "展示实际写的问题和两条输出，或注明纸上草稿。开始活动第5题选出好问题，不代表已写出全部三部分。"
   },
   "before": [
    "starterQuestion",
    "starterImprove",
    "starterPurpose"
   ],
   "after": [
    "draftQuestion",
    "draftYes",
    "draftNo",
    "ext2_work"
   ],
   "help": {
    "en": "Use the pressure-check pattern to draft a question about your chosen sign. Ask a partner whether it can be answered YES/NO, then draft each output.",
    "ms": "Gunakan corak semakan desakan untuk merangka soalan tanda dipilih. Tanya rakan sama ada boleh dijawab YES/NO, kemudian draf setiap output.",
    "zh": "照催促检查的结构，为所选警示拟问题。请同伴判断是否能用 YES/NO 回答，再写两条输出。"
   },
   "practice": {
    "en": "Ask a partner to answer your question without explanation. Revise any ambiguity and make each output name a specific next step.",
    "ms": "Minta rakan menjawab tanpa penerangan. Baiki kekaburan dan pastikan setiap output menyatakan langkah khusus.",
    "zh": "请同伴不经你解释直接回答问题。修改歧义，让每条输出指出具体下一步。"
   },
   "challenge": {
    "en": "Add an UNSURE response with advice suited to uncertainty, then explain why forcing YES/NO could mislead.",
    "ms": "Tambah respons TIDAK PASTI dengan nasihat sesuai dan terangkan mengapa memaksa YES/NO boleh mengelirukan.",
    "zh": "增加 UNSURE 回应及合适建议，解释强迫选择 YES/NO 为什么可能误导。"
   }
  },
  {
   "id": "s2",
   "area": "s",
   "title": {
    "en": "S2 · Arrange and trace both routes",
    "ms": "S2 · Susun dan jejak kedua-dua laluan",
    "zh": "S2 · 排列并执行两条路径"
   },
   "criterion": {
    "en": "Put INPUT, IF, the YES output, ELSE, the NO output and ENDIF into a usable order. Follow both YES and NO, showing which output is used and skipped.",
    "ms": "Susun INPUT, IF, output YES, ELSE, output NO dan ENDIF supaya boleh digunakan. Ikut YES dan NO, tunjukkan output digunakan dan dilangkau.",
    "zh": "按可执行的顺序排列 INPUT、IF、YES 输出、ELSE、NO 输出和 ENDIF。分别沿 YES、NO 执行，指出使用和跳过的输出。"
   },
   "probe": {
    "en": "Cite your instruction order and a trace of each answer. Starter Q7 only checks a YES prediction; it does not demonstrate arranging and tracing both routes.",
    "ms": "Rujuk urutan arahan dan jejak setiap jawapan. Q7 hanya menyemak ramalan YES; ia tidak menunjukkan penyusunan dan penjejakan kedua-dua laluan.",
    "zh": "引用指令顺序及两种答案的执行过程。开始活动第7题只检查 YES 预测，不能展示已排列并执行两条路径。"
   },
   "before": [
    "starterOutput"
   ],
   "after": [
    "order",
    "description",
    "@tests",
    "ext2_work"
   ],
   "help": {
    "en": "Point to the first instruction with a partner. Receive the answer before checking it; walk the YES route, then the NO route.",
    "ms": "Tunjuk arahan pertama bersama rakan. Terima jawapan sebelum menyemak; jejak YES kemudian NO.",
    "zh": "与同伴指出第一条指令。先接收答案再判断，先执行 YES，再执行 NO。"
   },
   "practice": {
    "en": "Trace both branches of your own plan without hints. Ask a partner to check whether you skipped the unused output.",
    "ms": "Jejak kedua-dua cabang pelan sendiri tanpa petunjuk. Minta rakan menyemak output tidak digunakan dilangkau.",
    "zh": "无提示执行自己计划的两条分支，请同伴检查是否跳过未用输出。"
   },
   "challenge": {
    "en": "Use the UNSURE extension to design and trace a third route; explain how it joins the rest of the plan.",
    "ms": "Gunakan cabaran TIDAK PASTI untuk mereka dan menjejak laluan ketiga; terangkan kaitannya dengan pelan.",
    "zh": "用 UNSURE 拓展设计并执行第三条路径，解释它怎样接入原计划。"
   }
  },
  {
   "id": "s3",
   "area": "s",
   "title": {
    "en": "S3 · Test, compare and improve",
    "ms": "S3 · Uji, banding dan baiki",
    "zh": "S3 · 测试、比较与改进"
   },
   "criterion": {
    "en": "Record a prediction and actual result for YES and NO. Compare them, identify a change or a check to make, and retest if you revise the plan.",
    "ms": "Rekod ramalan dan hasil sebenar bagi YES dan NO. Bandingkan, kenal pasti perubahan atau semakan, dan uji semula jika pelan diubah.",
    "zh": "记录 YES、NO 的预测和实际结果，进行比较，确定需要修改或检查之处；修改计划后重新测试。"
   },
   "probe": {
    "en": "Cite both test records and the improvement or review they led to. Selecting a test method in starter Q8 is preparation, not a completed test.",
    "ms": "Rujuk kedua-dua rekod ujian dan penambahbaikan atau semakan daripadanya. Memilih kaedah ujian dalam Q8 ialah persediaan, bukan ujian selesai.",
    "zh": "引用两次测试记录及据此作出的修改或复查。开始活动第8题选测试方法只是准备，不是已完成测试。"
   },
   "before": [
    "starterTest"
   ],
   "after": [
    "@tests",
    "improvement",
    "criterionInput",
    "criterionOutput",
    "ext2_work",
    "ext3_work"
   ],
   "help": {
    "en": "Work through one prediction → actual result → comparison with a partner. Then try the other input and record both tests.",
    "ms": "Lakukan satu ramalan → hasil sebenar → perbandingan bersama rakan. Kemudian cuba input lain dan rekod kedua-dua ujian.",
    "zh": "与同伴完成一次预测→实际结果→比较，再尝试另一个输入并记录两次测试。"
   },
   "practice": {
    "en": "Retest the current plan for both answers without reminders. Use any difference or unclear advice to choose a precise revision.",
    "ms": "Uji semula pelan semasa bagi kedua-dua jawapan tanpa peringatan. Gunakan perbezaan atau nasihat kabur untuk memilih pindaan tepat.",
    "zh": "无提醒测试当前计划的两种答案，根据差异或含糊建议决定具体修改。"
   },
   "challenge": {
    "en": "Challenge the rule with a new message or UNSURE input; state the expected advice before testing your extended plan.",
    "ms": "Cabar peraturan dengan mesej baharu atau input TIDAK PASTI; nyatakan nasihat dijangka sebelum menguji pelan lanjutan.",
    "zh": "用新消息或 UNSURE 输入挑战规则；测试扩展计划前先说明预期建议。"
   }
  },
  {
   "id": "u1",
   "area": "u",
   "title": {
    "en": "U1 · Explain the user need",
    "ms": "U1 · Terangkan keperluan pengguna",
    "zh": "U1 · 解释用户需要"
   },
   "criterion": {
    "en": "Explain why your chosen warning sign matters to Sam and why the question and advice help him decide what to check before acting.",
    "ms": "Terangkan mengapa tanda dipilih penting kepada Sam dan mengapa soalan serta nasihat membantu menentukan semakan sebelum bertindak.",
    "zh": "解释所选警示为什么对 Sam 重要，以及问题和建议怎样帮助他决定行动前核实什么。"
   },
   "probe": {
    "en": "Link a specific clue to a concern and a useful action. “It helps him” alone does not explain how.",
    "ms": "Hubungkan petunjuk khusus dengan kebimbangan dan tindakan berguna. “Membantu dia” sahaja tidak menerangkan caranya.",
    "zh": "把具体线索、可能的问题和有用行动联系起来。只说“能帮助他”没有解释如何帮助。"
   },
   "before": [
    "starterPurpose",
    "starterEvidence"
   ],
   "after": [
    "need",
    "risk",
    "draftQuestion",
    "draftYes",
    "draftNo",
    "ext3_work"
   ],
   "help": {
    "en": "Complete aloud: “Sam may ___ because ___. My question helps him notice ___. The advice helps him ___.”",
    "ms": "Lengkapkan secara lisan: “Sam mungkin ___ kerana ___. Soalan saya membantu menyedari ___. Nasihat membantu ___.”",
    "zh": "口头补全：“Sam 可能因___而___。我的问题帮助他注意___。建议帮助他___。”"
   },
   "practice": {
    "en": "Ask a partner why your chosen advice suits this sign. Explain the link without using “because it is safer” as your whole reason.",
    "ms": "Minta rakan bertanya mengapa nasihat sesuai dengan tanda. Terangkan kaitan, bukan hanya “kerana lebih selamat”.",
    "zh": "请同伴问建议为什么适合这项警示，解释关联，不要仅回答“因为更安全”。"
   },
   "challenge": {
    "en": "Compare two possible questions for the same user need. Defend which would lead to more useful advice and why.",
    "ms": "Bandingkan dua soalan bagi keperluan sama. Pertahankan yang memberi nasihat lebih berguna dan sebabnya.",
    "zh": "比较针对同一用户需要的两个问题，说明哪个会带来更有用建议，并论证理由。"
   }
  },
  {
   "id": "u2",
   "area": "u",
   "title": {
    "en": "U2 · Explain what the rule cannot establish",
    "ms": "U2 · Terangkan perkara yang tidak dapat dipastikan peraturan",
    "zh": "U2 · 解释规则无法确定什么"
   },
   "criterion": {
    "en": "Explain why NO does not mean safe and why matching test outputs do not verify the sender. Use an example or counterexample, not just “it cannot prove safety”.",
    "ms": "Terangkan mengapa NO bukan bermaksud selamat dan output ujian sepadan tidak mengesahkan penghantar. Gunakan contoh, bukan hanya “tidak membuktikan keselamatan”.",
    "zh": "解释 NO 为什么不代表安全、测试输出匹配为什么不能核实发送者。使用例子或反例，不只说“不能证明安全”。"
   },
   "probe": {
    "en": "Name information the helper never receives or checks, and show how the same answer could occur for genuine and fake messages.",
    "ms": "Nyatakan maklumat yang tidak diterima atau disemak pembantu dan tunjukkan jawapan sama boleh berlaku bagi mesej sah serta palsu.",
    "zh": "指出助手没有接收或核实的信息，说明同一答案怎样可能来自真实和虚假消息。"
   },
   "before": [
    "starterUrgent",
    "starterLimit",
    "starterImprove"
   ],
   "after": [
    "exampleLimit",
    "draftNo",
    "@tests",
    "ext3_work"
   ],
   "help": {
    "en": "Compare the urgent school message with an urgent fake offer. Both give YES; ask what extra information would distinguish them.",
    "ms": "Bandingkan mesej sekolah mendesak dengan tawaran palsu mendesak. Kedua-dua YES; tanya maklumat tambahan yang membezakannya.",
    "zh": "比较急迫学校消息与急迫虚假奖励：两者都是 YES。询问还需要什么信息才能区分。"
   },
   "practice": {
    "en": "Explain the limit using your own chosen sign, then check that your NO advice does not claim more than your input tells you.",
    "ms": "Terangkan had menggunakan tanda sendiri, kemudian semak nasihat NO tidak mendakwa lebih daripada input.",
    "zh": "用自己选择的警示解释局限，再检查 NO 建议是否超出输入提供的信息。"
   },
   "challenge": {
    "en": "Complete “Challenge the rule”: construct two messages with the same answer but different contexts and propose an extra check.",
    "ms": "Lengkapkan “Cabar peraturan”: cipta dua mesej dengan jawapan sama tetapi konteks berbeza dan cadangkan semakan tambahan.",
    "zh": "完成“质疑规则”：构造答案相同、情境不同的两条消息，提出额外检查。"
   }
  },
  {
   "id": "u3",
   "area": "u",
   "title": {
    "en": "U3 · Justify a change",
    "ms": "U3 · Beri sebab perubahan",
    "zh": "U3 · 说明修改理由"
   },
   "criterion": {
    "en": "Explain why a change or review makes the plan clearer or the advice more useful. Link it to evidence from wording, a partner’s trace or a test.",
    "ms": "Terangkan mengapa perubahan atau semakan menjelaskan pelan atau menjadikan nasihat lebih berguna. Kaitkan dengan bukti perkataan, jejak rakan atau ujian.",
    "zh": "解释修改或复查为什么让计划更清楚或建议更有用，并联系措辞、同伴执行或测试中的证据。"
   },
   "probe": {
    "en": "Show what was unclear or misleading, what you changed or checked, and why that helps. A corrected sentence without a reason is not the whole check.",
    "ms": "Tunjukkan perkara kabur atau mengelirukan, apa yang diubah atau disemak dan sebab ia membantu. Ayat dibetulkan tanpa sebab belum memenuhi seluruh semakan.",
    "zh": "说明哪里不清楚或有误导、修改或检查了什么，以及为什么有帮助。只改正句子而没有理由，还不满足完整检查。"
   },
   "before": [
    "starterImprove"
   ],
   "after": [
    "improvement",
    "draftYes",
    "draftNo",
    "@tests",
    "ext2_work",
    "ext3_work"
   ],
   "help": {
    "en": "Use the unsafe NO output from the starter. Explain what it wrongly assumes, then explain how your revised advice fixes that problem.",
    "ms": "Gunakan output NO tidak selamat daripada aktiviti mula. Terangkan andaian salah dan bagaimana nasihat baharu membaikinya.",
    "zh": "用开始活动中不安全的 NO 输出，解释其错误假设，再说明改写怎样解决问题。"
   },
   "practice": {
    "en": "Ask a partner to challenge one sentence in your plan. Use their question or a test result to justify a specific revision or review.",
    "ms": "Minta rakan mencabar satu ayat pelan. Gunakan soalan mereka atau hasil ujian untuk menyokong pindaan atau semakan khusus.",
    "zh": "请同伴质疑计划中的一句话，用其问题或测试结果说明具体修改或复查的理由。"
   },
   "challenge": {
    "en": "Compare two revisions. Explain which addresses the evidence better and what would still need testing.",
    "ms": "Bandingkan dua pindaan. Terangkan yang lebih sesuai dengan bukti dan perkara masih perlu diuji.",
    "zh": "比较两种修改方案，解释哪个更符合证据，以及仍需测试什么。"
   }
  }
 ]
};
const CARDS=[
{id:'case',group:0,title:B('Sam needs a second opinion','Sam perlukan pandangan kedua','Sam 需要第二个意见'),read:[B('Sam is 13. A gaming-reward message arrives, but Sam does not remember entering a competition. Sam wants help deciding what to check before acting. All messages here are fictional; do not open or copy any link.','Sam berumur 13 tahun. Mesej ganjaran permainan tiba, tetapi Sam tidak ingat menyertai pertandingan. Sam mahu bantuan menentukan apa yang perlu disemak sebelum bertindak. Semua mesej di sini rekaan; jangan buka atau salin pautan.','Sam 13 岁，收到游戏奖励消息，但不记得参加过比赛。Sam 想知道行动前应该检查什么。这里的消息均为虚构，请勿打开或复制链接。')],type:'case',words:['abstraction'],questions:[Q('clue',B('Which part of this message puts pressure on Sam to act quickly?','Bahagian manakah mendesak Sam bertindak segera?','消息中的哪一部分催促 Sam 赶快行动？'),[O('coins','The number of game coins','Bilangan syiling permainan','游戏币数量'),O('now','“ACT NOW” and “expires today”','“BERTINDAK SEKARANG” dan “tamat hari ini”','“立即行动”和“今天到期”'),O('name','The sender name, PrizePulse Alerts','Nama penghantar, PrizePulse Alerts','发件人名称 PrizePulse Alerts')],{answer:'now',feedback:B('“ACT NOW” and the deadline create pressure. The reward may be another warning sign, but it is not the same observation. A warning sign is a reason to check, not a verdict.','“BERTINDAK SEKARANG” dan tarikh akhir memberi tekanan. Ganjaran mungkin tanda lain, tetapi bukan pemerhatian yang sama. Tanda amaran ialah sebab untuk menyemak, bukan keputusan pasti.','“立即行动”和截止时间制造压力。奖励可能是另一种警示，但不是同一观察。警示意味着需要核实，不是确定结论。')})]},
{id:'types',group:1,title:B("What should I know, practise and understand?","Apakah yang perlu saya tahu, latih dan fahami?","我应该知道什么、练习什么、理解什么？"),read:[B("Read this guide to see what good work will include. Return to it during the design and testing tasks. You can label and discuss your plan on paper or use the lesson cards; you do not need to write it twice.","Baca panduan ini untuk melihat ciri hasil kerja yang baik. Rujuk semula semasa mereka bentuk dan menguji. Anda boleh melabel dan membincangkan pelan di atas kertas atau menggunakan kad pelajaran; tidak perlu menulis dua kali.","阅读这份指南，了解作品应包含什么。设计和测试时可随时回来查看。可以在纸上标注并讨论计划，也可以使用课程卡片，无需重复写两遍。")],type:'types',questions:[Q('learningFocus',B("Which area will you deliberately practise as you work through the lesson?","Bidang manakah yang akan anda latih dengan sengaja sepanjang pelajaran?","接下来的学习中，你会有意识地加强哪方面练习？"),[O('knowledge','Knowledge: identify and explain my input, decision and outputs','Pengetahuan: kenal pasti dan terangkan input, keputusan dan output saya','知识：识别并解释我的输入、判断和输出'),O('skill','Skills: make both routes clear, test them and use the results to improve','Kemahiran: jelaskan kedua-dua laluan, uji dan gunakan hasil untuk membaiki','技能：写清两条路径、测试并根据结果改进'),O('understanding','Understanding: explain the limits of my check and justify my advice','Pemahaman: terangkan had semakan dan berikan sebab bagi nasihat saya','理解：解释检查的局限，并说明建议的理由')])]},
{id:'example',group:2,title:B('Watch how Sam’s message helper works','Lihat cara pembantu mesej Sam berfungsi','看看 Sam 的消息助手怎样工作'),read:[EXAMPLE.intro],type:'example',questions:[
 Q('exampleInput',B('1. For the coding-club message: does it pressure you to act immediately?','1. Bagi mesej kelab pengekodan: adakah ia mendesak anda bertindak segera?','1. 编程社团的消息是否在催促你立即行动？'),YESNO),
 Q('exampleExpected',B('2. Before running: what advice do you think your answer will produce?','2. Sebelum menjalankan: apakah nasihat yang anda jangka daripada jawapan anda?','2. 运行前：你认为自己的答案会让助手给出什么建议？'),null,{hint:B('Look at the rule. Which OUTPUT follows your chosen answer? A short phrase is enough; do not copy every word.','Lihat peraturan. OUTPUT manakah mengikut jawapan pilihan anda? Frasa ringkas memadai; tidak perlu salin setiap perkataan.','看看规则，哪个 OUTPUT 对应你选的答案？写一个短语即可，无需逐字抄写。')}),
 Q('exampleCompare',B('3. Compare the displayed advice with your prediction. What did you notice?','3. Bandingkan nasihat dipaparkan dengan ramalan. Apakah yang anda perhatikan?','3. 将显示的建议与你的预测比较，你发现了什么？'),[O('match','It matches what I expected','Sepadan dengan jangkaan saya','符合我的预测'),O('different','It is different; I need to revisit the rule','Berbeza; saya perlu semak peraturan semula','与预测不同，我需要重看规则'),O('unsure','I am not sure yet; I want to talk it through','Saya belum pasti; saya mahu berbincang','还不确定，我想讨论一下')]),
 Q('exampleLimit',B('4. Why can’t this one-question helper tell Sam that a message is definitely safe?','4. Mengapakah pembantu satu soalan ini tidak boleh memberitahu Sam bahawa mesej pasti selamat?','4. 为什么这个只问一个问题的助手不能告诉 Sam 消息肯定安全？'),null,{hint:B('Think about something this helper never checks. You can explain it in your own words or discuss it with a partner.','Fikirkan sesuatu yang tidak pernah disemak pembantu. Terangkan dengan kata-kata sendiri atau bincang dengan rakan.','想一想助手从来没有检查过什么。可以用自己的话解释，或与同伴讨论。')}),
 Q('reader',B('What information does this helper actually receive?','Apakah maklumat yang sebenarnya diterima pembantu?','这个助手实际接收什么信息？'),[O('message','The full message, which it reads automatically','Mesej penuh yang dibaca secara automatik','整条消息，由它自动阅读'),O('reply','The person’s YES or NO answer','Jawapan YES atau NO daripada pengguna','使用者的 YES 或 NO 回答'),O('password','The person’s account details','Maklumat akaun pengguna','使用者的账户资料')],{answer:'reply',feedback:B('The person reads and judges the wording. The helper only receives their answer. An incorrect or uncertain observation can therefore affect the advice.','Pengguna membaca dan menilai perkataan. Pembantu hanya menerima jawapan. Pemerhatian salah atau tidak pasti boleh mempengaruhi nasihat.','人阅读并判断措辞，助手只接收答案。因此不正确或不确定的观察会影响建议。')})]},
{id:'ipo',group:2,title:B('Name the parts you just used','Namakan bahagian yang digunakan','说出刚才用到的部分'),read:[B('Decomposition means identifying smaller jobs inside the whole task. Our helper has three jobs: ask, check the answer, and show advice. IPO describes the information moving through those jobs. The message stays with the person; only their answer enters this first version.','Penguraian bermaksud mengenal pasti tugas kecil dalam tugasan besar. Pembantu mempunyai tiga tugas: bertanya, menyemak jawapan dan memberi nasihat. IPO menerangkan aliran maklumat melalui tugas itu. Mesej kekal pada pengguna; hanya jawapan memasuki versi pertama ini.','分解是找出大任务中的小任务。助手有三个任务：提问、检查答案、显示建议。IPO 描述信息怎样流经这些任务。消息由人阅读，第一版只接收人的答案。')],type:'ipo',words:['decomposition','IPO'],questions:[Q('ipoProcess',B('Which part is processing rather than input or output?','Yang manakah proses, bukan input atau output?','哪一项是处理，而不是输入或输出？'),[O('answer','Receiving Sam’s YES answer','Menerima jawapan YES daripada Sam','接收 Sam 的 YES 回答'),O('advice','Displaying the advice on screen','Memaparkan nasihat pada skrin','在屏幕上显示建议'),O('compare','Comparing the answer with the rule','Membandingkan jawapan dengan peraturan','将答案与规则进行比较')],{answer:'compare',feedback:B('The comparison selects a branch. Receiving the answer is input; displaying advice is output.','Perbandingan memilih cabang. Menerima jawapan ialah input; memaparkan nasihat ialah output.','比较用来选择分支。接收答案属于输入，显示建议属于输出。')})]},
{id:'brief',group:3,title:B('Help Sam check a gaming-reward message','Bantu Sam menyemak mesej ganjaran permainan','帮助 Sam 检查游戏奖励消息'),read:[B('Sam is 13. This message offers him game coins, but he does not remember entering a competition. He is unsure whether to follow the link and sign in. He needs help to notice warning signs and decide what to check BEFORE claiming the reward.','Sam berumur 13 tahun. Mesej ini menawarkan syiling permainan, tetapi dia tidak ingat menyertai pertandingan. Dia tidak pasti sama ada patut membuka pautan dan log masuk. Dia perlukan bantuan untuk mengenal pasti tanda amaran dan menentukan apa yang perlu disemak SEBELUM menuntut ganjaran.','Sam 13 岁。这条消息给他提供游戏币，但他不记得参加过比赛。他不知道该不该打开链接并登录。他需要帮助来留意警示，决定领取奖励之前要核实什么。')],questions:[Q('risk',B('1. Choose ONE warning sign for your helper to ask about.','1. Pilih SATU tanda amaran untuk ditanya oleh pembantu anda.','1. 选一种警示，让你的助手询问它。'),Object.entries(RISKS).map(([value,r])=>({value,label:r.name}))),Q('need',B('2. What will your chosen check help Sam notice, and why would that help him?','2. Apakah yang semakan pilihan anda akan bantu Sam perhatikan, dan mengapa ini membantu Sam?','2. 你的检查会帮助 Sam 注意什么？这为什么对他有帮助？'),null,{hint:B('If useful, start: “Sam is unsure about ___. My check will help him notice ___ so he can ___.” Explain the sign you chose, using the message above. There are no required keywords.','Jika membantu, mulakan: “Sam tidak pasti tentang ___. Semakan saya membantu Sam menyedari ___ supaya dia boleh ___.” Terangkan tanda pilihan anda menggunakan mesej di atas. Tiada kata kunci wajib.','需要时可以这样开始：“Sam 不确定……。我的检查会帮助他注意……，这样他就能……。”结合上面的消息解释你选的警示，不要求特定关键词。')})],type:'brief',words:['requirement']},
{id:'question',group:3,title:B('Write the question Sam will see','Tulis soalan yang akan dilihat Sam','写下 Sam 将看到的问题'),read:[B('A requirement tells us what the program must do. Yours must ask about the warning sign you chose. Write a question that Sam can answer YES or NO by looking at the fictional message. Ask about one feature, not several at once.','Keperluan menyatakan apa yang program mesti lakukan. Program anda mesti bertanya tentang tanda dipilih. Tulis soalan yang boleh dijawab YES atau NO dengan melihat mesej rekaan. Tanya satu ciri, bukan beberapa serentak.','需求说明程序必须做什么。你的程序应询问所选警示。写一个 Sam 看虚构消息就能用 YES 或 NO 回答的问题，一次只问一个特征。')],questions:[Q('draftQuestion',B('My question for Sam','Soalan saya untuk Sam','我要问 Sam 的问题'),null,{hint:B('An opening could be “Does the message…?” Name the exact feature you want Sam to notice.','Boleh bermula dengan “Adakah mesej…?” Nyatakan ciri tepat yang perlu diperhatikan Sam.','可以用“消息是否……”开头，具体指出希望 Sam 注意的特征。')})],type:'question',paper:true},
{id:'advice',group:3,title:B('Decide what each answer should lead to','Tentukan hasil bagi setiap jawapan','决定每种答案应带来什么回应'),read:[B('Your helper needs a response for BOTH answers. For YES, name the warning and a useful next action. For NO, explain that this particular warning was not identified; other risks may still exist. Do not use “safe confirmed” or “scam confirmed”.','Pembantu memerlukan respons untuk KEDUA-DUA jawapan. Untuk YES, nyatakan amaran dan tindakan seterusnya. Untuk NO, terangkan bahawa amaran khusus ini tidak dikenal pasti; risiko lain mungkin masih ada. Jangan guna “pasti selamat” atau “penipuan disahkan”.','助手必须回应两种答案。YES 时说明警示及有用的下一步；NO 时说明未发现这一特定警示，但可能还有其他风险。不要说“已确认安全”或“已确认诈骗”。')],questions:[Q('draftYes',UI.yesAdvice,null,{hint:B('Name an action and where to check. “Be careful” alone does not tell Sam what to do.','Nyatakan tindakan dan tempat menyemak. “Berhati-hati” sahaja tidak memberitahu Sam apa perlu dibuat.','指出具体行动和核实渠道。只说“小心”并不能告诉 Sam 要做什么。')}),Q('draftNo',UI.noAdvice,null,{hint:B('Explain the limit of this ONE check. You are not judging the whole message.','Terangkan had SATU semakan ini. Anda tidak menilai keseluruhan mesej.','解释这一项检查的局限，不是在给整条消息下结论。')})],type:'advice',paper:true},
{id:'success',group:3,title:B('What would a successful test show?','Apakah yang ditunjukkan ujian berjaya?','成功的测试应显示什么？'),read:[B('A success criterion is an observable result you expect, not “my program is good”. For the teacher example: if urgent is YES, pressure advice should appear. Create one criterion for YOUR addition using a test answer and the response you expect.','Kriteria kejayaan ialah hasil yang dijangka dan boleh diperhatikan, bukan “program saya bagus”. Dalam contoh guru: jika urgent ialah YES, nasihat desakan patut muncul. Cipta satu kriteria untuk tambahan ANDA menggunakan jawapan ujian dan respons dijangka.','成功标准是可观察的预期结果，不是“我的程序很好”。教师示例中，urgent 为 YES 时应出现有关催促的建议。为你的新增部分写一个包含测试输入及预期回应的标准。')],questions:[Q('criterionInput',B('If the person answers…','Jika pengguna menjawab…','如果使用者回答……'),YESNO),Q('criterionOutput',B('…my helper should display this advice:','…pembantu saya patut memaparkan nasihat ini:','……我的助手应该显示以下建议：'))],type:'success',words:['success criterion']},
{id:'read',group:4,title:B('Read a plan before writing one','Baca pelan sebelum menulis','先读懂计划，再自己写'),read:[B('Pseudocode is a readable way to write an algorithm. It describes instructions; it is not Python that the browser can run. Here, urgent stores the person’s YES/NO answer. IF checks it. ELSE gives the other route. ENDIF ends the decision. Only one output is used for each answer.','Pseudokod ialah cara menulis algoritma yang mudah dibaca. Ia menerangkan arahan, bukan Python yang boleh dijalankan pelayar. Di sini, urgent menyimpan jawapan YES/NO. IF menyemak, ELSE memberi laluan lain, ENDIF menamatkan keputusan. Hanya satu output digunakan bagi setiap jawapan.','伪代码是易读的算法写法，描述指令，并不是浏览器可执行的 Python。urgent 保存 YES/NO 回答；IF 检查，ELSE 表示另一条路径，ENDIF 结束判断。每个答案只执行一个输出。')],type:'read',words:['pseudocode','condition','trace'],questions:[Q('readPrediction',B('For urgent = NO, which instruction displays a response?','Bagi urgent = NO, arahan mana memaparkan respons?','urgent = NO 时，哪条指令显示回应？'),[O('both','Both output instructions','Kedua-dua arahan output','两条输出指令'),O('else','The output after ELSE','Output selepas ELSE','ELSE 后的输出'),O('if','The output immediately after IF','Output sejurus selepas IF','IF 后紧接的输出')],{answer:'else',feedback:B('The IF condition is false for NO, so the YES output is skipped. The ELSE output is followed. ENDIF does not display anything.','Syarat IF palsu bagi NO, jadi output YES dilangkau. Output ELSE diikuti. ENDIF tidak memaparkan apa-apa.','输入 NO 时 IF 条件为假，因此跳过 YES 输出，执行 ELSE 输出。ENDIF 本身不显示任何内容。')})]},
{id:'build',group:4,title:B('Arrange the instructions for your addition','Susun arahan untuk tambahan anda','排列你的新增指令'),read:[B('The same decision pattern can use your question and advice. The instruction pieces below are mixed. Put them into an order another person could follow. INPUT warning stores an answer; it must come before the IF that checks it. The two output pieces contain your own advice.','Corak keputusan yang sama boleh menggunakan soalan dan nasihat anda. Bahagian arahan di bawah bercampur. Susun supaya orang lain boleh mengikutinya. INPUT warning menyimpan jawapan; ia mesti sebelum IF. Dua bahagian output mengandungi nasihat anda.','同一种判断模式可使用你的问题和建议。下方指令被打乱了，请排列成他人能执行的顺序。INPUT warning 保存答案，必须在判断它的 IF 前。两个输出片段使用你自己的建议。')],type:'build',paper:true,words:['algorithm','condition']},
{id:'describe',group:4,title:B('Explain what YOUR instructions do','Terangkan arahan ANDA','解释你自己的指令'),read:[B('Explain the completed plan as if a partner cannot see the code. Say what information it receives and what happens for each answer. You do not need to describe every symbol or meet a word count.','Terangkan pelan siap seolah-olah rakan tidak melihat kod. Nyatakan maklumat diterima dan apa berlaku bagi setiap jawapan. Tidak perlu menerangkan setiap simbol atau memenuhi bilangan perkataan.','假设同伴看不到代码，向他解释整个计划：接收什么信息，两种答案各会发生什么。不必逐个解释符号，也没有字数要求。')],type:'describe',questions:[Q('description',B('How does your addition work?','Bagaimanakah tambahan anda berfungsi?','你的新增部分如何工作？'),null,{hint:B('“My question asks about ___. When the answer is YES, ___. When it is NO, ___.” Use this if helpful, or explain your own way.','“Soalan saya bertanya tentang ___. Apabila YES, ___. Apabila NO, ___.” Gunakan jika membantu atau terangkan dengan cara sendiri.','“我的问题询问……，回答 YES 时……，回答 NO 时……。”可参考，也可用自己的方式解释。')})],paper:true},
{id:'test',group:4,title:B('Can someone follow your plan without guessing?','Bolehkah orang lain ikut tanpa meneka?','别人能不靠猜测执行你的计划吗？'),read:[B('Test both YES and NO, one case at a time. Predict the advice BEFORE trying the plan. A partner should follow your written instructions, not invent missing steps. If they have to guess, record where. The on-screen walkthrough checks order and follows your selected branch; it does not judge whether your advice is sensible.','Uji YES dan NO, satu kes pada satu masa. Ramalkan nasihat SEBELUM mencuba. Rakan mesti ikut arahan bertulis, bukan mencipta langkah hilang. Jika perlu meneka, rekod di mana. Panduan skrin menyemak urutan dan ikut cabang dipilih; ia tidak menilai kewajaran nasihat.','逐个测试 YES 和 NO，先预测建议，再试计划。同伴应遵循书面指令，不应补造缺失步骤；需要猜测时记录位置。屏幕执行会检查顺序并沿所选分支进行，但不会判断建议是否合理。')],type:'test',paper:true,words:['trace','test']},
{id:'improve',group:4,title:B('Use your test to make one improvement','Gunakan ujian untuk satu penambahbaikan','根据测试做出一项改进'),read:[B('Look at a test, not just how confident you feel. Was the question unclear? Was a response missing or vague? Did your partner need to guess? Return to the relevant design card and improve it. If both tests worked, explain what you checked or ask a partner to challenge the wording.','Lihat ujian, bukan keyakinan sahaja. Adakah soalan kurang jelas? Respons hilang atau kabur? Rakan perlu meneka? Kembali ke kad reka bentuk dan baiki. Jika kedua-dua ujian berjaya, terangkan apa disemak atau minta rakan mencabar perkataan.','看测试证据，不只看自信程度。问题是否不清楚？回应是否缺失或含糊？同伴是否需要猜？返回相应设计卡修改。若两次测试都成功，解释你检查了什么，或请同伴质疑措辞。')],type:'improve',questions:[Q('improvement',B('What did you change or check, and what evidence led you to that decision?','Apakah yang diubah atau disemak, dan bukti apa membawa kepada keputusan itu?','你修改或检查了什么？什么证据让你作出这个决定？'))]},
{id:'pitstop',group:5,title:B('Where are you in this learning?','Di manakah anda dalam pembelajaran ini?','你现在处于哪种学习状态？'),read:[B('Choose a phase for this topic, not a label for yourself. Use your plan or test as evidence. Needing help with English is different from not understanding the algorithm; you can ask for either kind of support.','Pilih fasa untuk topik ini, bukan label diri. Gunakan pelan atau ujian sebagai bukti. Perlukan bantuan bahasa Inggeris berbeza daripada tidak memahami algoritma; anda boleh minta mana-mana bantuan.','选择针对这个主题的状态，不是给自己贴标签。用计划或测试作证据。需要英语帮助与不理解算法不同，可以请求任一种帮助。')],type:'pitstop',questions:[Q('phase',B('Which description fits now?','Penerangan manakah sesuai sekarang?','哪种描述符合现在的情况？'),[O('new','New learning: the example helps me take the next step','Pembelajaran baharu: contoh membantu langkah seterusnya','新学习：示例能帮助我迈出下一步'),O('consolidating','Consolidating: I can follow and test the branches more accurately','Mengukuhkan: saya semakin tepat mengikut dan menguji cabang','巩固：我能更准确地执行和测试分支'),O('treading','Treading water: I can do this and need more challenge','Tidak tercabar: saya boleh buat dan perlukan cabaran','原地踏步：我已经会做，需要更多挑战'),O('help','Drowning / need help: I need someone to work through a step with me','Terlalu sukar / perlukan bantuan: saya perlukan seseorang membimbing satu langkah','感到困难／需要帮助：需要有人和我一起完成一步')]),Q('phaseEvidence',B('Point to one part of your plan or test that supports your choice.','Nyatakan satu bahagian pelan atau ujian yang menyokong pilihan.','指出计划或测试中的一处证据，支持你的选择。'),null,{optional:true})]},
{id:'plenary',group:6,title:B('One new message. The same careful thinking.','Mesej baharu. Pemikiran teliti yang sama.','一条新消息，同样需要仔细思考'),read:[B('A fictional school message says: “The bus leaves in five minutes. Please come to reception now.” It is urgent. This alone does not tell us whether it is genuine. Think about the limits of the teacher’s pressure-check example.','Mesej sekolah rekaan berbunyi: “Bas bertolak lima minit lagi. Sila datang ke kaunter sekarang.” Ia mendesak. Ini sahaja tidak menentukan kesahihannya. Fikirkan had contoh semakan desakan guru.','一条虚构学校消息说：“校车五分钟后出发，请现在到接待处。”它很急迫，但仅凭这一点不能确定真假。想想教师催促检查示例的局限。')],questions:[Q('exitMeaning',B('What can the pressure-check helper reasonably conclude?','Apakah kesimpulan munasabah pembantu semakan desakan?','催促检查助手可以合理得出什么结论？'),[O('genuine','School-related messages are always genuine','Mesej berkaitan sekolah sentiasa sah','学校相关消息一定真实'),O('scam','Urgent language proves this is a scam','Bahasa mendesak membuktikan penipuan','催促语言证明这是诈骗'),O('limited','Pressure was identified; the person still needs context and an independent check','Desakan dikenal pasti; pengguna masih perlukan konteks dan semakan bebas','发现了催促；人仍需结合情境并独立核实')],{answer:'limited',feedback:B('The helper applies a narrow rule. It cannot establish who really sent a message. A useful output explains the limitation and a next step rather than claiming certainty.','Pembantu menggunakan peraturan terhad. Ia tidak dapat memastikan penghantar sebenar. Output berguna menerangkan had dan langkah seterusnya, bukan kepastian.','助手只应用有限规则，不能确定真正发件人。有用输出应说明局限及下一步，而不是声称确定结论。')}),Q('exitReason',B('Why does your own NO response also need careful wording?','Mengapa respons NO anda juga memerlukan perkataan teliti?','为什么你自己设计的 NO 回应也需要谨慎措辞？'))]},
{id:'exit',group:7,title:B('Keep the evidence that shows your thinking','Simpan bukti pemikiran anda','保留能展示思考的证据'),read:[B('Your teacher wants to see what you planned, tested and improved—not a page full of perfect answers. Check your report, add paper evidence if needed, then save it as a PDF for Week 2 Project in Teams. Unattempted extensions and blank answers will not appear.','Guru mahu melihat apa yang dirancang, diuji dan dibaiki—bukan halaman jawapan sempurna. Semak laporan, tambah bukti kertas jika perlu, kemudian simpan PDF untuk Week 2 Project dalam Teams. Cabaran tidak dicuba dan jawapan kosong tidak muncul.','老师想看你规划、测试和改进了什么，而不是满页完美答案。检查报告，按需添加纸上证据，再保存 PDF 提交到 Teams 的 Week 2 Project。未尝试的拓展及空白答案不会出现。')],questions:[Q('nextStep',B('What would you need to check or learn before turning this plan into Python next lesson?','Apakah yang perlu disemak atau dipelajari sebelum menukar pelan kepada Python pelajaran seterusnya?','下节课把计划转为 Python 前，你需要检查或学习什么？'),null,{optional:true})],type:'exit',paper:true}
];
// Keep the existing card index and clue response so saved work remains compatible.
CARDS[0].title=B('Read & Do Now: from message clues to a program plan','Baca & Aktiviti Mula: daripada petunjuk mesej kepada pelan program','阅读与开始活动：从消息线索到程序计划');
CARDS[0].words=['phishing','warning sign','IPO','condition','test'];
CARDS[0].questions.push(...STARTER.items.map(({id,prompt,options,...extra})=>Q(id,prompt,options||null,extra)));
FIELD.clue.prompt=B('1. Which part of Sam’s message puts pressure on him to act quickly?','1. Bahagian mesej Sam manakah mendesaknya bertindak segera?','1. Sam 消息中的哪部分催促他赶快行动？');
FIELD.clue.choiceFeedback={
 now:FIELD.clue.feedback,
 coins:B('The coins are an attractive reward. For pressure, look for words that hurry Sam or set a deadline.','Syiling ialah ganjaran menarik. Bagi desakan, cari perkataan yang menyuruh Sam bergegas atau menetapkan tarikh akhir.','游戏币是有吸引力的奖励。要找催促，请看让 Sam 赶快行动或规定截止时间的词。'),
 name:B('The sender name is a claim about identity. For pressure, look at what tells Sam to hurry.','Nama penghantar ialah dakwaan identiti. Bagi desakan, lihat apa yang menyuruh Sam bergegas.','发送者名称是在声称身份。要找催促，请看哪些内容要求 Sam 赶快行动。')
};

// Separate before/after fields preserve the same nine criteria without reinterpreting old reflections.
const reflectionId=(moment,check,field)=>`rfl_${moment}_${check}_${field}`;
for(const moment of ['before','after']){
 const card=CARDS.find(c=>c.id===(moment==='before'?'types':'pitstop'));
 card.title=REFLECTION[moment==='before'?'beforeTitle':'afterTitle'];
 card.read=[REFLECTION[moment==='before'?'beforeIntro':'afterIntro']];
 for(const check of REFLECTION.checks){
  const fields=moment==='before'?['status','evidence','prior','target','next']:['status','evidence','phase','reason','next'];
  for(const field of fields){
   const labels={status:REFLECTION.statusLabel,evidence:REFLECTION.evidenceLabel,prior:REFLECTION.priorLabel,target:REFLECTION.targetLabel,next:REFLECTION.nextLabel,phase:REFLECTION.phaseLabel,reason:REFLECTION.phaseReason};
   const prompt=B(...['en','ms','zh'].map(l=>`${moment==='before'?REFLECTION.earlier[l]:REFLECTION.now[l]} · ${check.title[l]} · ${labels[field][l]}`));
   const values=field==='status'?REFLECTION.statuses:field==='prior'?REFLECTION.prior:field==='phase'?REFLECTION.phases:field==='target'?{yes:UI.yes,no:UI.no}:null;
   card.questions.push(Q(reflectionId(moment,check.id,field),prompt,values?Object.entries(values).map(([value,label])=>({value,label})):null));
  }
 }
 if(moment==='after')for(const area of REFLECTION.areas)card.questions.push(Q(reflectionId(moment,area.id,'comparison'),B(...['en','ms','zh'].map(l=>`${area.label[l]} · ${REFLECTION.comparisonLabel[l]}`))));
}

const GLOSSARY={
 phishing:B('A deception that pretends to be trusted to obtain information or draw someone to a harmful link.','Penipuan menyamar sebagai pihak dipercayai untuk mendapatkan maklumat atau menarik seseorang ke pautan berbahaya.','冒充可信对象来骗取信息或诱导人打开有害链接的骗局。'),
 'warning sign':B('An observable clue that gives you a reason to pause and check. It is not proof of the sender’s identity.','Petunjuk yang boleh diperhatikan dan memberi sebab untuk berhenti serta menyemak. Ia bukan bukti identiti penghantar.','可观察的线索，提醒你暂停并核实；它不是发送者身份的证明。'),
 abstraction:B('Keep the details that matter to THIS purpose. The colour of Sam’s notebook does not affect a pressure-check rule.','Kekalkan butiran yang penting untuk tujuan INI. Warna buku Sam tidak mempengaruhi peraturan desakan.','保留与当前目的有关的信息。Sam 笔记本的颜色不会影响催促判断规则。'),
 decomposition:B('Identify smaller jobs in a larger problem. Here: ask a question, check the answer, display advice.','Kenal pasti tugas kecil dalam masalah besar. Di sini: tanya, semak jawapan, papar nasihat.','找出大问题中的小任务。这里是提问、检查答案、显示建议。'),
 IPO:B('Input = information received. Process = work done using it. Output = information produced.','Input = maklumat diterima. Proses = kerja menggunakan maklumat. Output = maklumat dihasilkan.','输入＝接收的信息；处理＝使用信息进行的工作；输出＝产生的信息。'),
 requirement:B('Something the program must do for its user. Example: ask a clear YES/NO question.','Sesuatu yang program mesti lakukan untuk pengguna. Contoh: tanya soalan YES/NO yang jelas.','程序必须为用户做的事，例如提出清晰的 YES/NO 问题。'),
 'success criterion':B('An observable result expected in a test: if the input is X, the output should be Y.','Hasil boleh diperhatikan dalam ujian: jika input X, output sepatutnya Y.','测试中可观察的预期结果：输入为 X 时，输出应该是 Y。'),
 pseudocode:B('A readable way to describe algorithm steps. It is not a programming language that runs here.','Cara mudah dibaca untuk menerangkan langkah algoritma. Bukan bahasa pengaturcaraan yang berjalan di sini.','以易读方式描述算法步骤，不是这里可以执行的编程语言。'),
 condition:B('A question with a true/false result, such as whether warning equals YES.','Soalan dengan hasil benar/palsu, seperti sama ada warning sama dengan YES.','结果为真或假的判断，例如 warning 是否等于 YES。'),
 algorithm:B('Clear instructions for solving a problem. A person should be able to follow them without guessing missing steps.','Arahan jelas untuk menyelesaikan masalah. Orang lain patut boleh mengikut tanpa meneka langkah hilang.','解决问题的清晰指令，他人应能执行而不必猜测缺失步骤。'),
 trace:B('Follow each applicable instruction using fixed input. Skip the branch whose condition does not match.','Ikut setiap arahan berkenaan menggunakan input tetap. Langkau cabang yang tidak sepadan.','使用固定输入逐条执行适用指令，跳过不符合条件的分支。'),
 test:B('Choose an input, predict the result, try the plan, then compare the observed result with your prediction.','Pilih input, ramalkan hasil, cuba pelan, kemudian bandingkan hasil sebenar dengan ramalan.','选择输入、预测结果、尝试计划，再比较实际结果与预测。')
};
const EXTENSIONS=[
{id:'ext1',title:B('1 · Explain it on a card','1 · Terangkan pada kad','1 · 制作解释卡'),intro:B('Make a two-sided revision card for input, process, output or condition. Front: the term and a question. Back: your definition, an example from your helper and why it fits. You may draw it on paper; upload a photo or describe it below.','Buat kad ulang kaji dua muka untuk input, proses, output atau syarat. Depan: istilah dan soalan. Belakang: definisi, contoh daripada pembantu dan sebab ia sesuai. Boleh lukis pada kertas; muat naik foto atau huraikan di bawah.','制作 input、process、output 或 condition 的双面复习卡。正面写术语和问题；背面写自己的定义、助手中的例子及符合定义的原因。可用纸笔，上传照片或在下方描述。')},
{id:'ext2',title:B('2 · Handle uncertainty','2 · Kendalikan ketidakpastian','2 · 处理不确定回答'),intro:B('A user cannot tell whether the link was expected. Design an UNSURE route. Write the question, the advice for UNSURE and one test. Explain why guessing YES or NO for the person could produce misleading advice. No loop or Python code is required.','Pengguna tidak pasti sama ada pautan dijangka. Reka laluan TIDAK PASTI. Tulis soalan, nasihat dan satu ujian. Terangkan mengapa meneka YES atau NO boleh mengelirukan. Tidak perlu gelung atau kod Python.','使用者不确定链接是否在预期之内。设计 UNSURE 路径：写问题、对应建议及一次测试。解释替使用者猜 YES 或 NO 为何可能误导。不要求循环或 Python 代码。')},
{id:'ext3',title:B('3 · Challenge the rule','3 · Cabar peraturan','3 · 质疑规则'),intro:B('Invent two short fictional messages with the same YES/NO answer but different contexts: one could be genuine and one concerning. Explain why the helper cannot distinguish them using that answer alone. Propose one extra question and a test for it. Do not include working links or personal information.','Cipta dua mesej rekaan ringkas dengan jawapan YES/NO sama tetapi konteks berbeza: satu mungkin sah dan satu membimbangkan. Terangkan mengapa jawapan itu sahaja tidak cukup. Cadangkan satu soalan tambahan dan ujian. Jangan sertakan pautan sebenar atau maklumat peribadi.','创作两条简短虚构消息，YES/NO 答案相同但情境不同：一条可能真实，另一条可疑。解释为何助手仅凭该答案不能区分，并提出一个额外问题及测试。不要包含可用链接或个人信息。')}
];
for(const e of EXTENSIONS)Q(e.id+'_work',e.title);
Q('pythonCode',B('Optional Python program','Program Python pilihan','可选 Python 程序'));
Q('pythonReflection',B('What did you change or learn in Python?','Apakah yang diubah atau dipelajari dalam Python?','你在 Python 中修改或学会了什么？'));

const MAIN1={
 "steps": [
  {
   "dest": 2,
   "label": {
    "en": "1A · Investigate messages",
    "ms": "1A · Siasat mesej",
    "zh": "1A · 研究消息"
   }
  },
  {
   "dest": 3,
   "label": {
    "en": "1B · Read the rule",
    "ms": "1B · Baca peraturan",
    "zh": "1B · 阅读规则"
   }
  },
  {
   "dest": 4,
   "label": {
    "en": "1C · Sam’s needs",
    "ms": "1C · Keperluan Sam",
    "zh": "1C · Sam 的需要"
   }
  },
  {
   "dest": "question-lab",
   "label": {
    "en": "1D · Turn clues into questions",
    "ms": "1D · Tukar petunjuk kepada soalan",
    "zh": "1D · 把线索变成问题"
   }
  },
  {
   "dest": 5,
   "label": {
    "en": "1E · Write your questions",
    "ms": "1E · Tulis soalan anda",
    "zh": "1E · 写出问题"
   }
  },
  {
   "dest": 6,
   "label": {
    "en": "1F · Design the advice",
    "ms": "1F · Reka nasihat",
    "zh": "1F · 设计建议"
   }
  },
  {
   "dest": 7,
   "label": {
    "en": "1G · Set test criteria",
    "ms": "1G · Tetapkan kriteria ujian",
    "zh": "1G · 设定测试标准"
   }
  }
 ],
 "aIntro": {
  "en": "Investigate six fictional social-media messages. For each one: read the context and chat, choose the best-supported judgment, decide whether it pushes you to act immediately, then explain a clue and a safe next step. Use the feedback to review your reasoning. In 1B you will see how one observation becomes a program rule.",
  "ms": "Siasat enam mesej media sosial rekaan. Bagi setiap mesej: baca konteks dan sembang, pilih penilaian paling disokong, tentukan sama ada ia mendesak tindakan segera, kemudian terangkan petunjuk dan langkah selamat. Gunakan maklum balas untuk menyemak alasan. Dalam 1B anda akan melihat bagaimana satu pemerhatian menjadi peraturan program.",
  "zh": "研究六条虚构社交媒体消息。每条都要：阅读背景与聊天，选择证据最支持的判断，判断是否催促立即行动，再解释一条线索和安全的下一步。用反馈检查推理。1B 将展示怎样把一项观察变成程序规则。"
 },
 "fictional": {
  "en": "Fictional classroom example · platform-inspired layout",
  "ms": "Contoh kelas rekaan · susun atur diinspirasikan platform",
  "zh": "虚构课堂示例 · 参考平台风格的布局"
 },
 "context": {
  "en": "What you already know in this example",
  "ms": "Apa yang sudah diketahui dalam contoh ini",
  "zh": "这个示例中你已知的背景"
 },
 "preview": {
  "en": "Link shown in the message · read only",
  "ms": "Pautan dalam mesej · baca sahaja",
  "zh": "消息中的链接 · 仅供阅读"
 },
 "noReply": {
  "en": "Classroom example · no replies are sent",
  "ms": "Contoh kelas · tiada balasan dihantar",
  "zh": "课堂示例 · 不会发送回复"
 },
 "judgment": {
  "en": "1. Which judgment is best supported by the evidence shown?",
  "ms": "1. Penilaian manakah paling disokong oleh bukti yang ditunjukkan?",
  "zh": "1. 展示的证据最支持哪种判断？"
 },
 "urgency": {
  "en": "2. Does this message push the reader to act immediately?",
  "ms": "2. Adakah mesej ini mendesak pembaca bertindak segera?",
  "zh": "2. 这条消息是否催促读者立即行动？"
 },
 "reason": {
  "en": "3. Point to a specific clue or piece of context. Explain your judgment and what the person should check or do next.",
  "ms": "3. Rujuk petunjuk atau konteks khusus. Terangkan penilaian anda dan apa yang patut disemak atau dilakukan seterusnya.",
  "zh": "3. 指出具体线索或背景，解释判断，以及使用者下一步应核实什么或做什么。"
 },
 "judgments": {
  "scam": {
   "en": "Suspected scam",
   "ms": "Disyaki penipuan",
   "zh": "疑似诈骗"
  },
  "genuine": {
   "en": "Likely genuine in this context",
   "ms": "Mungkin sah dalam konteks ini",
   "zh": "根据此背景，很可能真实"
  },
  "unknown": {
   "en": "Not enough information — verify first",
   "ms": "Maklumat tidak cukup — sahkan dahulu",
   "zh": "信息不足——先核实"
  }
 },
 "limits": {
  "en": "A familiar platform, profile picture or logo does not verify a sender. “Likely genuine” is a judgment about the supplied context, not a promise that a link is safe. A warning sign is something to ask about; it is not a complete scam detector.",
  "ms": "Platform, gambar profil atau logo yang dikenali tidak mengesahkan penghantar. “Mungkin sah” ialah penilaian konteks diberi, bukan jaminan pautan selamat. Tanda amaran ialah sesuatu untuk ditanya; bukan pengesan penipuan lengkap.",
  "zh": "熟悉的平台、头像或标志不能核实发送者。“很可能真实”是根据给定背景作出的判断，不保证链接安全。警示适合转成问题，但不是完整的诈骗检测器。"
 },
 "overview": {
  "en": "My message observations",
  "ms": "Pemerhatian mesej saya",
  "zh": "我的消息观察记录"
 },
 "bIntro": {
  "en": "Now separate the person’s job from the program’s job. The person reads the message and answers a specific question. This small rule receives YES or NO and chooses one piece of advice. Read the explanation, trace both answers, then explain the input, decision and output. You are not being asked to write Python here.",
  "ms": "Sekarang bezakan tugas pengguna dan program. Pengguna membaca mesej dan menjawab soalan khusus. Peraturan kecil ini menerima YES atau NO dan memilih satu nasihat. Baca penerangan, jejak kedua-dua jawapan, kemudian terangkan input, keputusan dan output. Anda tidak diminta menulis Python di sini.",
  "zh": "现在区分人和程序的工作。人阅读消息并回答具体问题；这条小规则接收 YES 或 NO，选择一条建议。阅读解释，执行两种答案，再解释输入、判断与输出。这里不要求编写 Python。"
 },
 "bMeaning": {
  "en": "INPUT stores the answer as urgent. IF compares that value with YES. When the condition is true, use the first OUTPUT; otherwise ELSE selects the other OUTPUT. ENDIF ends the choice. Only one output is shown for each answer. The rule does not read the chat or verify the link.",
  "ms": "INPUT menyimpan jawapan sebagai urgent. IF membandingkan nilainya dengan YES. Jika syarat benar, gunakan OUTPUT pertama; jika tidak, ELSE memilih OUTPUT lain. ENDIF menamatkan pilihan. Hanya satu output bagi setiap jawapan. Peraturan tidak membaca sembang atau mengesahkan pautan.",
  "zh": "INPUT 把答案保存为 urgent。IF 比较该值是否为 YES。条件为真时使用第一条 OUTPUT，否则 ELSE 选择另一条 OUTPUT。ENDIF 结束选择。每个答案只显示一个输出。规则不读取聊天，也不核实链接。"
 },
 "dIntro": {
  "en": "Use your observations from 1A to ask about visible features, rather than asking Sam to decide “Is this a scam?” all at once. A question should have one clear focus. Feelings such as worry or excitement can be useful prompts to pause, but they are not proof that a message is fake.",
  "ms": "Gunakan pemerhatian 1A untuk bertanya tentang ciri yang dapat dilihat, bukan meminta Sam memutuskan “Adakah ini penipuan?” sekali gus. Soalan perlu satu fokus jelas. Perasaan risau atau teruja boleh mengingatkan supaya berhenti, tetapi bukan bukti mesej palsu.",
  "zh": "根据1A的观察询问可见特征，而不是一下子让 Sam 判断“这是诈骗吗？”每个问题应只有一个明确重点。担心或兴奋可以提醒人暂停，但不能证明消息是假的。"
 },
 "dRules": {
  "en": "Ask about one observable feature. Make the meaning of YES and NO clear. Avoid asking for a password or code. Avoid double questions such as “Is it urgent AND asking you to sign in?”: one answer would hide which sign was present. If the person cannot tell, do not make them guess; advise checking or design an UNSURE route as an extension.",
  "ms": "Tanya satu ciri yang boleh diperhatikan. Jelaskan maksud YES dan NO. Jangan minta kata laluan atau kod. Elakkan soalan berganda seperti “Adakah ia mendesak DAN meminta log masuk?”: satu jawapan menyembunyikan tanda sebenar. Jika pengguna tidak pasti, jangan paksa meneka; nasihatkan semakan atau reka laluan TIDAK PASTI sebagai cabaran.",
  "zh": "询问一个可观察特征，明确 YES 和 NO 的含义，不索取密码或验证码。避免“是否既催促又要求登录？”这种双重问题，因为一个答案会掩盖究竟出现哪个警示。不确定时不要强迫猜测；应建议核实，或在拓展中设计 UNSURE 路径。"
 },
 "eIntro": {
  "en": "Build a short series of focused checks for Sam. Use up to three question slots, covering different signs. For every question you keep, explain what YES and NO mean, write advice for both in 1F and test both routes in Main Task 2. Each check gives its own advice; you are not calculating a danger score or declaring the whole message safe.",
  "ms": "Bina siri semakan ringkas untuk Sam. Gunakan sehingga tiga ruang soalan bagi tanda berbeza. Bagi setiap soalan yang dikekalkan, terangkan maksud YES dan NO, tulis kedua-dua nasihat dalam 1F dan uji kedua-dua laluan dalam Tugasan Utama 2. Setiap semakan memberi nasihat sendiri; anda tidak mengira skor bahaya atau mengisytiharkan seluruh mesej selamat.",
  "zh": "为 Sam 建立一组简短、聚焦的检查。最多使用三个问题栏，检查不同警示。保留的每个问题都要说明 YES、NO 的含义，在1F写两条建议，并在主任务二测试两条路径。各项检查分别给出建议，不计算危险分数，也不宣称整条消息安全。"
 },
 "fIntro": {
  "en": "For the selected check, write useful advice for BOTH answers. YES should explain the sign and a specific action. NO should explain what was not reported and what still needs checking. Use a trusted route appropriate to the claim: for a school message, ask a teacher; for a game offer, check in the game’s usual app. Repeat for each question you keep.",
  "ms": "Bagi semakan dipilih, tulis nasihat berguna untuk KEDUA-DUA jawapan. YES patut menerangkan tanda dan tindakan khusus. NO patut menerangkan apa yang tidak dilaporkan dan apa masih perlu disemak. Gunakan laluan dipercayai sesuai: mesej sekolah, tanya guru; tawaran permainan, semak aplikasi permainan biasa. Ulang bagi setiap soalan yang dikekalkan.",
  "zh": "为当前检查写出两种答案的有用建议。YES 应说明警示和具体行动；NO 应说明未报告什么、仍需核实什么。根据说法选择可信渠道：学校消息可问老师，游戏奖励可在常用游戏应用中核实。对保留的每个问题重复完成。"
 },
 "planLabel": {
  "en": "My planned checks",
  "ms": "Semakan yang saya rancang",
  "zh": "我规划的检查"
 },
 "planNote": {
  "en": "Each check keeps its own question, advice, instructions and tests. Changing tabs does not replace another check. Work through the planning and testing steps for each question you keep.",
  "ms": "Setiap semakan menyimpan soalan, nasihat, arahan dan ujian sendiri. Menukar tab tidak menggantikan semakan lain. Lengkapkan langkah perancangan dan ujian bagi setiap soalan yang dikekalkan.",
  "zh": "每项检查分别保存问题、建议、指令和测试。切换标签不会替换另一项检查。请为保留的每个问题完成规划与测试。"
 },
 "polarity": {
  "en": "Explain this question: what would YES tell you, and what would NO tell you?",
  "ms": "Terangkan soalan ini: apa yang YES dan NO akan beritahu anda?",
  "zh": "解释这个问题：YES 和 NO 分别能告诉你什么？"
 },
 "polarityHint": {
  "en": "“YES means the person noticed ___. NO means they did not report ___. Neither answer tells us ___.” Refer to your exact question.",
  "ms": "“YES bermaksud pengguna menyedari ___. NO bermaksud mereka tidak melaporkan ___. Kedua-duanya tidak memberitahu kita ___.” Rujuk soalan tepat anda.",
  "zh": "“YES 表示使用者注意到___。NO 表示没有报告___。两者都不能告诉我们___。”请对应你的具体问题。"
 },
 "labPrompt": {
  "en": "Rewrite this vague question: “Does this message feel dangerous?” Choose one warning sign from the examples and write a clear YES/NO question about it.",
  "ms": "Tulis semula soalan kabur ini: “Adakah mesej ini terasa berbahaya?” Pilih satu tanda amaran daripada contoh dan tulis soalan YES/NO yang jelas.",
  "zh": "改写这个模糊问题：“这条消息让你觉得危险吗？”从示例选择一种警示，写一个清晰的 YES/NO 问题。"
 },
 "labReview": {
  "en": "Does your question point to something the reader can identify, ask about one feature and avoid requesting private details? For example, “Does the message ask you to share a sign-in code?” is more specific than asking how dangerous it feels. Explain why your YES and NO answers would be useful.",
  "ms": "Adakah soalan merujuk sesuatu yang boleh dikenal pasti, bertanya satu ciri dan tidak meminta maklumat sulit? Contohnya, “Adakah mesej meminta anda berkongsi kod log masuk?” lebih khusus daripada bertanya tahap rasa bahaya. Terangkan mengapa jawapan YES dan NO berguna.",
  "zh": "你的问题是否针对可识别内容、只问一个特征、没有索取隐私？例如，“消息是否要求分享登录验证码？”比询问感觉多危险更具体。请说明 YES、NO 答案为什么有用。"
 },
 "patterns": [
  {
   "en": "Time pressure → “Does the message push you to act immediately?” A real deadline can produce YES, so the advice should still ask for verification.",
   "ms": "Desakan masa → “Adakah mesej mendesak tindakan segera?” Tarikh akhir sebenar boleh memberi YES, jadi nasihat masih perlu meminta pengesahan.",
   "zh": "时间催促 → “消息是否催促你立即行动？”真实截止时间也可能得到 YES，因此建议仍需要求核实。"
  },
  {
   "en": "Unexpected link → “Does the message contain a link you were not expecting?” NO does not mean that the destination was checked.",
   "ms": "Pautan tidak dijangka → “Adakah mesej mengandungi pautan yang tidak dijangka?” NO tidak bermaksud destinasi telah disemak.",
   "zh": "意外链接 → “消息是否包含你没预料到的链接？”NO 不代表已核实链接目的地。"
  },
  {
   "en": "Account details → “Does the message ask you to share a password or sign-in code?” Ask ABOUT the request; never ask the person to enter the secret into your helper.",
   "ms": "Maklumat akaun → “Adakah mesej meminta kata laluan atau kod log masuk?” Tanya TENTANG permintaan; jangan minta pengguna memasukkan rahsia ke pembantu.",
   "zh": "账户资料 → “消息是否要求分享密码或登录验证码？”询问是否存在这种请求，绝不让人把秘密输入助手。"
  },
  {
   "en": "Unexpected reward → “Does the message offer a reward you did not expect?” A reward is a reason to check the claim, not proof of a scam.",
   "ms": "Ganjaran tidak dijangka → “Adakah mesej menawarkan ganjaran yang tidak dijangka?” Ganjaran ialah sebab untuk menyemak dakwaan, bukan bukti penipuan.",
   "zh": "意外奖励 → “消息是否提供你没预料到的奖励？”奖励是需要核实说法的理由，不是诈骗的证明。"
  }
 ],
 "cases": [
  {
   "id": "discord_reward",
   "platform": "Discord",
   "sender": "PrizePulse Support",
   "handle": "@prizepulse_helper",
   "channel": "# direct-message",
   "context": {
    "en": "This is a new direct message from someone Sam does not know. He did not enter a reward competition.",
    "ms": "Ini mesej langsung baharu daripada orang yang Sam tidak kenal. Dia tidak menyertai pertandingan ganjaran.",
    "zh": "这是 Sam 不认识的人发来的新私信。他没有参加奖励比赛。"
   },
   "messages": [
    {
     "en": "🎮 You were selected for a free gaming pass and 5,000 coins!",
     "ms": "🎮 Anda dipilih untuk pas permainan percuma dan 5,000 syiling!",
     "zh": "🎮 你被选中了！免费游戏通行证和5,000游戏币！"
    },
    {
     "en": "Only 5 minutes left. Claim NOW and sign in using this link before the reward disappears.",
     "ms": "Tinggal 5 minit. Tuntut SEKARANG dan log masuk melalui pautan ini sebelum ganjaran hilang.",
     "zh": "只剩5分钟！奖励消失前，立即通过这个链接登录领取。"
    }
   ],
   "url": "reward-pass.example/claim",
   "preview": {
    "en": "Your exclusive reward",
    "ms": "Ganjaran eksklusif anda",
    "zh": "你的专属奖励"
   },
   "judgment": "scam",
   "urgent": "yes",
   "reason": {
    "en": "An unexpected reward, an unknown sender, a sign-in link and a short deadline combine to support suspected scam. This classroom case models a reward phishing attempt.",
    "ms": "Ganjaran tidak dijangka, penghantar tidak dikenali, pautan log masuk dan tempoh singkat menyokong syak penipuan. Kes kelas ini memodelkan phishing ganjaran.",
    "zh": "意外奖励、陌生发送者、登录链接和极短期限共同支持“疑似诈骗”。这个课堂案例模拟奖励钓鱼。"
   },
   "next": {
    "en": "Pause and check the offer through the game’s usual app; do not use this link to investigate.",
    "ms": "Berhenti dan semak tawaran melalui aplikasi permainan biasa; jangan siasat melalui pautan ini.",
    "zh": "先暂停，通过平时使用的游戏应用核实奖励，不要用这个链接调查。"
   },
   "urgencyReason": {
    "en": "YES: “5 minutes” and “NOW” demand immediate action.",
    "ms": "YES: “5 minit” dan “SEKARANG” meminta tindakan segera.",
    "zh": "YES：“5分钟”和“立即”要求马上行动。"
   }
  },
  {
   "id": "discord_club",
   "platform": "Discord",
   "sender": "Ms Lina",
   "handle": "@mslina",
   "channel": "# coding-club",
   "context": {
    "en": "In this fictional case, Sam’s teacher already confirmed today’s session in class. This is the class server and the same club address the teacher gave him.",
    "ms": "Dalam kes rekaan ini, guru Sam sudah mengesahkan sesi hari ini di kelas. Ini pelayan kelas dan alamat kelab sama yang diberi guru.",
    "zh": "在这个虚构案例中，老师已在课堂确认今天的活动。这是班级服务器，链接地址与老师提供的社团地址一致。"
   },
   "messages": [
    {
     "en": "Coding club starts in 10 minutes in Room 12. Please come now so we can start together.",
     "ms": "Kelab pengekodan bermula 10 minit lagi di Bilik 12. Sila datang sekarang supaya kita boleh mula bersama.",
     "zh": "编程社团10分钟后在12号教室开始。请现在过来，我们一起开始。"
    },
    {
     "en": "The project notes are on our usual club page. No sign-in details needed.",
     "ms": "Nota projek ada pada halaman kelab biasa. Tidak perlu maklumat log masuk.",
     "zh": "项目笔记在常用社团页面，不需要登录资料。"
    }
   ],
   "url": "school-club.example/notes",
   "preview": {
    "en": "Coding club · project notes",
    "ms": "Kelab pengekodan · nota projek",
    "zh": "编程社团 · 项目笔记"
   },
   "judgment": "genuine",
   "urgent": "yes",
   "reason": {
    "en": "Likely genuine is supported by the independent classroom confirmation and expected club context. Urgency and a link do not automatically make a message a scam.",
    "ms": "Mungkin sah disokong oleh pengesahan bebas di kelas dan konteks kelab dijangka. Desakan dan pautan tidak menjadikan mesej penipuan secara automatik.",
    "zh": "课堂中的独立确认和预期社团背景支持“很可能真实”。急迫和链接并不自动意味着诈骗。"
   },
   "next": {
    "en": "If anything differs from what the teacher confirmed, ask the teacher through the usual school route.",
    "ms": "Jika ada perbezaan daripada pengesahan guru, tanya melalui saluran sekolah biasa.",
    "zh": "如果内容与老师确认的不一致，通过常用学校渠道询问老师。"
   },
   "urgencyReason": {
    "en": "YES: it asks Sam to come now. This is an example of urgency with a genuine reason.",
    "ms": "YES: ia meminta Sam datang sekarang. Ini contoh desakan dengan sebab sah.",
    "zh": "YES：它要求 Sam 现在过来。这说明急迫也可能有真实理由。"
   }
  },
  {
   "id": "instagram_account",
   "platform": "Instagram",
   "sender": "Account Review",
   "handle": "@account.review_help",
   "channel": "Direct messages",
   "context": {
    "en": "A new account sends Sam a private message claiming to be platform support. Sam has not independently checked this claim.",
    "ms": "Akaun baharu menghantar mesej peribadi mengaku sokongan platform. Sam belum menyemak dakwaan secara bebas.",
    "zh": "一个新账户私信 Sam，声称自己是平台客服。Sam 尚未独立核实这一说法。"
   },
   "messages": [
    {
     "en": "⚠ Your account has been reported. It will be removed in 30 minutes unless you appeal.",
     "ms": "⚠ Akaun anda dilaporkan. Ia akan dibuang dalam 30 minit jika anda tidak merayu.",
     "zh": "⚠ 你的账户被举报。如果不申诉，30分钟后将被移除。"
    },
    {
     "en": "Use our secure review page below and enter your password to keep your account.",
     "ms": "Gunakan halaman semakan selamat di bawah dan masukkan kata laluan untuk mengekalkan akaun.",
     "zh": "使用下面的安全审核页面，输入密码以保留账户。"
    }
   ],
   "url": "account-review.example/appeal",
   "preview": {
    "en": "Account protection centre",
    "ms": "Pusat perlindungan akaun",
    "zh": "账户保护中心"
   },
   "judgment": "scam",
   "urgent": "yes",
   "reason": {
    "en": "The unverified support claim, threatened account loss and request for a password through a supplied link support suspected scam. A professional-looking profile is not verification.",
    "ms": "Dakwaan sokongan belum disahkan, ancaman kehilangan akaun dan permintaan kata laluan melalui pautan menyokong syak penipuan. Profil profesional bukan pengesahan.",
    "zh": "未经核实的客服身份、失去账户的威胁，以及通过所给链接索取密码，都支持“疑似诈骗”。专业外观不等于身份核实。"
   },
   "next": {
    "en": "Open the real app yourself and check its account/help area. Ask a trusted adult if unsure; do not enter a password through this message.",
    "ms": "Buka sendiri aplikasi sebenar dan semak bahagian akaun/bantuan. Tanya orang dewasa dipercayai jika tidak pasti; jangan masukkan kata laluan melalui mesej ini.",
    "zh": "自行打开真正的应用并检查账户或帮助区域。不确定时向可信成人求助，不通过这条消息输入密码。"
   },
   "urgencyReason": {
    "en": "YES: threatened removal in 30 minutes creates urgency and fear.",
    "ms": "YES: ancaman dibuang dalam 30 minit mencipta desakan dan ketakutan.",
    "zh": "YES：30分钟内删除账户的威胁制造了急迫与恐惧。"
   }
  },
  {
   "id": "instagram_art",
   "platform": "Instagram",
   "sender": "School Art Club",
   "handle": "@school.artclub",
   "channel": "Club chat",
   "context": {
    "en": "For this fictional example, the teacher confirmed this showcase and the club page in class. The message contains the same date and location.",
    "ms": "Bagi contoh rekaan ini, guru mengesahkan pameran dan halaman kelab di kelas. Mesej mengandungi tarikh dan lokasi sama.",
    "zh": "在这个虚构示例中，老师已在课堂确认展览和社团页面。消息的日期和地点与之相符。"
   },
   "messages": [
    {
     "en": "Our art showcase is next Friday in the school hall. Bring a drawing if you would like to share one. 🎨",
     "ms": "Pameran seni kita Jumaat depan di dewan sekolah. Bawa lukisan jika mahu berkongsi. 🎨",
     "zh": "美术展下周五在学校礼堂举行。愿意分享的话，可以带一幅画。🎨"
    },
    {
     "en": "You can read the information on the usual club page whenever you have time.",
     "ms": "Anda boleh membaca maklumat pada halaman kelab biasa apabila ada masa.",
     "zh": "有时间时可以到常用社团页面阅读信息。"
    }
   ],
   "url": "school-art.example/showcase",
   "preview": {
    "en": "School showcase · next Friday",
    "ms": "Pameran sekolah · Jumaat depan",
    "zh": "学校展览 · 下周五"
   },
   "judgment": "genuine",
   "urgent": "no",
   "reason": {
    "en": "The independently confirmed event and matching details support likely genuine in this context. The page address and friendly tone alone would not prove it.",
    "ms": "Acara disahkan secara bebas dan butiran sepadan menyokong mungkin sah dalam konteks ini. Alamat halaman dan nada mesra sahaja tidak membuktikannya.",
    "zh": "独立确认过的活动和一致细节支持此背景下“很可能真实”。仅凭页面地址或友好语气则不能证明。"
   },
   "next": {
    "en": "Use the usual school/club route for information. Ask the teacher if a later message requests unexpected details or changes the plan.",
    "ms": "Gunakan saluran sekolah/kelab biasa. Tanya guru jika mesej kemudian meminta maklumat tidak dijangka atau mengubah rancangan.",
    "zh": "使用常用学校或社团渠道查看信息。如果后来消息索取意外资料或改变计划，请问老师。"
   },
   "urgencyReason": {
    "en": "NO: naming next Friday gives information; “whenever you have time” does not demand immediate action.",
    "ms": "NO: menyebut Jumaat depan memberi maklumat; “apabila ada masa” tidak meminta tindakan segera.",
    "zh": "NO：提到下周五是在告知日期，“有时间时”没有要求立即行动。"
   }
  },
  {
   "id": "snapchat_friend",
   "platform": "Snapchat",
   "sender": "Maya ✨",
   "handle": "maya_new_27",
   "channel": "Chat",
   "context": {
    "en": "An unfamiliar new account claims to be Sam’s friend Maya. He has not checked this with Maya using their usual contact.",
    "ms": "Akaun baharu tidak dikenali mengaku rakan Sam, Maya. Dia belum menyemak dengan Maya melalui hubungan biasa.",
    "zh": "一个不熟悉的新账户声称是 Sam 的朋友 Maya。他尚未通过平时的联系方式向 Maya 核实。"
   },
   "messages": [
    {
     "en": "Hey, it’s Maya on a new account. Help me recover my account by sending me the six-digit sign-in code you receive.",
     "ms": "Hai, ini Maya pada akaun baharu. Bantu pulihkan akaun saya dengan menghantar kod log masuk enam digit yang anda terima.",
     "zh": "嘿，我是 Maya，这是新账户。把你收到的六位登录验证码发给我，帮我找回账户。"
    },
    {
     "en": "A real friend would help me. You can do it when you’re ready — use this page.",
     "ms": "Rakan sebenar akan membantu. Buat apabila bersedia — gunakan halaman ini.",
     "zh": "真正的朋友会帮我的。准备好了再做就行——用这个页面。"
    }
   ],
   "url": "friend-verify.example/code",
   "preview": {
    "en": "Friend recovery request",
    "ms": "Permintaan pemulihan rakan",
    "zh": "朋友的恢复请求"
   },
   "judgment": "scam",
   "urgent": "no",
   "reason": {
    "en": "The request for Sam’s sign-in code and unverified identity support suspected impersonation. It also uses friendship pressure. A message can be dangerous without demanding immediate action.",
    "ms": "Permintaan kod log masuk Sam dan identiti belum disahkan menyokong syak penyamaran. Ia juga menggunakan tekanan persahabatan. Mesej boleh berbahaya tanpa mendesak tindakan segera.",
    "zh": "索取 Sam 的登录验证码和未经核实的身份支持“疑似冒充”。它还利用友情施压。消息即使不催促立即行动，也可能有危险。"
   },
   "next": {
    "en": "Do not share the code. Contact Maya using the route Sam already knows and ask a trusted adult for help.",
    "ms": "Jangan kongsi kod. Hubungi Maya melalui saluran yang sudah dikenali Sam dan minta bantuan orang dewasa dipercayai.",
    "zh": "不要分享验证码。用 Sam 已知的联系方式联系 Maya，并向可信成人求助。"
   },
   "urgencyReason": {
    "en": "NO to immediate urgency: it says “when you’re ready”. There is social pressure, but no demand to act now. The code request remains a warning sign.",
    "ms": "NO bagi desakan segera: ia menyebut “apabila bersedia”. Ada tekanan sosial, tetapi tiada permintaan bertindak sekarang. Permintaan kod masih tanda amaran.",
    "zh": "对立即催促回答 NO：它说“准备好了再做”。存在社交压力，但没有要求马上行动。索取验证码仍是警示。"
   }
  },
  {
   "id": "snapchat_bus",
   "platform": "Snapchat",
   "sender": "Alex",
   "handle": "alex_classmate",
   "channel": "Forwarded message",
   "context": {
    "en": "Alex forwards a message from someone else. Sam has not received confirmation from a teacher and does not know the forwarded message’s original sender.",
    "ms": "Alex memajukan mesej orang lain. Sam belum mendapat pengesahan guru dan tidak mengetahui penghantar asal.",
    "zh": "Alex 转发了别人的消息。Sam 没有得到老师确认，也不知道原发送者是谁。"
   },
   "messages": [
    {
     "en": "Someone sent this: “The school bus is leaving in five minutes. Come to the side gate NOW.”",
     "ms": "Seseorang menghantar ini: “Bas sekolah bertolak lima minit lagi. Datang ke pagar tepi SEKARANG.”",
     "zh": "有人发来这个：“校车五分钟后出发。立即到侧门来。”"
    },
    {
     "en": "Here’s the update link. I don’t know whether the school sent it — have you heard anything?",
     "ms": "Ini pautan kemas kini. Saya tidak tahu sama ada sekolah menghantarnya — anda ada dengar apa-apa?",
     "zh": "这是更新链接。我不知道是不是学校发的——你听说了吗？"
    }
   ],
   "url": "transport-update.example/gate",
   "preview": {
    "en": "Forwarded transport update",
    "ms": "Kemas kini pengangkutan dipanjangkan",
    "zh": "转发的交通更新"
   },
   "judgment": "unknown",
   "urgent": "yes",
   "reason": {
    "en": "There is not enough information to decide. A real transport change could be urgent, but forwarding does not verify the original sender or the new location. Do not mark a message genuine just because it mentions school.",
    "ms": "Maklumat tidak cukup untuk memutuskan. Perubahan pengangkutan sebenar boleh mendesak, tetapi pemajuan tidak mengesahkan penghantar atau lokasi baharu. Jangan anggap sah hanya kerana menyebut sekolah.",
    "zh": "信息不足以判断。真实交通变动可能很急迫，但转发不能核实原发送者或新地点。不能仅因提到学校就判为真实。"
   },
   "next": {
    "en": "Check with a teacher or school reception using the usual route before following the instruction or link.",
    "ms": "Semak dengan guru atau kaunter sekolah melalui saluran biasa sebelum mengikut arahan atau pautan.",
    "zh": "按指令行动或使用链接前，通过常用渠道向老师或学校接待处核实。"
   },
   "urgencyReason": {
    "en": "YES: “five minutes” and “NOW” demand immediate action. That tells us urgency, not who sent it.",
    "ms": "YES: “lima minit” dan “SEKARANG” meminta tindakan segera. Itu menunjukkan desakan, bukan identiti penghantar.",
    "zh": "YES：“五分钟”和“立即”要求马上行动。这说明急迫性，不说明发送者身份。"
   }
  }
 ]
};

const mainField=(base,n=1)=>n===1?base:base+n;
const MAIN1_FLOW=[0,1,2,3,4,'question-lab',5,6,7,9,10,11,12,'extensions',13,14,15];
GROUPS[2]=B('Main Task 1','Tugasan Utama 1','主任务一');
for(let i=2;i<=8;i++)CARDS[i].group=2;
CARDS[2].title=MAIN1.steps[0].label;CARDS[2].read=[MAIN1.aIntro];CARDS[2].type='gallery';
CARDS[3].title=MAIN1.steps[1].label;CARDS[3].read=[MAIN1.bIntro];CARDS[3].type='main-rule';
CARDS[3].questions.push(FIELD.readPrediction);
CARDS[4].title=MAIN1.steps[2].label;
CARDS[5].title=MAIN1.steps[4].label;CARDS[5].read=[MAIN1.eIntro];
CARDS[6].title=MAIN1.steps[5].label;CARDS[6].read=[MAIN1.fIntro];
CARDS[7].title=MAIN1.steps[6].label;
for(const sample of MAIN1.cases){
 const prefix='social_'+sample.id;
 const feedback={};
 for(const choice of ['scam','genuine','unknown'])feedback[choice]=B(...['en','ms','zh'].map(l=>(choice===sample.judgment?MAIN1.judgments[sample.judgment][l]+'. ':({en:'Compare your judgment with the context. ',ms:'Bandingkan penilaian dengan konteks. ',zh:'请把判断与背景比较。'})[l])+sample.reason[l]+' '+sample.next[l]));
 CARDS[2].questions.push(Q(prefix+'_judgment',MAIN1.judgment,Object.entries(MAIN1.judgments).map(([value,label])=>({value,label})),{answer:sample.judgment,feedback:feedback[sample.judgment],choiceFeedback:feedback}));
 CARDS[2].questions.push(Q(prefix+'_urgent',MAIN1.urgency,YESNO,{answer:sample.urgent,feedback:sample.urgencyReason}));
 CARDS[2].questions.push(Q(prefix+'_reason',MAIN1.reason,null,{review:B(...['en','ms','zh'].map(l=>sample.reason[l]+' '+sample.next[l]))}));
 for(const suffix of ['judgment','urgent','reason'])FIELD[prefix+'_'+suffix].prompt=B(...['en','ms','zh'].map(l=>`${sample.platform} · ${sample.sender} · ${FIELD[prefix+'_'+suffix].prompt[l]}`));
}
const QUESTION_LAB={id:'question-lab',group:2,title:MAIN1.steps[3].label,read:[MAIN1.dIntro],type:'question-lab',questions:[Q('questionLab',MAIN1.labPrompt,null,{review:MAIN1.labReview})]};
RISKS.pressure={name:B('Pressure to act immediately','Desakan bertindak segera','催促立即行动'),read:B('Ask about a demand to act now, not just a date. Urgency can occur in genuine and fake messages.','Tanya tentang desakan bertindak sekarang, bukan tarikh sahaja. Desakan boleh berlaku dalam mesej sah dan palsu.','询问是否要求立即行动，而不是只看日期。真实和虚假消息都可能急迫。'),question:UI.modelQuestion};
BRIEF.risks.pressure={clue:B('“ACT NOW” and “expires today” put Sam under time pressure.','“BERTINDAK SEKARANG” dan “tamat hari ini” memberi Sam desakan masa.','“立即行动”和“今天到期”给 Sam 造成时间压力。'),think:B('What should Sam verify before responding to the deadline? A real deadline still needs context.','Apakah yang Sam patut sahkan sebelum mengikut tempoh itu? Tarikh akhir sebenar masih memerlukan konteks.','Sam 回应期限前应该核实什么？真实截止时间也需要结合背景。')};
FIELD.risk.options=Object.entries(RISKS).map(([value,r])=>({value,label:r.name}));
FIELD.risk.prompt=B('Choose the warning sign for this check.','Pilih tanda amaran untuk semakan ini.','选择这一项检查的警示。');
CARDS[5].questions.push(Q('questionMeaning',MAIN1.polarity,null,{hint:MAIN1.polarityHint}));
for(let n=2;n<=3;n++){
 for(const [index,bases]of [[5,['risk','draftQuestion','questionMeaning']],[6,['draftYes','draftNo']],[7,['criterionInput','criterionOutput']],[9,['order']],[10,['description']],[12,['improvement']]]){
  for(const base of bases){const original=FIELD[base]||{prompt:B('Instruction order','Urutan arahan','指令顺序')};CARDS[index].questions??=[];CARDS[index].questions.push(Q(mainField(base,n),B(...['en','ms','zh'].map(l=>`${({en:'Check',ms:'Semakan',zh:'检查'})[l]} ${n} · ${original.prompt[l]}`)),original.options||null,{hint:original.hint}));}
 }
}
// Use all completed question plans and the gallery as later reflection evidence.
for(const check of REFLECTION.checks){
 const existing=[...check.after];for(const id of existing)if(['draftQuestion','draftYes','draftNo','order','description','improvement','criterionInput','criterionOutput','risk'].includes(id))check.after.push(id+'2',id+'3');
 if(['k1','u1','u2'].includes(check.id))for(const sample of MAIN1.cases)check.after.push('social_'+sample.id+'_reason');
 if(check.id==='s1')check.after.push('questionLab');
}
UI.wagba=B('Plan a message helper for Sam: ask focused questions, give YES/NO advice, test each check and improve the plan.','Rancang pembantu mesej untuk Sam: tanya soalan berfokus, beri nasihat YES/NO, uji setiap semakan dan baiki pelan.','为 Sam 规划消息助手：提出聚焦问题，给出 YES/NO 建议，测试每项检查并改进计划。');
// Shared outcome: one manageable decision at a time, developed into a short series.
UI.outcome=LEARNING.outcome=STARTER.outcome=B('Plan a short series of checks that helps Sam decide what to verify before acting on a message. Begin with one focused YES/NO question; add up to two more about different signs. For every question you keep, write both advice outputs, order the instructions, predict and test YES and NO, and explain a revision or review. Your plan prepares you to write Python next lesson.','Rancang siri semakan ringkas yang membantu Sam menentukan apa perlu disahkan sebelum bertindak atas mesej. Mulakan dengan satu soalan YES/NO berfokus; tambah sehingga dua lagi tentang tanda berbeza. Bagi setiap soalan yang dikekalkan, tulis kedua-dua output nasihat, susun arahan, ramal dan uji YES dan NO, serta terangkan pindaan atau semakan. Pelan ini menyediakan anda untuk Python pada pelajaran seterusnya.','规划一组简短检查，帮助 Sam 决定对消息采取行动前应核实什么。从一个聚焦的 YES/NO 问题开始，最多再加两个检查不同警示的问题。保留的每个问题都要写两条建议、排列指令、预测并测试 YES 和 NO，并解释一次修改或复查。计划为下节课编写 Python 作准备。');
REFLECTION.purpose=B('WAGBA: turn Sam’s real problem into a clear, testable message-helper plan. Use these same knowledge, skills and understanding checks for each question you develop. Point to the particular question, outputs or tests that support your judgment; your progress may differ between planned checks.','WAGBA: tukarkan masalah sebenar Sam kepada pelan pembantu mesej yang jelas dan boleh diuji. Gunakan semakan pengetahuan, kemahiran dan pemahaman yang sama bagi setiap soalan yang dibina. Rujuk soalan, output atau ujian tertentu yang menyokong penilaian; kemajuan mungkin berbeza antara semakan yang dirancang.','WAGBA：把 Sam 的实际问题转成清晰、可测试的消息助手计划。为每个问题使用相同的知识、技能与理解检查。指出支持判断的具体问题、输出或测试；不同检查中的进步可能不同。');
BRIEF.scope=B('Plan useful advice about observable warning signs. Start with Sam’s reward message and use 1A to consider other situations. In 1E you can plan up to three separate questions; the person answers each one. Each rule selects advice, without inspecting links or proving a message safe.','Rancang nasihat berguna tentang tanda amaran yang boleh diperhatikan. Mulakan dengan mesej ganjaran Sam dan gunakan 1A untuk situasi lain. Dalam 1E anda boleh merancang sehingga tiga soalan berasingan; pengguna menjawab setiap soalan. Setiap peraturan memilih nasihat, tanpa memeriksa pautan atau membuktikan mesej selamat.','针对可观察警示规划有用建议。从 Sam 的奖励消息开始，用1A考虑其他情境。在1E最多规划三个独立问题，由人逐一回答。每条规则选择建议，不检查链接，也不证明消息安全。');
CARDS[3].words=['pseudocode','IPO','condition','trace'];
CARDS[3].questions.push(Q('ruleExplanation',B('Explain the rule in your own words: what is its INPUT, what does IF compare, and which OUTPUT is used for YES and for NO? Explain why the other output is skipped.','Terangkan peraturan dengan kata sendiri: apakah INPUT, apa dibandingkan oleh IF, dan OUTPUT mana digunakan bagi YES dan NO? Terangkan mengapa output lain dilangkau.','用自己的话解释规则：INPUT 是什么？IF 比较什么？YES 和 NO 分别使用哪个 OUTPUT？解释为什么跳过另一条输出。'),null,{hint:MAIN1.bMeaning}));
for(const check of REFLECTION.checks)if(['k2','k3','s2'].includes(check.id))check.after.push('ruleExplanation');
MAIN1.planNote=B('Begin with Check 1. Add Check 2 and Check 3 to ask about different signs. Each keeps its own question, advice, instructions and tests. For every question you keep, finish 1E–1G and Main Task 2. Use the tabs to return to it. A dot marks a question you have written.','Mulakan dengan Semakan 1. Tambah Semakan 2 dan 3 bagi tanda berbeza. Setiap satu menyimpan soalan, nasihat, arahan dan ujian sendiri. Bagi setiap soalan yang dikekalkan, lengkapkan 1E–1G dan Tugasan Utama 2. Gunakan tab untuk kembali. Titik menandakan soalan yang sudah ditulis.','从检查1开始，添加检查2、3来询问不同警示。每项分别保存问题、建议、指令和测试。保留的每个问题都要完成1E–1G与主任务二。用标签返回该项，小圆点表示已写出问题。');
BRIEF.job=B('A small message helper asks Sam focused YES/NO questions and gives advice for each answer. Sam reads the message; the helper uses his answers. It does not open links or collect passwords.','Pembantu mesej kecil bertanya soalan YES/NO berfokus dan memberi nasihat bagi setiap jawapan. Sam membaca mesej; pembantu menggunakan jawapannya. Ia tidak membuka pautan atau mengumpul kata laluan.','小型消息助手向 Sam 提出聚焦的 YES/NO 问题，并根据各个答案给出建议。Sam 阅读消息，助手使用他的回答，不打开链接或收集密码。');
BRIEF.choiceIntro=B('Choose a first warning sign to investigate. Use a clue from Sam’s message to explain why this check matters. In 1E, develop this question and add other focused checks if useful.','Pilih tanda amaran pertama untuk disiasat. Gunakan petunjuk mesej Sam untuk menerangkan kepentingan semakan. Dalam 1E, bina soalan ini dan tambah semakan lain jika berguna.','先选择一种要研究的警示，用 Sam 消息中的线索解释为什么需要这项检查。在1E发展这个问题，并按需要添加其他聚焦检查。');
CARDS[7].read=[B('A success criterion is an observable result, not “my program is good”. For the selected check, choose an input and write the exact advice you expect. Then explain aloud what the other answer should display. In Main Task 2, record tests of BOTH answers for every question you keep.','Kriteria kejayaan ialah hasil yang boleh diperhatikan, bukan “program saya bagus”. Bagi semakan dipilih, pilih input dan tulis nasihat tepat yang dijangka. Kemudian terangkan secara lisan output jawapan lain. Dalam Tugasan Utama 2, rekod ujian KEDUA-DUA jawapan bagi setiap soalan yang dikekalkan.','成功标准是可观察的结果，不是“我的程序很好”。为当前检查选择一个输入，写出预期的准确建议，再口头解释另一种答案应显示什么。主任务二中，要为保留的每个问题记录两种答案的测试。')];
MAIN1.polarityHint=B('For this warning-sign pattern, phrase the question so YES reports that sign: “YES means the person noticed ___. NO means they did not report ___. Neither answer tells us ___.” If you ask “Have you verified the sender?”, YES has a different meaning: you must change the advice to match.','Bagi corak tanda amaran ini, tulis soalan supaya YES melaporkan tanda itu: “YES bermaksud pengguna menyedari ___. NO bermaksud mereka tidak melaporkan ___. Kedua-duanya tidak memberitahu kita ___.” Jika bertanya “Sudahkah anda mengesahkan penghantar?”, YES bermakna lain: ubah nasihat supaya sepadan.','在这个警示模式中，让 YES 表示报告该警示：“YES 表示注意到___，NO 表示没有报告___，两者都不能说明___。”如果问“你核实过发送者了吗？”，YES 的含义就不同，必须相应修改建议。');
for(let n=1;n<=3;n++)FIELD[mainField('questionMeaning',n)].hint=MAIN1.polarityHint;

const MAIN2={
 "steps": [
  {
   "dest": "pseudocode",
   "label": {
    "en": "2A · Meet pseudocode",
    "ms": "2A · Kenali pseudokod",
    "zh": "2A · 认识伪代码"
   }
  },
  {
   "dest": "worked-checkers",
   "label": {
    "en": "2B · Read three checkers",
    "ms": "2B · Baca tiga penyemak",
    "zh": "2B · 阅读三个检查器"
   }
  },
  {
   "dest": "sequence-lab",
   "label": {
    "en": "2C · Practise sequence",
    "ms": "2C · Latih urutan",
    "zh": "2C · 练习顺序"
   }
  },
  {
   "dest": 9,
   "label": {
    "en": "2D · Write your plan",
    "ms": "2D · Tulis pelan anda",
    "zh": "2D · 写出计划"
   }
  },
  {
   "dest": 10,
   "label": {
    "en": "2E · Explain your plan",
    "ms": "2E · Terangkan pelan",
    "zh": "2E · 解释计划"
   }
  },
  {
   "dest": 11,
   "label": {
    "en": "2F · Partner walkthrough",
    "ms": "2F · Semakan bersama rakan",
    "zh": "2F · 同伴逐行检查"
   }
  },
  {
   "dest": 12,
   "label": {
    "en": "2G · Improve and revisit",
    "ms": "2G · Baiki dan semak semula",
    "zh": "2G · 改进并复查"
   }
  }
 ],
 "intro": {
  "en": "Pseudocode is a readable plan of instructions for a program. It combines familiar words with a few agreed symbols. A person can follow it before anyone writes Python. Today: learn the notation, read different checkers, practise putting instructions in order, then write and review your own plan from Main Task 1.",
  "ms": "Pseudokod ialah pelan arahan program yang mudah dibaca. Ia menggabungkan perkataan biasa dengan beberapa simbol yang dipersetujui. Manusia boleh mengikutinya sebelum Python ditulis. Hari ini: pelajari notasi, baca penyemak berbeza, latih susunan arahan, kemudian tulis dan semak pelan sendiri daripada Tugasan Utama 1.",
  "zh": "伪代码是易读的程序指令计划，结合常用词语和约定符号。编写 Python 前，人可以先执行它。今天先认识符号、阅读不同检查器、练习排列指令，再根据主任务一编写和检查自己的计划。"
 },
 "aqa": {
  "en": "We are borrowing a small part of AQA’s GCSE pseudocode style to make our plans consistent. This is a first KS3 lesson, not an exam task. AQA uses its own notation in assessment questions; students’ own pseudocode should make the steps clear and unambiguous. You do not need every symbol in the full guide today.",
  "ms": "Kita menggunakan sebahagian kecil gaya pseudokod GCSE AQA supaya pelan konsisten. Ini pelajaran pertama KS3, bukan tugasan peperiksaan. AQA menggunakan notasinya dalam soalan penilaian; pseudokod pelajar perlu menunjukkan langkah dengan jelas tanpa kekaburan. Anda tidak perlu semua simbol dalam panduan penuh hari ini.",
  "zh": "我们借用 AQA GCSE 伪代码中的一小部分写法，让计划保持一致。这是 KS3 的入门课，不是考试任务。AQA 在试题中使用自己的记法；学生的伪代码应让步骤清晰、没有歧义。今天不需要学习完整指南中的全部符号。"
 },
 "source": {
  "en": "AQA pseudocode guide",
  "ms": "Panduan pseudokod AQA",
  "zh": "AQA 伪代码指南"
 },
 "notationTitle": {
  "en": "Read the code as a sentence",
  "ms": "Baca kod sebagai ayat",
  "zh": "把代码读成一句话"
 },
 "notation": [
  [
   "OUTPUT 'Does the message rush you?'",
   {
    "en": "Display this question. Text in quotes is shown to the person. OUTPUT can ask a question as well as give advice.",
    "ms": "Paparkan soalan ini. Teks dalam petikan ditunjukkan kepada pengguna. OUTPUT boleh bertanya soalan serta memberi nasihat.",
    "zh": "显示这个问题。引号内的文字会展示给使用者。OUTPUT 既可显示问题，也可给出建议。"
   }
  ],
  [
   "urgent ← USERINPUT",
   {
    "en": "Receive the typed answer and store it in urgent. The arrow means “store in”; urgent is a named place for a value. The person reads the message; the program receives the answer.",
    "ms": "Terima jawapan yang ditaip dan simpan dalam urgent. Anak panah bermaksud “simpan dalam”; urgent ialah tempat bernama bagi nilai. Pengguna membaca mesej; program menerima jawapan.",
    "zh": "接收输入的答案，保存到 urgent。箭头表示“存入”；urgent 是有名称的存储位置。人阅读消息，程序接收答案。"
   }
  ],
  [
   "IF urgent = 'YES' THEN",
   {
    "en": "Compare the stored text with YES. If they match, the condition is TRUE and the indented instructions after THEN are followed. = compares here; it does not store a value.",
    "ms": "Bandingkan teks tersimpan dengan YES. Jika sepadan, syarat TRUE dan arahan berinden selepas THEN diikuti. = membuat perbandingan di sini; ia tidak menyimpan nilai.",
    "zh": "把保存的文字与 YES 比较。相同时，条件为 TRUE，执行 THEN 后缩进的指令。这里的 = 用来比较，不是保存值。"
   }
  ],
  [
   "ELSE",
   {
    "en": "If the condition is FALSE, skip the first branch and use this alternative. ELSE is not an instruction to display both pieces of advice.",
    "ms": "Jika syarat FALSE, langkau cabang pertama dan gunakan pilihan ini. ELSE bukan arahan memaparkan kedua-dua nasihat.",
    "zh": "条件为 FALSE 时，跳过第一条分支，使用另一条路径。ELSE 不表示把两条建议都显示。"
   }
  ],
  [
   "ENDIF",
   {
    "en": "End this choice and continue with the next instruction, if there is one. ENDIF does not end the whole program automatically.",
    "ms": "Tamatkan pilihan ini dan teruskan arahan berikutnya jika ada. ENDIF tidak menamatkan seluruh program secara automatik.",
    "zh": "结束这次选择，如果后面还有指令就继续。ENDIF 不会自动结束整个程序。"
   }
  ],
  [
   "    OUTPUT 'Pause and verify.'",
   {
    "en": "Indentation shows which instructions belong to a branch. Quotes mark the advice text. Capital keywords make the structure easy to spot.",
    "ms": "Inden menunjukkan arahan yang tergolong dalam cabang. Petikan menandakan teks nasihat. Kata kunci huruf besar memudahkan struktur dikenal pasti.",
    "zh": "缩进显示哪些指令属于分支，引号标出建议文字。大写关键字让结构更容易辨认。"
   }
  ]
 ],
 "boolean": {
  "en": "YES and NO are the person’s answers. TRUE and FALSE are the results of comparing a value with a condition. For urgent = YES, the condition urgent = 'YES' is TRUE. For urgent = NO, it is FALSE. FALSE does not mean “fake”, and TRUE does not mean “safe”. A genuine school reminder can be urgent; a scam can avoid urgent language.",
  "ms": "YES dan NO ialah jawapan pengguna. TRUE dan FALSE ialah hasil membandingkan nilai dengan syarat. Bagi urgent = YES, syarat urgent = 'YES' adalah TRUE. Bagi urgent = NO, ia FALSE. FALSE tidak bermaksud “palsu”, dan TRUE tidak bermaksud “selamat”. Peringatan sekolah yang sah boleh mendesak; penipuan boleh mengelakkan bahasa mendesak.",
  "zh": "YES 和 NO 是人的答案，TRUE 和 FALSE 是比较条件所得的结果。urgent 为 YES 时，urgent = 'YES' 的结果为 TRUE；urgent 为 NO 时，结果为 FALSE。FALSE 不等于“假消息”，TRUE 不等于“安全”。真实学校提醒可能急迫，诈骗也可能不催促。"
 },
 "contract": {
  "en": "For these first plans, ask the person to type exactly YES or NO. UNSURE, blank input and other spellings need a separate design; do not silently treat them as NO. A person who is unsure should pause and verify instead of guessing. Pseudocode here is read by people, not executed as Python.",
  "ms": "Untuk pelan pertama ini, minta pengguna menaip tepat YES atau NO. UNSURE, input kosong dan ejaan lain memerlukan reka bentuk berasingan; jangan anggap semuanya NO secara senyap. Pengguna yang tidak pasti patut berhenti dan mengesahkan, bukan meneka. Pseudokod di sini dibaca manusia, bukan dilaksanakan sebagai Python.",
  "zh": "这些入门计划要求准确输入 YES 或 NO。UNSURE、空白和其他拼法需要另行设计，不可默默当作 NO。不确定的人应暂停核实，而不是猜测。这里的伪代码由人阅读，不作为 Python 执行。"
 },
 "bIntro": {
  "en": "Study three different checkers. Each has a focused question and two useful advice branches. For each message, choose the person’s answer, decide whether the IF condition is TRUE or FALSE, and select the appropriate advice. Explain why the advice helps in that context. Then step through the model to check your reasoning.",
  "ms": "Kaji tiga penyemak berbeza. Setiap satu mempunyai soalan berfokus dan dua cabang nasihat berguna. Bagi setiap mesej, pilih jawapan pengguna, tentukan syarat IF TRUE atau FALSE, dan pilih nasihat sesuai. Terangkan bagaimana nasihat membantu dalam konteks itu. Kemudian ikuti model langkah demi langkah untuk menyemak alasan.",
  "zh": "研究三个不同检查器。每个有一个聚焦问题和两条有用建议分支。对每条消息，选择人的答案，判断 IF 条件为 TRUE 还是 FALSE，再选合适建议。解释它如何帮助当前情境中的人，然后逐行执行示例检查推理。"
 },
 "cIntro": {
  "en": "Practise three sequences before writing your own. Move the instruction cards with the arrows, read them from top to bottom, and explain why that order works. A sequence tells us what happens first and next; selection chooses a branch. You may compare a model after trying, but record when an example helped you.",
  "ms": "Latih tiga urutan sebelum menulis sendiri. Gerakkan kad arahan dengan anak panah, baca dari atas ke bawah, dan terangkan sebab susunan itu berfungsi. Urutan menentukan perkara pertama dan seterusnya; pemilihan memilih cabang. Anda boleh membandingkan model selepas mencuba, tetapi rekod apabila contoh membantu.",
  "zh": "自己编写前先练习三组顺序。用箭头移动指令卡，从上到下阅读，解释为什么这样排列。顺序决定先做什么、再做什么；选择决定执行哪条分支。尝试后可对照示例，但应记录是否借助了示例。"
 },
 "dIntro": {
  "en": "Turn the questions and advice you wrote in 1E–1G into pseudocode. Work on one check at a time. Display your question, receive the answer, compare it, give one appropriate output and end the choice. You can build an editable starting draft from your own words or write directly. Read every line and improve it; a filled template is not evidence that you can explain it.",
  "ms": "Tukar soalan dan nasihat 1E–1G kepada pseudokod. Bina satu semakan pada satu masa. Paparkan soalan, terima jawapan, bandingkan, beri satu output sesuai dan tamatkan pilihan. Anda boleh bina draf boleh sunting daripada kata sendiri atau tulis terus. Baca dan baiki setiap baris; templat terisi bukan bukti anda boleh menerangkannya.",
  "zh": "把1E–1G中的问题和建议转成伪代码。一次完成一项检查：显示问题、接收答案、比较、给出一条合适输出、结束选择。可用自己的文字创建可编辑草稿，也可直接编写。逐行阅读并改进；填好模板不代表已经能解释。"
 },
 "eIntro": {
  "en": "Explain your plan to someone who has not seen Main Task 1. Point to where the question is displayed, where the answer is stored, what the condition compares and which advice each answer selects. If you use several checks, explain why the next question still matters after a NO.",
  "ms": "Terangkan pelan kepada seseorang yang belum melihat Tugasan Utama 1. Tunjukkan tempat soalan dipaparkan, jawapan disimpan, syarat dibandingkan dan nasihat dipilih. Jika ada beberapa semakan, terangkan mengapa soalan seterusnya masih penting selepas NO.",
  "zh": "向没看过主任务一的人解释计划。指出哪里显示问题、保存答案、比较条件，以及每个答案选择哪条建议。使用多个检查时，解释为什么回答 NO 后仍需要问下一个问题。"
 },
 "fIntro": {
  "en": "Give your pseudocode to a partner. One person is the user; the other acts as the computer and follows the written instructions literally. Choose one message and an answer, predict the advice, then read every line. Mark lines that are followed, skipped by the decision, or unclear. Record what was actually said and feedback about a specific line. Swap roles and try the other answer. This is what testing a plan means.",
  "ms": "Berikan pseudokod kepada rakan. Seorang menjadi pengguna; seorang lagi bertindak sebagai komputer dan mengikut arahan bertulis tepat. Pilih mesej dan jawapan, ramalkan nasihat, kemudian baca setiap baris. Tandakan baris diikuti, dilangkau oleh keputusan atau kurang jelas. Rekod perkara sebenar yang disebut dan maklum balas tentang baris tertentu. Tukar peranan dan cuba jawapan lain. Inilah maksud menguji pelan.",
  "zh": "把伪代码交给同伴。一人扮演使用者，另一人扮演计算机，严格按书面指令执行。选择消息和答案，先预测建议，再逐行阅读。标记执行的行、因判断而跳过的行或不清楚的行。记录实际读出的内容，并对具体行提出反馈。交换角色，尝试另一种答案。这就是测试计划的意思。"
 },
 "gIntro": {
  "en": "Use your partner’s line notes and feedback to improve a question, a condition, the order or the advice. Explain the change and why it helps. If the plan already worked, describe a wording check or a further challenge. Return to 2D to edit the pseudocode, then repeat the walkthrough for YES and NO.",
  "ms": "Gunakan nota baris dan maklum balas rakan untuk membaiki soalan, syarat, urutan atau nasihat. Terangkan perubahan dan manfaatnya. Jika pelan sudah berfungsi, huraikan semakan perkataan atau cabaran lanjut. Kembali ke 2D untuk menyunting pseudokod, kemudian ulang semakan bagi YES dan NO.",
  "zh": "根据同伴的逐行记录与反馈，改进问题、条件、顺序或建议。说明改了什么、为什么有帮助。已经正常时，可说明措辞复查或进一步挑战。返回2D修改伪代码，再分别用 YES 和 NO 逐行检查。"
 },
 "line": {
  "en": "Line",
  "ms": "Baris",
  "zh": "行"
 },
 "meaning": {
  "en": "What this means",
  "ms": "Maksudnya",
  "zh": "这是什么意思"
 },
 "chooseModel": {
  "en": "Checker examples",
  "ms": "Contoh penyemak",
  "zh": "检查器示例"
 },
 "inputQuestion": {
  "en": "What answer should the person give to THIS question, using the message and context?",
  "ms": "Apakah jawapan pengguna untuk soalan INI berdasarkan mesej dan konteks?",
  "zh": "根据消息与背景，人应怎样回答这个具体问题？"
 },
 "conditionQuestion": {
  "en": "With that answer stored, is the IF condition TRUE or FALSE?",
  "ms": "Dengan jawapan itu disimpan, adakah syarat IF TRUE atau FALSE?",
  "zh": "保存该答案后，IF 条件为 TRUE 还是 FALSE？"
 },
 "adviceQuestion": {
  "en": "Which advice should this checker display for that answer?",
  "ms": "Nasihat manakah patut dipaparkan bagi jawapan itu?",
  "zh": "这个答案应让检查器显示哪条建议？"
 },
 "whyAdvice": {
  "en": "Explain why the advice fits this message. Name a useful action and something the checker still cannot establish.",
  "ms": "Terangkan mengapa nasihat sesuai dengan mesej. Nyatakan tindakan berguna dan sesuatu yang masih tidak dapat dipastikan penyemak.",
  "zh": "解释建议为什么适合这条消息，指出一个有用行动和检查器仍无法确定的一件事。"
 },
 "unsafeAdvice": {
  "en": "This message is definitely safe. Open its link now.",
  "ms": "Mesej ini pasti selamat. Buka pautannya sekarang.",
  "zh": "这条消息肯定安全，立即打开链接。"
 },
 "modelWalk": {
  "en": "Walk through the model",
  "ms": "Ikuti model langkah demi langkah",
  "zh": "逐行执行示例"
 },
 "nextLine": {
  "en": "Next line",
  "ms": "Baris seterusnya",
  "zh": "下一行"
 },
 "restart": {
  "en": "Start this route again",
  "ms": "Mulakan laluan ini semula",
  "zh": "重新执行这条路径"
 },
 "sequenceCheck": {
  "en": "Check my sequence",
  "ms": "Semak urutan saya",
  "zh": "检查我的顺序"
 },
 "sequenceExplain": {
  "en": "Why must these instructions be in this order? Refer to input, the decision or the next question.",
  "ms": "Mengapa arahan perlu dalam susunan ini? Rujuk input, keputusan atau soalan seterusnya.",
  "zh": "为什么指令必须这样排列？请结合输入、判断或下一个问题说明。"
 },
 "sequenceModel": {
  "en": "Compare with a model order",
  "ms": "Bandingkan dengan urutan model",
  "zh": "对照示例顺序"
 },
 "sequenceGood": {
  "en": "This order follows the brief. Now explain why it works and trace the possible answers.",
  "ms": "Urutan ini mengikuti tugasan. Sekarang terangkan sebabnya dan jejak jawapan yang mungkin.",
  "zh": "顺序符合任务要求。现在解释原因，并执行可能的答案。"
 },
 "sequenceTry": {
  "en": "Re-read the brief. Ask before receiving; receive before comparing; keep each piece of advice inside its branch. In the two-check task, finish the first decision before asking the second question.",
  "ms": "Baca semula tugasan. Tanya sebelum menerima; terima sebelum membandingkan; kekalkan nasihat dalam cabangnya. Dalam tugasan dua semakan, tamatkan keputusan pertama sebelum soalan kedua.",
  "zh": "重读要求。先提问再接收，先接收再比较；建议应位于对应分支。双重检查中，结束第一个判断后再问第二个问题。"
 },
 "ownCode": {
  "en": "My pseudocode for this check",
  "ms": "Pseudokod saya bagi semakan ini",
  "zh": "这一项检查的伪代码"
 },
 "createDraft": {
  "en": "Make a starting draft from my question and advice",
  "ms": "Bina draf awal daripada soalan dan nasihat saya",
  "zh": "用我的问题和建议创建起始草稿"
 },
 "draftEmpty": {
  "en": "Write your question and BOTH pieces of advice in 1E/1F first, or write the pseudocode yourself here.",
  "ms": "Tulis soalan dan KEDUA-DUA nasihat dalam 1E/1F dahulu, atau tulis pseudokod sendiri di sini.",
  "zh": "先在1E/1F写出问题和两条建议，或直接在这里编写伪代码。"
 },
 "replaceDraft": {
  "en": "Replace this pseudocode with a fresh draft from your Main Task 1 answers? Your earlier wording remains in response history.",
  "ms": "Ganti pseudokod ini dengan draf baharu daripada jawapan Tugasan Utama 1? Perkataan terdahulu kekal dalam sejarah jawapan.",
  "zh": "用主任务一答案重新生成草稿并替换当前伪代码吗？先前文字仍保存在回答历史中。"
 },
 "combined": {
  "en": "Read my checks as one program plan",
  "ms": "Baca semakan saya sebagai satu pelan program",
  "zh": "把各项检查作为一个程序计划阅读"
 },
 "combinedNote": {
  "en": "Read Check 1, then Check 2, then Check 3 where written. Each question receives a fresh answer. ENDIF finishes one decision; the next check still follows. A NO does not approve the whole message. This preview shows your own writing, including any missing or unclear instructions.",
  "ms": "Baca Semakan 1, kemudian 2 dan 3 jika ditulis. Setiap soalan menerima jawapan baharu. ENDIF menamatkan satu keputusan; semakan seterusnya masih diikuti. NO tidak meluluskan seluruh mesej. Pratonton ini menunjukkan tulisan sendiri termasuk arahan hilang atau kabur.",
  "zh": "按顺序阅读已写的检查1、2、3。每个问题接收新答案；ENDIF 结束一次判断，之后仍执行下一项检查。NO 不代表整条消息通过。预览显示你实际写的内容，也保留遗漏或不清楚的指令。"
 },
 "pythonBridge": {
  "en": "Next lesson: OUTPUT becomes print(...), USERINPUT becomes input(...), and the comparison uses == in Python. Python uses if / else with colons and indentation instead of ENDIF. Today, make the plan clear enough for someone else to follow first.",
  "ms": "Pelajaran seterusnya: OUTPUT menjadi print(...), USERINPUT menjadi input(...), dan perbandingan menggunakan == dalam Python. Python menggunakan if / else dengan titik bertindih dan inden, bukan ENDIF. Hari ini, jelaskan pelan supaya orang lain boleh mengikutinya dahulu.",
  "zh": "下节课：OUTPUT 对应 print(...)，USERINPUT 对应 input(...)，Python 的比较使用 ==。Python 用 if / else、冒号和缩进，不使用 ENDIF。今天先把计划写得让别人能执行。"
 },
 "peerSetup": {
  "en": "1 · Choose the message and predict",
  "ms": "1 · Pilih mesej dan ramal",
  "zh": "1 · 选择消息并预测"
 },
 "peerLines": {
  "en": "2 · Follow every line together",
  "ms": "2 · Ikuti setiap baris bersama",
  "zh": "2 · 一起逐行执行"
 },
 "peerFeedback": {
  "en": "3 · Compare and give useful feedback",
  "ms": "3 · Bandingkan dan beri maklum balas berguna",
  "zh": "3 · 比较并提出有用反馈"
 },
 "peerRole": {
  "en": "Who is reviewing?",
  "ms": "Siapa menyemak?",
  "zh": "谁在检查？"
 },
 "peerModes": {
  "partner": {
   "en": "Partner: swap user/computer roles",
   "ms": "Rakan: tukar peranan pengguna/komputer",
   "zh": "同伴：交换使用者与计算机角色"
  },
  "solo": {
   "en": "On my own: read aloud in both roles",
   "ms": "Sendiri: baca kuat bagi kedua-dua peranan",
   "zh": "独自：分别扮演两种角色并读出"
  },
  "teacher": {
   "en": "With a teacher or support",
   "ms": "Bersama guru atau bantuan",
   "zh": "在老师或他人帮助下"
  }
 },
 "messageLabel": {
  "en": "Message/context being checked (choose from 1A or describe a fictional example)",
  "ms": "Mesej/konteks disemak (pilih 1A atau huraikan contoh rekaan)",
  "zh": "检查的消息与背景（选择1A案例，或描述虚构示例）"
 },
 "inputLabel": {
  "en": "The user will answer this question with…",
  "ms": "Pengguna akan menjawab soalan ini dengan…",
  "zh": "使用者将用什么回答这个问题？"
 },
 "prediction": {
  "en": "Before reading the lines: which advice do you expect, and why?",
  "ms": "Sebelum membaca baris: nasihat apa dijangka, dan mengapa?",
  "zh": "逐行阅读前：你预计出现什么建议？为什么？"
 },
 "startWalk": {
  "en": "Begin the partner walkthrough",
  "ms": "Mulakan semakan bersama rakan",
  "zh": "开始同伴逐行检查"
 },
 "startNeed": {
  "en": "Write a pseudocode plan in 2D, choose YES or NO, and record the message and prediction before beginning.",
  "ms": "Tulis pelan pseudokod dalam 2D, pilih YES atau NO, dan rekod mesej serta ramalan sebelum bermula.",
  "zh": "开始前，请在2D写伪代码，选择 YES 或 NO，并记录消息与预测。"
 },
 "lineGuide": {
  "en": "Read this line aloud. Is it followed for this answer, skipped because of the branch, or unclear? At every IF, say the comparison and TRUE/FALSE result. Mark ELSE and ENDIF as understood branch boundaries. Explain any skipped or unclear instruction in the line note. Do not silently repair your partner’s code.",
  "ms": "Baca baris ini dengan kuat. Adakah ia diikuti bagi jawapan ini, dilangkau kerana cabang, atau kurang jelas? Pada setiap IF, sebut perbandingan dan hasil TRUE/FALSE. Tandakan ELSE dan ENDIF sebagai sempadan cabang yang difahami. Terangkan arahan dilangkau atau kabur dalam nota baris. Jangan baiki kod rakan secara senyap.",
  "zh": "大声读出这行。对当前答案，它被执行、因分支而跳过，还是不清楚？每到 IF，说出比较及 TRUE/FALSE 结果。把 ELSE、ENDIF 标为已理解的分支边界。在行备注中解释跳过或不清楚的指令，不要悄悄替同伴修正代码。"
 },
 "lineStatuses": {
  "followed": {
   "en": "Followed / boundary understood",
   "ms": "Diikuti / sempadan difahami",
   "zh": "已执行／理解分支边界"
  },
  "skipped": {
   "en": "Skipped for this branch",
   "ms": "Dilangkau bagi cabang ini",
   "zh": "因当前分支而跳过"
  },
  "unclear": {
   "en": "Unclear — needs discussion",
   "ms": "Kurang jelas — perlu bincang",
   "zh": "不清楚，需要讨论"
  }
 },
 "lineNote": {
  "en": "Line note: comparison, skipped branch or exact difficulty",
  "ms": "Nota baris: perbandingan, cabang dilangkau atau kesukaran khusus",
  "zh": "行备注：比较、跳过的分支或具体困难"
 },
 "actual": {
  "en": "What advice did the “computer” actually read out? If it could not continue, say where it stopped.",
  "ms": "Nasihat apakah sebenarnya dibaca oleh “komputer”? Jika tidak dapat diteruskan, nyatakan tempat berhenti.",
  "zh": "“计算机”实际读出了什么建议？无法继续时，说明停在哪一行。"
 },
 "comparison": {
  "en": "Compare the actual advice with your prediction. What matched or differed?",
  "ms": "Bandingkan nasihat sebenar dengan ramalan. Apa sepadan atau berbeza?",
  "zh": "把实际建议与预测比较：哪里相同，哪里不同？"
 },
 "feedbackPrompt": {
  "en": "Useful feedback: “At line ___, I noticed ___. This matters because ___. Try ___.” Name one strength and one change or further check.",
  "ms": "Maklum balas berguna: “Pada baris ___, saya perhatikan ___. Ini penting kerana ___. Cuba ___.” Nyatakan satu kekuatan dan satu perubahan atau semakan lanjut.",
  "zh": "有用反馈：“在第___行，我注意到___。这很重要，因为___。可以试着___。”指出一个优点，以及一个修改或进一步检查。"
 },
 "qualityChecks": [
  {
   "id": "sequence",
   "label": {
    "en": "Sequence: the question is shown before input; input is stored before the IF.",
    "ms": "Urutan: soalan ditunjukkan sebelum input; input disimpan sebelum IF.",
    "zh": "顺序：先显示问题，再接收输入；先存入答案，再进行 IF 判断。"
   }
  },
  {
   "id": "branch",
   "label": {
    "en": "Decision: the comparison is explained and only the appropriate advice is followed.",
    "ms": "Keputusan: perbandingan diterangkan dan hanya nasihat sesuai diikuti.",
    "zh": "判断：解释比较，只执行对应建议。"
   }
  },
  {
   "id": "advice",
   "label": {
    "en": "Advice: it fits the question, gives a specific next step and avoids promising safety.",
    "ms": "Nasihat: sesuai dengan soalan, memberi langkah khusus dan tidak menjamin keselamatan.",
    "zh": "建议：符合问题，给出具体下一步，不保证安全。"
   }
  }
 ],
 "qualityStates": {
  "works": {
   "en": "Clear in this walkthrough",
   "ms": "Jelas dalam semakan ini",
   "zh": "此次检查中清楚"
  },
  "revise": {
   "en": "Needs a revision",
   "ms": "Perlu pindaan",
   "zh": "需要修改"
  },
  "help": {
   "en": "Need help to decide",
   "ms": "Perlu bantuan menentukan",
   "zh": "需要帮助才能判断"
  },
  "notyet": {
   "en": "Not checked yet",
   "ms": "Belum disemak",
   "zh": "尚未检查"
  }
 },
 "saveReview": {
  "en": "Save this walkthrough and feedback",
  "ms": "Simpan semakan dan maklum balas",
  "zh": "保存逐行检查与反馈"
 },
 "otherAnswer": {
  "en": "Now swap roles and review the other answer. Repeat for each question you keep. A saved partial review is useful evidence, but it does not show that both routes have been checked.",
  "ms": "Sekarang tukar peranan dan semak jawapan lain. Ulang bagi setiap soalan yang dikekalkan. Semakan separa yang disimpan ialah bukti berguna, tetapi tidak menunjukkan kedua-dua laluan disemak.",
  "zh": "现在交换角色并检查另一种答案。为保留的每个问题重复检查。保存的部分记录也是有用证据，但不代表两条路径都已检查。"
 },
 "savedReviews": {
  "en": "My walkthrough evidence",
  "ms": "Bukti semakan saya",
  "zh": "我的逐行检查证据"
 },
 "partial": {
  "en": "Partial record",
  "ms": "Rekod separa",
  "zh": "部分记录"
 },
 "complete": {
  "en": "Recorded: all lines and feedback",
  "ms": "Direkod: semua baris dan maklum balas",
  "zh": "已记录全部行与反馈"
 },
 "stale": {
  "en": "Your plan or Main Task 1 wording has changed since this walkthrough began. This record keeps the earlier version. Begin a new walkthrough to review the revised plan.",
  "ms": "Pelan atau perkataan Tugasan Utama 1 berubah sejak semakan bermula. Rekod ini mengekalkan versi terdahulu. Mulakan semakan baharu bagi pelan dipinda.",
  "zh": "开始此次检查后，计划或主任务一措辞已更改。此记录保留旧版本。请重新开始逐行检查来复查修改后的计划。"
 },
 "newWalk": {
  "en": "Start another walkthrough",
  "ms": "Mulakan semakan lain",
  "zh": "开始另一次逐行检查"
 },
 "noCode": {
  "en": "No pseudocode written for this check yet. Return to 2D to write it.",
  "ms": "Belum menulis pseudokod bagi semakan ini. Kembali ke 2D untuk menulis.",
  "zh": "这一项尚未编写伪代码，请返回2D编写。"
 },
 "noReviews": {
  "en": "No walkthrough saved yet. Start with one answer, then swap roles for the other.",
  "ms": "Belum ada semakan disimpan. Mulakan satu jawapan, kemudian tukar peranan bagi jawapan lain.",
  "zh": "尚未保存逐行检查。先尝试一种答案，再交换角色尝试另一种。"
 },
 "models": [
  {
   "id": "urgency",
   "variable": "urgent",
   "title": {
    "en": "Immediate urgency",
    "ms": "Desakan segera",
    "zh": "立即催促"
   },
   "question": {
    "en": "Does the message push you to act immediately? Type YES or NO.",
    "ms": "Adakah mesej mendesak tindakan segera? Taip YES atau NO.",
    "zh": "消息是否催促立即行动？输入 YES 或 NO。"
   },
   "yes": {
    "en": "Urgency reported. Pause and verify the request through a contact you already trust.",
    "ms": "Desakan dilaporkan. Berhenti dan sahkan permintaan melalui hubungan yang sudah dipercayai.",
    "zh": "报告了催促。先暂停，通过已知可信的联系方式核实请求。"
   },
   "no": {
    "en": "No immediate urgency reported. Still check for requests for secrets and unfamiliar links.",
    "ms": "Tiada desakan segera dilaporkan. Masih semak permintaan rahsia dan pautan tidak dikenali.",
    "zh": "未报告立即催促。仍需检查是否索取秘密或包含陌生链接。"
   },
   "cases": [
    {
     "message": "discord_club",
     "input": "yes",
     "why": {
      "en": "A verified club reminder can still demand immediate action. TRUE reports urgency, not fraud. Asking the teacher is an appropriate verification route if anything differs.",
      "ms": "Peringatan kelab disahkan masih boleh mendesak tindakan segera. TRUE melaporkan desakan, bukan penipuan. Tanya guru jika ada perbezaan.",
      "zh": "已核实的社团提醒仍可能催促立即行动。TRUE 报告急迫性，不是诈骗；若有出入，可向老师核实。"
     }
    },
    {
     "message": "snapchat_friend",
     "input": "no",
     "why": {
      "en": "“When you are ready” is not immediate urgency. The condition is FALSE, but the sign-in code request and friendship pressure remain warning signs.",
      "ms": "“Apabila bersedia” bukan desakan segera. Syarat FALSE, tetapi permintaan kod log masuk dan tekanan persahabatan masih tanda amaran.",
      "zh": "“准备好了再做”不是立即催促。条件为 FALSE，但索取验证码与友情施压仍是警示。"
     }
    }
   ]
  },
  {
   "id": "secrets",
   "variable": "secretRequest",
   "title": {
    "en": "Passwords and sign-in codes",
    "ms": "Kata laluan dan kod log masuk",
    "zh": "密码与登录验证码"
   },
   "question": {
    "en": "Does the message ask for a password or sign-in code? Type YES or NO.",
    "ms": "Adakah mesej meminta kata laluan atau kod log masuk? Taip YES atau NO.",
    "zh": "消息是否索取密码或登录验证码？输入 YES 或 NO。"
   },
   "yes": {
    "en": "A secret was requested. Do not share it through this message. Open the usual app yourself and ask a trusted adult if unsure.",
    "ms": "Rahsia diminta. Jangan kongsi melalui mesej ini. Buka aplikasi biasa sendiri dan tanya orang dewasa dipercayai jika tidak pasti.",
    "zh": "消息索取了秘密。不要通过此消息分享；自行打开常用应用，不确定时向可信成人求助。"
   },
   "no": {
    "en": "No password or code request reported. Check who sent the message and any link before acting.",
    "ms": "Tiada permintaan kata laluan atau kod dilaporkan. Semak penghantar dan pautan sebelum bertindak.",
    "zh": "未报告索取密码或验证码。行动前仍要核实发送者和链接。"
   },
   "cases": [
    {
     "message": "instagram_account",
     "input": "yes",
     "why": {
      "en": "The message explicitly asks for a password. TRUE selects the advice about protecting the secret and checking the claim independently.",
      "ms": "Mesej jelas meminta kata laluan. TRUE memilih nasihat melindungi rahsia dan menyemak dakwaan secara bebas.",
      "zh": "消息明确索取密码。TRUE 选择保护秘密并独立核实说法的建议。"
     }
    },
    {
     "message": "instagram_art",
     "input": "no",
     "why": {
      "en": "The independently confirmed showcase message does not request a password or code. FALSE selects the NO advice. This condition alone did not establish its authenticity.",
      "ms": "Mesej pameran disahkan tidak meminta kata laluan atau kod. FALSE memilih nasihat NO. Syarat ini sahaja tidak menentukan kesahihan.",
      "zh": "已独立确认的展览消息没有索取密码或验证码。FALSE 选择 NO 建议；仅凭此条件不能确定真实性。"
     }
    }
   ]
  },
  {
   "id": "links",
   "variable": "unexpectedLink",
   "title": {
    "en": "Unexpected links",
    "ms": "Pautan tidak dijangka",
    "zh": "意外链接"
   },
   "question": {
    "en": "Does the message contain a link you were not expecting? Type YES or NO.",
    "ms": "Adakah mesej mengandungi pautan tidak dijangka? Taip YES atau NO.",
    "zh": "消息是否包含你没预料到的链接？输入 YES 或 NO。"
   },
   "yes": {
    "en": "An unexpected link was reported. Use a known app, website or school contact to check the claim before using the link.",
    "ms": "Pautan tidak dijangka dilaporkan. Gunakan aplikasi, laman atau hubungan sekolah yang dikenali untuk menyemak sebelum menggunakan pautan.",
    "zh": "报告了意外链接。使用已知应用、网站或学校联系方式核实说法，再考虑该链接。"
   },
   "no": {
    "en": "No unexpected link reported. An expected-looking link is not verified by this rule; check the sender and request too.",
    "ms": "Tiada pautan tidak dijangka dilaporkan. Pautan yang nampak dijangka tidak disahkan peraturan ini; semak penghantar dan permintaan juga.",
    "zh": "未报告意外链接。这个规则并未核实看似预期的链接；仍需核实发送者与请求。"
   },
   "cases": [
    {
     "message": "discord_reward",
     "input": "yes",
     "why": {
      "en": "Sam did not enter a competition or expect this offer. TRUE calls for checking through the game’s usual app. The program does not visit the link.",
      "ms": "Sam tidak menyertai pertandingan atau menjangka tawaran. TRUE meminta semakan melalui aplikasi permainan biasa. Program tidak melawat pautan.",
      "zh": "Sam 没参加比赛，也没预料到这个奖励。TRUE 提示通过常用游戏应用核实，程序本身不访问链接。"
     }
    },
    {
     "message": "snapchat_bus",
     "input": "yes",
     "why": {
      "en": "The forwarded change and its link are unexpected and unconfirmed. TRUE suggests asking the school through a known route. It does not settle whether the transport update is real or a scam.",
      "ms": "Perubahan dimajukan dan pautannya tidak dijangka serta belum disahkan. TRUE mencadangkan bertanya sekolah melalui saluran dikenali. Ia tidak menentukan kemas kini itu sah atau penipuan.",
      "zh": "转发的变动与链接都出乎预料，尚未确认。TRUE 建议通过已知渠道询问学校，不能据此判定更新真实或诈骗。"
     }
    }
   ]
  }
 ]
};
const pcQuote=value=>JSON.stringify(String(value));
function checkerLines(m,l='en'){return [
 `OUTPUT ${pcQuote(m.question[l])}`,
 `${m.variable} ← USERINPUT`,
 `IF ${m.variable} = "YES" THEN`,
 `    OUTPUT ${pcQuote(m.yes[l])}`,
 'ELSE',
 `    OUTPUT ${pcQuote(m.no[l])}`,
 'ENDIF'
];}
const MAIN2_CARDS=[
 {id:'pseudocode',group:4,title:MAIN2.steps[0].label,read:[MAIN2.intro],type:'pc-intro',questions:[FIELD.readPrediction,FIELD.ruleExplanation],paper:true},
 {id:'worked-checkers',group:4,title:MAIN2.steps[1].label,read:[MAIN2.bIntro],type:'pc-models',questions:[],paper:true},
 {id:'sequence-lab',group:4,title:MAIN2.steps[2].label,read:[MAIN2.cIntro],type:'pc-sequences',questions:[],paper:true}
];
MAIN2_CARDS[0].questions.push(Q('pcBoolean',B('A genuine school reminder gives urgent = "YES". What does a TRUE result for urgent = "YES" mean?','Peringatan sekolah sah memberi urgent = "YES". Apakah maksud hasil TRUE bagi urgent = "YES"?','真实学校提醒得到 urgent = "YES"。urgent = "YES" 的结果为 TRUE 意味着什么？'),[
 O('match','The stored answer matches YES; the message may still need verification.','Jawapan tersimpan sepadan YES; mesej mungkin masih perlu disahkan.','保存的答案与 YES 匹配，消息仍可能需要核实。'),
 O('fake','The message must be fake.','Mesej pasti palsu.','消息肯定是假的。'),
 O('safe','The message must be safe.','Mesej pasti selamat.','消息肯定安全。')],{answer:'match',feedback:MAIN2.boolean}));
for(const model of MAIN2.models)for(const example of model.cases){const id='pc_'+model.id+'_'+example.message,correct=example.input;
 MAIN2_CARDS[1].questions.push(Q(id+'_input',MAIN2.inputQuestion,YESNO,{answer:correct,feedback:example.why}));
 MAIN2_CARDS[1].questions.push(Q(id+'_condition',MAIN2.conditionQuestion,[O('true','TRUE — the condition matches','TRUE — syarat sepadan','TRUE——条件匹配'),O('false','FALSE — the condition does not match','FALSE — syarat tidak sepadan','FALSE——条件不匹配')],{answer:correct==='yes'?'true':'false',feedback:B(...['en','ms','zh'].map(l=>`${model.variable} = "${correct.toUpperCase()}". ${model.variable} = "YES" → ${correct==='yes'?'TRUE':'FALSE'}. ${example.why[l]}`))}));
 MAIN2_CARDS[1].questions.push(Q(id+'_advice',MAIN2.adviceQuestion,[{value:'yes',label:model.yes},{value:'no',label:model.no},{value:'unsafe',label:MAIN2.unsafeAdvice}],{answer:correct,feedback:example.why}));
 MAIN2_CARDS[1].questions.push(Q(id+'_why',MAIN2.whyAdvice,null,{review:example.why}));
 for(const suffix of ['input','condition','advice','why']){const q=FIELD[id+'_'+suffix];q.prompt=B(...['en','ms','zh'].map(l=>`${model.title[l]} · ${MAIN1.cases.find(c=>c.id===example.message).sender} · ${q.prompt[l]}`));}
}
MAIN2.sequences=[
 {id:'receive',title:B('1 · Ask, receive, display','1 · Tanya, terima, papar','1 · 提问、接收、显示'),intro:B('Arrange a three-line practice that asks the urgency question, stores the answer, then displays the stored answer. This only practises input/output; it does not give safety advice yet.','Susun latihan tiga baris yang bertanya desakan, menyimpan jawapan, kemudian memaparkan jawapan tersimpan. Ini hanya latihan input/output; belum memberi nasihat keselamatan.','排列三行练习：询问是否催促，保存答案，再显示保存的答案。这里只练习输入与输出，还没有给出安全建议。'),pieces:['prompt','input','echo'],mixed:['echo','prompt','input'],explanation:B('The person needs the question before answering. The answer must be received before it can be displayed. This sequence has no IF yet.','Pengguna perlu soalan sebelum menjawab. Jawapan mesti diterima sebelum dipaparkan. Urutan ini belum ada IF.','人先看到问题才能回答；先接收答案才能显示。此顺序尚未使用 IF。')},
 {id:'choose',title:B('2 · Choose one piece of advice','2 · Pilih satu nasihat','2 · 选择一条建议'),intro:B('Arrange the password/code checker. Keep each advice output in the correct branch. Read it once with YES and once with NO.','Susun penyemak kata laluan/kod. Kekalkan setiap output nasihat dalam cabang betul. Baca sekali dengan YES dan sekali dengan NO.','排列密码与验证码检查器，把两条建议放入正确分支，分别用 YES、NO 阅读一次。'),pieces:['prompt','input','if','yes','else','no','end'],mixed:['yes','end','input','else','prompt','no','if'],explanation:B('Display the question, store the answer, then compare it. The secret-protection advice belongs after THEN; the other advice belongs after ELSE. ENDIF closes the choice.','Paparkan soalan, simpan jawapan, kemudian bandingkan. Nasihat melindungi rahsia selepas THEN; nasihat lain selepas ELSE. ENDIF menutup pilihan.','显示问题、保存答案，再比较。保护秘密的建议放在 THEN 后，另一条建议放在 ELSE 后，ENDIF 结束选择。')},
 {id:'series',title:B('3 · Continue to the next check','3 · Teruskan semakan seterusnya','3 · 继续下一项检查'),intro:B('Arrange the blocks so the program checks urgency FIRST, then asks about passwords/codes SECOND. Each question must receive its own answer. Follow the first decision through ENDIF before beginning the second. Blocks contain more than one line.','Susun blok supaya program menyemak desakan DAHULU, kemudian kata laluan/kod KEDUA. Setiap soalan mesti menerima jawapan sendiri. Ikuti keputusan pertama hingga ENDIF sebelum memulakan kedua. Blok mengandungi lebih satu baris.','排列指令块，先检查急迫性，再询问密码或验证码。每个问题必须接收自己的答案，执行完第一个 ENDIF 后再开始第二个判断。每块包含多行。'),pieces:['ask1','if1','branches1','end1','ask2','if2','branches2','end2'],mixed:['ask2','branches1','end2','if2','end1','ask1','branches2','if1'],explanation:B('Finish the urgency decision before displaying the password/code question. Its new USERINPUT must come before its IF. Even NO to urgency is followed by the second check; it is not a safety verdict.','Tamatkan keputusan desakan sebelum memaparkan soalan kata laluan/kod. USERINPUT baharu mesti sebelum IF. Walaupun NO bagi desakan, semakan kedua masih diikuti; itu bukan keputusan keselamatan.','完成急迫性判断后，再显示密码与验证码问题；新的 USERINPUT 必须位于对应 IF 前。急迫性回答 NO 后仍继续第二项检查，它不是安全结论。')}
];
for(const seq of MAIN2.sequences){MAIN2_CARDS[2].questions.push(Q('seq_'+seq.id,seq.title));MAIN2_CARDS[2].questions.push(Q('seq_'+seq.id+'_why',MAIN2.sequenceExplain,null,{review:seq.explanation}));MAIN2_CARDS[2].questions.push(Q('seq_'+seq.id+'_support',B('Model order consulted','Urutan model dirujuk','查阅过示例顺序')));}
MAIN1_FLOW.splice(MAIN1_FLOW.indexOf(9),0,...MAIN2_CARDS.map(c=>c.id));
for(const [i,title,read,type]of [[9,3,MAIN2.dIntro,'pc-write'],[10,4,MAIN2.eIntro,'pc-explain'],[11,5,MAIN2.fIntro,'peer-review'],[12,6,MAIN2.gIntro,'pc-improve']]){CARDS[i].title=MAIN2.steps[title].label;CARDS[i].read=[read];CARDS[i].type=type;}
for(let n=1;n<=3;n++)CARDS[9].questions.push(Q(mainField('planCode',n),B(...['en','ms','zh'].map(l=>`${MAIN2.ownCode[l]} · ${n}`))));
// Keep earlier work registered, but introduce formal pseudocode only in Main Task 2.
MAIN1.steps[1].label=B('1B · From answers to advice','1B · Daripada jawapan kepada nasihat','1B · 从答案到建议');CARDS[3].title=MAIN1.steps[1].label;CARDS[3].type='bridge-rule';
CARDS[3].read=[B('Before writing questions of your own, connect the person’s answer to useful advice. The person reads the message; a small program receives YES or NO and uses a rule to choose a response. You will learn how to write that rule as pseudocode in Main Task 2.','Sebelum menulis soalan sendiri, hubungkan jawapan pengguna dengan nasihat berguna. Pengguna membaca mesej; program kecil menerima YES atau NO dan menggunakan peraturan untuk memilih respons. Anda akan belajar menulis peraturan sebagai pseudokod dalam Tugasan Utama 2.','写自己的问题前，先把人的答案与有用建议联系起来。人阅读消息，小程序接收 YES 或 NO，用规则选择回应。主任务二会教你把规则写成伪代码。')];
CARDS[3].questions=CARDS[3].questions.filter(q=>!['readPrediction','ruleExplanation'].includes(q.id));
CARDS[3].words=['IPO','decomposition'];
MAIN1.bIntro=CARDS[3].read[0];
UI.sGoal=B('Write pseudocode, explain TRUE/FALSE routes, walk through with a partner and improve.','Tulis pseudokod, terangkan laluan TRUE/FALSE, semak bersama rakan dan baiki.','编写伪代码，解释 TRUE/FALSE 路径，与同伴逐行检查并改进。');
UI.wagba=B('Plan a message helper for Sam: ask focused questions, write advice in pseudocode and improve it using a partner’s walkthrough.','Rancang pembantu mesej untuk Sam: tanya soalan berfokus, tulis nasihat dalam pseudokod dan baiki melalui semakan rakan.','为 Sam 规划消息助手：提出聚焦问题，把建议写进伪代码，并根据同伴逐行检查改进。');
MAIN1.planNote=B('Each check keeps its own question, advice and pseudocode. Finish the questions in 1E/1F, write each plan in 2D, then walk through YES and NO with a partner in 2F. A dot marks a question you have written.','Setiap semakan menyimpan soalan, nasihat dan pseudokod sendiri. Lengkapkan soalan 1E/1F, tulis pelan dalam 2D, kemudian semak YES dan NO bersama rakan dalam 2F. Titik menandakan soalan ditulis.','每项分别保存问题、建议和伪代码。在1E/1F完成问题，在2D写计划，再在2F与同伴逐行检查 YES、NO。圆点表示已写出问题。');
LEARNING.test=B('WALK THROUGH: agree on a message and YES/NO answer, predict the advice, then ask a partner to read the actual pseudocode line by line. Mark each line followed, skipped or unclear. Record the advice they read, compare with the prediction and give feedback naming a line. Swap roles and check the other answer.','SEMAK: pilih mesej dan jawapan YES/NO, ramal nasihat, kemudian minta rakan membaca pseudokod sebenar baris demi baris. Tandakan baris diikuti, dilangkau atau kabur. Rekod nasihat dibaca, bandingkan ramalan dan beri maklum balas menyebut baris. Tukar peranan dan semak jawapan lain.','逐行检查：选定消息与 YES/NO 答案，预测建议，请同伴逐行阅读实际伪代码，标记执行、跳过或不清楚的行。记录读出的建议，与预测比较，并针对具体行反馈。交换角色检查另一种答案。');
for(const check of REFLECTION.checks){
 if(['k2','k3','s1','s2','s3','u2','u3'].includes(check.id))check.after.push('planCode','planCode2','planCode3');
 if(['k3','s2'].includes(check.id))check.after.push('pcBoolean',...MAIN2_CARDS[1].questions.filter(q=>q.id.endsWith('_condition')).map(q=>q.id),'seq_receive','seq_choose','seq_series');
 if(['u1','u2'].includes(check.id))check.after.push(...MAIN2_CARDS[1].questions.filter(q=>q.id.endsWith('_why')).map(q=>q.id));
}
for(let n=1;n<=3;n++)FIELD[mainField('description',n)].prompt=B('Explain Check '+n+': what does the person answer, what does IF compare, and why does each branch give suitable advice?','Terangkan Semakan '+n+': apa dijawab pengguna, apa dibandingkan IF, dan mengapa nasihat setiap cabang sesuai?','解释检查'+n+'：人回答什么？IF 比较什么？每条分支的建议为什么合适？');
LEARNING.plan=B('PLAN: use the questions and advice from Main Task 1. Write a question OUTPUT, store USERINPUT with ←, compare the answer in IF, and write the appropriate THEN/ELSE advice followed by ENDIF. Use a fresh input for each question. Predict what each answer should display.','RANCANG: gunakan soalan dan nasihat Tugasan Utama 1. Tulis OUTPUT soalan, simpan USERINPUT dengan ←, bandingkan jawapan dalam IF, dan tulis nasihat THEN/ELSE diikuti ENDIF. Gunakan input baharu bagi setiap soalan. Ramalkan output setiap jawapan.','规划：使用主任务一的问题与建议。用 OUTPUT 显示问题、← 保存 USERINPUT、IF 比较答案、THEN/ELSE 选择对应建议，最后写 ENDIF。每个问题接收新输入，并预测每种答案会显示什么。');
LEARNING.input=B('INPUT is information the program receives: the person’s YES or NO answer. In Main Task 2, warning1 ← USERINPUT stores that answer. OUTPUT first displays the question that asks for it. The whole message stays with the reader.','INPUT ialah maklumat diterima program: jawapan YES atau NO pengguna. Dalam Tugasan Utama 2, warning1 ← USERINPUT menyimpan jawapan. OUTPUT memaparkan soalan dahulu. Keseluruhan mesej kekal dengan pembaca.','INPUT 是程序接收的信息：人的 YES 或 NO 回答。主任务二中，warning1 ← USERINPUT 保存答案，前面的 OUTPUT 显示问题。整条消息由人阅读。');
LEARNING.skillsEvidence=B('Show a pseudocode plan, both partner walkthroughs and a reason for your revision. Cite a line, its condition or output, and the feedback that helped. Record whether you worked independently or used an example or help.','Tunjukkan pelan pseudokod, kedua-dua semakan rakan dan sebab pindaan. Rujuk baris, syarat atau outputnya serta maklum balas yang membantu. Rekod sama ada bekerja sendiri atau menggunakan contoh/bantuan.','展示伪代码计划、两种答案的同伴逐行检查，以及修改理由。引用具体行、条件或输出及有用反馈，并记录是独立完成，还是使用示例或帮助。');
UI.outcome=LEARNING.outcome=STARTER.outcome=B('Plan a short series of message checks for Sam. Use focused YES/NO questions and useful advice, then write them as pseudocode. Practise with examples first. Ask a partner to read your plan line by line for both answers, record the advice and feedback, and revise the plan ready for next lesson’s Python project.','Rancang siri semakan mesej ringkas untuk Sam. Gunakan soalan YES/NO berfokus dan nasihat berguna, kemudian tulis sebagai pseudokod. Latih dengan contoh dahulu. Minta rakan membaca pelan baris demi baris bagi kedua-dua jawapan, rekod nasihat dan maklum balas, kemudian baiki pelan bagi projek Python pelajaran seterusnya.','为 Sam 规划一组简短消息检查，使用聚焦的 YES/NO 问题和有用建议，再写成伪代码。先用示例练习，然后请同伴分别按两种答案逐行阅读计划，记录实际建议与反馈，再修改计划，为下节课 Python 项目作准备。');
MAIN2.reviewAgain=B('Plan changed — review again','Pelan berubah — semak semula','计划已更改，请重新检查');
MAIN2.ownWalk=B('Partner walkthrough','Semakan bersama rakan','同伴逐行检查');
FIELD.readPrediction.prompt=B('With urgent = "NO", which advice OUTPUT is followed?','Dengan urgent = "NO", OUTPUT nasihat manakah diikuti?','urgent = "NO" 时，执行哪条建议 OUTPUT？');
FIELD.readPrediction.options[0].label=B('Both advice outputs','Kedua-dua output nasihat','两条建议输出');
FIELD.ruleExplanation.hint=B('Line 1 displays the question. Line 2 receives and stores an answer. Line 3 compares it with "YES". Explain why either line 4 or line 6 is followed, and what line 7 ends.','Baris 1 memaparkan soalan. Baris 2 menerima dan menyimpan jawapan. Baris 3 membandingkan dengan "YES". Terangkan mengapa baris 4 atau 6 diikuti, dan apa ditamatkan baris 7.','第1行显示问题，第2行接收并保存答案，第3行与 "YES" 比较。解释为什么执行第4行或第6行，以及第7行结束什么。');
for(let n=1;n<=3;n++)CARDS[9].questions.push(Q(mainField('planSupport',n),B('Starting support used for Check '+n,'Bantuan awal bagi Semakan '+n,'检查'+n+'使用的起始帮助'),[{value:'scaffold',label:B('Created a starting draft from my Main Task 1 wording, then reviewed/edited it. This does not establish independent writing.','Mencipta draf awal daripada perkataan Tugasan Utama 1, kemudian menyemak/menyuntingnya. Ini tidak membuktikan penulisan bebas.','根据主任务一措辞创建起始草稿，再检查或修改。这不等于独立编写的证据。')}]));
for(const seq of MAIN2.sequences)FIELD['seq_'+seq.id+'_support'].options=[{value:'Model order consulted',label:B('Compared with a model order','Membandingkan dengan urutan model','对照过示例顺序')}];
for(const check of REFLECTION.checks)if(['s1','s2','s3'].includes(check.id))check.after.push('planSupport','planSupport2','planSupport3','seq_receive_support','seq_choose_support','seq_series_support');
const SUBMIT={
 title:B('Save & submit','Simpan & hantar','保存并提交'),
 intro:B('Your final job: save your work as a PDF, then submit that file in Teams. You do not need to answer another exit question.','Tugasan terakhir: simpan kerja sebagai PDF, kemudian hantar fail itu dalam Teams. Anda tidak perlu menjawab soalan penutup tambahan.','最后一步：把作品保存为 PDF，再把该文件提交到 Teams。无需再回答额外的离堂问题。'),
 before:B('Before you save','Sebelum menyimpan','保存前检查'),
 identity:B('Name and class on your PDF','Nama dan kelas pada PDF anda','PDF 上的姓名与班级'),
 checks:[
 B('Check that your name and class above are correct.','Semak nama dan kelas di atas adalah betul.','检查上方姓名和班级是否正确。'),
 B('Include your questions, YES/NO advice and pseudocode for the checks you worked on.','Sertakan soalan, nasihat YES/NO dan pseudokod bagi semakan yang anda lakukan.','包含你完成的问题、YES/NO 建议和伪代码。'),
 B('Include your partner’s feedback, your improvement and your learning reflection. Make any unfinished work clear; optional challenges do not need to be completed.','Sertakan maklum balas rakan, penambahbaikan dan refleksi pembelajaran. Jelaskan kerja belum selesai; cabaran pilihan tidak perlu disiapkan.','包含同伴反馈、改进和学习反思。说明尚未完成的内容；不必完成可选挑战。')],
 preview:B('Preview what will be in my PDF','Pratonton kandungan PDF saya','预览 PDF 将包含的内容'),
 previewHelp:B('This is your recorded work. Blank answers and unattempted challenges are left out. If you worked on paper, you can add a photo or note here before saving.','Ini kerja anda yang direkod. Jawapan kosong dan cabaran belum dicuba tidak dimasukkan. Jika bekerja di atas kertas, tambah foto atau nota di sini sebelum menyimpan.','这里是已记录的作品，不包含空白答案和未尝试的挑战。使用纸笔时，可在保存前添加照片或说明。'),
 pdfTitle:B('1 · Save your PDF','1 · Simpan PDF anda','1 · 保存 PDF'),
 pdfButton:B('Save my work as PDF','Simpan kerja saya sebagai PDF','把我的作品保存为 PDF'),
 pdfHelp:B('Select the button below. In the print window, choose Save as PDF (on a Mac, use the PDF menu), then save the file somewhere you can find it. Open the saved PDF and check your name, pages and any photos.','Pilih butang di bawah. Dalam tetingkap cetakan, pilih Save as PDF (pada Mac, gunakan menu PDF), kemudian simpan fail di tempat yang mudah ditemui. Buka PDF tersimpan dan semak nama, halaman serta foto.','选择下方按钮。在打印窗口选择“另存为 PDF”（Mac 可使用 PDF 菜单），保存到方便找到的位置。打开保存的 PDF，检查姓名、页面和照片。'),
 pdfDevice:B('Saving on an iPad or if the print window does not open','Menyimpan pada iPad atau jika tetingkap cetakan tidak terbuka','在 iPad 上保存，或打印窗口未打开时'),
 pdfDeviceHelp:B('On iPad, use the print preview, then Share → Save to Files. If this browser cannot open printing, use the readable report under Other save options, open that file in a browser and print it to PDF there. Cancelling the print window leaves your work here.','Pada iPad, gunakan pratonton cetakan, kemudian Share → Save to Files. Jika pelayar ini tidak dapat membuka cetakan, gunakan laporan boleh dibaca di bawah Pilihan simpanan lain, buka fail itu dalam pelayar dan cetak sebagai PDF. Membatalkan cetakan tidak memadam kerja di sini.','在 iPad 上使用打印预览，再选择“共享 → 存储到文件”。若此浏览器无法打开打印，请在“其他保存选项”下载可阅读报告，用浏览器打开该文件后打印为 PDF。取消打印不会删除这里的作品。'),
 teamsTitle:B('2 · Submit the PDF in Teams','2 · Hantar PDF dalam Teams','2 · 在 Teams 提交 PDF'),
 teamsSteps:[
 B('Open your class in Microsoft Teams and find Week 2 Project.','Buka kelas anda dalam Microsoft Teams dan cari Week 2 Project.','在 Microsoft Teams 打开班级，找到 Week 2 Project。'),
 B('For an assignment, choose + Add work and attach the PDF you just saved. Then select Turn in. If your teacher uses a different submission place, follow their instructions.','Bagi tugasan, pilih + Add work dan lampirkan PDF yang baru disimpan. Kemudian pilih Turn in. Jika guru menggunakan tempat penghantaran lain, ikut arahan guru.','若是作业，选择“+ Add work”，附上刚保存的 PDF，再选择“Turn in”。若老师指定了其他提交位置，请按老师的说明操作。'),
 B('Check that the correct PDF is attached and Teams shows it as turned in.','Semak PDF yang betul dilampirkan dan Teams menunjukkan tugasan telah dihantar.','检查附件是否为正确的 PDF，并确认 Teams 显示已提交。')],
 separate:B('Saving on this device or creating a PDF does not submit it to Teams. You finish by uploading it in Teams.','Menyimpan pada peranti atau mencipta PDF tidak menghantarnya ke Teams. Anda selesai selepas memuat naiknya dalam Teams.','保存在此设备或生成 PDF 不会自动提交到 Teams。还需要到 Teams 上传并完成提交。'),
 teamsHelp:B('Microsoft’s Teams submission guide','Panduan penghantaran Teams Microsoft','微软 Teams 提交指南'),
 other:B('Other save options · optional','Pilihan simpanan lain · pilihan','其他保存选项（可选）'),
 otherIntro:B('The PDF is the file to submit. These options are for keeping another copy or continuing your work later.','PDF ialah fail untuk dihantar. Pilihan ini untuk menyimpan salinan lain atau meneruskan kerja kemudian.','要提交的文件是 PDF。以下选项用于额外留存或以后继续编辑。'),
 backupTitle:B('Full backup (.json)','Sandaran penuh (.json)','完整备份（.json）'),
 backupHelp:B('Keeps your saved answers, earlier versions, walkthroughs and photos so you can restore them into this lesson later. This is for continuing your work, not the PDF to submit.','Menyimpan jawapan, versi terdahulu, semakan bersama rakan dan foto supaya boleh dipulihkan ke pelajaran ini. Ini untuk meneruskan kerja, bukan PDF untuk dihantar.','保留答案、先前版本、逐行检查和照片，方便以后恢复到本课继续编辑。它不是要提交的 PDF。'),
 htmlTitle:B('Readable report (.html)','Laporan boleh dibaca (.html)','可阅读报告（.html）'),
 htmlHelp:B('Downloads a copy you can open and read in a browser. You can also print that copy to PDF. It does not restore editable lesson progress.','Memuat turun salinan yang boleh dibuka dan dibaca dalam pelayar. Anda juga boleh mencetaknya sebagai PDF. Ia tidak memulihkan kemajuan pelajaran yang boleh disunting.','下载可在浏览器中打开阅读的副本，也可将其打印为 PDF。它不能恢复可编辑的学习进度。'),
 restoreHelp:B('Use this only to bring back work from a full .json backup. The confirmation explains which saved record will be replaced.','Gunakan ini hanya untuk mengembalikan kerja daripada sandaran penuh .json. Pengesahan menerangkan rekod yang akan diganti.','仅用于从完整 .json 备份恢复作品。确认窗口会说明将替换哪条保存记录。')
};
UI.report=GROUPS[7]=SUBMIT.title;
UI.print=SUBMIT.pdfButton;
// One final destination; preserve the old exit responses in exported evidence.
MAIN1_FLOW[MAIN1_FLOW.indexOf(15)]='report';
CARDS[15].title=B('Earlier final reflection','Refleksi akhir terdahulu','先前的最后反思');
SUBMIT.intro=B('Your final job: save your work as a PDF, then submit that file in Teams.','Tugasan terakhir: simpan kerja sebagai PDF, kemudian hantar fail itu dalam Teams.','最后一步：把作品保存为 PDF，再把该文件提交到 Teams。');
SUBMIT.separate=B('Saving on this device or creating a PDF does not submit it to Teams. Attach your PDF and complete the submission in Teams.','Menyimpan pada peranti atau mencipta PDF tidak menghantarnya ke Teams. Lampirkan PDF dan lengkapkan penghantaran dalam Teams.','保存在此设备或生成 PDF 不会自动提交到 Teams。请附上 PDF，并在 Teams 完成提交操作。');

// Further challenges: extend the learner’s own plan before the Learning Pit Stop.
const CHALLENGE={
 "intro": {
  "en": "If you have extra time after Main Task 2, work on a challenge that matches what you need to improve. Use your own message-checker plan. Aim for one well-explained improvement, then bring that evidence to the Learning Pit Stop.",
  "ms": "Jika ada masa tambahan selepas Tugasan Utama 2, lakukan cabaran yang sesuai dengan perkara yang perlu ditingkatkan. Gunakan pelan penyemak mesej sendiri. Hasilkan satu penambahbaikan dengan penjelasan yang baik, kemudian bawa bukti itu ke Hentian Pembelajaran.",
  "zh": "完成主任务二后，如果还有时间，请选择与你需要提升的方面相关的挑战。使用自己的消息检查程序计划，完成一项有充分解释的改进，再把证据带到学习检查站。"
 },
 "goal": {
  "en": "Towards the WAGBA: turn a real-world message problem into a clear, testable program plan. These challenges help you explain your choices and improve the advice your plan gives.",
  "ms": "Ke arah WAGBA: tukar masalah mesej dunia sebenar kepada pelan program yang jelas dan boleh diuji. Cabaran ini membantu anda menerangkan pilihan dan menambah baik nasihat pelan.",
  "zh": "向 WAGBA 目标迈进：把现实中的消息问题转化为清晰、可测试的程序计划。这些挑战帮助你解释设计选择，并改进计划给出的建议。"
 },
 "source": {
  "en": "Use one of your Main Task 2 plans",
  "ms": "Gunakan salah satu pelan Tugasan Utama 2 anda",
  "zh": "使用你在主任务二编写的计划"
 },
 "check": {
  "en": "Check",
  "ms": "Semakan",
  "zh": "检查"
 },
 "missing": {
  "en": "You have not written pseudocode for this check yet. Return to 2D to write it, or choose a check that already has a plan. Nothing is filled in for you.",
  "ms": "Anda belum menulis pseudokod bagi semakan ini. Kembali ke 2D untuk menulisnya, atau pilih semakan yang sudah mempunyai pelan. Tiada jawapan diisi untuk anda.",
  "zh": "你还没有为这项检查编写伪代码。返回 2D 编写，或选择已有计划的检查。这里不会自动替你填写答案。"
 },
 "backPlan": {
  "en": "Open 2D · My pseudocode",
  "ms": "Buka 2D · Pseudokod saya",
  "zh": "打开 2D · 我的伪代码"
 },
 "model": {
  "en": "Study a worked example",
  "ms": "Kaji contoh berpandu",
  "zh": "学习示例"
 },
 "evidence": {
  "en": "Take this evidence to the Learning Pit Stop",
  "ms": "Bawa bukti ini ke Hentian Pembelajaran",
  "zh": "把这些证据带到学习检查站"
 },
 "support": {
  "en": "For each check below, identify the part of your work that demonstrates it. Record whether you worked independently, used an example or reminder, or still need help. Leave unattempted checks as not yet attempted. Counts describe evidence; they do not choose your learning phase.",
  "ms": "Bagi setiap semakan di bawah, kenal pasti bahagian kerja yang menunjukkannya. Rekod sama ada anda bekerja sendiri, menggunakan contoh atau peringatan, atau masih perlu bantuan. Tandakan semakan belum dicuba sebagai belum dicuba. Bilangan menerangkan bukti; ia tidak menentukan fasa pembelajaran.",
  "zh": "针对下列各项检查，指出作品中的具体证据，并记录是独立完成、借助示例或提醒，还是仍需帮助。没尝试的项目记为“尚未尝试”。数量描述的是证据，不会替你决定学习阶段。"
 },
 "pythonTitle": {
  "en": "4 · Turn my pseudocode into Python",
  "ms": "4 · Tukar pseudokod saya kepada Python",
  "zh": "4 · 把我的伪代码转换为 Python"
 },
 "pythonBrief": {
  "en": "Skills + understanding: translate one of your own plans, run different inputs and explain whether the outputs match your intended advice.",
  "ms": "Kemahiran + pemahaman: terjemah satu pelan sendiri, jalankan input berbeza dan terangkan sama ada output sepadan dengan nasihat yang dirancang.",
  "zh": "技能＋理解：转换自己的一个计划，运行不同输入，并解释输出是否符合预期建议。"
 },
 "pythonIntro": {
  "en": "Choose a check below. Read your own Main Task 2 pseudocode line by line and write its Python version in the editor. Keep your question and advice recognisable. If you improved its UNSURE route in Challenge 2, include that change. Start with one check; each check has its own saved editor.",
  "ms": "Pilih semakan di bawah. Baca pseudokod Tugasan Utama 2 sendiri baris demi baris dan tulis versi Python dalam editor. Kekalkan soalan dan nasihat yang boleh dikenal pasti. Jika anda menambah baik laluan UNSURE dalam Cabaran 2, sertakan perubahan itu. Mulakan dengan satu semakan; setiap semakan mempunyai editor tersimpan sendiri.",
  "zh": "选择下方一项检查，逐行阅读自己在主任务二编写的伪代码，在编辑器中写出 Python 版本。保留可对应的问题和建议。如果你在挑战二改进了 UNSURE 路径，请把改进也写进去。先完成一项；每项检查都有独立保存的编辑器。"
 },
 "pythonHelp": {
  "en": "Translation help · compare the instructions",
  "ms": "Bantuan terjemahan · bandingkan arahan",
  "zh": "转换帮助 · 对照指令"
 },
 "pythonPractice": {
  "en": "Predict before running. Run once with YES and again with NO. If your program accepts UNSURE, try that too. Try MAYBE or an empty answer to see whether it wrongly gives the NO advice. Read the actual output, compare it with your prediction and revise one line if needed. Run the changed version again.",
  "ms": "Ramalkan sebelum menjalankan. Jalankan dengan YES, kemudian NO. Jika program menerima UNSURE, cuba juga. Cuba MAYBE atau jawapan kosong untuk melihat sama ada nasihat NO diberi secara salah. Baca output sebenar, bandingkan dengan ramalan dan ubah satu baris jika perlu. Jalankan versi diubah sekali lagi.",
  "zh": "运行前先预测。分别输入 YES 和 NO。如果程序接受 UNSURE，也试一次。再试 MAYBE 或空白答案，检查是否错误地给出了 NO 建议。阅读实际输出、对照预测，必要时修改一行，再运行修改后的版本。"
 },
 "pythonStretch": {
  "en": "Think further: make spaces and lower-case letters work using .strip().upper(). Explain why this can tidy \" yes \" but cannot turn MAYBE into a reliable YES or NO. A running program still cannot prove a message is genuine.",
  "ms": "Fikir lebih jauh: kendalikan ruang dan huruf kecil menggunakan .strip().upper(). Terangkan mengapa ini boleh mengemas \" yes \" tetapi tidak boleh menukar MAYBE kepada YES atau NO yang boleh dipercayai. Program yang berjalan masih tidak membuktikan mesej itu sah.",
  "zh": "进一步思考：使用 .strip().upper() 处理首尾空格和小写字母。解释为什么它能整理 \" yes \"，却不能把 MAYBE 变成可靠的 YES 或 NO。程序能够运行，仍不代表它能证明消息真实。"
 },
 "run": {
  "en": "Run Python",
  "ms": "Jalankan Python",
  "zh": "运行 Python"
 },
 "stop": {
  "en": "Stop",
  "ms": "Hentikan",
  "zh": "停止"
 },
 "download": {
  "en": "Download this check (.py)",
  "ms": "Muat turun semakan ini (.py)",
  "zh": "下载本项检查（.py）"
 },
 "reset": {
  "en": "Restart this editor",
  "ms": "Mulakan semula editor ini",
  "zh": "重新开始本项编辑"
 },
 "send": {
  "en": "Send answer",
  "ms": "Hantar jawapan",
  "zh": "发送答案"
 },
 "output": {
  "en": "Program output",
  "ms": "Output program",
  "zh": "程序输出"
 },
 "empty": {
  "en": "Your output will appear here when you run this check.",
  "ms": "Output akan muncul di sini apabila anda menjalankan semakan ini.",
  "zh": "运行本项检查后，输出将显示在这里。"
 },
 "runs": {
  "en": "Saved runs for this check",
  "ms": "Larian tersimpan bagi semakan ini",
  "zh": "本项检查的已保存运行记录"
 },
 "runEvidence": {
  "en": "Compare these saved inputs and outputs with your prediction. A saved run records what happened, not whether the advice is suitable.",
  "ms": "Bandingkan input dan output tersimpan ini dengan ramalan. Larian tersimpan merekod apa yang berlaku, bukan sama ada nasihat sesuai.",
  "zh": "将保存的输入、输出与预测进行比较。运行记录只说明发生了什么，并不表示建议合适。"
 },
 "inputs": {
  "en": "Answers entered",
  "ms": "Jawapan dimasukkan",
  "zh": "输入的答案"
 },
 "emptyInput": {
  "en": "(empty answer)",
  "ms": "(jawapan kosong)",
  "zh": "（空白答案）"
 },
 "runSource": {
  "en": "Pseudocode and Python when this run started",
  "ms": "Pseudokod dan Python semasa larian ini bermula",
  "zh": "本次运行开始时的伪代码与 Python"
 },
 "changed": {
  "en": "Your code or pseudocode has changed since this run. Keep this evidence and run the revised version.",
  "ms": "Kod atau pseudokod telah berubah sejak larian ini. Simpan bukti dan jalankan versi baharu.",
  "zh": "本次运行后代码或伪代码已改变。保留证据，并运行修改后的版本。"
 },
 "starter": {
  "en": "# Translate your selected pseudocode here.\n# Display the question, collect an answer, then choose advice.\n",
  "ms": "# Terjemah pseudokod yang dipilih di sini.\n# Paparkan soalan, terima jawapan, kemudian pilih nasihat.\n",
  "zh": "# 在这里转换所选的伪代码。\n# 显示问题、接收答案，再选择建议。\n"
 },
 "translation": [
  [
   {
    "en": "Pseudocode",
    "ms": "Pseudokod",
    "zh": "伪代码"
   },
   {
    "en": "Python",
    "ms": "Python",
    "zh": "Python"
   },
   {
    "en": "What it means",
    "ms": "Maksudnya",
    "zh": "含义"
   }
  ],
  [
   "OUTPUT \"…\"",
   "print(\"…\")",
   {
    "en": "Display a question or advice.",
    "ms": "Paparkan soalan atau nasihat.",
    "zh": "显示问题或建议。"
   }
  ],
  [
   "answer ← USERINPUT",
   "answer = input(\"…\")",
   {
    "en": "Receive and store text. input(\"…\") also displays its prompt; you can combine the question and receiving lines.",
    "ms": "Terima dan simpan teks. input(\"…\") juga memaparkan soalan; anda boleh menggabungkan baris soalan dan penerimaan.",
    "zh": "接收并保存文本。input(\"…\") 也会显示提示问题，可以把显示问题和接收答案两行合并。"
   }
  ],
  [
   "IF answer = \"YES\" THEN",
   "if answer == \"YES\":",
   {
    "en": "Compare using ==. A single = assigns a value in Python. Add a colon and indent the advice inside this branch.",
    "ms": "Banding menggunakan ==. Satu = memberikan nilai dalam Python. Tambah titik bertindih dan inden nasihat dalam cabang.",
    "zh": "用 == 比较；Python 的单个 = 用于赋值。末尾加冒号，分支内的建议要缩进。"
   }
  ],
  [
   "ELSE IF answer = \"NO\" THEN",
   "elif answer == \"NO\":",
   {
    "en": "Try this comparison only when the earlier condition did not match.",
    "ms": "Cuba perbandingan ini hanya apabila syarat terdahulu tidak sepadan.",
    "zh": "只有先前条件不成立时，才检查这个条件。"
   }
  ],
  [
   "ELSE",
   "else:",
   {
    "en": "Follow this branch when none of the earlier conditions matched.",
    "ms": "Ikut cabang ini apabila tiada syarat terdahulu sepadan.",
    "zh": "先前条件均不成立时，执行此分支。"
   }
  ],
  [
   "ENDIF",
   {
    "en": "(no ENDIF line)",
    "ms": "(tiada baris ENDIF)",
    "zh": "（不写 ENDIF）"
   },
   {
    "en": "Python uses indentation to show the branch body; the next outside instruction returns to the original indentation.",
    "ms": "Python menggunakan inden untuk menunjukkan isi cabang; arahan luar seterusnya kembali ke inden asal.",
    "zh": "Python 用缩进表示分支内部；后续分支外的指令恢复原来的缩进。"
   }
  ]
 ],
 "uncertainCode": {
  "en": "OUTPUT \"Were you expecting this link? YES/NO/UNSURE: \"\nanswer ← USERINPUT\nIF answer = \"YES\" THEN\n    OUTPUT \"Expected does not prove genuine. Verify through the official app before opening.\"\nELSE IF answer = \"NO\" THEN\n    OUTPUT \"Do not open the unexpected link. Check with the sender using a trusted contact.\"\nELSE IF answer = \"UNSURE\" THEN\n    OUTPUT \"Pause. Ask the school through a known contact or ask a trusted adult.\"\nELSE\n    OUTPUT \"Enter YES, NO or UNSURE. No message judgment has been made.\"\nENDIF",
  "ms": "OUTPUT \"Adakah anda menjangka pautan ini? YES/NO/UNSURE: \"\nanswer ← USERINPUT\nIF answer = \"YES\" THEN\n    OUTPUT \"Dijangka tidak membuktikan sah. Sahkan melalui aplikasi rasmi sebelum membuka.\"\nELSE IF answer = \"NO\" THEN\n    OUTPUT \"Jangan buka pautan tidak dijangka. Semak dengan pengirim melalui kenalan dipercayai.\"\nELSE IF answer = \"UNSURE\" THEN\n    OUTPUT \"Berhenti. Tanya sekolah melalui kenalan yang dikenali atau orang dewasa dipercayai.\"\nELSE\n    OUTPUT \"Masukkan YES, NO atau UNSURE. Tiada penilaian mesej dibuat.\"\nENDIF",
  "zh": "OUTPUT \"这个链接在预期之内吗？YES/NO/UNSURE：\"\nanswer ← USERINPUT\nIF answer = \"YES\" THEN\n    OUTPUT \"在预期之内不等于真实。打开前通过官方应用核实。\"\nELSE IF answer = \"NO\" THEN\n    OUTPUT \"不要打开意外链接。使用可信联系方式向发送者核实。\"\nELSE IF answer = \"UNSURE\" THEN\n    OUTPUT \"先停下来。通过已知联系方式询问学校，或请可信成年人帮助。\"\nELSE\n    OUTPUT \"请输入 YES、NO 或 UNSURE。尚未对消息作出判断。\"\nENDIF"
 },
 "pythonModel": {
  "en": "answer = input(\"Were you expecting this link? YES/NO/UNSURE: \")\nif answer == \"YES\":\n    print(\"Expected does not prove genuine. Verify through the official app before opening.\")\nelif answer == \"NO\":\n    print(\"Do not open the unexpected link. Check with the sender using a trusted contact.\")\nelif answer == \"UNSURE\":\n    print(\"Pause. Ask the school through a known contact or ask a trusted adult.\")\nelse:\n    print(\"Enter YES, NO or UNSURE. No message judgment has been made.\")",
  "ms": "answer = input(\"Adakah anda menjangka pautan ini? YES/NO/UNSURE: \")\nif answer == \"YES\":\n    print(\"Dijangka tidak membuktikan sah. Sahkan melalui aplikasi rasmi sebelum membuka.\")\nelif answer == \"NO\":\n    print(\"Jangan buka pautan tidak dijangka. Semak dengan pengirim melalui kenalan dipercayai.\")\nelif answer == \"UNSURE\":\n    print(\"Berhenti. Tanya sekolah melalui kenalan yang dikenali atau orang dewasa dipercayai.\")\nelse:\n    print(\"Masukkan YES, NO atau UNSURE. Tiada penilaian mesej dibuat.\")",
  "zh": "answer = input(\"这个链接在预期之内吗？YES/NO/UNSURE：\")\nif answer == \"YES\":\n    print(\"在预期之内不等于真实。打开前通过官方应用核实。\")\nelif answer == \"NO\":\n    print(\"不要打开意外链接。使用可信联系方式向发送者核实。\")\nelif answer == \"UNSURE\":\n    print(\"先停下来。通过已知联系方式询问学校，或请可信成年人帮助。\")\nelse:\n    print(\"请输入 YES、NO 或 UNSURE。尚未对消息作出判断。\")"
 },
 "routes": [
  {
   "en": "Input",
   "ms": "Input",
   "zh": "输入"
  },
  {
   "en": "Route and suitable advice",
   "ms": "Laluan dan nasihat sesuai",
   "zh": "路径与适当建议"
  }
 ],
 "routeRows": [
  [
   "YES",
   {
    "en": "Expected does not prove genuine. Verify through the official app before opening.",
    "ms": "Dijangka tidak membuktikan sah. Sahkan melalui aplikasi rasmi sebelum membuka.",
    "zh": "在预期之内不等于真实。打开前通过官方应用核实。"
   }
  ],
  [
   "NO",
   {
    "en": "Do not open the unexpected link. Check with the sender using a trusted contact.",
    "ms": "Jangan buka pautan tidak dijangka. Semak dengan pengirim melalui kenalan dipercayai.",
    "zh": "不要打开意外链接。使用可信联系方式向发送者核实。"
   }
  ],
  [
   "UNSURE",
   {
    "en": "Pause. Ask the school through a known contact or ask a trusted adult.",
    "ms": "Berhenti. Tanya sekolah melalui kenalan yang dikenali atau orang dewasa dipercayai.",
    "zh": "先停下来。通过已知联系方式询问学校，或请可信成年人帮助。"
   }
  ],
  [
   "MAYBE / \"\"",
   {
    "en": "Enter YES, NO or UNSURE. No message judgment has been made.",
    "ms": "Masukkan YES, NO atau UNSURE. Tiada penilaian mesej dibuat.",
    "zh": "请输入 YES、NO 或 UNSURE。尚未对消息作出判断。"
   }
  ]
 ]
};
UI.extensions=B("Further challenges","Cabaran lanjutan","进阶挑战");
const CHALLENGE_TASKS=[
 {
  "id": "ext1",
  "title": {
   "en": "1 · Explain it on a card",
   "ms": "1 · Terangkan pada kad",
   "zh": "1 · 制作解释卡"
  },
  "intro": {
   "en": "Make a two-sided revision card using a line from your own checker. Choose INPUT, OUTPUT, an IF condition or sequence. The front should help a partner recall the idea; the back should teach it through your code, a reason and a common mistake. Write below, or make a paper card and add a photo.",
   "ms": "Buat kad ulang kaji dua muka menggunakan baris daripada penyemak sendiri. Pilih INPUT, OUTPUT, syarat IF atau urutan. Depan membantu rakan mengingat idea; belakang mengajarnya melalui kod, sebab dan kesilapan lazim. Tulis di bawah, atau buat kad kertas dan tambah foto.",
   "zh": "用自己检查程序中的一行代码制作双面复习卡。选择 INPUT、OUTPUT、IF 条件或顺序。正面帮助同伴回忆概念；背面用你的代码、理由和常见错误来讲解。可以填写下方内容，也可以制作纸卡并添加照片。"
  },
  "brief": {
   "en": "Knowledge + understanding: define a term, find it in your plan and explain why the line is an example.",
   "ms": "Pengetahuan + pemahaman: takrif istilah, cari dalam pelan dan terangkan mengapa baris itu ialah contoh.",
   "zh": "知识＋理解：定义术语、在计划中找到例子，并说明为什么这一行符合定义。"
  },
  "model": {
   "en": "Front: What is an input?\nBack: Input is data a program receives. In answer ← USERINPUT, the reply Sam types is received and stored in answer. OUTPUT \"Is it urgent?\" displays a question; that line is an output, even though the question asks for an input.\nPartner check: point to where receiving happens, not just where the question is displayed.",
   "ms": "Depan: Apakah input?\nBelakang: Input ialah data yang diterima program. Dalam answer ← USERINPUT, jawapan yang ditaip Sam diterima dan disimpan dalam answer. OUTPUT \"Adakah ia mendesak?\" memaparkan soalan; baris itu ialah output walaupun soalan meminta input.\nSemakan rakan: tunjuk tempat penerimaan berlaku, bukan sekadar tempat soalan dipaparkan.",
   "zh": "正面：什么是输入？\n背面：输入是程序接收的数据。在 answer ← USERINPUT 中，程序接收 Sam 输入的答案，并保存在 answer 中。OUTPUT \"紧急吗？\" 显示一个问题；即使问题要求输入，这一行本身仍是输出。\n同伴检查：指出接收数据的位置，而不只是显示问题的位置。"
  },
  "evidence": [
   {
    "en": "Knowledge: a correct definition in your own words.",
    "ms": "Pengetahuan: definisi tepat dalam perkataan sendiri.",
    "zh": "知识：用自己的话正确定义。"
   },
   {
    "en": "Skills: a matching line and line number from your own plan.",
    "ms": "Kemahiran: baris sepadan serta nombor baris daripada pelan sendiri.",
    "zh": "技能：引用自己计划中对应的代码和行号。"
   },
   {
    "en": "Understanding: a reason the line fits, plus an explanation of a near-miss.",
    "ms": "Pemahaman: sebab baris itu sesuai, serta penjelasan contoh yang hampir tetapi tidak tepat.",
    "zh": "理解：说明符合定义的理由，并解释容易混淆的反例。"
   }
  ],
  "items": [
   {
    "id": "ext1_front",
    "prompt": {
     "en": "Front: which term did you choose, and what question should your partner answer?",
     "ms": "Depan: istilah manakah dipilih, dan soalan apakah perlu dijawab rakan?",
     "zh": "正面：选择哪个术语？希望同伴回答什么问题？"
    }
   },
   {
    "id": "ext1_back",
    "prompt": {
     "en": "Back: define the term in your own words. Quote a line and its number from your selected plan. Explain what happens on that line and why it fits the definition.",
     "ms": "Belakang: takrif istilah dengan perkataan sendiri. Petik baris dan nombornya daripada pelan dipilih. Terangkan apa berlaku pada baris itu dan mengapa sesuai dengan definisi.",
     "zh": "背面：用自己的话定义术语，引用所选计划中的一行及行号。解释这一行执行什么，以及为什么符合定义。"
    }
   },
   {
    "id": "ext1_mistake",
    "prompt": {
     "en": "Think further: show a line someone might confuse with your term. Explain the difference. For an IF condition, explain why TRUE means the comparison matches, not that a message is genuine.",
     "ms": "Fikir lebih jauh: tunjuk baris yang mungkin dikelirukan dengan istilah anda. Terangkan perbezaan. Bagi syarat IF, terangkan mengapa TRUE bermaksud perbandingan sepadan, bukan mesej itu sah.",
     "zh": "进一步思考：举出容易与该术语混淆的一行，并说明区别。若选择 IF 条件，请解释 TRUE 为什么表示比较成立，而不是消息真实。"
    }
   },
   {
    "id": "ext1_work",
    "prompt": {
     "en": "Ask a partner to explain your example without reading the back. What did they say? What will you clarify? Record which of the three evidence checks you demonstrated and what support you used.",
     "ms": "Minta rakan menerangkan contoh tanpa membaca belakang. Apakah kata mereka? Apakah yang akan diperjelas? Rekod semakan bukti yang ditunjukkan daripada tiga semakan dan bantuan yang digunakan.",
     "zh": "请同伴不看背面解释你的例子。他们说了什么？你要澄清什么？记录三项证据检查中已展示哪些，以及用了什么帮助。"
    }
   }
  ]
 },
 {
  "id": "ext2",
  "title": {
   "en": "2 · Give safe advice when Sam is unsure",
   "ms": "2 · Beri nasihat selamat apabila Sam tidak pasti",
   "zh": "2 · Sam 不确定时，给出安全建议"
  },
  "intro": {
   "en": "Sam receives a forwarded message saying the school bus has changed, with a link. Sam cannot tell whether the school sent it. Your question asks, \"Were you expecting this link?\" Sam needs to answer UNSURE instead of guessing YES or NO. The program does not know the truth: it follows the route you write for that answer.",
   "ms": "Sam menerima mesej dimajukan tentang perubahan bas sekolah, bersama pautan. Sam tidak tahu sama ada sekolah menghantarnya. Soalan anda bertanya, \"Adakah anda menjangka pautan ini?\" Sam perlu menjawab UNSURE, bukan meneka YES atau NO. Program tidak mengetahui kebenaran: ia mengikuti laluan yang anda tulis bagi jawapan itu.",
   "zh": "Sam 收到一条转发消息，说校车安排有变，并附有链接。Sam 无法确定是否由学校发送。你的问题是：“这个链接在你的预期之内吗？”Sam 需要回答 UNSURE，而不是猜 YES 或 NO。程序不知道真相，它只会执行你为这个答案编写的路径。"
  },
  "brief": {
   "en": "Skills + understanding: add an explicit UNSURE route and keep an unrecognised answer out of the NO route.",
   "ms": "Kemahiran + pemahaman: tambah laluan UNSURE yang jelas dan elakkan jawapan tidak dikenali masuk ke laluan NO.",
   "zh": "技能＋理解：增加明确的 UNSURE 路径，避免把无法识别的答案当作 NO。"
  },
  "model": {
   "en": "In IF answer = \"YES\" THEN … ELSE … ENDIF, ELSE catches every answer other than YES. It includes NO, UNSURE, a typing mistake and an empty answer. Once you allow more than YES/NO, ELSE must not silently mean NO.\nUNSURE is an allowed answer about missing information. MAYBE or a blank answer is unrecognised input in this example. Give each a clear response; do not label either as safe.",
   "ms": "Dalam IF answer = \"YES\" THEN … ELSE … ENDIF, ELSE menerima semua jawapan selain YES. Ini termasuk NO, UNSURE, kesilapan menaip dan jawapan kosong. Apabila anda membenarkan lebih daripada YES/NO, ELSE tidak boleh dianggap sebagai NO secara senyap.\nUNSURE ialah jawapan dibenarkan tentang maklumat yang tidak cukup. MAYBE atau jawapan kosong ialah input tidak dikenali dalam contoh ini. Beri respons jelas bagi setiapnya; jangan labelkan mana-mana sebagai selamat.",
   "zh": "在 IF answer = \"YES\" THEN … ELSE … ENDIF 中，ELSE 接收所有非 YES 答案，包括 NO、UNSURE、拼写错误和空白。一旦允许 YES/NO 以外的答案，就不能再把 ELSE 默认为 NO。\nUNSURE 是表示信息不足的有效答案。此例中，MAYBE 或空白属于无法识别的输入。两者都应获得明确回应，不能被标为安全。"
  },
  "evidence": [
   {
    "en": "Knowledge: distinguish an UNSURE answer from unrecognised input.",
    "ms": "Pengetahuan: bezakan jawapan UNSURE daripada input tidak dikenali.",
    "zh": "知识：区分 UNSURE 答案与无法识别的输入。"
   },
   {
    "en": "Skills: trace YES, NO, UNSURE and an unrecognised answer through your revised plan.",
    "ms": "Kemahiran: jejak YES, NO, UNSURE dan jawapan tidak dikenali melalui pelan diubah.",
    "zh": "技能：逐行追踪修改后计划的 YES、NO、UNSURE 及无法识别的答案。"
   },
   {
    "en": "Understanding: explain why missing information cannot justify reassuring advice.",
    "ms": "Pemahaman: terangkan mengapa maklumat tidak cukup tidak membolehkan nasihat yang memberi jaminan.",
    "zh": "理解：解释信息不足为何不能成为保证安全的依据。"
   }
  ],
  "items": [
   {
    "id": "ext2_question",
    "prompt": {
     "en": "Choose your own check. Rewrite its question so Sam knows when to enter YES, NO or UNSURE. Give one fictional situation where Sam would genuinely need UNSURE.",
     "ms": "Pilih semakan sendiri. Tulis semula soalan supaya Sam tahu bila memasukkan YES, NO atau UNSURE. Beri satu situasi rekaan apabila Sam benar-benar memerlukan UNSURE.",
     "zh": "选择自己的检查。改写问题，让 Sam 明白何时输入 YES、NO 或 UNSURE。给出一个确实需要回答 UNSURE 的虚构情境。"
    }
   },
   {
    "id": "ext2_code",
    "prompt": {
     "en": "Write your revised pseudocode: separate YES, NO and UNSURE conditions, then an ELSE for any unrecognised answer. Include the exact advice. For UNSURE, say how Sam should verify independently before acting.",
     "ms": "Tulis pseudokod diubah: syarat YES, NO dan UNSURE berasingan, kemudian ELSE bagi jawapan tidak dikenali. Sertakan nasihat tepat. Bagi UNSURE, nyatakan cara Sam mengesahkan secara berasingan sebelum bertindak.",
     "zh": "编写修改后的伪代码：分别检查 YES、NO 和 UNSURE，再用 ELSE 处理无法识别的答案。写出完整建议。对于 UNSURE，说明 Sam 应怎样通过独立渠道核实后再行动。"
    }
   },
   {
    "id": "ext2_trace",
    "prompt": {
     "en": "Ask a partner to follow your revised code line by line for YES, NO, UNSURE and MAYBE (or a blank answer). For each: record your predicted advice, the condition/line followed, the actual advice and any difference.",
     "ms": "Minta rakan mengikuti kod diubah baris demi baris bagi YES, NO, UNSURE dan MAYBE (atau jawapan kosong). Bagi setiapnya: rekod nasihat diramal, syarat/baris diikuti, nasihat sebenar dan sebarang perbezaan.",
     "zh": "请同伴逐行执行修改后的代码，分别尝试 YES、NO、UNSURE 和 MAYBE（或空白）。每次记录：预测建议、执行的条件／行号、实际建议及差异。"
    }
   },
   {
    "id": "ext2_work",
    "prompt": {
     "en": "Explain one change your walkthrough led to. Why must UNSURE or an unrecognised answer not produce \"It is safe\"? Identify your evidence for the three checks below and the support you used.",
     "ms": "Terangkan satu perubahan hasil semakan bersama. Mengapa UNSURE atau jawapan tidak dikenali tidak boleh menghasilkan \"Ia selamat\"? Kenal pasti bukti bagi tiga semakan di bawah dan bantuan yang digunakan.",
     "zh": "解释逐行检查带来的一项修改。为什么 UNSURE 或无法识别的答案不能产生“这是安全的”？指出下方三项检查的证据，以及你用了什么帮助。"
    }
   }
  ]
 },
 {
  "id": "ext3",
  "title": {
   "en": "3 · Same answer, different messages",
   "ms": "3 · Jawapan sama, mesej berbeza",
   "zh": "3 · 相同答案，不同消息"
  },
  "intro": {
   "en": "A single warning-sign question can give the same answer for very different messages. Create a pair that exposes a limitation in your own checker, then improve one question and its advice. Use made-up names and non-clickable placeholders such as [link].",
   "ms": "Satu soalan tanda amaran boleh memberi jawapan sama bagi mesej yang sangat berbeza. Cipta sepasang mesej yang menunjukkan batasan penyemak sendiri, kemudian tambah baik satu soalan dan nasihatnya. Gunakan nama rekaan dan penanda bukan pautan seperti [pautan].",
   "zh": "同一个警示特征问题，可能让两条很不同的消息得到相同答案。创作一对能暴露自己检查程序局限的消息，再改进一个问题及建议。使用虚构名字和 [链接] 等不可点击的占位文字。"
  },
  "brief": {
   "en": "Understanding + skills: find a limitation, ask for better evidence and compare the resulting advice.",
   "ms": "Pemahaman + kemahiran: cari batasan, minta bukti lebih baik dan bandingkan nasihat terhasil.",
   "zh": "理解＋技能：发现局限、提出能收集更好证据的问题，并比较产生的建议。"
  },
  "model": {
   "en": "Question: \"Does the message ask you to act urgently?\"\nA: \"Club members: meet in the hall now.\" Context: the teacher confirms the same instruction in person.\nB: \"Your game account closes in five minutes! Send your login code to [account].\" Context: unexpected message from an unknown sender.\nBoth answers are YES. Urgency alone cannot separate them. \"Pause and verify independently\" is useful caution; \"Every urgent message is a scam\" is misleading.\nAn extra question could ask whether the message requests a password or login code. A is NO and B is YES. Even A’s NO does not prove safety in every future case.",
   "ms": "Soalan: \"Adakah mesej meminta anda bertindak segera?\"\nA: \"Ahli kelab: berkumpul di dewan sekarang.\" Konteks: guru mengesahkan arahan sama secara bersemuka.\nB: \"Akaun permainan anda ditutup dalam lima minit! Hantar kod log masuk ke [akaun].\" Konteks: mesej tidak dijangka daripada pengirim tidak dikenali.\nKedua-dua jawapan YES. Desakan sahaja tidak membezakannya. \"Berhenti dan sahkan secara berasingan\" ialah nasihat berhati-hati; \"Semua mesej mendesak ialah penipuan\" mengelirukan.\nSoalan tambahan boleh bertanya sama ada mesej meminta kata laluan atau kod log masuk. A ialah NO dan B ialah YES. NO bagi A pun tidak membuktikan keselamatan bagi setiap kes akan datang.",
   "zh": "问题：“消息是否催促你立刻行动？”\nA：“社团成员：现在到礼堂集合。”背景：老师当面确认了相同指示。\nB：“你的游戏账号将在五分钟后关闭！把登录验证码发给 [账号]。”背景：陌生人意外发来的消息。\n两个答案都是 YES。仅靠紧迫感无法区分。“先停下来，通过独立渠道核实”是有用的提醒；“所有紧急消息都是诈骗”则会误导。\n可以增加一个问题：是否索要密码或登录验证码？A 为 NO，B 为 YES。不过，A 的 NO 仍不能证明以后遇到的所有类似消息都安全。"
  },
  "evidence": [
   {
    "en": "Knowledge: identify the input, condition and output shared by your two messages.",
    "ms": "Pengetahuan: kenal pasti input, syarat dan output yang dikongsi dua mesej.",
    "zh": "知识：识别两条消息共用的输入、条件和输出。"
   },
   {
    "en": "Skills: write an observable extra question and trace both messages again.",
    "ms": "Kemahiran: tulis soalan tambahan yang boleh diperhatikan dan jejak kedua-dua mesej sekali lagi.",
    "zh": "技能：编写一个依据可观察特征的额外问题，再追踪两条消息。"
   },
   {
    "en": "Understanding: explain what the extra evidence helps you decide and what it still cannot prove.",
    "ms": "Pemahaman: terangkan keputusan yang dibantu bukti tambahan dan perkara yang masih tidak dapat dibuktikannya.",
    "zh": "理解：解释新增证据能帮助判断什么，仍不能证明什么。"
   }
  ],
  "items": [
   {
    "id": "ext3_pair",
    "prompt": {
     "en": "Write message A and message B, with a short context for each. Make A independently confirmed by a trusted source; make B concerning or unverified. Both must produce the same YES or NO for your selected question. State that shared answer.",
     "ms": "Tulis mesej A dan B, dengan konteks ringkas bagi setiapnya. A disahkan secara berasingan oleh sumber dipercayai; B membimbangkan atau belum disahkan. Kedua-duanya mesti menghasilkan YES atau NO yang sama bagi soalan dipilih. Nyatakan jawapan sama itu.",
     "zh": "编写消息 A 和 B，并分别说明简短背景。A 已经通过可信独立渠道确认；B 可疑或未经核实。对于所选问题，两者必须得到同一个 YES 或 NO。写出这个共同答案。"
    }
   },
   {
    "id": "ext3_limit",
    "prompt": {
     "en": "Quote the condition and advice your current plan gives both messages. Explain precisely what it cannot distinguish. Is its advice cautious, unhelpful or misleading? Give a reason.",
     "ms": "Petik syarat dan nasihat pelan semasa bagi kedua-dua mesej. Terangkan perkara yang tidak dapat dibezakan. Adakah nasihat berhati-hati, kurang membantu atau mengelirukan? Beri sebab.",
     "zh": "引用当前计划对两条消息执行的条件和建议。准确解释它无法区分什么。建议是谨慎的、无帮助的，还是误导性的？给出理由。"
    }
   },
   {
    "id": "ext3_revision",
    "prompt": {
     "en": "Write one extra question Sam can answer from evidence (not \"Is it a scam?\"). Write YES, NO and UNSURE advice. For A and B, record the new answer, the advice reached and why it is suitable. Do not force different answers if the evidence does not justify them.",
     "ms": "Tulis satu soalan tambahan yang boleh dijawab Sam berdasarkan bukti (bukan \"Adakah ini penipuan?\"). Tulis nasihat YES, NO dan UNSURE. Bagi A dan B, rekod jawapan baharu, nasihat dicapai dan sebab sesuai. Jangan paksa jawapan berbeza jika bukti tidak menyokongnya.",
     "zh": "编写一个 Sam 能依据证据回答的额外问题（不要问“这是诈骗吗？”）。写出 YES、NO 和 UNSURE 建议。分别记录 A、B 的新答案、获得的建议及适用理由。若证据不足，不要强行让两者得到不同答案。"
    }
   },
   {
    "id": "ext3_work",
    "prompt": {
     "en": "Think further: what could still fool this revised question? Describe one remaining uncertainty and a safe next action. Identify evidence for the three checks below and the support you used.",
     "ms": "Fikir lebih jauh: apakah yang masih boleh mengelirukan soalan diubah? Huraikan satu ketidakpastian yang masih ada dan tindakan selamat seterusnya. Kenal pasti bukti bagi tiga semakan di bawah dan bantuan yang digunakan.",
     "zh": "进一步思考：什么情况仍可能使修改后的问题失效？描述一个尚存的不确定因素及安全的下一步。指出下方三项检查的证据，以及你用了什么帮助。"
    }
   }
  ]
 }
];
for(const e of CHALLENGE_TASKS){e.questions=e.items.map(q=>Q(q.id,q.prompt));Object.assign(EXTENSIONS.find(old=>old.id===e.id),e);}
const PYTHON_FIELDS=[];
for(let n=1;n<=3;n++){
PYTHON_FIELDS.push(Q(mainField("pythonCode",n),B(...["en","ms","zh"].map(l=>CHALLENGE.check[l]+" "+n+" · "+{"en": "Python program", "ms": "Program Python", "zh": "Python 程序"}[l]))));
PYTHON_FIELDS.push(Q(mainField("pythonPrediction",n),B(...["en","ms","zh"].map(l=>CHALLENGE.check[l]+" "+n+" · "+{"en": "Before running: list the inputs you will try and predict the exact advice for each. Refer to your pseudocode lines.", "ms": "Sebelum menjalankan: senaraikan input yang akan dicuba dan ramalkan nasihat tepat bagi setiapnya. Rujuk baris pseudokod anda.", "zh": "运行前：列出准备尝试的输入，并预测各自的完整建议。引用你的伪代码行号。"}[l]))));
PYTHON_FIELDS.push(Q(mainField("pythonReflection",n),B(...["en","ms","zh"].map(l=>CHALLENGE.check[l]+" "+n+" · "+{"en": "Compare your saved runs with your prediction. Which line did you change, why, and what happened when you ran it again? Explain any mismatch or help still needed.", "ms": "Bandingkan larian tersimpan dengan ramalan. Baris manakah diubah, mengapa, dan apa berlaku apabila dijalankan semula? Terangkan ketidakpadanan atau bantuan yang masih diperlukan.", "zh": "把保存的运行记录与预测比较。修改了哪一行、为什么修改，再次运行结果如何？解释差异或仍需哪些帮助。"}[l]))));
PYTHON_FIELDS.push(Q(mainField("pythonSupport",n),B(...["en","ms","zh"].map(l=>CHALLENGE.check[l]+" "+n+" · "+{"en": "Evidence check: can you translate input/output, choose the correct branch and explain whether the advice is suitable? For each, cite your work and say independent / with support / need help / not yet attempted.", "ms": "Semakan bukti: bolehkah anda menterjemah input/output, memilih cabang betul dan menerangkan kesesuaian nasihat? Bagi setiapnya, rujuk kerja dan nyatakan sendiri / dengan bantuan / perlu bantuan / belum dicuba.", "zh": "证据检查：能否转换输入／输出、选择正确分支，并解释建议是否合适？逐项引用作品，注明独立／借助帮助／仍需帮助／尚未尝试。"}[l]))));
}
for(const check of REFLECTION.checks){const ids=check.id==="k1"?["ext3_pair","ext3_limit"]:check.id==="k2"?["ext1_front","ext1_back","ext1_mistake"]:check.id==="k3"?["ext1_back","ext1_mistake","ext2_code","ext2_trace"]:check.id.startsWith("s")?["ext2_code","ext2_trace","ext3_revision"]:["ext1_mistake","ext2_work","ext3_limit","ext3_work"];check.after.push(...ids);if(["s2","s3","u2","u3"].includes(check.id))check.after.push(...PYTHON_FIELDS.map(q=>q.id));}
SUBMIT.checks[2]=B("Include your partner’s feedback, your improvement and your learning reflection. Make unfinished work clear; include any extra-time challenge you attempted.","Sertakan maklum balas rakan, penambahbaikan dan refleksi pembelajaran. Jelaskan kerja belum selesai; sertakan cabaran masa tambahan yang dicuba.","包含同伴反馈、改进和学习反思。说明尚未完成的内容，并包含你在额外时间尝试的挑战。");

// Year 10 reference pattern, adapted to the Year 9 message-helper lesson.
// Starting points select today's learning focus; later phases select the next action.
const LEARNING_REVIEW={
 beforeTitle:B('What am I getting better at today?','Apakah yang akan saya tingkatkan hari ini?','今天我要提升什么？'),
 afterTitle:B('Where am I now?','Di manakah saya sekarang?','我现在学到哪一步了？'),
 beforeIntro:B('Look back at your 12 starter answers. Identify what you already knew and what needed the reading or a prompt. Record a starting point for each of the six statements, then choose one focus for today.','Lihat semula 12 jawapan aktiviti mula. Kenal pasti perkara yang sudah diketahui dan yang memerlukan bacaan atau petunjuk. Rekod titik permulaan bagi enam pernyataan, kemudian pilih satu fokus hari ini.','回看开始活动的12道题：哪些原本就会，哪些需要阅读或提醒？为六项陈述选择起点，再选定今天的一个学习重点。'),
 distinction:B('Knowledge: facts and meanings I can recall. Skills: things I can actually do. Understanding: reasons I can explain and apply. You may develop all three; these are not fixed types of learner.','Pengetahuan: fakta dan makna yang boleh diingat. Kemahiran: perkara yang benar-benar boleh dilakukan. Pemahaman: sebab yang boleh diterangkan dan digunakan. Anda boleh mengembangkan ketiga-tiganya; ini bukan jenis pelajar yang tetap.','知识：能回忆的事实和含义。技能：实际能完成的操作。理解：能解释并运用的理由。你可以同时发展三方面；这不是把人分成固定的学习类型。'),
 limits:B('The starter introduces ideas; it does not check whether you can already write a full pseudocode plan or carry out a partner walkthrough. Use “Not sure / not checked yet” when you have no evidence. Something you already know does not have to be your target.','Aktiviti mula memperkenalkan idea; ia tidak menyemak sama ada anda sudah boleh menulis pelan pseudokod penuh atau menjalankan semakan bersama rakan. Gunakan “Tidak pasti / belum disemak” jika tiada bukti. Perkara yang sudah diketahui tidak semestinya menjadi sasaran.','开始活动介绍概念，并未检验你是否已经能编写完整伪代码或开展同伴逐行检查。没有证据时请选择“不确定／尚未检验”。已经掌握的内容不必成为今天的目标。'),
 beforeChoices:{independent:B('Already knew / could do independently','Sudah tahu / boleh buat sendiri','原本就知道／能独立完成'),supported:B('With the reading or a prompt','Dengan bacaan atau petunjuk','借助阅读或提醒'),new:B('New to me','Baharu bagi saya','对我来说是新内容'),unchecked:B('Not sure / not checked yet','Tidak pasti / belum disemak','不确定／尚未检验')},
 phaseChoices:{new:B('New learning — a good struggle','Pembelajaran baharu — cabaran yang membantu','新学习——有收获的努力'),consolidating:B('Consolidating','Mengukuhkan','巩固'),treading:B('Treading water — I need more challenge','Tidak tercabar — perlu cabaran lanjut','原地踏步——需要更多挑战'),help:B('Drowning — I need help','Terlalu sukar — saya perlu bantuan','陷入困难——需要帮助'),notyet:B('Not attempted yet','Belum dicuba','尚未尝试')},
 phaseMeanings:{new:B('This takes effort, but I am making progress with examples or a little support.','Ini memerlukan usaha, tetapi saya maju dengan contoh atau sedikit bantuan.','需要努力，但在示例或少量帮助下正在进步。'),consolidating:B('I am using what I know and becoming more secure through practice.','Saya menggunakan pengetahuan sedia ada dan semakin yakin melalui latihan.','正在运用已有知识，通过练习变得更熟练。'),treading:B('This is already easy and does not stretch me. I need a deeper explanation or a new situation.','Ini sudah mudah dan tidak mencabar. Saya perlukan penjelasan lebih mendalam atau situasi baharu.','这些已经很容易，没有带来挑战，需要更深入的解释或新情境。'),help:B('I am stuck or overwhelmed. I need someone to work through a smaller step with me.','Saya buntu atau terbeban. Saya perlukan seseorang membimbing langkah yang lebih kecil.','感到卡住或难以应对，需要有人一起完成更小的一步。')},
 afterIntro:B('Look at your message investigations, questions, pseudocode and partner feedback. Revisit the same six topics to decide how the learning is going now. You can use your main-task work even if you did not try a further challenge.','Lihat siasatan mesej, soalan, pseudokod dan maklum balas rakan. Semak semula enam topik yang sama untuk menentukan perkembangan pembelajaran sekarang. Gunakan kerja tugasan utama walaupun tidak mencuba cabaran lanjutan.','查看消息分析、设计的问题、伪代码和同伴反馈。回到相同的六个主题，判断现在的学习进展。即使没有尝试进阶挑战，也可以使用主任务作品。'),
 phaseRule:B('Choose a phase for each topic, not one label for the whole lesson. You might be consolidating warning signs while finding pseudocode a good struggle. Correct work can still take effort; an easy task can need more challenge. No score chooses your phase.','Pilih fasa bagi setiap topik, bukan satu label bagi seluruh pelajaran. Anda mungkin mengukuhkan tanda amaran tetapi masih berusaha mempelajari pseudokod. Kerja betul masih boleh memerlukan usaha; tugasan mudah mungkin perlu lebih cabaran. Tiada skor menentukan fasa.','为每个主题选择阶段，不要给整节课只贴一个标签。你可能在巩固警示特征，同时仍在努力学习伪代码。答对也可能很费力；任务太容易则可能需要挑战。分数不会替你决定阶段。'),
 beforePick:B('Choose your starting point','Pilih titik permulaan','选择你的起点'),afterPick:B('Choose your current phase','Pilih fasa semasa','选择现在的学习阶段'),
 overview:B('Your learning focus overview','Gambaran fokus pembelajaran','学习重点概览'),review:B('Your K/S/U review','Semakan pengetahuan, kemahiran dan pemahaman','知识、技能与理解回顾'),
 focus:B('Choose one focus to work on today.','Pilih satu fokus untuk diusahakan hari ini.','选择今天要努力提升的一个重点。'),priority:B('Choose one topic to practise, extend or discuss with your teacher.','Pilih satu topik untuk dilatih, dikembangkan atau dibincangkan dengan guru.','选择一个接下来要练习、拓展或向老师请教的主题。'),
 reason:B('What in your starter answers or discussion helped you choose? Explain what you need to improve and what will help.','Apakah dalam jawapan aktiviti mula atau perbincangan yang membantu pilihan anda? Terangkan perkara yang perlu ditingkatkan dan bantuan yang diperlukan.','开始活动的回答或讨论中，什么证据帮助你作出选择？说明需要提升什么，以及什么能帮助你。'),
 reasonHint:B('For example: “I could explain the YES input in question 6, but choosing a test in question 8 did not show I could carry it out. I will practise following my own plan with a partner in 2F.”','Contohnya: “Saya boleh menerangkan input YES dalam soalan 6, tetapi memilih ujian dalam soalan 8 belum menunjukkan saya boleh menjalankannya. Saya akan berlatih mengikuti pelan sendiri dengan rakan dalam 2F.”','例如：“我能解释第6题的 YES 输入，但第8题选对测试方法，并不表示已经能执行。我会在 2F 与同伴练习逐行检查自己的计划。”'),
 evidence:B('What in your work supports this phase and next step?','Apakah bukti kerja yang menyokong fasa dan langkah seterusnya?','作品中什么证据支持你选择的阶段和下一步？'),
 evidenceHint:B('Name a question, line or walkthrough result. Explain the progress or difficulty, the support you used and your next action. For example: “Earlier I needed the model to choose advice. In 2F I followed both routes independently, but I still paused at ELSE. I am consolidating; next I will trace a different input without the model.”','Nyatakan soalan, baris atau hasil semakan. Terangkan kemajuan atau kesukaran, bantuan yang digunakan dan tindakan seterusnya. Contohnya: “Dahulu saya perlukan model untuk memilih nasihat. Dalam 2F saya mengikuti kedua-dua laluan sendiri, tetapi masih teragak-agak pada ELSE. Saya sedang mengukuhkan; seterusnya saya akan menjejak input lain tanpa model.”','指出问题、代码行或逐行检查结果，解释进步或困难、使用的帮助及下一步。例如：“之前需要示例才能选择建议。在 2F 我独立走通了两条路径，但仍在 ELSE 处犹豫。我在巩固，接下来会不看示例追踪另一个输入。”'),
 supportLabel:B('For that piece of work, how much support did you need?','Bagi bukti kerja itu, berapa banyak bantuan diperlukan?','完成这项证据所对应的作品时，需要多少帮助？'),
 supportChoices:{independent:B('Independently','Secara sendiri','独立完成'),supported:B('With an example or reminder','Dengan contoh atau peringatan','借助示例或提醒'),help:B('Attempted, but still need help','Sudah mencuba, masih perlu bantuan','已尝试，仍需帮助'),notyet:B('Not attempted yet','Belum dicuba','尚未尝试')},
 selfReport:B('Counts describe your recorded choices, not verified marks. An unanswered check is not a failure. Use your work to support your judgment; you can continue when unsure.','Bilangan menerangkan pilihan direkod, bukan markah yang disahkan. Semakan tidak dijawab bukan kegagalan. Gunakan kerja untuk menyokong penilaian; anda boleh meneruskan walaupun tidak pasti.','数量描述的是已记录的自评选择，不是经核实的分数。未回答不等于失败。请用作品支持判断；不确定时也可以继续。'),
 showEvidence:B('Look back at my recorded work','Lihat semula kerja direkod','回看已记录的作品'),
 emptyFocus:B('Choose your own focus. Build on what you already know; use your starter or a discussion to explain the choice.','Pilih fokus sendiri. Bina atas pengetahuan sedia ada; gunakan aktiviti mula atau perbincangan untuk menerangkan pilihan.','自行选择重点，在已有知识基础上进步，并用开始活动或讨论说明选择理由。'),
 emptyPriority:B('Choose a topic using your work and the phase suggestions above.','Pilih topik menggunakan kerja dan cadangan fasa di atas.','依据作品和上方各阶段的建议选择主题。'),
 noStart:B('No starting focus was recorded. You can still review the work you have done today.','Tiada fokus awal direkod. Anda masih boleh menyemak kerja hari ini.','尚未记录起始重点，你仍可以回顾今天完成的作品。'),
 noPhase:B('Choose a phase for this topic above, or explain your uncertainty to your teacher.','Pilih fasa bagi topik ini di atas, atau terangkan ketidakpastian kepada guru.','先在上方为这个主题选择阶段，或向老师说明不确定之处。'),
 helpNotice:B('Need help now? Show your teacher the statement and the first confusing line or question. You do not need to finish every check first. Saving here does not send an alert.','Perlu bantuan sekarang? Tunjukkan pernyataan serta baris atau soalan pertama yang mengelirukan kepada guru. Tidak perlu menyiapkan semua semakan dahulu. Menyimpan di sini tidak menghantar amaran.','现在需要帮助？把这项陈述和第一个不明白的代码行或问题给老师看，无需先完成所有检查。在这里保存不会自动通知老师。')
};
const LEARNING_TOPICS=[
 {id:'signs',area:'k',legacy:['k1'],title:B('Recognising warning signs','Mengenali tanda amaran','识别警示特征'),statement:B('I can identify pressure and another warning sign in a message, and state what phishing means.','Saya boleh mengenal pasti desakan dan satu tanda amaran lain dalam mesej, serta menyatakan maksud phishing.','我能识别消息中的催促和另一种警示特征，并说明网络钓鱼的含义。'),
 before:B('Use starter questions 1–3. Could you explain your clues, or did the reading or feedback show you what to look for?','Gunakan soalan mula 1–3. Bolehkah anda menerangkan petunjuk, atau adakah bacaan atau maklum balas menunjukkan perkara yang perlu dicari?','参考开始活动第1–3题。你能解释线索，还是需要阅读或反馈提示应寻找什么？'),
 after:B('Use two of the 1A messages. Quote the wording that creates pressure or asks for account information; explain the clue, not just your scam/not-scam choice.','Gunakan dua mesej 1A. Petik perkataan yang mendesak atau meminta maklumat akaun; terangkan petunjuk, bukan sekadar pilihan penipuan/bukan penipuan.','使用 1A 中的两条消息，引用造成催促或索要账户信息的措辞。解释线索，不要只给出诈骗／非诈骗选项。'),start:B('In 1A, compare two messages. Highlight a warning sign and explain what it encourages Sam to do.','Dalam 1A, bandingkan dua mesej. Tandakan tanda amaran dan terangkan tindakan yang digalakkan kepada Sam.','在 1A 比较两条消息，标出警示特征，并解释它在诱导 Sam 做什么。')},
 {id:'parts',area:'k',legacy:['k2','k3'],title:B('Input, decision and output','Input, keputusan dan output','输入、判断与输出'),statement:B('I can identify the YES/NO input, the IF condition and the advice output, and explain what TRUE and FALSE mean for that condition.','Saya boleh mengenal pasti input YES/NO, syarat IF dan output nasihat, serta menerangkan TRUE dan FALSE bagi syarat itu.','我能识别 YES/NO 输入、IF 条件与建议输出，并解释该条件中的 TRUE 和 FALSE。'),
 before:B('Use starter questions 6–7 for input and output. They did not check every pseudocode keyword. It is fine if IF, ELSE or TRUE/FALSE are still new.','Gunakan soalan mula 6–7 bagi input dan output. Soalan itu tidak menyemak semua kata kunci pseudokod. Tidak mengapa jika IF, ELSE atau TRUE/FALSE masih baharu.','参考第6–7题的输入和输出。这两题没有检验所有伪代码关键词；IF、ELSE 或 TRUE/FALSE 仍是新内容也没关系。'),
 after:B('Use 2A–2B or your own 2D plan. Point to the stored answer and the comparison. For YES and NO, say whether the condition is TRUE or FALSE and which advice follows.','Gunakan 2A–2B atau pelan 2D sendiri. Tunjuk jawapan disimpan dan perbandingan. Bagi YES dan NO, nyatakan TRUE atau FALSE dan nasihat yang diikuti.','参考 2A–2B 或自己的 2D 计划。指出保存的答案和比较条件；分别说明 YES、NO 时条件为 TRUE 还是 FALSE，以及执行哪条建议。'),start:B('In 2A, label the received answer, the IF comparison and the displayed advice. Use the line explanations for unfamiliar keywords.','Dalam 2A, label jawapan diterima, perbandingan IF dan nasihat dipaparkan. Gunakan penjelasan baris bagi kata kunci yang belum dikenali.','在 2A 标出接收的答案、IF 比较和显示的建议，借助逐行说明弄清不熟悉的关键词。')},
 {id:'questions',area:'s',legacy:['s1'],title:B('Writing questions and advice','Menulis soalan dan nasihat','编写问题与建议'),statement:B('I can write an observable YES/NO question and two useful advice outputs for Sam.','Saya boleh menulis soalan YES/NO yang boleh diperhatikan serta dua output nasihat berguna untuk Sam.','我能根据可观察特征编写 YES/NO 问题，并为 Sam 写出两条有用的建议输出。'),
 before:B('Question 5 asks you to choose a question, not write one. Question 11 gives practice rewriting advice. Use what you actually wrote; do not assume a correct choice proves the whole skill.','Soalan 5 meminta anda memilih soalan, bukan menulisnya. Soalan 11 melatih penulisan semula nasihat. Gunakan kerja sebenar; pilihan betul tidak membuktikan seluruh kemahiran.','第5题是选择问题，并非自己编写；第11题练习改写建议。请依据实际写出的内容判断，不能因为选择题正确就认为整项技能已掌握。'),
 after:B('Use your 1E question and 1F advice. Could a partner answer the question without extra explanation? Point to a specific action in each output and any wording you improved.','Gunakan soalan 1E dan nasihat 1F. Bolehkah rakan menjawab tanpa penjelasan tambahan? Tunjuk tindakan khusus dalam setiap output dan perkataan yang ditambah baik.','使用自己的 1E 问题和 1F 建议。同伴能否不听额外解释就回答？指出每条输出中的具体行动，以及你改进过的措辞。'),start:B('Use 1D to improve a vague question, then write your own in 1E. In 1F, make both answers lead to a specific next action.','Gunakan 1D untuk membaiki soalan kabur, kemudian tulis soalan sendiri dalam 1E. Dalam 1F, beri tindakan khusus bagi kedua-dua jawapan.','先在 1D 改进模糊问题，再到 1E 编写自己的问题，在 1F 为两种答案写出具体行动。')},
 {id:'walkthrough',area:'s',legacy:['s2','s3'],title:B('Writing and checking pseudocode','Menulis dan menyemak pseudokod','编写并逐行检查伪代码'),statement:B('I can sequence a pseudocode plan, predict its advice, follow both routes with a partner and use feedback to improve it.','Saya boleh menyusun pelan pseudokod, meramal nasihat, mengikuti kedua-dua laluan dengan rakan dan menggunakan maklum balas untuk menambah baik.','我能按顺序编写伪代码计划、预测建议、与同伴走通两条路径，并根据反馈改进。'),
 before:B('Question 8 checks your choice of a testing method. The starter has not asked you to write and walk through a complete plan. Use earlier practical experience, or choose new / not checked yet.','Soalan 8 menyemak pilihan kaedah ujian. Aktiviti mula belum meminta anda menulis dan menyemak pelan lengkap. Gunakan pengalaman amali terdahulu, atau pilih baharu / belum disemak.','第8题检验测试方法的选择，开始活动尚未要求编写并逐行检查完整计划。可依据以前的实践经验，或选择新内容／尚未检验。'),
 after:B('Use 2D, 2F and 2G. Show one YES and one NO walkthrough: predicted advice, lines followed/skipped, actual advice and comparison. Identify the line revised after feedback, or the first line you still cannot follow.','Gunakan 2D, 2F dan 2G. Tunjuk semakan YES dan NO: ramalan, baris diikuti/dilangkau, nasihat sebenar dan perbandingan. Kenal pasti baris diubah selepas maklum balas, atau baris pertama yang masih sukar.','使用 2D、2F 和 2G：展示 YES、NO 的预测建议、执行／跳过的行、实际建议和比较。指出根据反馈修改的一行，或第一处仍然跟不上的地方。'),start:B('Practise sequence in 2C, write one check in 2D, then ask a partner to follow it literally in 2F. Start with one input before trying the other.','Latih urutan dalam 2C, tulis satu semakan dalam 2D, kemudian minta rakan mengikutnya secara tepat dalam 2F. Mulakan dengan satu input sebelum mencuba yang lain.','在 2C 练习顺序，在 2D 编写一项检查，再请同伴在 2F 严格逐行执行。先用一个输入，再试另一个。')},
 {id:'advice',area:'u',legacy:['u1','u3'],title:B('Explaining why advice helps','Menerangkan sebab nasihat membantu','解释建议为什么有用'),statement:B('I can explain why my question and advice address Sam’s situation, and why a change makes the advice more useful.','Saya boleh menerangkan sebab soalan dan nasihat sesuai dengan situasi Sam, serta sebab perubahan menjadikan nasihat lebih berguna.','我能解释问题和建议为什么适合 Sam 的情境，以及修改为什么让建议更有用。'),
 before:B('Use questions 11–12. Did you explain the reason for a safe next action, or just say “it is safer”? Knowing the advice and explaining why it fits are different.','Gunakan soalan 11–12. Adakah anda menerangkan sebab tindakan selamat, atau hanya berkata “lebih selamat”? Mengetahui nasihat berbeza daripada menerangkan kesesuaiannya.','参考第11–12题。你说明了安全行动的理由，还是只说“这样更安全”？知道建议与解释建议为何适合是两回事。'),
 after:B('Use your 1C explanation, 1F advice or 2G improvement. Link the message’s risk to Sam’s next action: what could happen, what should he check, and why does the change help?','Gunakan penjelasan 1C, nasihat 1F atau penambahbaikan 2G. Kaitkan risiko mesej dengan tindakan Sam: apa boleh berlaku, apa perlu disemak dan mengapa perubahan membantu?','使用 1C 说明、1F 建议或 2G 改进，把消息风险与 Sam 的行动联系起来：可能发生什么、应核实什么、修改为何有帮助？'),start:B('In 1C and 1F, finish: “This sign matters because… My advice helps Sam…”. In 2G, use partner feedback to explain one improvement.','Dalam 1C dan 1F, lengkapkan: “Tanda ini penting kerana… Nasihat saya membantu Sam…”. Dalam 2G, gunakan maklum balas rakan untuk menerangkan satu penambahbaikan.','在 1C 和 1F 补全：“这个特征值得注意，因为……我的建议帮助 Sam……”。到 2G 用同伴反馈解释一项改进。')},
 {id:'limits',area:'u',legacy:['u2'],title:B('Explaining a checker’s limits','Menerangkan batasan penyemak','解释检查程序的局限'),statement:B('I can explain why NO does not mean safe and why matching outputs do not prove that a sender is genuine.','Saya boleh menerangkan sebab NO tidak bermaksud selamat dan output sepadan tidak membuktikan pengirim itu sah.','我能解释为什么 NO 不代表安全，以及输出符合预测为什么不能证明发送者真实可信。'),
 before:B('Use questions 9–11. Could you explain the urgent school message and improve “No pressure, so it is safe”? Use a reason or example, not just the phrase “cannot prove safety”.','Gunakan soalan 9–11. Bolehkah anda menerangkan mesej sekolah yang mendesak dan membaiki “Tiada desakan, jadi selamat”? Gunakan sebab atau contoh, bukan sekadar “tidak membuktikan keselamatan”.','参考第9–11题。你能解释紧急学校消息，并改进“没有催促，所以安全”吗？请用理由或例子说明，不要只重复“不能证明安全”。'),
 after:B('Use 1A messages, your NO advice, or a further challenge. Give two different messages that could produce the same answer. Explain what the checker has not verified and how Sam can check independently.','Gunakan mesej 1A, nasihat NO atau cabaran lanjutan. Beri dua mesej berbeza yang boleh menghasilkan jawapan sama. Terangkan perkara yang belum disahkan dan cara Sam menyemak secara berasingan.','使用 1A 消息、自己的 NO 建议或进阶挑战。举出两条可能得到相同答案的不同消息，解释程序没有核实什么，以及 Sam 可以怎样通过独立渠道核实。'),start:B('Compare the school and suspicious messages in 1A. In 1F, make your NO advice explain what still needs checking.','Bandingkan mesej sekolah dan mesej mencurigakan dalam 1A. Dalam 1F, pastikan nasihat NO menerangkan perkara yang masih perlu disemak.','在 1A 比较学校消息与可疑消息，到 1F 让 NO 建议说明仍需核实什么。')}
];
for(const t of LEARNING_TOPICS){const old=REFLECTION.checks.find(c=>c.id===t.legacy[0]);t.actions={new:old.help,consolidating:old.practice,treading:old.challenge,help:B(...['en','ms','zh'].map(l=>({en:'Ask your teacher for one guided step: ',ms:'Minta satu langkah berpandu daripada guru: ',zh:'请老师引导你完成一小步：'}[l])+old.help[l]))};}
LEARNING_TOPICS.find(t=>t.id==='limits').actions.treading=B('Use Challenge 3, Same answer, different messages. Create your pair, add an observable question and explain the remaining uncertainty.','Gunakan Cabaran 3, Jawapan sama, mesej berbeza. Cipta pasangan mesej, tambah soalan yang boleh diperhatikan dan terangkan ketidakpastian yang masih ada.','完成挑战三“相同答案，不同消息”：创作消息对、增加可观察的问题，并解释仍存的不确定性。');
const LEARNING_FIELDS={before:[],after:[]};
for(const moment of ['before','after']){
 const card=CARDS[moment==='before'?1:13],prefix=moment==='before'?'lt2':'lp2';card.title=LEARNING_REVIEW[moment==='before'?'beforeTitle':'afterTitle'];card.read=[];
 const choices=moment==='before'?LEARNING_REVIEW.beforeChoices:LEARNING_REVIEW.phaseChoices;
 for(const t of LEARNING_TOPICS)LEARNING_FIELDS[moment].push(Q(prefix+'_'+t.id,B(...['en','ms','zh'].map(l=>REFLECTION.areas.find(a=>a.id===t.area).label[l]+' · '+t.statement[l])),Object.entries(choices).map(([value,label])=>({value,label}))));
 LEARNING_FIELDS[moment].push(Q(prefix+'_focus',moment==='before'?LEARNING_REVIEW.focus:LEARNING_REVIEW.priority,LEARNING_TOPICS.map(t=>({value:t.id,label:B(...['en','ms','zh'].map(l=>REFLECTION.areas.find(a=>a.id===t.area).label[l]+': '+t.title[l]))}))));
 LEARNING_FIELDS[moment].push(Q(prefix+'_evidence',moment==='before'?LEARNING_REVIEW.reason:LEARNING_REVIEW.evidence,null,{hint:moment==='before'?LEARNING_REVIEW.reasonHint:LEARNING_REVIEW.evidenceHint}));
 if(moment==='after')LEARNING_FIELDS.after.push(Q('lp2_support',LEARNING_REVIEW.supportLabel,Object.entries(LEARNING_REVIEW.supportChoices).map(([value,label])=>({value,label}))));
 card.questions.push(...LEARNING_FIELDS[moment]);
}
LEARNING_REVIEW.beforeCountLabels={independent:B('Independent','Sendiri','独立'),supported:B('With prompting','Dengan petunjuk','借助提醒'),new:B('New','Baharu','新内容'),unchecked:B('Not sure / not checked','Tidak pasti / belum disemak','不确定／未检验')};
LEARNING_REVIEW.phaseCountLabels={new:B('New learning','Pembelajaran baharu','新学习'),consolidating:B('Consolidating','Mengukuhkan','巩固'),treading:B('Need challenge','Perlu cabaran','需要挑战'),help:B('Need help','Perlu bantuan','需要帮助'),notyet:B('Not attempted','Belum dicuba','尚未尝试')};
const LEARNING_HELP={
 signs:B('Show your teacher one 1A message. Ask them to locate one pressure phrase with you, then explain what it asks Sam to do.','Tunjukkan satu mesej 1A kepada guru. Minta guru mencari satu frasa desakan bersama anda, kemudian terangkan tindakan yang diminta daripada Sam.','向老师展示 1A 的一条消息，一起找到一句催促的话，再解释它要求 Sam 做什么。'),
 parts:B('Show your teacher the IF line. Use the answer NO and compare it with "YES" together before deciding whether the condition is TRUE or FALSE.','Tunjukkan baris IF kepada guru. Gunakan jawapan NO dan bandingkan bersama "YES" sebelum menentukan TRUE atau FALSE.','把 IF 行给老师看，一起将答案 NO 与 "YES" 比较，再判断条件是 TRUE 还是 FALSE。'),
 questions:B('Bring one unclear 1E question to your teacher. Ask for help making it about something Sam can observe, then try writing just its YES advice.','Bawa satu soalan 1E yang kabur kepada guru. Minta bantuan menjadikannya tentang sesuatu yang boleh diperhatikan Sam, kemudian cuba menulis nasihat YES sahaja.','把 1E 中一个不清楚的问题带给老师，请老师帮助改成 Sam 能观察到的特征，再尝试只写 YES 建议。'),
 walkthrough:B('Show your teacher the first line you cannot follow in 2F and the input you chose. Ask to trace that one line before continuing the route.','Tunjukkan baris pertama yang tidak dapat diikuti dalam 2F serta input dipilih kepada guru. Minta guru menjejak satu baris itu sebelum meneruskan laluan.','给老师看 2F 中第一处跟不上的代码行和所选输入，请老师先带你走通这一行，再继续路径。'),
 advice:B('Show your teacher one advice output. Ask them to help link it to the risk in the message: what could happen if Sam followed the request?','Tunjukkan satu output nasihat kepada guru. Minta bantuan mengaitkannya dengan risiko mesej: apa boleh berlaku jika Sam mengikuti permintaan?','给老师看一条建议输出，请老师帮助把它与消息风险联系起来：Sam 若照着请求行动，可能发生什么？'),
 limits:B('Ask your teacher to compare an urgent school message with an urgent suspicious message. Both give YES: what information about the sender is still missing?','Minta guru membandingkan mesej sekolah mendesak dengan mesej mencurigakan mendesak. Kedua-duanya YES: apakah maklumat pengirim yang masih tiada?','请老师一起比较紧急学校消息与紧急可疑消息。两者都得到 YES，还有什么关于发送者的信息没有核实？')
};
for(const t of LEARNING_TOPICS)t.actions.help=LEARNING_HELP[t.id];
