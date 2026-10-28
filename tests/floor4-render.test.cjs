const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('../home-core.js'),R=require('../floor4-render.js');
test('sótão usa três imagens e só dois estores, sem criar estores Velux',()=>{
 assert.deepEqual(Object.keys(R.WINDOWS),['studio-west','living2-west']);const open=R.levels(C.defaults(),false),night=R.levels(C.defaults(),true),closed=R.levels({lights:{},blinds:{'studio-west':0,'living2-west':0}},true);
 for(const id of ['studio','living2','stairs4']){assert.equal(open.zones[id].natural,1);assert.equal(night.zones[id].natural,1);assert.equal(closed.zones[id].natural,0);assert.equal(closed.zones[id].electric,0)}
 for(const name of ['sotao-diurno-v1','sotao-estores-fechados-v1','sotao-noturno-abertos-v1'])assert.ok(R.markup().includes('assets/'+name+'.jpg'));
});
test('fechar estore escurece toda a divisão e escadas seguem a janela inferior',()=>{
 const s=R.levels({lights:{},blinds:{'studio-west':0,'living2-west':60}},false);assert.equal(s.zones.studio.natural,0);assert.equal(s.zones.living2.natural,.6);assert.equal(s.zones.stairs4.natural,.6);assert.equal(s.windows['studio-west'],0);
 const lit=R.levels({lights:{'4:studio':true},blinds:{'studio-west':0,'living2-west':100}},true);assert.equal(lit.zones.studio.electric,1);assert.equal(lit.zones.studio.natural,0);assert.equal(lit.windows['studio-west'],0);assert.equal(lit.zones.living2.electric,0);
});
test('recortes do sótão são disjuntos e cobrem a imagem inteira',()=>{
 const rects=Object.entries(R.PARTITIONS).flatMap(([id,rs])=>rs.map(r=>({...r,id})));let area=0;
 for(let i=0;i<rects.length;i++){const a=rects[i];area+=(a.x2-a.x1)*(a.y2-a.y1);for(let j=0;j<i;j++){const b=rects[j];assert.ok(Math.min(a.x2,b.x2)<=Math.max(a.x1,b.x1)||Math.min(a.y2,b.y2)<=Math.max(a.y1,b.y1),'sobreposição '+a.id+' / '+b.id)}}
 assert.equal(area,896*1190);assert.equal(R.regionAt(200,300),'studio');assert.equal(R.regionAt(400,900),'living2');assert.equal(R.regionAt(780,1000),'stairs4');assert.equal(R.regionAt(65,500),'window:studio-west');assert.equal(R.regionAt(65,750),'window:living2-west');
});
test('render atualiza opacidade inteira de dia e noite sem alterar a posição do estore',()=>{
 const nodes=new Map(),make=()=>({style:{},attrs:{},setAttribute(k,v){this.attrs[k]=String(v)}}),get=s=>{if(!nodes.has(s))nodes.set(s,[make(),make()]);return nodes.get(s)},svg={dataset:{floor4Render:'v1'},querySelectorAll:get,querySelector:s=>get(s)[0]},state={lights:{},blinds:{'studio-west':0,'living2-west':100}};
 for(const night of [false,true]){R.sync(svg,state,night);for(const e of get('[data-floor4-natural="studio"]'))assert.equal(e.attrs.opacity,'0');for(const e of get('[data-floor4-natural="living2"]'))assert.equal(e.attrs.opacity,'1');for(const e of get('[data-floor4-window="studio-west"]'))assert.equal(e.attrs.opacity,'0')}
 state.lights['4:studio']=true;R.sync(svg,state,true);for(const e of get('[data-floor4-electric="studio"]'))assert.equal(e.attrs.opacity,'1');assert.equal(state.blinds['studio-west'],0);
});

test('render elétrico fornecido acompanha noite, abertura parcial e luzes independentes',()=>{
 const s=C.defaults();s.lights['4:studio']=true;
 assert.equal(R.levels(s,false).zones.studio.electric,0);
 assert.equal(R.levels(s,true).zones.studio.electric,1);
 s.blinds['studio-west']=0;assert.equal(R.levels(s,false).zones.studio.electric,1);
 s.blinds['studio-west']=50;assert.equal(R.levels(s,false).zones.studio.electric,.5);
 assert.equal(R.levels(s,true).zones.living2.electric,0);
 s.lights['4:studio']=false;assert.equal(R.levels(s,true).zones.studio.electric,0);
 assert.ok(R.markup().includes('assets/sotao-luz-eletrica-v1.jpg'));
 assert.match(R.markup(),/data-floor4-electric="studio"[^>]*><use href="#floor4-source-electric"/);
});
