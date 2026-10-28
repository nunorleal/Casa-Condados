/* Solid wall faces derived from the union of the architectural wall footprint. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaWallRelief=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';const NS='http://www.w3.org/2000/svg',DX=4,HEIGHT=24;
 function geometry(d,width=20){
  const tokens=d.match(/[MLHV]|-?(?:\d*\.)?\d+/g)||[],rects=[];let i=0,x=0,y=0,command='M';
  while(i<tokens.length){if(/^[MLHV]$/.test(tokens[i]))command=tokens[i++];const px=x,py=y;
   if(command==='M'||command==='L'){x=Number(tokens[i++]);y=Number(tokens[i++]);if(command==='M'){command='L';continue}}
   else if(command==='H')x=Number(tokens[i++]);else if(command==='V')y=Number(tokens[i++]);
   if(!Number.isFinite(x)||!Number.isFinite(y)||x!==px&&y!==py)throw Error('Wall footprint must be orthogonal.');
   if(x!==px||y!==py)rects.push({x1:Math.min(x,px)-width/2,y1:Math.min(y,py)-width/2,x2:Math.max(x,px)+width/2,y2:Math.max(y,py)+width/2});
  }
  if(!rects.length)return {footprint:'',front:[],side:[]};
  const xs=[...new Set(rects.flatMap(r=>[r.x1,r.x2]))].sort((a,b)=>a-b),ys=[...new Set(rects.flatMap(r=>[r.y1,r.y2]))].sort((a,b)=>a-b),nx=xs.length-1,ny=ys.length-1,cells=new Uint8Array(nx*ny);
  for(let j=0;j<ny;j++)for(let k=0;k<nx;k++){const mx=(xs[k]+xs[k+1])/2,my=(ys[j]+ys[j+1])/2;cells[j*nx+k]=rects.some(r=>mx>r.x1&&mx<r.x2&&my>r.y1&&my<r.y2)?1:0}
  const front=[],side=[];
  // Merge exposed edges: adjoining walls do not create seams or internal jamb faces.
  for(let j=0;j<ny;j++){let start=null;for(let k=0;k<=nx;k++){const edge=k<nx&&cells[j*nx+k]&&(j===ny-1||!cells[(j+1)*nx+k]);if(edge&&start===null)start=k;if(!edge&&start!==null){front.push([xs[start],ys[j+1],xs[k],ys[j+1]]);start=null}}}
  for(let k=0;k<nx;k++){let start=null;for(let j=0;j<=ny;j++){const edge=j<ny&&cells[j*nx+k]&&(k===nx-1||!cells[j*nx+k+1]);if(edge&&start===null)start=j;if(!edge&&start!==null){side.push([xs[k+1],ys[start],xs[k+1],ys[j]]);start=null}}}
  return {front,side,footprint:rects.map(r=>`M${r.x1} ${r.y1}H${r.x2}V${r.y2}H${r.x1}Z`).join(' ')};
 }
 function markup(d){
  const g=geometry(d),face=([x1,y1,x2,y2])=>`M${x1} ${y1}L${x2} ${y2}L${x2+DX} ${y2+HEIGHT}L${x1+DX} ${y1+HEIGHT}Z`;
  return `<defs><linearGradient id="door-panel-oak" x1="0" y1="0" x2=".1" y2="1"><stop stop-color="#c7a271"/><stop offset=".45" stop-color="#b18b58"/><stop offset="1" stop-color="#866740"/></linearGradient><filter id="wall-foot-shadow" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1500" height="2000" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5"/><feOffset dx="3" dy="5"/></filter><filter id="wall-foot-contact" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1500" height="2000" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.2"/></filter><linearGradient id="wall-face-front" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d9d6cd"/><stop offset=".2" stop-color="#c9c6bd"/><stop offset="1" stop-color="#89887f"/></linearGradient><linearGradient id="wall-face-side" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bab8af"/><stop offset="1" stop-color="#777b75"/></linearGradient></defs><g pointer-events="none"><g transform="translate(${DX} ${HEIGHT})"><path d="${g.footprint}" fill="#1b201c" opacity=".25" filter="url(#wall-foot-shadow)"/><path d="${g.footprint}" fill="#28271f" opacity=".25" filter="url(#wall-foot-contact)"/></g><g fill="url(#wall-face-side)">${g.side.map(e=>`<path data-wall-face="side" d="${face(e)}"/>`).join('')}</g><g fill="url(#wall-face-front)">${g.front.map(e=>`<path data-wall-face="front" d="${face(e)}"/>`).join('')}</g></g>`;
 }
 function doorPanels(svg){
  for(const leaf of svg.querySelectorAll('[data-door] .door-leaf')){
   if(leaf.parentElement.querySelector('[data-door-panel]'))continue;
   const match=/^M0 0L(-?[\d.]+) (-?[\d.]+)$/.exec(leaf.getAttribute('d'));if(!match)continue;
   const x=Number(match[1]),y=Number(match[2]),panel=document.createElementNS(NS,'path');panel.dataset.doorPanel='oak';panel.setAttribute('d',`M0 0L${x} ${y}L${x+4} ${y+18}L4 18Z`);panel.setAttribute('fill','url(#door-panel-oak)');panel.setAttribute('stroke','#775e3b');panel.setAttribute('stroke-width','.8');leaf.before(panel);leaf.setAttribute('stroke','#d0b184');
  }
 }
 function mount(svg,floor){
  if(!['3','4'].includes(floor))return;const base=svg.querySelector(':scope > g');if(!base||base.querySelector('[data-addon="wall-relief"]'))return;
  const caps=[...base.children].filter(e=>e.matches('path.white-walls'));if(!caps.length)return;
  const layer=document.createElementNS(NS,'g');layer.dataset.addon='wall-relief';layer.setAttribute('aria-hidden','true');layer.setAttribute('pointer-events','none');layer.innerHTML=markup(caps.map(e=>e.getAttribute('d')).join(' '));
  doorPanels(svg);base.insertBefore(layer,[...base.children].find(e=>e.matches('path.white-walls,path[stroke="#68685d"]')));
 }
 return {mount,markup,geometry};
});
