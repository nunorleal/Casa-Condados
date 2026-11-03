/* Attic photographs: isolated room/window clips, sharing the floor 3 geometry helper. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./home-core.js'),require('./floor3-render.js'));else root.CasaFloor4Render=factory(root.CasaHomeCore,root.CasaFloor3Render)})(typeof window==='undefined'?globalThis:window,function(C,R){
 'use strict';const NS='http://www.w3.org/2000/svg';
 const OUTLINE='M51 10H431V638H858V1164L853 1178H55L51 1164Z';
 // Stair treads have priority within the lower open room.
 const ZONES={studio:'M51 10H431V647H51Z',stairs4:'M721 777H842V1147H721Z',living2:'M51 647H858V1178H51Z'};
 const WINDOWS={'studio-west':[51,454,38,110],'living2-west':[51,717,38,111]};
 const HOTSPOTS=Object.fromEntries(Object.entries(WINDOWS).map(([id,[x,y,w,h]])=>[id,{x1:55+(x-51)*830/807,y1:90+(y-10)*1188/1168,x2:55+(x+w-51)*830/807,y2:90+(y+h-10)*1188/1168,photoBounds:true}]));
 const {PARTITIONS,regionAt}=R.createRegions(ZONES,WINDOWS,896,1190);
 function levels(state,night){
  const studio=C.position(state,'studio-west')/100,living=C.position(state,'living2-west')/100,zones={};
  for(const id of Object.keys(ZONES))zones[id]={natural:id==='studio'?studio:living,electric:C.light(state,'4',id) ? (night?1:1-(id==='studio'?studio:living)) : 0};
  return {night:!!night,ambient:Math.max(studio,living),zones,windows:{'studio-west':studio,'living2-west':living}};
 }
 function markup(){
  // Only the doorway pixels use the edited image; the original render stays intact.
  const source=(kind,file)=>`<g id="floor4-source-${kind}"><image href="assets/${file}" width="896" height="1190"/><g clip-path="url(#floor4-doorless-clip)" mask="url(#floor4-doorless-blend)"><image href="assets/sotao-sem-porta-${kind}-v1.png" width="896" height="1190" preserveAspectRatio="none"/></g></g>`;
  const use=kind=>`<use href="#floor4-source-${kind}"/>`;
  const clips=Object.entries(PARTITIONS).map(([id,rects])=>`<clipPath id="floor4-region-${id}" clipPathUnits="userSpaceOnUse"><path d="${rects.map(r=>`M${r.x1} ${r.y1}H${r.x2}V${r.y2}H${r.x1}Z`).join(' ')}"/></clipPath>`).join('');
  const natural=kind=>Object.keys(PARTITIONS).map(id=>`<g clip-path="url(#floor4-region-${id})" opacity="0" ${id==='structure'?'data-floor4-ambient=""':id.startsWith('window:')?`data-floor4-window="${id.slice(7)}"`:`data-floor4-natural="${id}"`}>${use(kind)}</g>`).join('');
  const electric=Object.keys(ZONES).map(id=>`<g data-floor4-electric="${id}" clip-path="url(#floor4-region-${id})" opacity="0">${use('electric')}</g>`).join('');
  return `<g transform="translate(55 90) scale(${830/807} ${1188/1168}) translate(-51 -10)"><defs><clipPath id="floor4-photo-outline"><path d="${OUTLINE}"/></clipPath>${clips}<clipPath id="floor4-doorless-clip"><rect x="298" y="622" width="75" height="75"/></clipPath><linearGradient id="floor4-doorless-fade" x1="0" y1="622" x2="0" y2="697" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0"/><stop offset=".25" stop-color="white"/><stop offset=".75" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><mask id="floor4-doorless-blend" maskUnits="userSpaceOnUse" x="298" y="622" width="75" height="75"><rect x="298" y="622" width="75" height="75" fill="url(#floor4-doorless-fade)"/></mask>${source('closed','sotao-estores-fechados-v1.jpg')}${source('day','sotao-diurno-v1.jpg')}${source('electric','sotao-luz-eletrica-v1.jpg')}${source('night','sotao-noturno-abertos-v1.jpg')}</defs><g clip-path="url(#floor4-photo-outline)">${use('closed')}<g data-floor4-image="day">${natural('day')}</g><g data-floor4-image="night" style="display:none">${natural('night')}</g><g data-floor4-image="electric">${electric}</g></g></g>`;
 }
 function mount(svg){
  // Fit the visible photograph outline instead of its former empty border.
  svg.dataset.fitViewBox="55 90 830 1188";
  const base=svg.querySelector(':scope > g');if(!base||svg.dataset.floor4Render)return;
  for(const child of [...base.children])child.style.display='none';
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='floor4-render';layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');layer.innerHTML=markup();base.append(layer);svg.dataset.floor4Render='v1';
 }
 function sync(svg,state,night){
  if(!svg.dataset.floor4Render)return;const l=levels(state,night);
  for(const e of svg.querySelectorAll('[data-floor4-ambient]'))e.setAttribute('opacity',l.ambient);
  for(const [id,v]of Object.entries(l.zones))for(const kind of ['natural','electric'])for(const e of svg.querySelectorAll(`[data-floor4-${kind}="${id}"]`))e.setAttribute('opacity',v[kind]);
  for(const [id,v]of Object.entries(l.windows))for(const e of svg.querySelectorAll(`[data-floor4-window="${id}"]`))e.setAttribute('opacity',v);
  svg.querySelector('[data-floor4-image="day"]').style.display=night?'none':'';svg.querySelector('[data-floor4-image="night"]').style.display=night?'':'none';svg.dataset.floor4Environment=night?'night':'day';
 }
 return {mount,sync,levels,markup,OUTLINE,ZONES,WINDOWS,HOTSPOTS,PARTITIONS,regionAt};
});
