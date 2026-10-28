const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const C=require('../backup-core.js'),context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../plans.js'),'utf8'),context);const plans=context.window.CasaPlans;
const full={environment:{city:{name:'Figueira da Foz',latitude:40.15,longitude:-8.86,timezone:'Europe/Lisbon'},mode:'night'},showRoomLabels:false,showVelux:false,showBathroomFixtures:false,showEVBanner:false,screensaver:{seconds:0},labelLayout:{'3':{master:{x:220,y:390}}},meteo:{seconds:true,dim:25,nightPalette:'red'}};
function storage(initial={}){const values=new Map(Object.entries(initial));return {getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k),values}}
test('complete backup roundtrip preserves false, zero, positions and Meteo preferences',()=>{
 const b=C.validate(JSON.parse(JSON.stringify(C.create(full,plans))),plans);
 assert.equal(b.data.showEVBanner,false);assert.equal(b.data.showRoomLabels,false);assert.equal(b.data.showVelux,false);assert.equal(b.data.showBathroomFixtures,false);assert.equal(b.data.screensaver.seconds,0);assert.equal(b.data.labelLayout['3'].master.x,220);assert.equal(b.data.meteo.nightPalette,'red');
 const s=storage();C.write(s,b,plans);assert.equal(s.values.size,8);
});
test('partial imports keep absent preferences and all unrelated account keys',()=>{
 const s=storage({[C.KEYS.showRoomLabels]:'true',[C.KEYS.screensaver]:'{"seconds":120}','casa-nl-shelly-cloud-v1':'DO NOT CHANGE'});
 C.write(s,C.create({showVelux:false},plans),plans);
 assert.equal(s.getItem(C.KEYS.showVelux),'false');assert.equal(s.getItem(C.KEYS.showRoomLabels),'true');assert.equal(s.getItem(C.KEYS.screensaver),'{"seconds":120}');assert.equal(s.getItem('casa-nl-shelly-cloud-v1'),'DO NOT CHANGE');
});
test('reject other-house formats, unknown keys, secrets, invalid values and labels outside rooms',()=>{
 const base=C.create(full,plans);
 assert.throws(()=>C.validate({...base,format:'casa-nl-backup-v1'},plans));
 for(const data of [{},{showVelux:'false'},{showEVBanner:'false'},{showBathroomFixtures:'false'},{showRoomLabels:1},{screensaver:{seconds:7}},{environment:{city:{name:'X',latitude:91,longitude:0},mode:'auto'}},{environment:{city:null,mode:'broken'}},{labelLayout:{'4':{living2:{x:820,y:1100}}}},{meteo:{city:'X'}},{credentials:'secret'}])assert.throws(()=>C.validate({...base,data},plans));
 assert.throws(()=>C.validate({...base,authKey:'secret'},plans));
});
test('a failed storage write rolls back every changed preference',()=>{
 const s=storage({[C.KEYS.environment]:'old-environment',[C.KEYS.showRoomLabels]:'old-labels'}),set=s.setItem;let calls=0;
 s.setItem=(k,v)=>{if(++calls===2)throw Error('quota');set(k,v)};
 assert.throws(()=>C.write(s,C.create(full,plans),plans),/anteriores foram repostos/);
 assert.equal(s.getItem(C.KEYS.environment),'old-environment');assert.equal(s.getItem(C.KEYS.showRoomLabels),'old-labels');assert.equal(s.values.size,2);
});
