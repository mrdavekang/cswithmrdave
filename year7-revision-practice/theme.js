(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const storage = 'y7-revision-theme';
  const presets = [
    ['original','#161616','Black & white','黑白'],
    ['ocean','#185ca4','Ocean blue','海洋蓝'],
    ['forest','#21684c','Forest green','森林绿'],
    ['berry','#782b89','Berry purple','莓果紫'],
    ['brick','#a03624','Brick red','砖红']
  ];
  const copy = [
    ['theme-label','Theme','配色'],
    ['theme-heading','Make it yours','自定义配色'],
    ['theme-help','Choose an accent for buttons and progress. The background stays white.','为按钮和进度条选择颜色。背景保持白色。'],
    ['theme-legend','Accent colours','主题色'],
    ['theme-custom-label','Pick any colour','自选颜色'],
    ['theme-contrast','Light colours are darkened on buttons so the text stays readable.','浅色会自动加深，保证按钮文字清晰。'],
    ['theme-done','Done','完成']
  ];
  const palette = new Map(presets.map(([id,hex])=>[id,hex]));
  const stored = window.REVISION_CLOUD.read(storage);
  let current = palette.has(stored?.id)||stored?.id==='custom' ? stored.id : 'original';
  let custom = /^#[0-9a-f]{6}$/i.test(stored?.custom||'') ? stored.custom.toLowerCase() : '#a03624';
  const menu = $('theme'), toggle = $('theme-toggle'), choices = $('theme-choices'), input = $('theme-colour');
  const customLabel = input.closest('label');
  input.value = custom;

  for (const [id,hex] of presets) {
    const label = document.createElement('label');
    label.className = 'theme-option';
    label.style.setProperty('--swatch',hex);
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'pupil-theme';
    radio.value = id;
    const swatch = document.createElement('span');
    swatch.className = 'theme-dot';
    swatch.setAttribute('aria-hidden','true');
    const name = document.createElement('span');
    name.id = 'theme-name-'+id;
    label.append(radio,swatch,name);
    choices.append(label);
  }

  const linear = channel => {
    const v = channel/255;
    return v<=.04045 ? v/12.92 : ((v+.055)/1.055)**2.4;
  };
  function readable(hex) {
    let channels = [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
    const luminance = () => .2126*linear(channels[0])+.7152*linear(channels[1])+.0722*linear(channels[2]);
    while (1.05/(luminance()+.05)<4.8) channels=channels.map(x=>Math.floor(x*.95));
    return '#'+channels.map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  function apply(save=false) {
    const picked = current==='custom' ? custom : palette.get(current);
    const colour = readable(picked);
    document.documentElement.style.setProperty('--theme-accent',colour);
    for (const radio of choices.querySelectorAll('input')) radio.checked = radio.value===current;
    customLabel.toggleAttribute('data-current',current==='custom');
    $('theme-contrast').hidden = colour===picked;
    if(save) window.REVISION_CLOUD.write(storage,{id:current,custom});
  }
  function chooseCustom() {
    if(!/^#[0-9a-f]{6}$/i.test(input.value)) return;
    custom=input.value.toLowerCase();
    current='custom';
    apply(true);
  }
  function close(refocus=false) {
    menu.open=false;
    if(refocus) toggle.focus();
  }
  function setBilingual(bilingual) {
    const text = (en,zh)=>bilingual ? en+' · '+zh : en;
    for (const [id,en,zh] of copy) $(id).textContent=text(en,zh);
    for (const [id,,en,zh] of presets) $('theme-name-'+id).textContent=text(en,zh);
  }
  choices.addEventListener('change',event=>{
    if(!palette.has(event.target.value)) return;
    current=event.target.value;
    apply(true);
  });
  input.addEventListener('input',chooseCustom);
  input.addEventListener('change',chooseCustom);
  $('theme-done').addEventListener('click',()=>close(true));
  document.addEventListener('pointerdown',event=>{
    if(menu.open&&!menu.contains(event.target)) close();
  });
  menu.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&menu.open) {
      event.preventDefault();
      close(true);
    }
  });
  window.REVISION_THEME = {setBilingual};
  setBilingual(false);
  apply();
})();
