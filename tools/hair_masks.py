from pathlib import Path
from PIL import Image
import numpy as np
from scipy.ndimage import gaussian_filter
A=Path(__file__).resolve().parents[1]/'assets'
poses=['idle','ready','left','right','up','down','perfect','miss','victory']
limits={'ruby':[236,231,244,244,207,331,232,243,235],'neko':[241,237,248,251,214,321,237,250,238]}
# Keep skin, eyes, accessories and clothing out of the red/burgundy region, per pose.
for c in limits:
 for i,p in enumerate(poses):
  im=Image.open(A/'hd'/f'{c}-{p}.png').convert('RGBA');a=np.array(im);hsv=np.array(im.convert('RGB').convert('HSV'));h,s,v=hsv.transpose(2,0,1);yy,xx=np.indices(h.shape)
  cy=limits[c][i];mask=((h<14)|(h>215))&(s>48)&(v<205)&(yy<cy)&(xx>90)&(xx<390)&(a[:,:,3]>0)
  # remove central eye and facial area without affecting bangs: use existing eye masks, plus lower face central ellipse.
  eye=np.array(Image.open(A/'cosmetics'/f'{c}-{p}-eyes-aqua.png'))[:,:,3]>0;mask &= ~eye
  # protect clothes in raised-arm poses and decorative marks beyond the hair silhouette
  if p=='up':mask &= ~((yy>145)&((xx<180)|(xx>308)))
  if p=='victory':mask &= ~((xx>302)&(yy>110))
  if p=='down':mask &= ~((yy>280)&(xx>190)&(xx<304))
  # mask clothes already authored; priority is garment accuracy
  cloth=np.array(Image.open(A/'cosmetics'/f'{c}-{p}-cloth-mint.png'))[:,:,3]>0;mask &= ~cloth
  for name,hue in {'plum':205,'ocean':150,'emerald':111,'peach':15}.items():
   hh=hsv.copy();hh[:,:,0]=hue;rgb=np.array(Image.fromarray(hh,'HSV').convert('RGB'));alpha=np.where(mask,a[:,:,3],0).astype('uint8');rgb[alpha==0]=0;Image.fromarray(np.dstack([rgb,alpha]),'RGBA').save(A/'cosmetics'/f'{c}-{p}-hair-{name}.png',optimize=True)
