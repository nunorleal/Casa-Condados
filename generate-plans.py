"""Generate editable, furniture-free native SVG floor plans. No external dependencies."""
from pathlib import Path
import json, random
ROOT=Path(__file__).resolve().parent
random.seed(3)
def defs():
    # Interlocking oak boards; the entire field rotates, preserving the grain in each board.
    boards=[]
    for i in range(-1,6):
        for j in range(-10,11):
            x=i*72+j*18; y=i*72-j*18
            tone=random.choice(['#ccb18b','#d4bb99','#dec5a1','#c6a983','#d9bf99','#e1c9a8'])
            boards.append(f'<g transform="translate({x} {y})"><path d="M0 0h72v18H0Z" fill="{tone}" stroke="#a78b65" stroke-opacity=".24" stroke-width=".65"/><path d="M2 4h66M6 12h55M18 8h43" stroke="#f6e3c6" stroke-opacity=".22" stroke-width=".7"/><path d="M72 0h18v72H72Z" fill="{tone}" stroke="#a78b65" stroke-opacity=".24" stroke-width=".65"/><path d="M77 5v60M85 15v48" stroke="#f6e3c6" stroke-opacity=".22" stroke-width=".7"/></g>')
    # Repeating field is clipped at the tile boundary, with deterministic tones.
    return f'''<defs><pattern id="oak" width="160" height="160" patternUnits="userSpaceOnUse"><rect width="160" height="160" fill="#d3b895"/><image href="assets/parquet-carvalho-natural-v1.png" width="160" height="160"/></pattern>
    <pattern id="stone" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="#d9cbb5"/><path d="M0 0H80V80H0Z" fill="none" stroke="#b4a690" stroke-width="1.3"/><path d="M4 14l26-9 33 18M8 60l29-17 36 24M42 3l-5 32 16 14" fill="none" stroke="#eee5d5" stroke-opacity=".45" stroke-width="2"/></pattern>
    <pattern id="concrete" width="90" height="90" patternUnits="userSpaceOnUse"><rect width="90" height="90" fill="#a9aaa4"/><path d="M0 0H90V90" fill="none" stroke="#92958f" stroke-width="1"/><path d="M8 18h13m30 49h7M68 28h4M22 73h5" stroke="#c4c4bb" stroke-width="1.2"/></pattern>
    <pattern id="terrace" width="65" height="32" patternUnits="userSpaceOnUse"><rect width="65" height="32" fill="#c9c3b4"/><path d="M0 0H65V32H0Z" stroke="#a5a293" stroke-width=".9" fill="none"/></pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="13" flood-color="#071617" flood-opacity=".48"/></filter>
    <linearGradient id="daylight" x1="0" x2="1" y2="1"><stop stop-color="#fff8dc" stop-opacity=".28"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#65462b" stop-opacity=".12"/></linearGradient></defs>'''
DEFS=defs()
def floor(path,fill='oak'):return f'<path d="{path}" fill="url(#{fill})"/>'
def walls(d):return f'<path d="{d}" fill="none" stroke="#68685d" stroke-width="20" stroke-linejoin="miter"/><path class="white-walls" d="{d}" fill="none" stroke="#fffef6" stroke-width="16" stroke-linejoin="miter"/>'
def glass(x1,y1,x2,y2):
    return f'<path d="M{x1} {y1}L{x2} {y2}" stroke="#5b7272" stroke-width="11"/><path d="M{x1} {y1}L{x2} {y2}" stroke="#c5e6e5" stroke-width="6"/><path d="M{x1} {y1}L{x2} {y2}" stroke="#f4ffff" stroke-width="1.5"/>'
