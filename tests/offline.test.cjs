const test=require('node:test'),assert=require('node:assert/strict'),R=require('../cloud-read-core.js');
const auth={server:'https://shelly-fixture.shelly.cloud',authKey:'FAKE-ONLY'},heater={deviceId:'feedface0001',channel:0},dehum={deviceId:'feedface0002',channel:0};
test('offline só por booleano/número explícito da Cloud, sem confundir OFF, erro ou leitura antiga',async()=>{
 let time=100000,online=true,failed=false,missing=false,omit=false;const calls=[];
 const c=R.create({locks:null,now:()=>time,sleep:async ms=>time+=ms,fetch:async(url,opts)=>{assert.match(new URL(url).pathname,/\/get$/);const ids=JSON.parse(opts.body).ids;calls.push(ids);if(failed)throw Error('fake network');return {status:200,json:async()=>missing?[]:ids.map(id=>({id,...(omit?{}:{online}),status:{'switch:0':{output:false,apower:0,aenergy:{total:500}}}}))}}});
 const args=[auth,null,null,null,null,null,null,null,null,{},{},{},{},null,heater,dehum];c.configure(...args);
 assert.equal(c.connectionState().offlineCount,0);await c.refresh();assert.equal(c.heaterSnapshot().on,false);assert.equal(c.connectionState({kind:'heater'}).offline,false);
 time+=45001;assert.equal(c.connectionState().offlineCount,0);failed=true;await c.refresh();assert.equal(c.connectionState().offlineCount,0);failed=false;
 online=0;await c.refresh({force:true,ids:[heater.deviceId]});assert.equal(c.connectionState({kind:'heater'}).offline,true);assert.equal(c.connectionState({kind:'dehumidifier'}).offline,false);assert.equal(c.connectionState().offlineCount,1);assert.equal(c.heaterSnapshot().canControl,false);assert.equal(c.heaterSnapshot().lastPower.value,0);
 online=false;await c.refresh();assert.equal(c.connectionState().offlineCount,2);online=1;await c.refresh({force:true,ids:[heater.deviceId]});assert.equal(c.connectionState().offlineCount,1);
 omit=true;await c.refresh();assert.equal(c.connectionState().offlineCount,0);assert.equal(c.connectionState().known,0);omit=false;online='false';await c.refresh();assert.equal(c.connectionState().offlineCount,0);missing=true;await c.refresh();assert.equal(c.connectionState().offlineCount,0);
 c.configure(...args);assert.equal(c.connectionState().offlineCount,0);assert.equal(calls.length>0,true);assert.equal(Object.hasOwn(c.connectionState(),'deviceId'),false);
});
