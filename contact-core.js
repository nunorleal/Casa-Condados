/* Contact readings only: no commands, no inference from lux, tilt, power or battery. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaContactCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';const binary=v=>v===true||v===1?true:v===false||v===0?false:null;
 function config(v){
  if(!v||!['blu','bthome'].includes(v.source)||!Number.isInteger(v.channel)||v.channel<0||v.channel>255)throw Error('Contacto da porta inválido.');
  const id=String(v.deviceId),xb=/^XB\d{1,15}$/i.test(id)&&BigInt(id.slice(2))<=281474976710655n;
  if(!xb&&!/^[a-f0-9]{6,32}$/i.test(id)||v.source==='bthome'&&xb)throw Error('ID do contacto inválido.');
  return {deviceId:xb?'XB'+id.slice(2):id.toLowerCase(),source:v.source,channel:v.channel};
 }
 function status(device,b){
  const s=device?.status||{},key=(b.source==='blu'?'window:':'bthomesensor:')+b.channel,hasComponent=Object.hasOwn(s,key),c=s[key];let open=null,hasSensor=hasComponent;
  if(c&&typeof c==='object'&&!Array.isArray(c)&&c.is_valid!==false&&!c.errors?.length){
   if(b.source==='blu'){const hasOpen=Object.hasOwn(c,'open'),hasValue=Object.hasOwn(c,'value'),a=binary(c.open),v=binary(c.value);open=hasOpen?(hasValue&&(a===null||v===null||a!==v)?null:a):v}
   else if(c.obj_id===45)open=binary(c.value);
  }else if(!hasComponent&&b.source==='blu'&&b.channel===0&&Object.hasOwn(s,'window')){hasSensor=true;open=binary(s.window)}
  if(device?.error||s.is_valid===false||s.errors?.length)open=null;
  return {missing:!device,online:device?.online===true||device?.online===1,hasSensor,open};
 }
 function state(r,now=Date.now()){return r?.online&&!r.error&&typeof r.open==='boolean'&&Number.isFinite(r.fetchedAt)&&now>=r.fetchedAt&&now-r.fetchedAt<=45000?r.open:null}
 return {config,status,state};
});
