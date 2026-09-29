const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/Users/tenbywork/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1050}});const errors=[];
 await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LESSON_URL||'http://127.0.0.1:8786/?teacher=1');
 await page.waitForSelector('#entry');
 await page.locator('[name=name]').fill('Preview Student');await page.locator('[name=className]').fill('9 Test');await page.locator('#entry button[type=submit]').click();
 assert.equal(await page.evaluate(()=>STARTER.length),3);
 for(const lang of ['en','ms','zh']){
  for(const route of ['read','starter','types','pause','challenge','pit','plenary']){await page.evaluate(({lang,route})=>{state.lang=lang;state.page=route;render();},{lang,route});assert.ok((await page.locator('#main').innerText()).length>80);}
  for(const route of ['main1','main2'])for(let step=0;step<6;step++){await page.evaluate(({lang,route,step})=>{state.lang=lang;state.page=route;state.gentle.step[route]=step;render();},{lang,route,step});assert.equal(await page.locator('.focus-steps button').count(),6);assert.ok(await page.locator('#focus-active').isVisible());}
 }
 await page.evaluate(()=>{state.lang='en';state.page='main1';state.gentle.step.main1=0;render();});
 await page.locator('[data-primm-move=g_calc]:not(:disabled)').first().click();
 assert.equal(await page.locator('.gentle-active').count(),1);
 await page.evaluate(()=>{state.page='main1';state.gentle.step.main1=3;render();});
 for(let i=0;i<4;i++)await page.locator('[data-g-trace=advice][data-delta="1"]').click();
 assert.equal(await page.locator('.gentle-skipped').count(),2);
 await page.evaluate(()=>{state.page='main2';state.gentle.step.main2=5;render();});
 await page.locator('[data-g-condition="<="]').click();
 await page.evaluate(()=>{state.gentle.step.main2=4;render();});await page.locator('[data-g-message]').click();
 await page.evaluate(()=>{state.gentle.step.main2=5;render();});
 for(const id of ['g20','g12','g11','gneg']){await page.locator(`[data-g-test=${id}]`).click();await page.waitForFunction(id=>!batch&&state.tests[id],id);assert.equal(await page.evaluate(id=>state.tests[id].pass,id),true,id);}
 // Real worker: blank, word and zero, plus no silent acceptance of a decimal.
 for(const value of ['','two','0','2.5']){
  const out=await page.evaluate(value=>new Promise(resolve=>{const w=createPythonWorker();let output='';w.onmessage=({data:d})=>{if(d.type==='input')w.postMessage({type:'input',id:d.id,value});else if(d.type==='output')output+=d.text;else if(d.type==='done'||d.type==='error'){w.terminate();resolve({output,error:d.error});}};w.postMessage({type:'run',code:state.code.main});}),value);
  assert.equal(out.error,undefined);assert.ok(out.output.includes(value==='0'?'Another time':'Enter a whole number'),JSON.stringify(out));
 }
 // Regression: strict < must fail the boundary test.
 await page.locator('[data-g-condition="<"]').click();await page.locator('[data-g-test=g12]').click();await page.waitForFunction(()=>!batch&&state.tests.g12);assert.equal(await page.evaluate(()=>state.tests.g12.pass),false);
 await page.locator('[data-g-condition="<="]').click();
 await page.evaluate(()=>{state.page='plenary';render();});assert.equal(await page.locator('#pdf').count(),1);assert.equal(await page.locator('.primm-question').count(),3);
 assert.ok(await page.evaluate(()=>report().includes('Not attempted')));
 // Old work is preserved on migration, and remains stable on repeated rendering.
 await page.evaluate(()=>{delete state.gentle;state.code.main='print("old work")';state.tests={old:{output:'kept'}};render();render();});
 assert.equal(await page.evaluate(()=>state.gentle.previous.code.main),'print("old work")');assert.equal(await page.evaluate(()=>state.gentle.previous.tests.old.output),'kept');
 assert.equal(await page.evaluate(()=>matchKai('NG JUN KAI')),true);
 await page.evaluate(()=>{state.page='read';render();});await page.screenshot({path:'/tmp/y9-read.png',fullPage:true});
 await page.evaluate(()=>{state.page='main2';state.gentle.step.main2=5;render();});await page.screenshot({path:'/tmp/y9-main2.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{state.page='read';render();});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const pupil=await browser.newPage({viewport:{width:1440,height:1000}});
 await pupil.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 await pupil.goto('http://127.0.0.1:8786/');await pupil.locator('[name=name]').fill('NG JUN KAI');await pupil.locator('[name=className]').fill('Test');await pupil.locator('#entry button[type=submit]').click();assert.equal(await pupil.evaluate(()=>state.guided),true);
 await pupil.evaluate(()=>{state.page='main2';state.gentle.step.main2=2;render();});await pupil.locator('[data-run=main]').click();await pupil.waitForSelector('#input-main:not([hidden])');await pupil.locator('#input-main input').fill('-1');await pupil.locator('#input-main button').click();await pupil.waitForFunction(()=>!live&&state.runs.length>0);assert.ok((await pupil.locator('#console-main').innerText()).includes('Bad input'));
 await pupil.evaluate(()=>{state.page='main2';state.gentle.step.main2=5;render();});await pupil.screenshot({path:'/tmp/y9-student-main2.png',fullPage:true});
 await pupil.setViewportSize({width:390,height:844});assert.equal(await pupil.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);console.log('PASS: all pages, 3 languages, 12 task cards, puzzle, tutor, conditions, four worker tests, invalid inputs, boundary regression, PDF, migration, mobile width.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
