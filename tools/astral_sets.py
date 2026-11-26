from pathlib import Path
from PIL import Image
import numpy as np
A=Path(__file__).resolve().parents[1]/'assets'; y,x=np.mgrid[:480,:480]; chars=['ruby','neko','guizz','meli']; patterns={'epic-ocean':('mint',(120,240,230),0),'epic-dream':('violet',(231,196,255),1),'legend-nebula':('violet',(220,197,255),2),'legend-rose':('rose',(255,196,220),3)}
for c in chars:
 for file in sorted((A/'hd').glob(c+'-*.png')):
  pose=file.stem[len(c)+1:]
  for name,(color,accent,k) in patterns.items():
   src=A/'cosmetics'/f'{c}-{pose}-cloth-{color}.png'; a=np.array(Image.open(src).convert('RGBA'));rgb=a[:,:,:3].astype(float)
   if k==0: pat=(np.abs(np.sin(x*.095+y*.045))<.10)*.36
   elif k==1:pat=(np.abs(np.sin(x*.08)*np.sin(y*.075))>.86)*.28
   elif k==2:pat=((np.abs(np.sin((x+y)*.055))<.065)|(np.abs(np.sin((x-y)*.055))<.065))*.36
   else:pat=(np.cos(x*.07)*np.cos(y*.07)>.83)*.38
   pat=pat[:,:,None];a[:,:,:3]=np.clip(rgb*(1-pat)+np.array(accent)*pat,0,255).astype('uint8'); Image.fromarray(a).save(A/'cosmetics'/f'{c}-{pose}-cloth-{name}.png')
print('192 patterned garment masks generated')
