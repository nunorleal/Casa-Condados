const test=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const G=require('../banner-core.js'),C=require('../label-layout-core.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../plans.js'),'utf8'),context);const plans=context.window.CasaPlans;
test('every room has a polygon, and all default label points lie inside',()=>{
 for(const plan of Object.values(plans))for(const room of plan.rooms)assert.ok(G.rectFits(G.polygons(room.area),room,.01,.01),room.id);
});
test('whole rectangle stays inside an L shaped room and stops at its notch',()=>{
 const room={area:'M0 0H400V100H100V400H0Z'},size={width:40,height:40};
 const p=C.constrain(room,{x:50,y:50},{x:300,y:300},size);
 assert.ok(G.rectFits(G.polygons(room.area),p,40,40));assert.ok(p.x<=80.01&&p.y<=80.01);
 assert.ok(!G.rectFits(G.polygons(room.area),{x:95,y:95},40,40));
});
test('moving very far never crosses the containing wall',()=>{
 for(const plan of Object.values(plans))for(const room of plan.rooms){
  const poly=G.polygons(room.area),size={width:30,height:25},start=G.nearestFit(poly,room,30,25);
  for(const target of [{x:-500,y:-500},{x:5000,y:5000},{x:5000,y:-500}])assert.ok(G.rectFits(poly,C.constrain(room,start,target,size),30,25),room.id);
 }
});
test('saved positions preserve floor identity and reject unknown or outside data',()=>{
 const p=C.positions({'3':{master:{x:220,y:390}},'4':{studio:{x:250,y:445}}},plans);
 assert.equal(p['3'].master.x,220);assert.equal(p['4'].studio.y,445);
 for(const value of [null,[],{'0':{}},{'3':{studio:{x:250,y:445}}},{'3':{master:{x:Infinity,y:300}}},{'3':{master:{x:900,y:1500}}},{'3':{master:{x:220,y:390,extra:1}}},{'4':{living2:{x:820,y:1100}}}])assert.throws(()=>C.positions(value,plans));
});

test('sensor positions only accept their associated rooms and backup keeps them separate',()=>{
 const B=require('../backup-core.js'),value={'3':{master:{x:220,y:390},living:{x:300,y:1200},'balcony-south':{x:300,y:1495}},'-1':{garage:{x:805,y:650}}};
 assert.deepEqual(JSON.parse(JSON.stringify(C.sensorPositions(value,plans))),value);
 for(const bad of [{'3':{bath1:{x:187,y:770}}},{'4':{studio:{x:250,y:445}}},{'3':{master:{x:900,y:1500}}}])assert.throws(()=>C.sensorPositions(bad,plans));
 const backup=B.create({sensorLayout:value,labelLayout:{'3':{master:{x:230,y:390}}}},plans);assert.deepEqual(JSON.parse(JSON.stringify(backup.data.sensorLayout)),value);assert.equal(backup.data.labelLayout['3'].master.x,230);assert.ok(!Object.hasOwn(B.create({showSensorReadings:true},plans).data,'sensorLayout'));
});

test('tamanho dos sensores valida limites e é opcional nos backups antigos',()=>{
 const B=require('../backup-core.js');for(const size of [60,100,160])assert.equal(B.create({sensorBannerScale:size},plans).data.sensorBannerScale,size);
 for(const size of [0,59,161,101,1.5,'100',null])assert.throws(()=>B.create({sensorBannerScale:size},plans));
 assert.ok(!Object.hasOwn(B.create({showSensorReadings:true},plans).data,'sensorBannerScale'));
});

test('posição arrastável do alarme fica só na garagem e acompanha o backup',()=>{const B=require('../backup-core.js'),value={'-1':{garage:{x:800,y:780}}};assert.deepEqual(JSON.parse(JSON.stringify(B.create({alarmLayout:value},plans).data.alarmLayout)),value);assert.throws(()=>C.alarmPositions({'3':{living:{x:300,y:1200}}},plans));assert.throws(()=>C.alarmPositions({'-1':{garage:{x:50,y:50}}},plans))});

test('tamanho dos banners de estores é validado e opcional nos backups antigos',()=>{const B=require('../backup-core.js');for(const v of [60,100,160]){assert.equal(C.blindScale(v),v);assert.equal(B.create({blindBannerScale:v},plans).data.blindBannerScale,v)}for(const v of [0,59,61,165,'60',null])assert.throws(()=>B.create({blindBannerScale:v},plans));assert.ok(!Object.hasOwn(B.create({showBlindBanners:true},plans).data,'blindBannerScale'));});

test('tamanho único e posição EV preservados no backup; importação antiga unifica tamanhos',()=>{
 const B=require('../backup-core.js');const original=B.create({bannerScale:125,showEVBanner:false,evLayout:{'-1':{garage:{x:775,y:925}}}},plans);assert.equal(original.data.bannerScale,125);assert.equal(original.data.showEVBanner,false);assert.equal(original.data.evLayout['-1'].garage.x,775);assert.throws(()=>B.create({bannerScale:163},plans));assert.throws(()=>B.create({evLayout:{'3':{living:{x:300,y:1200}}}},plans));const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};B.write(storage,B.create({sensorBannerScale:90,blindBannerScale:130},plans),plans);assert.equal(JSON.parse(map.get(B.KEYS.bannerScale)),90);B.write(storage,original,plans);assert.equal(JSON.parse(map.get(B.KEYS.bannerScale)),125);assert.equal(JSON.parse(map.get(B.KEYS.evLayout))['-1'].garage.y,925);
});
