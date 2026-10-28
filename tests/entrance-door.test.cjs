const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
test('porta alterna só por booleanos confirmados e unknown mostra fechado',()=>{
 const closed={style:{}},open={style:{}};
 const door={dataset:{},querySelector:s=>s.includes('closed')?closed:open};
 const context={window:{},document:{getElementById:()=>null,querySelectorAll:s=>s==='[data-door="entrance"]'?[door]:[]},localStorage:{getItem:()=>null},fetch:()=>{throw Error('Pedido não permitido')}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../addons.js'),'utf8'),context);
 const set=context.window.CasaAddons.setEntranceDoorState;
 set(true);assert.equal(open.style.display,'');assert.equal(closed.style.display,'none');assert.equal(door.dataset.doorStatus,'open');
 set(false);assert.equal(open.style.display,'none');assert.equal(closed.style.display,'');assert.equal(door.dataset.doorStatus,'closed');
 set(null);assert.equal(open.style.display,'none');assert.equal(closed.style.display,'');assert.equal(door.dataset.doorStatus,'unknown');
 for(const value of ['true',1,{},undefined])assert.throws(()=>set(value));
 assert.equal(door.dataset.doorStatus,'unknown');
});
