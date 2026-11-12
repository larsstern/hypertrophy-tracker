'use strict';const KEY='hypertrophy-tracker-v1';const seed=()=>({height:190,baseBefore:11,baseAfter:20,ceiling:23,horizon:160,frequency:5,xMode:'sessions',selected:['ffmi','smm','torso','armR','armL','legR','legL','fat'],measurements:[{id:'m1',date:'2026-08-03',session:0,weight:79,fat:17.2,smm:33.9,torso:16.3,armR:2.2,armL:2.2,legR:6.6,legL:6.6,note:'MeScan'},{id:'m2',date:'2026-08-24',session:11,weight:80.7,fat:11.9,smm:34.5,torso:16.7,armR:2.3,armL:2.3,legR:6.6,legL:6.6,note:'MeScan'},{id:'m3',date:'2026-11-11',session:31,weight:84.7,fat:15,smm:35.2,torso:16.7,armR:2.3,armL:2.4,legR:6.9,legL:6.9,note:'MeScan'}],trainings:[]});let db;try{db=JSON.parse(localStorage.getItem(KEY))||seed()}catch{db=seed()}// Upgrade only missing historic segment data; never overwrite user-entered values.
for(const m of db.measurements||[]){
 const historic=seed().measurements.find(x=>x.date===m.date);
 if(historic){if(m.session==null)m.session=historic.session;for(const field of ['smm','torso','armR','armL','legR','legL'])
   if(m[field]==null && historic[field]!=null)m[field]=historic[field];}
}
let editingMeasurementId=null;const $=id=>document.getElementById(id),fmt=(v,d=2)=>Number(v).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}),ffmi=m=>m.weight*(1-m.fat/100)/(db.height/100)**2,sorted=()=>[...db.measurements].sort((a,b)=>a.date.localeCompare(b.date)),save=()=>{localStorage.setItem(KEY,JSON.stringify(db));render()},escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),valid=m=>m&&/^\d{4}-\d{2}-\d{2}$/.test(m.date)&&Number.isFinite(+m.weight)&&+m.weight>20&&+m.weight<400&&Number.isFinite(+m.fat)&&+m.fat>=1&&+m.fat<=70;
function trainingCountAfter(date){let base=date>='2026-11-11'?db.baseAfter:date>='2026-08-24'?0:0;return base+db.trainings.filter(t=>t.date>'2026-08-24'&&t.date<=date).length}function model(){const ms=sorted();if(ms.length<2)return null;const a=ms[ms.length-2],b=ms[ms.length-1];let n=db.trainings.filter(t=>t.date>a.date&&t.date<=b.date).length;if(a.date==='2026-08-24'&&b.date==='2026-11-11')n+=db.baseAfter;else if(a.date==='2026-08-03'&&b.date==='2026-08-24')n+=db.baseBefore;else if(a.date==='2026-08-03'&&b.date==='2026-11-11')n+=db.baseBefore+db.baseAfter;else if(a.date==='2026-11-11')n+=db.trainings.filter(t=>t.date>'2026-11-11'&&t.date<=b.date).length;const x=ffmi(a),y=ffmi(b),L=db.ceiling;if(!(n>0&&y>x&&L>y))return {a,b,n,x,y,usable:false};const k=-Math.log((L-y)/(L-x))/n;return {a,b,n,x,y,k,usable:true,predict:u=>L-(L-x)*Math.exp(-k*u)}}
function render(){const ms=sorted(),last=ms.at(-1),first=ms[0],count=last?.session??0;if(last){$('stats').innerHTML=`<div class="stat"><small>Aktueller FFMI</small><strong class="accent">${fmt(ffmi(last))}</strong><small>${escapeHtml(last.date)}</small></div><div class="stat"><small>Trainingseinheiten</small><strong>${count}</strong><small>Kumuliert laut letzter Messung</small></div><div class="stat"><small>Gewicht</small><strong>${fmt(last.weight,1)} kg</strong><small>KFA ${fmt(last.fat,1)} %</small></div><div class="stat"><small>Fettfreie Masse</small><strong>${fmt(last.weight*(1-last.fat/100),1)} kg</strong><small>BIA-Schätzung</small></div>`}else $('stats').innerHTML='<p>Bitte Messung hinzufügen.</p>';

const keys=['ffmi','ffm','smm','torso','armR','armL','legR','legL','fat'];
const names={ffmi:'FFMI',ffm:'Fettfreie Masse',smm:'Gesamt-SMM',torso:'Torso',armR:'Arm rechts',armL:'Arm links',legR:'Bein rechts',legL:'Bein links',fat:'KFA'};
const colors={ffmi:'#5ce0a0',ffm:'#ffdd83',smm:'#65a9ff',torso:'#d4a6ff',armR:'#ffbd69',armL:'#f48fb1',legR:'#5cd7d0',legL:'#d3dd70',fat:'#fa7c7c'};
const value=(m,key)=>key==='ffmi'?ffmi(m):key==='ffm'?m.weight*(1-m.fat/100):key==='fat'?m.fat:(Number.isFinite(+m[key])&&m[key]!=null?+m[key]:null);
const selected=Array.isArray(db.selected)?db.selected.filter(x=>keys.includes(x)):['ffmi'];
$('seriesPicker').innerHTML=keys.map(key=>`<label><input type="checkbox" data-series="${key}" ${selected.includes(key)?'checked':''}><span style="color:${colors[key]}">●</span>${names[key]}</label>`).join('');
$('xMode').value=db.xMode==='dates'?'dates':'sessions';
$('frequency').value=Number.isInteger(+db.frequency)?Math.max(0,Math.min(7,+db.frequency)):5;
$('freqValue').textContent=$('frequency').value;
const freq=+$('frequency').value, dateMode=$('xMode').value==='dates';
$('axisNote').textContent=dateMode?(freq===0?'Bei 0 Einheiten/Woche ist keine Datumsprognose möglich. Messungen bleiben nach Datum sichtbar.':`Prognose: 1 Einheit alle ${(7/freq).toFixed(2).replace('.',',')} Tage, gerechnet ab der letzten Messung. Historische Messungen bleiben an ihren echten Daten.`):'X-Achse: kumulierte Trainingseinheiten. Für Messungen mit eingetragener Einheitsnummer wird diese direkt verwendet.';
const countAt=date=>{const prior=ms.filter(m=>m.date<=date&&Number.isInteger(+m.session));return prior.length?+prior.at(-1).session:0;};
const origin=new Date(ms[0]?.date||'2026-08-03'+'T12:00:00');
const days=(a,b)=>(new Date(a+'T12:00:00')-new Date(b+'T12:00:00'))/86400000;
const lastDate=ms.at(-1)?.date||'2026-11-11';
const sessionOf=m=>Number.isInteger(+m.session)&&m.session!==''&&m.session!=null?+m.session:countAt(m.date);
const lastN=sessionOf(ms.at(-1)), maxN=lastN+db.horizon;
const totalDays=Math.max(1,days(lastDate,ms[0]?.date||lastDate)+(freq>0?db.horizon/freq*7:0));
const xAt=(m)=>dateMode?days(m.date,ms[0].date)/totalDays:sessionOf(m)/Math.max(1,maxN);
const xForecast=n=>dateMode?(days(lastDate,ms[0].date)+n/freq*7)/totalDays:(lastN+n)/Math.max(1,maxN);
const trainingBetween=(a,b)=>Math.max(0,sessionOf(b)-sessionOf(a));
function fit(key){
 const available=ms.filter(m=>value(m,key)!=null);
 if(key==='fat'||available.length<2)return null;
 // Use the full observation window rather than just the last two rounded readings.
 // A flat last pair at 0.1 kg resolution does not imply zero underlying growth.
 const a=available[0],b=available.at(-1),n=trainingBetween(a,b);
 const va=value(a,key),vb=value(b,key);
 const gain=vb-va;
 if(!(n>0&&gain>0))return null;
 const cap=key==='ffmi'?+db.ceiling:vb+Math.max(0.1,gain*5);
 if(!(cap>vb))return null;
 const rate=-Math.log((cap-vb)/(cap-va))/n;
 return {a,b,n,cap,rate,predict:u=>cap-(cap-va)*Math.exp(-rate*u)};
}
const fits=Object.fromEntries(keys.map(key=>[key,fit(key)]));
const allValues=selected.flatMap(key=>ms.map(m=>value(m,key)).filter(v=>v!=null).concat(fits[key]&&(!dateMode||freq>0)?[fits[key].predict(fits[key].n+db.horizon)]:[]));
// Auto-fit the Y axis to the selected data (including forecast), with a small margin.
const finiteValues=allValues.filter(Number.isFinite);
const rawMin=finiteValues.length?Math.min(...finiteValues):0;
const rawMax=finiteValues.length?Math.max(...finiteValues):1;
const spread=Math.max(rawMax-rawMin,Math.abs(rawMax)*0.025,0.15);
const padding=spread*0.12;
const lo=rawMin-padding,hi=rawMax+padding;
const width=760,height=310,left=50,right=20,top=20,bottom=48;
const x=v=>left+Math.max(0,Math.min(1,v))*(width-left-right);
const y=v=>top+(1-(v-lo)/Math.max(.001,hi-lo))*(height-top-bottom);
let svg=`<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Verlauf der ausgewählten Messgrößen">`;
for(let i=0;i<=5;i++){let v=lo+(hi-lo)*i/5;svg+=`<line x1="${left}" x2="${width-right}" y1="${y(v)}" y2="${y(v)}" stroke="#52657d" opacity=".35"/><text class="chart-label" x="${left-7}" y="${y(v)+4}" text-anchor="end">${fmt(v,1)}</text>`;}
for(let i=0;i<=4;i++){const ratio=i/4;let label;if(dateMode){const d=new Date(ms[0].date+'T12:00:00');d.setDate(d.getDate()+ratio*totalDays);label=d.toLocaleDateString('de-DE',{month:'2-digit',year:'2-digit'});}else label=Math.round(ratio*maxN);svg+=`<text class="chart-label" x="${x(ratio)}" y="${height-25}" text-anchor="middle">${label}</text>`;}
for(const key of selected){
 const entries=ms.filter(m=>value(m,key)!=null);
 if(entries.length>1){svg+=`<path d="${entries.map((m,i)=>(i?'L':'M')+x(xAt(m)).toFixed(1)+' '+y(value(m,key)).toFixed(1)).join(' ')}" stroke="${colors[key]}" stroke-width="2" fill="none" opacity=".75"/>`;}
 for(const m of entries){svg+=`<circle cx="${x(xAt(m))}" cy="${y(value(m,key))}" r="4" fill="${colors[key]}"><title>${names[key]} · ${m.date}: ${fmt(value(m,key))}${key==='fat'?' %':key==='ffmi'?'':' kg'}</title></circle>`;}
 const f=fits[key];if(f&&(!dateMode||freq>0)){
 let path='';const anchor=sessionOf(f.b);
 for(let i=0;i<=db.horizon;i+=Math.max(1,Math.floor(db.horizon/100))){let pos=dateMode?(days(f.b.date,ms[0].date)+i/freq*7)/totalDays:(anchor+i)/maxN;path+=(path?' L':'M')+x(pos).toFixed(1)+' '+y(f.predict(f.n+i)).toFixed(1);}
 svg+=`<path d="${path}" stroke="${colors[key]}" stroke-width="2" stroke-dasharray="5 5" fill="none"/>`;
 }
}
svg+=`<text x="${width/2}" y="${height-5}" text-anchor="middle" class="chart-label">${dateMode?'Kalenderdatum':'Kumulierte Trainingseinheiten'}</text></svg>`;
$('chart').innerHTML=selected.length?svg:'<p>Wähle mindestens eine Datenreihe aus.</p>';
$('legend').innerHTML=selected.map(key=>`<span style="--c:${colors[key]}">${names[key]} (${key==='fat'?'%':key==='ffmi'?'Index':'kg'})</span>`).join('');
$('ceiling').value=db.ceiling;$('horizon').value=db.horizon;
renderCalculator();
$('scenario').innerHTML='<p class="foot">Gestrichelte Kurven: exponentielle Szenarien anhand des gesamten Messzeitraums. Gleiche aufeinanderfolgende Werte können durch Rundung entstehen. Für SMM und Körperregionen wird ein <b>frei angenommener</b> Grenzwert von fünfmal dem Zuwachs zwischen erster und letzter verfügbarer Messung über dem aktuellen Wert verwendet. Keine biologische Obergrenze. Jede Reihe wird separat angepasst; ihre Prognosen sind nicht zwingend additiv.</p>';
const horizons=[0,20,50,100].filter(n=>n<=db.horizon);
$('forecastTable').innerHTML=`<h2>Gemeinsame Prognosetabelle</h2><div class="table-scroll"><table><thead><tr><th>Zusätzliche Einheiten</th><th>Datum*</th>${selected.map(k=>`<th>${names[k]}${k==='fat'?' (%)':k==='ffmi'?'':' (kg)'}</th>`).join('')}</tr></thead><tbody>${horizons.map(n=>`<tr><td>+${n}</td><td>${freq>0?(()=>{const d=new Date(lastDate+'T12:00:00');d.setDate(d.getDate()+n/freq*7);return d.toLocaleDateString('de-DE')})():'–'}</td>${selected.map(k=>{const f=fits[k];const v=n===0?value(ms.at(-1),k):f?f.predict(f.n+n):null;return `<td>${n>0&&k==='fat'?'–':v==null?'–':fmt(v,k==='fat'?1:2)}</td>`}).join('')}</tr>`).join('')}</tbody></table></div><p class="foot">*Datum aus ${freq} Einheiten/Woche, ab letzter Messung. „–“ bedeutet: keine Prognose möglich oder ausdrücklich ausgeschlossen. Unterschiedliche Skalen teilen sich im Diagramm eine numerische Y-Achse; für präzise Vergleiche einzelne Reihen auswählen.</p>`;

function renderCalculator(){
 const options=keys.filter(k=>k!=='fat');
 const current=$('calcMetric').value;
 $('calcMetric').innerHTML=options.map(k=>`<option value="${k}">${names[k]}${k==='ffmi'?'':' (kg)'}</option>`).join('');
 $('calcMetric').value=options.includes(current)?current:'ffmi';
 updateCalculator();
}
function updateCalculator(){
 const metric=$('calcMetric').value,mode=$('calcMode').value,frequency=+db.frequency;
 $('calcDateWrap').hidden=mode!=='date';$('calcValueWrap').hidden=mode!=='value';
 const output=$('calcResult');
 if(!ms.length){output.textContent='Zuerst eine Messung hinzufügen.';return;}
 const f=fits[metric];
 if(!f){output.textContent='Für diese Datenreihe ist keine steigende Prognose bestimmbar. Es werden mindestens zwei Messungen mit positivem langfristigem Trend benötigt.';return;}
 if(frequency===0){output.textContent='Bei 0 Trainingseinheiten pro Woche kann kein Datum berechnet werden. Stelle den Trainingsfrequenz-Slider auf 1–7.';return;}
 const anchorDate=f.b.date, base=value(f.b,metric),unit=metric==='ffmi'?'':' kg';
 const formatDate=d=>d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'});
 const fromSessions=n=>{const d=new Date(anchorDate+'T12:00:00');d.setDate(d.getDate()+n*7/frequency);return d;};
 if(mode==='date'){
   const target=$('calcDate').value;
   if(!target){output.textContent='Bitte ein Datum wählen.';return;}
   const n=days(target,anchorDate)*frequency/7;
   if(n<0){output.textContent='Das Datum liegt vor der letzten Messung. Rückwärtsprognosen sind deaktiviert.';return;}
   const prediction=f.predict(f.n+n);
   output.innerHTML=`<strong>${names[metric]}: ${fmt(prediction,2)}${unit}</strong><br><small>Am ${formatDate(new Date(target+'T12:00:00'))} · ca. ${fmt(n,1)} zusätzliche Trainingseinheiten (${frequency}/Woche). Szenario, keine verlässliche individuelle Vorhersage.</small>`;
 }else{
   const target=+$('calcValue').value;
   if(!$('calcValue').value||!Number.isFinite(target)){output.textContent='Bitte einen Zielwert eingeben.';return;}
   if(target<=base){output.textContent=`Der Zielwert liegt bei oder unter dem letzten Messwert (${fmt(base,2)}${unit}). Eine zukünftige Erreichungszeit lässt sich daraus nicht ableiten.`;return;}
   if(target>=f.cap){output.textContent=`Der Zielwert liegt bei oder über dem angenommenen Modellgrenzwert (${fmt(f.cap,2)}${unit}). In diesem Szenario wird er nicht erreicht. Der Grenzwert ist hypothetisch.`;return;}
   const rate=f.rate;
   if(!(rate>0)){output.textContent='Die Umkehrung ist mit diesen Daten nicht berechenbar.';return;}
   const n=Math.log((f.cap-base)/(f.cap-target))/rate;
   if(!Number.isFinite(n)||n>100000){output.textContent='Das Ziel liegt zu nahe am angenommenen Grenzwert für eine sinnvolle Zeitangabe.';return;}
   const when=fromSessions(n);
   output.innerHTML=`<strong>Rechnerisch: ${formatDate(when)}</strong><br><small>Ca. ${fmt(n,1)} weitere Trainingseinheiten bei ${frequency}/Woche, um ${fmt(target,2)}${unit} zu erreichen. Nur Modell-Szenario; reale Fortschritte können erheblich abweichen.</small>`;
 }
}

$('segments').innerHTML=last&&last.smm!=null?`<p><b>${fmt(last.smm,1)} kg</b> Skelettmuskelmasse (geschätzt)</p><div class="grid">${[['Torso','torso'],['Arm rechts','armR'],['Arm links','armL'],['Bein rechts','legR'],['Bein links','legL']].map(([label,key])=>`<div class="stat"><small>${label}</small><strong>${last[key]==null?'–':fmt(last[key],1)+' kg'}</strong></div>`).join('')}</div>`:'<p>Für die neueste Messung sind keine segmentalen Werte hinterlegt.</p>';
$('measurementList').innerHTML=`<table><tr><th>Datum</th><th>kg</th><th>KFA</th><th>FFMI</th><th>Einheit Nr.</th><th></th></tr>${ms.slice().reverse().map(m=>`<tr><td>${m.date}</td><td>${fmt(m.weight,1)}</td><td>${fmt(m.fat,1)}%</td><td>${fmt(ffmi(m))}</td><td>${m.session==null?'–':m.session}</td><td><button class="secondary" data-edit-m="${escapeHtml(m.id)}" aria-label="Messung bearbeiten">Bearbeiten</button> <button class="danger" data-delete-m="${escapeHtml(m.id)}" aria-label="Messung löschen">×</button></td></tr>`).join('')}</table>`;
$('height').value=db.height}
function download(filename,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(x=>{x.classList.toggle('active',x===b);x.classList.toggle('secondary',x!==b)});['dashboard','measurements','settings'].forEach(t=>$(t).hidden=t!==b.dataset.tab)}));const form=$('measurementForm');
function resetMeasurementForm(){editingMeasurementId=null;form.reset();form.elements.date.value=new Date().toLocaleDateString('en-CA');form.elements.session.value=sorted().at(-1)?.session??0;$('measurementHeading').textContent='Messung hinzufügen';$('measurementSubmit').textContent='Messung speichern';$('cancelEdit').hidden=true;}
function editMeasurement(id){const m=db.measurements.find(x=>x.id===id);if(!m)return;editingMeasurementId=id;for(const field of ['date','session','weight','fat','smm','torso','armR','armL','legR','legL','note'])form.elements[field].value=m[field]??'';$('measurementHeading').textContent='Messung bearbeiten';$('measurementSubmit').textContent='Änderungen speichern';$('cancelEdit').hidden=false;document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab==='measurements';b.classList.toggle('active',active);b.classList.toggle('secondary',!active)});['dashboard','measurements','settings'].forEach(t=>$(t).hidden=t!=='measurements');$('measurementHeading').scrollIntoView({behavior:'smooth',block:'start'});}
$('cancelEdit').addEventListener('click',resetMeasurementForm);
resetMeasurementForm();
form.addEventListener('submit',e=>{e.preventDefault();const o=Object.fromEntries(new FormData(form));const m={id:editingMeasurementId||'m'+Date.now(),date:o.date,weight:+o.weight,fat:+o.fat,note:o.note};if(o.session!=='')m.session=+o.session;
if(m.session==null||!Number.isInteger(m.session)||m.session<0)return alert('Bitte eine gültige, nichtnegative ganze Einheitsnummer eingeben.');
for(const k of ['smm','torso','armR','armL','legR','legL'])if(o[k]!=='')m[k]=+o[k];
if(!valid(m)||['smm','torso','armR','armL','legR','legL'].some(k=>m[k]!=null&&(!Number.isFinite(m[k])||m[k]<0)))return alert('Bitte gültige Messwerte eingeben.');
const others=db.measurements.filter(x=>x.id!==m.id);
if(others.some(x=>x.date===m.date))return alert('Für dieses Datum gibt es bereits eine Messung. Bitte die vorhandene Messung bearbeiten.');
if(others.some(x=>x.session!=null&&(x.date<m.date&&+x.session>m.session||x.date>m.date&&+x.session<m.session)))return alert('Die Einheitsnummer widerspricht der zeitlichen Reihenfolge vorhandener Messungen.');
if(editingMeasurementId){const index=db.measurements.findIndex(x=>x.id===editingMeasurementId);if(index<0)return alert('Messung nicht gefunden.');db.measurements[index]=m;}else db.measurements.push(m);
resetMeasurementForm();save();});
document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit-m]');if(edit){editMeasurement(edit.dataset.editM);return;}const del=e.target.closest('[data-delete-m]');if(del&&confirm('Messung wirklich löschen?')){db.measurements=db.measurements.filter(x=>x.id!==del.dataset.deleteM);if(editingMeasurementId===del.dataset.deleteM)resetMeasurementForm();save();}});
$('saveSettings').onclick=()=>{const h=+$('height').value;if(h<100||h>250)return alert('Ungültige Werte');db.height=h;save()};document.addEventListener('change',e=>{if(e.target.matches('[data-series]')){db.selected=[...document.querySelectorAll('[data-series]:checked')].map(el=>el.dataset.series);save()}});$('xMode').addEventListener('change',e=>{db.xMode=e.target.value;save()});$('frequency').addEventListener('input',e=>{db.frequency=+e.target.value;save()});
for(const id of ['calcMetric','calcMode','calcDate','calcValue'])$(id).addEventListener(id==='calcValue'?'input':'change',()=>render());for(const key of ['ceiling','horizon'])$(key).addEventListener('change',()=>{db[key]=+$(key).value;save()});$('export').onclick=()=>download('hypertrophy-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(db,null,2),'application/json');$('csv').onclick=()=>download('hypertrophy-messungen.csv','Datum,Gewicht_kg,KFA_Prozent,FFMI,Fettfreie_Masse_kg,SMM_kg\n'+sorted().map(m=>[m.date,m.weight,m.fat,ffmi(m).toFixed(3),(m.weight*(1-m.fat/100)).toFixed(3),m.smm??''].join(',')).join('\n'),'text/csv');$('import').addEventListener('change',async e=>{try{const obj=JSON.parse(await e.target.files[0].text());if(!Array.isArray(obj.measurements)||!obj.measurements.every(valid)||!(obj.height>=100&&obj.height<=250))throw Error('Ungültiges Datenformat');if(confirm('Alle lokalen Daten durch das Backup ersetzen?')){db={...seed(),...obj};save()}}catch(err){alert('Import fehlgeschlagen: '+err.message)}e.target.value=''});$('reset').onclick=()=>{if(confirm('Alle Änderungen löschen und die drei ursprünglichen Messungen wiederherstellen?')){db=seed();save()}};render();if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
