"""Current Casa Condados UI with fake equipment only; all external fetches intercepted."""
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT=Path(__file__).resolve().parents[1]
class Fixture(SimpleHTTPRequestHandler):
 def do_GET(self):
  if self.path.split('?')[0] not in ('/','/index.html'):return super().do_GET()
  shim=(ROOT/'review/communication-fixture-header.txt').read_text()
  if 'slats' in parse_qs(urlparse(self.path).query,keep_blank_values=True):
   summary=(ROOT/'review/house-summary-fixture.html').read_text();shim='<script>'+summary.split('<script>',1)[1].split('</script>',1)[0]+'</script>'
   shim+='<script>localStorage.setItem("casa-leal-home-demo-v1",JSON.stringify({lights:{},blinds:{"master-north":50,"bedroom2-north":0,"kitchen-west":75}}));localStorage.setItem("casa-nova-labels-v1","false");localStorage.setItem("casa-leal-show-blind-banners-v1","false");</script>'
  extra='<script>window.addEventListener("error",e=>{const p=document.createElement("pre");p.id="fixture-js-error";p.textContent=e.message+" "+e.filename+":"+e.lineno;document.body.append(p)});localStorage.setItem("casa-leal-show-cats-v1","true");</script>'
  if 'stairs-light' in parse_qs(urlparse(self.path).query,keep_blank_values=True):
   extra+='<script>const fixtureStairDemo=JSON.parse(localStorage.getItem("casa-leal-home-demo-v1"));fixtureStairDemo.lights["4:stairs4"]=true;fixtureStairDemo.lights["4:living2"]=false;localStorage.setItem("casa-leal-home-demo-v1",JSON.stringify(fixtureStairDemo));</script>'
  page=(ROOT/'index.html').read_text().replace('<head>','<head>'+shim+extra)
  page=page.replace('</body>','<script>document.documentElement.setAttribute("data-cats-fixture-debug",JSON.stringify({core:typeof window.CasaCatsCore,cats:typeof window.CasaCats,addon:window.CasaAddons.mount.toString().includes("CasaCats")}));</script></body>')
  page=page.replace('</body>','<small style="position:fixed;right:5px;bottom:5px;background:#793a20;color:white;z-index:10000">TESTE · dispositivos fictícios</small></body>')
  # Deterministic allocation only for this intercepted local fixture.
  floor=parse_qs(urlparse(self.path).query).get('cats',[''])[0]
  if floor in ('3','4'):
   value='0' if floor=='3' else '.99'
   page=re.sub(r'(<script src="cats\.js[^"\n]*"\s*></script>)',lambda m:'<script>window.fixtureOriginalRandom=Math.random;Math.random=()=>'+value+';</script>'+m.group(1)+'<script>Math.random=window.fixtureOriginalRandom;delete window.fixtureOriginalRandom;</script>',page)
  if 'passage' in parse_qs(urlparse(self.path).query,keep_blank_values=True):
   pose='<script>const fixtureFloor=CasaCatsCore.forFloor;CasaCatsCore.forFloor=f=>{const c=fixtureFloor(f);return f==="3"?{...c,sample:j=>({x:570,y:j.path[0].id==="master"?561:610,angle:180,room:"entrance",walking:false})}:c};</script>'
   page=re.sub(r'(<script src="cats\.js[^"\n]*"\s*></script>)',lambda m:pose+m.group(1),page)
  if 'drag' in parse_qs(urlparse(self.path).query,keep_blank_values=True):page=page.replace('</body>','<script src="review/blind-drag-fixture.js"></script></body>')
  data=page.encode();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data)
if __name__=='__main__':ThreadingHTTPServer(('127.0.0.1',8116),lambda *a,**k:Fixture(*a,directory=str(ROOT),**k)).serve_forever()
