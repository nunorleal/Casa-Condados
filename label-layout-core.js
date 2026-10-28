/* Pure validation and full-rectangle containment for label positions. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./banner-core.js'));else root.CasaLabelLayoutCore=factory(root.BannerGeometry)})(typeof window==='undefined'?globalThis:window,function(G){
 'use strict';
 function positions(value,plans){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Posições inválidas.');
  const out=Object.create(null);
  for(const [floor,rooms] of Object.entries(value)){
   if(!Object.hasOwn(plans,floor)||!rooms||typeof rooms!=='object'||Array.isArray(rooms))throw Error('Piso inválido.');
   out[floor]=Object.create(null);
   for(const [id,p] of Object.entries(rooms)){
    const room=plans[floor].rooms.find(r=>r.id===id);
    if(!room||!p||typeof p!=='object'||Array.isArray(p)||Object.keys(p).length!==2||!Number.isFinite(p.x)||!Number.isFinite(p.y))throw Error('Legenda inválida.');
    const bounds=G.bounds(G.polygons(room.area));
    if(p.x<bounds.minX||p.x>bounds.maxX||p.y<bounds.minY||p.y>bounds.maxY||!G.rectFits(G.polygons(room.area),p,1,1))throw Error('Posição fora da divisão.');
    out[floor][id]={x:p.x,y:p.y};
   }
  }
  return out;
 }
 function constrain(room,start,target,size){return G.move(G.polygons(room.area),start,target,size.width,size.height)}
 function sensorRoom(plans,floor,id){
  const room=plans[floor].rooms.find(r=>r.id===id);
  return floor==='-1'&&id==='garage'?{...room,area:'M128 512H880V1176H290V616H128Z'}:room;
 }
 function sensorPositions(value,plans){
  const sensorPlans=Object.fromEntries(Object.entries(plans).map(([floor,p])=>[floor,{...p,rooms:p.rooms.map(r=>sensorRoom(plans,floor,r.id))}]));
  const clean=positions(value,sensorPlans),allowed={'3':['master','living','balcony-south'],'-1':['garage']};
  for(const [floor,rooms]of Object.entries(clean))for(const id of Object.keys(rooms))if(!allowed[floor]?.includes(id))throw Error('Divisão sem banner de sensor.');
  return clean;
 }
 function alarmPositions(value,plans){const out=sensorPositions(value,plans);if(Object.keys(out).some(f=>f!=='-1'))throw Error('Posição do alarme fora da garagem.');return out}
 function tvPositions(value,plans){const out=sensorPositions(value,plans);if(Object.keys(out).some(f=>f!=='3')||Object.keys(out['3']||{}).some(r=>r!=='living'))throw Error('Banner da TV fora da sala.');return out}
 function sensorScale(value){if(!Number.isInteger(value)||value<60||value>160||value%5)throw Error('Tamanho dos banners inválido.');return value}
 return {tvPositions,positions,constrain,sensorPositions,sensorRoom,sensorScale,blindScale:sensorScale,alarmPositions};
});
