"""Full render profiling with fake equipment and blocked external fetches."""
from pathlib import Path
from unittest.mock import patch
from http.server import ThreadingHTTPServer
from serve_cats_fixture import Fixture,ROOT
EXTRA=r"""<script>
window.addEventListener('DOMContentLoaded',()=>{document.title='Teste gatos - dispositivos ficticios';
 const box=document.createElement('section');box.style='position:fixed;right:5px;top:100px;z-index:10001;background:#fff;color:#234;padding:10px;max-width:400px';const button=document.createElement('button');button.textContent='Comparar desenho antigo e isolado';const out=document.createElement('pre');out.id='portable-perf';out.textContent='Pronto';box.append(button,out);document.body.append(box);
 button.onclick=async()=>{button.disabled=true;const el=document.getElementById('heater-object'),svg=document.querySelector('#plan-canvas>svg'),layer=svg.querySelector('.house-cats'),host=svg.querySelector('[data-addon="floor3-render"]>g'),transform=layer.getAttribute('transform'),original=el.setPointerCapture;el.setPointerCapture=()=>{};const next=()=>new Promise(requestAnimationFrame),check=document.getElementById('show-house-cats'),enabled=check.checked;check.checked=false;check.dispatchEvent(new Event('change'));layer.removeAttribute('hidden');
 async function measure(old){if(old){host.append(layer);layer.removeAttribute('transform')}else{svg.append(layer);layer.setAttribute('transform',transform)}await next();await next();const rect=el.getBoundingClientRect(),x=rect.x+rect.width/2,y=rect.y+rect.height/2,cat=()=>[...layer.querySelectorAll('[data-cat]')].map(e=>e.getAttribute('transform')).join('|'),first=cat(),event=(type,dx=0)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:321,isPrimary:true,pointerType:'mouse',button:0,clientX:x+dx,clientY:y}));const poses=[...layer.querySelectorAll('[data-cat]')].map(e=>[e,e.getAttribute('transform')]),start=performance.now();event('pointerdown');const downMs=performance.now()-start,durations=[];for(let i=0;i<20;i++){const t=performance.now();for(const [e,pose] of poses)e.setAttribute('transform',pose+' translate('+Math.sin(i/3)*4+' 0)');event('pointermove',10+i);await next();durations.push(performance.now()-t)}event('pointercancel',29);for(const [e,pose]of poses)e.setAttribute('transform',pose);return {grabMs:+downMs.toFixed(2),frameMeanMs:+(durations.reduce((a,b)=>a+b,0)/durations.length).toFixed(2),frameMaxMs:+Math.max(...durations).toFixed(2),controlledAnimation:true,outsideFloorFilter:layer.parentNode===svg}}
 try{out.textContent='A medir...';const old=await measure(true),isolated=await measure(false);out.textContent=JSON.stringify({version:document.querySelector('.brand-version')?.textContent,antigo:old,isolado:isolated},null,2)}catch(e){out.textContent=e.stack}finally{svg.append(layer);layer.setAttribute('transform',transform);el.setPointerCapture=original;check.checked=enabled;check.dispatchEvent(new Event('change'));button.disabled=false}
 };
});
</script>"""
import inspect,textwrap,serve_cats_fixture
namespace=dict(vars(serve_cats_fixture),EXTRA=EXTRA)
source=textwrap.dedent(inspect.getsource(Fixture.do_GET))
source=source.replace("page=(ROOT/'index.html').read_text().replace", "page=(ROOT/'index.html').read_text().replace('</body>',EXTRA+'</body>',1).replace",1)
source=source.replace('return super().do_GET()','return SimpleHTTPRequestHandler.do_GET(self)')
exec(source,namespace)
class Handler(Fixture):
 do_GET=namespace['do_GET']
if __name__=='__main__':ThreadingHTTPServer(('127.0.0.1',8117),lambda *a,**k:Handler(*a,directory=str(ROOT),**k)).serve_forever()
