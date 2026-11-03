/* Casa Leal adapter: actual current meters and native SVG room coordinates. */
(function(){
 'use strict';
 window.CasaRoomPowerAdapter={
  mountButton(button){document.body.append(button)},
  entries:()=>window.CasaCloudRead.roomPowerSnapshot(),
  scale:()=>window.CasaBannerSize.value()/100,
  control(e){const c=window.CasaCloudRead,dirty=window.CasaShellySetup.isDirty();let s,command;
   if(e.role==='light'){s=c.lightSnapshot(e.id);command=on=>c.commandLight(e.id,on)}else if(e.role==='heater'){s=c.heaterSnapshot();command=on=>c.commandHeater(on)}else if(e.role==='dehumidifier'){s=c.dehumidifierSnapshot();command=on=>c.commandDehumidifier(on)}else if(e.role==='appliance'){s=c.appliancePowerSnapshot(e.id);command=on=>c.commandAppliance(e.id,on)}else if(e.role==='alarm'&&e.id==='arm'){s=c.alarmSnapshot();s={...s,on:s.armed};command=on=>c.commandAlarm(on)}else return null;
   return {...s,canControl:!!s.canControl&&!dirty,command};
  },
  plan(){const floor=document.querySelector('[data-floor][aria-current=page]')?.dataset.floor,p=window.CasaPlans[floor],host=document.getElementById('plan-stage'),svg=host?.querySelector('#plan-canvas svg');if(!p||!svg)return null;return {floor,host,svg,rooms:p.rooms.filter(r=>!r.id.startsWith('stairs')).map(r=>({...r,id:floor+':'+r.id,name:window.CasaRoomNames.get(floor,r.id)}))}},
  position(plan,row,node){const m=plan.svg.getScreenCTM(),r=plan.host.getBoundingClientRect();if(!m)return;const G=window.BannerGeometry,polys=G.polygons(row.area),box=G.bounds(polys),scale=Math.hypot(m.a,m.b);const available=Math.max(36,Math.min(116,(box.maxX-box.minX)*scale-5));node.style.maxWidth=available+'px';node.classList.toggle('is-compact',available<72||(box.maxY-box.minY)*scale<52);const w=node.getBoundingClientRect().width/scale,h=node.getBoundingClientRect().height/scale,p=G.nearestFit(polys,{x:row.x,y:row.y},w,h)||{x:row.x,y:row.y};node.style.left=(m.a*p.x+m.c*p.y+m.e-r.left)+'px';node.style.top=(m.b*p.x+m.d*p.y+m.f-r.top)+'px'}
 };
})();
