from PIL import Image
import numpy as np
from pathlib import Path
A=Path(__file__).resolve().parents[1]/'assets'; out=A/'cosmetics';out.mkdir(exist_ok=True)
poses=['idle','ready','left','right','up','down','perfect','miss','victory']
# Region masks per pose, constrained by original hue and saturation; clothing and iris separate.
ymin=[250,237,247,250,190,318,233,238,222]; ymax=[337,318,320,332,255,366,294,329,299]
# eye region bounds estimated from the pose atlas, x/y per character
ruby=[(185,300,166,215),(183,307,160,210),(164,222,167,215),(292,344,177,224),(192,310,125,173),(183,302,253,293),None,(178,310,185,221),None]
neko=[(183,302,162,204),(183,307,158,204),(158,233,163,207),(287,347,175,218),(191,308,132,176),(183,305,236,275),None,(181,306,201,233),None]
for c in ['ruby','neko']:
 for i,p in enumerate(poses):
  im=Image.open(A/'hd'/f'{c}-{p}.png').convert('RGBA'); a=np.array(im); hsv=np.array(im.convert('RGB').convert('HSV'));h,s,v=hsv.transpose(2,0,1);yy,xx=np.indices(h.shape)
  color=((h<15)|(h>225)) if c=='ruby' else ((h>145)&(h<195)); mask=color&(s>75)&(yy>=ymin[i])&(yy<=ymax[i])&(a[:,:,3]>0)
  if c=='neko':mask=color&(s>65)&(yy>155)&(yy<390)&(a[:,:,3]>0)
  else:mask &= v<194
  if p=='victory' and c=='ruby':mask |= color&(s>100)&(xx>300)&(yy>120)&(yy<245)&(a[:,:,3]>0)
  eye=np.zeros(h.shape,bool); region=(ruby if c=='ruby' else neko)[i]
  centers={
   'ruby':[[(214,193,12,15),(274,193,12,15)],[(214,184,12,15),(276,184,12,15)],[(184,194,9,15)],[(294,201,9,15)],[(219,149,12,15),(281,145,12,15)],[(230,273,12,14),(288,272,11,14)],[],[(212,204,12,9),(273,201,12,9)],[]],
   'neko':[[(213,187,12,14),(272,187,12,14)],[(212,184,12,14),(271,184,12,14)],[(167,180,8,12),(206,186,10,14)],[(279,190,10,14),(320,187,8,12)],[(216,158,12,14),(274,155,12,14)],[(213,266,12,13),(271,266,12,13)],[],[(210,218,12,9),(268,217,12,9)],[]]
  }[c][i]
  for cx,cy,rx,ry in centers:
   eye |= (((xx-cx)/rx)**2+((yy-cy)/ry)**2<=1)&(s>90)&(v>60)&(v<235)&((h<37)|(h>230))&(a[:,:,3]>0)
  for category,m,colors in [('cloth',mask,{'mint':112,'violet':191,'gold':26,'rose':240}),('eyes',eye,{'aqua':135,'amber':28,'violet':194})]:
   for name,newh in colors.items():
    hh=hsv.copy();hh[:,:,0]=newh; rgb=np.array(Image.fromarray(hh,'HSV').convert('RGB')); alpha=np.where(m,a[:,:,3],0).astype('uint8'); rgb[alpha==0]=0; Image.fromarray(np.dstack([rgb,alpha]),'RGBA').save(out/f'{c}-{p}-{category}-{name}.png',optimize=True)
