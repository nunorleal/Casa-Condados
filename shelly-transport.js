/* Direct Cloud v2 transport: static hosting, serialized requests, no command retries. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./home-core.js'));else root.ShellyTransport=factory(root.CasaHomeCore)})(typeof window==='undefined'?globalThis:window,function(CORE){
 'use strict';
 const errors={DEVICE_OFFLINE:'O Shelly está offline.',DEVICE_NOT_FOUND:'ID não encontrado nesta conta.',DEVICE_INVALID_CHANNEL:'Canal inválido para este Shelly.',DEVICE_INVALID_MODE:'A saída Shelly não corresponde ao tipo de equipamento configurado.',DEVICE_FAILED_COMMAND:'O Shelly recusou o comando.',DEVICE_UNSUPPORTED_COMMAND:'Comando não suportado pelo Shelly.',BAD_REQUEST:'A Shelly Cloud recusou os parâmetros do pedido.',INSTANCE_NOT_FOUND:'O servidor Shelly não encontrou este dispositivo.'};
 function build(credentials,path,payload){
  const host=CORE.server(credentials.server),key=credentials.authKey;
  if(typeof key!=='string'||!key.trim()||key.length>4096)throw Error('Indique a chave de autorização Shelly Cloud.');
  let endpoint,body;
  if(path==='status'){
   if(!Array.isArray(payload.ids)||!payload.ids.length||payload.ids.length>10)throw Error('Consulta de dispositivos inválida.');
   endpoint='get';body={ids:[...new Set(payload.ids.map(v=>{if(typeof v!=='string'||!/^([a-f0-9]{6,32}|XB[0-9]{1,15})$/i.test(v))throw Error('ID inválido.');return v}))],select:['status']};
  }else if(path==='light'){
   const c={...payload};if(typeof c.id!=='string'||!(/^[a-f0-9]{6,32}$/i.test(c.id))||!Number.isInteger(c.channel)||c.channel<0||c.channel>15||!['switch','light'].includes(c.type)||(c.on!==undefined&&typeof c.on!=='boolean')||(c.on===undefined&&c.brightness===undefined)||(c.brightness!==undefined&&(c.type!=='light'||!Number.isInteger(c.brightness)||c.brightness<0||c.brightness>100)))throw Error('Comando inválido.');endpoint='set/'+c.type;body={id:c.id,channel:c.channel,...(c.on!==undefined?{on:c.on}:{}),...(c.brightness!==undefined?{brightness:c.brightness}:{})};
  }else if(path==='cover'){
   endpoint='set/cover';body={id:payload.id,channel:payload.channel,position:payload.position};if(typeof body.id!=='string'||!/^[a-f0-9]{6,32}$/i.test(body.id)||!Number.isInteger(body.channel)||body.channel<0||body.channel>15||!(['open','close','stop'].includes(body.position)||Number.isInteger(body.position)&&body.position>=0&&body.position<=100))throw Error('Comando inválido.');
  }else throw Error('Pedido Shelly inválido.');
  const url=new URL('/v2/devices/api/'+endpoint,host);url.searchParams.set('auth_key',key);
  return {url:url.href,body,path};
 }
 function decode(request,status,text){
  if(status===401||status===403)throw Error('Autorização Shelly recusada. Confirme a chave e o servidor.');
  if(status===429)throw Error('Limite de pedidos Shelly atingido. Aguarde antes de tentar novamente.');
  let data=null;
  try{if(text.trim())data=JSON.parse(text)}catch{throw Error('Resposta inesperada da Shelly Cloud. Atualize os dados antes de repetir um comando.');}
  if(status!==200||data?.error)throw Error(errors[data?.error]||'O Shelly recusou o pedido. Não foi repetido.');
  if(request.path==='status'){
   if(!Array.isArray(data)||data.some(d=>!d||typeof d!=='object'||typeof d.id!=='string'))throw Error('Resposta de estados inesperada da Shelly Cloud.');
   return {devices:data};
  }
  if(data!==null&&(typeof data!=='object'||Array.isArray(data)))throw Error('Resposta de comando inesperada da Shelly Cloud.');
  if(request.path==='cover'||request.path==='light')return {accepted:true};
  throw Error('Tipo de resposta Shelly inválido.');
 }
 function create({fetch:send=globalThis.fetch,storage=null,now=()=>Date.now(),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),interval=1500,timeout=20000,onChange=()=>{},locks=globalThis.navigator?.locks}={}){
  let chain=Promise.resolve(),activeRequest=null,lastScope='';const pools=new Map();
  const counts={queued:0,active:0,sent:0,completed:0,failed:0,cancelled:0,lastFailure:null};
  const poolKey=scope=>'shelly-cloud-traffic-v2:'+scope;
  function pool(scope){
   const local=pools.get(scope)||{last:0,retryAt:0,strikes:0};let saved=null;try{saved=JSON.parse(storage?.getItem(poolKey(scope))||'null')}catch{}
   const number=v=>Number.isFinite(v)&&v>=0?v:0;
   return {last:Math.max(local.last,number(saved?.last)),retryAt:Math.max(local.retryAt,number(saved?.retryAt)),strikes:Math.max(local.strikes,Math.min(5,number(saved?.strikes)))};
  }
  function save(scope,value){pools.set(scope,value);try{storage?.setItem(poolKey(scope),JSON.stringify(value))}catch{}}
  function stats(server=lastScope){const state=pool(server);return {...counts,...(state.retryAt?{retryAt:state.retryAt}:{})}}
  function emit(){try{onChange(stats())}catch{}}
  function request(credentials,path,payload,isCurrent=()=>true){
   // Snapshot before queueing: edits must never change a queued command's destination.
   let built;try{built=build(credentials,path,payload)}catch(error){return Promise.reject(error)}
   const scope=new URL(built.url).origin;lastScope=scope;counts.queued++;emit();
   const run=async()=>{
    let started=false,failed=false,failure=null;
    try{
    await sleep(Math.max(0,interval-(now()-pool(scope).last)));
    if(!isCurrent()){counts.cancelled++;const e=Error('Estado ou configuração alterados. O pedido pendente foi cancelado. Atualize os dados antes de tentar novamente.');e.code='STATUS_CANCELLED';throw e}
    if(now()<pool(scope).retryAt)throw Error('Limite de pedidos Shelly. Aguarde '+Math.ceil((pool(scope).retryAt-now())/1000)+' segundos; o pedido não foi enviado.');
    started=true;counts.queued--;counts.active++;counts.sent++;emit();
    const controller=new AbortController(),current={path,controller,preempted:false},timer=path==='status'?setTimeout(()=>controller.abort(),timeout):null;activeRequest=current;
    save(scope,{...pool(scope),last:now()});
    try{
     const response=await send(built.url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(built.body),signal:controller.signal,credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'});
     if(response.status===429){
      const state=pool(scope),raw=response.headers?.get?.('Retry-After'),seconds=raw===null||raw===undefined||raw.trim()===''?NaN:Number(raw),declared=Number.isFinite(seconds)?seconds*1000:Date.parse(raw)-now(),delay=Number.isFinite(declared)&&declared>0?Math.max(1500,declared):Math.min(40000,2500*2**state.strikes);
      save(scope,{...state,retryAt:now()+delay,strikes:Math.min(5,state.strikes+1)});
     }
     failure=response.status===429?'limit':response.status===401||response.status===403?'authorization':'request';
     const result=decode(built,response.status,[401,403,429].includes(response.status)?'':(response.text?await response.text():JSON.stringify(await response.json())));const state=pool(scope);save(scope,{...state,retryAt:state.retryAt>now()?state.retryAt:0,strikes:state.retryAt>now()?state.strikes:0});counts.lastFailure=null;return result;
    }catch(error){
     if(current.preempted){counts.cancelled++;const e=Error('Consulta de estado interrompida para dar prioridade ao comando.');e.code='STATUS_CANCELLED';throw e}
     failed=true;counts.lastFailure=failure||'network';
     if(error.name==='AbortError')throw Error('Pedido sem confirmação por demora na ligação. Atualize os dados antes de repetir um comando.');
     if(error instanceof TypeError)throw Error('Não foi possível ligar à Shelly Cloud. Verifique a rede e as permissões do navegador; o pedido não foi repetido.');
     throw error;
    }finally{clearTimeout(timer);save(scope,{...pool(scope),last:now()});if(activeRequest===current)activeRequest=null}
    }finally{if(started){counts.active--;counts.completed++;if(failed)counts.failed++}else counts.queued--;emit()}
   };
   const task=chain.then(()=>locks?.request?locks.request('casa-nl-cloud:'+scope,{mode:'exclusive'},run):run());
   chain=task.catch(()=>{});return task;
  }
  function cancelStatus(){if(activeRequest?.path!=='status')return false;activeRequest.preempted=true;activeRequest.controller.abort();return true}
  return {request,stats,cancelStatus};
 }
 return {build,decode,create};
});
