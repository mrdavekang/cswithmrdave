(() => {
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  function model(c,a={},zh=false) {
    const cols=c.grid[0].map((_,i)=>String.fromCharCode(65+i));
    const range=a.range||[], all=c.range?range:c.cells;
    const label=c.range?(range.length>1?'=SUM('+range[0]+':'+range.at(-1)+')':range[0]?'=SUM('+range[0]:'=SUM('):a.entry===0?'':c.formula;
    const rangeTotal=range.reduce((total,cell)=>total+Number(c.grid[Number(cell.slice(1))-1]?.[1]||0),0);
    const address=c.cells[0], axes=c.title?.startsWith('Find a cell');
    const bi=t=>zh&&t?`<small class="paired-zh" lang="zh-Hans">${esc(t)}</small>`:'';
    return `<figure class="spreadsheet-model"><figcaption><b>${c.caption||'Worked example'}${bi('完整示例')}</b><span>${c.range?'Drag or tap the ends of the range':'Follow the labelled cells'}${bi(c.range?'拖动，或依次点选起点和终点':'查看标出的单元格')}</span></figcaption>
      <div class="model-formula"><span aria-label="Result cell">${c.target}</span><b aria-hidden="true">ƒx</b><code>${esc(label)}</code></div>
      <div class="model-scroll"><table aria-label="Annotated spreadsheet example"><thead><tr><th></th>${cols.map(col=>`<th scope="col" class="${axes&&col===address[0]?'axis-focus':''}">${col}</th>`).join('')}</tr></thead><tbody>
      ${c.grid.map((row,i)=>`<tr><th scope="row" class="${axes&&i+1===+address.slice(1)?'axis-focus':''}">${i+1}</th>${cols.map((col,j)=>{const cell=col+(i+1),selected=all.includes(cell),target=cell===c.target,choose=c.range&&c.cells.includes(cell);
      return `<td class="${selected?'model-input':''} ${target?'model-result':''}" ${choose?`data-range-cell="${cell}"`:''}>${choose?`<button type="button" data-range-pick="${cell}" aria-pressed="${selected}" aria-label="Select ${cell}, ${esc(row[j])}">${esc(row[j])}</button>`:esc(target&&(a.entry===0||a.entry===1)?'':target&&c.range&&range.length>1?rangeTotal:row[j])||'&nbsp;'}${bi(zh&&window.FormulaMandarin?.label(row[j]))}</td>`;}).join('')}</tr>`).join('')}
      </tbody></table></div><div class="model-key"><span><i></i> ${c.range?'Selected range':'Inputs used in the formula'}${bi(c.range?'已选范围':'公式引用的输入值')}</span><span><i></i> Result in ${c.target}${bi('结果格：'+c.target)}</span></div>
      ${c.range?`<div class="range-note"><p id="range-status" aria-live="polite">${range.length>1?`Selected ${range.join(', ')}. The total is ${rangeTotal}.`:range[0]?`Started at ${range[0]}. Tap the last cell, or drag across the range.`:'Start at B2 and finish at B4. You can drag or tap each end.'}${bi(range.length>1?'已选 '+range.join('、')+'，总数为 '+rangeTotal+'。':range[0]?'起点：'+range[0]+'。再点终点，或拖过范围。':'从 B2 选到 B4。可以拖动，也可以依次点选起点和终点。')}</p><button id="range-reset" type="button">Clear selection${bi('清除选区')}</button></div>`:''}</figure>`;
  }
  const samples = {
    '+':{grid:[['Supplies','Box A','Box B','Total'],['Labels',14,5,19]],cells:['B2','C2'],target:'D2',formula:'=B2+C2'},
    '-':{grid:[['Supplies','Start','Used','Left'],['Pencils',27,9,18]],cells:['B2','C2'],target:'D2',formula:'=B2-C2'},
    '*':{grid:[['Supplies','Count','RM each','Cost'],['Badges',8,3,24]],cells:['B2','C2'],target:'D2',formula:'=B2*C2'},
    '/':{grid:[['Supplies','Total RM','Teams','Per team'],['Paint',36,4,9]],cells:['B2','C2'],target:'D2',formula:'=B2/C2'}
  };
  const sample = q => {
    if(q.sum) return {grid:[['Category','Notes','Order RM'],['Folders','',8],['Clips','',4],['Tape','',3],['Total','',15]],cells:['C2','C3','C4'],target:'C5',formula:'=SUM(C2:C4)'};
    if(q.cell==='B7'){
      const op=q.formula.includes('/')?'/':q.formula.includes('*')?'*':q.formula.includes('+')?'+':'-';
      const [left,right,result,formula]=op==='/'?['Subtotal','Groups','Per group','=C2/C3']:op==='*'?['One order','Orders','All orders','=C2*C3']:op==='+'?['Subtotal','Delivery','New total','=C2+C3']:['Budget','Subtotal','Money left','=C2-C3'];
      return {grid:[['Detail','Notes','Value'],[left,'',24],[right,'',4],[result,'',op==='/'?6:op==='*'?96:op==='+'?28:20]],cells:['C2','C3'],target:'C4',formula};
    }
    if(q.formula.includes('('))return {grid:[['Detail','Value','Task','Answer'],['Budget',50,'Money left',32],['Packs',6],['RM each',3]],cells:['B2','B3','B4'],target:'D2',formula:'=B2-(B3*B4)'};
    const m=samples[q.formula.match(/[+*/-]/)?.[0]]||samples['+'];
    return {...m,grid:[m.grid[0],[],[],m.grid[1]],cells:['B4','C4'],target:'D4',formula:m.formula.replaceAll('2','4')};
  };
  window.FormulaModels={model,sample};
})();
