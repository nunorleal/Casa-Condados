const {test}=require('node:test'),assert=require('node:assert/strict'),R=require('../cloud-read-core.js'),H=require('../home-core.js'),B=require('../backup-core.js'),G=require('../garage-render.js');
const auth={server:'https://shelly-fixture.shelly.cloud',authKey:'FAKE-KEY'},gate={deviceId:'XB12345678901236',channel:0,source:'blu'},entrance={...gate,deviceId:'XB12345678901234'},plans={'3':{rooms:[]},'-1':{rooms:[]}};
test('portão opcional preserva ID BLU e backup, recusa contacto repetido com entrada',()=>{
 const old={server:auth.server,lights:{},blinds:{}},setup={...old,entranceContact:entrance,gateContact:gate};
 assert.ok(!Object.hasOwn(H.setup(old,plans),'gateContact'));assert.deepEqual(H.setup(setup,plans).gateContact,gate);assert.throws(()=>H.setup({...setup,gateContact:entrance},plans));assert.equal(H.setup({...setup,gateContact:null},plans).gateContact,null);
 const data=new Map([[B.KEYS.shellySetup,JSON.stringify(setup)]]),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 B.write(storage,B.create({shellySetup:old},plans),plans);assert.deepEqual(JSON.parse(data.get(B.KEYS.shellySetup)).gateContact,gate);
 B.write(storage,B.create({shellySetup:{...old,gateContact:null}},plans),plans);assert.equal(JSON.parse(data.get(B.KEYS.shellySetup)).gateContact,null);
});
test('contactos independentes na mesma consulta apenas de leitura e frescura estrita',async()=>{
 let now=100000,open=true,online=1,fail=false,calls=[];
 const c=R.create({now:()=>now,sleep:async()=>{},fetch:async(url,opts)=>{calls.push({url,opts});if(fail)throw new TypeError('FAKE-KEY');return {status:200,json:async()=>[{id:entrance.deviceId,online:1,status:{'window:0':{open:false}}},{id:gate.deviceId,online,status:{'window:0':{open}}}]}}});
 c.configure(auth,null,null,entrance,null,null,null,null,gate);assert.equal(c.gateSnapshot().open,null);await c.refresh();assert.equal(c.gateSnapshot().open,true);assert.equal(c.doorSnapshot().open,false);assert.equal(c.gateSnapshot().caption,'Aberto');
 assert.deepEqual(JSON.parse(calls[0].opts.body).ids,[entrance.deviceId,gate.deviceId]);assert.equal(new URL(calls[0].url).pathname,'/v2/devices/api/get');assert.equal(calls[0].opts.method,'POST');assert.ok(!JSON.stringify(c.gateSnapshot()).includes('FAKE-KEY'));assert.ok(!JSON.stringify(c.gateSnapshot()).includes(gate.deviceId));
 now+=45001;assert.equal(c.gateSnapshot().open,null);await c.refresh();assert.equal(c.gateSnapshot().open,true);open=false;await c.refresh();assert.equal(c.gateSnapshot().open,false);assert.equal(c.gateSnapshot().caption,'Fechado');online=0;await c.refresh();assert.equal(c.gateSnapshot().open,null);online=1;await c.refresh();fail=true;await c.refresh();assert.equal(c.gateSnapshot().open,null);assert.ok(!c.gateSnapshot().error.includes('FAKE-KEY'));
 c.configure(auth,null);assert.equal(c.gateSnapshot().configured,false);assert.equal(c.gateSnapshot().open,null);
});
test('addon aparece só com true, com recurso local e sem modificar o carro',()=>{
 const image={style:{}},svg={querySelector:()=>image};for(const value of [false,null,undefined]){G.setGate(svg,value);assert.equal(image.style.display,'none')}G.setGate(svg,true);assert.equal(image.style.display,'');assert.match(G.markup(),/assets\/portao-garagem-aberto-v1.png/);assert.match(G.markup(),/x="320" y="870" width="545" height="330"/);
});
