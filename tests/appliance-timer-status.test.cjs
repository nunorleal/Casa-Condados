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
 c.configure({server:'https://shelly-1-eu.shelly.cloud',authKey:'FAKE'},null,null,null,null,null,null,null,null,{}, {},{}, {},null,b);await c.refresh();assert.equal(c.heaterSnapshot().timerActive,false);await c.commandHeater(true);clock+=1500;await c.verify();assert.equal(c.heaterSnapshot().timerActive,false);await c.commandHeater(true,{toggleAfter:600});clock+=1500;await c.verify();assert.equal(c.heaterSnapshot().timerActive,true);assert.equal(c.heaterSnapshot().timerRemainingSeconds,30);clock+=1000;assert.equal(c.heaterSnapshot().timerRemainingSeconds,29);clock+=31000;assert.equal(c.heaterSnapshot().on,true);assert.equal(c.heaterSnapshot().timerActive,false);assert.equal(c.heaterSnapshot().timerRemainingSeconds,null);online=0;await c.refresh();assert.equal(c.heaterSnapshot().timerActive,false);
});

test('adding a timer to an already ON appliance waits for timer proof, without OFF or duplicate commands',async()=>{
 const R=require('../cloud-read-core.js');for(const role of ['heater','dehumidifier']){let clock=100000,armed=false;const commands=[],b={deviceId:'deadbeef0011',channel:0};
 const c=R.create({locks:null,now:()=>clock,sleep:async ms=>clock+=ms,fetch:async(url,opts)=>{const body=JSON.parse(opts.body);if(new URL(url).pathname.endsWith('/set/switch')){commands.push(body);return {status:200,json:async()=>({})}}return {status:200,json:async()=>[{id:b.deviceId,online:1,status:{relays:[{ison:true,...(armed?{has_timer:true,timer_remaining:590}:{has_timer:false})}]}}]}}});
 c.configure({server:'https://shelly-1-eu.shelly.cloud',authKey:'FAKE'},null,null,null,null,null,null,null,null,{}, {},{}, {},null,role==='heater'?b:null,role==='dehumidifier'?b:null);await c.refresh();assert.equal(c[role+'Snapshot']().on,true);
 await c['command'+role[0].toUpperCase()+role.slice(1)](true,{toggleAfter:600});clock+=1500;await c.verify();assert.equal(c[role+'Snapshot']().pending,true,'ON alone must not confirm a new timer');assert.equal(c[role+'Snapshot']().timerActive,false);
 armed=true;clock+=4000;await c.verify();assert.equal(c[role+'Snapshot']().pending,false);assert.equal(c[role+'Snapshot']().timerActive,true);assert.equal(commands.length,1);assert.equal(commands[0].on,true);assert.equal(commands[0].toggle_after,600);
 }
});
