/* Pure model for Casa Leal visual demonstration and future device associations. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./energy-core.js'),require('./temperature-core.js'),require('./alarm-core.js'),require('./windows-core.js'),require('./tv-core.js'),require('./heater-core.js'),require('./dehumidifier-core.js'));else root.CasaHomeCore=factory(root.CasaEnergyCore,root.CasaTemperatureCore,root.CasaAlarmCore,root.CasaWindowsCore,root.CasaTVCore,root.CasaHeaterCore,root.CasaDehumidifierCore)})(typeof window==='undefined'?globalThis:window,function(Energy,Temperature,Alarm,Windows,TV,Heater,Dehumidifier){
 'use strict';
 const WINDOWS=[
  {id:'master-north',floor:'3',room:'master',name:'Suite principal',x1:120,y1:225,x2:280,y2:225,side:'north'},
  {id:'bedroom2-north',floor:'3',room:'bedroom2',name:'Quarto do Gui',x1:438,y1:225,x2:585,y2:225,side:'north'},
  {id:'bedroom3-north',floor:'3',room:'bedroom3',name:'Biblioteca / Escritório Gui',x1:720,y1:225,x2:870,y2:225,side:'north'},
  {id:'suite-west',floor:'3',room:'bath1',name:'WC · Suite',x1:65,y1:734,x2:65,y2:806,side:'west'},
  {id:'kitchen-west',floor:'3',room:'kitchen',name:'Cozinha',x1:65,y1:940,x2:65,y2:1012,side:'west'},
  {id:'living-south-left',floor:'3',room:'living',name:'Sala · janela esquerda',x1:105,y1:1419,x2:350,y2:1419,side:'south'},
  {id:'living-south-right',floor:'3',room:'living',name:'Sala · janela direita',x1:390,y1:1419,x2:570,y2:1419,side:'south'},
  {id:'studio-west',floor:'4',room:'studio',name:'Estúdio',x1:65,y1:555,x2:65,y2:666,side:'west'},
  {id:'living2-west',floor:'4',room:'living2',name:'Sala 2',x1:65,y1:845,x2:65,y2:959,side:'west'}
 ];
 const DEMO_BLIND_LINKS={'living-south-right':'living-south-left','suite-west':'kitchen-west','bedroom3-north':'bedroom2-north','studio-west':'living-south-left','living2-west':'living-south-left'};
 const key=(floor,room)=>floor+':'+room;
 function roomKeys(plans){return Object.entries(plans).flatMap(([f,p])=>p.rooms.map(r=>key(f,r.id)))}
 function obj(v,allowed){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!allowed.includes(k)))throw Error('Campos de configuração inválidos.');return v}
 function demo(v,plans){
  obj(v,['lights','blinds']);obj(v.lights,roomKeys(plans));obj(v.blinds,WINDOWS.map(w=>w.id));const lights={},blinds={};
  for(const [k,x]of Object.entries(v.lights)){if(typeof x!=='boolean')throw Error('Luz de demonstração inválida.');lights[k]=x}
  for(const [k,x]of Object.entries(v.blinds)){if(!Number.isFinite(x)||x<0||x>100)throw Error('Percentagem de estore inválida.');blinds[k]=x}
  return {lights,blinds};
 }
 function defaults(){return {lights:{},blinds:{}}}
 function position(v,id){return v.blinds[id]??100}
 function light(v,floor,room){return v.lights[key(floor,room)]===true}
 function opacity({night,on,positions,exterior=false}){
  if(on)return 0.04;
  if(night)return exterior ? .75 : .86;
  if(exterior)return 0;
  if(!positions.length)return .16;
  return .12+.68*(1-Math.max(...positions)/100);
 }
 // Interior daylight is shared; each linked shutter contributes equally.
 const SALA_SOURCES=['kitchen-west','living-south-left','living-south-right'];
 const BEDROOM_SOURCES=['master-north','bedroom2-north','bedroom3-north'];
 const INDIRECT_SOURCES={
  '3:entrance':SALA_SOURCES,
  '3:kitchen':SALA_SOURCES,
  '3:living':SALA_SOURCES,
  '3:stairs3':SALA_SOURCES,
  '3:hall':BEDROOM_SOURCES,
  '3:bath2':BEDROOM_SOURCES,
  '3:closet':['master-north'],
  '3:bath3':SALA_SOURCES
 };
 function lighting(v,floor,room,night){
  const id=typeof room==='string'?room:room.id,on=light(v,floor,floor==='3'&&id==='stairs3'?'living':id),exterior=id.startsWith('balcony'),shared=INDIRECT_SOURCES[key(floor,id)];
  const sources=shared||WINDOWS.filter(w=>w.floor===floor&&w.room===id).map(w=>w.id),positions=sources.map(id=>position(v,id));
  const opening=positions.length?positions.reduce((a,b)=>a+b,0)/positions.length:0;
  let amount=opacity({night,on,positions:shared?[opening]:positions,exterior});
  // At night the adjoining rooms receive only a faint ambient contribution.
  if(night&&!on&&shared)amount-=.06*opening/100;
  const neutralGarage=floor==='-1'&&id==='garage';
  // Neutral white garage lighting reveals the original material and car pixels.
  if(neutralGarage&&on)amount=0;
  const daylight=shared?opening:(positions.length?Math.max(...positions):0);
  return {opacity:amount,on,electricOpacity:on&&!neutralGarage?(night?1:1-.8*daylight/100):0,opening,indirect:!!shared,sources:[...sources]};
 }
 function beamOpacity(v,id,night){return position(v,id)/100*(night?.72:.38)}
 function beam(w){
  const horizontal=w.y1===w.y2,len=horizontal?w.x2-w.x1:w.y2-w.y1,reach=Math.min(200,Math.max(115,len*.9)),spread=22;
  if(w.side==='north')return {d:`M${w.x1} ${w.y1}H${w.x2}L${w.x2+spread} ${w.y1+reach}H${w.x1-spread}Z`,x1:0,y1:0,x2:0,y2:1};
  if(w.side==='south')return {d:`M${w.x1} ${w.y1}H${w.x2}L${w.x2+spread} ${w.y1-reach}H${w.x1-spread}Z`,x1:0,y1:1,x2:0,y2:0};
  return {d:`M${w.x1} ${w.y1}V${w.y2}L${w.x1+reach} ${w.y2+spread}V${w.y1-spread}Z`,x1:0,y1:0,x2:1,y2:0};
 }
 function server(v){if(v==='')return '';let u;try{u=new URL(v.includes('://')?v:'https://'+v)}catch{throw Error('Servidor Shelly Cloud inválido.')}
  if(u.protocol!=='https:'||!/^shelly-[a-z0-9-]+\.shelly\.cloud$/i.test(u.hostname)||u.port||u.username||u.password||u.search||u.hash||u.pathname!=='/')throw Error('Indique apenas o servidor HTTPS da sua conta Shelly Cloud.');return u.origin;
 }
 function deviceId(v,contact=false){if(typeof v!=='string'||!(contact?/^(?:[a-f0-9]{6,32}|XB\d+)$/i:/^[a-f0-9]{6,32}$/i).test(v))throw Error('ID Shelly inválido.');return /^XB/i.test(v)?v.toUpperCase():v.toLowerCase()}
 function binding(v,used,contact=false){obj(v,contact?['deviceId','channel','source']:['deviceId','channel','type']);const id=deviceId(v.deviceId,contact),max=contact?255:15;
  if(!Number.isInteger(v.channel)||v.channel<0||v.channel>max)throw Error('Canal Shelly inválido.');
  if(!contact&&!['switch','light','cover'].includes(v.type))throw Error('Tipo de saída inválido.');
  if(contact&&v.source==='bthome'&&/^XB/i.test(id))throw Error('O ID XB pertence ao sensor BLU; BTHome exige gateway hexadecimal.');
  if(contact&&!['blu','bthome'].includes(v.source))throw Error('Origem do contacto inválida.');
  if(contact&&/^XB/i.test(id)&&(!/^XB\d{1,15}$/i.test(id)||BigInt(id.slice(2))>281474976710655n))throw Error('ID BLU inválido.');
  const token=id.toLowerCase()+':'+v.channel;if(!contact&&used.has(token))throw Error('O mesmo ID e canal não pode controlar dois equipamentos.');if(!contact)used.add(token);
  return contact?{deviceId:id,channel:v.channel,source:v.source}:{deviceId:id,channel:v.channel,type:v.type};
 }
 function setup(v,plans){
  obj(v,['fan','studioBindings','mediaBindings','balconyMeters','dishwasherMeter','dehumidifier','heater','tvMeter','server','lights','blinds','entranceContact','gateContact','windowContacts','alarm','homeEnergy','evMeter','meteoSensor','garageSensor','livingSensor','masterSensor']);const out={server:server(v.server),lights:{},blinds:{},entranceContact:null},used=new Set();obj(v.lights,roomKeys(plans));obj(v.blinds,WINDOWS.map(w=>w.id));
  for(const [k,b]of Object.entries(v.lights)){const x=binding(b,used);if(x.type==='cover')throw Error('Tipo de luz inválido.');out.lights[k]=x}
  for(const [k,b]of Object.entries(v.blinds)){const x=binding(b,used);if(x.type!=='cover')throw Error('Tipo de estore inválido.');out.blinds[k]=x}
  if(v.entranceContact!==null&&v.entranceContact!==undefined)out.entranceContact=binding(v.entranceContact,used,true);
  if(v.gateContact!==undefined){out.gateContact=v.gateContact===null?null:binding(v.gateContact,used,true);
   if(out.gateContact&&out.entranceContact&&out.gateContact.deviceId.toLowerCase()===out.entranceContact.deviceId.toLowerCase()&&out.gateContact.channel===out.entranceContact.channel)throw Error('O contacto do portão já está associado à porta de entrada.');
  }
  if(v.windowContacts!==undefined)out.windowContacts=Windows.config(v.windowContacts,[out.entranceContact,out.gateContact]);
  if(v.alarm!==undefined)out.alarm=Alarm.config(v.alarm,{deviceId,used});
  if(v.studioBindings!==undefined){obj(v.studioBindings,['monitor','apollo','terramaster','backup']);out.studioBindings={};for(const [role,b]of Object.entries(v.studioBindings))out.studioBindings[role]=b===null?null:Heater.config(b,used)}
  if(v.mediaBindings!==undefined){obj(v.mediaBindings,['vodafone','soundbar','playstation','unifi']);out.mediaBindings={};for(const [role,b]of Object.entries(v.mediaBindings))out.mediaBindings[role]=b===null?null:Heater.config(b,used)}
  if(v.balconyMeters!==undefined){obj(v.balconyMeters,['washer','boiler']);out.balconyMeters={};for(const [role,b]of Object.entries(v.balconyMeters))out.balconyMeters[role]=b===null?null:Heater.config(b,used)}
  if(v.dishwasherMeter!==undefined)out.dishwasherMeter=v.dishwasherMeter===null?null:Heater.config(v.dishwasherMeter,used);
  if(v.homeEnergy!==undefined){if(v.homeEnergy===null)out.homeEnergy=null;else{obj(v.homeEnergy,['source','deviceId','channel','contractKVA']);if(v.homeEnergy.source!=='custom')throw Error('Associe explicitamente o Shelly EM desta casa.');out.homeEnergy=Energy.config(v.homeEnergy,deviceId)}}
  if(v.evMeter!==undefined){if(v.evMeter===null)out.evMeter=null;else{obj(v.evMeter,['deviceId','channel']);const checked=Energy.config({source:'custom',...v.evMeter,contractKVA:6.9},deviceId);out.evMeter={deviceId:checked.deviceId,channel:checked.channel}}}
  if(v.meteoSensor!==undefined)out.meteoSensor=v.meteoSensor===null?null:Temperature.config(v.meteoSensor);
  if(v.garageSensor!==undefined)out.garageSensor=v.garageSensor===null?null:Temperature.config(v.garageSensor);
  for(const role of ['livingSensor','masterSensor'])if(v[role]!==undefined)out[role]=v[role]===null?null:Temperature.config(v[role]);
  if(v.dehumidifier!==undefined)out.dehumidifier=v.dehumidifier===null?null:Dehumidifier.config(v.dehumidifier,used);
  if(v.fan!==undefined)out.fan=v.fan===null?null:Heater.config(v.fan,used);
  if(v.heater!==undefined)out.heater=v.heater===null?null:Heater.config(v.heater,used);
  if(v.tvMeter!==undefined)out.tvMeter=v.tvMeter===null?null:Heater.config(v.tvMeter,used);
  if(v.entranceContact===undefined)delete out.entranceContact;
  return out;
 }
 const SUPPLIED_BULBS={'3:living':'98cdac2d2eb6','4:studio':'98cdac1f18fa','3:master':'98cdac1df7e9'};
 function moveGuiBulbToStudio(previous={},fallbackId='98cdac1f18fa'){const next={...previous};if(previous['3:bedroom2'])next['4:studio']={...previous['3:bedroom2']};else if(!next['4:studio'])next['4:studio']={deviceId:fallbackId,channel:0,type:'light'};delete next['3:bedroom2'];return next}
 function associateBulbs(previous={}){const next=moveGuiBulbToStudio(previous);for(const [room,deviceId]of Object.entries(SUPPLIED_BULBS)){const old=next[room];next[room]={deviceId,channel:old?.deviceId?.toLowerCase()===deviceId?old.channel:0,type:'light'}}return next}
 function emptySetup(){return {server:'',lights:{},blinds:{},entranceContact:null}}
 return {DEMO_BLIND_LINKS,WINDOWS,key,roomKeys,demo,defaults,position,light,opacity,lighting,beam,beamOpacity,setup,emptySetup,SUPPLIED_BULBS,moveGuiBulbToStudio,associateBulbs,server,windowContactsConfig:Windows.config};
});
