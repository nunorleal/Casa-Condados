/* Pure viewport math: fit, focal zoom and bounded panning. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaPlanViewCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 function fit(bounds,width,height){
  const scale=Math.min(width/bounds.width,height/bounds.height),w=width/scale,h=height/scale;
  return {x:bounds.x+(bounds.width-w)/2,y:bounds.y+(bounds.height-h)/2,width:w,height:h};
 }
 function limit(base,view){return {x:clamp(view.x,base.x,base.x+base.width-view.width),y:clamp(view.y,base.y,base.y+base.height-view.height),width:view.width,height:view.height}}
 function zoom(base,view,amount,focal={x:.5,y:.5}){
  const factor=clamp(base.width/view.width*amount,1,4),width=base.width/factor,height=base.height/factor;
  return limit(base,{x:view.x+focal.x*view.width-focal.x*width,y:view.y+focal.y*view.height-focal.y*height,width,height});
 }
 function pan(base,view,dx,dy){return limit(base,{...view,x:view.x+dx,y:view.y+dy})}
 return {fit,limit,zoom,pan};
});
