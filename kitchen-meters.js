/* Read-only overlays aligned with the kitchen cabinet on the floor 3 photograph. */
(function(){
 'use strict';
 const names=window.CasaHomeCore.KITCHEN_METERS,NS='http://www.w3.org/2000/svg',hits=new Map();
 const icons={
  hob:'<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="7.5" cy="8" r="2"/><circle cx="16.5" cy="8" r="2"/><circle cx="7.5" cy="15.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
  oven:'<rect x="2" y="4" width="20" height="16" rx="2"/><rect x="5" y="7" width="10" height="10" rx="1"/><path d="M18 8h1m-1 4h1m-1 4h1"/>'
 };
 const images={hob:'assets/placa-aeg.png',oven:'assets/forno-aeg.png'};
 const fmt=watts=>Number.isFinite(watts)?watts.toLocaleString('pt-PT',{maximumFractionDigits:1})+' W':'';
 const snapshot=id=>window.CasaCloudRead.kitchenMeterSnapshot(id);
 const caption=s=>s.offline?'Offline':!s.configured?'Por associar':s.activity===true?'A trabalhar':s.activity===false?'Sem atividade':'Atividade por confirmar';

 const dialog=document.createElement('dialog');
 dialog.id='kitchen-meter-dialog';
 dialog.className='shelly-device-popup';
 dialog.setAttribute('aria-labelledby','kitchen-meter-title');
 dialog.innerHTML=`
  <button class="close" type="button" aria-label="Fechar equipamento da cozinha">×</button>
  <span class="eyebrow">COZINHA · SHELLY EM</span>
  <h2 id="kitchen-meter-title"></h2>
  <img class="kitchen-meter-preview" alt="">
  <p class="kitchen-meter-status" role="status"></p>
  <div class="control-actions">
   <button type="button" class="kitchen-meter-refresh">Atualizar</button>
   <button type="button" class="kitchen-meter-settings">Configurar Shelly</button>
  </div>
  <section class="device-consumption">
   <div class="consumption-heading"><h3>Consumo</h3></div>
   <div class="dishwasher-meters">
    <div><span>Potência instantânea</span><strong class="kitchen-meter-watts"></strong></div>
    <div><span>Consumo registado hoje</span><strong class="kitchen-meter-today"></strong></div>
   </div>
  </section>`;
 document.body.append(dialog);
 const $=selector=>dialog.querySelector(selector);
 function draw(){
  for(const [id,node] of hits){
   const s=snapshot(id),label=[names[id],caption(s),fmt(s.powerWatts)].filter(Boolean).join(' · ');
   node.dataset.working=String(s.activity===true);
   node.setAttribute('aria-label',label);
   node.querySelector('title').textContent=label;
   node.querySelector('text').textContent=s.activity===true?fmt(s.powerWatts):'';
  }
  for(const node of document.querySelectorAll('[data-kitchen-meter-room]')){
   const s=snapshot(node.dataset.kitchenMeterRoom);
   node.textContent=[caption(s),fmt(s.powerWatts)].filter(Boolean).join(' · ');
  }
  if(!dialog.open)return;
  const id=dialog.dataset.device,s=snapshot(id);
  $('.kitchen-meter-status').textContent=s.error||caption(s);
  $('.kitchen-meter-watts').textContent=fmt(s.powerWatts)||'—';
  $('.kitchen-meter-refresh').disabled=!s.configured||!s.accountReady||window.CasaShellySetup.isDirty();
  window.CasaDailyEnergy?.show($('.kitchen-meter-today'),'appliance',id);
 }
 function open(id){
  if(!Object.hasOwn(names,id))return;
  for(const d of document.querySelectorAll('dialog[open]'))if(d!==dialog)d.close();
  dialog.dataset.device=id;
  $('#kitchen-meter-title').textContent=names[id];
  const preview=$('.kitchen-meter-preview');
  preview.src=images[id];
  preview.alt=names[id];
  if(!dialog.open)dialog.showModal();
  draw();
 }
 function mount(svg){
  hits.clear();
  const layer=document.createElementNS(NS,'g');
  const photo=svg.querySelector('[data-addon="floor3-render"] > g');
  if(!photo)return;
  layer.setAttribute('transform',photo.getAttribute('transform'));
  layer.dataset.addon='kitchen-meters';
  const x=265,width=43,height=27;
  for(const [id,y] of [['hob',667],['oven',694]]){
   const hit=document.createElementNS(NS,'g');
   hit.classList.add('kitchen-meter-hit');
   hit.dataset.device=id;
   hit.setAttribute('role','button');
   hit.setAttribute('tabindex','0');
   hit.innerHTML=`<title></title>
    <rect class="kitchen-meter-target" x="${x}" y="${y}" width="${width}" height="${height}" fill="transparent"/>
    <rect class="kitchen-meter-halo" x="${x+1}" y="${y+1}" width="${width-2}" height="${height-2}" rx="2" vector-effect="non-scaling-stroke"/>
    <g class="kitchen-meter-badge" transform="translate(${x+12} ${y+4})">
     <rect width="19" height="19" rx="4"/>
     <svg x="3" y="3" width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">${icons[id]}</svg>
     <text x="23" y="14"></text>
    </g>`;
   hit.addEventListener('click',e=>{e.stopPropagation();open(id)});
   hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();open(id)}});
   layer.append(hit);
   hits.set(id,hit);
  }
  svg.append(layer);
  draw();
 }
 function decorateRoom(host){
  for(const [id,name] of Object.entries(names)){
   const row=document.createElement('div'),copy=document.createElement('div'),heading=document.createElement('h3'),state=document.createElement('p'),button=document.createElement('button');
   row.className='room-device-row kitchen-meter-room-row';
   heading.textContent=name;
   state.dataset.kitchenMeterRoom=id;
   button.type='button';
   button.className='room-round';
   button.setAttribute('aria-label','Consumo · '+name);
   button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[id]+'</svg>';
   button.addEventListener('click',()=>open(id));
   copy.append(heading,state);row.append(copy,button);host.append(row);
  }
  draw();
 }
 $('.close').addEventListener('click',()=>dialog.close());
 $('.kitchen-meter-refresh').addEventListener('click',()=>window.CasaCloudRead.refresh());
 $('.kitchen-meter-settings').addEventListener('click',()=>window.CasaShellySetup.openDevice('kitchen-meter',dialog.dataset.device));
 window.CasaKitchenMeters={mount,open,decorateRoom};
 window.addEventListener('energychange',draw);
 setInterval(()=>{if(!document.hidden&&(dialog.open||hits.get('hob')?.isConnected))draw()},1000);
})();
