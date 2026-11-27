from PIL import Image,ImageDraw,ImageFilter,ImageColor
import numpy as np, cv2, json
from pathlib import Path
r=Path(__file__).resolve().parents[1]; out=r/'assets/rig';out.mkdir(exist_ok=True)
# Coordinates in each original 480px canonical artwork; masks never use a different pose.
# face polygon protects skin, mouth and eye whites; clothing excludes skin and jewelry.
meta={
'ruby':dict(neck=[240,232],head=235,shoulders=[[203,251],[277,251]],elbows=[[181,288],[299,288]],hands=[[165,320],[315,320]],hips=[[220,340],[260,340]],knees=[[220,385],[260,385]],floor=438,eyes=[[214,185,15,18],[275,185,15,18]],face=[[199,152],[218,144],[242,183],[261,148],[287,155],[296,190],[279,218],[240,232],[200,217],[185,194]],hairY=240),
'neko':dict(neck=[240,226],head=230,shoulders=[[207,243],[273,243]],elbows=[[182,281],[298,281]],hands=[[163,313],[317,313]],hips=[[221,335],[259,335]],knees=[[220,382],[260,382]],floor=438,eyes=[[211,181,14,17],[273,181,14,17]],face=[[196,151],[219,143],[240,164],[260,145],[283,151],[295,183],[280,212],[240,226],[199,213],[185,188]],hairY=246),
'guizz':dict(neck=[240,242],head=245,shoulders=[[213,265],[267,265]],elbows=[[197,299],[283,299]],hands=[[177,337],[303,337]],hips=[[219,329],[261,329]],knees=[[219,380],[261,380]],floor=438,eyes=[[213,200,11,10],[268,199,12,11]],face=[[203,158],[222,145],[251,148],[275,148],[290,181],[283,215],[260,238],[225,240],[199,217],[189,196]],hairY=256),
'meli':dict(neck=[240,235],head=239,shoulders=[[209,266],[271,266]],elbows=[[184,294],[296,294]],hands=[[157,326],[323,326]],hips=[[223,350],[257,350]],knees=[[222,392],[258,392]],floor=438,eyes=[[211,190,12,15],[276,190,12,15]],face=[[195,159],[214,151],[239,191],[259,156],[284,155],[298,191],[281,221],[240,237],[200,220],[183,195]],hairY=247),
'zomby':dict(neck=[238,211],head=220,shoulders=[[203,239],[279,239]],elbows=[[181,281],[297,281]],hands=[[166,320],[308,320]],hips=[[219,331],[264,331]],knees=[[219,384],[264,384]],floor=442,eyes=[[228,171,12,9],[279,176,11,9]],face=[[190,155],[219,143],[245,146],[269,160],[289,162],[302,181],[292,202],[256,215],[224,210],[193,192],[181,177]],hairY=219)}
hair={'plum':'#8752b0','ocean':'#437ec4','emerald':'#368c72','peach':'#b76a42','silver':'#b9c1d4','rose':'#d379a2'}
eyes={'aqua':'#37c6d8','amber':'#e9a335','violet':'#9b62e5','emerald':'#43c87d','rose':'#e978ad'}
cloth={'mint':'#43a98c','violet':'#7660bf','gold':'#bb903c','rose':'#b34c79','blue':'#4779bd','crimson':'#b8334d','galaxy':'#4f55a0','legend-nebula':'#7159b2','legend-rose':'#af426c','epic-ocean':'#287e89','epic-dream':'#7953ac','zomby-starmap':'#47719e','zomby-void':'#3d4c9e','zomby-astral':'#a17a39','zomby-night':'#6d4592','zomby-nexus':'#4650a7'}
Y,X=np.mgrid[:480,:480]
def poly(points):
 im=Image.new('L',(480,480));ImageDraw.Draw(im).polygon([tuple(x) for x in points],fill=255);return np.array(im)/255.
