const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function fixture(){
 const listeners={},capture=new Set(),swipes=[];let cancelled=0,clock=0;
 const stage={addEventListener(name,fn){(listeners[name]??=[]).push(fn)},getBoundingClientRect:()=>({left:0,top:0,width:648,height:792}),classList:{toggle(){}},setPointerCapture:id=>capture.add(id),hasPointerCapture:id=>capture.has(id),releasePointerCapture:id=>capture.delete(id)};
 const svg={dataset:{},box:'35 70 870 1228',getAttribute(){return this.box},setAttribute(k,v){this.box=v}};
 const context={window:{CasaLabelLayout:{cancel(){cancelled++}}},document:{getElementById:()=>stage,querySelector:()=>null,addEventListener(){}},performance:{now:()=>clock}};
 context.window.addEventListener=()=>{};vm.createContext(context);
 for(const file of ['plan-view-core.js','plan-view.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../'+file),'utf8'),context);
 const api=context.window.CasaPlanView;api.configure({onChange(){},onSwipe:d=>swipes.push(d)});api.reset(svg);
 const event=(x,y,id=1,label=false)=>({clientX:x,clientY:y,pointerId:id,pointerType:'touch',button:0,target:{closest:()=>label},preventDefault(){this.prevented=true},stopPropagation(){},stopImmediatePropagation(){this.stopped=true}});
 const fire=(type,e)=>{for(const fn of listeners[type]||[])fn(e);return e};
 return {api,svg,stage,fire,event,swipes,cancelled:()=>cancelled,advance:()=>{clock+=1000},box:()=>svg.box.split(' ').map(Number)};
}
test('two-finger zoom cancels label drag, consumes remaining finger and resets for next floor',()=>{
 const f=fixture(),initial=f.box();
 f.fire('pointerdown',f.event(100,100,1,true));f.fire('pointerdown',f.event(200,100,2));
 assert.equal(f.cancelled(),1);
 // Losing the old label capture must not remove a finger from the pinch gesture.
 f.fire('lostpointercapture',f.event(100,100,1,true));
 f.fire('pointermove',f.event(300,100,2));assert.ok(Math.abs(initial[2]/f.box()[2]-2)<1e-9);
 f.fire('pointerup',f.event(100,100,1));f.fire('pointermove',f.event(300,500,2));f.fire('pointerup',f.event(300,500,2));
 assert.equal(f.swipes.length,0);assert.equal(f.api.isInteracting(),false);
 const click=f.fire('click',{preventDefault(){this.prevented=true},stopImmediatePropagation(){}});assert.equal(click.prevented,true);
 const next={...f.svg,dataset:{},box:'45 430 910 830'};f.api.reset(next);
 assert.equal(next.box,contextFit('45 430 910 830'));assert.ok(next.box!==f.svg.box);
});
function contextFit(box){const C=require('../plan-view-core.js'),v=box.split(' ').map(Number),b=C.fit({x:v[0],y:v[1],width:v[2],height:v[3]},648,792);return `${b.x} ${b.y} ${b.width} ${b.height}`}
test('one finger swipes at fit; after zoom the same gesture pans without changing floor',()=>{
 const f=fixture();f.fire('pointerdown',f.event(300,400));f.fire('pointerup',f.event(300,200));assert.deepEqual(f.swipes,[1]);f.advance();
 f.fire('keydown',{key:'+',altKey:false,target:{closest:()=>false},preventDefault(){},stopPropagation(){}});
 const before=f.box();f.fire('pointerdown',f.event(300,400));f.fire('pointermove',f.event(280,350));f.fire('pointerup',f.event(280,350));
 assert.equal(f.swipes.length,1);assert.ok(f.box()[0]!==before[0]||f.box()[1]!==before[1]);
});
test('toque no banner do estore mantém clique e dois dedos ainda ampliam',()=>{
 const f=fixture(),e=f.event(100,100);e.target.closest=selector=>selector.includes('.blind-banner');
 f.fire('pointerdown',e);assert.equal(f.stage.hasPointerCapture(1),false);f.fire('pointerup',e);
 const click=f.fire('click',{preventDefault(){this.prevented=true},stopImmediatePropagation(){}});assert.notEqual(click.prevented,true);assert.deepEqual(f.swipes,[]);
 const first=f.event(100,100);first.target.closest=selector=>selector.includes('.blind-window');f.fire('pointerdown',first);f.fire('pointerdown',f.event(200,100,2));assert.equal(f.cancelled(),1);
});
