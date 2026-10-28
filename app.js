(function(){
'use strict';
const plans=window.CasaPlans,order=['4','3','-1'];let current='3',lastChange=0,floorAnimationTimer;
const $=id=>document.getElementById(id),stage=$('plan-stage');
function positionLabels(){
 window.CasaLabelLayout.position(stage,$('plan-canvas').querySelector('svg'));
 window.CasaDehumidifier?.position();window.CasaHeater?.position();window.CasaBalconyAppliances?.position();window.CasaDishwasher?.position();window.CasaTV?.position();window.CasaHome?.position();window.CasaEntrance?.position();window.CasaEVRead?.position();window.CasaBalconySensor?.position();window.CasaGate?.position();window.CasaAlarm?.position();window.CasaFan?.position();
}

function blocked(){return window.CasaDehumidifier?.isDragging()||window.CasaHeater?.isDragging()||window.CasaPlanView.isInteracting()||window.CasaLabelLayout.isDragging()||window.CasaSensorLayout.isDragging()||window.CasaAlarmLayout?.isDragging()||window.CasaFanLayout?.isDragging()||!!document.querySelector('dialog[open]')||!!window.CasaMeteoBridge?.visible()}
function showFloor(id,animate=true){
 if(!plans[id]||blocked())return;
 const p=plans[id],previous=current;current=id;$('plan-canvas').innerHTML=p.svg;window.CasaAddons?.mount($('plan-canvas').querySelector('svg'),id);window.CasaHome?.mount($('plan-canvas').querySelector('svg'),id);window.CasaWindows?.mount($('plan-canvas').querySelector('svg'),id);window.CasaEVRead?.mount($('plan-canvas').querySelector('svg'),id);window.CasaEntrance?.mount($('plan-canvas').querySelector('svg'),id);window.CasaGate?.mount($('plan-canvas').querySelector('svg'),id);window.CasaAlarm?.mount($('plan-canvas').querySelector('svg'),id);window.CasaFan?.mount($('plan-canvas').querySelector('svg'),id);window.CasaBalconySensor?.mount($('plan-canvas').querySelector('svg'),id);window.CasaBalconyAppliances?.mount($('plan-canvas').querySelector('svg'),id);window.CasaDishwasher?.mount($('plan-canvas').querySelector('svg'),id);window.CasaTV?.mount($('plan-canvas').querySelector('svg'),id);window.CasaStudioMonitor?.mount($('plan-canvas').querySelector('svg'),id);window.CasaHeater?.mount($('plan-canvas').querySelector('svg'),id);window.CasaDehumidifier?.mount($('plan-canvas').querySelector('svg'),id);$('room-labels').replaceChildren();
 $('floor-title').textContent=p.name;stage.setAttribute('aria-label','Planta · '+p.name+' · '+p.subtitle);
 document.querySelectorAll('[data-floor]').forEach(b=>{if(b.dataset.floor===id)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 for(const room of p.rooms){const b=document.createElement('button');b.className='room-label'+(room.id.startsWith('stairs')?' stairs':'');b.dataset.room=room.id;b.dataset.roomFloor=id;b.dataset.x=room.x;b.dataset.y=room.y;b.textContent=window.CasaRoomNames.get(id,room.id);$('room-labels').append(b);window.CasaLabelLayout.mount(b,id,room);window.CasaRoomNames.bind(b,id,room.id,()=>openRoom(id,room))}
 window.CasaPlanView.reset($('plan-canvas').querySelector('svg'));if(animate&&previous!==id){stage.style.setProperty('--floor-direction',order.indexOf(id)>order.indexOf(previous)?'30px':'-30px');stage.classList.remove('changing');void stage.offsetWidth;stage.classList.add('changing');clearTimeout(floorAnimationTimer);floorAnimationTimer=setTimeout(()=>stage.classList.remove('changing'),400)}
}
function openRoom(floor,room){
 if(document.querySelector('dialog[open]')||window.CasaMeteoBridge?.visible())return;
 $('room-title').textContent=window.CasaRoomNames.get(floor,room.id);$('room-floor').textContent='Dispositivos da divisão';window.CasaHome?.decorateRoom(floor,{...room,name:window.CasaRoomNames.get(floor,room.id)});$('room-dialog').showModal();
}
let roomTap=null;
stage.addEventListener('pointerdown',e=>{roomTap=e.isPrimary?{x:e.clientX,y:e.clientY}:null},true);
stage.addEventListener('pointercancel',()=>{roomTap=null},true);
stage.addEventListener('click',e=>{
 const start=roomTap;roomTap=null;
 if(!start||e.detail===0||Math.hypot(e.clientX-start.x,e.clientY-start.y)>8||e.target.closest('button,.blind-window,.ev-charger')||blocked())return;
 const svg=$('plan-canvas').querySelector('svg'),matrix=svg?.getScreenCTM();if(!matrix)return;
 const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
 const room=[...plans[current].rooms].reverse().find(r=>window.BannerGeometry.rectFits(window.BannerGeometry.polygons(r.area),point,1,1));
 if(room)openRoom(current,room);
});
document.querySelectorAll('[data-floor]').forEach(b=>b.addEventListener('click',()=>showFloor(b.dataset.floor)));
$('home-button').addEventListener('click',()=>showFloor('3'));
$('open-settings').addEventListener('click',()=>$('settings-dialog').showModal());
$('open-scenarios').addEventListener('click',()=>$('scenarios-dialog').showModal());
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',async()=>{
 const action=button.dataset.scene,blinds=action.startsWith('blinds-'),on=action==='lights-on',open=action==='blinds-open';
 if(blinds){const buttons=[...document.querySelectorAll('[data-scene]')];buttons.forEach(b=>b.disabled=true);$('scenarios-status').textContent='A enviar pedidos aos estores disponíveis…';try{const result=await window.CasaHome.setAllBlinds(open?100:0);$('scenarios-status').textContent=result.sent+' pedidos Cloud enviados · '+result.simulated+' em demonstração · '+result.skipped+' indisponíveis. As posições acompanham as leituras.'}finally{buttons.forEach(b=>b.disabled=false)}}
 else{const buttons=[...document.querySelectorAll('[data-scene]')];buttons.forEach(b=>b.disabled=true);$('scenarios-status').textContent='A enviar pedidos às luzes disponíveis…';try{const r=await window.CasaHome.setAllLights(on);$('scenarios-status').textContent=r.sent+' pedidos Cloud enviados · '+r.simulated+' em demonstração · '+r.skipped+' indisponíveis. As luzes acompanham as leituras.'}finally{buttons.forEach(b=>b.disabled=false)}}
}));


document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
// Dismiss only a tap that starts and ends on the backdrop, never a drag from a field.
document.querySelectorAll('dialog').forEach(dialog=>{
 let backdropPointer=null;
 function outside(e){const r=dialog.getBoundingClientRect();return e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)}
 dialog.addEventListener('pointerdown',e=>{backdropPointer=e.isPrimary&&e.button===0&&outside(e)?e.pointerId:null});
 dialog.addEventListener('pointercancel',()=>{backdropPointer=null});
 dialog.addEventListener('click',e=>{
  const dismiss=backdropPointer!==null&&outside(e);backdropPointer=null;
  if(dismiss&&dialog.open){e.preventDefault();e.stopPropagation();dialog.close()}
 });
 dialog.addEventListener('close',()=>{backdropPointer=null});
});
function setLabelsVisible(visible,persist=false){
 document.body.classList.toggle('names-hidden',!visible);
 $('show-room-labels').checked=visible;
 if(persist){try{localStorage.setItem('casa-nova-labels-v1',JSON.stringify(visible))}catch{}}
}
$('show-room-labels').addEventListener('change',()=>setLabelsVisible($('show-room-labels').checked,true));
let labelsVisible=true;
try{const saved=JSON.parse(localStorage.getItem('casa-nova-labels-v1'));if(typeof saved==='boolean')labelsVisible=saved}catch{}
setLabelsVisible(labelsVisible);

function step(direction){if(blocked()||Date.now()-lastChange<700)return;const index=order.indexOf(current)+direction;if(index<0||index>=order.length)return;lastChange=Date.now();showFloor(order[index])}
stage.addEventListener('wheel',e=>{if(blocked()||Math.abs(e.deltaY)<18)return;e.preventDefault();step(e.deltaY>0?1:-1)},{passive:false});
window.addEventListener('keydown',e=>{if(blocked()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='PageDown'){e.preventDefault();step(1)}if(e.key==='PageUp'){e.preventDefault();step(-1)}});
window.addEventListener('roomnameschange',()=>{for(const b of $('room-labels').children)b.textContent=window.CasaRoomNames.get(current,b.dataset.room);positionLabels()});
window.CasaRooms={open:(floor,id)=>{const room=plans[floor]?.rooms.find(r=>r.id===id);if(room)openRoom(floor,room)}};
window.CasaPlanView.configure({onChange:positionLabels,onSwipe:step});
new ResizeObserver(()=>window.CasaPlanView.resize()).observe(stage);
showFloor('3',false);
})();