def door(x,y,r=65,rot=0):return f'<g transform="translate({x} {y}) rotate({rot})" fill="none"><path d="M0 0V{-r}" stroke="#fff9e8" stroke-width="5"/><path d="M0 {-r}A{r} {r} 0 0 1 {r} 0" stroke="#716955" stroke-opacity=".6" stroke-width="1.4"/></g>'
def door_leaf(id,x,y,r,opened,closed,sweep):
    ox,oy=opened;cx,cy=closed
    leaf_color,leaf_width=("#855b3b",9) if id=="entrance" else ("#fff9e8",5)
    if id=="entrance":
        return f'''<g data-door="entrance" data-door-status="unknown" data-hinge="{x},{y}" data-open="{ox},{oy}" data-closed="{cx},{cy}" transform="translate({x} {y})" fill="none">
        <g data-door-position="closed"><path class="door-leaf" d="M0 0L{cx} {cy}" stroke="{leaf_color}" stroke-width="{leaf_width}"/></g>
        <g data-door-position="open" style="display:none"><path class="door-leaf" d="M0 0L{ox} {oy}" stroke="{leaf_color}" stroke-width="{leaf_width}"/><path class="door-swing" d="M{ox} {oy}A{r} {r} 0 0 {sweep} {cx} {cy}" stroke="#716955" stroke-opacity=".6" stroke-width="1.4"/></g></g>'''
    return f'<g data-door="{id}" data-hinge="{x},{y}" data-open="{ox},{oy}" data-closed="{cx},{cy}" transform="translate({x} {y})" fill="none"><path class="door-leaf" d="M0 0L{ox} {oy}" stroke="{leaf_color}" stroke-width="{leaf_width}"/><path class="door-swing" d="M{ox} {oy}A{r} {r} 0 0 {sweep} {cx} {cy}" stroke="#716955" stroke-opacity=".6" stroke-width="1.4"/></g>'
def cabinet(id,x,y,w,h,section=False):
    # Strict plan view: white frame, recessed oak interior and a pale diagonal leaf.
    if h>w:
        width,depth=h,w;transform=f'translate({x} {y+h}) rotate(-90)'
    else:
        width,depth=w,h;transform=f'translate({x} {y})'
    attribute='data-cabinet-section' if section else 'data-cabinet'
    d=f'M4 {depth-4}L{width-4} 4V{depth-4}Z'
    return f'''<g {attribute}="{id}" transform="{transform}">
    <rect width="{width}" height="{depth}" fill="#f8f6ef" stroke="#777369" stroke-width="1.5"/>
    <rect x="4" y="4" width="{width-8}" height="{depth-8}" fill="url(#cabinet-oak)"/>
    <rect x="4" y="4" width="{width-8}" height="{depth-8}" fill="url(#cabinet-recess)"/>
    <path d="{d}" fill="url(#cabinet-pale-grain)" stroke="#a49a87" stroke-width="1.1"/>
    <path d="M4 {depth-4}L{width-4} 4" stroke="#655f53" stroke-opacity=".55" stroke-width="1.5"/>
    <path d="M4 4H{width-4}V{depth-4}" fill="none" stroke="#554d40" stroke-opacity=".6" stroke-width="1.5"/>
    <path d="M1 1H{width-1}M1 1V{depth-1}" fill="none" stroke="#fffef9" stroke-width="1.4"/>
    <path d="M5 {depth-2}H{width-5}" stroke="#d8d5c9" stroke-width=".8"/>
    <rect x="{width-11}" y="4" width="6" height="2.5" rx=".6" fill="#a9966e"/>
    </g>'''
def stairs(x,y,w,h,n=15):
    return f'<g fill="none" stroke="#8c897d" stroke-width="1.6"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#e4ded0"/>'+''.join(f'<path d="M{x} {y+i*h/n}h{w}"/>' for i in range(n+1))+f'<path d="M{x+w/2} {y+h-30}V{y+30}m-8 14 8-14 8 14" stroke="#777765"/></g>'
