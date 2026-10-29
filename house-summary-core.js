/* Pure aggregation of confirmed readings. Demo and historical values never count as current. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CasaHouseSummaryCore=factory()})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 function aggregate(windows=[],lights=[],health=[]){const actual=rows=>rows.filter(r=>r.configured),counts=rows=>({active:rows.filter(r=>r.value===true).length,unknown:rows.filter(r=>r.value!==true&&r.value!==false).length,total:rows.length});const devices=[...new Map(health.map(r=>[r.id,r])).values()];return {windows:counts(actual(windows)),lights:counts(actual(lights)),devices:{total:devices.length,unavailable:devices.filter(r=>['offline','error','unavailable'].includes(r.status)).length,waiting:devices.filter(r=>['stale','pending'].includes(r.status)).length},problems:devices.filter(r=>r.status!=='ready')}}
 return {aggregate};
});
