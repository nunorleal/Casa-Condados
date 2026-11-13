const {test}=require('node:test');
const assert=require('node:assert/strict');
const Home=require('../home-core.js');
const Cloud=require('../cloud-read-core.js');

const id='deadbeef0022';
const bindings={hob:{deviceId:id,channel:0},oven:{deviceId:id,channel:1}};
test('Shelly EM kitchen configuration accepts independent channels and rejects repeated pairs',()=>{
 assert.deepEqual(Home.kitchenMeterConfig(bindings),bindings);
 assert.deepEqual(Home.kitchenMeterConfig({}),{});
 assert.throws(()=>Home.kitchenMeterConfig({...bindings,oven:bindings.hob}),/já está associado/);
 assert.throws(()=>Home.kitchenMeterConfig({oven:{deviceId:id,channel:2}}),/0 e 1/);
});

test('kitchen reads both channels in one request, with separate activity and no relay control',async()=>{
 const requests=[];
 let time=100000,online=true,powers=[900,10];
 const client=Cloud.create({now:()=>time,interval:0,fetch:async(url,options)=>{
  const {ids}=JSON.parse(options.body);
  requests.push({path:new URL(url).pathname,ids});
  return {status:200,text:async()=>JSON.stringify([{id,online,status:{relays:[{ison:true}],emeters:powers.map(power=>({power,total:2000}))}}])};
 }});
 client.configure({server:'https://shelly-1-eu.shelly.cloud',authKey:'FAKE'},null,null,null,null,null,null,null,null,{}, {}, {}, {},null,null,null,null,{}, {}, {},null,bindings);
 assert.deepEqual(client.scopeIds({kind:'room',floor:'3',room:'kitchen'}),[id]);
 await client.refresh();
 assert.deepEqual(requests,[{path:'/v2/devices/api/get',ids:[id]}]);
 assert.equal(client.kitchenMeterSnapshot('hob').activity,true);
 assert.equal(client.kitchenMeterSnapshot('oven').activity,false);
 assert.deepEqual(client.roomPowerSnapshot().map(r=>[r.id,r.watts]),[['hob',900],['oven',10]]);
 powers=[0,10.1];time+=1000;
 await client.refresh();
 assert.equal(client.kitchenMeterSnapshot('hob').activity,false);
 assert.equal(client.kitchenMeterSnapshot('oven').activity,true);
 online=false;time+=1000;
 await client.refresh();
 assert.equal(client.kitchenMeterSnapshot('oven').activity,null);
 assert.equal(client.healthSnapshot().length,1);
 assert.equal(client.healthSnapshot()[0].status,'offline');
 await assert.rejects(client.commandAppliance('hob',true));
 assert.equal(requests.length,3);
});
