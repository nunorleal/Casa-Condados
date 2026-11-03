const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('../cats-core.js');
test('each floor has its own routes through connected rooms and 30-second cycles',()=>{assert.equal(C.forFloor('-1'),null);for(const floor of ['3','4']){const c=C.forFloor(floor);for(const [room,targets]of Object.entries(c.neighbours))for(const target of targets){const j=c.journey(c.anchors[room],c.anchors[target]);assert(j.duration<c.CYCLE);assert.equal(c.CYCLE,30000);const end=c.sample(j,30000);assert.equal(end.room,target);assert.equal(end.walking,false);assert.equal(end.x,c.nodes[c.anchors[target]].x);for(let i=1;i<j.path.length;i++)assert(c.edges.some(([a,b])=>[a,b].includes(j.path[i-1].id)&&[a,b].includes(j.path[i].id)))}}});
test('floor-specific centre lines avoid solid walls and furniture with clearance',()=>{const obstacles={'3':[[70,230,245,350],[295,136,309,445],[370,375,550,438],[618,410,633,462],[340,887,455,1033],[550,212,602,345],[50,660,399,725]],'4':[[315,225,405,505],[205,330,275,410],[80,575,285,635],[50,638,296,657],[375,638,858,657],[721,777,842,1147]]};for(const floor of ['3','4']){const c=C.forFloor(floor);for(const [a,b]of c.edges){const j=c.journey(a,b);for(let t=0;t<=j.duration;t+=40){const p=c.sample(j,t);for(const [x1,y1,x2,y2]of obstacles[floor])assert(!(p.x>x1-12&&p.x<x2+12&&p.y>y1-12&&p.y<y2+12),floor+': '+a+'→'+b+' '+p.x+','+p.y)}}}});

test('independent allocation allows both cats together on either floor or separated without duplicates',()=>{
 const seen=new Set();for(const first of [0,.8])for(const second of [0,.8]){let calls=0;const values=[first,second],a=C.distribute(()=>values[calls++]);assert.equal(calls,2);assert.deepEqual([...a['3'],...a['4']].sort(),['vasco','zeca']);seen.add(JSON.stringify(a));}assert.equal(seen.size,4);
});
test('allocation stays unique while visiting floors and sampling routes',()=>{
 const a=C.distribute(()=>.8),before=JSON.stringify(a);for(const floor of ['3','4','3','4'])for(const id of a[floor]){const c=C.forFloor(floor),[from,to]=c.starts[id==='zeca'?1:0];c.sample(c.journey(c.anchors[from],c.anchors[to]),12000)}assert.equal(JSON.stringify(a),before);
});

test('wandering explores every destination instead of shuttling between two anchors',()=>{
 for(const floor of ['3','4'])for(const random of [()=>0,()=>.5,()=>.999999]){
  const c=C.forFloor(floor),visits={},seen=new Set();let from=c.destinations[0],previous=null;visits[from]=1;seen.add(from);
  for(let n=0;n<c.destinations.length*2;n++){
   const to=c.wander(from,visits,previous,random);assert.notEqual(to,from);assert.notEqual(to,previous);
   const j=c.journey(from,to),end=c.sample(j,C.CYCLE);assert.ok(Math.abs(end.x-c.nodes[to].x)<1e-8);assert.ok(Math.abs(end.y-c.nodes[to].y)<1e-8);
   seen.add(to);visits[to]=(visits[to]||0)+1;previous=from;from=to;
  }
  assert.deepEqual([...seen].sort(),[...c.destinations].sort());
 }
});

test('cat brightness follows room darkness and electric light, including closed blinds by day',()=>{
 assert.equal(C.shade(0,0),1);assert.ok(Math.abs(C.shade(.86,0)-.22)<1e-8);assert.equal(C.shade(.86,1),1);
 assert.ok(C.shade(.4,0)<C.shade(.2,0));assert.ok(C.shade(.86,.6)>C.shade(.86,0));assert.equal(C.shade(-1,0),1);assert.ok(C.shade(2,0)>=.21);assert.ok(Number.isFinite(C.shade(undefined,undefined)));
});

