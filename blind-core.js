/* Cover status and explicit Cloud commands, compatible with the original app. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaBlindCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';const number=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
 function bindings(value={}){const out={};for(const [id,b]of Object.entries(value)){if(!b||typeof b.deviceId!=='string'||!/^[a-f0-9]{6,32}$/i.test(b.deviceId)||!Number.isInteger(b.channel)||b.channel<0||b.channel>15||b.type!=='cover')throw Error('Associação de estore inválida.');out[id]={deviceId:b.deviceId.toLowerCase(),channel:b.channel,type:'cover'}}return out}
 function status(device,b){
  const s=device?.status||{},gen2=s['cover:'+b.channel],gen1=s.rollers?.[b.channel],object=v=>v&&typeof v==='object'&&!Array.isArray(v),c=object(gen2)?gen2:object(gen1)?gen1:null;
  const raw=number(c?.current_pos),position=raw!==null&&raw>=0&&raw<=100?raw:null,errors=Array.isArray(c?.errors)?c.errors.filter(x=>typeof x==='string'):[];
  for(const key of ['overtemperature','safety_switch','obstruction'])if(c?.[key]===true)errors.push(key);
  if(c?.stop_reason&&c.stop_reason!=='normal')errors.push('stop_reason');
  const state=typeof c?.state==='string'?(object(gen2)?c.state:({open:'opening',close:'closing',stop:'stopped'}[c.state]||c.state)):null;
  return {online:device?.online===1||device?.online===true,missing:!device,hasCover:!!c,position,state,moving:state==='opening'||state==='closing'?true:['open','closed','stopped','idle'].includes(state)?false:null,calibrated:typeof c?.pos_control==='boolean'?c.pos_control:typeof c?.positioning==='boolean'?c.positioning:null,valid:c?.is_valid!==false&&!errors.length,errors};
 }
 function meterStatus(device,b){
  const s=device?.status||{},cover=s['cover:'+b.channel],gen2=cover&&typeof cover==='object',c=gen2?cover:s.meters?.[b.channel],roller=s.rollers?.[b.channel];
  const valid=!!c&&!device?.error&&s.is_valid!==false&&c.is_valid!==false&&!s.errors?.length&&!c.errors?.length&&!cover?.errors?.length&&!roller?.errors?.length&&!s.overpower&&!c.overpower&&!s.overtemperature&&!c.overtemperature;
  const value=v=>valid&&typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null,p=value(gen2?c?.apower:c?.power),total=value(gen2?c?.aenergy?.total:c?.total);
  return {powerWatts:p,energyKWh:total===null?null:total/(gen2?1000:60000)};
 }
 function fresh(r,now){return !!(r?.online&&r.hasCover&&!r.error&&Number.isFinite(r.fetchedAt)&&now>=r.fetchedAt&&now-r.fetchedAt<=45000)}
 function canControl(r,target,now=Date.now()){
  if(!fresh(r,now))return false;if(target==='stop')return true;
  if(!r.valid||r.errors?.length||r.state==='calibrating')return false;
  return typeof target!=='number'||r.calibrated!==false&&Number.isFinite(r.position);
 }
 function command(b,target){
  const binding=bindings({blind:b}).blind;
  if(!['open','close','stop'].includes(target)&&!(Number.isInteger(target)&&target>=0&&target<=100))throw Error('Comando de estore inválido.');
  return {id:binding.deviceId,channel:binding.channel,position:target};
 }
 function state(b,r,now=Date.now()){
  const recent=fresh(r,now),position=recent&&r.valid?r.position:null;
  const quality=!b?'Demonstração':!r?'Por consultar':r.missing?'ID não encontrado nesta conta':!r.online?'Offline':!r.hasCover?'Canal sem estore':r.error?'Consulta indisponível':!recent?'Leitura antiga':!r.valid?'Erro no estore':position===null?'Posição indisponível':'';
  return {configured:!!b,online:r?.online??null,fresh:recent,position,moving:recent&&r.moving===true,state:recent?r.state:null,canControl:canControl(r,'open',now),canPosition:canControl(r,50,now),canStop:canControl(r,'stop',now),quality,caption:position===null?'Estado por confirmar':position+'% aberto',calibrated:r?.calibrated??null,fetchedAt:r?.fetchedAt??null};
 }
 return {bindings,status,meterStatus,fresh,canControl,command,state};
});
