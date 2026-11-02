/* Every projected state uses the shared TTA slide frame. No student workspace iframe. */
(()=>{'use strict';const F=DesignLessonFlow,V=DesignTeachingView,E=DesignLive.esc;
function render(state,live){const s=F.normalise(state),step=F.steps.find(x=>x.id===s.id),bi=s.lang==='bi',t=(en,zh='')=>E(en)+(bi&&zh?'<span class="teach-zh" lang="zh-Hans">'+E(zh)+'</span>':'');
 if(step.mode!=='discussion')return V.render(s);
 const q=DesignLive.rounds[step.round],active=live?.connected&&live.round===step.round&&live.phase!=='work',show=active&&live.revealed;
 const phase=active?live.phase:'work',labels={invite:['Get ready to answer','准备回答'],response:['Write your answer in the lesson app','在学习网页中作答'],discuss:['Look at the board and discuss','看前面的示例并讨论'],follow:['Improve your own answer','改进自己的回答'],retry:['Improve and send your answer','改进并发送回答'],work:['Join when your teacher invites you','老师邀请时加入讨论']};
 const timing='<p class="projector-phase">'+t(...labels[phase])+'<strong id="projected-response-clock" aria-live="off"></strong></p>';
 let body;
 if(show){const model=String(live.demo?.code||''),output=String(live.demo?.output||'');body=timing+'<div class="projector-model" tabindex="0" aria-label="Teacher model"><section><h3>'+t('Teacher model','老师的示例')+'</h3><div class="projector-model-text">'+t(model,model===q.model?q.modelZh:'')+'</div></section><section class="projector-output"><h3>'+t('Visible app response','看得见的应用响应')+'</h3><div class="projector-model-text">'+t(output,output===q.output?q.outputZh:'')+'</div></section></div>';}
 else{const prompt=step.round===1?['Three colour buttons say Button 1, Button 2 and Button 3. Suggest clearer labels and explain how they help a new user.','三个颜色按钮叫 Button 1、Button 2 和 Button 3。建议更清楚的名称，并解释怎样帮助新用户。']:['A music-app button says Go. Its plan says “Something happens”. Name the button, its exact visible response and the user benefit.','音乐应用的按钮叫 Go，计划只写“发生一些事情”。写清楚按钮名称、具体可见的响应及对用户的好处。'];
 body=step.round===1?timing+DesignLive.questionVisual(1,bi)+'<p class="projector-question">'+t('Suggest a clearer label for each button. Explain one benefit for a new user.','为每个按钮写一个更清楚的名称，解释对新用户的一个好处。')+'</p>':timing+'<p class="projector-question">'+t(...prompt)+'</p><div class="projector-success"><h3>'+t('Include in your answer','回答要包括')+'</h3><p>'+t(q.target,q.targetZh)+'</p></div><p class="projector-return">'+t('Send your answer, then continue paper Section '+(step.round===1?'A':'B')+'.','发送回答，然后继续纸上 '+(step.round===1?'A':'B')+' 部分。')+'</p>';}
 const slide={id:step.id,stage:'Live discussion '+step.round,title:[step.round===1?'Discussion 1: useful labels':'Discussion 2: tap and response',step.round===1?'讨论 1：有用的名称':'讨论 2：点击及响应']};
 return V.frame(slide,s,body).replace('class="teach-slide ', 'class="teach-slide projector-discussion '+(show?'projector-model-slide ':'projector-question-slide '+(step.round===1?'projector-visual-question ':'')));
}
function mount(el){let state=F.get(),live=F.getLive();
 function paint(s=state){state=s;el.className='flow-view flow-slide-view projector-tta-view';el.innerHTML=render(s,live);tick();}
 function tick(){const node=el.querySelector('#projected-response-clock'),step=F.steps.find(x=>x.id===state.id);if(!node)return;if(live?.connected&&live.round===step.round&&['response','retry'].includes(live.phase)){const seconds=live.pausedSeconds??Math.max(0,Math.ceil((Date.parse(live.deadline)-Date.now())/1000)||0);node.textContent=DesignLive.time(seconds)+(live.pausedSeconds!=null?(state.lang==='bi'?' · 已暂停':' · paused'):'');}else node.textContent='';}
 F.on(paint);F.onLive(r=>{live=r;if(F.steps.find(x=>x.id===state.id)?.mode==='discussion')paint();});setInterval(tick,1000);paint();return {paint};
}
window.DesignLessonProjector={render,mount};
})();
