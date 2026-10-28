const test=require('node:test'),assert=require('node:assert/strict'),R=require('../cloud-read-core.js');
test('popup da entrada inclui apenas contacto e contador, garagem deduplica EM e consulta sensor/alarme',async()=>{
 const calls=[],meter={source:'custom',deviceId:'feedface0001',channel:0,contractKVA:6.9},ev={deviceId:meter.deviceId,channel:1},door={deviceId:'XB123456',channel:0,source:'blu'},sensor={deviceId:'feedface0002',channel:0},alarm={arm:{deviceId:'feedface0003',channel:0,activeWhenOn:true},trigger:{deviceId:'feedface0004',channel:0,activeWhenOn:true}};
 const c=R.create({locks:null,fetch:async(url,opts)=>{assert.match(new URL(url).pathname,/\/get$/);const body=JSON.parse(opts.body);calls.push(body.ids);return {status:200,json:async()=>body.ids.map(id=>({id,online:true,status:{}}))}}});
 c.configure({server:'https://shelly-fixture.shelly.cloud',authKey:'FAKE-ONLY'},meter,ev,door,null,sensor,null,null,null,{},alarm);
 assert.equal(calls.length,0);assert.deepEqual(c.scopeIds({kind:'room',floor:'3',room:'entrance'}),[door.deviceId,meter.deviceId]);assert.deepEqual(c.scopeIds({kind:'room',floor:'3',room:'living'}),[]);
 const garage=c.scopeIds({kind:'room',floor:'-1',room:'garage'});assert.deepEqual(new Set(garage),new Set([sensor.deviceId,meter.deviceId,alarm.arm.deviceId,alarm.trigger.deviceId]));
 await c.refresh({ids:garage});assert.equal(calls.length,1);assert.ok(!calls[0].includes(door.deviceId));assert.equal(new Set(calls[0]).size,calls[0].length);
});
