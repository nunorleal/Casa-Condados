/* Ambient sensor readings only, using the same formats as the original Casa NL. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaTemperatureCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 function config(v){
  if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!['deviceId','channel'].includes(k)))throw Error('Sensor MeteoNL inválido.');
  const id=v.deviceId,xb=typeof id==='string'&&/^XB\d{1,15}$/i.test(id)&&BigInt(id.slice(2))<=281474976710655n;
  if(typeof id!=='string'||!xb&&!/^[a-f0-9]{6,32}$/i.test(id)||!Number.isInteger(v.channel)||v.channel<0||v.channel>255)throw Error('ID ou componente do sensor MeteoNL inválido.');
  return {deviceId:xb?'XB'+id.slice(2):id.toLowerCase(),channel:v.channel};
 }
 function status(device,b){
  if(!device)return null;
  const s=device.status||{},object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:null,number=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
  // tmp on generic relays is internal heat, never ambient temperature.
  const t=object(s['temperature:'+b.channel])||(b.channel===0&&(object(s.hum)||device.code==='SHDW-2'||device.type==='SHDW-2')?object(s.tmp):null);
  const invalid=!!device.error||s.is_valid===false||typeof s.sensor_error==='number'&&s.sensor_error!==0||!!s.errors?.length||t?.is_valid===false||!!t?.errors?.length;
  let temperature=t&&!invalid?number(t.tC):null;
  if(t&&!invalid&&!Object.hasOwn(t,'tC')&&['C','F'].includes(t.units)){const n=number(t.value);temperature=n===null?null:t.units==='F'?(n-32)*5/9:n}
  if(temperature!==null&&(temperature< -100||temperature>150))temperature=null;
  const h=object(s['humidity:'+b.channel])||(b.channel===0?object(s.hum):null);
  const humidityInvalid=!!device.error||s.is_valid===false||typeof s.sensor_error==='number'&&s.sensor_error!==0||!!s.errors?.length||h?.is_valid===false||!!h?.errors?.length;
  let humidity=h&&!humidityInvalid?number(Object.hasOwn(h,'rh')?h.rh:h.value):null;
  if(humidity!==null&&(humidity<0||humidity>100))humidity=null;
  return {temperature,humidity,online:device.online===true||device.online===1,error:invalid,hasSensor:!!t||!!h};
 }
 return {config,status};
});
