const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('../meteo-core.js');
const now=1000000,r={temperature:21.5,humidity:54,online:true,fetchedAt:now-60000};
test('bedroom banner uses valid independent temperature/humidity fields, including zero',()=>{const d=C.bedroomClimate(true,r,now);assert.equal(d.temperature,21.5);assert.equal(d.humidity,54);assert.equal(d.status,'current');assert.equal(d.fetchedAt,now-60000);assert.equal(C.bedroomClimate(true,{...r,temperature:0,humidity:0},now).status,'current');for(const humidity of [-1,101,NaN,'54',undefined]){const p=C.bedroomClimate(true,{...r,humidity},now);assert.equal(p.temperature,21.5);assert.equal(p.humidity,null);assert.equal(p.status,'partial')}});
test('pending, stale, offline and failed queries never become fresh values or fabricated zero',()=>{assert.equal(C.bedroomClimate(true,null,now).status,'pending');assert.equal(C.bedroomClimate(true,{...r,temperature:null,humidity:null},now).status,'unavailable');for(const patch of [{online:false},{error:true},{fetchedAt:1},{fetchedAt:now+1},{fetchedAt:undefined}]){const d=C.bedroomClimate(true,{...r,...patch},now);assert.equal(d.status,'last');assert.equal(d.temperature,21.5);assert.equal(d.humidity,54)}assert.equal(C.bedroomClimate(true,{...r,online:false},now).offline,true)});
test('an unassociated sensor exposes no values, query timestamp or transport details',()=>{const d=C.bedroomClimate(false,{...r,deviceId:'FAKE',authKey:'FAKE'},now);assert.equal(d.status,'unconfigured');assert.equal(d.temperature,null);assert.equal(d.humidity,null);assert.equal(d.fetchedAt,null);assert(!JSON.stringify(d).includes('FAKE'))});

test('the Meteo bridge reads only the existing bedroom cache, without refresh or commands',()=>{const fs=require('node:fs'),vm=require('node:vm'),source=fs.readFileSync(require.resolve('../meteo.js'),'utf8'),line=source.split('\n').find(l=>l.trim().startsWith('bedroomClimate:')),calls=[],window={CasaShelly:{sensorBinding:id=>{calls.push(id);return true},sensorReading:id=>{calls.push(id);return {...r,fetchedAt:Date.now()}}},CasaCloudRead:{temperatureSnapshot:role=>{calls.push(role);return {configured:true,reading:{...r,fetchedAt:Date.now()}}}}};const api=vm.runInNewContext('({'+line+'})',{window,CasaMeteoCore:C,selectedIndoorSensor:()=> 'master',indoorSensors:()=>[{id:'master',name:'Quarto principal',configured:true}]});const value=api.bedroomClimate();assert.equal(value.temperature,21.5);assert.equal(value.humidity,54);assert(calls.length>0);assert(calls.every(role=>role==='master'))});

test('indoor sensor choice is validated and survives preferences without changing old backups',()=>{
 for(const indoorSensor of ['master','living','balcony','cellar','garage','meteo'])assert.equal(C.preferences({indoorSensor}).indoorSensor,indoorSensor);
 assert.deepEqual(C.preferences({}),{});for(const indoorSensor of [null,42,'../secret','', 'a'.repeat(65)])assert.throws(()=>C.preferences({indoorSensor}));
});
test('selected room supplies both climate values and label; removed bindings never fall back to another sensor',()=>{
 const calls=[],sensors=[{id:'master',name:'Quarto',configured:true},{id:'living',name:'Sala',configured:true}];
 const selected=C.indoorClimate('living',sensors,id=>{calls.push(id);return r},now);
 assert.equal(selected.name,'Sala');assert.equal(selected.temperature,21.5);assert.equal(selected.humidity,54);assert.deepEqual(calls,['living']);
 assert.equal(C.indoorClimate('removed',sensors,()=>{throw Error('must not read')},now).configured,false);
 assert.equal(C.indoorClimate('living',[{...sensors[1],configured:false}],()=>{throw Error('must not read')},now).temperature,null);
});

test('chosen indoor sensor roundtrips through the Condados JSON backup',()=>{const B=require('../backup-core.js');const b=B.create({meteo:{indoorSensor:'living'}},{});assert.equal(B.validate(JSON.parse(JSON.stringify(b)),{}).data.meteo.indoorSensor,'living')});
