/* Exact crop supplied by the user; no regenerated walls or environment variants. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaFloor4Stairs=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';const ENABLED=true,FILE='assets/sotao-escada-fornecida-v1.png';
 const PATCH={x:718,y:774,width:123,height:373},CROP={x:868,y:934,width:138,height:453};
 const SHADE={day:0,closed:.84,electric:.12,night:.72};
 const FILTERS={day:'brightness(1)',closed:'brightness(.16) saturate(.55)',electric:'brightness(.88) saturate(.9) sepia(.1)',night:'brightness(.28) saturate(.6)'};
 // Neutralise the wood's warm hue, then tint its preserved luminance as moonlight.
 const MOONLIGHT=[.17008,.57216,.05776,0,0,.2126,.7152,.0722,0,0,.26575,.894,.09025,0,0,0,0,0,1,0];
 function markup(kind){if(!ENABLED)return '';if(!Object.hasOwn(FILTERS,kind))throw Error('Ambiente inválido');return `<svg data-floor4-stair-patch="${kind}" x="${PATCH.x}" y="${PATCH.y}" width="${PATCH.width}" height="${PATCH.height}" viewBox="${CROP.x} ${CROP.y} ${CROP.width} ${CROP.height}" preserveAspectRatio="none" overflow="hidden">${kind==='night'?`<defs><filter id="floor4-stair-moonlight" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${MOONLIGHT.join(' ')}"/></filter></defs>`:''}<image href="${FILE}" width="1088" height="1445"${kind==='night'?' filter="url(#floor4-stair-moonlight)"':''}/><rect data-floor4-stair-shade="${kind}" x="${CROP.x}" y="${CROP.y}" width="${CROP.width}" height="${CROP.height}" fill="black" opacity="${SHADE[kind]}"/></svg>`}
 return {ENABLED,FILE,PATCH,CROP,FILTERS,SHADE,MOONLIGHT,markup};
});