def smooth(x):return np.clip(x,0,1)
def ellipse(x,y,rx,ry):return smooth((1-((X-x)/rx)**2-((Y-y)/ry)**2)*8)
def save(im,path):im.resize((768,768),Image.Resampling.LANCZOS).save(path,optimize=True)
for c,m in meta.items():
 d=out/c;d.mkdir(exist_ok=True);base=Image.open(r/'tools/rig-source'/f'{c}-idle.png').convert('RGBA');a=np.array(base);rgb=a[:,:,:3]/255.;alpha=a[:,:,3]/255.;hsv=cv2.cvtColor(rgb.astype('float32'),cv2.COLOR_RGB2HSV);h,s,v=hsv.transpose(2,0,1);skin=(h<48)&(s>.07)&(s<.62)&(v>.53);safe=smooth((alpha-.7)*3.5)
 # Color-select canonical hair; exclude the face region and hat/phones.
 face=poly(m['face']); eyeProtect=np.maximum.reduce([ellipse(e[0],e[1],e[2]+3,e[3]+3) for e in m['eyes']]); hm=(Y<m['hairY'])*(1-eyeProtect)*safe*(~skin)
 if c=='ruby':hm*=smooth((s-.18)*5)*((h<22)|(h>325))
 elif c=='neko':hm*=smooth((s-.16)*6)*((h>290)|(h<20))
 elif c=='meli':hm*=((h>55)&(h<175))*smooth((s-.12)*6)*(Y>88)
 else:hm*=smooth((.76-v)*5)*((h>175)&(h<330))*smooth((s-.06)*8)
 if c=='zomby':hm*=1-face*smooth((Y-152)/24)
 # Irises only; constrain both hue and ellipse, preserve reflections and pupils.
 em=np.maximum.reduce([ellipse(*e) for e in m['eyes']])*safe*smooth((v-.12)*8)*smooth((.98-v)*8)
 if c in ('ruby','neko'):em*=((h<45)|(h>320))*smooth((s-.22)*5)
 elif c=='guizz':em*=((h>225)&(h<315))*smooth((s-.17)*7)
 elif c=='meli':em*=smooth((.75-v)*6)*((h>38)&(h<185))
 else:em*=((h>175)&(h<285))*smooth((s-.10)*8)
 # Garment includes the red beret of Meli but preserves metal loops, skin and gloves/hands.
 cm=(Y>m['neck'][1]+3)*safe*(~skin)*smooth((.91-v)*6)
 if c=='ruby':cm*=((Y<355)&((s>.17)|(v<.38)))
 elif c=='neko':cm*=((Y<338)&(h>175)&(h<310))*smooth((s-.10)*7)
 elif c=='guizz':cm*=((Y<355)|(Y>382))*smooth((s-.08)*8)
 elif c=='meli':cm*=((Y<370)&((h<30)|(h>310)))*smooth((s-.20)*6);cm=np.maximum(cm,((Y<140)&((h<25)|(h>325)))*smooth((s-.30)*5)*safe)
 else:cm*=((Y>224)|(X>222))*smooth((s-.06)*8)
 hm*=1-(em>0);cm*=1-(hm>0);cm*=1-(em>0)
 masks={'hair':hm,'eyes':em,'cloth':cm};save(base,d/'base.png')
 for slot,variants in [('hair',hair),('eyes',eyes),('cloth',cloth)]:
  mask=masks[slot]; Image.fromarray(np.uint8(mask*255)).save(d/(slot+'-mask.png'))
  for k,col in variants.items():
   if k.startswith('zomby-') and c!='zomby':continue
   target=np.array(ImageColor.getrgb(col))/255.; th=cv2.cvtColor(target.reshape(1,1,3).astype('float32'),cv2.COLOR_RGB2HSV)[0,0]; nh=hsv.copy();nh[:,:,0]=th[0];nh[:,:,1]=np.clip(s*.43+th[1]*.65,0,.92);nh[:,:,2]=np.clip(v*(.82+.35*th[2])+(.07 if slot=='eyes' else .015),0,1)
   if k=='silver':nh[:,:,1]=s*.12;nh[:,:,2]=np.clip(v*1.35+.12,0,1)
   new=cv2.cvtColor(nh,cv2.COLOR_HSV2RGB);premium=k in ('galaxy','legend-nebula','legend-rose','epic-ocean','epic-dream') or k.startswith('zomby-')
   if premium and slot=='cloth':
    # Subtle embroidery printed into the garment, not a large shape above it.
    pattern=Image.new('L',(480,480));dr=ImageDraw.Draw(pattern);step=34 if k in ('galaxy','zomby-nexus') else 42
    for yy in range(236,444,step):
     for xx in range(145+(yy//step%2)*12,335,step):
      if 'void' in k:dr.line([(xx-7,yy),(xx,yy),(xx,yy+7),(xx+7,yy+7)],fill=160,width=1)
      else:dr.line([(xx-5,yy),(xx,yy-6),(xx+5,yy),(xx,yy+6),(xx-5,yy)],fill=150,width=1)
    pat=np.array(pattern)/255.*smooth((v-.12)*5)*.30;new=new*(1-pat[:,:,None])+np.array([.84,.79,.95])*pat[:,:,None]
   # RGB only within the exact alpha mask; no copied head/torso from another pose.
   overlay=np.dstack([np.uint8(np.clip(new,0,1)*255),np.uint8(np.clip(mask,0,1)*255)])
   save(Image.fromarray(overlay,'RGBA'),d/f'{slot}-{k}.png')
 (d/'rig.json').write_text(json.dumps(m,indent=2))
(r/'rig-data.js').write_text('window.CBRigData='+json.dumps(meta,separators=(',',':'))+';\n')
print('rig files',len(list(out.rglob('*.png'))))
# Facial attachments use the same master coordinates. Only the small mouth region
# is replaced, so the eyes, glasses, neck and garment never change with expression.
for c,(x,y,rx) in {'ruby':(244,214,10),'neko':(243,210,11),'guizz':(243,228,9),'meli':(245,221,11),'zomby':(257,197,9)}.items():
 d=out/c;base=Image.open(r/'tools/rig-source'/f'{c}-idle.png').convert('RGBA');a=np.array(base);mask=np.uint8(ellipse(x,y,rx+3,5)*255);clean=cv2.inpaint(a[:,:,:3],(mask>10).astype('uint8')*255,3,cv2.INPAINT_TELEA);blendmask=ellipse(x,y,rx+6,10)*smooth(a[:,:,3]/255.)
 for mood in ['happy','sad']:
  patch=Image.fromarray(np.dstack([clean,np.uint8(blendmask*255)]),'RGBA').resize((768,768),Image.Resampling.LANCZOS);draw=ImageDraw.Draw(patch);f=768/480;P=lambda xx,yy:(round(xx*f),round(yy*f));w=rx*.90
  if mood=='happy':
   pts=[P(x-w,y-1),P(x-w*.45,y+1),P(x+w*.45,y+1),P(x+w,y-1),P(x+w*.72,y+5),P(x+w*.3,y+8),P(x-w*.3,y+8),P(x-w*.72,y+5)]
   draw.polygon(pts,fill=(117,54,65,255));draw.line(pts+[pts[0]],fill=(91,49,55,255),width=1);draw.ellipse((*P(x-w*.40,y+4),*P(x+w*.4,y+7)),fill=(217,121,128,255))
  else:
   pts=[P(x-w,y+3),P(x-w*.65,y+1),P(x-w*.3,y-1),P(x,y-2),P(x+w*.3,y-1),P(x+w*.65,y+1),P(x+w,y+3)];draw.line(pts,fill=(119,71,76,255),width=2,joint='curve')
  patch.save(d/f'face-{mood}.png',optimize=True)
