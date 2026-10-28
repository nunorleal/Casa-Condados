const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../home-core.js'),R=require('../floor3-render.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../plans.js'),'utf8'),ctx);const rooms=ctx.window.CasaPlans['3'].rooms;
test('três estados extremos usam imagens originais e todas as zonas têm recorte',()=>{
 const open=R.levels(C.defaults(),false,rooms),closed=R.levels({lights:{},blinds:Object.fromEntries(Object.keys(R.WINDOWS).map(id=>[id,0]))},false,rooms),night=R.levels(C.defaults(),true,rooms);
 assert.equal(open.ambient,1);assert.equal(closed.ambient,0);assert.equal(night.night,true);
 for(const room of rooms){assert.ok(R.ZONES[room.id],room.id);assert.equal(open.zones[room.id].natural,1);assert.equal(closed.zones[room.id].natural,room.id.startsWith('balcony')?1:0);assert.equal(night.zones[room.id].natural,room.id.startsWith('balcony')?0:1);assert.equal(closed.zones[room.id].electric,0)}
 for(const n of ['piso3-diurno-v1','piso3-estores-fechados-v1','piso3-noturno-abertos-v1'])assert.ok(R.markup().includes('assets/'+n+'.jpg'));
});
test('recortes respeitam estores independentes e dependências do hall, WC e escadas',()=>{
 const state={lights:{},blinds:Object.fromEntries(Object.keys(R.WINDOWS).map(id=>[id,0]))};state.blinds['master-north']=100;state.blinds['living-south-right']=60;
 const s=R.levels(state,false,rooms);assert.equal(s.zones.master.natural,1);assert.equal(s.zones.bedroom2.natural,0);assert.equal(s.zones.bedroom3.natural,0);assert.ok(Math.abs(s.zones.hall.natural-1/3)<1e-12);assert.ok(Math.abs(s.zones.bath2.natural-1/3)<1e-12);assert.equal(s.zones.entrance.natural,.2);assert.equal(s.zones.stairs3.natural,.2);assert.equal(s.zones.living.natural,.2);assert.equal(s.windows['living-south-left'],0);assert.equal(s.windows['living-south-right'],.6);
});
test('luz elétrica de uma divisão não abre estores nem ilumina outras divisões',()=>{
 const state={lights:{'3:master':true},blinds:Object.fromEntries(Object.keys(R.WINDOWS).map(id=>[id,0]))};const s=R.levels(state,true,rooms);assert.equal(s.zones.master.electric,1);assert.equal(s.zones.master.natural,0);assert.equal(s.windows['master-north'],0);assert.equal(s.zones.bedroom2.electric,0);assert.equal(s.zones.hall.electric,0);
});
test('recortes cobrem a imagem sem sobreposições que deixem luz de outra divisão passar',()=>{
 const rects=Object.entries(R.PARTITIONS).flatMap(([id,rs])=>rs.map(r=>({...r,id})));let area=0;
 for(let i=0;i<rects.length;i++){const a=rects[i];area+=(a.x2-a.x1)*(a.y2-a.y1);for(let j=0;j<i;j++){const b=rects[j];assert.ok(Math.min(a.x2,b.x2)<=Math.max(a.x1,b.x1)||Math.min(a.y2,b.y2)<=Math.max(a.y1,b.y1),'sobreposição '+a.id+' / '+b.id)}}
 assert.equal(area,816*1280);assert.equal(R.regionAt(150,250),'master');assert.equal(R.regionAt(430,260),'bedroom2');assert.equal(R.regionAt(650,260),'bedroom3');assert.equal(R.regionAt(160,130),'window:master-north');assert.equal(R.regionAt(600,420),'hall');assert.equal(R.regionAt(650,420),'bedroom3');
});
test('fechar suite remove a camada clara inteira em ambos os períodos, não só a janela',()=>{
 const nodes=new Map(),make=()=>({style:{},attrs:{},setAttribute(k,v){this.attrs[k]=String(v)}}),get=s=>{if(!nodes.has(s))nodes.set(s,[make(),make()]);return nodes.get(s)};
 const svg={dataset:{floor3Render:'v1'},querySelectorAll:get,querySelector:s=>get(s)[0]},state=C.defaults();state.blinds['master-north']=0;
 for(const night of [false,true]){R.sync(svg,state,night,rooms);for(const e of get('[data-floor3-natural="master"]'))assert.equal(e.attrs.opacity,'0');for(const e of get('[data-floor3-window="master-north"]'))assert.equal(e.attrs.opacity,'0');for(const e of get('[data-floor3-natural="bedroom2"]'))assert.equal(e.attrs.opacity,'1');for(const e of get('[data-floor3-electric="master"]'))assert.equal(e.attrs.opacity,'0')}
 state.lights['3:master']=true;R.sync(svg,state,true,rooms);for(const e of get('[data-floor3-electric="master"]'))assert.equal(e.attrs.opacity,'1');for(const e of get('[data-floor3-window="master-north"]'))assert.equal(e.attrs.opacity,'0');
});

