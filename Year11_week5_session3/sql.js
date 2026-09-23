/* Deliberately small SELECT practice interpreter. No eval or external service. */
window.runClubSQL=function(sql){
 const tokens=[];let rest=sql.trim();
 while(rest){const m=/^(\s+|'(?:[^']|'')*'|>=|<=|<>|!=|[=><,;*]|[+-]?(?:\d+(?:\.\d*)?|\.\d+)|[A-Za-z_][A-Za-z_0-9]*)/.exec(rest);if(!m)throw Error('Check the syntax near: '+rest.slice(0,24));rest=rest.slice(m[0].length);if(!/^\s+$/.test(m[0]))tokens.push(m[0]);}
 let p=0;const take=()=>tokens[p++],peek=()=>tokens[p],expect=w=>{if((take()||'').toUpperCase()!==w)throw Error('Expected '+w+'. Use SELECT fields FROM Club WHERE condition.');};
 const heads=window.LESSON.heads,find=n=>{const f=heads.find(h=>h.toLowerCase()===(n||'').toLowerCase());if(!f)throw Error('Unknown field '+(n||'(missing)')+'. Check the Club headings.');return f;};
 expect('SELECT');let selected=[];if(peek()==='*'){take();selected=[...heads];}else{selected.push(find(take()));while(peek()===','){take();selected.push(find(take()));}}
 expect('FROM');if((take()||'').toLowerCase()!=='club')throw Error('Use FROM Club: this practice runner contains the Club table.');
 const conditions=[];
 if((peek()||'').toUpperCase()==='WHERE'){take();do{const field=find(take()),op=take(),raw=take();if(!['=','>','<','>=','<=','<>','!='].includes(op))throw Error('Use a comparison operator such as =, > or <=.');if(raw===undefined)throw Error('Add a value after the comparison operator.');let value;
 if(/^'/.test(raw))value=raw.slice(1,-1).replace(/''/g,"'");else if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw))value=Number(raw);else if(/^(true|false)$/i.test(raw))value=raw.toLowerCase()==='true'?'True':'False';else throw Error('Put text values in single quotes, for example: '+"'Robotics'.");
 const numeric=['Places','SessionHours'].includes(field);if(numeric&&typeof value!=='number')throw Error(field+' uses numeric values: do not put the number in quotes.');if(!numeric&&typeof value==='number')throw Error(field+' stores text or Boolean values, not a numeric quantity.');conditions.push({field,op,value});if((peek()||'').toUpperCase()!=='AND')break;take();}while(true);}
 if(peek()===';')take();if(p!==tokens.length)throw Error('Unexpected '+peek()+'. This runner supports SELECT, FROM, WHERE and AND only.');
 const matches=window.LESSON.rows.filter(row=>conditions.every(c=>{const v=row[heads.indexOf(c.field)];switch(c.op){case '=':return v===c.value;case '<>':case '!=':return v!==c.value;case '>':return v>c.value;case '<':return v<c.value;case '>=':return v>=c.value;case '<=':return v<=c.value;}}));
 return {heads:selected,rows:matches.map(r=>selected.map(h=>r[heads.indexOf(h)])),codes:matches.map(r=>r[0])};
};
