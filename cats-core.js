/* Local walking routes, in each floor photograph’s native coordinates. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaCatsCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const CYCLE=30000;
 // Clear doorway floor between Hall and Entrance; bridge the lighting-mask seam only.
 const PASSAGES={'3':[{x:548,y:550,width:44,height:24}],'4':[]};
 // Centre lines through open interior passages. No balcony, stairs or basement.
 const graphs={
 '3':{nodes:{master:{x:265,y:320,room:'master'},masterDoor:{x:265,y:460,room:'master'},hallWest:{x:335,y:470,room:'hall'},guiDoor:{x:335,y:390,room:'bedroom2'},gui:{x:335,y:300,room:'bedroom2'},hall:{x:570,y:470,room:'hall'},libraryDoor:{x:570,y:380,room:'bedroom3'},library:{x:675,y:380,room:'bedroom3'},entranceDoor:{x:570,y:600,room:'entrance'},entrance:{x:470,y:630,room:'entrance'},kitchenDoor:{x:470,y:705,room:'kitchen'},kitchen:{x:420,y:750,room:'kitchen'},living:{x:420,y:860,room:'living'}},edges:[['master','masterDoor'],['masterDoor','hallWest'],['hallWest','guiDoor'],['guiDoor','gui'],['hallWest','hall'],['hall','libraryDoor'],['libraryDoor','library'],['hall','entranceDoor'],['entranceDoor','entrance'],['entrance','kitchenDoor'],['kitchenDoor','kitchen'],['kitchen','living']],anchors:{master:'master',bedroom2:'gui',hall:'hall',bedroom3:'library',entrance:'entrance',kitchen:'kitchen',living:'living'},neighbours:{master:['hall'],bedroom2:['hall'],bedroom3:['hall'],hall:['master','bedroom2','bedroom3','entrance'],entrance:['hall','kitchen'],kitchen:['entrance','living'],living:['kitchen']},starts:[['master','hall'],['living','kitchen']]},
 '4':{nodes:{studio:{x:280,y:170,room:'studio'},studioTop:{x:295,y:200,room:'studio'},studioClear:{x:295,y:470,room:'studio'},studioLower:{x:295,y:535,room:'studio'},studioDoor:{x:335,y:550,room:'studio'},livingDoor:{x:335,y:700,room:'living2'},living:{x:400,y:950,room:'living2'},livingClear:{x:650,y:1000,room:'living2'}},edges:[['studio','studioTop'],['studioTop','studioClear'],['studioClear','studioLower'],['studioLower','studioDoor'],['studioDoor','livingDoor'],['livingDoor','living'],['living','livingClear']],anchors:{studio:'studio',living2:'livingClear'},neighbours:{studio:['living2'],living2:['studio']},starts:[['studio','living2'],['living2','studio']]}
 };
 // Additional clear floor space: destinations and loops beyond the original corridor.
 Object.assign(graphs['3'].nodes,{guiNorth:{x:335,y:190,room:'bedroom2'},libraryNorth:{x:675,y:180,room:'bedroom3'},entranceEast:{x:700,y:620,room:'entrance'},kitchenWest:{x:100,y:740,room:'kitchen'},livingWest:{x:100,y:860,room:'living'},livingSide:{x:110,y:1020,room:'living'},livingFoot:{x:200,y:1100,room:'living'}});
 graphs['3'].edges.push(['gui','guiNorth'],['library','libraryNorth'],['entrance','entranceEast'],['kitchen','kitchenWest'],['kitchenWest','livingWest'],['livingWest','living'],['livingWest','livingSide'],['livingSide','livingFoot']);
 graphs['3'].roam=['master','gui','guiNorth','library','libraryNorth','hall','entrance','entranceEast','kitchen','kitchenWest','living','livingWest','livingSide','livingFoot'];
 Object.assign(graphs['4'].nodes,{livingWest:{x:150,y:750,room:'living2'},livingSouth:{x:150,y:1100,room:'living2'},livingMiddle:{x:450,y:850,room:'living2'}});
 graphs['4'].edges.push(['livingDoor','livingWest'],['livingWest','livingSouth'],['livingSouth','livingClear'],['living','livingMiddle'],['livingMiddle','livingClear']);
 graphs['4'].roam=['studio','studioClear','studioLower','livingDoor','living','livingClear','livingWest','livingSouth','livingMiddle'];
 function forFloor(floor){const graph=graphs[floor];if(!graph)return null;const {nodes,edges,anchors,neighbours,starts}=graph;
 function route(from,to){if(!nodes[from]||!nodes[to])throw Error('Unknown cat waypoint');const queue=[[from]],seen=new Set([from]);while(queue.length){const path=queue.shift(),last=path[path.length-1];if(last===to)return path;for(const [a,b]of edges){const next=a===last?b:b===last?a:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...path,next])}}}throw Error('Unreachable cat waypoint')}
 const distance=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
 function journey(from,to){const path=route(from,to).map(id=>({...nodes[id],id})),length=path.slice(1).reduce((n,b,i)=>n+distance(path[i],b),0);return {path,length,duration:Math.min(26000,Math.max(9000,length/35*1000))}}
 function sample(j,elapsed){const progress=Math.min(1,Math.max(0,elapsed/j.duration));let left=j.length*progress;for(let i=1;i<j.path.length;i++){const a=j.path[i-1],b=j.path[i],d=distance(a,b);if(left<=d||i===j.path.length-1){const t=d?Math.min(1,left/d):1;return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI+90,room:t<.5?a.room:b.room,walking:progress<1}}left-=d}return {...j.path[0],angle:0,walking:false}}
 function next(room,random=Math.random){const options=neighbours[room];return options[Math.min(options.length-1,Math.max(0,Math.floor(random()*options.length)))]}
 function wander(from,visits={},previous=null,random=Math.random){
  const options=graph.roam.filter(id=>id!==from&&id!==previous),least=Math.min(...options.map(id=>visits[id]||0));
  const fresh=options.filter(id=>(visits[id]||0)===least);
  return fresh[Math.min(fresh.length-1,Math.max(0,Math.floor(random()*fresh.length)))];
 }
 return {CYCLE,nodes,edges,anchors,neighbours,starts,route,journey,sample,next,wander,destinations:[...graph.roam]};
 }
 function distribute(random=Math.random){const floors={'3':[],'4':[]};for(const id of ['vasco','zeca'])floors[random()<.5?'3':'4'].push(id);return floors}
 function shade(opacity,electric=0){const dark=Math.max(0,Math.min(1,Number.isFinite(opacity)?opacity/.86:1)),lit=Math.max(0,Math.min(1,Number.isFinite(electric)?electric:0));return 1-.78*dark*(1-lit)}
 // Use exactly the renderer's room/window mix rather than a separate darkness estimate.
 function renderShade(levels,room,point,night){
  const zone=levels?.zones?.[room];if(!zone)return .16;
  let natural=zone.natural;
  if(levels.openPlan&&['kitchen','living','stairs3'].includes(room)){
   const t=Math.max(0,Math.min(1,((point?.y??660)-660)/472));
   natural=levels.openPlan.top*(1-t)+levels.openPlan.bottom*t;
  }
  const n=Math.max(0,Math.min(1,natural)),e=Math.max(0,Math.min(1,zone.electric));
  return (.16+(night?.12:.84)*n)*(1-e)+.95*e;
 }
 function palette(id,brightness){
  const colors=id==='zeca'?{fur:'#ea9a46',stripe:'#a95122',muzzle:'#ffe3b4',eye:'#e6d66f'}:{fur:'#b78346',stripe:'#35271e',muzzle:'#edd8ab',eye:'#b8f37a'};
  Object.assign(colors,{outline:'#35271e',nose:'#7c4940'});
  const factor=Math.max(.12,Math.min(1,Number.isFinite(brightness)?brightness:.16));
  return Object.fromEntries(Object.entries(colors).map(([key,hex])=>[key,'#'+hex.slice(1).match(/../g).map(c=>Math.round(parseInt(c,16)*factor).toString(16).padStart(2,'0')).join('')]));
 }
 return {CYCLE,graphs,forFloor,distribute,shade,renderShade,palette,PASSAGES};
});