def label(id,name,x,y):return dict(id=id,name=name,x=x,y=y)
def svg(body,viewbox='0 0 1000 1660'):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" aria-hidden="true">'+DEFS+'<g filter="url(#shadow)">'+body+'</g></svg>'
# Piso 3: wall proportions from the revised 26 October reference.
# Uniform mapping: x46..1000 -> x65..935; y125..1434 -> y225..1419.
# The original balconies and exterior openings remain architectural references.
b=floor('M65 65H935V885H683V1574H65Z')
b+=floor('M65 65H935V225H65Z','terrace')+floor('M65 1419H683V1574H65Z','terrace')
b+=floor('M65 678H317V859H65Z','stone')+floor('M317 678H505V859H317Z','stone')
b+='<path d="M65 225H935V885H683V1419H65Z" fill="url(#daylight)"/>'
# Paint all wall outlines first, then one white network, so junctions have no seams.
wall_segments=[
 'M65 734V65H935V225 M935 225V798 M935 868V885H683V1574H65V1012 M65 806V940',
 'M65 225H120 M280 225H438 M585 225H720 M870 225H935 M65 1419H105 M350 1419H390 M570 1419H683',
 'M377 225V585H390V565 M663 225V565 M65 520H272V582 M468 505V565H680 M768 568V740H744 M768 626H935 M851 740H935 M65 678H225 M317 859V678H420 M390 658V678 M515 740H665 M645 680V740 M65 859H505V678',
]
b+=walls(' '.join(wall_segments))
# Doors, glazing, stair treads and railings are independent, non-interactive addons.
features=stairs(585,991,98,333)
# Leaf and swing positions follow the original architectural door symbols.
for args in [
 ('master',390,658,85,(-85,0),(0,-85),1),
 ('bedroom2',390,565,78,(0,-78),(78,0),1),
 ('bedroom3',680,565,88,(0,-88),(88,0),1),
 ('bath1',225,678,92,(0,92),(92,0),0),
 ('bath2',492,678,72,(0,72),(-72,0),1),
 ('hall',744,740,79,(0,-79),(-79,0),0),
 ('entrance',935,868,70,(-70,0),(0,-70),1)
]:features+=door_leaf(*args)
# Sliding WC door: a short plan-view leaf mark, without a swing arc.
features+='<g data-door="bath3-sliding" data-door-type="sliding" fill="none"><path d="M790 740H865" stroke="#857e6d" stroke-width="7"/><path class="door-leaf" d="M790 740H865" stroke="#fff9e8" stroke-width="5"/></g>' 
# Top-down built-in cabinetry is a separate overlay, not part of the floor/walls.
cabinets='''<defs>
<pattern id="cabinet-oak" width="84" height="26" patternUnits="userSpaceOnUse"><rect width="84" height="26" fill="#c6a071"/><path d="M0 4C20 1 38 8 84 4M0 11C30 16 58 7 84 11M0 20C32 17 58 25 84 20" fill="none" stroke="#9e754d" stroke-opacity=".3" stroke-width=".8"/><path d="M0 6C22 3 45 10 84 6M0 22C32 19 61 26 84 22" fill="none" stroke="#ecd5ad" stroke-opacity=".45" stroke-width=".7"/></pattern>
<pattern id="cabinet-pale-grain" width="54" height="24" patternUnits="userSpaceOnUse"><rect width="54" height="24" fill="#f5efe2"/><path d="M0 5C18 1 30 9 54 5M0 15C20 21 37 9 54 15M10 0C14 8 4 17 12 24M41 0C35 12 46 18 43 24" fill="none" stroke="#d6cbb8" stroke-opacity=".45" stroke-width=".7"/></pattern>
<linearGradient id="cabinet-recess" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#282216" stop-opacity=".35"/><stop offset=".2" stop-color="#282216" stop-opacity=".06"/><stop offset=".8" stop-color="#fff4db" stop-opacity=".06"/><stop offset="1" stop-color="#282216" stop-opacity=".18"/></linearGradient>
</defs>'''
cabinets+='<g data-cabinet="closet-l">'+cabinet('closet-horizontal',73,528,191,48,True)+cabinet('closet-vertical',73,576,54,94,True)+'</g>'
cabinets+=cabinet('bedroom2',476,507,179,50)
cabinets+=cabinet('bedroom3',776,568,151,50)
cabinets+=cabinet('hall',517,682,120,50)
for args in [(120,225,280,225),(438,225,585,225),(720,225,870,225),(65,734,65,806),(65,940,65,1012),(105,1419,350,1419),(390,1419,570,1419)]:features+=glass(*args)
features+='<path d="M85 89H915M85 1550H663" stroke="#f2f0e5" stroke-width="4"/>'
labels=[label('master','Suite principal',220,390),label('bedroom2','Quarto do Gui',520,390),label('bedroom3','Biblioteca / Escritório Gui',800,420),label('closet','Closet',190,620),label('bath1','WC · Suite',187,770),label('bath2','WC · Quartos',410,780),label('bath3','WC · Entrada',851,685),label('hall','Hall',600,645),label('entrance','Entrada',760,820),label('kitchen','Cozinha',285,960),label('living','Sala',300,1200),label('balcony-north','Varanda',495,145),label('balcony-south','Varanda',350,1495),label('stairs3','Escadas · Piso 4',630,950)]
plans={'3':dict(name='Piso 3',subtitle='Casa',svg=svg(b,'35 35 930 1570'),rooms=labels,architectureAddon=features,cabinetAddon=cabinets)}
# Kitchen is a standalone top-down addon; no changes to the floor or wall pixels.
kitchen='''<defs>
<pattern id="kitchen-oak" width="100" height="28" patternUnits="userSpaceOnUse"><rect width="100" height="28" fill="#b99770"/><path d="M0 5C25 1 60 9 100 5M0 15C34 20 62 10 100 15M0 24C26 19 70 29 100 24" fill="none" stroke="#815e3c" stroke-opacity=".25" stroke-width=".8"/><path d="M0 8C35 4 66 13 100 8M0 21C32 17 70 25 100 21" stroke="#e9d1ab" stroke-opacity=".4" stroke-width=".7" fill="none"/></pattern>
<linearGradient id="kitchen-stone" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f1ede4"/><stop offset="1" stop-color="#dfd9cb"/></linearGradient>
</defs><g data-kitchen="main-run">
<rect x="75" y="870" width="440" height="60" rx="1" fill="#31291e" opacity=".18"/>
<rect x="73" y="867" width="440" height="60" fill="#f2efe7" stroke="#837d70" stroke-width="1.5"/>
<rect x="73" y="867" width="352" height="57" fill="url(#kitchen-stone)"/>
<path d="M74 869H425M74 869V924" stroke="#fffdf4" stroke-width="2" fill="none"/>
<path d="M74 925H425" stroke="#a5845c" stroke-width="3"/>
'''
for i in range(10):
    x=73+i*44
    kitchen+=f'<g data-kitchen-module="{i+1}"><path d="M{x} 920v6" stroke="#8f8879" stroke-width=".8"/></g>'
# Tall storage units at the right are visible as pale closed tops, without appliance fronts.
for x in [425,469]:
    kitchen+=f'<rect x="{x}" y="867" width="44" height="60" fill="#e9e5dc" stroke="#9e9788" stroke-width=".85"/><path d="M{x+2} 869h40v55" fill="none" stroke="#faf7ee" stroke-width="1.2"/>'
kitchen+='''<g data-kitchen="sink">
<rect x="143" y="879" width="65" height="34" rx="3" fill="#c4c0b5" stroke="#8f8c82" stroke-width="1"/>
<rect x="147" y="883" width="38" height="26" rx="3" fill="#e9e6dd" stroke="#a7a397" stroke-width="1.2"/>
<path d="M190 884h13M190 889h13M190 894h13M190 899h13M190 904h13" stroke="#aaa597" stroke-width="1"/>
<circle cx="166" cy="901" r="2.4" fill="#8e8c80"/><path d="M166 877v11q0 3 4 3" stroke="#715934" stroke-width="3.7" fill="none"/><path d="M166 877v11q0 3 4 3" stroke="#d3b77d" stroke-width="2" fill="none"/>
</g><g data-kitchen="hob">
<rect x="330" y="879" width="55" height="35" rx="2" fill="#343735" stroke="#66685f" stroke-width="1"/>
<g stroke="#9b9e96" fill="none" stroke-width=".8"><circle cx="342" cy="889" r="6"/><circle cx="371" cy="889" r="6"/><circle cx="342" cy="904" r="5"/><circle cx="371" cy="904" r="5"/></g><circle cx="357" cy="909" r="1" fill="#c5c6ba"/>
</g></g><g data-kitchen="dining-island">
<rect x="157" y="1005" width="130" height="55" rx="2" fill="#35281b" opacity=".2"/>
<rect x="155" y="1002" width="130" height="55" rx="1.5" fill="url(#kitchen-oak)" stroke="#82664a" stroke-width="1.5"/>
<path d="M157 1004h126M157 1004v50" stroke="#e7cda7" stroke-width="1.2" fill="none"/>
<path d="M157 1055h126" stroke="#77583b" stroke-width="1"/>
</g>'''
plans['3']['kitchenAddon']=kitchen
# Schematic utility equipment, strictly from above, inside the marked balcony strip.
plans['3']['balconyUtilitiesAddon']='''<defs><linearGradient id="utility-top" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#faf8f0"/><stop offset="1" stop-color="#d3d1c7"/></linearGradient></defs>
<g data-balcony-equipment="vacuum"><title>Aspirador</title>
<path d="M625 1444C608 1432 606 1454 616 1455H623" fill="none" stroke="#656960" stroke-width="2.5"/>
<ellipse cx="637" cy="1446" rx="12" ry="10" fill="#383e3a" opacity=".17" transform="translate(1 1.5)"/>
<ellipse cx="637" cy="1446" rx="12" ry="10" fill="#a8aaa1" stroke="#686e65" stroke-width="1"/>
<path d="M630 1441h14v9h-14Z" fill="#d8dad1" stroke="#7e8379" stroke-width=".7"/><path d="M633 1441v-3h8v3" fill="none" stroke="#646a61" stroke-width="1.5"/>
</g><g data-balcony-equipment="washing-machine"><title>Máquina de lavar roupa</title>
<rect x="608" y="1462" width="56" height="43" rx="1.5" fill="#33382f" opacity=".17"/>
<rect x="607" y="1460" width="56" height="43" rx="1" fill="url(#utility-top)" stroke="#888d80" stroke-width="1.2"/>
<path d="M609 1462h52M609 1462v38M610 1499h50" fill="none" stroke="#fffef6" stroke-width="1.1"/>
<path d="M610 1466h50M610 1498h50" stroke="#b8baae" stroke-width=".75"/>
</g><g data-balcony-equipment="heat-pump"><title>Bomba de calor</title>
<circle cx="636" cy="1528" r="20" fill="#30382c" opacity=".17"/>
<circle cx="635" cy="1526" r="20" fill="url(#utility-top)" stroke="#858b7d" stroke-width="1.2"/>
<circle cx="635" cy="1526" r="15" fill="#b5b9ae" stroke="#91988a" stroke-width=".8"/>
<path d="M624 1516h22M622 1520h26M621 1524h28M621 1528h28M623 1532h24M626 1536h18" fill="none" stroke="#e4e7da" stroke-width="1.3"/>
<path d="M627 1510a18 18 0 0 1 18 3" fill="none" stroke="#fffdf1" stroke-width="1.1"/>
</g>'''
# Optional sanitary fixtures: independent plan-view overlay in the three bathrooms.
def toilet(x,y,angle=0):
    return f'''<g data-bath-fixture="toilet" transform="translate({x} {y}) rotate({angle})"><rect x="-16" y="0" width="32" height="11" rx="2" fill="#e6e7dd" stroke="#90968d" stroke-width="1"/><path d="M-15 10H15V27C15 48-15 48-15 27Z" fill="#fcfcf4" stroke="#91988d" stroke-width="1.2"/><path d="M-10 16H10V27C10 40-10 40-10 27Z" fill="#dce2d9" stroke="#b2b9ae" stroke-width=".8"/><path d="M-8 18H8V26C8 35-8 35-8 26Z" fill="#f8faf1"/><rect x="-3" y="3" width="6" height="2" rx="1" fill="#a6ab9f"/></g>'''
def basin(x,y,w,h):
    return f'''<g data-bath-fixture="basin"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#bath-oak)" stroke="#8d795c" stroke-width="1.2"/><rect x="{x+3}" y="{y+3}" width="{w-6}" height="{h-6}" fill="#ece9de" stroke="#d4cfc0" stroke-width=".8"/><rect x="{x+9}" y="{y+8}" width="{w-18}" height="{h-15}" rx="6" fill="#fcfcf5" stroke="#9fa69a" stroke-width="1"/><rect x="{x+13}" y="{y+11}" width="{w-26}" height="{h-21}" rx="4" fill="#e1e7dd"/><circle cx="{x+w/2}" cy="{y+h/2+3}" r="1.8" fill="#959d90"/><path d="M{x+w/2} {y+3}v9" stroke="#aa8c56" stroke-width="2.3"/></g>'''
def shower(x,y,w,h):
    return f'''<g data-bath-fixture="shower"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1" fill="#f1f0e6" stroke="#a1a89a" stroke-width="1.2"/><rect x="{x+4}" y="{y+4}" width="{w-8}" height="{h-8}" rx="2" fill="#e5e8dc" stroke="#c7ccbe" stroke-width=".8"/><path d="M{x+8} {y+8}L{x+w/2} {y+h-12}L{x+w-8} {y+8}" fill="none" stroke="#c9d0c1" stroke-width=".7"/><path d="M{x+w-2} {y+2}v{h-4}" stroke="#80a8a7" stroke-width="2.5"/><path d="M{x+w-3} {y+3}v{h-6}" stroke="#e6ffff" stroke-width=".9"/><rect x="{x+w/2-9}" y="{y+h-13}" width="18" height="3" rx="1" fill="#939d90"/><circle cx="{x+13}" cy="{y+13}" r="6" fill="#c7cfbf" stroke="#a0aa98" stroke-width=".8"/></g>'''
bathrooms='''<defs><pattern id="bath-oak" width="70" height="16" patternUnits="userSpaceOnUse"><rect width="70" height="16" fill="#b99a72"/><path d="M0 4C25 1 45 9 70 4M0 12C20 8 50 17 70 12" stroke="#e5cfa9" stroke-width=".7" stroke-opacity=".55" fill="none"/></pattern></defs>'''
bathrooms+='<g data-bath-room="suite">'+shower(75,688,62,161)+basin(183,814,114,35)+toilet(195,688)+'</g>'
bathrooms+='<g data-bath-room="shared">'+shower(327,784,75,65)+basin(416,814,79,35)+toilet(329,723,-90)+'</g>'
bathrooms+='<g data-bath-room="entrance">'+basin(778,636,80,35)+toilet(923,687,90)+'</g>'
plans['3']['bathroomAddon']=bathrooms
# Piso 4: useful outline from the source, ending above the lower hatched roof band.
# Source mapping: x297..920 -> x65..875; y220..1118 -> y100..1268.
b=floor('M65 100H438V767H875V1268H65Z')
b+='<path d="M65 100H438V767H875V1268H65Z" fill="url(#daylight)"/>'
b+=stairs(751,901,124,367)
# Left wall has one real opening per room; the window graphics are separate addons.
b+=walls('M65 555V100H438V767H875V1268H65V959 M65 666V845 M65 767H310 M390 767H438')
features4='<g data-door="studio" data-door-type="sliding" fill="none"><path d="M296 767H345" stroke="#857e6d" stroke-width="7"/><path class="door-leaf" d="M296 767H345" stroke="#fff9e8" stroke-width="5"/></g>' 
# Velux and facade windows are mounted independently by addons.js.
plans['4']=dict(name='Piso 4',subtitle='Estúdio e Sala 2',svg=svg(b,'35 70 870 1228'),architectureAddon=features4,rooms=[label('studio','Estúdio',250,445),label('living2','Sala 2',430,920),label('stairs4','Escadas · Piso 3',810,850)])
# Private garage only: exclude communal stairs, landing and door on the left.
b=floor('M85 470H915V1200H255V625H85Z','concrete')
b+=walls('M865 1200H915V470H85V625H255V1200H320')
b+='<path d="M320 1200H865" stroke="#53615d" stroke-width="14"/><path d="M320 1196H865M320 1204H865" stroke="#e8e8df" stroke-width="3"/>'
plans['-1']=dict(name='Piso −1',subtitle='Garagem',svg=svg(b,'45 430 910 830'),rooms=[label('garage','Garagem',580,865)])
# Invisible containment geometry for movable labels; never rendered into the plan.
label_areas={
 '3':{
  'master':'M75 235H367V575H282V510H75Z',
  'bedroom2':'M387 235H653V555H468V575H387Z',
  'bedroom3':'M673 235H925V616H778V563H673Z',
  'closet':'M75 530H262V595H367V668H75Z',
  'bath1':'M75 688H307V849H75Z',
  'bath2':'M327 688H495V849H327Z',
  'bath3':'M778 636H925V730H778Z',
  'hall':'M387 595H478V575H680V583H758V730H675V730H515V668H387Z',
  'entrance':'M515 750H675V750H925V875H693V849H515Z',
  'kitchen':'M75 869H495V895H673V981H575V1040H75Z',
  'living':'M75 1050H575V1334H673V1409H75Z',
  'balcony-north':'M75 75H925V215H75Z',
  'balcony-south':'M75 1429H673V1564H75Z',
  'stairs3':'M575 895H673V1314H575Z'
 },
 '4':{
  'studio':'M75 110H428V757H75Z',
  'living2':'M75 777H865V891H741V1258H75Z',
  'stairs4':'M751 777H865V1258H751Z'
 },
 '-1':{'garage':'M95 480H905V1190H265V615H95Z'}
}
# Lighting spans the open thresholds; label containment remains unchanged.
plans['3']['lightingAreas']={
 'entrance':'M515 750H925V875H693V895H495V849H515Z',
 'kitchen':'M75 869H495V895H673V981H575V1050H75Z'
}
for floor_id,plan in plans.items():
 for room in plan['rooms']:room['area']=label_areas[floor_id][room['id']]
for key,p in plans.items():(ROOT/'assets'/f'piso-{key}.svg').write_text(p['svg'].replace('href="assets/','href="'))
(ROOT/'plans.js').write_text('/* Generated by generate-plans.py; geometry is native SVG. */\nwindow.CasaPlans='+json.dumps(plans,ensure_ascii=False)+';\n')
