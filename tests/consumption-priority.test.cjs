const {test}=require('node:test'),assert=require('node:assert/strict'),R=require('../cloud-read-core.js');
const auth={server:'https://shelly-fixture.shelly.cloud',authKey:'FAKE-CONSUMPTION'},b={deviceId:'feedface0001',channel:0},other={deviceId:'feedface0002',channel:0};
function fixture(role,{changeAt=2,initialOn=false,initialPower=0,noMeter=false}={}){
 let time=100000,on=initialOn,power=initialPower,after=0,accepted=false,offline=false;const calls=[];
 const c=R.create({locks:null,now:()=>time,sleep:async ms=>time+=ms,fetch:async(url,opts)=>{
 const body=JSON.parse(opts.body),path=new URL(url).pathname;calls.push({body,path,time});
 if(path.endsWith('/set/switch')){on=body.on;accepted=true;return {status:200,json:async()=>({accepted:true})}}
 if(accepted){after++;if(after>=changeAt)power=on?1500:0}
 return {status:200,json:async()=>body.ids.map(id=>({id,online:offline?0:1,status:{'switch:0':{output:on,...(!noMeter?{apower:power,aenergy:{total:1000}}:{})}}}))};
 }});
 const args=[auth,null,null,null,null,null,null,null,null,{}, {},{}, {},null,null,null,null,{}, {},{}];
 if(role==='heater')args[14]=b;else if(role==='dehumidifier')args[15]=b;else if(role==='tv')args[13]=b;else if(role==='dishwasher')args[16]=b;else if(role==='washer')args[17]={washer:b};else args[19]={monitor:b};
 // A second device proves verification never broadens to the whole home.
 args[18]={soundbar:other};c.configure(...args);
 return {c,calls,advance:ms=>time+=ms,offline:()=>offline=true,reconfigure:()=>c.configure(...args),command:value=>role==='heater'?c.commandHeater(value):role==='dehumidifier'?c.commandDehumidifier(value):c.commandAppliance(role,value),snapshot:()=>role==='heater'?c.heaterSnapshot():role==='dehumidifier'?c.dehumidifierSnapshot():c.appliancePowerSnapshot(role),watts:()=>role==='heater'?c.heaterSnapshot().powerWatts:role==='dehumidifier'?c.dehumidifierSnapshot().powerWatts:role==='tv'?c.tvSnapshot().powerWatts:role==='dishwasher'?c.dishwasherSnapshot().powerWatts:role==='washer'?c.balconyApplianceSnapshot(role).powerWatts:c.mediaSnapshot(role).powerWatts};
}
for(const role of ['heater','dehumidifier','tv','dishwasher','washer','monitor'])test(role+': delayed consumption keeps remaining priority checks after relay confirmation',async()=>{
 const f=fixture(role);await f.c.refresh();await f.command(true);assert.equal(f.snapshot().on,false);
 f.advance(1500);await f.c.verify();assert.equal(f.snapshot().on,true);assert.equal(f.snapshot().pending,false);assert.equal(f.snapshot().canControl,true);assert.equal(f.watts(),0);assert.notEqual(f.c.confirmationDelay(),null);assert.equal(f.c.activitySnapshot().confirming,0);
 f.advance(4000);await f.c.verify();assert.equal(f.watts(),1500);assert.equal(f.c.confirmationDelay(),null);
 for(const call of f.calls.slice(2))assert.deepEqual(call.body.ids,[b.deviceId]);assert.equal(f.calls.filter(x=>x.path.endsWith('/set/switch')).length,1);
 for(let i=1;i<f.calls.length;i++)assert.ok(f.calls[i].time-f.calls[i-1].time>=1500);
});
test('unchanged zero watts terminates after three total reads without declaring the confirmed relay failed',async()=>{
 const f=fixture('heater',{changeAt:99});await f.c.refresh();await f.command(true);for(const ms of [1500,4000,10000]){f.advance(ms);await f.c.verify()}
 assert.equal(f.c.confirmationDelay(),null);assert.equal(f.snapshot().on,true);assert.equal(f.watts(),0);assert.doesNotMatch(f.snapshot().message,/sem confirmação/);assert.equal(f.calls.filter(x=>x.path.endsWith('/get')).length,4);
 f.advance(30000);await f.c.verify();assert.equal(f.calls.length,5);
});
test('OFF uses reported zero, finishes promptly, and never infers relay state from watts',async()=>{const f=fixture('heater',{changeAt:1,initialOn:true,initialPower:1500});await f.c.refresh();await f.command(false);assert.equal(f.snapshot().on,true);f.advance(1500);await f.c.verify();assert.equal(f.snapshot().on,false);assert.equal(f.watts(),0);assert.equal(f.c.confirmationDelay(),null)});
test('missing meter is bounded; offline preserves the last known watts; reconfiguration clears follow-up',async()=>{
 const f=fixture('heater',{noMeter:true});await f.c.refresh();await f.command(true);for(const ms of [1500,4000,10000]){f.advance(ms);await f.c.verify()}assert.equal(f.watts(),null);assert.equal(f.c.confirmationDelay(),null);
 const g=fixture('heater',{changeAt:99,initialPower:12});await g.c.refresh();await g.command(true);g.advance(1500);await g.c.verify();g.offline();g.advance(4000);await g.c.verify();assert.equal(g.watts(),null);assert.equal(g.c.heaterSnapshot().lastPower.value,12);g.reconfigure();assert.equal(g.c.confirmationDelay(),null);assert.equal(g.calls.filter(x=>x.path.endsWith('/set/switch')).length,1);
});
test('new explicit command replaces the consumption ticket instead of retaining the previous intention',async()=>{const f=fixture('heater',{changeAt:99});await f.c.refresh();await f.command(true);f.advance(1500);await f.c.verify();await f.command(false);f.advance(1500);await f.c.verify();assert.equal(f.snapshot().on,false);for(const ms of [4000,10000]){f.advance(ms);await f.c.verify()}assert.equal(f.c.confirmationDelay(),null);assert.equal(f.calls.filter(x=>x.path.endsWith('/set/switch')).length,2)});
