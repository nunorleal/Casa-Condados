/* Independent additions: retain the original plan geometry and white walls. */
(function(){
 'use strict';
 const NS='http://www.w3.org/2000/svg',veluxKey='casa-nova-show-velux-v1';
 // Visual input for a future confirmed contact reading; never sends equipment commands.
 let entranceDoorOpen=null;
 function syncEntranceDoor(){
  document.querySelectorAll('[data-door="entrance"]').forEach(door=>{
   const open=entranceDoorOpen===true;
   door.dataset.doorStatus=entranceDoorOpen===null?'unknown':open?'open':'closed';
   door.querySelector('[data-door-position="closed"]').style.display=open?'none':'';
   door.querySelector('[data-door-position="open"]').style.display=open?'':'none';
  });
 }
 function setEntranceDoorState(open){
  if(open!==null&&typeof open!=='boolean')throw new TypeError('Estado da porta inválido');
  entranceDoorOpen=open;syncEntranceDoor();
 }
 let showVelux=true;
 try{const saved=JSON.parse(localStorage.getItem(veluxKey));if(typeof saved==='boolean')showVelux=saved}catch{}
 function syncVelux(){
  document.querySelectorAll('[data-addon="velux"]').forEach(layer=>{layer.style.display=showVelux?'':'none'});
 }
 syncVelux();
 function mountVelux(svg){
  const base=svg.querySelector(':scope > g');
  if(!base||base.querySelector('[data-addon="velux"]'))return;
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='velux';layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');
  for(const [x,y] of [[251,286],[387,1074]]){
   const windowGroup=document.createElementNS(NS,'g');
   windowGroup.innerHTML=`<rect x="${x-54}" y="${y-70}" width="108" height="140" fill="#c6d9d5" stroke="#fffef6" stroke-width="7"/><rect x="${x-44}" y="${y-60}" width="88" height="120" fill="#d9e9e2" stroke="#92aaa4" stroke-width="2"/><path d="M${x-40} ${y+45}l78-95" stroke="#f7ffff" stroke-opacity=".5" stroke-width="10"/>`;
   layer.append(windowGroup);
  }
  base.insertBefore(layer,base.querySelector('path[stroke="#68685d"]'));
  syncVelux();
 }
 function mountFacadeWindows(svg){
  const base=svg.querySelector(':scope > g');
  if(!base||base.querySelector('[data-addon="floor4-facade-windows"]'))return;
  const layer=document.createElementNS(NS,'g');
  layer.dataset.addon='floor4-facade-windows';layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');
  for(const [room,y1,y2] of [['studio',555,666],['living2',845,959]]){
   const windowGroup=document.createElementNS(NS,'g');windowGroup.dataset.room=room;
   windowGroup.innerHTML=`<path d="M65 ${y1}V${y2}" stroke="#5b7272" stroke-width="11"/><path d="M65 ${y1}V${y2}" stroke="#c5e6e5" stroke-width="6"/><path d="M65 ${y1}V${y2}" stroke="#f4ffff" stroke-width="1.5"/><path d="M57 ${y1}h16M57 ${y2}h16" stroke="#fffef6" stroke-width="3"/>`;
   layer.append(windowGroup);
  }
  base.insertBefore(layer,base.querySelector('path[stroke="#68685d"]'));
 }
 function mountCabinets(svg,floorId){
  const markup=window.CasaPlans?.[floorId]?.cabinetAddon,base=svg.querySelector(':scope > g');
  if(!markup||!base||base.querySelector('[data-addon="cabinets"]'))return;
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='cabinets';
  layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');layer.innerHTML=markup;
  base.insertBefore(layer,base.querySelector('path[stroke="#68685d"]'));
 }
 function mountKitchen(svg,floorId){
  const markup=window.CasaPlans?.[floorId]?.kitchenAddon,base=svg.querySelector(':scope > g');
  if(!markup||!base||base.querySelector('[data-addon="kitchen"]'))return;
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='kitchen';
  layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');layer.innerHTML=markup;
  base.insertBefore(layer,base.querySelector('path[stroke="#68685d"]'));
 }
 function mountBalconyUtilities(svg,floorId){
  const markup=window.CasaPlans?.[floorId]?.balconyUtilitiesAddon,base=svg.querySelector(':scope > g');
  if(!markup||!base||base.querySelector('[data-addon="balcony-utilities"]'))return;
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='balcony-utilities';
  layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');layer.innerHTML=markup;
  base.insertBefore(layer,base.querySelector('path[stroke="#68685d"]'));
 }
 const bathroomKey='casa-leal-show-bathroom-fixtures-v1';
 let showBathroomFixtures=true;
 try{const value=JSON.parse(localStorage.getItem(bathroomKey));if(typeof value==='boolean')showBathroomFixtures=value}catch{}
 function syncBathroomFixtures(){
  document.querySelectorAll('[data-addon="bathroom-fixtures"]').forEach(layer=>{layer.style.display=showBathroomFixtures?'':'none'});
 }
 syncBathroomFixtures();
 function mountBathroomFixtures(svg,floorId){
  const markup=window.CasaPlans?.[floorId]?.bathroomAddon,base=svg.querySelector(':scope > g');
  if(!markup||!base||base.querySelector('[data-addon="bathroom-fixtures"]'))return;
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='bathroom-fixtures';
  layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');layer.innerHTML=markup;
  base.insertBefore(layer,base.querySelector('path[stroke="#68685d"]'));syncBathroomFixtures();
 }
 function mountArchitecture(svg,floorId){
  const markup=window.CasaPlans?.[floorId]?.architectureAddon,base=svg.querySelector(':scope > g');
  if(!markup||!base||base.querySelector('[data-addon="architecture"]'))return;
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='architecture';
  layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');
  layer.innerHTML=markup;
  base.insertBefore(layer,base.querySelector('path[stroke="#68685d"]'));
  syncEntranceDoor();
 }
 function mountGarageVehicle(svg){
  const base=svg.querySelector(':scope > g');if(!base||base.querySelector('[data-addon="garage-vehicle"]'))return;
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='garage-vehicle';layer.setAttribute('pointer-events','none');
  layer.innerHTML='<g data-vehicle="id4" aria-hidden="true"><image href="assets/id4-vista-superior-v1.png" x="300" y="550" width="407" height="610.5" transform="rotate(180 503.5 855.25)"/></g><g data-equipment="garage-charger" class="ev-charger" role="button" tabindex="0" aria-label="Ver consumo do carregador" pointer-events="all"><rect x="251" y="647" width="65" height="90" rx="8" fill="transparent"/><rect x="263" y="653" width="42" height="66" rx="10" fill="#18292e"/><rect x="267" y="657" width="34" height="58" rx="7" fill="#91a6ad" stroke="#d2dfe0" stroke-width="1"/><rect x="272" y="663" width="24" height="32" rx="4" fill="#20343e"/><path class="ev-charger-bolt" d="M285 668l-8 13h6l-3 9 11-15h-6Z" fill="#b7cbd4"/><circle class="ev-charger-led" cx="284" cy="705" r="3" fill="#82969c"/><path data-ev-cable-rest="" d="M284 719v15c0 12 25 8 25 25s-40 21-40 0c0-10 11-12 18-6" fill="none" stroke="#19292f" stroke-width="5" stroke-linecap="round"/><g data-ev-cable-connected="" style="display:none" pointer-events="none"><path d="M284 719C274 780 329 789 350 744S355 698 380 698" fill="none" stroke="#19292f" stroke-width="7" stroke-linecap="round"/><path class="ev-current-flow" d="M284 719C274 780 329 789 350 744S355 698 380 698" fill="none" stroke="#79d6ba" stroke-width="2.5" stroke-linecap="round"/><path d="M375 693h12v10h-12Z" fill="#d5e0dc" stroke="#193c35" stroke-width="2"/></g></g>';
  if(svg.dataset.garageRender){layer.querySelector('[data-vehicle]').remove();base.append(layer)}
  else base.insertBefore(layer,base.querySelector('path[stroke="#68685d"]'));
 }
 function mount(svg,floorId){
  if(!svg)return;
  if(floorId==='4'&&window.CasaFloor4Render){window.CasaFloor4Render.mount(svg);return}
  if(floorId==='3'&&window.CasaFloor3Render){
   window.CasaFloor3Render.mount(svg);
   const entrance=window.CasaPlans['3'].architectureAddon.match(/<g data-door="entrance"[\s\S]*?<\/g><\/g>/)?.[0];
   if(entrance){const layer=document.createElementNS(NS,'g');layer.dataset.addon='render-entrance';layer.setAttribute('pointer-events','none');layer.innerHTML=entrance;const d=window.CasaFloor3Render.ENTRANCE;layer.querySelector('[data-door="entrance"]').setAttribute('transform',`translate(${d.hingeX} ${d.hingeY}) scale(${d.leaf/70})`);layer.querySelector('[data-door-position="closed"]').setAttribute('opacity','0');svg.querySelector(':scope > g').append(layer);syncEntranceDoor()}
   return;
  }
  mountCabinets(svg,floorId);
  mountKitchen(svg,floorId);
  mountBathroomFixtures(svg,floorId);
  mountBalconyUtilities(svg,floorId);
  mountArchitecture(svg,floorId);
  if(floorId==='4'&&svg){mountVelux(svg);mountFacadeWindows(svg);return}
  if(floorId==='-1'&&window.CasaGarageRender){window.CasaGarageRender.mount(svg);mountGarageVehicle(svg);return}
  if(floorId!=='-1'||!svg||svg.querySelector('[data-addon="garage-floor"]'))return;
  const base=svg.querySelector(':scope > g'),surface=base?.firstElementChild;
  if(!surface||surface.tagName.toLowerCase()!=='path')return;
  const layer=document.createElementNS(NS,'g');
  layer.dataset.addon='garage-floor';layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');
  layer.innerHTML='<defs><clipPath id="addon-garage-floor-clip"><path/></clipPath><pattern id="addon-garage-cement" width="180" height="180" patternUnits="userSpaceOnUse"><image href="assets/cimento-cave.svg?v=2.45" width="180" height="180"/></pattern><linearGradient id="addon-garage-shade"><stop stop-color="#000" stop-opacity=".2"/><stop offset=".14" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".13"/></linearGradient></defs><g clip-path="url(#addon-garage-floor-clip)"><rect x="85" y="470" width="830" height="730" fill="url(#addon-garage-cement)"/><rect x="85" y="470" width="830" height="730" fill="url(#addon-garage-shade)"/></g>';
  layer.querySelector('clipPath path').setAttribute('d',surface.getAttribute('d'));
  // The material sits over the original floor, below every wall and the gate.
  surface.after(layer);
  mountGarageVehicle(svg);
 }
 window.CasaAddons={bathroomFixturesVisible:()=>showBathroomFixtures,mount,setEntranceDoorState,veluxVisible:()=>showVelux};
})();
