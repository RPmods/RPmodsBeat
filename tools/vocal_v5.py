"""Rebuild fixed charts from isolated vocals, no random directions or instrumental grid."""
import json, sys, subprocess
from pathlib import Path
import numpy as np
from scipy import signal, ndimage
A=Path(__file__).resolve().parents[1]/'assets'; c=json.loads((A.parent/'tools'/'v04-chart.json').read_text()); sr=22050; hop=220
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
f,t,z=signal.stft(x,sr,nperseg=1024,noverlap=1024-hop); m=abs(z); bands=[(120,450),(450,1300),(1300,3000),(3000,6500)]
env=ndimage.gaussian_filter1d(np.sqrt((m[(f>120)&(f<6500)]**2).sum(0)),1.8); ref=np.percentile(env,90)
allowed=((t>=16)&(t<90))|((t>=92)&(t<153))|((t>=166)&(t<240))
active=(env>ref*.09)&allowed; active=ndimage.binary_closing(active,np.ones(9));active=ndimage.binary_opening(active,np.ones(8))&allowed
# Multi-band positive spectral change and local adaptive baseline.
features=[]
for lo,hi in bands:
 v=np.log1p(m[(f>=lo)&(f<hi)]*1000); d=np.maximum(0,np.diff(v,axis=1,prepend=v[:,:1])).mean(0); features.append(d/max(np.percentile(d[active],90),1e-6))
flux=ndimage.gaussian_filter1d(np.mean(features,axis=0),1); baseline=ndimage.median_filter(flux,size=51); novelty=np.maximum(0,flux-baseline*.78)
peaks,_=signal.find_peaks(novelty,distance=11,prominence=.075); peaks=[i for i in peaks if active[i] and env[i]>ref*.11 and novelty[i]>.12]
edges=np.flatnonzero(np.diff(np.r_[False,active,False])); regions=[(a,b) for a,b in zip(edges[::2],edges[1::2]) if b-a>=11]
# Include first syllable of each separated vocal phrase; stronger consonants get priority.
candidates=[(float(t[i]),float(novelty[i])+.12*min(2,env[i]/ref),False) for i in peaks]
for a,b in regions:
 if b-a>=18:
  j=a+int(np.argmax(novelty[a:min(b,a+12)]));candidates.append((float(t[j]),max(.66,float(novelty[j])),True))
# Hold only if a long sustained voiced span is present in previous pitch analysis AND no internal reattack in new onset analysis.
oldholds=[n for n in c['notes'] if n['hold']>=.85]; holds=[]
for n in oldholds:
 a=n['t'];end=a+n['hold']; inner=[i for i in peaks if a+.19<t[i]<end-.12 and novelty[i]>.32];
 if not inner and n['hold']>=.85:holds.append((a,end-a))
# Build separate difficulty maps. Use consistent directional patterns by phrase and avoid accidental overlaps.
charts={}; patterns=[['left','right','up','down'],['up','up','right','left'],['down','left','up','right'],['right','down','left','up'],['left','up','right','up'],['down','right','down','left']]
for level,gap,cut in [('easy',.48,.48),('normal',.29,.32),('hard',.19,.21)]:
 accepted=[]
 for a,d in holds:
  if level!='easy':accepted.append((a,d,3))
 for a,strength,first in sorted(candidates,key=lambda q:(-q[1],q[0])):
  if not (16<=a<90 or 92<=a<153 or 166<=a<240) or (strength<cut and not first):continue
  if any(z-gap<a<z+d+gap for z,d,_ in accepted):continue
  accepted.append((a,0,strength))
 accepted.sort(); notes=[]; group=-1; step=0; prev=-10
 for a,d,strength in accepted:
  if a-prev>1.05 or step>=8:group+=1;step=0
  # Directions are authored repeating movement phrases, not tied to arbitrary timestamp modulo.
  pat=patterns[group%len(patterns)] if level!='easy' else patterns[(group//2)%len(patterns)]
  notes.append(dict(t=round(a,3),d=pat[step%4],hold=round(d,3)));prev=a+d;step+=1
 # Cross-correlation against the original mix measured a -20 ms guide offset.
 for n in notes:
  start=16 if n['t']<90 else 92 if n['t']<153 else 166
  n['t']=round(max(start,n['t']-.02),3)
 charts[level]=notes
c['charts']=charts;c['notes']=charts['normal'];c['phrases']=[[round(float(t[a]),3),round(float(t[min(b,len(t)-1)]),3)] for a,b in regions];c['method']='V5 independent difficulty maps: isolated vocal multiband spectral onsets, adaptive novelty, phrase attacks, deterministic movement motifs, conservative held notes; manual listening validation pending.';c['guideOffsetMs']=-20;c['revision']={k:{'notes':len(v),'holds':sum(bool(n['hold']) for n in v)} for k,v in charts.items()};(A/'vocal-chart.json').write_text(json.dumps(c,ensure_ascii=False,indent=2));(A/'chart.js').write_text('window.CHART='+json.dumps(c,ensure_ascii=False,separators=(',',':'))+';');print(c['revision'])
