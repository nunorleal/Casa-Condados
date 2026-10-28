const test=require('node:test'),assert=require('node:assert/strict'),C=require('../blind-core.js'),R=require('../cloud-read-core.js');
const b={deviceId:'feedface0001',channel:0,type:'cover'};
test('consumos no canal do estore: Gen2 Wh, Gen1 Watt-minute, zero real e campos ausentes',()=>{
 assert.deepEqual(C.meterStatus({status:{'cover:0':{apower:0,aenergy:{total:359}}}},b),{powerWatts:0,energyKWh:.359});
 assert.deepEqual(C.meterStatus({status:{rollers:[{}],meters:[{power:82,total:60000}]}},b),{powerWatts:82,energyKWh:1});
 for(const status of [{'cover:1':{apower:80,aenergy:{total:359}}},{'cover:0':{apower:-1,aenergy:{total:-1}}},{'cover:0':{apower:80,errors:['overpower'],aenergy:{total:359}}},{'cover:0':{apower:'0',aenergy:{total:'359'}}}])assert.deepEqual(C.meterStatus({status},b),{powerWatts:null,energyKWh:null});
});
test('popup mantém consumo conhecido sem inventar zero e usa a consulta normal do estore',async()=>{
 let time=100000,power=0,total=359,online=true,fail=false,calls=0;
 const c=R.create({locks:null,now:()=>time,sleep:async ms=>time+=ms,fetch:async(url,opts)=>{assert.match(new URL(url).pathname,/\/get$/);assert.deepEqual(JSON.parse(opts.body).ids,[b.deviceId]);calls++;if(fail)throw Error('fake');return {status:200,json:async()=>[{id:b.deviceId,online,status:{'cover:0':{current_pos:30,state:'stopped',pos_control:true,apower:power,aenergy:{total}}}}]}}});
 c.configure({server:'https://shelly-fixture.shelly.cloud',authKey:'FAKE-ONLY'},null,null,null,null,null,null,null,null,{'master-north':b});
 assert.equal(calls,0);await c.refresh();let s=c.blindSnapshot('master-north');assert.equal(s.powerWatts,0);assert.equal(s.energyKWh,.359);assert.equal(s.position,30);
 total=undefined;power=80;await c.refresh();s=c.blindSnapshot('master-north');assert.equal(s.powerWatts,80);assert.equal(s.energyKWh,null);assert.equal(s.lastEnergy.value,.359);
 time+=45001;s=c.blindSnapshot('master-north');assert.equal(s.powerWatts,null);assert.equal(s.lastPower.value,80);online=false;power=0;total=0;await c.refresh();s=c.blindSnapshot('master-north');assert.equal(s.powerWatts,null);assert.equal(s.lastPower.value,80);assert.equal(s.lastEnergy.value,.359);online=true;await c.refresh();fail=true;await c.refresh();assert.equal(c.blindSnapshot('master-north').energyKWh,null);
});
