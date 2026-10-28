/* Main Shelly EM meter: read-only; contracted kVA never becomes kW. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaEnergyCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';const DEFAULT={source:'car',channel:0,contractKVA:6.9};
 const number=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
 function config(v,deviceId){if(!v||typeof v!=='object'||Array.isArray(v)||!['car','custom'].includes(v.source)||!Number.isInteger(v.channel)||v.channel<0||v.channel>1||!Number.isFinite(v.contractKVA)||v.contractKVA<=0||v.contractKVA>100)throw Error('Configuração do contador geral inválida.');return {source:v.source,channel:v.channel,contractKVA:v.contractKVA,...(v.source==='custom'?{deviceId:deviceId(v.deviceId)}:{})}}
 function binding(c){const b=c.homeEnergy||DEFAULT,id=b.source==='custom'?b.deviceId:c.ev?.meter?.deviceId||c.ev?.relay?.deviceId;return id?{deviceId:id,channel:b.channel}:null}
 function status(device,b){const s=device?.status||{},c=s.emeters?.[b.channel],valid=!!c&&!device?.error&&s.is_valid!==false&&c.is_valid!==false&&!s.errors?.length&&!c.errors?.length;
  const p=valid?number(c.power):null,q=valid?number(c.reactive):null,voltage=valid?number(c.voltage):null,total=valid?number(c.total):null;
  return {missing:!device,online:device?.online===1||device?.online===true,hasMeter:!!c,valid,powerKW:p===null?null:p/1000,reactiveKVAR:q===null?null:q/1000,apparentKVA:p===null||q===null?null:Math.hypot(p,q)/1000,voltage:voltage!==null&&voltage>0?voltage:null,energyKWh:total!==null&&total>=0?total/1000:null};
 }
 // The Shelly EM has one supply relay, index 0, independent of its two clamps.
 function relayStatus(device,channel=0){
  const s=device?.status||{},candidates=[s.relays?.[channel],s['switch:'+channel]].filter(c=>c&&typeof c==='object');
  const values=candidates.map(c=>typeof c.ison==='boolean'?c.ison:typeof c.output==='boolean'?c.output:null);
  const valid=!!device&&!device.error&&s.is_valid!==false&&!s.errors?.length&&!s.overtemperature&&!s.overpower&&!s.overvoltage&&candidates.length>0&&candidates.every(c=>c.is_valid!==false&&!(typeof c.ison==='boolean'&&typeof c.output==='boolean'&&c.ison!==c.output)&&!c.errors?.length&&!c.overtemperature&&!c.overpower&&!c.overvoltage)&&values.every(v=>typeof v==='boolean')&&values.every(v=>v===values[0]);
  return {online:device?.online===true||device?.online===1,valid,on:valid?values[0]:null,hasOutput:candidates.length>0,missing:!device,errors:valid?[]:['invalid']};
 }
 function state(c,r,now=Date.now()){const b=binding(c),limit=(c.homeEnergy||DEFAULT).contractKVA,fresh=!!(r?.online&&!r.error&&r.valid&&Number.isFinite(r.fetchedAt)&&now>=r.fetchedAt&&now-r.fetchedAt<=45000),power=fresh?r.powerKW:null,apparent=fresh?r.apparentKVA:null,ratio=apparent===null?null:apparent/limit;
  const lastReading=b&&r?.valid&&r.hasMeter&&Number.isFinite(r.fetchedAt)&&[r.powerKW,r.apparentKVA,r.energyKWh].some(Number.isFinite)?{powerKW:number(r.powerKW),apparentKVA:number(r.apparentKVA),energyKWh:number(r.energyKWh),voltage:number(r.voltage),fetchedAt:r.fetchedAt}:null;
  return {configured:!!b,fresh,lastReading,powerKW:power,apparentKVA:apparent,contractKVA:limit,ratio,percent:ratio===null?null:ratio*100,remainingKVA:apparent===null?null:Math.max(0,limit-apparent),level:ratio===null?'unknown':ratio+1e-12>=1?'over':ratio+1e-12>=.95?'red':ratio+1e-12>=.8?'orange':ratio+1e-12>=.6?'yellow':'green',energyKWh:r?.energyKWh??null,energyStale:!!r&&!fresh,voltage:fresh?r.voltage:null,channel:b?.channel??(c.homeEnergy||DEFAULT).channel};
 }
 return {DEFAULT,config,binding,status,relayStatus,state};
});
