from PIL import Image
from pathlib import Path
import numpy as np
from scipy.ndimage import label
import sys
A=Path(__file__).resolve().parents[1]/'assets'/'hd'; A.mkdir(exist_ok=True)
poses=['idle','ready','left','right','up','down','perfect','miss','victory']
for name,src in zip(['ruby','neko'],sys.argv[1:]):
 im=Image.open(src).convert('RGBA'); w,h=im.size
 for i,pose in enumerate(poses):
  x,y=i%3,i//3; cell=im.crop((round(x*w/3),round(y*h/3),round((x+1)*w/3),round((y+1)*h/3)))
  a=np.array(cell); labs,n=label(a[:,:,3]>40); counts=np.bincount(labs.ravel()); counts[0]=0; main=counts.argmax(); ys,xs=np.where(labs==main)
  # use body component as the alignment anchor, retain nearby decorative elements
  cx=(xs.min()+xs.max()+1)/2; bottom=ys.max()+1
  if pose=='up': bottom=410 # keep jump above the common floor
  canvas=Image.new('RGBA',(480,480)); canvas.paste(cell,(round(240-cx),round(450-bottom)))
  canvas.save(A/f'{name}-{pose}.png')
