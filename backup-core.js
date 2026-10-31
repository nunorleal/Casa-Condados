/* Casa Leal backups: explicit allowlist, pure validation and rollback on failure. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./label-layout-core.js'),require('./meteo-core.js'),require('./home-core.js'));else root.CasaBackupCore=factory(root.CasaLabelLayoutCore,root.CasaMeteoCore,root.CasaHomeCore)})(typeof window==='undefined'?globalThis:window,function(Layout,Meteo,Home){
 'use strict';
 const FORMAT='casa-leal-backup-v1';
 const KEYS={fanLayout:'casa-leal-fan-layout-v1',studioBulbMoved:'casa-leal-gui-bulb-moved-to-studio-v1',balconyAppliancesAssociated:'casa-leal-balcony-appliances-associated-v1',dishwasherAssociated:'casa-leal-dishwasher-associated-v1',dehumidifierAssociated:'casa-leal-dehumidifier-associated-v1',dehumidifierLayout:'casa-leal-dehumidifier-layout-v1',showDehumidifier:'casa-leal-show-dehumidifier-v1',heaterAssociated:'casa-leal-heater-associated-v1',heaterLayout:'casa-leal-heater-layout-v1',showHeater:'casa-leal-show-heater-v1',roomNames:'casa-leal-room-names-v1',tvAssociated:'casa-leal-tv-associated-v1',tvLayout:'casa-leal-tv-layout-v1',showBlindBars:'casa-leal-show-blind-bars-v1',bannerScale:'casa-leal-banner-scale-v1',evLayout:'casa-leal-ev-layout-v1',environment:'casa-nova-environment-v1',showRoomLabels:'casa-nova-labels-v1',showSensorReadings:'casa-leal-show-sensor-readings-v1',showVelux:'casa-nova-show-velux-v1',showBathroomFixtures:'casa-leal-show-bathroom-fixtures-v1',showBlindBanners:'casa-leal-show-blind-banners-v1',showEnergyBanner:'casa-leal-show-energy-banner-v1',showEVBanner:'casa-leal-show-ev-banner-v1',meterAssociated:'casa-leal-em-associated-v1',evAssociated:'casa-leal-ev-associated-v1',windowContactsAssociated:'casa-leal-window-contacts-associated-v1',windowDemo:'casa-leal-window-demo-v1',bulbsAssociated:'casa-leal-bulbs-associated-v1',alarmAssociated:'casa-leal-alarm-associated-v1',firstBlindsAssociated:'casa-leal-first-blinds-associated-v1',gateAssociated:'casa-leal-gate-associated-v1',entranceAssociated:'casa-leal-entrance-associated-v1',meteoTemperatureAssociated:'casa-leal-meteo-temperature-associated-v1',garageTemperatureAssociated:'casa-leal-garage-temperature-associated-v1',roomTemperatureAssociated:'casa-leal-room-temperature-associated-v1',homeDemo:'casa-leal-home-demo-v1',shellySetup:'casa-leal-shelly-setup-v1',screensaver:'casa-nova-screensaver-v1',blindBannerScale:'casa-leal-blind-banner-scale-v1',sensorBannerScale:'casa-leal-sensor-banner-scale-v1',alarmLayout:'casa-leal-alarm-layout-v1',sensorLayout:'casa-leal-sensor-layout-v1',labelLayout:'casa-nova-room-label-layout-v1',meteo:'casa-nl-meteo-v1'};
 function object(v,allowed){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!allowed.includes(k)))throw Error('O ficheiro contém campos inválidos ou desconhecidos.');return v}
 function city(v){
  if(v===null)return null;
  object(v,['id','name','latitude','longitude','admin1','country','country_code','timezone']);
  if(typeof v.name!=='string'||!v.name.trim()||v.name.length>150||!Number.isFinite(v.latitude)||Math.abs(v.latitude)>90||!Number.isFinite(v.longitude)||Math.abs(v.longitude)>180)throw Error('Cidade inválida.');
  const out={name:v.name,latitude:v.latitude,longitude:v.longitude};
  if(v.id!==undefined){if(!Number.isSafeInteger(v.id)||v.id<0)throw Error('Cidade inválida.');out.id=v.id}
  for(const k of ['admin1','country','country_code','timezone'])if(v[k]!==undefined){if(typeof v[k]!=='string'||v[k].length>150)throw Error('Cidade inválida.');out[k]=v[k]}
  if(out.timezone){try{new Intl.DateTimeFormat('pt-PT',{timeZone:out.timezone})}catch{throw Error('Fuso horário da cidade inválido.')}}
  return out;
 }
 function data(v,plans){
  object(v,Object.keys(KEYS));if(!Object.keys(v).length)throw Error('A cópia não contém dados para importar.');const out={};
  for(const [k,value] of Object.entries(v)){
   if(k==='environment'){object(value,['city','mode']);if(!Object.hasOwn(value,'city')||!['auto','day','night'].includes(value.mode))throw Error('Ambiente inválido.');out[k]={city:city(value.city),mode:value.mode}}
   else if(k==='studioBulbMoved'||k==='balconyAppliancesAssociated'||k==='dishwasherAssociated'||k==='showDehumidifier'||k==='dehumidifierAssociated'||k==='showHeater'||k==='heaterAssociated'||k==='tvAssociated'||k==='showBlindBars'||k==='showRoomLabels'||k==='showSensorReadings'||k==='showVelux'||k==='showBathroomFixtures'||k==='showBlindBanners'||k==='showEnergyBanner'||k==='showEVBanner'||k==='meterAssociated'||k==='evAssociated'||k==='windowContactsAssociated'||k==='bulbsAssociated'||k==='alarmAssociated'||k==='firstBlindsAssociated'||k==='gateAssociated'||k==='entranceAssociated'||k==='meteoTemperatureAssociated'||k==='garageTemperatureAssociated'||k==='roomTemperatureAssociated'){if(typeof value!=='boolean')throw Error('Preferência inválida.');out[k]=value}
   else if(k==='windowDemo')out[k]=(typeof module==='object'&&module.exports?require('./windows-core.js'):globalThis.CasaWindowsCore).demo(value);
   else if(k==='dehumidifierLayout')out[k]=(typeof module==='object'&&module.exports?require('./dehumidifier-core.js'):globalThis.CasaDehumidifierCore).layout(value,plans);
   else if(k==='heaterLayout')out[k]=(typeof module==='object'&&module.exports?require('./heater-core.js'):globalThis.CasaHeaterCore).layout(value,plans);
   else if(k==='roomNames')out[k]=(typeof module==='object'&&module.exports?require('./room-names-core.js'):globalThis.CasaRoomNamesCore).validate(value,plans);
   else if(k==='homeDemo')out[k]=Home.demo(value,plans);
   else if(k==='shellySetup')out[k]=Home.setup(value,plans);
   else if(k==='screensaver')out[k]=Meteo.screensaver(value);
   else if(k==='bannerScale')out[k]=Layout.sensorScale(value);
   else if(k==='tvLayout')out[k]=Layout.tvPositions(value,plans);
   else if(k==='evLayout')out[k]=Layout.alarmPositions(value,plans);
   else if(k==='blindBannerScale')out[k]=Layout.blindScale(value);
   else if(k==='sensorBannerScale')out[k]=Layout.sensorScale(value);
   else if(k==='fanLayout'||k==='alarmLayout')out[k]=Layout.alarmPositions(value,plans);
   else if(k==='sensorLayout')out[k]=Layout.sensorPositions(value,plans);
   else if(k==='labelLayout')out[k]=Layout.positions(value,plans);
   else if(k==='meteo')out[k]=Meteo.preferences(value);
  }
  return out;
 }
 function validate(v,plans){
  object(v,['format','version','exportedAt','data']);
  if(v.format!==FORMAT)throw Error('Escolha uma cópia de segurança da Casa Leal.');
  if(typeof v.version!=='string'||!/^1\.\d{3}$/.test(v.version)||typeof v.exportedAt!=='string'||!Number.isFinite(Date.parse(v.exportedAt)))throw Error('Identificação da cópia inválida.');
  return {format:FORMAT,version:v.version,exportedAt:v.exportedAt,data:data(v.data,plans)};
 }
 function create(value,plans,now=new Date()){return validate({format:FORMAT,version:'1.140',exportedAt:now.toISOString(),data:value},plans)}
 function write(storage,backup,plans){
  const clean=validate(backup,plans);
  if(clean.data.shellySetup){
   try{const current=Home.setup(JSON.parse(storage.getItem(KEYS.shellySetup)),plans);if(current.server===clean.data.shellySetup.server)for(const key of ['fan','studioBindings','mediaBindings','balconyMeters','dishwasherMeter','dehumidifier','heater','tvMeter','homeEnergy','evMeter','entranceContact','gateContact','windowContacts','alarm','meteoSensor','garageSensor','livingSensor','masterSensor'])if(clean.data.shellySetup[key]===undefined&&current[key]!==undefined)clean.data.shellySetup[key]=current[key]}catch{}
  }
  if(clean.data.shellySetup)clean.data.shellySetup=Home.setup(clean.data.shellySetup,plans);
  if(clean.data.bannerScale===undefined&&(clean.data.sensorBannerScale!==undefined||clean.data.blindBannerScale!==undefined))clean.data.bannerScale=clean.data.sensorBannerScale??clean.data.blindBannerScale;
  const entries=Object.entries(clean.data).map(([k,v])=>[KEYS[k],JSON.stringify(v)]);
  const before=entries.map(([key])=>[key,storage.getItem(key)]),written=[];
  try{for(const [key,value]of entries){written.push(key);storage.setItem(key,value)}}
  catch{
   let restored=true;for(const [key,old]of before.filter(([key])=>written.includes(key)).reverse()){try{if(old===null)storage.removeItem(key);else storage.setItem(key,old)}catch{restored=false}}
   throw Error(restored?'Não foi possível guardar a importação. Os dados anteriores foram repostos.':'A importação falhou e não foi possível repor todos os dados anteriores. Guarde a cópia e tente novamente.');
  }
  return clean;
 }
 return {FORMAT,KEYS,create,validate,write};
});
