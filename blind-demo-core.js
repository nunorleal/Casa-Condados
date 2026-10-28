/* Visual followers only. No transport, credentials or commands. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./home-core.js'));else root.CasaBlindDemoCore=factory(root.CasaHomeCore)})(typeof window==='undefined'?globalThis:window,function(H){
 'use strict';const LINKS=H.DEMO_BLIND_LINKS;
 function create(){const overrides=new Map(),cache=new Map();
 function sourcePosition(v,id,read){const s=read(id)||{};if(s.configured)return s.fresh&&Number.isFinite(s.position)&&s.position>=0&&s.position<=100?s.position:null;return H.position(v,id)}
 function resolve(v,read){const out={lights:{...v.lights},blinds:{...v.blinds}};for(const [id,source]of Object.entries(LINKS)){if(read(id)?.configured){overrides.delete(id);cache.delete(id);continue}const p=sourcePosition(v,source,read),override=overrides.get(id);if(override&&p!==null){if(override.source===null)override.source=p;else if(p!==override.source)overrides.delete(id)}if(!overrides.has(id)){if(p!==null)cache.set(id,p);if(cache.has(id))out.blinds[id]=cache.get(id)}}return out}
 function manual(id,v,read){if(LINKS[id]&&!read(id)?.configured)overrides.set(id,{source:sourcePosition(v,LINKS[id],read)})}
 return {resolve,manual,isManual:id=>overrides.has(id),resume:id=>overrides.delete(id),reset:()=>{overrides.clear();cache.clear()}};
 }return {LINKS,create};
});
