"use strict";
(() => {
  const ui={
    title:["Quick reading", "快速复习", "빠른 복습"],
    intro:["Optional · about 2 minutes. Read one example at a time. You don’t need to type or submit anything.", "选读 · 约 2 分钟。每次阅读一个例子，无需输入或提交。", "선택 활동 · 약 2분. 예시를 하나씩 읽으세요. 입력하거나 제출할 필요는 없습니다."],
    prev:["Previous topic", "上一个主题", "이전 주제"],
    next:["Next topic", "下一个主题", "다음 주제"],
    output:["What you see", "运行结果", "화면에 나오는 결과"]
  };
  const cards=[
    {
      title:["Values and data types","值和数据类型","값과 자료형"],
      text:["12 is a whole number (int). Quotes make \"12\" text (str). True is a Boolean (bool). 1.5 is a decimal number (float).",
            "12 是整数（int）。引号使 \"12\" 成为字符串（str）。True 是布尔值（bool）。1.5 是浮点数（float）。",
            "12는 정수(int)입니다. 따옴표가 있는 \"12\"는 문자열(str)입니다. True는 불리언(bool)이고, 1.5는 실수(float)입니다."],
      code:'lives = 12\nlobby = "12"\nready = True\nspeed = 1.5'
    },
    {
      title:["Input and output","输入和输出","입력과 출력"],
      text:["input() reads text. If you need to do maths with that text, convert it using int(). print() displays a result.",
            "input() 读取文本。若要用这段文本进行计算，先用 int() 转成整数。print() 显示结果。",
            "input()은 입력을 문자열로 읽습니다. 계산하려면 int()로 정수로 바꾸세요. print()는 결과를 보여 줍니다."],
      code:'snacks = input()\nprint(int(snacks) + 2)',
      result:["If you type 5, the program prints 7.","如果输入 5，程序会输出 7。","5를 입력하면 프로그램이 7을 출력합니다."]
    },
    {
      title:["Lists and indexes","列表和索引","리스트와 인덱스"],
      text:["A list stores items in order. Index 0 is the first item. len() counts items; it doesn’t tell you the last index.",
            "列表按顺序存放元素。第一个元素的索引为 0。len() 返回元素数量，而不是最后一个索引。",
            "리스트는 항목을 순서대로 저장합니다. 첫 번째 인덱스는 0입니다. len()은 항목 수를 세며, 마지막 인덱스를 알려 주지는 않습니다."],
      code:'teams = ["fox", "owl", "lynx", "bear"]\nprint(teams[0])\nprint(len(teams))',
      resultText:'fox\n4'
    },
    {
      title:["Replace or append?","替换还是追加？","바꾸기와 추가하기"],
      text:["Assigning to an existing index replaces one item. append() adds a new item at the end.",
            "给现有索引赋值会替换一个元素。append() 会在列表末尾添加一个新元素。",
            "기존 인덱스에 값을 넣으면 항목 하나를 바꿉니다. append()는 리스트 맨 뒤에 새 항목을 추가합니다."],
      code:'colours = ["purple", "teal"]\ncolours[0] = "black"\ncolours.append("white")',
      result:["The list now stores black, teal, white. Nothing is printed because there’s no print().","列表现在包含 black、teal、white。代码没有 print()，所以屏幕不会显示输出。","리스트에는 이제 black, teal, white가 들어 있습니다. print()가 없어서 화면에 출력되지는 않습니다."]
    },
    {
      title:["Conditions and indentation","条件和缩进","조건과 들여쓰기"],
      text:["Use = to store a value and == to compare two values. An if line ends with a colon. Indent the code that should run only when the condition is true.",
            "用 = 保存值，用 == 比较两个值。if 行以冒号结尾。只在条件为真时执行的代码需要缩进。",
            "값을 저장할 때는 =, 비교할 때는 ==를 씁니다. if 줄 끝에는 콜론을 붙입니다. 조건이 참일 때만 실행할 코드는 들여쓰기합니다."],
      code:'mode = "music"\nif mode == "music":\n    print("Play sound")',
      resultText:'Play sound'
    }
  ];
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function mount(el,{lang=0,page=0,onPage=()=>{}}={}){
    if(!el)return;
    if(![0,1,2].includes(lang))lang=0;
    const loc=values=>escape(values[0])+(lang?' <span class="quick-review-inline" lang="'+(lang===1?"zh-Hans":"ko")+'">'+escape(values[lang])+'</span>':"");
    const reading=values=>'<p>'+escape(values[0])+'</p>'+(lang?'<p class="quick-review-translation" lang="'+(lang===1?"zh-Hans":"ko")+'">'+escape(values[lang])+'</p>':"");
    let i=Math.max(0,Math.min(cards.length-1,page));
    el.innerHTML='<section class="quick-review" aria-label="'+escape(ui.title[0])+'"><h2>'+loc(ui.title)+'</h2>'+reading(ui.intro)+
      '<div class="quick-review-card"></div><nav class="quick-review-nav" aria-label="Revision topics"><button class="secondary" type="button" data-step="-1">'+loc(ui.prev)+'</button><span class="quick-review-count" role="status"></span><button class="secondary" type="button" data-step="1">'+loc(ui.next)+'</button></nav></section>';
    const content=el.querySelector(".quick-review-card"),count=el.querySelector(".quick-review-count"),steps=[...el.querySelectorAll("[data-step]")];
    function paint(){
      const card=cards[i];
      content.innerHTML='<h3>'+loc(card.title)+'</h3>'+reading(card.text)+'<pre><code>'+escape(card.code)+'</code></pre>'+
        (card.result||card.resultText?'<div class="quick-review-result"><strong>'+loc(ui.output)+'</strong>'+
          (card.result?reading(card.result):'<pre><code>'+escape(card.resultText)+'</code></pre>')+'</div>':'');
      count.textContent=(i+1)+' / '+cards.length;
      count.setAttribute("aria-label","Topic "+(i+1)+" of "+cards.length+": "+card.title[lang]);
      steps[0].setAttribute("aria-disabled",String(i===0));steps[1].setAttribute("aria-disabled",String(i===cards.length-1));
    }
    steps.forEach(button=>{button.addEventListener("click",()=>{
      const next=i+Number(button.dataset.step);
      if(next<0||next>=cards.length)return;
      i=next;onPage(i);paint();
    });});
    paint();
  }
  window.Year8QuickReview={mount};
})();
