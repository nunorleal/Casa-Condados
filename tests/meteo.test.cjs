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
});


test('a confirmed daytime opening releases red without the morning button or hold switch',()=>{
 const {bedsideMode:m}=require('../meteo-core.js');
 const day={night:true,red:true,now:150,sunrise:100,sunset:300};
 let state=m(null,{...day,blindPosition:0});
 state=m(state,{...day,now:160,blindPosition:99});
 assert.equal(state.red,true);
 state=m(state,{...day,now:165,blindPosition:null});
 assert.equal(state.red,true);
 state=m(state,{...day,now:170,blindOpen:true,blindPosition:100});
 assert.equal(state.red,false);
 assert.equal(state.night,false);
 state=m(JSON.parse(JSON.stringify(state)),{...day,now:180,blindPosition:0});
 assert.equal(state.red,false);
 assert.equal(m(state,{...day,now:300,blindPosition:0}).red,true);
});

test('opening at night ends red for the current schedule, preserving colour night',()=>{
 const {bedsideMode:m}=require('../meteo-core.js');
 const night={night:true,red:true,now:10,sunrise:100,sunset:300};
 assert.equal(m(null,{...night,blindOpen:true,blindPosition:100}).red,true);
 let state=m(null,{...night,blindPosition:50});
 state=m(state,{...night,now:20,blindPosition:null});
 assert.equal(state.red,true);
 state=m(JSON.parse(JSON.stringify(state)),{...night,now:30,blindOpen:true,blindPosition:100});
 assert.equal(state.red,false);
 assert.equal(state.night,true);
 state=m(state,{...night,now:40,blindPosition:30});
 assert.equal(state.red,false);
 state=m(state,{...night,now:70,red:false});
 assert.equal(m(state,{...night,now:300,blindPosition:30}).red,true);
});
