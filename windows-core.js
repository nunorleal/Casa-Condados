/* Window contacts are read-only and independent of shutter position. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./contact-core.js'));else root.CasaWindowsCore=factory(root.CasaContactCore)})(typeof window==='undefined'?globalThis:window,function(D){
 'use strict';
 const IDS=['master-north','bedroom2-north','bedroom3-north','suite-west','kitchen-west','living-south-left','living-south-right','studio-west','living2-west'];
 const SUPPLIED={'master-north':'XB154411473786357','bedroom2-north':'XB106582486823095','living-south-left':'XB66172384108257','kitchen-west':'XB106582486821873'};
 function object(v){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!IDS.includes(k)))throw Error('Janelas inválidas.');return v}
 function config(value={},contacts=[]){object(value);const used=new Set(contacts.filter(Boolean).map(b=>b.deviceId.toLowerCase()+':'+b.channel)),out={};for(const [id,b]of Object.entries(value)){if(!b||Object.keys(b).some(k=>!['deviceId','channel','source'].includes(k)))throw Error('Contacto de janela inválido.');const clean=D.config(b),key=clean.deviceId.toLowerCase()+':'+clean.channel;if(used.has(key))throw Error('O mesmo contacto não pode estar associado a duas portas/janelas.');used.add(key);out[id]=clean}return out}
 function associate(previous={}){const next={...previous};for(const [id,deviceId]of Object.entries(SUPPLIED))if(!Object.hasOwn(next,id))next[id]={deviceId,source:'blu',channel:0};return next}
 function demo(value={}){object(value);const out={};for(const [id,on]of Object.entries(value)){if(typeof on!=='boolean')throw Error('Estado de janela em demonstração inválido.');out[id]=on}return out}
 return {IDS,SUPPLIED,config,associate,demo};
});
