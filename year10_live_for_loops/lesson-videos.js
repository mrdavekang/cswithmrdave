/* Required teacher demonstrations. Playback evidence is not a learning grade. */
(() => {
  'use strict';
  const videos = [
    {id:'osLY-6WvJnw',number:1,title:'FOR loops and range',purpose:'Watch how the loop visits Groups 1–4 before attempting Main 1.'},
    {id:'xy_ZGwhNjk4',number:2,title:'Running totals and accumulators',purpose:'Watch how each donation is added before building Milestone A.'},
    {id:'YlBcr7ZddBY',number:3,title:'Counters and selection',purpose:'Watch how qualifying groups are counted before building Milestone B.'}
  ];
  const clean = value => {
    const duration=Number(value?.duration);
    if(!Number.isFinite(duration)||duration<=0||duration>7200)return {duration:0,ranges:[],ended:false};
    const ranges=(Array.isArray(value?.ranges)?value.ranges:[]).slice(0,1000)
      .filter(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)&&r[0]>=0&&r[1]>r[0])
      .map(([a,b])=>[Math.min(a,duration),Math.min(b,duration)]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]);
    const merged=[];
    for(const r of ranges){const last=merged.at(-1);if(last&&r[0]<=last[1]+0.03)last[1]=Math.max(last[1],r[1]);else merged.push(r);}
    return {duration,ranges:merged,ended:value?.ended===true,updatedAt:typeof value?.updatedAt==='string'?value.updatedAt:null};
  };
  const watched=value=>clean(value).ranges.reduce((n,[a,b])=>n+b-a,0);
  const complete=value=>{const v=clean(value);return v.duration>0&&v.ended&&watched(v)>=v.duration-Math.min(2,v.duration*.01);};
  const merge=(a,b)=>{a=clean(a);b=clean(b);if(!a.duration)return b;if(!b.duration)return a;return clean({duration:b.duration,ranges:[...a.ranges,...b.ranges],ended:a.ended||b.ended,updatedAt:b.updatedAt||a.updatedAt});};
  const gaps=value=>{const v=clean(value),result=[];let end=0;for(const[a,b]of v.ranges){if(a>end+.5)result.push([end,a]);end=Math.max(end,b);}if(v.duration>end+.5)result.push([end,v.duration]);return result;};
  const stamp=seconds=>{seconds=Math.max(0,Math.floor(seconds||0));return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');};
  class Tracker {
    constructor(value){this.value=clean(value);this.last=null;}
    sample(s,now=performance.now()){
      const duration=Number(s.duration),time=Number(s.time),rate=Number(s.rate);
      if(!Number.isFinite(duration)||duration<=0||duration>7200||!Number.isFinite(time)||time<0||time>duration+2||!Number.isFinite(rate)||rate<.25||rate>4)return this.value;
      this.value=clean({...this.value,duration});
      const elapsed=this.last?(now-this.last.now)/1000:0,delta=this.last?time-this.last.time:0;
      // Credit only contiguous PLAYING time. Seeking, hiding, waiting and an
      // ENDED event on their own do not prove a section was played.
      if(this.last?.state===1&&this.last.visible&&[0,1,2,3].includes(s.state)&&elapsed>0&&elapsed<=4&&delta>0&&delta<=elapsed*Math.max(rate,this.last.rate)+.65){
        this.value=merge(this.value,{duration,ranges:[[this.last.time,Math.min(time,duration)]],ended:false});
      }
      if(s.state===0&&time>=duration-1.5)this.value.ended=true;
      this.value.updatedAt=new Date().toISOString();
      this.last={time,now,rate,state:s.state,visible:s.visible===true};
      return clean(this.value);
    }
  }
  window.CodingVideos={videos,clean,watched,complete,merge,gaps,stamp,Tracker};
})();
