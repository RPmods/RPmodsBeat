import json, subprocess
from pathlib import Path
import numpy as np
from scipy import signal, ndimage
root=Path(__file__).resolve().parents[1]; folder=root/'assets/nakano'
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(folder/'song.mp3'),'-ar','22050','-ac','2','-f','f32le','-']); x=np.frombuffer(raw,dtype=np.float32).reshape(-1,2); sr=22050; hop=220
f,t,z=signal.stft(x.mean(axis=1),sr,nperseg=1024,noverlap=1024-hop); _,_,side=signal.stft((x[:,0]-x[:,1])/2,sr,nperseg=1024,noverlap=1024-hop)
a=np.abs(z); side=np.abs(side); h=ndimage.median_filter(a,size=(1,13)); perc=ndimage.median_filter(a,size=(13,1)); v=h*(h/(h+perc+1e-7))**1.5*np.clip((a-side*.7)/(a+1e-7),0,1); band=(f>=230)&(f<=3300); v=v[band]; energy=np.sqrt(np.mean(v*v,axis=0)); log=np.log1p(v*2500); flux=np.maximum(np.diff(log,prepend=log[:,:1],axis=1),0).mean(axis=0); flux=ndimage.gaussian_filter1d(flux,1.5); smooth=ndimage.gaussian_filter1d(energy,20); dur=len(x)/sr
# Detect centered harmonic activity; this is an estimate, not isolated vocals.
base=np.quantile(smooth,.32); active=ndimage.binary_closing(smooth>base,structure=np.ones(65)); active=ndimage.binary_opening(active,structure=np.ones(45)); active[:int(8*sr/hop)]=False; active[t>dur-10]=False
edges=np.flatnonzero(np.diff(np.r_[False,active,False])); phrases=[[round(float(t[min(a,len(t)-1)]),3),round(float(t[min(b-1,len(t)-1)]),3)] for a,b in zip(edges[::2],edges[1::2]) if b-a>75]; print('phrases',phrases)
peaks,_=signal.find_peaks(flux,distance=9,prominence=np.quantile(flux,.55)*.10); peaks=[i for i in peaks if any(a<=t[i]<=b for a,b in phrases)]; charts={}
for level,gap,quant in [('easy',.53,.38),('normal',.31,.16),('hard',.20,.03)]:
 threshold=np.quantile(flux[peaks],quant); arr=[]; pattern=['left','right','up','down','right','left','down','up']; last=-99
 for i in peaks:
  ts=round(float(t[i]-.025),3)
  if flux[i]<threshold or ts-last<gap or not any(a<=ts<=b for a,b in phrases):continue
  arr.append({'t':ts,'d':pattern[len(arr)%len(pattern)],'hold':0});last=ts
 charts[level]=arr
print('counts', {k:len(v) for k,v in charts.items()}); onset=ndimage.gaussian_filter1d(flux,1); corr=signal.correlate(onset-onset.mean(),onset-onset.mean(),mode='full')[len(onset)-1:]; lags=np.arange(32,76); bpm=60/(lags[np.argmax(corr[lags])]*hop/sr); excluded=[[0,phrases[0][0]]]+[[a[1],b[0]] for a,b in zip(phrases,phrases[1:]) if b[0]-a[1]>.7]+[[phrases[-1][1],dur]]
data=dict(title='Because It Was You',artist='Nakano-ke no Itsutsugo',duration=round(dur,3),bpm=round(float(bpm),2),notes=charts['normal'],phrases=phrases,introEnd=phrases[0][0],outroStart=phrases[-1][1],excluded=excluded,method='Centered harmonic activity and onset detection from full mix; estimated voice timing, not isolated vocals.',revision=1,celebration=[0,round(dur,3)],charts=charts)
(folder/'chart.json').write_text(json.dumps(data,ensure_ascii=False,indent=2));(folder/'chart.js').write_text('window.NAKANO_CHART='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';')
