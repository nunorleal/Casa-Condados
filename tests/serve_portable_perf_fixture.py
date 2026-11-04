"""Full render profiling with fake equipment and blocked external fetches."""
from pathlib import Path
from unittest.mock import patch
from http.server import ThreadingHTTPServer
from serve_cats_fixture import Fixture,ROOT
EXTRA=r"""<script>
window.addEventListener('DOMContentLoaded',()=>{
 const box=document.createElement('section');box.style='position:fixed;right:5px;top:100px;z-index:10001;background:#fff;color:#234;padding:10px;max-width:400px';const button=document.createElement('button');button.textContent='Medir arrasto ficticio';const out=document.createElement('pre');out.id='portable-perf';out.textContent='Pronto';box.append(button,out);document.body.append(box);
 button.onclick=async()=>{button.disabled=true;const el=document.getElementById('heater-object'),rect=el.getBoundingClientRect(),x=rect.x+rect.width/2,y=rect.y+rect.height/2,original=el.setPointerCapture;el.setPointerCapture=()=>{};let matrixMs=0,matrixCalls=0;const native=SVGGraphicsElement.prototype.getScreenCTM;SVGGraphicsElement.prototype.getScreenCTM=function(){const t=performance.now();try{return native.call(this)}finally{matrixMs+=performance.now()-t;matrixCalls++}};const paused=()=>[...document.querySelectorAll('.house-cats')].every(e=>e.classList.contains('cats-paused'));const event=(type,dx=0)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:321,isPrimary:true,pointerType:'mouse',button:0,clientX:x+dx,clientY:y}));
 try{const start=performance.now();event('pointerdown');const downMs=performance.now()-start,pauseOnDown=paused(),durations=[];for(let i=0;i<12;i++){const t=performance.now();event('pointermove',10+i);await new Promise(requestAnimationFrame);durations.push(performance.now()-t)}event('pointercancel',21);out.textContent=JSON.stringify({downMs,pauseOnDown,matrixMs,matrixCalls,frameMax:Math.max(...durations),frameMean:durations.reduce((a,b)=>a+b,0)/durations.length,resumed:!paused()},null,2)}catch(e){out.textContent=e.stack}finally{el.setPointerCapture=original;SVGGraphicsElement.prototype.getScreenCTM=native;button.disabled=false}
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
