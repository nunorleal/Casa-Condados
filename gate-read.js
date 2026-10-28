/* Garage gate contact and supplied open-state overlay. Strictly read-only. */
(function(){
 'use strict';const $=id=>document.getElementById(id),stage=$('plan-stage');let svg=null,floor=null;
 const hit=document.createElement('button');hit.type='button';hit.className='garage-gate-hit';hit.hidden=true;stage.append(hit);
 const dialog=document.createElement('dialog');dialog.id='gate-dialog';dialog.setAttribute('aria-labelledby','gate-title');dialog.innerHTML='<button class="close" aria-label="Fechar portão da garagem">×</button><span class="eyebrow">GARAGEM · CONTACTO SHELLY</span><h2 id="gate-title">Portão da garagem</h2><p id="gate-state" role="status"></p><p id="gate-quality"></p><p>Sensor BLU Door · apenas leitura. Associe o sensor nas definições quando tiver o ID. A imagem do portão aberto só aparece com abertura confirmada.</p><div class="control-actions"><button id="gate-refresh">Atualizar dados</button><button id="gate-configure">Configurar sensor</button></div>';document.body.append(dialog);
 function draw(){const s=window.CasaCloudRead.gateSnapshot();if(svg&&floor==='-1')window.CasaGarageRender.setGate(svg,s.open);$('gate-state').textContent=s.caption;$('gate-quality').textContent=s.error||(s.fetchedAt?'Consultado na Cloud às '+new Date(s.fetchedAt).toLocaleTimeString('pt-PT')+'.':'');hit.setAttribute('aria-label','Portão da garagem · '+s.caption);hit.title='Portão da garagem · '+s.caption;$('gate-refresh').disabled=s.busy||!s.accountReady||!s.configured||window.CasaShellySetup.isDirty()}
 function open(){draw();dialog.showModal()}
 hit.addEventListener('click',open);dialog.querySelector('.close').addEventListener('click',()=>dialog.close());$('gate-refresh').addEventListener('click',()=>window.CasaCloudRead.refresh());$('gate-configure').addEventListener('click',()=>{dialog.close();window.CasaShellySetup.openDevice('contact','gateContact')});
 function position(){hit.hidden=floor!=='-1';if(hit.hidden||!svg)return;const m=svg.getScreenCTM();if(!m)return;const p=new DOMPoint(592.5,1200).matrixTransform(m),r=stage.getBoundingClientRect();hit.style.left=(p.x-r.left)+'px';hit.style.top=(p.y-r.top)+'px';hit.style.width=Math.max(44,545*Math.hypot(m.a,m.b))+'px'}
 function mount(next,id){svg=next;floor=id;draw();position()}
 window.addEventListener('energychange',draw);setInterval(draw,5000);window.CasaGate={mount,position,open};draw();
})();
