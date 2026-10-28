const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('../blind-core.js'),R=require('../cloud-read-core.js');
const auth={server:'https://shelly-fixture.shelly.cloud',authKey:'FAKE-KEY'},b={deviceId:'aabbcc112233',channel:0,type:'cover'},id='master-north';
function fixture(){let time=100000,position=40,state='stopped',online=1,calibrated=true,fail=false,reject=false,requests=[];
 const c=R.create({now:()=>time,sleep:async ms=>{time+=ms},fetch:async(url,opts)=>{const path=new URL(url).pathname,body=JSON.parse(opts.body);requests.push({path,body});if(fail)throw new TypeError('FAKE-KEY');if(path.endsWith('set/cover'))return {status:200,json:async()=>reject?{error:'FAKE-KEY'}:{}};assert.ok(path.endsWith('/get'));assert.ok(body.ids.length<=10);return {status:200,json:async()=>[{id:b.deviceId,online,status:{'cover:0':{current_pos:position,state,pos_control:calibrated}}}]}}});
 const configure=(binding=b)=>c.configure(auth,null,null,null,null,null,null,null,null,binding?{[id]:binding}:{});configure();
 return {c,requests,configure,advance:n=>time+=n,position:(v,s='stopped')=>{position=v;state=s},offline:()=>online=0,uncalibrated:()=>calibrated=false,fail:()=>fail=true,reject:()=>reject=true};
}
test('Gen1 e Gen2 usam apenas canal exato, posição válida e erros explícitos',()=>{
 for(const component of [{'cover:0':{current_pos:25,state:'opening',pos_control:true}},{rollers:[{current_pos:25,state:'open',positioning:true}]}]){const r=C.status({online:1,status:component},b);assert.equal(r.position,25);assert.equal(r.state,'opening');assert.equal(C.state(b,{...r,fetchedAt:1000},1000).canPosition,true)}
 for(const position of [undefined,null,-1,101,'25'])assert.equal(C.status({online:1,status:{'cover:0':{current_pos:position}}},b).position,null);
 assert.equal(C.status({online:1,status:{'cover:1':{current_pos:50}}},b).hasCover,false);
 const r=C.status({online:1,status:{'cover:0':{current_pos:20,errors:['overtemperature']}}},b);assert.equal(C.canControl({...r,fetchedAt:1000},'open',1000),false);assert.equal(C.canControl({...r,fetchedAt:1000},'stop',1000),true);
 assert.deepEqual(C.command(b,55),{id:b.deviceId,channel:0,position:55});for(const target of [-1,101,NaN,'toggle','50'])assert.throws(()=>C.command(b,target));
});
test('configurar/consultar nunca comanda, e HTTP200 não muda posição reportada',async()=>{
 const f=fixture();assert.equal(f.requests.length,0);assert.equal(f.c.blindSnapshot(id).position,null);await f.c.refresh();assert.equal(f.c.blindSnapshot(id).position,40);assert.ok(f.requests.every(r=>r.path.endsWith('/get')));
 await f.c.commandBlind(id,80);assert.deepEqual(f.requests.find(r=>r.path.endsWith('set/cover')).body,{id:b.deviceId,channel:0,position:80});assert.equal(f.c.blindSnapshot(id).position,40);assert.equal(f.c.blindSnapshot(id).pending,true);
 f.position(62,'opening');await f.c.refresh();assert.equal(f.c.blindSnapshot(id).position,62);assert.equal(f.c.blindSnapshot(id).moving,true);assert.equal(f.c.blindSnapshot(id).pending,false);
 f.position(80);await f.c.refresh();assert.equal(f.c.blindSnapshot(id).position,80);assert.equal(f.c.blindSnapshot(id).pending,false);assert.match(f.c.blindSnapshot(id).message,/confirmada/);assert.ok(!JSON.stringify(f.c.blindSnapshot(id)).includes('FAKE-KEY'));
});
test('movimento pendente admite parar, confirma só por leitura e expira60s sem repetir',async()=>{
 const f=fixture();await f.c.refresh();await f.c.commandBlind(id,'open');f.position(60,'opening');await assert.rejects(f.c.commandBlind(id,'close'));await f.c.refresh();await f.c.commandBlind(id,'stop');assert.equal(f.c.blindSnapshot(id).pending,true);f.position(60);await f.c.refresh();assert.equal(f.c.blindSnapshot(id).pending,false);
 await f.c.commandBlind(id,'open');const sent=f.requests.filter(r=>r.path.endsWith('set/cover')).length;f.advance(60001);assert.equal(f.c.blindSnapshot(id).pending,false);assert.match(f.c.blindSnapshot(id).message,/Comando sem confirmação/);assert.equal(f.requests.filter(r=>r.path.endsWith('set/cover')).length,sent);
});
test('offline/stale/sem consulta/configuração suja bloqueiam, sem inventar posições',async()=>{
 const f=fixture();await assert.rejects(f.c.commandBlind(id,'open'));await f.c.refresh();await assert.rejects(f.c.commandBlind(id,'open',{isCurrent:()=>false}));f.advance(45001);assert.equal(f.c.blindSnapshot(id).position,null);assert.equal(f.c.blindSnapshot(id).lastPosition,40);await assert.rejects(f.c.commandBlind(id,'open'));await f.c.refresh();f.offline();await f.c.refresh();assert.equal(f.c.blindSnapshot(id).position,null);await assert.rejects(f.c.commandBlind(id,'stop'));assert.ok(f.requests.every(r=>r.path.endsWith('/get')));
});
test('posição exige calibração compatível; abrir/fechar explícitos continuam possíveis',async()=>{
 const f=fixture();f.uncalibrated();await f.c.refresh();assert.equal(f.c.blindSnapshot(id).canPosition,false);assert.equal(f.c.blindSnapshot(id).canControl,true);await assert.rejects(f.c.commandBlind(id,70));await f.c.commandBlind(id,'close');assert.equal(f.requests.filter(r=>r.path.endsWith('set/cover')).length,1);
});
test('recusa de comando nunca repete nem mostra estado otimista ou segredo',async()=>{
 const f=fixture();await f.c.refresh();f.reject();await assert.rejects(f.c.commandBlind(id,'open'),/recusou/);assert.equal(f.requests.filter(r=>r.path.endsWith('set/cover')).length,1);assert.equal(f.c.blindSnapshot(id).pending,false);assert.equal(f.c.blindSnapshot(id).position,null);assert.ok(!JSON.stringify(f.c.blindSnapshot(id)).includes('FAKE-KEY'));
 const g=fixture();await g.c.refresh();g.fail();await assert.rejects(g.c.commandBlind(id,'open'),e=>!e.message.includes('FAKE-KEY'));assert.equal(g.requests.filter(r=>r.path.endsWith('set/cover')).length,1);
});
test('alteração de associação cancela comando em fila antes de enviar',async()=>{
 const f=fixture();await f.c.refresh();const pending=f.c.commandBlind(id,'open');f.configure(null);await assert.rejects(pending);assert.ok(f.requests.every(r=>r.path.endsWith('/get')));
});
test('consultas com vários estores/sensores são deduplicadas e divididas até dez IDs',async()=>{
 const batches=[],bindings=Object.fromEntries(Array.from({length:9},(_,i)=>['blind'+i,{deviceId:(i+1).toString(16).padStart(6,'0'),channel:0,type:'cover'}]));
 const c=R.create({sleep:async()=>{},fetch:async(url,opts)=>{const ids=JSON.parse(opts.body).ids;batches.push(ids);return {status:200,json:async()=>ids.map(id=>({id,online:1,status:{'cover:0':{current_pos:30,state:'stopped',pos_control:true}}}))}}});
 c.configure(auth,null,null,null,{deviceId:'aabb01',channel:0},{deviceId:'aabb02',channel:0},{deviceId:'aabb03',channel:0},null,null,bindings);await c.refresh();assert.deepEqual(batches.map(b=>b.length),[10,2]);assert.equal(c.blindSnapshot('blind8').position,30);
});

