"use strict";
function confirmAction(message,label){
  const dialog=document.createElement("dialog");
  if(typeof dialog.showModal!=="function")return Promise.resolve(window.confirm(message));
  dialog.setAttribute("aria-labelledby","confirm-message");
  dialog.innerHTML='<h2 id="confirm-message"></h2><form method="dialog" class="toolbar"><button value="cancel" class="secondary" autofocus>Cancel</button><button value="confirm" class="primary"></button></form>';
  dialog.querySelector("h2").textContent=message;
  dialog.querySelector('[value="confirm"]').textContent=label;
  document.body.append(dialog);
  return new Promise(resolve=>{
    dialog.addEventListener("close",()=>{const accepted=dialog.returnValue==="confirm";dialog.remove();resolve(accepted);},{once:true});
    dialog.showModal();
  });
}
