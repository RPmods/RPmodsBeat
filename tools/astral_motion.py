from pathlib import Path
from PIL import Image
import numpy as np
import cv2
A=Path(__file__).resolve().parents[1]/'assets'; chars=['ruby','neko','guizz','meli']; poses=['idle','ready','left','right','up','down','perfect','miss','victory']; Y,X=np.mgrid[:480,:480].astype('float32')
colors={'mint':(91,205,168),'violet':(150,113,230),'gold':(230,180,67),'rose':(225,110,166),'galaxy':(116,150,235)}
for pose in poses:
 f=A/'hd'/f'meli-{pose}.png'; a=np.array(Image.open(f).convert('RGBA')); n,lab,stats,_=cv2.connectedComponentsWithStats((a[:,:,3]>40).astype('uint8')); main=1+stats[1:,4].argmax(); top=stats[main,1];bot=top+stats[main,3]; rem=np.zeros(lab.shape,'uint8')
 for i in range(1,n):
  if i!=main and (stats[i,1]>bot-5 or (stats[i,1]>bot-30 and stats[i,4]<130)):rem[lab==i]=1
 rem=(cv2.dilate(rem,np.ones((3,3),'uint8'))>0)&(lab!=main)
 for file in [f,*list((A/'cosmetics').glob(f'meli-{pose}-*.png'))]:
  ar=np.array(Image.open(file).convert('RGBA'));ar[rem]=0;Image.fromarray(ar).save(file)
 a=np.array(Image.open(f).convert('RGBA')); r,g,b=a[:,:,:3].astype(float).transpose(2,0,1); hat=(Y<top+115)&(r>g*1.24+8)&(r>b*1.18+6)&(a[:,:,3]>0)
 n,lab,stats,_=cv2.connectedComponentsWithStats(hat.astype('uint8'))
 if n>1:hat=(cv2.dilate((lab==1+stats[1:,4].argmax()).astype('uint8'),np.ones((3,3),'uint8'))>0)&hat
 for name,color in colors.items():
  f2=A/'cosmetics'/f'meli-{pose}-cloth-{name}.png'; mask=np.array(Image.open(f2).convert('RGBA'));v=np.maximum.reduce([r,g,b])/255;rgb=np.clip(np.array(color)[None,None,:]*(.33+.92*v[:,:,None]),0,255).astype('uint8');mask[hat,:3]=rgb[hat];mask[hat,3]=a[hat,3];Image.fromarray(mask).save(f2)
for c in chars:
 src=A/'hd'/f'{c}-idle.png'; ar=np.array(Image.open(src).convert('RGBA')); yy,xx=np.where(ar[:,:,3]>40); top,bottom=yy.min(),yy.max(); height=max(1,bottom-top); z=np.clip((bottom-Y)/height,0,1); mid=np.exp(-((Y-(top+height*.48))/(height*.27))**2)
 for j,name in enumerate(['rest-sway','rest-breathe','rest-bow']):
  if j==0: dx=11*z*z;dy=-2*mid
  elif j==1:dx=(X-240)*.022*mid;dy=-4*z+2*mid
  else:dx=-9*z*z;dy=9*z*z
  for f in [src,*sorted((A/'cosmetics').glob(f'{c}-idle-*.png'))]:
   a=cv2.imread(str(f),cv2.IMREAD_UNCHANGED);out=cv2.remap(a,(X-dx).astype('float32'),(Y-dy).astype('float32'),cv2.INTER_LINEAR);target=f.with_name(f.name.replace(f'{c}-idle',f'{c}-{name}',1));cv2.imwrite(str(target),out)
print('rest poses and masks generated')
