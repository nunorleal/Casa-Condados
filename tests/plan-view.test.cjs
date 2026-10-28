const test=require('node:test'),assert=require('node:assert/strict'),C=require('../plan-view-core.js');
const box={x:35,y:70,width:870,height:1228};
test('fit contains all of the plan with the viewport aspect ratio',()=>{
 for(const [w,h] of [[648,792],[700,948],[1280,488]]){const b=C.fit(box,w,h);assert.ok(b.x<=box.x+.001&&b.y<=box.y+.001);assert.ok(b.x+b.width>=box.x+box.width-.001);assert.ok(b.y+b.height>=box.y+box.height-.001);assert.ok(Math.abs(b.width/b.height-w/h)<1e-9)}
});
test('zoom keeps an interior focal point in the same screen position',()=>{
 const b=C.fit(box,648,792),f={x:.4,y:.6},v=C.zoom(b,b,2,f);
 assert.ok(Math.abs(v.x+f.x*v.width-(b.x+f.x*b.width))<1e-9);assert.ok(Math.abs(v.y+f.y*v.height-(b.y+f.y*b.height))<1e-9);
});
test('zoom stays between fit and 4x; extreme pan cannot lose the plan',()=>{
 const b=C.fit(box,648,792),v=C.zoom(b,b,100);assert.equal(v.width,b.width/4);
 const moved=C.pan(b,v,1e6,-1e6);assert.equal(moved.x,b.x+b.width-v.width);assert.equal(moved.y,b.y);
 assert.deepEqual(C.zoom(b,moved,.001),b);
});
