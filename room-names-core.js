/* Display names are independent of stable room IDs and all device bindings. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaRoomNamesCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 function name(value){if(typeof value!=='string'||/[\u0000-\u001f\u007f]/.test(value))throw Error('Nome inválido.');const clean=value.trim().replace(/\s+/g,' ');if(!clean||[...clean].length>60)throw Error('Use um nome de 1 a 60 caracteres.');return clean}
 function validate(value,plans){if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Nomes das divisões inválidos.');const allowed=new Set(Object.entries(plans).flatMap(([f,p])=>p.rooms.map(r=>f+':'+r.id))),out=Object.create(null);for(const [key,v]of Object.entries(value)){if(!allowed.has(key))throw Error('Divisão desconhecida.');out[key]=name(v)}return out}
 return {name,validate};
});
