"""Deterministic vocal stem chart. Usage: python tools/stem_chart.py path/to/vocals.mp3.
Times are estimates from the supplied stem, with explicit author-specified exclusions."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from scipy import signal, ndimage
A=Path(__file__).resolve().parents[1]/'assets'; sr=16000; hop=160; win=1024
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
f,t,z=signal.stft(x,sr,nperseg=win,noverlap=win-hop); mag=abs(z); band=(f>=130)&(f<=4500); m=mag[band]; rms=np.sqrt(np.sum(m*m,axis=0)); env=ndimage.gaussian_filter1d(rms,3)
# robust threshold for a separated stem, preserving quiet phrases
ref=np.percentile(env,90); active=env>ref*.085
active=ndimage.binary_closing(active,np.ones(19)); active=ndimage.binary_opening(active,np.ones(12))
allowed=((t>=16)&(t<90))|((t>=92)&(t<153))|((t>=166)&(t<240)); active &= allowed
# spectral attacks, not instrumental beat grid
log=np.log1p(m*800); flux=ndimage.gaussian_filter1d(np.maximum(0,np.diff(log,axis=1,prepend=log[:,:1])).mean(0),1.5)
peaks,_=signal.find_peaks(flux,distance=25,prominence=max(.001,np.percentile(flux[active],65)*.48));
# estimate pitch periodicity from autocorrelation, for sustained vocal segments
frames=np.lib.stride_tricks.sliding_window_view(np.pad(x,(512,512)),1024)[::hop][:len(t)]
# avoid excessive RAM: calculate in batches
pitch=np.zeros(len(t)); periodic=np.zeros(len(t))
for i in range(0,min(len(t),len(frames)),512):
 q=frames[i:i+512]*np.hanning(1024); q-=q.mean(axis=1,keepdims=True); ac=np.fft.irfft(abs(np.fft.rfft(q,n=2048))**2,n=2048); part=ac[:,20:116]; ix=np.argmax(part,axis=1); periodic[i:i+len(q)]=part[np.arange(len(q)),ix]/np.maximum(ac[:,0],1e-9); pitch[i:i+len(q)]=sr/(ix+20)
# identify stable voiced spans; duration and stability matter, not simply loudness
smooth=ndimage.median_filter(pitch,size=7); semis=12*np.log2(np.maximum(smooth,1)); slope=np.abs(semis-ndimage.shift(semis,10,order=0)); stable=active&(periodic>.46)&(env>ref*.14)&(slope<1.5)
stable=ndimage.binary_closing(stable,np.ones(9)); stable &= active
edges=np.flatnonzero(np.diff(np.r_[False,stable,False])); holds=[]
for a,b in zip(edges[::2],edges[1::2]):
 if b-a>=63:
  st=t[a]+.025; en=min(t[min(b,len(t)-1)]-.04,st+2.2)
  if en-st>=.55: holds.append((st,en))
# tap candidates: vocal attack peaks and starts after true gaps. Minimum .34s separation.
edges=np.flatnonzero(np.diff(np.r_[False,active,False])); phrases=[[round(float(t[a]),3),round(float(t[min(b,len(t)-1)]),3)] for a,b in zip(edges[::2],edges[1::2]) if b-a>=12]
candidates=[(float(t[p]),0,float(flux[p])) for p in peaks if active[p] and env[p]>ref*.12]
for a,b in phrases:
 if b-a>.30: candidates.append((a+.045,0,1))
for a,b in holds: candidates.append((float(a),float(b-a),2))
# prefer holds; filter competing taps within sustained interval or near edges
hold_candidates=[c for c in candidates if c[1]>0]; accepted=[]
for c in sorted(hold_candidates):
 if not accepted or c[0]>=accepted[-1][0]+accepted[-1][1]+.34: accepted.append(c)
for c in sorted((c for c in candidates if c[1]==0),key=lambda c:(-c[2],c[0])):
 if not any(c[0]>=a-.34 and c[0]<=a+d+.34 for a,d,_ in accepted): accepted.append(c)
accepted.sort(); patterns=['left','up','right','down','right','up','left','down','up','right','down','left']; notes=[]
for i,(a,d,v) in enumerate(accepted):
 if not (16<=a<90 or 92<=a<153 or 166<=a<240):continue
 end=90 if a<90 else 153 if a<153 else 240; d=min(d,end-a-.02); d=d if d>=.55 else 0
 notes.append(dict(t=round(a,3),d=patterns[i%len(patterns)],hold=round(d,3),easy=i%2==0 or d>0))
old=json.loads((A/'vocal-chart.json').read_text()); out=dict(title=old['title'],artist=old['artist'],duration=old['duration'],bpm=old['bpm'],notes=notes,phrases=phrases,introEnd=16,outroStart=240,excluded=[[0,16],[90,92],[153,166],[240,old['duration']]],method='Vocal stem RMS, spectral flux, autocorrelation pitch stability; editorial exclusions; deterministic directions. Manual listening review pending.')
(A/'vocal-chart.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));(A/'chart.js').write_text('window.CHART='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';'); print('notes',len(notes),'holds',sum(n['hold']>0 for n in notes),'easy',sum(n['easy'] for n in notes),'phrases',len(phrases)); print('holds',[(n['t'],n['hold']) for n in notes if n['hold']])
