const {test}=require('node:test'),assert=require('node:assert/strict');
test('morning blind button requires red, daylight and a confirmed fully closed blind',()=>{
 const {morningBlindVisible:v}=require('../meteo-core.js'),c={red:true,now:100,sunrise:100,sunset:200},b={ready:true,position:0};
 assert.equal(v(c,b),true);assert.equal(v({...c,now:199},b),true);
 for(const patch of [{red:false},{now:99},{now:200},{now:201},{sunrise:NaN},{sunset:NaN},{sunrise:201},{sunset:100},{sunset:86400101}])assert.equal(v({...c,...patch},b),false);
 for(const blind of [null,{ready:false,position:0},{ready:true,position:null},{ready:true,position:1},{ready:true,position:100}])assert.equal(v(c,blind),false);
});
test('morning action revalidates state at click, commands only master open, never retries',async()=>{
 const {morningBlindAction:a}=require('../meteo-core.js');let calls=[],b={ready:true,position:0},c={red:true,now:150,sunrise:100,sunset:200};
 const api={isBusy:()=>false,hasUnsavedChanges:()=>false,command:async(...args)=>{calls.push(args);return true}};
 assert.equal(await a(api,()=>b,()=>c),true);assert.deepEqual(calls,[['master','open']]);
 calls=[];b={ready:false,position:0};assert.equal(await a(api,()=>b,()=>c),false);assert.deepEqual(calls,[]);
 b={ready:true,position:0};c.red=false;assert.equal(await a(api,()=>b,()=>c),false);c.red=true;
 api.isBusy=()=>true;assert.equal(await a(api,()=>b,()=>c),false);api.isBusy=()=>false;api.hasUnsavedChanges=()=>true;assert.equal(await a(api,()=>b,()=>c),false);assert.deepEqual(calls,[]);
 api.hasUnsavedChanges=()=>false;api.command=async()=>{calls.push('rejected');return undefined};assert.equal(await a(api,()=>b,()=>c),false);assert.deepEqual(calls,['rejected']);
 api.command=async()=>{calls.push('error');throw Error('network')};await assert.rejects(a(api,()=>b,()=>c));assert.deepEqual(calls,['rejected','error']);
});
