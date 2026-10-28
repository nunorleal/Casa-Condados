/* One visual scale for every movable plan banner; legacy preferences are read once. */
(function(){
 'use strict';const KEY='casa-leal-banner-scale-v1',C=window.CasaLabelLayoutCore;let value=100;
 for(const key of [KEY,'casa-leal-sensor-banner-scale-v1','casa-leal-blind-banner-scale-v1']){try{const raw=localStorage.getItem(key);if(raw!==null){value=C.sensorScale(JSON.parse(raw));break}}catch{}}
 const slider=document.getElementById('banner-scale'),output=document.getElementById('banner-scale-value');
 function draw(){slider.value=value;output.textContent=value+'%';document.documentElement.style.setProperty('--banner-scale',String(value/100))}
 window.CasaBannerSize={value:()=>value};draw();
 slider.addEventListener('input',()=>{value=C.sensorScale(Number(slider.value));try{localStorage.setItem(KEY,JSON.stringify(value))}catch{}draw();window.dispatchEvent(new Event('bannersizechange'))});
})();
