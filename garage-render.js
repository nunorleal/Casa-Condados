/* User-supplied photographs, clipped in SVG without modifying their pixels. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaGarageRender=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';const NS='http://www.w3.org/2000/svg';
 const OUTLINE='M43 24H1052V914H245V250H64L43 230Z';
 function markup(){return `<g transform="translate(75 460) scale(${850/1009} ${750/890}) translate(-43 -24)"><defs><clipPath id="garage-render-outline" clipPathUnits="userSpaceOnUse"><path d="${OUTLINE}"/></clipPath></defs><g clip-path="url(#garage-render-outline)"><image data-garage-light="off" href="assets/garagem-luz-apagada-v1.jpg" width="1114" height="944"/><image data-garage-light="on" href="assets/garagem-luz-acesa-v1.jpg" width="1114" height="944" style="display:none"/></g></g><image data-garage-gate="open" href="assets/portao-garagem-aberto-v1.png" x="320" y="870" width="545" height="330" preserveAspectRatio="none" style="display:none"/>`}
 function mount(svg){
  const base=svg.querySelector(':scope > g');if(!base||svg.dataset.garageRender)return;
  // Retain the original geometry for containment, hit testing and lighting masks.
  for(const path of [...base.children].filter(n=>n.tagName.toLowerCase()==='path'))path.style.display='none';
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='garage-render';layer.setAttribute('pointer-events','none');layer.setAttribute('aria-hidden','true');layer.innerHTML=markup();base.append(layer);svg.dataset.garageRender='v1';
 }
 function setLight(svg,on){
  if(!svg.dataset.garageRender)return;
  for(const image of svg.querySelectorAll('[data-garage-light]'))image.style.display=(image.dataset.garageLight==='on')===(on===true)?'':'none';
  svg.dataset.garageLight=on===true?'on':'off';
 }
 function setGate(svg,open){
  const image=svg?.querySelector('[data-garage-gate]');if(image)image.style.display=open===true?'':'none';
 }
 return {mount,setLight,setGate,markup,OUTLINE};
});
