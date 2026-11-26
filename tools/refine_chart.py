import json,sys,subprocess
from pathlib import Path
import numpy as np
from scipy import signal,ndimage
A=Path(__file__).resolve().parents[1]/'assets'; c=json.loads((A.parent/'tools'/'v03-chart.json').read_text());sr=16000;hop=160
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4');f,t,z=signal.stft(x,sr,nperseg=1024,noverlap=864);m=abs(z[(f>160)&(f<5500)]); env=ndimage.gaussian_filter1d(np.sqrt((m*m).sum(0)),2); l=np.log1p(m*1000); flux=ndimage.gaussian_filter1d(np.maximum(0,np.diff(l,axis=1,prepend=l[:,:1])).mean(0),1); ref=np.percentile(env,90); peaks,_=signal.find_peaks(flux,distance=16,prominence=np.percentile(flux[env>ref*.12],65)*.40); peaks=peaks[env[peaks]>ref*.12];
notes=[]; directions=['left','up','right','down','right','up','left','down']; splits=[]
for n in c['notes']:
 a=n['t'];d=n['hold']; end=a+d; inside=[float(t[i]) for i in peaks if a+.19<t[i]<end-.08];
 # Keep only genuinely long, clean sustains. Convert short or articulated holds to detected attacks.
 strong=any(flux[i]>np.percentile(flux[peaks],50)*.95 for i in peaks if a+.19<t[i]<end-.08)
 if d and (d<.90 or strong):
  times=[a]+[v for v in inside if v-a>=.19]; clean=[]
  for v in times:
   if not clean or v-clean[-1]>=.19:clean.append(v)
  # a short note with no attack is a tap, not a fabricated sustain
  for j,v in enumerate(clean):notes.append(dict(t=round(v,3),d=directions[(directions.index(n['d'])+j)%len(directions)],hold=0,easy=n['easy'] and j%2==0))
  splits.append([a,d,len(clean)])
 else:notes.append(n)
# Fill attack gaps in vocal phrases, not instrumental gaps, only if a distinct transient and no collision.
for i in sorted(peaks,key=lambda i:-flux[i]):
 v=float(t[i]);
 if not any(a<=v<b for a,b in c['phrases']) or any(a<=v<b for a,b in c['excluded']):continue
 if any(n['t']-.205<=v<=n['t']+n['hold']+.205 for n in notes):continue
 if flux[i]<np.percentile(flux[peaks],65):continue
 notes.append(dict(t=round(v,3),d=directions[int(v*10)%8],hold=0,easy=False))
notes.sort(key=lambda n:n['t']); c['notes']=notes;c['method']+=' | v04: short/reattacked sustains split using vocal spectral attacks; additional prominent attacks; manual review pending.';c['revision']={'splitHolds':splits,'originalNotes':253};c['celebration']={'start':75,'duration':12,'similarSection':226,'method':'Repeated vocal chroma estimate; manual chorus review pending'};(A/'vocal-chart.json').write_text(json.dumps(c,ensure_ascii=False,indent=2));(A/'chart.js').write_text('window.CHART='+json.dumps(c,ensure_ascii=False,separators=(',',':'))+';');print(len(notes),sum(n['hold']>0 for n in notes),len(splits))
