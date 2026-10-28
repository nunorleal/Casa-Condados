/* Header clock: local calculation only, using the home time zone. */
(function(){
 'use strict';const time=document.getElementById('header-time'),date=document.getElementById('header-date'),zone='Europe/Lisbon';
 const hours=new Intl.DateTimeFormat('pt-PT',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}),days=new Intl.DateTimeFormat('pt-PT',{timeZone:zone,weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'});
 function draw(){const now=new Date();time.textContent=hours.format(now);time.dateTime=now.toISOString();date.textContent=days.format(now)}
 draw();setInterval(()=>{if(!document.hidden)draw()},1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw()});window.addEventListener('pageshow',draw);
})();
