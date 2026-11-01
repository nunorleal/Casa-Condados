const test=require('node:test'),assert=require('node:assert/strict'),{preferences}=require('../meteo-core.js');
test('bedside blind option is optional, boolean and survives validated preferences',()=>{
 for(const nightUntilBlindOpen of [true,false])assert.deepEqual(preferences({nightUntilBlindOpen}),{nightUntilBlindOpen});
 for(const v of [1,'true',null,{},[]])assert.throws(()=>preferences({nightUntilBlindOpen:v}));assert.deepEqual(preferences({}),{});
});
test('red/night survive the scheduled end, reload and unknown readings until full opening',()=>{
 const {bedsideMode}=require('../meteo-core.js'),tick=(p,night,red,blindOpen=false)=>bedsideMode(p,{enabled:true,night,red,blindOpen});
 let s=tick(null,true,true);assert.equal(s.night,true);assert.equal(s.red,true);
 s=tick(JSON.parse(JSON.stringify(s)),false,false);assert.equal(s.night,true);assert.equal(s.red,true);
 s=tick(s,false,false);assert.equal(s.red,true);
 s=tick(s,false,false,true);assert.equal(s.night,false);assert.equal(s.red,false);
 s=tick(s,false,false);assert.equal(s.night,false);
 s=tick(s,true,true);assert.equal(s.red,true); // next scheduled period arms again
});
test('independent red and night schedules retain their own presentation without inventing red',()=>{
 const {bedsideMode}=require('../meteo-core.js');
 let color=bedsideMode(null,{enabled:true,night:true,red:false});color=bedsideMode(color,{enabled:true});assert.equal(color.night,true);assert.equal(color.red,false);
 let red=bedsideMode(null,{enabled:true,night:false,red:true});red=bedsideMode(red,{enabled:true});assert.equal(red.night,true);assert.equal(red.red,true);
 assert.equal(bedsideMode(red,{enabled:false}).night,false);
});
test('opening during the schedule releases its hold; later closing does not rearm that period',()=>{
 const {bedsideMode}=require('../meteo-core.js');let s=bedsideMode(null,{enabled:true,night:true});
 s=bedsideMode(s,{enabled:true,night:true,blindOpen:true});assert.equal(s.night,true);assert.equal(s.holdNight,false);
 s=bedsideMode(s,{enabled:true,night:true,blindOpen:false});assert.equal(s.holdNight,false);
 s=bedsideMode(s,{enabled:true,night:false});assert.equal(s.night,false);
 assert.equal(bedsideMode(null,{enabled:true,night:false}).night,false); // enabling in daylight does not create a night period
});

test('bridge releases only a real current calibrated master blind at exactly 100%',()=>{
 const {bedroomBlind}=require('../meteo-core.js'),s={configured:true,fresh:true,online:true,calibrated:true,position:100};
 assert.deepEqual(bedroomBlind(s),{configured:true,ready:true,open:true,position:100});
 for(const position of [0,99,99.9,null,NaN,101])assert.equal(bedroomBlind({...s,position}).open,false);
 for(const patch of [{configured:false},{fresh:false},{online:false},{calibrated:false},{position:null}])assert.equal(bedroomBlind({...s,...patch}).open,false);
 assert.equal(bedroomBlind().open,false);
});
