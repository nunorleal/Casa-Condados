const {test}=require('node:test'),assert=require('node:assert/strict');

test('accepted morning opening releases manual/scheduled night only after confirmed 100%, until sunset',()=>{
 const {bedsideMode:m}=require('../meteo-core.js'),day={enabled:true,night:true,red:true,now:150,sunrise:100,sunset:300};
 let state=m(null,day);assert.equal(state.red,true);
 state=m(state,{...day,morningRequested:true});assert.equal(state.red,true);assert.equal(state.night,true);
 state=m(JSON.parse(JSON.stringify(state)),{...day,now:160,blindOpen:false});assert.equal(state.red,true);
 state=m(state,{...day,now:170,blindOpen:true});assert.equal(state.red,false);assert.equal(state.night,false);
 state=m(JSON.parse(JSON.stringify(state)),{...day,now:180,blindOpen:false});assert.equal(state.red,false);assert.equal(state.night,false);
 state=m(state,{...day,now:300,blindOpen:false});assert.equal(state.red,true);assert.equal(state.night,true);assert.equal(state.morningUntil,0);
 for(const patch of [{now:99},{now:300},{sunrise:NaN},{sunset:NaN}]){const r=m(null,{...day,...patch,morningRequested:true,blindOpen:true});assert.equal(r.red,true)}
 assert.equal(m(null,{...day,enabled:false,morningRequested:true,blindOpen:true}).night,false);
 assert.equal(m(null,{...day,blindOpen:true}).night,true); // opening without explicit morning action preserves schedule
});
