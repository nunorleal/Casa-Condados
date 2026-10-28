/* Demo lighting and unbound blinds; associated blinds use the shared Cloud queue. */
(function(){
 'use strict';
 const C=window.CasaHomeCore,NS='http://www.w3.org/2000/svg',KEY='casa-leal-home-demo-v1',BANNERS='casa-leal-show-blind-banners-v1',$=id=>document.getElementById(id);
 const followers=window.CasaBlindDemoCore.create();
 let state=C.defaults(),showBanners=true,current=null,activeBlind=null,activeRoom=null;
 try{state=C.demo(JSON.parse(localStorage.getItem(KEY)),window.CasaPlans)}catch{}
 try{const v=JSON.parse(localStorage.getItem(BANNERS));if(typeof v==='boolean')showBanners=v}catch{}
 const overlay=document.createElement('div');overlay.id='blind-banners';$('plan-stage').append(overlay);
 const check=$('show-blind-banners');check.checked=showBanners;
 check.addEventListener('change',()=>{showBanners=check.checked;try{localStorage.setItem(BANNERS,JSON.stringify(showBanners))}catch{}position()});
 const BARS='casa-leal-show-blind-bars-v1',barsCheck=$('show-blind-bars');let showBars=true;
 try{const v=JSON.parse(localStorage.getItem(BARS));if(typeof v==='boolean')showBars=v}catch{}
 barsCheck.checked=showBars;barsCheck.addEventListener('change',()=>{showBars=barsCheck.checked;try{localStorage.setItem(BARS,JSON.stringify(showBars))}catch{}update()});
 let bannerScale=window.CasaBannerSize.value();
 window.addEventListener('bannersizechange',()=>{bannerScale=window.CasaBannerSize.value();position()});
 function el(tag,attrs={}){const e=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e}
 function remember(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}update()}
 function blindInfo(id){const s=window.CasaCloudRead?.blindSnapshot?.(id)||{configured:false};return s.configured&&window.CasaShellySetup?.isDirty()?{...s,canControl:false,canPosition:false,canStop:false,quality:'Guarde a configuração antes de comandar'}:s}
 function lightInfo(floor,room){const s=window.CasaCloudRead?.lightSnapshot?.(C.key(floor,room))||{configured:false};return s.configured&&window.CasaShellySetup?.isDirty()?{...s,canControl:false,quality:'Guarde a configuração antes de comandar'}:s}
 function visualState(){const v={lights:{...state.lights},blinds:{...state.blinds}};for(const id of window.CasaCloudRead?.blindEntries?.()||[]){const s=blindInfo(id);v.blinds[id]=s.position??s.lastPosition??0}for(const id of window.CasaCloudRead?.lightEntries?.()||[]){const s=window.CasaCloudRead.lightSnapshot(id);v.lights[id]=s.on??s.lastOn??false}return followers.resolve(v,blindInfo)}
 function demoPosition(id){return C.position(visualState(),id)}
 function followerText(id){const source=C.DEMO_BLIND_LINKS[id];return source?(followers.isManual(id)?'Manual · retoma no próximo movimento da origem':'A seguir '+C.WINDOWS.find(w=>w.id===source).name):''}
 function blindText(id){const s=blindInfo(id);return s.configured?[(s.position===null?(s.lastPosition===null?'—':s.lastPosition+'% · Última leitura'):s.position+'% aberto'),s.moving?(s.state==='opening'?'A abrir':'A fechar'):'',s.quality,s.pending?'A confirmar movimento':''].filter(Boolean).join(' · '):demoPosition(id)+'% aberto · demonstração'+(followerText(id)?' · '+followerText(id):'')}
 async function changeBlind(id,target){const s=blindInfo(id);if(s.configured){await window.CasaCloudRead.commandBlind(id,target);update();syncBlind();syncRoom();return}if(target==='stop')return;followers.manual(id,visualState(),blindInfo);state.blinds[id]=target==='open'?100:target==='close'?0:target;remember();syncBlind();syncRoom()}
 function roomWindows(f,id){return C.WINDOWS.filter(w=>w.floor===f&&w.room===id)}
 function label(w){return w.name+' · '+blindText(w.id)}
 function openBlind(id){
  const w=C.WINDOWS.find(x=>x.id===id);if(!w)return;activeBlind=w;$('blind-dialog').dataset.blind=id;
  $('blind-title').textContent='Estore · '+w.name;syncBlind();$('blind-dialog').showModal();
 }
 function syncBlind(){
  if(!activeBlind)return;const id=activeBlind.id,s=blindInfo(id),p=s.configured?s.position:demoPosition(id),display=p??s.lastPosition??null,last=p===null&&display!==null;
  if(document.activeElement!==$('blind-position'))$('blind-position').value=p??0;
  $('blind-percent').textContent=display===null?'—':display+'%';$('blind-position').disabled=s.configured&&!s.canPosition;$('blind-position').setAttribute('aria-valuetext',blindText(id));
  $('blind-preview').style.setProperty('--blind-closed',display===null?'100%':(100-display)+'%');$('blind-preview').classList.toggle('is-unknown',display===null);$('blind-preview').classList.toggle('is-last',last);
  $('blind-mode').firstChild.textContent='CONTROLOS DO ESTORE';
  $('blind-status').textContent=!s.configured?'Parado · Demonstração':s.pending?'A confirmar pelo Shelly…':s.moving?(s.state==='opening'?'A abrir':'A fechar')+' · Cloud':s.fresh&&s.state&&['open','closed','stopped','idle'].includes(s.state)?'Parado · Cloud':s.quality||'Estado por confirmar';
  $('blind-quality').textContent=last?'Posição: última leitura':s.configured?(s.fresh&&s.position!==null?'Posição confirmada':''):'Demonstração';
  $('blind-note').textContent=s.configured?'':'Demonstração · não são enviados comandos.'+(followerText(id)?' '+followerText(id):'');$('blind-follow-resume').hidden=s.configured||!C.DEMO_BLIND_LINKS[id]||!followers.isManual(id);
  $('blind-feedback').textContent=s.configured?(s.pending?'Comando enviado · a aguardar confirmação.':s.message||(s.fresh?'Dados atualizados com os estados reportados pelo Shelly.':'')):'';
  const fmt=(v,u)=>Number.isFinite(v)?v.toLocaleString('pt-PT',{maximumFractionDigits:u===' W'?1:3})+u:'—'+u,oldPower=s.powerWatts==null&&!!s.lastPower,oldEnergy=s.energyKWh==null&&!!s.lastEnergy;
  $('blind-watts').textContent=fmt(s.powerWatts??s.lastPower?.value,' W');$('blind-kwh').textContent=fmt(s.energyKWh??s.lastEnergy?.value,' kWh');$('blind-watts-quality').textContent=oldPower?'Última leitura':'';$('blind-kwh-quality').textContent=oldEnergy?'Última leitura':'';
  $('blind-meter-quality').textContent=oldPower||oldEnergy?'Última leitura':Number.isFinite(s.powerWatts)&&Number.isFinite(s.energyKWh)?'Leitura atual':Number.isFinite(s.powerWatts)||Number.isFinite(s.energyKWh)?'Leitura parcial':'Sem medição';
  for(const action of ['open','close'])$('blind-'+action).disabled=s.configured&&!s.canControl;
  $('blind-stop').hidden=false;$('blind-stop').disabled=!s.configured||!s.canStop;$('blind-refresh').hidden=false;$('blind-refresh').disabled=!s.configured||!s.accountReady||window.CasaShellySetup?.isDirty();
  $('blind-dialog').setAttribute('aria-busy',String(!!s.pending));
 }
 setInterval(()=>{if(activeBlind&&$('blind-dialog').open&&!document.hidden)syncBlind()},1000);
 async function setBlind(target){if(!activeBlind)return;try{await changeBlind(activeBlind.id,target)}catch(e){$('blind-feedback').textContent=e.message;syncRoom()}}
 $('blind-position').addEventListener('input',e=>{if(!activeBlind)return;const value=Number(e.target.value);if(blindInfo(activeBlind.id).configured)$('blind-feedback').textContent='Destino escolhido: '+value+'% · solte para enviar';else setBlind(value)});
 $('blind-position').addEventListener('change',e=>{if(activeBlind&&blindInfo(activeBlind.id).configured)setBlind(Number(e.target.value))});
 $('blind-open').addEventListener('click',()=>setBlind('open'));$('blind-close').addEventListener('click',()=>setBlind('close'));$('blind-stop').addEventListener('click',()=>setBlind('stop'));$('blind-refresh').addEventListener('click',()=>window.CasaCloudRead.refresh());
 $('blind-follow-resume').addEventListener('click',()=>{if(!activeBlind||blindInfo(activeBlind.id).configured)return;followers.resume(activeBlind.id);update();syncBlind();syncRoom()});
 $('blind-configure').addEventListener('click',()=>{$('blind-dialog').close();window.CasaShellySetup?.openDevice('blind',activeBlind.id)});
 function mount(svg,floor){
  current={svg,floor,shades:new Map(),warms:new Map(),beams:new Map(),hits:new Map(),banners:new Map()};overlay.replaceChildren();
  const p=window.CasaPlans[floor],base=svg.querySelector(':scope > g'),shape=base.querySelector(':scope > path'),defs=el('defs'),layer=el('g',{'data-addon':'room-lighting','pointer-events':'none'});
  const soft=el('filter',{id:'home-soft-mask',x:'-20%',y:'-20%',width:'140%',height:'140%'});soft.append(el('feGaussianBlur',{stdDeviation:7}));defs.append(soft);
  const mask=el('mask',{id:'home-dark-mask',maskUnits:'userSpaceOnUse',x:-100,y:-100,width:1500,height:2000}),maskContent=el('g',{filter:'url(#home-soft-mask)'});mask.append(maskContent);
  maskContent.append(el('rect',{x:-100,y:-100,width:1500,height:2000,fill:'white','data-mask-base':''}));
  for(const room of p.rooms){
   const d=p.lightingAreas?.[room.id]||room.area,clip=el('clipPath',{id:'room-clip-'+room.id});clip.append(el('path',{d,stroke:'black','stroke-width':18,'stroke-linejoin':'round'}));defs.append(clip);
   const shade=el('path',{d,stroke:'black','stroke-width':18,'stroke-linejoin':'round',fill:'black'});maskContent.append(shade);current.shades.set(room.id,shade);
   const grad=el('radialGradient',{id:'room-warm-'+room.id,cx:'50%',cy:'50%',r:'72%'});grad.append(el('stop',{offset:0,'stop-color':'#ffe1a0','stop-opacity':.22}),el('stop',{offset:1,'stop-color':'#ffc979','stop-opacity':.06}));defs.append(grad);
   const warm=el('path',{d,fill:'url(#room-warm-'+room.id+')','clip-path':'url(#room-clip-'+room.id+')','stroke-width':18,stroke:'#ffe1a0','stroke-opacity':.08});current.warms.set(room.id,warm);
  }
  defs.append(mask);layer.append(defs,el('path',{d:shape.getAttribute('d'),fill:'#06121e',opacity:.86,mask:'url(#home-dark-mask)','data-dark-floor':''}));
  for(const warm of current.warms.values())layer.append(warm);
  for(const w of C.WINDOWS.filter(w=>w.floor===floor)){
   const b=C.beam(w),grad=el('linearGradient',{id:'moon-'+w.id,x1:b.x1,y1:b.y1,x2:b.x2,y2:b.y2});grad.append(el('stop',{offset:0,'stop-color':'#b8dcff','stop-opacity':.72}),el('stop',{offset:1,'stop-color':'#91b9ec','stop-opacity':0}));defs.append(grad);
   const beam=el('path',{d:b.d,fill:'url(#moon-'+w.id+')','clip-path':'url(#room-clip-'+w.room+')','data-moon-window':w.id});layer.append(beam);current.beams.set(w.id,beam);
  }
  if(svg.dataset.floor3Render||svg.dataset.floor4Render||floor==='-1'&&svg.dataset.garageRender)layer.setAttribute('display','none');
  base.append(layer);
  // All white walls remain above lighting and furniture; do not tint their pixels.
  for(const wall of [...base.children].filter(n=>n.matches('path.white-walls,path[stroke="#68685d"]')))base.append(wall);
  // Paredes originais, sem extrusão ou sombras adicionais.
  const hits=el('g',{'data-addon':'blind-hotspots'});svg.removeAttribute('aria-hidden');svg.setAttribute('aria-label',p.name+' · planta interativa');
  for(let w of C.WINDOWS.filter(w=>w.floor===floor)){
   if(floor==='3'&&window.CasaFloor3Render)w={...w,...window.CasaFloor3Render.HOTSPOTS[w.id]};
   if(floor==='4'&&window.CasaFloor4Render)w={...w,...window.CasaFloor4Render.HOTSPOTS[w.id]};
   const x=Math.min(w.x1,w.x2),y=Math.min(w.y1,w.y2),width=Math.abs(w.x2-w.x1),height=Math.abs(w.y2-w.y1);
   const g=el('g',{'class':'blind-window',role:'button',tabindex:0,'aria-label':label(w),'data-blind-window':w.id});
   const target=el('rect',{x:x-14,y:y-14,width:width+28,height:height+28,fill:'transparent',class:'blind-hit'}),ring=el('rect',{x:x-(w.photoBounds?2:7),y:y-(w.photoBounds?2:7),width:width+(w.photoBounds?4:14),height:height+(w.photoBounds?4:14),rx:3,fill:'none',class:'blind-highlight','vector-effect':'non-scaling-stroke'});
   const barGeometry=window.CasaBlindBarCore.geometry(w),bar=el('g',{class:'blind-position-bar','aria-hidden':'true','pointer-events':'none'}),track=el('rect',{x:barGeometry.x,y:barGeometry.y,width:barGeometry.width,height:barGeometry.height,rx:2,class:'blind-bar-track','vector-effect':'non-scaling-stroke'}),fill=el('rect',{x:barGeometry.x,y:barGeometry.y,width:0,height:0,rx:2,class:'blind-bar-fill'});bar.append(track,fill);
   g.append(target,bar,ring);g.addEventListener('click',e=>{e.stopPropagation();openBlind(w.id)});g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openBlind(w.id)}});
   g.addEventListener('pointerenter',()=>current?.banners.get(w.id)?.classList.add('window-hover'));g.addEventListener('pointerleave',()=>current?.banners.get(w.id)?.classList.remove('window-hover'));hits.append(g);current.hits.set(w.id,{g,target,w,x,y,width,height,bar,fill,barGeometry});
   const banner=document.createElement('button');banner.type='button';banner.className='blind-banner';banner.dataset.blind=w.id;
   const icon=document.createElement('span');icon.className='blind-banner-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M5 5h14M5 9h14M5 13h14M5 17h14"/></svg>';
   const copy=document.createElement('span');copy.className='blind-banner-copy';const name=document.createElement('span');name.className='blind-banner-name';name.textContent=p.rooms.find(r=>r.id===w.room)?.name||w.name;const percent=document.createElement('strong');percent.className='blind-banner-percent';const windowStatus=document.createElement('small');windowStatus.className='blind-banner-window-state';windowStatus.hidden=true;copy.append(name,percent,windowStatus);banner.append(icon,copy);
   banner.addEventListener('click',()=>openBlind(w.id));overlay.append(banner);current.banners.set(w.id,banner);
  }
  base.append(hits);update();
 }
 function update(){
  if(!current)return;const displayState=visualState(),{floor}=current,night=window.CasaEnvironment?.isDay()===false,solarDay=window.CasaEnvironment?.isSolarDay?.(),balconyDay=typeof solarDay==='boolean'?solarDay:!night,p=window.CasaPlans[floor];
  for(const room of p.rooms){
   const lighting=C.lighting(displayState,floor,room,room.id.startsWith('balcony')?!balconyDay:night),on=lighting.on;
   if(floor==='-1'&&room.id==='garage')window.CasaGarageRender?.setLight(current.svg,on);
   const n=Math.round(Math.min(1,lighting.opacity/.86)*255);
   current.shades.get(room.id).dataset.lightSources=lighting.sources.join(',');current.shades.get(room.id).dataset.daylightOpening=String(lighting.opening);
   current.shades.get(room.id).setAttribute('fill',`rgb(${n},${n},${n})`);current.shades.get(room.id).setAttribute('stroke',`rgb(${n},${n},${n})`);
   current.warms.get(room.id).setAttribute('opacity',lighting.electricOpacity);
  }
  if(floor==='3')window.CasaFloor3Render?.sync(current.svg,displayState,night,p.rooms,balconyDay);
  if(floor==='4')window.CasaFloor4Render?.sync(current.svg,displayState,night,p.rooms);
  window.CasaHeater?.lighting(displayState,night);window.CasaDehumidifier?.lighting(displayState,night);
  current.svg.querySelector('[data-mask-base]').setAttribute('fill',night?'white':'black');
  for(const w of C.WINDOWS.filter(w=>w.floor===floor)){
   const info=blindInfo(w.id),p=C.position(displayState,w.id);current.beams.get(w.id).setAttribute('opacity',C.beamOpacity(displayState,w.id,night));
   const stops=current.svg.querySelectorAll('#moon-'+w.id+' stop');stops[0].setAttribute('stop-color',night?'#b8dcff':'#fff5d5');stops[1].setAttribute('stop-color',night?'#91b9ec':'#fffaf0');
   const b=current.banners.get(w.id);b.querySelector('.blind-banner-percent').textContent=info.configured?(info.position===null?(info.lastPosition===null?'—':info.lastPosition+'% · Última leitura'):info.position+'%'):p+'%';b.dataset.quality=info.configured&&info.quality?'unknown':'';b.setAttribute('aria-label',label(w));b.title=label(w);current.hits.get(w.id).g.setAttribute('aria-label',label(w));
   const h=current.hits.get(w.id),reading=window.CasaBlindBarCore.reading(info,p),bg=h.barGeometry;h.bar.style.display=showBars?'':'none';h.bar.dataset.quality=reading.quality;h.fill.setAttribute('width',bg.vertical?bg.width:bg.width*(reading.closed??0));h.fill.setAttribute('height',bg.vertical?bg.height*(reading.closed??0):bg.height);h.bar.dataset.open=reading.position===null?'unknown':String(reading.position);
  }
  position();
 }
 function position(){
  if(!current)return;const matrix=current.svg.getScreenCTM();if(!matrix)return;const rect=$('plan-stage').getBoundingClientRect(),scale=Math.hypot(matrix.a,matrix.b);
  for(const [id,banner]of current.banners){const h=current.hits.get(id),w=h.w;let x=(w.x1+w.x2)/2,y=(w.y1+w.y2)/2;
   if(w.side==='north')y+=29;else if(w.side==='south')y-=29;else x=w.x1;
   banner.querySelector('.blind-banner-name').textContent=window.CasaRoomNames.get(current.floor,w.room);const p=new DOMPoint(x,y).matrixTransform(matrix);banner.hidden=!showBanners;banner.style.setProperty('--blind-banner-scale',String(bannerScale/100));banner.style.transformOrigin=w.side==='west'?'left center':'center center';banner.style.transform=(w.side==='west'?'translate(-18px,-50%)':'translate(-50%,-50%)')+' scale('+bannerScale/100+')';banner.style.width=Math.max(86,Math.min(140,230*scale))+'px';const windowState=window.CasaWindows?.state(id),windowOpen=windowState?.open===true,windowUnknown=windowState?.configured&&windowState.open===null,status=banner.querySelector('.blind-banner-window-state');banner.classList.toggle('window-is-open',windowOpen);status.hidden=!windowOpen&&!windowUnknown;status.textContent=windowOpen?'Janela aberta'+(windowState.configured?'':' · demo'):windowUnknown?'Janela por confirmar':'';const caption=label(w)+(windowState?' · Janela: '+windowState.caption:'');banner.setAttribute('aria-label',caption);banner.title=caption;banner.style.left=(p.x-rect.left)+'px';banner.style.top=(p.y-rect.top)+'px';
   const pad=Math.max(14,22/Math.max(.1,scale));h.target.setAttribute('x',h.x-pad);h.target.setAttribute('y',h.y-pad);h.target.setAttribute('width',h.width+2*pad);h.target.setAttribute('height',h.height+2*pad);
  }
 }
 const icons={power:'<path d="M12 3v9M6.3 5.6a9 9 0 1 0 11.4 0"/>',refresh:'<path d="M3 12a9 9 0 0 1 15.74-6.26L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.74 6.26L3 16M8 16H3v5"/>',blind:'<path d="M5 4h14M5 8h14M5 12h14M5 16h14M12 16v5"/>'};
 function roundButton(icon,name){const b=document.createElement('button');b.type='button';b.className='room-round';b.setAttribute('aria-label',name);b.title=name;b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[icon]+'</svg>';return b}
 function syncRoom(){
  if(!activeRoom)return;const {floor,room}=activeRoom,on=C.light(state,floor,room.id),host=$('room-controls');
  const light=host.querySelector('[data-room-light]');if(light){const s=lightInfo(floor,room.id),value=s.configured?s.on:on;light.classList.toggle('is-on',value===true);light.disabled=s.configured&&!s.canControl;light.setAttribute('aria-pressed',value===null?'mixed':String(value));light.setAttribute('aria-busy',String(!!s.pending));light.setAttribute('aria-label',(value?'Apagar':'Ligar')+' iluminação · '+room.name+(s.configured?' · Shelly':' · demonstração'));host.querySelector('[data-light-state]').textContent=s.configured?(value===null?s.quality||'Por confirmar':''):'Demonstração';host.querySelector('[data-light-feedback]').textContent=s.configured?(s.pending?'A confirmar pelo Shelly…':s.message&&!/confirmad[oa]/i.test(s.message)?s.message:''):''}

  const sensor=$('room-header-sensor');if(sensor?.dataset.roomSensor){const d=window.CasaCloudRead.temperatureSnapshot(sensor.dataset.roomSensor),r=d.reading,fresh=!!r&&r.online&&!r.error&&Number.isFinite(r.fetchedAt)&&Date.now()>=r.fetchedAt&&Date.now()-r.fetchedAt<=120000;const fmt=(v,u)=>Number.isFinite(v)?v.toLocaleString('pt-PT',{maximumFractionDigits:1})+u:'—'+u;sensor.textContent=fmt(r?.temperature,' °C')+' · '+fmt(r?.humidity,' %')+(!fresh?' · '+(Number.isFinite(r?.temperature)||Number.isFinite(r?.humidity)?'Última leitura':'Por consultar'):'');}
  for(const e of host.querySelectorAll('[data-room-meter]')){const d=e.dataset.roomMeter==='ev'?window.CasaCloudRead.evSnapshot():window.CasaCloudRead.snapshot(),p=d.powerKW??d.lastReading?.powerKW,total=d.energyKWh??d.lastReading?.energyKWh,fmt=(v,u)=>Number.isFinite(v)?v.toLocaleString('pt-PT',{maximumFractionDigits:3})+u:'—'+u;e.textContent=fmt(p,' kW')+' · '+fmt(total,' kWh')+(!d.fresh?' · '+(d.lastReading?'Última leitura':'Por confirmar'):'')+(e.dataset.roomMeter==='ev'?' · Alimentação '+(d.feed===true?'ligada':d.feed===false?'desligada':'por confirmar'):'');}
  const siren=host.querySelector('[data-room-siren]');if(siren){const d=window.CasaCloudRead.alarmSnapshot();siren.textContent=!d.triggerConfigured?'Por associar':d.triggered===true?'Disparo detetado':d.triggered===false?'Sem disparo':'Por confirmar';}
  const alarm=host.querySelector('[data-alarm-reading]');if(alarm){const a=window.CasaCloudRead.alarmSnapshot();alarm.textContent=!a.configured?'Por associar':a.visual==='sounding'?'Alarme a tocar':a.armed===true?'Armado':a.armed===false?'Desarmado':'Por confirmar'}
  const gate=host.querySelector('[data-gate-reading]');if(gate)gate.textContent=window.CasaCloudRead?.gateSnapshot().caption||'Estado por confirmar';
  const door=host.querySelector('[data-entrance-reading]');if(door)door.textContent=window.CasaCloudRead?.doorSnapshot().caption||'Estado por confirmar';
  window.CasaRoomPopup?.sync(host);
  for(const w of roomWindows(floor,room.id)){const s=blindInfo(w.id),p=s.configured?s.position:demoPosition(w.id),row=host.querySelector('[data-room-blind="'+w.id+'"]');row.querySelector('[data-blind-state]').textContent=blindText(w.id);if(document.activeElement!==row.querySelector('input'))row.querySelector('input').value=p??0;row.querySelector('input').disabled=s.configured&&!s.canPosition;
   for(const b of row.querySelectorAll('[data-blind-action]')){const stop=b.dataset.blindAction==='stop';b.hidden=stop&&!s.configured;b.disabled=s.configured&&!(stop?s.canStop:s.canControl)}
  }
 }
 function decorateRoom(floor,room){
  activeRoom={floor,room};$('room-dialog').dataset.room=room.id;$('room-dialog').dataset.floor=floor;const host=$('room-controls');host.replaceChildren();
  const windows=roomWindows(floor,room.id),realWindows=windows.some(w=>window.CasaCloudRead?.windowSnapshot(w.id).configured),intro=document.createElement('div');intro.className='room-device-summary';
  const count=document.createElement('span');count.textContent='Equipamentos da divisão';
  const refresh=roundButton('refresh','Atualizar dados da divisão');refresh.addEventListener('click',()=>{syncRoom();window.CasaCloudRead.refresh();$('room-feedback').textContent='A atualizar as leituras; não são enviados comandos.'});intro.append(count,refresh);host.append(intro);
  function row(title,subtitle){const e=document.createElement('div');e.className='room-device-row';const copy=document.createElement('div');copy.className='room-device-copy';const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=subtitle;copy.append(h,p);e.append(copy);host.append(e);return {e,p}}
  const light=row('Iluminação','');light.p.dataset.lightState='';const power=roundButton('power','Iluminação · '+room.name);power.dataset.roomLight='';power.addEventListener('click',async()=>{const s=lightInfo(floor,room.id);if(s.configured){if(!s.canControl)return;try{await window.CasaCloudRead.commandLight(C.key(floor,room.id),!s.on)}catch(e){$('room-feedback').textContent=e.message}}else{state.lights[C.key(floor,room.id)]=!C.light(state,floor,room.id);remember()}syncRoom()});const lightFeedback=document.createElement('small');lightFeedback.dataset.lightFeedback='';light.p.parentElement.append(lightFeedback);const lightSettings=document.createElement('button');lightSettings.type='button';lightSettings.className='room-round';lightSettings.dataset.roomLightSettings='';lightSettings.setAttribute('aria-label','Configurar iluminação · '+room.name);lightSettings.title='Configurar iluminação · '+room.name;lightSettings.append($('open-settings').querySelector('svg').cloneNode(true));lightSettings.addEventListener('click',()=>{$('room-dialog').close();window.CasaShellySetup.openDevice('light',C.key(floor,room.id))});light.e.append(lightSettings,power);
  const role=floor==='-1'&&room.id==='garage'?'garage':floor==='3'?({master:'master',living:'living','balcony-south':'meteo'})[room.id]:null;
  const sensor=$('room-header-sensor');sensor.textContent='';delete sensor.dataset.roomSensor;sensor.hidden=!(role&&window.CasaCloudRead.temperatureSnapshot(role).configured);if(!sensor.hidden)sensor.dataset.roomSensor=role;
  function detail(item,name,open){const button=roundButton('blind',name);button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';button.addEventListener('click',()=>{$('room-dialog').close();open()});item.e.append(button);}
  if(floor==='-1'&&room.id==='garage'){const item=row('Carregador do carro','');item.p.dataset.roomMeter='ev';detail(item,'Detalhes do carregador',()=>window.CasaEVRead.open());}
  if(floor==='3'&&room.id==='entrance'&&window.CasaCloudRead.snapshot().configured){const item=row('Contador geral','');item.p.dataset.roomMeter='home';detail(item,'Detalhes do contador geral',()=>window.CasaEnergy.open());}

  for(const w of windows){
   const item=row(windows.length===1?'Estore':w.name,'');item.e.dataset.roomBlind=w.id;item.p.dataset.blindState='';
   const button=roundButton('blind','Ajustar estore · '+w.name),panel=document.createElement('div');panel.className='room-blind-panel';panel.id='room-blind-panel-'+w.id;panel.hidden=true;button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-expanded','false');
   const label=document.createElement('label');label.textContent='Percentagem aberta';const slider=document.createElement('input');slider.type='range';slider.min=0;slider.max=100;slider.step=1;slider.setAttribute('aria-label','Estore · '+w.name);slider.addEventListener('input',()=>{if(blindInfo(w.id).configured)$('room-feedback').textContent='Destino escolhido: '+slider.value+'% · solte para enviar';else changeBlind(w.id,Number(slider.value))});slider.addEventListener('change',()=>{if(blindInfo(w.id).configured)changeBlind(w.id,Number(slider.value)).catch(e=>{const f=$('room-feedback');if(f)f.textContent=e.message})});label.append(slider);panel.append(label);
   const actions=document.createElement('div');actions.className='control-actions';for(const [name,value]of [['Fechar · 0%','close'],['Abrir · 100%','open'],['Parar','stop']]){const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.blindAction=value;b.addEventListener('click',()=>changeBlind(w.id,value).catch(e=>{const f=$('room-feedback');if(f)f.textContent=e.message}));actions.append(b)}panel.append(actions);
   button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden))});item.e.append(button,panel);
  }
  if(windows.length)window.CasaWindows?.decorateRoom(host,windows);
  if(floor==='-1'&&room.id==='garage'){const alarm=row('Alarme · armação','');alarm.p.dataset.alarmReading='';const button=document.createElement('button');button.type='button';button.textContent='Detalhes';button.setAttribute('aria-label','Detalhes e controlo do alarme');button.addEventListener('click',()=>{$('room-dialog').close();window.CasaAlarm.open()});alarm.e.append(button);const siren=row('Sirene · disparo','');siren.p.dataset.roomSiren='';}
  if(floor==='-1'&&room.id==='garage'){const gate=row('Portão da garagem',window.CasaCloudRead?.gateSnapshot().caption||'Estado por confirmar');gate.p.dataset.gateReading='';const button=document.createElement('button');button.type='button';button.textContent='Ver estado';button.addEventListener('click',()=>{$('room-dialog').close();window.CasaGate.open()});gate.e.append(button)}
  if(room.id==='entrance'){const door=row('Porta de entrada',window.CasaCloudRead?.doorSnapshot().caption||'Estado por confirmar');door.p.dataset.entranceReading='';}
  if(room.id==='stairs3'||room.id==='stairs4'){const nav=document.createElement('button');nav.type='button';nav.className='settings-row';nav.textContent=room.id==='stairs3'?'Subir ao piso 4':'Descer ao piso 3';nav.addEventListener('click',()=>{$('room-dialog').close();document.querySelector('[data-floor="'+(room.id==='stairs3'?'4':'3')+'"]').click()});host.append(nav)}
  if(floor==='3'&&room.id==='balcony-south')window.CasaBalconyAppliances?.decorateRoom(host);
  if(floor==='3'&&room.id==='kitchen')window.CasaDishwasher?.decorateRoom(host);
  if(floor==='3'&&room.id==='living')window.CasaTV?.decorateRoom(host);window.CasaHeater?.decorateRoom(host,floor,room.id);window.CasaDehumidifier?.decorateRoom(host,floor,room.id);
  const feedback=document.createElement('p');feedback.id='room-feedback';feedback.setAttribute('role','status');feedback.className='room-feedback';host.append(feedback);
  if(floor==='-1'&&room.id==='garage')window.CasaFan?.decorateRoom(host);
  window.CasaRoomPopup?.decorate(host);count.textContent=(host.querySelectorAll('.room-device-row').length+(sensor.hidden?0:1))+' equipamentos';syncRoom();
 }
 $('room-dialog').addEventListener('close',()=>{activeRoom=null});
 setInterval(()=>{if(activeRoom&&!document.hidden)syncRoom()},1000);
 async function setAllLights(on){if(typeof on!=='boolean')throw new TypeError('Estado de luz inválido');const result={sent:0,simulated:0,skipped:0};for(const key of C.roomKeys(window.CasaPlans)){const [floor,room]=key.split(':'),s=lightInfo(floor,room);if(!s.configured){state.lights[key]=on;result.simulated++;continue}if(!s.canControl){result.skipped++;continue}try{await window.CasaCloudRead.commandLight(key,on);result.sent++}catch{result.skipped++}}remember();syncRoom();return result}

 async function setAllBlinds(value){if(value!==0&&value!==100)throw new TypeError('Posição de estores inválida');const result={sent:0,simulated:0,skipped:0};for(const w of C.WINDOWS){const s=blindInfo(w.id);if(!s.configured){followers.manual(w.id,visualState(),blindInfo);state.blinds[w.id]=value;result.simulated++;continue}if(!s.canControl){result.skipped++;continue}try{await window.CasaCloudRead.commandBlind(w.id,value===100?'open':'close');result.sent++}catch{result.skipped++}}remember();syncRoom();return result}
 $('demo-all-on').addEventListener('click',()=>setAllLights(true));
 $('demo-all-off').addEventListener('click',()=>setAllLights(false));
 $('demo-reset').addEventListener('click',()=>{followers.reset();state=C.defaults();remember()});
 window.addEventListener('roomnameschange',position);window.addEventListener('energychange',()=>{update();syncBlind();syncRoom()});window.addEventListener('environmentchange',update);
 window.CasaHome={mount,position,decorateRoom,setAllLights,setAllBlinds,snapshot:()=>C.demo(state,window.CasaPlans)};
})();
