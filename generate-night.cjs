/* Static night previews from the same original SVG geometry and pure home model. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),C=require('./home-core.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'plans.js'),'utf8'),context);const plans=context.window.CasaPlans;
for(const floor of ['3','4']){
 const plan=plans[floor];let defs='<mask id="night-mask" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1500" height="2000"><rect x="-100" y="-100" width="1500" height="2000" fill="white"/>';
 for(const room of plan.rooms){const level=Math.round(C.lighting(C.defaults(),floor,room,true).opacity/.86*255);defs+=`<path d="${plan.lightingAreas?.[room.id]||room.area}" fill="rgb(${level},${level},${level})" stroke="rgb(${level},${level},${level})" stroke-width="18" stroke-linejoin="round"/>`}
 defs+='</mask>';
 for(const room of plan.rooms)defs+=`<clipPath id="night-room-${room.id}"><path d="${plan.lightingAreas?.[room.id]||room.area}" stroke="black" stroke-width="18"/></clipPath>`;
 let beams='';
 for(const w of C.WINDOWS.filter(w=>w.floor===floor)){
  const b=C.beam(w);defs+=`<linearGradient id="night-moon-${w.id}" x1="${b.x1}" y1="${b.y1}" x2="${b.x2}" y2="${b.y2}"><stop stop-color="#b8dcff" stop-opacity=".72"/><stop offset="1" stop-color="#91b9ec" stop-opacity="0"/></linearGradient>`;
  beams+=`<path d="${b.d}" fill="url(#night-moon-${w.id})" opacity=".72" clip-path="url(#night-room-${w.room})"/>`;
 }
 let svg=plan.svg;const at=svg.search(/<path d="[^"]+" fill="none" stroke="#68685d"/),addons=['cabinetAddon','kitchenAddon','bathroomAddon','balconyUtilitiesAddon','architectureAddon'].map(k=>plan[k]||'').join('');
 // Addons are inserted below walls; the final wall redraw preserves their exact pixels.
 let facade='';
 if(floor==='4'){
  for(const w of C.WINDOWS.filter(w=>w.floor===floor))facade+=`<path d="M${w.x1} ${w.y1}L${w.x2} ${w.y2}" stroke="#c5e6e5" stroke-width="6"/>`;
  for(const [x,y]of [[251,286],[387,1074]])facade+=`<rect x="${x-54}" y="${y-70}" width="108" height="140" fill="#c6d9d5" stroke="#fffef6" stroke-width="7"/><rect x="${x-44}" y="${y-60}" width="88" height="120" fill="#d9e9e2" stroke="#92aaa4" stroke-width="2"/>`;
 }
 svg=svg.slice(0,at)+addons+facade+svg.slice(at);
 const shape=/<path d="([^"]+)" fill="url\(#(?:oak|concrete)\)"/.exec(plan.svg)[1];
 const walls=[...plan.svg.matchAll(/<path(?: class="white-walls")? d="[^"]+" fill="none" stroke="(?:#68685d|#fffef6)"[^>]*\/>/g)].map(m=>m[0]).join('');
 const overlay=`<g data-render="night"><defs>${defs}</defs><path d="${shape}" fill="#06121e" opacity=".86" mask="url(#night-mask)"/>${beams}</g>${walls}`;
 svg=svg.replace('</g></svg>',overlay+'</g></svg>');fs.writeFileSync(path.join(__dirname,'assets',`piso-${floor}-noite.svg`),svg.replaceAll('href="assets/','href="'));
}
