/* One visible-app scheduler: popup scope, user priority and bounded device confirmations. */
(function(){
 'use strict';let dirty=()=>false,nextAt=0,generation=0,focusKey='null',focusScope=null,confirmTimer=null,verifying=false;
 let storage=null;try{storage=localStorage}catch{}
 const client=window.CasaCloudReadCore.create({storage,onChange:()=>window.dispatchEvent(new Event('energychange'))});
 const current=()=>!dirty()&&!document.hidden;
 function available(){return current()&&client.snapshot().accountReady&&client.deviceIds().length>0}
 function popupScope(){const dialog=document.querySelector('dialog[open]');if(!dialog)return null;const kind={ 'balcony-appliance-dialog':'balcony-appliance','dishwasher-dialog':'dishwasher','dehumidifier-dialog':'dehumidifier','fan-dialog':'fan','heater-dialog':'heater','tv-dialog':'tv','energy-dialog':'energy','ev-dialog':'ev','entrance-dialog':'entrance','gate-dialog':'gate','alarm-dialog':'alarm','blind-dialog':'blind','room-dialog':'room'}[dialog.id];if(!kind)return null;return {kind,...(kind==='blind'?{id:dialog.dataset.blind}:kind==='balcony-appliance'?{id:dialog.dataset.device}:{}),...(kind==='room'?{floor:dialog.dataset.floor,room:dialog.dataset.room}:{})}}
 function ids(){return focusScope===null?null:client.scopeIds(focusScope)}
 function refresh(manual=false,options={}){
  focusChanged(false);if(!available())return Promise.resolve(client.snapshot());
  const version=generation,scopeKey=focusKey,selected=options.ids??ids();nextAt=Infinity;
  return client.refresh({manual,ids:selected,priority:selected!==null,force:manual||selected===null,isCurrent:()=>version===generation&&current()&&scopeKey===focusKey,...options}).finally(()=>{if(version===generation&&scopeKey===focusKey){const retry=client.connectionSnapshot().retryAt||0;nextAt=retry>Date.now()?retry:Date.now()+(focusScope===null?30000:15000)}});
 }
 function scheduleConfirmation(){clearTimeout(confirmTimer);confirmTimer=null;if(!available())return;const delay=client.confirmationDelay();if(delay!==null)confirmTimer=setTimeout(confirm,delay)}
 async function confirm(){if(verifying||!available())return;verifying=true;try{await client.verify({isCurrent:current})}finally{verifying=false;scheduleConfirmation()}}
 function automatic(){
  if(!available())return;const connection=client.connectionSnapshot();if(Date.now()<connection.retryAt)return;
  if(client.confirmationDelay()!==null){if(!confirmTimer)scheduleConfirmation();return}
  if(client.isBusy())return;
  const deferred=client.deferredIds().filter(id=>focusScope===null||client.scopeIds(focusScope).includes(id));
  if(deferred.length){refresh(false,{ids:deferred,force:true,priority:true});return}
  if(Date.now()>=nextAt)refresh();
 }
 function wake(){nextAt=0;scheduleConfirmation();if(available()&&!client.isBusy()&&client.confirmationDelay()===null)refresh(false,{force:false})}
 function configure(credentials,meter,isDirty,evMeter=null,door=null,temperature=null,garage=null,living=null,master=null,gate=null,blinds={},alarm={},windows={},lights={},tv=null,heater=null,dehumidifier=null,dishwasher=null,balcony={},media={},studio={},fan=null){dirty=isDirty;generation++;clearTimeout(confirmTimer);confirmTimer=null;client.configure(credentials,meter,evMeter,door,temperature,garage,living,master,gate,blinds,alarm,windows,lights,tv,heater,dehumidifier,dishwasher,balcony,media,studio,fan);wake()}
 function focusChanged(run=true){const scope=popupScope(),key=JSON.stringify(scope);if(key===focusKey)return;focusKey=key;focusScope=scope;if(client.confirmationDelay()===null)client.cancelReads();nextAt=Date.now()+(scope===null?2000:15000);if(run&&scope!==null)refresh()}
 setInterval(automatic,1000);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){client.cancelReads();clearTimeout(confirmTimer);confirmTimer=null}else wake()});
 for(const name of ['online','focus','pageshow','casahomevisible'])window.addEventListener(name,wake);
 document.addEventListener('toggle',()=>focusChanged(),true);document.addEventListener('close',()=>focusChanged(),true);
 new MutationObserver(()=>focusChanged()).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open','data-device','data-blind','data-room','data-floor']});
 async function commandBlind(id,target){try{return await client.commandBlind(id,target,{isCurrent:current})}finally{scheduleConfirmation()}}
 async function commandLight(id,on){try{return await client.commandLight(id,on,{isCurrent:current})}finally{scheduleConfirmation()}}
 async function commandBrightness(id,brightness){try{return await client.commandBrightness(id,brightness,{isCurrent:current})}finally{scheduleConfirmation()}}
 async function commandDehumidifier(on){try{return await client.commandDehumidifier(on,{isCurrent:current})}finally{scheduleConfirmation()}}
 async function commandAppliance(role,on){try{return await client.commandAppliance(role,on,{isCurrent:current})}finally{scheduleConfirmation()}}
 async function commandHeater(on){try{return await client.commandHeater(on,{isCurrent:current})}finally{scheduleConfirmation()}}
 async function commandAlarm(armed){try{return await client.commandAlarm(armed,{isCurrent:current})}finally{scheduleConfirmation()}}
 window.CasaCloudRead={mediaSnapshot:client.mediaSnapshot,appliancePowerSnapshot:client.appliancePowerSnapshot,commandAppliance,connectionState:client.connectionState,balconyApplianceSnapshot:client.balconyApplianceSnapshot,dishwasherSnapshot:client.dishwasherSnapshot,dehumidifierSnapshot:client.dehumidifierSnapshot,commandDehumidifier,setDehumidifierLocation:client.setDehumidifierLocation,heaterSnapshot:client.heaterSnapshot,commandHeater,setHeaterLocation:client.setHeaterLocation,tvSnapshot:client.tvSnapshot,lightSnapshot:client.lightSnapshot,lightEntries:client.lightEntries,commandLight,commandBrightness,ensureTemperatureFresh:()=>{focusChanged(false);const wanted=client.scopeIds({kind:'sensor',role:'meteo'}).filter(id=>focusScope===null||client.scopeIds(focusScope).includes(id));return client.refresh({ids:wanted,priority:true,force:false,isCurrent:current})},configure,refresh:()=>refresh(true),snapshot:client.snapshot,evSnapshot:client.evSnapshot,doorSnapshot:client.doorSnapshot,gateSnapshot:client.gateSnapshot,windowSnapshot:client.windowSnapshot,alarmSnapshot:client.alarmSnapshot,commandAlarm,blindSnapshot:client.blindSnapshot,blindEntries:client.blindEntries,commandBlind,temperatureSnapshot:client.temperatureSnapshot,healthSnapshot:client.healthSnapshot,activitySnapshot:()=>client.activitySnapshot(focusScope),connectionSnapshot:client.connectionSnapshot,isBusy:()=>client.isBusy()||client.confirmationDelay()!==null};
})();
