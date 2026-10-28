const {test}=require('node:test'),assert=require('node:assert/strict'),A=require('../alarm-core.js'),E=require('../energy-core.js'),R=require('../cloud-read-core.js'),H=require('../home-core.js'),B=require('../backup-core.js');
const auth={server:'https://shelly-fixture.shelly.cloud',authKey:'FAKE-KEY'},alarm={arm:{deviceId:'deadbeefaa01',channel:1,activeWhenOn:true},trigger:{deviceId:'deadbeefaa02',channel:0,activeWhenOn:true}},plans={'-1':{rooms:[{id:'garage'}]}};
function fixture(){let now=100000,arm=false,trigger=false,online=true,fail=false,reject=false,requests=[];
 const c=R.create({now:()=>now,sleep:async ms=>now+=ms,fetch:async(url,opts)=>{const path=new URL(url).pathname,body=JSON.parse(opts.body);requests.push({path,body});if(fail)throw TypeError('FAKE-KEY');if(path.endsWith('/set/switch'))return {status:200,json:async()=>reject?{error:'FAKE-KEY'}:{}};assert.ok(path.endsWith('/get'));return {status:200,json:async()=>[{id:alarm.arm.deviceId,online,status:{'switch:1':{output:arm}}},{id:alarm.trigger.deviceId,online,status:{relays:[{ison:trigger}]}}]}}});
 c.configure(auth,null,null,null,null,null,null,null,null,{},alarm);
 return {c,requests,states:(a,t)=>{arm=a;trigger=t},offline:()=>online=false,advance:n=>now+=n,fail:()=>fail=true,reject:()=>reject=true};
}
test('configuração e backup do alarme preservam papéis/polaridade, rejeitam saídas duplicadas',()=>{
 const setup={server:auth.server,lights:{},blinds:{},alarm},clean=H.setup(setup,plans);assert.deepEqual(clean.alarm,alarm);assert.ok(!Object.hasOwn(H.setup({...setup,alarm:undefined},plans),'alarm'));
 assert.throws(()=>H.setup({...setup,alarm:{...alarm,trigger:alarm.arm}},plans));assert.throws(()=>H.setup({...setup,lights:{'-1:garage':{deviceId:alarm.arm.deviceId,channel:1,type:'switch'}}},plans));assert.throws(()=>H.setup({...setup,alarm:{arm:{...alarm.arm,activeWhenOn:'true'}}},plans));
 const map=new Map([[B.KEYS.shellySetup,JSON.stringify(setup)]]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 B.write(storage,B.create({shellySetup:{server:auth.server,lights:{},blinds:{}}},plans),plans);assert.deepEqual(JSON.parse(map.get(B.KEYS.shellySetup)).alarm,alarm);B.write(storage,B.create({shellySetup:{...setup,alarm:{}}},plans),plans);assert.deepEqual(JSON.parse(map.get(B.KEYS.shellySetup)).alarm,{});
});
test('normalização só relés booleanos no canal exato, sem inferência por watts',()=>{
 assert.equal(E.relayStatus({online:1,status:{'switch:1':{output:false,apower:20}}},1).on,false);assert.equal(E.relayStatus({online:1,status:{'switch:1':{apower:20}}},1).on,null);assert.equal(E.relayStatus({online:1,status:{'switch:0':{output:true}}},1).on,null);
 assert.equal(E.relayStatus({online:1,status:{relays:[{ison:true}], 'switch:0':{output:false}}}).on,null);
});
test('disparo tem prioridade; estados ausentes/offline/stale nunca inventam desarmado ou silêncio',async()=>{
 const f=fixture();assert.equal(f.c.alarmSnapshot().visual,'unknown');await f.c.refresh();assert.equal(f.c.alarmSnapshot().visual,'disarmed');f.states(true,false);await f.c.refresh();assert.equal(f.c.alarmSnapshot().visual,'armed');f.states(false,true);await f.c.refresh();assert.equal(f.c.alarmSnapshot().visual,'sounding');assert.equal(f.c.alarmSnapshot().armed,false);assert.equal(f.c.alarmSnapshot().triggered,true);
 f.advance(45001);assert.equal(f.c.alarmSnapshot().visual,'unknown');assert.equal(f.c.alarmSnapshot().triggered,null);await f.c.refresh();f.offline();await f.c.refresh();assert.equal(f.c.alarmSnapshot().armed,null);assert.equal(f.c.alarmSnapshot().triggered,null);assert.equal(f.c.alarmSnapshot().canControl,false);
});
test('alarme apenas com leitura não atua ao configurar; armar usa só arm e espera confirmação',async()=>{
 const f=fixture();assert.equal(f.requests.length,0);await f.c.refresh();assert.ok(f.requests.every(r=>r.path.endsWith('/get')));assert.deepEqual(f.requests[0].body.ids,[alarm.arm.deviceId,alarm.trigger.deviceId]);await f.c.commandAlarm(true);assert.equal(f.c.alarmSnapshot().armed,false);assert.equal(f.c.alarmSnapshot().pending,true);
 const commands=f.requests.filter(r=>r.path.endsWith('/set/switch'));assert.deepEqual(commands.map(c=>c.body),[{id:alarm.arm.deviceId,channel:1,on:true}]);assert.ok(!JSON.stringify(f.c.alarmSnapshot()).includes('FAKE-KEY'));assert.ok(!JSON.stringify(f.c.alarmSnapshot()).includes(alarm.arm.deviceId));
 await assert.rejects(f.c.commandAlarm(false));f.states(true,false);await f.c.refresh();assert.equal(f.c.alarmSnapshot().armed,true);assert.equal(f.c.alarmSnapshot().pending,false);await f.c.commandAlarm(false);assert.equal(f.requests.filter(r=>r.path.endsWith('/set/switch')).at(-1).body.on,false);
});
test('trigger é só leitura; rejeita alvo/booleano inválido, offline/sujo e não repete falha',async()=>{
 const f=fixture();await assert.rejects(f.c.commandAlarm(true));await f.c.refresh();for(const invalid of ['trigger',1,null])await assert.rejects(f.c.commandAlarm(invalid));await assert.rejects(f.c.commandAlarm(true,{isCurrent:()=>false}));assert.ok(f.requests.every(r=>r.path.endsWith('/get')));f.reject();await assert.rejects(f.c.commandAlarm(true),/recusou/);assert.equal(f.requests.filter(r=>r.path.endsWith('/set/switch')).length,1);assert.equal(f.c.alarmSnapshot().armed,null);assert.equal(f.c.alarmSnapshot().pending,false);assert.ok(!f.c.alarmSnapshot().message.includes('FAKE-KEY'));
});
test('polaridade configurável e estado parcial reproduzem o esquema original',()=>{
 const reading=on=>({online:true,on,hasOutput:true,valid:true,errors:[],fetchedAt:1000}),config={arm:{...alarm.arm,activeWhenOn:false},trigger:alarm.trigger};
 assert.equal(A.state(config,{arm:reading(false),trigger:reading(false)},1000).armed,true);assert.equal(A.command(config,true).on,false);assert.equal(A.command(config,false).on,true);assert.equal(A.state(config,{arm:reading(false)},1000).visual,'partial');assert.equal(A.state(config,{trigger:reading(true)},1000).visual,'sounding');
});
test('confirmação expira30s sem retry e mudança de configuração cancela comando em fila',async()=>{
 const f=fixture();await f.c.refresh();await f.c.commandAlarm(true);f.advance(30001);assert.equal(f.c.alarmSnapshot().pending,false);assert.match(f.c.alarmSnapshot().message,/Comando sem confirmação/);assert.equal(f.requests.filter(r=>r.path.endsWith('/set/switch')).length,1);
 const g=fixture();await g.c.refresh();const task=g.c.commandAlarm(true);g.c.configure(auth,null);await assert.rejects(task);assert.ok(g.requests.every(r=>r.path.endsWith('/get')));
});
