from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np
from scipy.ndimage import label,find_objects,binary_dilation
A=Path(__file__).resolve().parents[1]/'assets'; poses=['idle','ready','left','right','up','down','perfect','miss','victory']; chars=['ruby','neko','guizz','meli']
# Clean disconnected remnants of adjacent sprite cells, then align all corresponding masks.
for c in ['meli','guizz']:
 for p in poses:
  path=A/'hd'/f'{c}-{p}.png'; im=Image.open(path).convert('RGBA'); a=np.array(im); lab,n=label(a[:,:,3]>35); counts=np.bincount(lab.ravel()); counts[0]=0; main=lab==counts.argmax(); yy,xx=np.where(main); dx=round(240-(xx.min()+xx.max())/2)
  bad=np.zeros(main.shape,bool)
  for i,sl in enumerate(find_objects(lab),1):
   if sl and i!=counts.argmax() and sl[0].start>=445:bad|=lab==i
  bad=binary_dilation(bad,iterations=2)
  for f in [path,*list((A/'cosmetics').glob(f'{c}-{p}-*.png'))]:
   arr=np.array(Image.open(f).convert('RGBA'));arr[bad]=0; old=Image.fromarray(arr); new=Image.new('RGBA',old.size);new.paste(old,(dx,0));new.save(f,optimize=True)
# Pose-aligned textile patterns. Preserve original shading and outline using the garment mask.
colors={'ruby':(np.array([201,74,181]),np.array([85,117,255])),'neko':(np.array([64,193,239]),np.array([131,85,232])),'guizz':(np.array([122,75,239]),np.array([72,214,234])),'meli':(np.array([180,67,150]),np.array([60,182,162]))}
for c in chars:
 for pi,p in enumerate(poses):
  base=Image.open(A/'hd'/f'{c}-{p}.png').convert('RGBA'); arr=np.array(base); mask=np.array(Image.open(A/'cosmetics'/f'{c}-{p}-cloth-violet.png').convert('RGBA'))[:,:,3]; y,x=np.indices(mask.shape); v=arr[:,:,:3].max(2)/255.; ca,cb=colors[c]; q=(np.sin(x*.025+y*.018)+np.sin(y*.043-x*.014)+2)/4; rgb=(ca[None,None,:]*q[:,:,None]+cb[None,None,:]*(1-q[:,:,None]))*(.30+.9*v[:,:,None]); rgb=np.clip(rgb,0,255).astype('uint8'); out=Image.fromarray(np.dstack((rgb,mask)),'RGBA'); stars=Image.new('RGBA',base.size); d=ImageDraw.Draw(stars); rng=np.random.default_rng(120+pi)
  for _ in range(300):
   X,Y=rng.integers(0,480,2)
   if mask[Y,X]>190:
    r=int(rng.choice([1,1,2,3]));d.ellipse((X-r,Y-r,X+r,Y+r),fill=(220,243,255,180));
    if r==3:d.line((X-5,Y,X+5,Y),fill=(245,235,255,190));d.line((X,Y-5,X,Y+5),fill=(245,235,255,190))
  sa=np.array(stars);sa[:,:,3]=np.minimum(sa[:,:,3],mask);out=Image.alpha_composite(out,Image.fromarray(sa));out.save(A/'cosmetics'/f'{c}-{p}-cloth-galaxy.png',optimize=True)
# Independent halo artwork (behind sprite), aligned to square canvas.
for c,(a,b) in colors.items():
 h=lambda rgb:'#'+''.join(f'{int(k):02x}' for k in rgb)
 star=''.join(f'<path d="M{x} {y-7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#e9eaff" opacity=".85"/>' for x,y in [(65,110),(403,100),(65,335),(414,320),(115,60),(355,375)])
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480"><defs><radialGradient id="g"><stop stop-color="{h(a)}" stop-opacity=".05"/><stop offset=".68" stop-color="{h(b)}" stop-opacity=".28"/><stop offset="1" stop-color="{h(a)}" stop-opacity="0"/></radialGradient><linearGradient id="r"><stop stop-color="{h(a)}"/><stop offset=".5" stop-color="#d7eaff"/><stop offset="1" stop-color="{h(b)}"/></linearGradient></defs><ellipse cx="240" cy="236" rx="220" ry="220" fill="url(#g)"/><g fill="none" stroke="url(#r)"><ellipse cx="240" cy="235" rx="179" ry="179" stroke-width="2" opacity=".8"/><ellipse cx="240" cy="235" rx="194" ry="90" transform="rotate(-35 240 235)" stroke-width="3" opacity=".8"/><ellipse cx="240" cy="235" rx="204" ry="203" stroke-dasharray="2 14" stroke-width="3" opacity=".65"/></g>{star}</svg>'
 (A/'ui'/f'galaxy-{c}.svg').write_text(svg)
