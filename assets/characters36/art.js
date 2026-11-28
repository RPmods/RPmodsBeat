/* Cherry Beat — original vector character masters, v36.
   Material colours affect only their own paths; all joints are independent drawings.
   Coordinates: 400 x 400; all five characters face the viewer. */
(function(root){
'use strict';
const cast={
 ruby:{name:'WizzSv',hair:['#351e2c','#9f1c3b','#f05b73'],cloth:['#5c0f29','#a82244','#ea627a'],eye:'#d72850',skin:['#f3ad9e','#ffe4d5'],dark:'#332335',accent:'#f4b8bd',vibe:1},
 neko:{name:'Keeylongas',hair:['#382235','#902f57','#e0789c'],cloth:['#222648','#4b518b','#9eabd6'],eye:'#aa543e',skin:['#e9aa99','#ffe7d5'],dark:'#322a3b',accent:'#d3dbf9',vibe:1.05},
 guizz:{name:'GuizzMurdock',hair:['#222336','#47466a','#9a9bd6'],cloth:['#262337','#584878','#bb8de3'],eye:'#855ac6',skin:['#d8a394','#f5d9c7'],dark:'#292337',accent:'#ddb1ff',vibe:.9},
 meli:{name:'Meli Meli',hair:['#283729','#4c654c','#a9c78a'],cloth:['#4a132a','#941e43','#d85879'],eye:'#71936f',skin:['#e8b4a1','#ffe6d8'],dark:'#3a2733',accent:'#d4c5b6',vibe:.85},
 zomby:{name:'Zombyexx',hair:['#242038','#494065','#aba2cb'],cloth:['#171d38','#344878','#799de0'],eye:'#6c92e0',skin:['#d3a49d','#f4d9d0'],dark:'#201e35',accent:'#d2c4ff',vibe:.82}
};
const hair={plum:['#352044','#824d9f','#daabec'],ocean:['#142f50','#356aa9','#99d9f7'],emerald:['#173b35','#39866e','#99e8c1'],peach:['#66322c','#bd6950','#ffd0a8'],silver:['#3d4055','#9198b5','#f4f3fa'],rose:['#612744','#c35d91','#ffc4dd']};
const cloth={mint:['#124d4c','#369b89','#a6f4d3'],violet:['#34205b','#8062b5','#cab8ff'],gold:['#65401c','#bb883c','#ffe0a0'],rose:['#632440','#b65383','#ffc1d6'],blue:['#1b375d','#4779b9','#a4cfff'],crimson:['#5a152c','#b42e50','#ff9aaa'],galaxy:['#232052','#4b4495','#81dff2'],'legend-nebula':['#36204e','#7648ac','#e3b7ff'],'legend-rose':['#6d2444','#ba568b','#ffd2e3'],'epic-ocean':['#153d62','#3e85a7','#a1f0e7'],'epic-dream':['#3a2b65','#765da5','#d5c4ff'],'zomby-starmap':['#182a49','#3d6099','#a0d9ff'],'zomby-void':['#1b1c45','#4e469a','#a2b4ff'],'zomby-astral':['#483321','#876436','#ffe09b'],'zomby-night':['#211a45','#544287','#c7afff'],'zomby-nexus':['#142d4b','#306d99','#a3faff']};
const eyes={aqua:'#41aebf',amber:'#d89c42',violet:'#9c72d9',emerald:'#4a9c70',rose:'#d66194'};
const icons=['crown','moon','heart','notes','bow','aura'];
const fxIcons={'legend-nebula':'crown','legend-rose':'moon','legend-midnight':'notes','epic-ocean':'moon','epic-dream':'notes','exotic-galaxy':'aura','zomby-starmap':'aura','zomby-void':'aura','zomby-astral':'aura','zomby-night':'aura','zomby-nexus':'aura'};
function appearance(c,l={}){const a=typeof l.accessory==='string'?l.accessory:'original';let outfit=a.startsWith('fx-')?a.slice(3):'original';if(!Object.hasOwn(fxIcons,outfit)||outfit.startsWith('zomby-')&&c!=='zomby')outfit='original';return {outfit,icon:fxIcons[outfit]||(icons.includes(a)?a:null),fx:fxIcons[outfit]==='aura'||a==='aura'?(outfit==='original'?'aura':outfit):null,cloth:l.cloth||'original'}}
function materials(c,l={}){const d=Object.hasOwn(cast,c)?cast[c]:cast.ruby;return {hair:Object.hasOwn(hair,l.hair)?hair[l.hair]:d.hair,cloth:Object.hasOwn(cloth,l.cloth)&&(!String(l.cloth).startsWith('zomby-')||c==='zomby')?cloth[l.cloth]:d.cloth,eye:Object.hasOwn(eyes,l.eyes)?eyes[l.eyes]:d.eye,skin:d.skin,dark:d.dark,accent:d.accent}}
const path=(d,f,stroke='#35283b',w=1.8,extra='')=>'<path d="'+d+'" fill="'+f+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round" '+extra+'/>';
const circle=(x,y,r,f,stroke='none',w=1)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'" stroke="'+stroke+'" stroke-width="'+w+'"/>';
const ellipse=(x,y,rx,ry,f,stroke='none',w=1)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'" stroke="'+stroke+'" stroke-width="'+w+'"/>';
const rect=(x,y,w,h,r,f,stroke='none',sw=1)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+f+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
const group=(id,s,t='')=>'<g data-part="'+id+'"'+(t?' transform="'+t+'"':'')+'>'+s+'</g>';
const star=(x,y,r,f)=>path('M'+x+' '+(y-r)+'Q'+(x+1)+' '+(y-1)+' '+(x+r)+' '+y+'Q'+(x+1)+' '+(y+1)+' '+x+' '+(y+r)+'Q'+(x-1)+' '+(y+1)+' '+(x-r)+' '+y+'Q'+(x-1)+' '+(y-1)+' '+x+' '+(y-r)+'Z',f,'none',0);
const gradient=(id,colors)=>'<linearGradient id="'+id+'" x1="0" y1="0" x2=".32" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="'+colors[2]+'"/><stop offset=".36" stop-color="'+colors[1]+'"/><stop offset="1" stop-color="'+colors[0]+'"/></linearGradient>';
function accessory(which,p,accent){const white='#fff0c8',ink='#514069';
 if(which==='crown')return group('accessory',path('M178 50L174 34L186 42L199 26L211 42L225 34L222 50Q200 57 178 50Z','#f8d489',ink,2)+path('M179 49Q200 55 221 49','none','#fff4bd',2)+circle(199,42,3,'#e878a4')+circle(181,38,2,white)+circle(219,38,2,white));
 if(which==='bow')return group('accessory',path('M256 67Q276 52 285 59L281 81Q269 85 256 73Q244 88 235 82L233 60Q246 56 256 67Z','#ef91bd',ink,1.8)+rect(252,64,9,12,3,'#c84e87',ink)+path('M255 77L247 96L256 92L264 98L261 77','#db6c9f',ink));
 if(which==='moon')return group('accessory',path('M278 82Q288 76 292 65Q300 89 283 99Q268 100 266 86Q272 91 278 82Z','#fbe5aa','#8777a5',1.5)+star(296,72,4,white)+star(269,104,3,accent));
 if(which==='heart')return group('accessory',path('M279 89C262 78 267 66 277 73C286 61 298 74 294 83L279 96Z','#ed8caf','#8e4a72',1.5)+path('M273 77Q276 72 279 78','none','#fff1f5',2));
 if(which==='notes')return group('accessory',path('M279 91V70L294 66V86','none',accent,3)+ellipse(274,91,6,4,accent)+ellipse(289,86,6,4,accent)+star(305,72,3,white));
 return ''
}
function aura(which,accent){
 const colors={'zomby-starmap':'#86c6ff','zomby-void':'#9d8cfa','zomby-astral':'#ffdf9b','zomby-night':'#c5a6ff','zomby-nexus':'#8eeafa','exotic-galaxy':'#a9e9ff'},a=colors[which]||accent;
 let s=ellipse(200,222,101,148,'none',a,1.1)+star(106,110,7,a)+star(294,118,6,a)+star(91,268,5,a)+star(307,244,5,a);
 if(which==='zomby-starmap')s+=path('M106 110L88 175L116 214L91 268M294 118L315 159L287 193L307 244','none',a,1.8)+[ [88,175],[116,214],[315,159],[287,193] ].map(([x,y])=>circle(x,y,3,a)).join('');
 else if(which==='zomby-void')s+=path('M200 22L321 128L333 252L200 389L67 252L79 128Z M200 46L307 138L317 248L200 365L83 248L93 138Z','none',a,1.5,'opacity=".62"');
 else if(which==='zomby-astral')s+=ellipse(200,222,112,130,'none',a,2)+ellipse(200,271,125,32,'none',a,1.4)+star(200,28,10,a)+star(200,378,7,a);
 else if(which==='zomby-night')s+=path('M82 195Q60 125 116 82Q81 131 110 195Q102 211 82 195Z',a,'none',0)+path('M318 195Q340 125 284 82Q319 131 290 195Q298 211 318 195Z',a,'none',0)+star(200,25,7,a);
 else if(which==='zomby-nexus')s+=path('M92 138L74 206L106 280L153 322M308 138L326 206L294 280L247 322','none',a,2,'stroke-dasharray="6 5"')+star(74,206,9,a)+star(326,206,9,a);
 else s+=path('M91 252Q200 306 309 252','none',a,1.4,'opacity=".6" stroke-dasharray="3 7"');
 return '<g opacity=".70">'+s+'</g>'
}
const hairstyles={
 ruby:{back:'M121 175Q92 162 108 139Q97 111 116 77Q142 44 198 45Q253 42 280 76Q302 112 289 138Q304 160 286 172L298 184Q278 196 267 187L270 202Q248 211 235 190L165 190Q145 207 131 199L134 185Q113 193 105 182Z',front:'M111 127Q100 84 132 61Q158 41 196 48Q241 34 274 63Q296 86 290 129L281 155L273 118Q252 107 241 85Q243 119 224 130Q210 119 203 100L193 129Q171 130 162 102Q145 128 128 140L124 164Q113 150 111 127Z',locks:'M132 71Q116 96 128 125M155 60Q139 93 145 113M182 54Q165 84 175 112M211 55Q221 81 218 111M249 62Q270 90 272 119'},
 neko:{back:'M114 172Q96 136 105 100Q107 55 157 43Q205 29 248 50Q293 67 297 115L290 179Q272 200 249 193L152 193Q121 204 114 172Z',front:'M110 129Q102 74 143 51Q181 34 219 48Q278 44 289 95L282 146L267 112Q248 94 239 82Q243 117 220 130Q211 115 202 97L194 126Q167 128 159 99Q146 119 128 136L124 161Z',locks:'M132 67Q116 100 128 130M161 51Q143 84 150 112M187 52Q178 81 183 114M218 54Q225 78 220 111M250 60Q276 87 276 115'},
 guizz:{back:'M108 144L94 135L108 123L91 111L110 100L101 81L124 84Q135 52 171 45Q194 30 212 46Q245 35 268 57L282 76L301 80L291 99L309 112L295 125L305 145L289 147Q299 168 281 180L288 194L262 186L253 204L144 204L131 189L111 194L119 177Q101 169 108 144Z',front:'M106 118L97 106L121 99L113 82L137 86Q154 46 199 45Q240 37 269 68L283 84L298 83L287 104L296 117L278 130L270 158L258 117Q246 98 239 78Q227 118 205 132Q198 107 197 91Q175 133 152 142L158 113Q136 130 122 153Z',locks:'M128 87Q145 62 168 61M167 54Q151 84 161 120M199 50Q193 81 181 104M225 54Q239 73 227 103M256 68Q263 94 271 117'},
 meli:{back:'M104 131Q98 80 132 54Q164 35 207 43Q275 35 290 102L300 176Q288 202 262 202L139 202Q108 199 98 178Z',front:'M105 132Q100 85 135 57Q161 41 204 47Q261 39 288 91L292 142L277 173L270 124Q254 102 249 82L238 124L225 124L212 89L201 123L188 124L175 89L163 123L147 124L141 92Q130 125 123 164Z',locks:'M128 75Q109 119 118 172M150 57Q137 87 148 115M181 54L177 111M212 54L215 111M243 56L244 111M268 77Q286 112 281 170'},
 zomby:{back:'M108 148Q90 135 102 120Q87 108 103 97Q91 79 116 72Q112 52 144 50Q151 31 177 42Q200 20 223 42Q250 31 261 50Q290 51 285 73Q313 77 297 98Q314 110 297 124Q309 140 290 152L299 173Q279 187 264 173L140 173Q120 187 101 171Z',front:'M107 127Q97 108 118 95Q101 80 127 70Q115 55 145 54Q149 38 179 49Q193 30 207 47Q235 35 251 53Q280 45 280 67Q303 75 285 95Q304 106 289 129L278 150Q268 118 258 106Q269 84 248 83Q226 84 225 110Q205 120 199 95Q188 120 171 111Q174 88 151 85Q127 84 139 107L122 150Z',locks:'M126 75Q144 56 158 70Q176 83 151 96M174 50Q195 62 185 86M205 50Q224 63 214 88M242 56Q262 69 249 86M276 82Q289 97 274 110'}
};
function eye(x,mirror,ink,iris){const t=mirror?'translate('+x+' 0) scale(-1 1)':'translate('+x+' 0)';return '<g transform="'+t+'">'+path('M-21 141Q-16 124 3 125Q20 127 23 143Q16 160 0 160Q-16 159 -21 141Z','#fff8f4',ink,2)+ellipse(1,144,13,15,iris,ink,1.2)+ellipse(1,143,6,10,'#302135')+path('M-9 151Q0 158 10 150','none','#ffffffa0',2)+circle(-4,136,4.7,'#fffaf7')+circle(7,149,2.3,'#fffaf7')+path('M-23 140Q-15 122 3 124Q17 125 23 137M-20 136L-26 130','none',ink,3.4)+'</g>'}
function head(c,p,m,a){const h=hairstyles[c],ink=m.dark,skin='url(#'+p+'skin)',hg='url(#'+p+'hair)',iris='url(#'+p+'eye)';
 let back=path(h.back,hg,ink,2.1)+path('M120 143Q128 181 147 187M280 143Q272 181 253 187','none',m.hair[0],1.5);
 if(c==='neko')back+=path('M121 81L111 40Q111 31 123 36L153 55M279 81L289 40Q289 31 277 36L247 55','#fbf0f4',ink,2.4)+path('M120 45L128 67L145 57ZM280 45L272 67L255 57Z','#e6a0bb',ink,1);
 let face=ellipse(128,150,12,16,skin,ink,1.6)+ellipse(272,150,12,16,skin,ink,1.6)+path('M134 94Q146 68 200 70Q254 68 266 94L267 148Q264 185 226 199Q200 209 174 199Q136 185 133 148Z',skin,ink,2.2)+ellipse(155,166,12,5,'#eaa29c88')+ellipse(245,166,12,5,'#eaa29c88')+path('M197 163Q200 166 203 163','none','#c2827d',1.5);
 const eyeHeight={ruby:1.06,neko:1,guizz:.87,meli:.92,zomby:.75}[c];face+=group('eyes-open','<g transform="translate(0 144) scale(1 '+eyeHeight+') translate(0 -144)">'+eye(169,false,ink,iris)+eye(231,true,ink,iris)+'</g>'+path('M148 119Q163 113 179 119M221 119Q237 113 252 119','none',m.hair[0],2.4));
 face+=group('eyes-closed',path('M149 144Q169 155 189 144M211 144Q231 155 251 144','none',ink,3.5),'') .replace('data-part="eyes-closed"','data-part="eyes-closed" display="none"');
 face+=group('mouth-neutral',path('M194 181Q200 185 206 181','none','#954f60',1.9));
 face+=group('mouth-happy',path('M190 178Q200 181 210 178Q209 190 200 191Q191 190 190 178Z','#80384b',ink,1.3)+ellipse(200,187,5,2.7,'#f7a0ad')).replace('data-part="mouth-happy"','data-part="mouth-happy" display="none"');
 face+=group('mouth-sad',path('M193 185Q200 179 207 185','none','#8e5260',2)).replace('data-part="mouth-sad"','data-part="mouth-sad" display="none"');
 let front=path(h.front,hg,ink,2.2)+path(h.locks,'none',m.hair[2],2,'opacity=".66"')+path('M143 65Q170 52 187 55M224 53Q246 56 261 69','none',m.hair[2],3.8,'opacity=".52"');
 if(c==='neko')front+=path('M112 125V107Q113 42 200 43Q287 42 288 107V125','none','#f7e9f3',9)+rect(107,113,19,43,9,'#f8edf6',ink,1.8)+rect(274,113,19,43,9,'#f8edf6',ink,1.8)+rect(111,119,7,31,3,'#d8accb')+rect(282,119,7,31,3,'#d8accb');
 if(c==='meli')front+=path('M115 80Q112 45 165 33Q226 18 264 42Q285 55 283 80Q209 53 115 80Z','url(#'+p+'cloth)',ink,2)+path('M121 75Q205 51 278 75','none','#2d2032',7)+[139,154,169].map((x,i)=>circle(x,69-i*3,5,'none','#e6d9d7',2)).join('');
 if(c==='zomby'||c==='meli')front+=path('M147 134Q167 127 191 133L190 153Q188 163 169 163Q150 163 148 152ZM209 133Q233 127 253 134L252 152Q250 163 231 163Q212 163 210 153ZM191 138Q200 132 209 138','none',c==='zomby'?'#b9b0db':'#b7a7a8',2.1)+path('M151 138L165 132M213 138L227 132','none','#f9f4ff',1.2,'opacity=".65"');
 return group('head',back+face+front+accessory(a.icon,p,m.accent));
}
function arm(c,p,m,side){const ink=m.dark,cg='url(#'+p+'cloth)',sk='url(#'+p+'skin)',ruby=c==='ruby',meli=c==='meli',z=c==='zomby';
 const upper=ruby?path('M-8 -3Q-16 7 -13 18L-15 29Q0 38 15 29L12 17Q15 4 8 -3Z',cg,ink,1.9)+path('M-10 27Q0 31 10 27','none',m.cloth[2],1.8):path('M-10 -5Q-15 0 -12 15L-11 33Q0 37 11 33L12 13Q15 1 10 -5Z',cg,ink,1.8)+path('M-9 7L-8 28','none',m.cloth[2],1.5,'opacity=".65"');
 let fore=path('M-10 -3Q-11 12 -10 24L10 24L11 0Z',cg,ink,1.8)+rect(-11,19,22,7,2,z?m.dark:m.cloth[0],ink,1.2)+path('M-8 22H8','none',m.accent,1.3);
 if(c==='guizz')fore+=path('M-10 6H10M-10 12H10','none',m.cloth[2],2.4);
 if(meli)fore+=path('M-12 20L-15 29L-6 27L0 30L6 27L15 29L12 20Z',m.cloth[1],ink,1.3);
 fore+=path('M-8 25Q-10 34 -5 38Q-1 42 2 38Q7 40 9 34L8 26Q3 22 -8 25Z',c==='guizz'?m.dark:sk,ink,1.5)+path('M-4 32Q-4 36 -2 38M2 32L3 37','none',c==='guizz'?'#9f88be':'#c88a87',.9);
 return group(side+'Arm',upper+group(side+'Fore',fore,'translate(0 30)'));
}
function leg(c,p,m,side){let ink=m.dark,sk='url(#'+p+'skin)',pants=c==='zomby',bare=c==='guizz';let upper=path('M-12 -5L12 -5L11 34Q0 37 -11 34Z',pants?m.dark:bare?sk:'#553c48',ink,1.7), lower=path('M-10 -3L10 -3L9 30Q0 33 -9 30Z',pants?'#2a2945':bare?sk:'#4c3644',ink,1.6);
 if(c==='meli'&&side==='right'){upper+=path('M-10 0L10 24M-10 12L7 33M10 0L-10 24M10 12L-7 33','none','#ad8591',.7);lower+=path('M-9 0L9 21M-9 11L8 31M9 0L-9 21M9 11L-8 31','none','#ad8591',.7)}
 let shoe=path('M-11 23Q-15 29 -15 36Q-13 43 0 43Q14 43 15 36L10 24Z',c==='guizz'?'#30223e':c==='zomby'?'#20233b':'#3d2b38',ink,1.8)+path('M-13 38Q0 42 13 38','none',m.accent,1.1,'opacity=".7"')+path('M-8 28H8M-7 32H7','none',c==='guizz'?m.cloth[2]:m.accent,1.6,'opacity=".85"');
 if(c==='zomby')shoe+=star(0,31,4,m.accent);
 if(c==='guizz')lower+=path('M-12 11L-13 24L13 24L12 11Z',m.cloth[0],ink,1.6)+path('M-11 16H11','none',m.cloth[2],2);
 return group(side+'Leg',upper+group(side+'Shin',lower+group(side+'Shoe',shoe),'translate(0 34)'));
}
function body(c,p,m,cos){const ink=m.dark,cg='url(#'+p+'cloth)',sk='url(#'+p+'skin)',metal=m.accent;let s=path('M190 195L210 195L211 211L224 218Q200 232 176 218L189 211Z',sk,ink,1.7);
 if(c==='ruby'){
 s+=path('M171 215L183 211L188 221L212 221L217 211L229 215L224 255Q200 262 176 255Z',cg,ink,2)+path('M176 245H224','none',m.cloth[2],2)+path('M187 231Q200 220 213 231Q200 242 187 231Z',m.cloth[0],ink,1.1)+ellipse(200,231,3.3,5,ink);
 }else if(c==='neko'){
 s+=path('M179 212L190 208L200 216L210 208L221 212L225 252H175Z','#eee0e8',ink,1.7)+path('M168 215L183 208L194 252L175 260L166 246ZM232 215L217 208L206 252L225 260L234 246Z',cg,ink,2)+path('M184 213L189 239M216 213L211 239','none',m.cloth[2],1.8)+circle(180,247,1.7,metal)+circle(220,247,1.7,metal);
 }else if(c==='guizz'){
 s+=path('M176 213L189 208L200 218L211 208L224 213L224 248L176 248Z',cg,ink,2)+path('M183 218L189 244H211L217 218L208 226H192Z','#392b48',ink,1.2)+rect(190,226,20,7,1,m.cloth[2])+path('M180 249H220L218 259H182Z',sk,ink,1.3)+rect(179,258,42,7,1,'#292334',ink)+rect(194,257,12,8,1,'#cfa979',ink,1.2)+path('M168 263H232L226 288L202 285L200 270L198 285L174 288Z','#302735',ink,2);
 }else if(c==='meli'){
 s+=path('M172 214L187 207L200 217L213 207L228 214L224 255L176 255Z',cg,ink,2)+path('M183 215L200 227L217 215L210 254H190Z','#3c2537',ink,1.4)+path('M192 229L208 235L192 241L208 247M208 229L192 235L208 241L192 247','none','#d9c3c5',1.5)+circle(200,215,7,m.cloth[1],ink,1.4)+path('M197 215Q202 210 203 215Q203 220 198 219','none',m.cloth[2],1.6);
 }else{
 s+=path('M173 212L187 205L200 215L213 205L227 212L234 261H166Z',cg,ink,2)+path('M184 210L200 219L216 210L211 259H189Z','#292337',ink,1.5)+path('M173 216L187 213L180 232L192 251M227 216L213 213L220 232L208 251','none',metal,2)+path('M175 222L166 254M225 222L234 254','none',m.cloth[2],1.5)+circle(200,231,10,'#36334e',metal,1.4)+star(200,231,7,metal)+path('M183 254H217','none','#c5a896',3)+rect(196,251,8,7,1,'#a9a2c5',ink);
 }
 if(c==='ruby'||c==='neko'||c==='meli'){
 const edge=c==='meli'?'#f5d4de':'#d2bcc6',skirt=c==='meli'?cg:'#3d303e';
 s+=path('M176 253L224 253L249 281Q200 302 151 281Z',skirt,ink,2)+path('M185 256L173 282M194 256L188 289M206 256L212 289M215 256L227 282','none',c==='meli'?m.cloth[2]:'#79616d',1.6)+path('M154 278Q200 298 246 278','none',edge,2.2);
 if(c==='ruby')for(let i=0;i<5;i++){let x=166+i*17,y=278+Math.sin(i*Math.PI/4)*8;s+=path('M'+(x-4)+' '+y+'H'+(x+4)+'M'+x+' '+(y-5)+'V'+(y+6),'none','#d6c0c7',1.6)}
 if(c==='meli')s+=path('M172 255L151 263L159 276L168 270L174 285L182 266L200 264L218 266L226 285L232 270L241 276L249 263L228 255Z',cg,ink,1.5)+path('M158 285Q162 294 166 286Q170 297 175 290Q180 300 185 293Q190 302 195 295Q200 302 205 295Q210 302 215 293Q220 300 225 290Q230 297 234 286Q238 294 242 285','none',edge,2.3);
 }
 if(c==='zomby'){s+=path('M170 258L190 260L185 294L168 321L143 303L158 281ZM230 258L210 260L215 294L232 321L257 303L242 281Z',cg,ink,2)+path('M169 263L156 301L168 311L182 290M231 263L244 301L232 311L218 290','none',metal,1.6)+star(163,299,7,metal)+star(237,299,7,metal)+path('M160 292L175 279M240 292L225 279','none',m.cloth[2],1.2)}
 if(Object.hasOwn(cloth,cos.cloth)&&(!cos.cloth.startsWith('zomby-')||c==='zomby')&&/galaxy|legend|zomby|epic/.test(cos.cloth)){for(const [x,y,r] of [[180,226,3],[218,225,4],[188,245,2],[213,241,3]])s+=star(x,y,r,metal)}
 return s
}
function art(c,l={},prefix='cb',includeFx=true){c=Object.hasOwn(cast,c)?c:'ruby';const p=String(prefix).replace(/[^a-zA-Z0-9_-]/g,'')||'cb',m=materials(c,l),a=appearance(c,l);
 const defs='<linearGradient id="'+p+'hair" x1="0" y1="0" x2=".18" y2="1"><stop offset="0" stop-color="'+m.hair[0]+'"/><stop offset=".45" stop-color="'+m.hair[1]+'"/><stop offset="1" stop-color="'+(c==='ruby'?m.hair[2]:m.hair[0])+'"/></linearGradient>'+gradient(p+'cloth',m.cloth)+gradient(p+'skin',[m.skin[0],m.skin[1], '#fff6e9'])+'<linearGradient id="'+p+'eye" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#38243f"/><stop offset=".52" stop-color="'+m.eye+'"/><stop offset="1" stop-color="#f1d9ec"/></linearGradient>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>'+defs+'</defs>'+group('effect',includeFx&&a.fx?aura(a.fx,m.accent):'')+group('actor',group('legs',leg(c,p,m,'left')+leg(c,p,m,'right'))+group('upper',arm(c,p,m,'left')+arm(c,p,m,'right')+body(c,p,m,l)+head(c,p,m,a)))+'</svg>';
}
const api={cast,hair,cloth,eyes,appearance,materials,art};if(typeof module==='object'&&module.exports)module.exports=api;else root.CBArt36=api;
})(typeof window==='object'?window:globalThis);
