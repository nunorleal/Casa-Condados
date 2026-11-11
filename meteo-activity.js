/* Cached device readings only. Isolated per house; never calls Cloud or actuators. */
(function(){'use strict';const C=window.CasaMeteoActivityCore;let storage=null;try{storage=localStorage}catch{}const tracker=C.create({storage,key:'casa-leal-meteo-activity-duplex-v1'});
function configuration(){try{return window.CasaShellySetup?.snapshot()||{}}catch{return {}}}
function bindings(c){return {boiler:c.balconyMeters?.boiler,heater:c.heater,dehumidifier:c.dehumidifier,washer:c.balconyMeters?.washer,dishwasher:c.dishwasherMeter,tv:c.tvMeter,ev:c.evMeter,...Object.fromEntries(['playstation','soundbar','vodafone','unifi'].map(id=>[id,c.mediaBindings?.[id]])),...Object.fromEntries(['monitor','apollo','terramaster','blackdrive'].map(id=>[id,c.studioBindings?.[id==='blackdrive'?'backup':id]]))}}
function collect(){const c=configuration(),map=bindings(c);const api=window.CasaCloudRead,timer=id=>api?.[id+'Snapshot']?.()||{},washer=api?.balconyApplianceSnapshot('washer')||{},dishwasher=api?.dishwasherSnapshot()||{},tv=api?.tvSnapshot()||{},ev=api?.evSnapshot()||{},boiler=api?.balconyApplianceSnapshot('boiler')||{};
const identity=id=>map[id]?JSON.stringify([c.server,map[id].deviceId,map[id].channel]):'';
const sample=(id,d,active)=>({id,configured:!!map[id],identity:identity(id),active,stopped:d.on===false,fetchedAt:d.reading?.fetchedAt??d.fetchedAt??d.readings?.meter?.fetchedAt,powerWatts:d.powerWatts??(Number.isFinite(d.powerKW)?d.powerKW*1000:null)});
return [...['heater','dehumidifier'].map(id=>{const d=timer(id);return {id,configured:!!map[id],identity:identity(id),on:d.on,timerActive:d.timerActive,timerEstimated:d.timerEstimated,remaining:d.timerRemainingSeconds,fetchedAt:d.powerFetchedAt,powerWatts:d.powerWatts}}),sample('washer',washer,washer.activity),sample('dishwasher',dishwasher,dishwasher.activity),sample('tv',tv,tv.activity==='on'?true:tv.fresh?false:null),sample('ev',ev,ev.charging),sample('boiler',boiler,Number.isFinite(boiler.powerWatts)&&boiler.powerWatts>=0?boiler.powerWatts>30:null),...['playstation','soundbar','vodafone','unifi','monitor','apollo','terramaster','blackdrive'].map(id=>{const d=api?.mediaSnapshot?.(id==='blackdrive'?'backup':id)||{},watts=d.powerWatts;return sample(id,d,d.fresh&&Number.isFinite(watts)&&watts>=0?watts>0:null)})];}
let shared=null;
function localSnapshot(){return tracker.update(collect())}
function sharedSnapshot(){return shared&&C.readShared(shared.rows,shared.updatedAt,shared.expiresAt)}
function snapshot(){
 const remote=sharedSnapshot();
 return remote===null?localSnapshot().map(row=>({...row,source:'local'})):remote.map(row=>({...row,source:'emitter'}));
}
function setShared(row){
 shared=Array.isArray(row?.meteo_activity)&&Number.isFinite(Date.parse(row.meteo_activity_at))
  ?{rows:row.meteo_activity,updatedAt:Date.parse(row.meteo_activity_at),expiresAt:Date.parse(row.writer_expires_at)}
  :null;
}let scheduled=false;function changed(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;localSnapshot()})}
['energychange'].forEach(e=>window.addEventListener(e,changed));window.CasaMeteoActivity={snapshot,setShared,exportShared:()=>C.encodeShared(localSnapshot()),devices:()=>{const b=bindings(configuration()),remote=sharedSnapshot();return C.IDS.map(id=>({id,name:C.NAMES[id],configured:!!b[id]||remote?.some(row=>row.id===id)===true}))}};snapshot();})();
