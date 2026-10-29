/* Shared by the worker and the direct-file fallback. */
self.RouteAnalyse=function(code){
  const result={lists:[],updates:[],prints:[],reads:[],other:[]};
  const str=v=>v?.v??v,kind=n=>n?._astname;
  const literal=n=>kind(n)==='Str'?str(n.s):kind(n)==='Num'?str(n.n):null;
  const sub=n=>({name:str(n?.value?.id),index:literal(n?.slice?.value)});
  const ast=Sk.astFromParse(Sk.parse('route.py',code).cst,'route.py');
  for(const n of ast.body||[]){
    if(kind(n)==='Assign')for(const t of n.targets||[]){
      if(kind(t)==='Name'&&kind(n.value)==='List')result.lists.push({name:str(t.id),elements:n.value.elts.map(literal),line:n.lineno});
      if(kind(t)==='Subscript')result.updates.push({...sub(t),value:literal(n.value),source:kind(n.value)==='Subscript'?sub(n.value):null,line:n.lineno});
    }
    if(kind(n)==='Expr'&&kind(n.value)==='Call'&&str(n.value.func?.id)==='print')result.prints.push({line:n.lineno,args:n.value.args.map(a=>kind(a)==='Subscript'?{...sub(a),type:'index'}:kind(a)==='Name'?{name:str(a.id),type:'whole'}:{type:'literal',value:literal(a)})});
  }
  return result;
};