test('varandas de noite não recebem luz dos estores e cada luz só ilumina a respetiva varanda',()=>{
 const state=C.defaults(),dark=R.levels(state,true,rooms);for(const id of ['balcony-north','balcony-south']){assert.equal(dark.zones[id].natural,0);assert.equal(dark.zones[id].electric,0)}
 state.lights['3:balcony-south']=true;const lit=R.levels(state,true,rooms);assert.equal(lit.zones['balcony-south'].electric,1);assert.equal(lit.zones['balcony-south'].natural,0);assert.equal(lit.zones['balcony-north'].electric,0);assert.equal(lit.zones['balcony-north'].natural,0);assert.equal(lit.windows['living-south-left'],1);
 const day=R.levels(C.defaults(),false,rooms);assert.equal(day.zones['balcony-north'].natural,1);assert.equal(day.zones['balcony-south'].natural,1);
});

 test('render elétrico fornecido substitui o diurno só com luz e falta de luz natural',()=>{
 const s=C.defaults();s.lights['3:master']=true;
 assert.equal(R.levels(s,false,rooms).zones.master.electric,0);
 assert.equal(R.levels(s,true,rooms).zones.master.electric,1);
 s.blinds['master-north']=0;assert.equal(R.levels(s,false,rooms).zones.master.electric,1);
 s.blinds['master-north']=50;assert.equal(R.levels(s,false,rooms).zones.master.electric,.5);
 s.lights['3:master']=false;assert.equal(R.levels(s,true,rooms).zones.master.electric,0);
 assert.ok(R.markup().includes('assets/piso3-luz-eletrica-v1.jpg'));
 assert.match(R.markup(),/data-floor3-electric="master"[^>]*><rect[^>]*fill="white"/);assert.match(R.markup(),/<g mask="url\(#floor3-electric-feather\)"><use href="#floor3-source-electric"/);
 });

test('zona aberta partilha luz com transição gradual e sem corte entre cozinha e sala',()=>{
 const s=C.defaults();s.blinds['kitchen-west']=0;let l=R.levels(s,false,rooms);
 assert.equal(l.openPlan.top,.55);assert.equal(l.openPlan.bottom,.95);assert.ok(Math.abs(l.zones.entrance.natural-2/3)<1e-12);assert.ok(Math.abs(l.zones.bath3.natural-2/3)<1e-12);assert.ok(Math.abs(l.zones.stairs3.natural-2/3)<1e-12);
 s.blinds['living-south-left']=0;s.blinds['living-south-right']=0;
 for(const night of [false,true]){l=R.levels(s,night,rooms);assert.equal(l.openPlan.top,0);assert.equal(l.openPlan.bottom,0);assert.equal(l.zones.kitchen.natural,0);assert.equal(l.zones.entrance.natural,0)}
 s.blinds['kitchen-west']=100;l=R.levels(s,false,rooms);assert.equal(l.openPlan.top,.45);assert.equal(l.openPlan.bottom,.05);assert.ok(Math.abs(l.zones.stairs3.natural-1/3)<1e-12);
 s.blinds['living-south-left']=100;s.blinds['living-south-right']=100;l=R.levels(s,false,rooms);assert.equal(l.openPlan.top,1);assert.equal(l.openPlan.bottom,1);
 assert.match(R.markup(),/data-floor3-natural="kitchen"/);assert.equal((R.markup().match(/mask="url\(#floor3-openplan-mask\)"/g)||[]).length,3);
});

test('remate do armário do quarto do Gui acompanha só esse quarto',()=>{
 assert.equal(R.regionAt(535,430),'bedroom2');assert.equal(R.regionAt(540,448),'hall');assert.equal(R.regionAt(560,460),'hall');
 const s=C.defaults();s.blinds['bedroom2-north']=0;for(const night of [false,true])assert.equal(R.levels(s,night,rooms).zones.bedroom2.natural,0);
 s.blinds['bedroom2-north']=100;assert.equal(R.levels(s,false,rooms).zones.bedroom2.natural,1);
});

 test('escada partilha o gradiente da mesa de jantar e a iluminação elétrica da sala',()=>{const s=C.defaults();for(const night of [false,true])for(const on of [false,true]){s.lights['3:living']=on;s.blinds['kitchen-west']=0;s.blinds['living-south-left']=25;s.blinds['living-south-right']=80;const l=R.levels(s,night,rooms);assert.deepEqual(l.zones.stairs3,l.zones.living)}assert.match(R.markup(),/clip-path="url\(#floor3-region-stairs3\)" mask="url\(#floor3-openplan-mask\)"/)});
