// Arithmetic only. No binary conversion, place-value selection or answer-field access.
(function (root) {
  const sheet=typeof module!=='undefined'?require('./sheet.js'):root.ExamSheet;
  const initial=()=>({expression:'',result:null,error:false});
  const operator=/[+−×÷]/;
  function press(state,key){
    const old=state.expression||'';
    if(key==='clear')return initial();
    if(key==='back')return {expression:old.slice(0,-1),result:null,error:false};
    if(key==='='){
      if(!old)return initial();
      const value=sheet.result({A1:'='+old},'A1');
      return value.error||typeof value.value!=='number'||Math.abs(value.value)>1e12
        ?{expression:old,result:null,error:true}:{expression:old,result:sheet.fmt(value),error:false};
    }
    if(!/^[0-9.+−×÷]$/.test(key))return state;
    let current=state.result!==null?(operator.test(key)?state.result.replace('-','−'):''):old;
    if(current.length>=40)return state;
    if(operator.test(key)){
      if(!current&&key!=='−')return state;
      if(current==='−')return state;
      if(operator.test(current.slice(-1)))current=current.slice(0,-1);
    }
    if(key==='.'&&current.split(operator).at(-1).includes('.'))return state;
    if(key==='.'&&(!current||operator.test(current.slice(-1))))current+='0';
    return {expression:current+key,result:null,error:false};
  }
  const api={initial,press};
  if(typeof module!=='undefined')module.exports=api;else root.ExamCalculator=api;
})(globalThis);
