const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../home.js'),'utf8');
function fixture(){
 const control={id:'window'},stage={contains:t=>t.inside!==false},overlay={},matrix={a:.5,b:0,c:0,d:.5,e:80,f:120,inverse(){return {a:2,b:0,c:0,d:2,e:-160,f:-240}}};
 class DOMPoint{constructor(x,y){this.x=x;this.y=y}matrixTransform(m){return {x:this.x*m.a+this.y*m.c+m.e,y:this.x*m.b+this.y*m.d+m.f}}}
 const current={svg:{getScreenCTM:()=>matrix},hits:new Map([['window',{x:100,y:200,width:120,height:18,control}]])};
 const context={current,windowControls:overlay,$:()=>stage,DOMPoint,Math};vm.createContext(context);
 vm.runInContext(source.slice(source.indexOf(' function blindTarget(event)'),source.indexOf(" $('plan-stage').addEventListener('click'"))+';this.resolve=blindTarget',context);
 const event=(x,y,exclude=false,inside=true)=>({clientX:x,clientY:y,target:{inside,closest:s=>s==='#plan-canvas'?{}:exclude&&s.startsWith('button')?{}:null}});
 return {resolve:context.resolve,event,control};
}
test('SVG bar coordinates resolve even when the transparent HTML button receives no click',()=>{
 const f=fixture();assert.equal(f.resolve(f.event(160,224.5)),f.control);
 assert.equal(f.resolve(f.event(160,245)),f.control); // minimum touch padding
 assert.equal(f.resolve(f.event(160,260)),null);
});
test('fallback never takes a device button, room label or a target outside the plan',()=>{
 const f=fixture();assert.equal(f.resolve(f.event(160,224.5,true)),null);assert.equal(f.resolve(f.event(160,224.5,false,false)),null);
});
