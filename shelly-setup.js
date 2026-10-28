/* Account editor: saving may read EM meters; never sends equipment commands. */
(function(){
 'use strict';
 const C=window.CasaHomeCore,KEY='casa-leal-shelly-setup-v1',AUTH='casa-leal-cloud-auth-v1',$=id=>document.getElementById(id),plans=window.CasaPlans;
 let saved=C.emptySetup(),baseline=null,dirty=false,sessionKey='';
 try{baseline=localStorage.getItem(KEY);if(baseline!==null)saved=C.setup(JSON.parse(baseline),plans)}catch{}
 try{if(saved.studioBindings===undefined){const next=C.setup({...saved,studioBindings:{monitor:{deviceId:'441db8',channel:0},apollo:{deviceId:'e43ad8',channel:0},terramaster:{deviceId:'e9df12',channel:0},backup:{deviceId:'bb8ac4',channel:0}}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}}catch{}
 // Optional map doubles as a one-time migration marker: an explicit empty map stays empty.
 try{if(saved.mediaBindings===undefined){const next=C.setup({...saved,mediaBindings:{vodafone:{deviceId:'e465b8b9c64c',channel:0},soundbar:{deviceId:'4359bb',channel:0},playstation:{deviceId:'435aa1',channel:0},unifi:{deviceId:'e465b84553bc',channel:0}}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}}catch{}
 const balconyMarker='casa-leal-balcony-appliances-associated-v1';
 try{if(localStorage.getItem(balconyMarker)!=='true'){if(saved.balconyMeters===undefined){const next=C.setup({...saved,balconyMeters:{washer:{deviceId:'485519eb7022',channel:0},boiler:{deviceId:'bc1c2a',channel:0}}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}localStorage.setItem(balconyMarker,'true')}}catch{}
 const dishwasherMarker='casa-leal-dishwasher-associated-v1';
 try{if(localStorage.getItem(dishwasherMarker)!=='true'){if(saved.dishwasherMeter===undefined){const next=C.setup({...saved,dishwasherMeter:{deviceId:'e465b8b1526c',channel:0}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}localStorage.setItem(dishwasherMarker,'true')}}catch{}
 const dehumidifierMarker='casa-leal-dehumidifier-associated-v1';
 try{if(localStorage.getItem(dehumidifierMarker)!=='true'){if(saved.dehumidifier===undefined){const next=C.setup({...saved,dehumidifier:{deviceId:'88d798',channel:0}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}localStorage.setItem(dehumidifierMarker,'true')}}catch{}
 try{if(saved.fan===undefined){const next=C.setup({...saved,fan:{deviceId:'8819dc',channel:0}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}}catch{}
 const heaterMarker='casa-leal-heater-associated-v1';
 try{if(localStorage.getItem(heaterMarker)!=='true'){if(saved.heater===undefined){const next=C.setup({...saved,heater:{deviceId:'ea9d29',channel:0}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}localStorage.setItem(heaterMarker,'true')}}catch{}
 const tvMarker='casa-leal-tv-associated-v1';
 try{if(localStorage.getItem(tvMarker)!=='true'){if(saved.tvMeter===undefined){const next=C.setup({...saved,tvMeter:{deviceId:'437c82',channel:0}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}localStorage.setItem(tvMarker,'true')}}catch{}
 const meterMarker='casa-leal-em-associated-v1';
 try{if(localStorage.getItem(meterMarker)!=='true'){
  if(saved.homeEnergy===undefined){const next=C.setup({...saved,homeEnergy:{source:'custom',deviceId:'48e72967aadc',channel:0,contractKVA:6.9}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}
  localStorage.setItem(meterMarker,'true');
 }}catch{}
 const evMarker='casa-leal-ev-associated-v1';
 try{if(localStorage.getItem(evMarker)!=='true'){
  if(saved.evMeter===undefined){const next=C.setup({...saved,evMeter:{deviceId:'48e72967aadc',channel:1}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}
  localStorage.setItem(evMarker,'true');
 }}catch{}
 const entranceMarker='casa-leal-entrance-associated-v1';
 try{if(localStorage.getItem(entranceMarker)!=='true'){
  const old=saved.entranceContact,same=old?.deviceId?.toUpperCase()==='XB66172384118439'&&old.source==='blu';
  const next=C.setup({...saved,entranceContact:{deviceId:'XB66172384118439',source:'blu',channel:same?old.channel:0}},plans);
  localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY);localStorage.setItem(entranceMarker,'true');
 }}catch{}
 const alarmMarker='casa-leal-alarm-associated-v1';
 try{if(localStorage.getItem(alarmMarker)!=='true'){
  const alarm={...(saved.alarm||{})};for(const [role,deviceId]of [['arm','441793d689c0'],['trigger','e9df24']])if(!alarm[role])alarm[role]={deviceId,channel:0,activeWhenOn:true};
  const next=C.setup({...saved,alarm},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY);localStorage.setItem(alarmMarker,'true');
 }}catch{}
 const blindsMarker='casa-leal-first-blinds-associated-v1';
 try{if(localStorage.getItem(blindsMarker)!=='true'){
  const bindings={...saved.blinds};
  for(const [id,deviceId]of [['master-north','34945469ff57'],['bedroom2-north','485519027c43'],['kitchen-west','34945468f610'],['living-south-left','10521c0719c0']]){
   const old=bindings[id];bindings[id]={deviceId,channel:old?.deviceId?.toLowerCase()===deviceId?old.channel:0,type:'cover'};
  }
  const next=C.setup({...saved,blinds:bindings},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY);localStorage.setItem(blindsMarker,'true');
 }}catch{}
 const bulbsMarker='casa-leal-bulbs-associated-v1';
 try{if(localStorage.getItem(bulbsMarker)!=='true'){
  const next=C.setup({...saved,lights:C.associateBulbs(saved.lights)},plans);
  localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY);localStorage.setItem(bulbsMarker,'true');
 }}catch{}
 const studioBulbMarker='casa-leal-gui-bulb-moved-to-studio-v1';
 try{if(localStorage.getItem(studioBulbMarker)!=='true'){const next=C.setup({...saved,lights:C.moveGuiBulbToStudio(saved.lights)},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY);localStorage.setItem(studioBulbMarker,'true')}}catch{}
 const windowsMarker='casa-leal-window-contacts-associated-v1';
 try{if(localStorage.getItem(windowsMarker)!=='true'){
  const next=C.setup({...saved,windowContacts:window.CasaWindowsCore.associate(saved.windowContacts||{})},plans);
  localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY);localStorage.setItem(windowsMarker,'true');
 }}catch{}
 const gateMarker='casa-leal-gate-associated-v1';
 try{if(localStorage.getItem(gateMarker)!=='true'){
  if(!saved.gateContact){const next=C.setup({...saved,gateContact:{deviceId:'XB106582486435511',source:'blu',channel:0}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}
  localStorage.setItem(gateMarker,'true');
 }}catch{}
 const temperatureMarker='casa-leal-meteo-temperature-associated-v1';
 try{if(localStorage.getItem(temperatureMarker)!=='true'){
  if(saved.meteoSensor===undefined){const next=C.setup({...saved,meteoSensor:{deviceId:'XB211299192082120',channel:0}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}
  localStorage.setItem(temperatureMarker,'true');
 }}catch{}
 const garageTemperatureMarker='casa-leal-garage-temperature-associated-v1';
 try{if(localStorage.getItem(garageTemperatureMarker)!=='true'){
  if(saved.garageSensor===undefined){const next=C.setup({...saved,garageSensor:{deviceId:'XB211299197137945',channel:0}},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}
  localStorage.setItem(garageTemperatureMarker,'true');
 }}catch{}
 const roomTemperatureMarker='casa-leal-room-temperature-associated-v1';
 try{if(localStorage.getItem(roomTemperatureMarker)!=='true'){
  const additions={};for(const [role,deviceId] of [['livingSensor','799b1c'],['masterSensor','799c3b']])if(saved[role]===undefined)additions[role]={deviceId,channel:0};
  if(Object.keys(additions).length){const next=C.setup({...saved,...additions},plans);localStorage.setItem(KEY,JSON.stringify(next));saved=next;baseline=localStorage.getItem(KEY)}
  localStorage.setItem(roomTemperatureMarker,'true');
 }}catch{}
 $('ev-device').value=saved.evMeter?.deviceId||'';$('ev-channel').value=saved.evMeter?.channel??1;
 $('energy-device').value=saved.homeEnergy?.deviceId||'';$('energy-channel').value=saved.homeEnergy?.channel??0;$('energy-contract').value=saved.homeEnergy?.contractKVA??6.9;
 try{const auth=JSON.parse(localStorage.getItem(AUTH));if(auth&&auth.server===saved.server&&typeof auth.authKey==='string'&&auth.authKey.length<=4096){sessionKey=auth.authKey;$('cloud-remember').checked=true}}catch{}
 $('cloud-server').value=saved.server;$('cloud-key').value=sessionKey;
 const host=$('shelly-room-associations'),fields=[];
 const heaterGroup=document.createElement('details');heaterGroup.id='shelly-heater-group';heaterGroup.innerHTML='<summary>Termoventilador · equipamento móvel</summary><p>Controlo da alimentação e leitura de consumo. A localização na planta não altera esta associação.</p>';host.append(heaterGroup);
 const dehumidifierGroup=document.createElement('details');dehumidifierGroup.id='shelly-dehumidifier-group';dehumidifierGroup.innerHTML='<summary>Desumidificador · equipamento móvel</summary><p>Controlo da alimentação e leitura de consumo. A localização na planta não altera esta associação.</p>';host.append(dehumidifierGroup);
 function fieldset(parent,title,value,kind,key){
  const box=document.createElement('fieldset');box.className='setup-device';const legend=document.createElement('legend');legend.textContent=title;box.append(legend);
  const fieldsHost=document.createElement('div');fieldsHost.className='setup-fields';
  const idLabel=document.createElement('label');idLabel.textContent='ID do dispositivo';const input=document.createElement('input');input.type='text';input.autocomplete='off';input.spellcheck=false;input.maxLength=32;input.value=value?.deviceId||'';input.placeholder='Por associar';input.pattern=(kind==='contact'||kind==='window'||kind==='sensor')?'(?:[a-fA-F0-9]{6,32}|[xX][bB][0-9]+)':'[a-fA-F0-9]{6,32}';idLabel.append(input);
  const channelLabel=document.createElement('label');channelLabel.textContent=(kind==='contact'||kind==='window'||kind==='sensor')?'Componente':'Canal';const channel=document.createElement('input');channel.type='number';channel.min=0;channel.max=(kind==='contact'||kind==='window'||kind==='sensor')?255:15;channel.step=1;channel.value=value?.channel??0;channelLabel.append(channel);fieldsHost.append(idLabel,channelLabel);
  let type=null;
  if(kind==='light'||kind==='contact'||kind==='window'){
   const typeLabel=document.createElement('label');typeLabel.textContent=kind==='light'?'Tipo de saída':'Origem do contacto';type=document.createElement('select');
   for(const [v,t]of kind==='light'?[['switch','Switch / relé'],['light','Light']]:[['blu','BLU · Window'],['bthome','Gateway BTHome']]){const o=document.createElement('option');o.value=v;o.textContent=t;type.append(o)}
   type.value=kind==='light'?(value?.type||'switch'):(value?.source||'blu');typeLabel.append(type);typeLabel.style.gridColumn='1 / -1';fieldsHost.append(typeLabel);
  }
  box.append(fieldsHost);parent.append(box);fields.push({input,channel,type,kind,key});
 }
 const fanGroup=document.createElement('details');fanGroup.id='shelly-fan-group';fanGroup.innerHTML='<summary>Ventoinha · garagem</summary>';host.append(fanGroup);fieldset(fanGroup,'Shelly da ventoinha',saved.fan,'meter','fan');
 fieldset(heaterGroup,'Shelly do termoventilador',saved.heater,'meter','heater');
 fieldset(dehumidifierGroup,'Shelly do desumidificador',saved.dehumidifier,'meter','dehumidifier');
 for(const floor of ['3','4','-1']){
  const floorGroup=document.createElement('details'),summary=document.createElement('summary');summary.textContent=plans[floor].name;floorGroup.dataset.setupFloor=floor;floorGroup.append(summary);host.append(floorGroup);if(floor==='3')floorGroup.append($('shelly-energy-group'));
  for(const room of plans[floor].rooms){
   const details=document.createElement('details');details.className='setup-room';details.dataset.setupRoom=C.key(floor,room.id);const title=document.createElement('summary');title.textContent=window.CasaRoomNames.get(floor,room.id);details.append(title);floorGroup.append(details);if(floor==='-1'&&room.id==='garage')details.append($('shelly-ev-group'));
   if(floor==='3'&&room.id==='balcony-south')for(const [role,name]of [['washer','Máquina de lavar roupa'],['boiler','Caldeira Bosch']])fieldset(details,name+' · alimentação e consumo',saved.balconyMeters?.[role],'balcony-meter',role);
   if(floor==='3'&&room.id==='kitchen')fieldset(details,'Máquina de lavar loiça · alimentação e consumo',saved.dishwasherMeter,'meter','dishwasherMeter');
   if(floor==='4'&&room.id==='studio')for(const [role,name]of [['monitor','Monitor Dell'],['apollo','Placa de Som Apollo Twin'],['terramaster','Servidor Terramaster'],['backup','Disco Rígido Backup 2TB']])fieldset(details,name+' · alimentação e consumo',saved.studioBindings?.[role],'studio',role);
   if(floor==='3'&&room.id==='living')for(const [role,name]of [['vodafone','Router Vodafone'],['soundbar','Soundbar Polk'],['playstation','PlayStation 5'],['unifi','UniFi Dream Router']])fieldset(details,name+' · alimentação e consumo',saved.mediaBindings?.[role],'media',role);
   if(floor==='3'&&room.id==='living')fieldset(details,'TV da sala · alimentação e consumo',saved.tvMeter,'meter','tvMeter');
   fieldset(details,'Iluminação',saved.lights[C.key(floor,room.id)],'light',C.key(floor,room.id));
   for(const w of C.WINDOWS.filter(w=>w.floor===floor&&w.room===room.id)){fieldset(details,'Estore · '+w.name,saved.blinds[w.id],'blind',w.id);fieldset(details,'Janela · '+w.name+' · só leitura',saved.windowContacts?.[w.id],'window',w.id);}
   if(floor==='3'&&['living','master'].includes(room.id))fieldset(details,'Temperatura e humidade',saved[room.id+'Sensor'],'sensor',room.id+'Sensor');
   if(floor==='-1'&&room.id==='garage')fieldset(details,'Temperatura e humidade',saved.garageSensor,'sensor','garageSensor');
   if(floor==='-1'&&room.id==='garage')fieldset(details,'Contacto BLU do portão',saved.gateContact,'contact','gateContact');
   if(floor==='3'&&room.id==='entrance')fieldset(details,'Contacto da porta de entrada',saved.entranceContact,'contact','entranceContact');
  }
 }
 const alarmGroup=document.createElement('details');alarmGroup.id='shelly-alarm-group';const alarmTitle=document.createElement('summary');alarmTitle.textContent='Alarme da garagem';alarmGroup.append(alarmTitle);const alarmNote=document.createElement('p');alarmNote.textContent='Armação: controlo ON/OFF. Disparo: apenas leitura. Guardar e consultar não alteram o alarme.';alarmGroup.append(alarmNote);host.querySelector('[data-setup-room="-1:garage"]').append(alarmGroup);
 const alarmFields=[];
 for(const role of ['arm','trigger']){
  const box=document.createElement('fieldset'),title=document.createElement('legend');title.textContent=role==='arm'?'Shelly que arma/desarma':'Shelly que indica disparo · só leitura';box.append(title);
  const idLabel=document.createElement('label');idLabel.textContent='ID do Shelly';const input=document.createElement('input');input.type='text';input.autocomplete='off';input.spellcheck=false;input.pattern='[a-fA-F0-9]{6,32}';input.maxLength=32;input.placeholder='Por associar';input.value=saved.alarm?.[role]?.deviceId||'';idLabel.append(input);
  const channelLabel=document.createElement('label');channelLabel.textContent='Canal';const channel=document.createElement('input');channel.type='number';channel.min=0;channel.max=15;channel.step=1;channel.value=saved.alarm?.[role]?.channel??0;channelLabel.append(channel);
  const polarityLabel=document.createElement('label');polarityLabel.textContent='Correspondência do estado';const polarity=document.createElement('select');for(const [v,t]of [['on','ON'],['off','OFF']]){const o=document.createElement('option');o.value=v;o.textContent=t+' = '+(role==='arm'?'armado':'a tocar');polarity.append(o)}polarity.value=saved.alarm?.[role]?.activeWhenOn===false?'off':'on';polarityLabel.append(polarity);box.append(idLabel,channelLabel,polarityLabel);alarmGroup.append(box);alarmFields.push({role,input,channel,polarity});
 }
 const sensorGroup=document.createElement('details'),sensorTitle=document.createElement('summary');sensorTitle.textContent='MeteoNL · Temperatura real';sensorGroup.append(sensorTitle);host.append(sensorGroup);fieldset(sensorGroup,'Sensor ambiente',saved.meteoSensor,'sensor','meteoSensor');
 function blocked(){try{return dirty||localStorage.getItem(KEY)!==baseline}catch{return true}}
 function status(message,error=false){$('shelly-setup-status').textContent=message;$('shelly-setup-status').classList.toggle('error',error)}
 function mark(){dirty=true;status('Alterações por guardar. Os estores reais ficam bloqueados até guardar.')}
 $('shelly-setup-form').addEventListener('input',mark);$('shelly-setup-form').addEventListener('change',mark);
 function reveal(input){for(let p=input.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;input.focus()}
 $('shelly-setup-form').addEventListener('invalid',e=>reveal(e.target),true);
 $('shelly-setup-form').addEventListener('submit',e=>{
  e.preventDefault();const out={fan:null,studioBindings:{},mediaBindings:{},balconyMeters:{},server:$('cloud-server').value.trim(),lights:{},blinds:{},windowContacts:{},entranceContact:null,gateContact:null,meteoSensor:null,garageSensor:null,livingSensor:null,masterSensor:null,dehumidifier:null,heater:null,tvMeter:null,dishwasherMeter:null};
  try{
   for(const f of fields){f.input.setCustomValidity('');if(!f.input.value.trim())continue;
    const channel=Number(f.channel.value),b={deviceId:f.input.value.trim(),channel};
    if(!f.channel.value.trim()||!Number.isInteger(channel)){reveal(f.channel);throw Error('Indique um canal inteiro.')}
    if(f.kind==='studio'){out.studioBindings[f.key]=b}else if(f.kind==='media'){out.mediaBindings[f.key]=b}else if(f.kind==='balcony-meter'){out.balconyMeters[f.key]=b}else if(f.kind==='meter'){out[f.key]=b}else if(f.kind==='window'){b.source=f.type.value;out.windowContacts[f.key]=b}else if(f.kind==='sensor'){out[f.key]=b}else if(f.kind==='contact'){b.source=f.type.value;out[f.key]=b}else{b.type=f.kind==='blind'?'cover':f.type.value;out[f.kind==='blind'?'blinds':'lights'][f.key]=b}
   }
   const alarm={};for(const f of alarmFields){const id=f.input.value.trim();if(id){if(!f.channel.value.trim()||!Number.isInteger(Number(f.channel.value)))throw Error('Indique um canal inteiro para o alarme.');alarm[f.role]={deviceId:id,channel:Number(f.channel.value),activeWhenOn:f.polarity.value==='on'}}}if(saved.alarm!==undefined||Object.keys(alarm).length)out.alarm=alarm;
   const meterId=$('energy-device').value.trim();out.homeEnergy=meterId?{source:'custom',deviceId:meterId,channel:Number($('energy-channel').value),contractKVA:Number($('energy-contract').value)}:null;
   const evId=$('ev-device').value.trim();out.evMeter=evId?{deviceId:evId,channel:Number($('ev-channel').value)}:null;
   const clean=C.setup(out,plans),auth=$('cloud-key').value,remember=$('cloud-remember').checked;
   if(auth.length>4096||/[\r\n]/.test(auth))throw Error('Chave de autorização inválida.');if(auth&&!clean.server)throw Error('Indique o servidor da conta antes de guardar a chave.');
   if(localStorage.getItem(KEY)!==baseline)throw Error('A configuração foi alterada noutra janela. Recarregue antes de guardar.');
   const oldConfig=localStorage.getItem(KEY),oldAuth=localStorage.getItem(AUTH);
   try{if(remember&&auth)localStorage.setItem(AUTH,JSON.stringify({server:clean.server,authKey:auth}));else localStorage.removeItem(AUTH);localStorage.setItem(KEY,JSON.stringify(clean))}
   catch(error){if(oldAuth===null)localStorage.removeItem(AUTH);else localStorage.setItem(AUTH,oldAuth);if(oldConfig===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,oldConfig);throw error}
   baseline=localStorage.getItem(KEY);saved=clean;sessionKey=auth;dirty=false;status('Configuração guardada. Leituras Cloud atualizadas automaticamente; estores e luzes associados têm controlo real; restantes equipamentos em demonstração.');window.CasaCloudRead?.configure({server:saved.server,authKey:sessionKey},saved.homeEnergy,blocked,saved.evMeter,saved.entranceContact,saved.meteoSensor,saved.garageSensor,saved.livingSensor,saved.masterSensor,saved.gateContact,saved.blinds,saved.alarm||{},saved.windowContacts||{},saved.lights||{},saved.tvMeter||null,saved.heater||null,saved.dehumidifier||null,saved.dishwasherMeter||null,saved.balconyMeters||{},saved.mediaBindings||{},saved.studioBindings||{},saved.fan||null);
  }catch(error){status(error.message,true)}
 });
 function open(floor,room){
  for(const d of document.querySelectorAll('dialog[open]'))if(d!==$('settings-dialog'))d.close();if(!$('settings-dialog').open)$('settings-dialog').showModal();$('shelly-setup').open=true;
  if(floor&&room){const target=[...host.querySelectorAll('[data-setup-room]')].find(d=>d.dataset.setupRoom===C.key(floor,room));if(target){for(let p=target;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;target.scrollIntoView({block:'start',behavior:'auto'})}}
  else $('shelly-setup').scrollIntoView({block:'start',behavior:'auto'});
 }
 function revealId(input){if(!input)return false;for(let p=input;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;input.focus({preventScroll:true});input.closest('fieldset,label')?.scrollIntoView({block:'center',behavior:'auto'});return true}
 function openDevice(kind,key){const input=kind==='alarm'?alarmFields.find(f=>f.role===key)?.input:fields.find(f=>f.kind===kind&&f.key===key)?.input;if(!input)return false;open();return revealId(input)}
 function openEquipment(id){open();const target=$(id);if(!target)return false;return revealId(target.matches('input')?target:target.querySelector('input'))}
 $('open-shelly').addEventListener('click',()=>open());
 window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue!==baseline)status('A configuração mudou noutra janela. Recarregue antes de guardar.',true)});
 window.addEventListener('roomnameschange',()=>{for(const d of host.querySelectorAll('[data-setup-room]')){const [floor,room]=d.dataset.setupRoom.split(':');d.querySelector('summary').textContent=window.CasaRoomNames.get(floor,room)}});
 window.CasaShellySetup={open,openEquipment,openDevice,isDirty:blocked,snapshot:()=>C.setup(saved,plans)};
 window.CasaCloudRead?.configure({server:saved.server,authKey:sessionKey},saved.homeEnergy,blocked,saved.evMeter,saved.entranceContact,saved.meteoSensor,saved.garageSensor,saved.livingSensor,saved.masterSensor,saved.gateContact,saved.blinds,saved.alarm||{},saved.windowContacts||{},saved.lights||{},saved.tvMeter||null,saved.heater||null,saved.dehumidifier||null,saved.dishwasherMeter||null,saved.balconyMeters||{},saved.mediaBindings||{},saved.studioBindings||{},saved.fan||null);
})();
