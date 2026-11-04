const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('../energy-core.js');
const read=(status,online=1)=>C.relayStatus({online,status},0);
test('native timer status uses only reported fields in the exact relay channel',()=>{
 for(const c of [{ison:true,has_timer:true,timer_remaining:300},{output:true,timer_started_at:1000,timer_duration:600}]){const s=c.ison!==undefined?{relays:[c]}:{'switch:0':c,sys:{unixtime:1100}};const r=read(s);assert.equal(r.timerActive,true);assert.equal(r.timerSeconds,c.ison?300:500)}
 assert.equal(read({relays:[{ison:true}]}).timerActive,undefined);
 for(const c of [{ison:true,has_timer:false,timer_remaining:300},{ison:true,has_timer:true,timer_remaining:0},{ison:true,has_timer:true,timer_remaining:'300'},{output:true,timer_started_at:1000,timer_duration:60}])assert.equal(read({relays:[c],sys:{unixtime:1100}}).timerActive,false);
 assert.equal(read({'switch:1':{output:true,timer_remaining:300}}).timerActive,undefined);
});

test('timer colour expires while the reading is fresh, and clears on offline/unknown output',async()=>{
 const R=require('../cloud-read-core.js');let clock=100000,online=1,on=true;const b={deviceId:'deadbeef0011',channel:0};
 const c=R.create({locks:null,now:()=>clock,sleep:async ms=>clock+=ms,fetch:async url=>({status:200,json:async()=>new URL(url).pathname.endsWith('/get')?[{id:b.deviceId,online,status:{relays:[{ison:on,has_timer:true,timer_remaining:30}]}}]:{}})});
 c.configure({server:'https://shelly-1-eu.shelly.cloud',authKey:'FAKE'},null,null,null,null,null,null,null,null,{}, {},{}, {},null,b);await c.refresh();assert.equal(c.heaterSnapshot().timerActive,false);await c.commandHeater(true);clock+=1500;await c.verify();assert.equal(c.heaterSnapshot().timerActive,false);await c.commandHeater(true,{toggleAfter:600});clock+=1500;await c.verify();assert.equal(c.heaterSnapshot().timerActive,true);clock+=31000;assert.equal(c.heaterSnapshot().on,true);assert.equal(c.heaterSnapshot().timerActive,false);online=0;await c.refresh();assert.equal(c.heaterSnapshot().timerActive,false);
});
