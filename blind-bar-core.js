/* Visual closure reading only: 0% open is a full bar. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaBlindBarCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 function reading(info,demoPosition){const valid=p=>typeof p==='number'&&Number.isFinite(p)&&p>=0&&p<=100;const old=!!info.configured&&!valid(info.position)&&valid(info.lastPosition),position=info.configured?(valid(info.position)?info.position:old?info.lastPosition:null):valid(demoPosition)?demoPosition:null;return {position,closed:position===null?null:1-position/100,quality:position===null?'unknown':old?'last':'current'}}
 function geometry(w){const x=Math.min(w.x1,w.x2),y=Math.min(w.y1,w.y2),width=Math.abs(w.x2-w.x1),height=Math.abs(w.y2-w.y1),vertical=height>width,t=12;return vertical?{x:x+width/2-t/2,y,width:t,height,vertical}:{x,y:y+height/2-t/2,width,height:t,vertical}}
 return {reading,geometry};
});