test('429 no comando respeita Retry-After e não repete o comando',async()=>{
 let now=100000,gets=0,commands=0;const c=R.create({now:()=>now,sleep:async()=>{},fetch:async(url)=>{if(new URL(url).pathname.endsWith('/set/cover')){commands++;return {status:429,headers:{get:()=> '120'}}}gets++;return {status:200,json:async()=>[{id:b.deviceId,online:1,status:{'cover:0':{current_pos:30,state:'stopped',pos_control:true}}}]}}});
 c.configure(auth,null,null,null,null,null,null,null,null,{[id]:b});await c.refresh();await assert.rejects(c.commandBlind(id,'open'),/Limite/);now+=30000;await c.refresh({manual:true});assert.equal(gets,1);assert.equal(commands,1);now+=90001;await c.refresh();assert.equal(gets,2);assert.equal(commands,1);
});

test('Gen2 open/closed são posições finais; estado ausente não confirma paragem',()=>{
 for(const state of ['open','closed']){const r=C.status({online:1,status:{'cover:0':{state,current_pos:state==='open'?100:0}}},b);assert.equal(r.state,state);assert.equal(r.moving,false)}
 const unknown=C.status({online:1,status:{'cover:0':{current_pos:50}}},b);assert.equal(unknown.moving,null);
});
