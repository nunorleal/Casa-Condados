/* Movable label overlay. All coordinates stay in the plan's SVG space. */
(function(){
 'use strict';
 const G=window.BannerGeometry,C=window.CasaLabelLayoutCore;
 function create(KEY,selector,sensors=false,customValidate=null){
 const validate=customValidate||(sensors?C.sensorPositions:C.positions);
 let saved=Object.create(null),active=null;
 const entries=new WeakMap();
 try{saved=validate(JSON.parse(localStorage.getItem(KEY)),window.CasaPlans)}catch{}
 function viewport(stage,svg){const m=svg.getScreenCTM?.(),r=stage.getBoundingClientRect();if(m)return {scale:Math.hypot(m.a,m.b),ox:m.e-r.left,oy:m.f-r.top};const v=svg.viewBox.baseVal,scale=Math.min(r.width/v.width,r.height/v.height);return {scale,ox:(r.width-v.width*scale)/2-v.x*scale,oy:(r.height-v.height*scale)/2-v.y*scale}}
 function put(b,p,v){b.dataset.x=p.x;b.dataset.y=p.y;b.style.left=(v.ox+p.x*v.scale)+'px';b.style.top=(v.oy+p.y*v.scale)+'px'}
 function store(entry,b){
  saved[entry.floor]??=Object.create(null);saved[entry.floor][entry.room.id]={x:Number(b.dataset.x),y:Number(b.dataset.y)};
  try{localStorage.setItem(KEY,JSON.stringify(validate(saved,window.CasaPlans)))}catch{}
 }
 function position(stage,svg){
  if(!svg)return;const v=viewport(stage,svg);if(v.scale<=0)return;
  for(const b of document.querySelectorAll(selector)){
   const entry=entries.get(b);if(!entry||b.hidden)continue;
   const polys=G.polygons(entry.room.area),bounds=G.bounds(polys),scaled=b.matches('.room-label,.ev-badge,.alarm-pin,.fan-pin'),bannerScale=(window.CasaBannerSize?.value()||100)/100;if(scaled)b.style.transform='translate(-50%,-50%) scale('+bannerScale+')';
   // Wrap compact room labels rather than allow their rectangle to cross a wall.
   b.style.maxWidth=sensors?'none':Math.max(16,Math.min(180,Math.floor((bounds.maxX-bounds.minX)*v.scale)-1))+'px';
   b.style.minHeight=sensors?'0px':Math.min(44,Math.floor((bounds.maxY-bounds.minY)*v.scale)-1)+'px';
   if(!sensors){b.style.fontSize='';b.style.padding=''}
   let w=b.getBoundingClientRect().width/v.scale,h=b.getBoundingClientRect().height/v.scale;
   let p=G.nearestFit(polys,{x:Number(b.dataset.x),y:Number(b.dataset.y)},w,h);
   if(scaled&&!p){for(let factor=bannerScale*.94;factor>=.2&&!p;factor*=.94){b.style.transform='translate(-50%,-50%) scale('+factor+')';w=b.getBoundingClientRect().width/v.scale;h=b.getBoundingClientRect().height/v.scale;p=G.nearestFit(polys,{x:Number(b.dataset.x),y:Number(b.dataset.y)},w,h)}}
   if(sensors&&!scaled&&!p){for(let n=0;n<24&&!p;n++){b.style.fontSize=(parseFloat(b.style.fontSize)*.94)+'px';w=b.getBoundingClientRect().width/v.scale;h=b.getBoundingClientRect().height/v.scale;p=G.nearestFit(polys,{x:Number(b.dataset.x),y:Number(b.dataset.y)},w,h)}}
   if(!p){b.style.fontSize='7px';b.style.padding='4px';b.style.minHeight='0px';w=b.getBoundingClientRect().width/v.scale;h=b.getBoundingClientRect().height/v.scale;p=G.nearestFit(polys,{x:entry.room.x,y:entry.room.y},w,h)}
   if(p)put(b,p,v);
   else{b.style.visibility='hidden';continue}
   b.style.visibility='';
  }
 }
 function mount(b,floor,room){
  const entry={floor,room,suppressUntil:0};entries.set(b,entry);
  const initial=saved[floor]?.[room.id]||room;b.dataset.x=initial.x;b.dataset.y=initial.y;
  b.title='Arraste para mover dentro da divisão. Alt + setas também permite mover.';
  b.addEventListener('click',e=>{if(performance.now()<entry.suppressUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
  b.addEventListener('pointerdown',e=>{
   if(active||!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0)||document.querySelector('dialog[open]')||window.CasaMeteoBridge?.visible())return;
   const stage=document.getElementById('plan-stage'),svg=stage.querySelector('svg');
   if(!svg)return;
   e.stopPropagation();
   active={b,entry,id:e.pointerId,x:e.clientX,y:e.clientY,start:{x:Number(b.dataset.x),y:Number(b.dataset.y)},dragged:false,stage,svg,cancel:()=>finish({pointerId:e.pointerId,stopPropagation(){}},true)};
   b.setPointerCapture(e.pointerId);
  });
  b.addEventListener('pointermove',e=>{
   const a=active;if(!a||a.b!==b||a.id!==e.pointerId)return;
   if(!a.dragged&&Math.hypot(e.clientX-a.x,e.clientY-a.y)<7)return;
   a.dragged=true;b.classList.add('dragging');e.preventDefault();e.stopPropagation();
   const v=viewport(a.stage,a.svg),target={x:a.start.x+(e.clientX-a.x)/v.scale,y:a.start.y+(e.clientY-a.y)/v.scale};
   const p=C.constrain(room,{x:Number(b.dataset.x),y:Number(b.dataset.y)},target,{width:b.getBoundingClientRect().width/v.scale,height:b.getBoundingClientRect().height/v.scale});
   put(b,p,v);
  });
  function finish(e,cancel=false){
   const a=active;if(!a||a.b!==b||a.id!==e.pointerId)return;
   active=null;b.classList.remove('dragging');
   if(a.dragged){entry.suppressUntil=performance.now()+700;e.stopPropagation();if(cancel)put(b,a.start,viewport(a.stage,a.svg));else store(entry,b)}
   if(b.hasPointerCapture(e.pointerId))b.releasePointerCapture(e.pointerId);
  }
  b.addEventListener('pointerup',e=>finish(e));
  b.addEventListener('pointercancel',e=>finish(e,true));
  b.addEventListener('lostpointercapture',e=>finish(e,true));
  b.addEventListener('keydown',e=>{
   const delta={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];
   if(!e.altKey||!delta||active)return;
   e.preventDefault();e.stopPropagation();
   const stage=document.getElementById('plan-stage'),v=viewport(stage,stage.querySelector('svg')),start={x:Number(b.dataset.x),y:Number(b.dataset.y)};
   put(b,C.constrain(room,start,{x:start.x+delta[0]/v.scale,y:start.y+delta[1]/v.scale},{width:b.getBoundingClientRect().width/v.scale,height:b.getBoundingClientRect().height/v.scale}),v);store(entry,b);
  });
 }
 window.addEventListener('bannersizechange',()=>{const stage=document.getElementById('plan-stage');position(stage,stage.querySelector('svg'))});
 window.addEventListener('blur',()=>active?.cancel());
 document.addEventListener('visibilitychange',()=>{if(document.hidden)active?.cancel()});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){active.cancel();e.preventDefault()}});
 return {mount,position,snapshot:()=>validate(saved,window.CasaPlans),cancel:()=>active?.cancel(),isDragging:()=>!!active};
 }
 window.CasaCreateLayout=create;
 window.CasaLabelLayout=create('casa-nova-room-label-layout-v1','#room-labels > *');
 window.CasaSensorLayout=create('casa-leal-sensor-layout-v1','.balcony-sensor-badge',true);
})();
