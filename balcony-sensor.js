/* Ambient sensor banners. Read from the shared Cloud snapshot without extra requests. */
(function(){
 'use strict';const stage=document.getElementById('plan-stage');let svg=null,floor=null,shown=true;
 const KEY='casa-leal-show-sensor-readings-v1',check=document.getElementById('show-sensor-readings');
 try{const v=JSON.parse(localStorage.getItem(KEY));if(typeof v==='boolean')shown=v}catch{}
 check.checked=shown;check.addEventListener('change',()=>{shown=check.checked;try{localStorage.setItem(KEY,JSON.stringify(shown))}catch{}draw()});
 let bannerScale=window.CasaBannerSize.value();
 window.addEventListener('bannersizechange',()=>{bannerScale=window.CasaBannerSize.value();position()});
 const entries=[{role:'meteo',floor:'3',name:'Varanda',room:'balcony-south',x:300,y:1495},{role:'garage',floor:'-1',name:'Garagem',room:'garage',x:805,y:650},{role:'living',floor:'3',name:'Sala',room:'living',x:300,y:1200},{role:'master',floor:'3',name:'Suite principal',room:'master',x:220,y:390}];
 for(const entry of entries){
 const badge=document.createElement('div');badge.className='balcony-sensor-badge';badge.hidden=true;badge.setAttribute('role','group');badge.innerHTML='<span></span><strong></strong><small></small>';badge.querySelector('span').textContent=entry.name;stage.append(badge);entry.badge=badge;badge.tabIndex=0;badge.dataset.sensor=entry.role;window.CasaSensorLayout.mount(badge,entry.floor,{...window.CasaLabelLayoutCore.sensorRoom(window.CasaPlans,entry.floor,entry.room),x:entry.x,y:entry.y});window.CasaRoomNames.bind(badge,entry.floor,entry.room);
 }

 const format=(v,unit)=>Number.isFinite(v)?v.toLocaleString('pt-PT',{maximumFractionDigits:1})+unit:'—'+unit;
 function draw(){
  for(const entry of entries){const name=window.CasaRoomNames.get(entry.floor,entry.room),badge=entry.badge,s=window.CasaCloudRead.temperatureSnapshot(entry.role),r=s.reading;
  badge.querySelector('span').textContent=name;badge.hidden=!shown||floor!==entry.floor||!s.configured;document.body.classList.toggle(entry.role+'-sensor-active',!badge.hidden);if(badge.hidden)continue;
  const t=Number.isFinite(r?.temperature)?r.temperature:null,h=Number.isFinite(r?.humidity)?r.humidity:null;
  const fresh=!!r&&r.online&&!r.error&&Number.isFinite(r.fetchedAt)&&Date.now()>=r.fetchedAt&&Date.now()-r.fetchedAt<=120000;
  const text=format(t,' °C')+' · '+format(h,' %'),quality=(t!==null||h!==null)&&!fresh?'Última leitura':!r?'Por consultar':t===null&&h===null?'Indisponível':'';
  badge.querySelector('strong').textContent=text;const small=badge.querySelector('small');small.textContent=quality;small.hidden=!quality;
  badge.setAttribute('aria-label',name+' · Temperatura '+format(t,' graus Celsius')+' · Humidade '+format(h,' por cento')+(quality?' · '+quality:''));
  badge.title='Duplo clique para editar o nome. Arraste para mover. F2 também permite editar.'+(r?.fetchedAt?' Consultado na Cloud às '+new Date(r.fetchedAt).toLocaleTimeString('pt-PT'):'');
  }position();
 }
 function position(){
  if(!svg)return;const m=svg.getScreenCTM();if(!m)return;
  for(const entry of entries){const badge=entry.badge;if(badge.hidden)continue;
  const p=new DOMPoint(entry.x,entry.y).matrixTransform(m),r=stage.getBoundingClientRect(),scale=Math.hypot(m.a,m.b);
  badge.style.left=(p.x-r.left)+'px';badge.style.top=(p.y-r.top)+'px';badge.style.fontSize=(Math.min(13,33*scale)*bannerScale/100)+'px';
  }
  window.CasaSensorLayout.position(stage,svg);
 }
 function mount(next,id){svg=next;floor=id;draw()}
 window.addEventListener('roomnameschange',draw);window.addEventListener('energychange',draw);document.addEventListener('visibilitychange',draw);setInterval(draw,5000);
 window.CasaBalconySensor={mount,position};
})();
