/* Entrance contact: read-only Cloud state, no opening/unlocking commands. */
(function(){
 'use strict';const $=id=>document.getElementById(id);let svg=null,floor=null;
 const hit=document.createElement('button');hit.type='button';hit.className='entrance-contact-hit';hit.hidden=true;hit.setAttribute('aria-label','Ver estado da porta principal');hit.title='Porta principal';$('plan-stage').append(hit);
 const dialog=document.createElement('dialog');dialog.id='entrance-dialog';dialog.setAttribute('aria-labelledby','entrance-title');dialog.innerHTML='<button class="close" aria-label="Fechar porta principal">×</button><span class="eyebrow">HALL DE ENTRADA · CONTACTO SHELLY</span><h2 id="entrance-title">Porta principal</h2><p id="entrance-state" role="status"></p><p id="entrance-quality"></p><p>Sensor de abertura · apenas leitura</p><div class="control-actions"><button id="entrance-refresh">Atualizar dados</button><button id="entrance-configure">Configurar sensor</button></div>';document.body.append(dialog);
 function draw(){const s=window.CasaCloudRead.doorSnapshot();window.CasaAddons.setEntranceDoorState(s.open);$('entrance-state').textContent=s.caption;$('entrance-quality').textContent=s.error||(s.fetchedAt?'Consultado na Cloud às '+new Date(s.fetchedAt).toLocaleTimeString('pt-PT')+'.':'');hit.setAttribute('aria-label','Porta principal · '+s.caption);$('entrance-refresh').disabled=s.busy||!s.accountReady||!s.configured||window.CasaShellySetup.isDirty()}
 hit.addEventListener('click',()=>{draw();dialog.showModal()});dialog.querySelector('.close').addEventListener('click',()=>dialog.close());$('entrance-refresh').addEventListener('click',()=>window.CasaCloudRead.refresh());$('entrance-configure').addEventListener('click',()=>{dialog.close();window.CasaShellySetup.openDevice('contact','entranceContact')});
 function position(){
  hit.hidden=floor!=='3';if(hit.hidden||!svg)return;const m=svg.getScreenCTM();if(!m)return;
  const door=svg.dataset.floor3Render?window.CasaFloor3Render.ENTRANCE:{x:935,y:833,width:0,height:88},p=new DOMPoint(door.x,door.y).matrixTransform(m),r=$('plan-stage').getBoundingClientRect(),width=door.width*Math.hypot(m.a,m.b),height=door.height*Math.hypot(m.c,m.d);
  hit.style.left=(p.x-r.left)+'px';hit.style.top=(p.y-r.top)+'px';hit.style.width=Math.max(44,width+12)+'px';hit.style.height=Math.max(44,height+12)+'px';hit.style.setProperty('--entrance-ring-width',Math.max(8,width+4)+'px');hit.style.setProperty('--entrance-ring-height',Math.max(12,height+4)+'px');
 }
 function mount(next,id){svg=next;floor=id;draw();position()}
 window.addEventListener('energychange',draw);setInterval(draw,5000);window.CasaEntrance={mount,position};draw();
})();
