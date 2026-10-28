/* Pinch/pan the plan only. Header, menu and dialogs remain fixed. */
(function(){
 'use strict';
 const C=window.CasaPlanViewCore,stage=document.getElementById('plan-stage'),points=new Map();
 let svg=null,bounds=null,base=null,view=null,mode=null,gesture=null,onChange=()=>{},onSwipe=()=>{},suppressUntil=0;
 const copy=v=>({...v});
 function render(){if(!svg||!view)return;svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.width} ${view.height}`);stage.classList.toggle('is-zoomed',base.width/view.width>1.01);onChange()}
 function idleBlocked(){return !!document.querySelector('dialog[open]')||!!window.CasaMeteoBridge?.visible()}
 function cancel(){
  const ids=[...points.keys()];points.clear();if(mode==='pinch'||mode==='consumed'||gesture?.moved)suppressUntil=performance.now()+700;
  mode=null;gesture=null;for(const id of ids)if(stage.hasPointerCapture(id))stage.releasePointerCapture(id);
 }
 function reset(next=svg){
  cancel();svg=next;if(!svg)return;
  const values=(svg.dataset.fitViewBox||svg.getAttribute('viewBox')).split(/\s+/).map(Number);svg.dataset.fitViewBox=values.join(' ');
  bounds={x:values[0],y:values[1],width:values[2],height:values[3]};
  const r=stage.getBoundingClientRect();if(!r.width||!r.height)return;
  base=C.fit(bounds,r.width,r.height);view=copy(base);render();
 }
 function focal(x,y){const r=stage.getBoundingClientRect();return {x:(x-r.left)/r.width,y:(y-r.top)/r.height}}
 function zoomAt(amount,x,y){if(!base)return;view=C.zoom(base,view,amount,focal(x,y));render()}
 function pinch(){
  const p=[...points.values()].slice(0,2),mid={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2},f=focal(mid.x,mid.y);
  gesture={view:copy(view),distance:Math.max(10,Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)),anchor:{x:view.x+f.x*view.width,y:view.y+f.y*view.height},zoom:base.width/view.width,moved:true};mode='pinch';
  window.CasaLabelLayout?.cancel();window.CasaSensorLayout?.cancel();window.CasaAlarmLayout?.cancel();window.CasaFanLayout?.cancel();
  for(const id of points.keys())stage.setPointerCapture(id);
 }
 stage.addEventListener('pointerdown',e=>{
  if(!svg||idleBlocked()||(e.pointerType==='mouse'&&e.button!==0))return;
  // A single pointer on a banner belongs to its label drag; two pointers zoom.
  points.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(points.size>=2){pinch();e.preventDefault();e.stopImmediatePropagation();return}
  if(e.target.closest('.room-label,.balcony-sensor-badge,.blind-banner,.blind-window,.ev-charger,.dehumidifier-object,.heater-object,.ev-badge,.balcony-appliance-hit,.dishwasher-plan-hit,.tv-plan-hit,.entrance-contact-hit,.garage-gate-hit,.alarm-pin,.fan-pin')){mode='label';return}
  mode=base.width/view.width>1.01?'pan':'swipe';
  gesture={x:e.clientX,y:e.clientY,view:copy(view),moved:false};
  stage.setPointerCapture(e.pointerId);
 },{capture:true});
 stage.addEventListener('pointermove',e=>{
  if(!points.has(e.pointerId)||!svg)return;
  points.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(mode==='pinch'&&points.size>=2){
   const p=[...points.values()].slice(0,2),distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),f=focal((p[0].x+p[1].x)/2,(p[0].y+p[1].y)/2);
   const factor=Math.max(1,Math.min(4,gesture.zoom*distance/gesture.distance)),w=base.width/factor,h=base.height/factor;
   view=C.limit(base,{x:gesture.anchor.x-f.x*w,y:gesture.anchor.y-f.y*h,width:w,height:h});render();
   e.preventDefault();e.stopImmediatePropagation();return;
  }
  if(mode==='consumed'){e.preventDefault();e.stopImmediatePropagation();return}
  if(mode==='pan'){
   const r=stage.getBoundingClientRect(),dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
   if(Math.hypot(dx,dy)>6)gesture.moved=true;
   view=C.pan(base,gesture.view,-dx*gesture.view.width/r.width,-dy*gesture.view.height/r.height);render();
   e.preventDefault();e.stopImmediatePropagation();
  }
 },{capture:true});
 function finish(e,cancelled=false){
  if(!points.has(e.pointerId))return;
  const oldMode=mode,g=gesture;points.delete(e.pointerId);
  if(oldMode==='label'){if(!points.size){mode=null;gesture=null}return}
  if(oldMode==='pinch'||oldMode==='consumed'||g?.moved)suppressUntil=performance.now()+700;
  mode=points.size?'consumed':null;if(!points.size)gesture=null;
  if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);
  if(oldMode==='pinch'||oldMode==='consumed'||oldMode==='pan'){e.stopImmediatePropagation();return}
  if(!cancelled&&oldMode==='swipe'&&e.pointerType!=='mouse'){
   const dx=e.clientX-g.x,dy=e.clientY-g.y;
   if(Math.abs(dy)>65&&Math.abs(dy)>Math.abs(dx)*1.3){suppressUntil=performance.now()+700;onSwipe(dy<0?1:-1);e.stopImmediatePropagation()}
  }
 }
 stage.addEventListener('pointerup',e=>finish(e),true);
 stage.addEventListener('pointercancel',e=>finish(e,true),true);
 stage.addEventListener('lostpointercapture',e=>{if(e.target===stage&&points.has(e.pointerId))finish(e,true)},true);
 stage.addEventListener('click',e=>{if(performance.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
 stage.addEventListener('wheel',e=>{
  if(!base||idleBlocked())return;
  if(e.ctrlKey||e.metaKey){e.preventDefault();e.stopImmediatePropagation();zoomAt(Math.exp(-e.deltaY*.005),e.clientX,e.clientY)}
  else if(base.width/view.width>1.01){e.preventDefault();e.stopImmediatePropagation();const r=stage.getBoundingClientRect();view=C.pan(base,view,e.deltaX*view.width/r.width,e.deltaY*view.height/r.height);render()}
 },{capture:true,passive:false});
 stage.addEventListener('keydown',e=>{
  if(e.altKey||e.target.closest('button')||idleBlocked())return;
  const r=stage.getBoundingClientRect();if(['+','=','-','0'].includes(e.key)){e.preventDefault();e.stopPropagation();if(e.key==='0')reset();else zoomAt(e.key==='-'?1/1.3:1.3,r.left+r.width/2,r.top+r.height/2)}
 });
 window.addEventListener('blur',cancel);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel()});
 window.CasaPlanView={reset,resize:()=>reset(),isInteracting:()=>points.size>0,configure(options){onChange=options.onChange;onSwipe=options.onSwipe}};
})();
