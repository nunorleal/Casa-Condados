/* Original user images, combined with room masks; no new device commands. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./home-core.js'));else root.CasaFloor3Render=factory(root.CasaHomeCore)})(typeof window==='undefined'?globalThis:window,function(C){
 'use strict';const NS='http://www.w3.org/2000/svg';
 const OUTLINE='M35 16H65V26H744V14H774V603H778V670H781V684L775 706H568V1258L560 1278H42L35 1258Z';
 const ZONES={master:'M35 136H302V416H288V498H220V378H35Z',bedroom2:'M302 136H530V405H550V440H368V416H302Z',bedroom3:'M530 136H775V462H618V405H530Z',closet:'M35 378H220V498H35Z',hall:'M288 416H368V440H545V405H618V557H540V565H402V507H335V498H288Z',bath1:'M35 498H244V660H35Z',bath2:'M244 498H402V660H244Z',bath3:'M618 462H775V557H618Z',entrance:'M402 565H618V557H775V686H558V730H402Z',kitchen:'M35 660H418V686H558V730H478V844H35Z',living:'M35 844H478V1070H558V1132H35Z',stairs3:'M478 730H558V1070H478Z','balcony-north':'M35 14H775V136H35Z','balcony-south':'M35 1132H568V1278H35Z'};
 const WINDOWS={
  'master-north':[90,122,132,24],'bedroom2-north':[349,122,129,24],'bedroom3-north':[580,122,134,24],
  'suite-west':[35,551,21,64],'kitchen-west':[35,730,21,65],
  'living-south-left':[84,1119,200,26],'living-south-right':[316,1119,156,26]
 };
 // Match interaction rectangles to the exact photograph transform.
 const HOTSPOTS=Object.fromEntries(Object.entries(WINDOWS).map(([id,[x,y,w,h]])=>[id,{x1:55+(x-35)*890/744,y1:55+(y-14)*1529/1264,x2:55+(x+w-35)*890/744,y2:55+(y+h-14)*1529/1264,photoBounds:true}]));
 const ENTRANCE={x:55+(767-35)*890/744,y:55+(636.5-14)*1529/1264,width:28*890/744,height:69*1529/1264,hingeX:55+(767-35)*890/744,hingeY:55+(667-14)*1529/1264,leaf:61*1529/1264};
 function openPlan(state){
  const kitchen=C.position(state,'kitchen-west')/100,lower=(C.position(state,'living-south-left')+C.position(state,'living-south-right'))/200;
  return {top:.45*kitchen+.55*lower,bottom:.05*kitchen+.95*lower};
 }
 function levels(state,night,rooms,balconyDay=!night){
  const ambient=Math.max(...Object.keys(WINDOWS).map(id=>C.position(state,id)))/100,zones={};
  for(const room of rooms){const exterior=room.id.startsWith('balcony'),l=C.lighting(state,'3',room,exterior?!balconyDay:night),natural=exterior?(balconyDay?1:0):l.sources.length?l.opening/100:ambient;zones[room.id]={natural,electric:l.on?(exterior?(balconyDay?0:1):night?1:1-natural):0}}
  return {openPlan:openPlan(state),ambient,zones,night:!!night,windows:Object.fromEntries(Object.keys(WINDOWS).map(id=>[id,C.position(state,id)/100]))};
 }
 // Disjoint geometry feeds a shared alpha mask: feather illumination only,
 // never blur the photograph or overlap separate bright room images.
 function polygon(d){
  const t=d.match(/[MHVLZ]|-?\d+(?:\.\d+)?/g)||[];let i=0,x=0,y=0,command='M';const points=[];
  while(i<t.length){if(/^[MHVLZ]$/.test(t[i]))command=t[i++];if(command==='Z')continue;
   if(command==='M'||command==='L'){x=Number(t[i++]);y=Number(t[i++]);if(command==='M')command='L'}else if(command==='H')x=Number(t[i++]);else if(command==='V')y=Number(t[i++]);points.push([x,y]);
  }return points;
 }
 function createRegions(ZONES,WINDOWS,width,height){
 const polygons=Object.fromEntries(Object.entries(ZONES).map(([id,d])=>[id,polygon(d)]));
 function inside(p,x,y){let on=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [a,b]=p[i],[c,d]=p[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)on=!on}return on}
 function regionAt(x,y){
  for(const [id,[wx,wy,w,h]]of Object.entries(WINDOWS))if(x>=wx&&x<wx+w&&y>=wy&&y<wy+h)return 'window:'+id;
  for(const [id,p]of Object.entries(polygons))if(inside(p,x,y))return id;
  return 'structure';
 }
 function partition(){
  const vertices=Object.values(polygons).flat(),windows=Object.values(WINDOWS),xs=[...new Set([0,width,...vertices.map(p=>p[0]),...windows.flatMap(([x,y,w])=>[x,x+w])])].sort((a,b)=>a-b),ys=[...new Set([0,height,...vertices.map(p=>p[1]),...windows.flatMap(([x,y,w,h])=>[y,y+h])])].sort((a,b)=>a-b),regions={};let previous=new Map();
  for(let j=0;j<ys.length-1;j++){const next=new Map();let start=0,active=null;
   function finish(end){if(active===null)return;const key=active+':'+xs[start]+':'+xs[end],old=previous.get(key);if(old&&old.y2===ys[j]){old.y2=ys[j+1];next.set(key,old)}else{const rect={x1:xs[start],x2:xs[end],y1:ys[j],y2:ys[j+1]};(regions[active]??=[]).push(rect);next.set(key,rect)}}
   for(let k=0;k<=xs.length-1;k++){const id=k<xs.length-1?regionAt((xs[k]+xs[k+1])/2,(ys[j]+ys[j+1])/2):null;if(id!==active){finish(k);start=k;active=id}}
   previous=next;
  }return regions;
 }
 return {PARTITIONS:partition(),regionAt};
 }
 const {PARTITIONS,regionAt}=createRegions(ZONES,WINDOWS,816,1280);
 function markup(){
  const use=kind=>`<use href="#floor3-source-${kind}"/>`;
  const source=(kind,file)=>{const shift=kind==='electric'?9:0,patch=kind==='day'?'piso3-sem-exaustor-patch-v1.png':'piso3-sem-exaustor-'+kind+'-patch-v1.png';return `<clipPath id="floor3-nohood-${kind}"><rect x="190" y="${648+shift}" width="59" height="59"/></clipPath><clipPath id="floor3-balcony-clear-${kind}"><rect x="395" y="1135" width="150" height="123"/></clipPath><g id="floor3-source-${kind}"><image href="assets/${file}" width="816" height="1280"/><g clip-path="url(#floor3-nohood-${kind})"><image href="assets/${patch}" width="816" height="1280"/></g><g clip-path="url(#floor3-balcony-clear-${kind})"><image href="assets/piso3-varanda-sem-planta-${kind}-patch-v1.png" width="816" height="1280"/></g></g>`};

  const clips=Object.entries(PARTITIONS).map(([id,rects])=>`<clipPath id="floor3-region-${id}" clipPathUnits="userSpaceOnUse"><path d="${rects.map(r=>`M${r.x1} ${r.y1}H${r.x2}V${r.y2}H${r.x1}Z`).join(' ')}"/></clipPath>`).join('');
  const natural=Object.keys(PARTITIONS).filter(id=>!id.startsWith('balcony')).map(id=>`<g clip-path="url(#floor3-region-${id})" ${['kitchen','living','stairs3'].includes(id)?'mask="url(#floor3-openplan-mask)"':''} opacity="0" ${id==='structure'?'data-floor3-ambient=""':id.startsWith('window:')?`data-floor3-window="${id.slice(7)}"`:`data-floor3-natural="${id}"`}><rect width="816" height="1280" fill="white"/></g>`).join('');
  const balconyNatural=Object.keys(ZONES).filter(id=>id.startsWith('balcony')).map(id=>`<g data-floor3-natural="${id}" clip-path="url(#floor3-region-${id})" opacity="0"><rect width="816" height="1280" fill="white"/></g>`).join('');
  const electric=Object.keys(ZONES).map(id=>`<g data-floor3-electric="${id}" clip-path="url(#floor3-region-${id})" opacity="0"><rect width="816" height="1280" fill="white"/></g>`).join('');
  const feather=`<filter id="floor3-light-feather" filterUnits="userSpaceOnUse" x="-20" y="-20" width="856" height="1320" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="4"/></filter>`;
  const mask=(kind,content)=>`<mask id="floor3-${kind}-feather" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="816" height="1280" style="mask-type:alpha"><g filter="url(#floor3-light-feather)">${content}</g></mask>`;
  return `<g transform="translate(55 55) scale(${890/744} ${1529/1264}) translate(-35 -14)"><defs><clipPath id="floor3-photo-outline"><path d="${OUTLINE}"/></clipPath>${clips}${feather}<linearGradient id="floor3-openplan-gradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="660" y2="1132"><stop offset="0" stop-color="white" data-floor3-openplan="top"/><stop offset="1" stop-color="white" data-floor3-openplan="bottom"/></linearGradient><mask id="floor3-openplan-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="816" height="1280" style="mask-type:alpha"><rect width="816" height="1280" fill="url(#floor3-openplan-gradient)"/></mask>${mask('natural',natural)}${mask('balcony',balconyNatural)}${mask('electric',electric)}${source('closed','piso3-estores-fechados-v1.jpg')}${source('day','piso3-diurno-v1.jpg')}${source('electric','piso3-luz-eletrica-v1.jpg')}${source('night','piso3-noturno-abertos-v1.jpg')}</defs><g clip-path="url(#floor3-photo-outline)">${use('closed')}<g data-floor3-image="day"><g mask="url(#floor3-natural-feather)">${use('day')}</g></g><g data-floor3-image="night" style="display:none"><g mask="url(#floor3-natural-feather)">${use('night')}</g></g><g mask="url(#floor3-balcony-feather)">${use('day')}</g><g data-floor3-image="electric"><g mask="url(#floor3-electric-feather)">${use('electric')}</g></g></g></g>`;
 }
 function mount(svg){
  // Fit the visible photograph outline instead of its former empty border.
  svg.dataset.fitViewBox="55 55 892.3924731183 1529";
  const base=svg.querySelector(':scope > g');if(!base||svg.dataset.floor3Render)return;
  for(const path of [...base.children].filter(n=>n.tagName.toLowerCase()==='path'))path.style.display='none';
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='floor3-render';layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');layer.innerHTML=markup();base.append(layer);svg.dataset.floor3Render='v1';
 }
 function sync(svg,state,night,rooms,balconyDay=!night){
  if(!svg.dataset.floor3Render)return;const l=levels(state,night,rooms,balconyDay);
  for(const e of svg.querySelectorAll('[data-floor3-ambient]'))e.setAttribute('opacity',l.ambient);
  for(const [id,v]of Object.entries(l.zones))for(const kind of ['natural','electric'])for(const e of svg.querySelectorAll(`[data-floor3-${kind}="${id}"]`))e.setAttribute('opacity',kind==='natural'&&['kitchen','living','stairs3'].includes(id)?1:v[kind]);
  for(const [id,v]of Object.entries(l.openPlan))for(const e of svg.querySelectorAll(`[data-floor3-openplan="${id}"]`))e.setAttribute('stop-opacity',v);
  for(const [id,v]of Object.entries(l.windows))for(const e of svg.querySelectorAll(`[data-floor3-window="${id}"]`))e.setAttribute('opacity',v);
  svg.querySelector('[data-floor3-image="day"]').style.display=night?'none':'';svg.querySelector('[data-floor3-image="night"]').style.display=night?'':'none';svg.dataset.floor3Environment=night?'night':'day';
 }
 return {mount,sync,levels,openPlan,markup,ZONES,WINDOWS,OUTLINE,HOTSPOTS,ENTRANCE,PARTITIONS,regionAt,createRegions};
});
