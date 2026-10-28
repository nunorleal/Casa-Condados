const {test}=require('node:test'),assert=require('node:assert/strict'),T=require('../temperature-core.js'),R=require('../cloud-read-core.js'),H=require('../home-core.js'),M=require('../meteo-core.js'),B=require('../backup-core.js');
const binding={deviceId:'XB12345678901234',channel:0},account={server:'https://shelly-fixture.shelly.cloud',authKey:'FAKE-ONLY'},plans={'3':{rooms:[]}};
test('temperatura ambiente: zero válido, componente exato, unidades e rejeição da temperatura interna',()=>{
 assert.equal(T.status({online:1,status:{'temperature:0':{tC:0}}},binding).temperature,0);
 assert.equal(T.status({online:1,status:{'temperature:1':{tC:22}}},binding).temperature,null);
 assert.equal(T.status({online:1,status:{tmp:{tC:65},'switch:0':{temperature:{tC:65}}}},binding).temperature,null);
 assert.equal(T.status({online:1,status:{tmp:{value:68,units:'F'},hum:{value:40}}},binding).temperature,20);
 for(const c of [{tC:null},{tC:'22'},{tC:999},{tC:22,is_valid:false},{tC:22,errors:['sensor']}])assert.equal(T.status({online:1,status:{'temperature:0':c}},binding).temperature,null);
});
test('sensor sem EM consulta só get, preserva XB, usa fila e apresenta offline/erro/antigo como última leitura',async()=>{
 let now=1000,calls=[],online=1,fail=false;
 const client=R.create({now:()=>now,sleep:async()=>{},fetch:async(url,options)=>{calls.push({url,options});if(fail)throw TypeError('SECRET');return {status:200,json:async()=>[{id:binding.deviceId.toLowerCase(),online,status:{'temperature:0':{tC:18.7}}}]}}});
 client.configure(account,null,null,null,binding);await client.refresh();
 const read=()=>{const s=client.temperatureSnapshot();return M.realTemperature(s.configured,s.reading,now)};
 assert.equal(read().temperature,18.7);assert.equal(read().status,'current');assert.deepEqual(JSON.parse(calls[0].options.body),{ids:[binding.deviceId],select:['status']});assert.equal(new URL(calls[0].url).pathname,'/v2/devices/api/get');
 assert.equal(JSON.stringify(client.temperatureSnapshot()).includes('FAKE-ONLY'),false);assert.equal(JSON.stringify(client.temperatureSnapshot()).includes(binding.deviceId),false);
 online=0;await client.refresh();assert.equal(read().status,'last');assert.equal(read().temperature,18.7);
 online=1;await client.refresh();now+=120001;assert.equal(read().status,'last');fail=true;await client.refresh();assert.equal(read().status,'last');assert.equal(read().temperature,18.7);
 const count=calls.length;await client.refresh({isCurrent:()=>false});assert.equal(calls.length,count);
 client.configure(account,null,null,null,null);assert.equal(client.temperatureSnapshot().configured,false);await client.refresh();assert.equal(calls.length,count);
});
test('config e backup mantêm sensor, componente, remoção e compatibilidade de ficheiros antigos',()=>{
 const setup=H.setup({...H.emptySetup(),server:account.server,meteoSensor:binding},plans);assert.deepEqual(setup.meteoSensor,binding);
 for(const bad of [{...binding,deviceId:'XB999999999999999'},{...binding,channel:256},{...binding,channel:0.5},{...binding,authKey:'secret'}])assert.throws(()=>H.setup({...setup,meteoSensor:bad},plans));
 const data=new Map([[B.KEYS.shellySetup,JSON.stringify(setup)]]),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const backup=B.create({shellySetup:setup,meteoTemperatureAssociated:true},plans);assert.deepEqual(backup.data.shellySetup.meteoSensor,binding);
 B.write(storage,B.create({shellySetup:{...H.emptySetup(),server:account.server}},plans),plans);assert.deepEqual(JSON.parse(data.get(B.KEYS.shellySetup)).meteoSensor,binding);
 B.write(storage,B.create({shellySetup:{...setup,meteoSensor:null}},plans),plans);assert.equal(JSON.parse(data.get(B.KEYS.shellySetup)).meteoSensor,null);
});
test('humidade real usa componente exato, preserva zero e rejeita inválidos sem afetar temperatura',()=>{
 const d=h=>({online:1,status:{'temperature:0':{tC:18.7},'humidity:0':h}});
 assert.equal(T.status(d({rh:0}),binding).humidity,0);
 assert.equal(T.status(d({rh:65.5}),binding).humidity,65.5);
 for(const h of [{rh:null},{rh:'65'},{rh:-1},{rh:101},{rh:65,is_valid:false},{rh:65,errors:['sensor']}]){const r=T.status(d(h),binding);assert.equal(r.humidity,null);assert.equal(r.temperature,18.7)}
 assert.equal(T.status({online:1,status:{'humidity:1':{rh:65}}},binding).humidity,null);
 assert.equal(T.status({online:0,status:{tmp:{tC:18.7},hum:{value:65}}},binding).humidity,65);
});
test('garagem e varanda mantêm leituras independentes no mesmo pedido e deduplicam IDs',async()=>{
 const garage={deviceId:'XB12345678901235',channel:0};let ids;
 const c=R.create({sleep:async()=>{},fetch:async(url,options)=>{ids=JSON.parse(options.body).ids;assert.equal(new URL(url).pathname,'/v2/devices/api/get');return {status:200,json:async()=>[{id:binding.deviceId,online:1,status:{'temperature:0':{tC:18.7},'humidity:0':{rh:65}}},{id:garage.deviceId,online:0,status:{'temperature:0':{tC:16.2},'humidity:0':{rh:72}}}]}}});
 c.configure(account,null,null,null,binding,garage);await c.refresh();assert.deepEqual(ids,[binding.deviceId,garage.deviceId]);assert.equal(c.temperatureSnapshot().reading.temperature,18.7);assert.equal(c.temperatureSnapshot('garage').reading.temperature,16.2);assert.equal(c.temperatureSnapshot('garage').reading.humidity,72);assert.equal(c.temperatureSnapshot('garage').reading.online,false);assert.equal(c.temperatureSnapshot('invalid').configured,false);
 c.configure(account,null,null,null,binding,binding);await c.refresh();assert.deepEqual(ids,[binding.deviceId]);
 c.configure(account,null,null,null,null,garage);await c.refresh();assert.deepEqual(ids,[garage.deviceId]);assert.equal(c.temperatureSnapshot().configured,false);assert.equal(c.temperatureSnapshot('garage').configured,true);
});
test('backup da garagem preserva associação ausente e permite remover sem afetar MeteoNL',()=>{
 const garage={deviceId:'XB12345678901235',channel:0},setup=H.setup({...H.emptySetup(),server:account.server,meteoSensor:binding,garageSensor:garage},plans);
 const data=new Map([[B.KEYS.shellySetup,JSON.stringify(setup)]]),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const b=B.create({shellySetup:setup,garageTemperatureAssociated:true},plans);assert.deepEqual(b.data.shellySetup.garageSensor,garage);
 const old={...setup};delete old.garageSensor;B.write(storage,B.create({shellySetup:old},plans),plans);assert.deepEqual(JSON.parse(data.get(B.KEYS.shellySetup)).garageSensor,garage);
 B.write(storage,B.create({shellySetup:{...setup,garageSensor:null}},plans),plans);const clean=JSON.parse(data.get(B.KEYS.shellySetup));assert.equal(clean.garageSensor,null);assert.deepEqual(clean.meteoSensor,binding);
 assert.throws(()=>H.setup({...setup,garageSensor:{...garage,channel:256}},plans));
});
test('sala e suite são sensores independentes, mesmo sem EM, garagem ou varanda',async()=>{
 const living={deviceId:'abc123',channel:0},master={deviceId:'def456',channel:0};let ids;
 const c=R.create({sleep:async()=>{},fetch:async(url,options)=>{ids=JSON.parse(options.body).ids;return {status:200,json:async()=>[{id:living.deviceId,online:1,status:{tmp:{tC:22.4},hum:{value:48}}},{id:master.deviceId,online:1,status:{'temperature:0':{tC:20.6},'humidity:0':{rh:51}}}]}}});
 c.configure(account,null,null,null,null,null,living,master);await c.refresh();assert.deepEqual(ids,[living.deviceId,master.deviceId]);assert.equal(c.temperatureSnapshot('living').reading.temperature,22.4);assert.equal(c.temperatureSnapshot('living').reading.humidity,48);assert.equal(c.temperatureSnapshot('master').reading.temperature,20.6);assert.equal(c.temperatureSnapshot('master').reading.humidity,51);assert.equal(c.temperatureSnapshot().configured,false);assert.equal(c.temperatureSnapshot('garage').configured,false);
 c.configure(account,null,null,null,null,null,living,null);await c.refresh();assert.equal(c.temperatureSnapshot('master').configured,false);assert.deepEqual(ids,[living.deviceId]);
});
test('backup valida check booleano, preserva sensores de sala/suite ausentes e remoção explícita',()=>{
 const living={deviceId:'abc123',channel:0},master={deviceId:'def456',channel:0},setup=H.setup({...H.emptySetup(),server:account.server,livingSensor:living,masterSensor:master},plans);
 const b=B.create({shellySetup:setup,showSensorReadings:false,roomTemperatureAssociated:true},plans);assert.equal(b.data.showSensorReadings,false);assert.deepEqual(b.data.shellySetup.livingSensor,living);assert.deepEqual(b.data.shellySetup.masterSensor,master);assert.throws(()=>B.create({showSensorReadings:'false'},plans));
 const data=new Map([[B.KEYS.shellySetup,JSON.stringify(setup)],[B.KEYS.showSensorReadings,'false']]),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 B.write(storage,B.create({shellySetup:{...H.emptySetup(),server:account.server}},plans),plans);const actual=JSON.parse(data.get(B.KEYS.shellySetup));assert.deepEqual(actual.livingSensor,living);assert.deepEqual(actual.masterSensor,master);assert.equal(data.get(B.KEYS.showSensorReadings),'false');
 B.write(storage,B.create({shellySetup:{...setup,livingSensor:null,masterSensor:null},showSensorReadings:true},plans),plans);const removed=JSON.parse(data.get(B.KEYS.shellySetup));assert.equal(removed.livingSensor,null);assert.equal(removed.masterSensor,null);assert.equal(data.get(B.KEYS.showSensorReadings),'true');
});