test('Hall/Entrance doorway seam never clips the walking cat or extends onto jambs',()=>{
 const G=require('../banner-core.js'),R=require('../floor3-render.js'),polys=Object.values(R.ZONES).flatMap(d=>G.polygons(d)),bridges=C.PASSAGES['3'].map(r=>[[r.x,r.y],[r.x+r.width,r.y],[r.x+r.width,r.y+r.height],[r.x,r.y+r.height]]),covered=(p,shapes)=>shapes.some(poly=>G.rectFits([poly],p,.1,.1));
 assert.equal(covered({x:570,y:561},polys),false);
 for(let y=552;y<=570;y++)for(let x=557;x<=583;x++)assert.ok(covered({x,y},[...polys,...bridges]));
 for(const x of [540,603,618])assert.equal(covered({x,y:561},bridges),false);assert.deepEqual(C.PASSAGES['4'],[]);
});

 test('cat shade follows the actual render mixtures, including darkness with shutters closed and electric lights',()=>{
 const H=require('../home-core.js'),R4=require('../floor4-render.js'),R3=require('../floor3-render.js');
 for(const night of [false,true])for(const on of [false,true])for(const opening of [0,50,100]){
 const state={lights:{'4:living2':on},blinds:{'living2-west':opening,'studio-west':100}};
 const levels=R4.levels(state,night),shade=C.renderShade(levels,'living2',{y:950},night);
 if(!on&&opening===0)assert.equal(shade,.16);
 if(on&&opening===0)assert.equal(shade,.95);
 assert.ok(shade>=.16&&shade<=1);
 }
 const state=H.defaults();state.blinds['kitchen-west']=100;state.blinds['living-south-left']=0;state.blinds['living-south-right']=0;
 const levels=R3.levels(state,false,[{id:'kitchen'},{id:'living'}]);
 assert.ok(C.renderShade(levels,'kitchen',{y:660},false)>C.renderShade(levels,'living',{y:1132},false));
 assert.equal(C.renderShade(null,'living',null,false),.16);
 });
 test('coat, stripes and facial colors darken directly without depending on an SVG CSS brightness filter',()=>{
 for(const id of ['vasco','zeca']){const dark=C.palette(id,.16),lit=C.palette(id,1);for(const key of Object.keys(lit)){assert.notEqual(dark[key],lit[key]);for(let i=1;i<7;i+=2)assert.ok(parseInt(dark[key].slice(i,i+2),16)<=parseInt(lit[key].slice(i,i+2),16))}}
 });

 test('dark coats use direct colors and eye blinking is isolated to dark rooms',()=>{
 const fs=require('node:fs'),path=require('node:path'),css=fs.readFileSync(path.join(__dirname,'../cats.css'),'utf8'),js=fs.readFileSync(path.join(__dirname,'../cats.js'),'utf8');
 assert.ok(!css.includes('filter:brightness(var(--shade))'));
 assert.match(css,/\.house-cat\.cat-dark \.cat-eyes\{fill:#d4ff8c/);
 assert.match(css,/@keyframes cat-eye-blink/);assert.ok(css.includes('scaleY(.06)'));assert.ok(css.includes('animation-delay:-1.7s'));assert.ok(css.includes('prefers-reduced-motion:reduce'));
 assert.ok(js.includes('CORE.palette(cat.id,shade)'));
 for(const id of ['vasco','zeca']){const dark=C.palette(id,.22),lit=C.palette(id,1);assert.notEqual(dark.fur,lit.fur);assert.notEqual(dark.eye,lit.eye)}
 });

 test('lighting detection rejects the wrong room instead of accepting an undersized probe within area tolerance',()=>{
 const G=require('../banner-core.js'),fs=require('node:fs'),path=require('node:path'),polygons=G.polygons('M0 0H100V100H0Z');
 assert.equal(G.rectFits(polygons,{x:50,y:50},1,1),true);
 assert.equal(G.rectFits(polygons,{x:250,y:250},1,1),false);
 const js=fs.readFileSync(path.join(__dirname,'../cats.js'),'utf8');assert.ok(js.includes('cat.point,1,1'));assert.ok(!js.includes('cat.point,.1,.1'));
 });

 test('Condados detects the lower room separately from the studio at cat positions',()=>{
 const G=require('../banner-core.js'),R=require('../floor4-render.js');for(const [point,expected]of [[{x:280,y:170},'studio'],[{x:400,y:950},'living2']]){const found=Object.entries(R.ZONES).find(([id,d])=>G.rectFits(G.polygons(d),point,1,1));assert.equal(found?.[0],expected)}
 });
