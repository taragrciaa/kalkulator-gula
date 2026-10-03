(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const f=n=>(Math.round(n*10)/10).toString().replace('.',',');
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const LIM=50,GOAL=2000,K='manisku2',TODAY=new Date().toDateString();
let S={items:[],ml:0,day:TODAY};
try{const o=JSON.parse(localStorage.getItem(K))||{};Object.assign(S,o);if(o.ml==null&&o.water)S.ml=o.water*250}catch(e){}
if(S.day!==TODAY){S.ml=0;S.day=TODAY}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const tot=()=>S.items.reduce((a,i)=>a+i.g*i.q,0);
const UI={tab:0,pq:1,sel:0,sz:1,sw:0},EST={photo:null,ml:500,k:0,si:0};

/* ---------- DATA ---------- */
const OI={
ginjal:'<path class="f" d="M30 7c-9-2-19 3-19 15 0 7 4 10 9 11 5 1 4 6 9 6 7 0 11-8 9-16-1-8-3-14-8-16z"/><path class="s" d="M34 20c-4 2-4 8 0 10"/>',
otak:'<path class="f" d="M24 9c-4-3-11-1-12 5-4 1-6 6-3 10-2 5 1 10 6 10 2 4 8 5 9 1 1 4 7 3 9-1 5 0 8-5 6-10 3-4 1-9-3-10-1-6-8-8-12-5z"/><path class="s" d="M24 10v28M16 20c3 0 5 2 8 2M32 20c-3 0-5 2-8 2M16 30c3 0 5-2 8-2M32 30c-3 0-5-2-8-2"/>',
hati:'<path class="f" d="M5 22c0-8 8-10 20-10 10 0 18 4 18 12 0 9-8 14-17 14-6 0-8-4-12-6-5-2-9-3-9-10z"/><path class="s" d="M30 18c2 4 1 8-2 11"/>',
kulit:'<rect class="f" x="8" y="9" width="32" height="9" rx="4.5"/><rect class="f" x="8" y="20" width="32" height="9" rx="4.5" opacity=".7"/><rect class="f" x="8" y="31" width="32" height="9" rx="4.5" opacity=".45"/>',
gigi:'<path class="f" d="M13 8c-5 0-7 6-6 12 1 6 3 9 4 16 1 5 5 5 6 0 1-4 2-7 3-7s2 3 3 7c1 5 5 5 6 0 1-7 3-10 4-16 1-6-1-12-6-12-4 0-6 2-7 2s-3-2-7-2z"/>',
jantung:'<path class="f" d="M24 41C8 30 5 21 8 14c3-6 11-6 16 1 5-7 13-7 16-1 3 7 0 16-16 27z"/><path class="s" d="M14 17c-2 2-2 5-1 7"/>'};
const ico=(k,c)=>`<svg class="ill" viewBox="0 0 48 48" style="--ic:${c}" aria-hidden="true">${OI[k]}</svg>`;
const ORG=[['ginjal','Ginjal','#6cc4de','Gula tinggi berulang merusak pembuluh kecil ginjal (nefropati diabetik) hingga gagal ginjal.'],
['otak','Otak','#b9a2e6','Gula memicu dopamin. Konsumsi berulang membentuk pola ketagihan manis.'],
['hati','Hati','#f0a07a','Fruktosa berlebih tertimbun sebagai lemak hati (Nonalcoholic Fatty Liver Disease).'],
['kulit','Kulit','#f4a6c6','Glikasi merusak kolagen dan elastin: penuaan dini dan jerawat lebih mudah muncul.'],
['gigi','Gigi','#7fd6e6','Bakteri mengubah gula menjadi asam yang memicu karies dan erosi email.'],
['jantung','Jantung','#e5566d','Trigliserida naik dan risiko penyakit kardiovaskular meningkat.']];
const HID=['High Fructose Corn Syrup (HFCS)','Maltodextrin','Dextrose','Sucrose','Agave nectar','Invert sugar','Concentrated fruit juice','Glukosa / fruktosa / maltosa','Sirup jagung'];
const MYTH=[['🍯','Gula aren, madu, dan gula jawa bebas kalori dan aman dikonsumsi sebanyak-banyaknya.','Semuanya tetap mengandung glukosa/fruktosa dan menaikkan gula darah, jadi tetap harus dibatasi.'],
['🧃','Jus buah kemasan sama sehatnya dengan buah utuh.','Jus kemasan kehilangan serat alami dan sering ditambah gula konsentrat, sehingga gula terserap secepat soda.']];
const STREET=[['Es Teh Manis',25,'🥤'],['Es Jeruk',28,'🍊'],['Kopi Susu Aren',25,'☕'],['Thai Tea / Green Tea',38,'🍵'],['Boba Drink',45,'🧋'],['Nutrisari / Serbuk',20,'🥛'],['Es Doger / Cendol',35,'🍧'],['Martabak Manis',36,'🥞'],['Kolak',30,'🥣'],['Klepon',15,'🟢'],['Lupis Ketan',22,'🍡'],['Bubur Sumsum',28,'🍚'],['Kue Basah / Cubit',18,'🧁']];
const SIZE=[['Kecil / plastik cucuk (x0,75)',.75],['Gelas standar / mangkok (x1)',1],['Jumbo / bungkus besar (x1,5)',1.5]];
const SWEET=[['Normal sweet (100%)',1],['Less sugar (50%)',.5],['Extra sweet (150%)',1.5],['Tawar / no sugar (0 g)',0]];
const PRE=[['Minuman',[['Boba Milk Tea',45,'🧋'],['Thai Tea',38,'🍵'],['Kopi Susu Aren',25,'☕'],['Soda Kaleng',35,'🥤'],['Energy Drink',28,'⚡'],['Jus Kotak',24,'🧃'],['Susu UHT Berperisa',20,'🥛']],'🧋'],
['Tradisional',[['Martabak Manis Cokelat Keju (2 potong)',36,'🥞'],['Kolak Pisang/Ubi (1 mangkok)',30,'🥣'],['Es Doger/Cendol (1 gelas)',35,'🍧'],['Bubur Ketan Hitam/Sumsum (1 porsi)',28,'🍚'],['Klepon (3 pcs)',15,'🟢'],['Lupis Ketan Juruh (1 porsi)',22,'🍡'],['Kue Cubit (3 pcs)',18,'🧁'],['Pisang Goreng Crispy Toping (2 pcs)',20,'🍌']],'🥞'],
['Camilan',[['Donat Glaze',14,'🍩'],['Cokelat Batangan',24,'🍫'],['Es Krim Cone',22,'🍦'],['Roti Manis Isian',18,'🍞']],'🍩'],
['Tersembunyi',[['Saus Tomat/Sambal Botol (1 sdm)',4,'🍅'],['Sereal Sarapan Manis',12,'🥣'],['Yogurt Berperisa',18,'🥄']],'🍅']];
const EK=[['Es teh manis',5],['Es jeruk',6],['Kopi susu aren',8],['Thai tea',8],['Boba milk tea',9],['Minuman bersoda',10.6],['Es doger / cendol',11.7],['Kolak / bubur (mangkok)',12]]; // gram gula per 100 ml (perkiraan)
const GZ=[[250,'Kecil','±250 ml',54],[500,'Sedang','±500 ml',72],[850,'Jumbo','700–1000 ml',96]];
const ACT=[['🚶 Jalan cepat',5],['🏃 Jogging / lari santai',9],['🚴 Bersepeda',7],['🪢 Lompat tali',12]]; // kkal/menit, perkiraan untuk berat ±60 kg
const opt=(a,sel)=>a.map((x,i)=>`<option value="${i}"${i===sel?' selected':''}>${x[0]}</option>`).join('');
const cup=(h,c='#7fd6e6')=>`<svg viewBox="0 0 40 60" style="height:${h}px" aria-hidden="true"><path d="M7 22h26l-2.4 34H9.4z" style="fill:${c};opacity:.85"/><path d="M5 6h30l-4 50H9z" style="fill:none;stroke:#3b82c4;stroke-width:2.5;stroke-linejoin:round"/></svg>`;
const cubes=n=>'<span class="cbs">'+'<i></i>'.repeat(n)+'</span>';
const fact=(il,body,cls='')=>`<div class="card fact ${cls}"><div class="fi">${il}</div><div>${body}</div></div>`;
const fc=(x,a,i,c,sel)=>`<button type="button" class="fc${sel?' sel':''}" data-a="${a}" data-i="${i}"><span class="th c${c}">${x[2]}</span><b>${x[0]}</b><small>~${x[1]} g</small></button>`;
const zone=m=>m<=300?0:m<=600?1:2;

/* ---------- KOMPONEN ---------- */
const meter=()=>{const t=tot(),p=t/LIM*100,c=t>LIM?'over':t>=37.5?'warn':'safe';
return `<div class="card ${c}"><div class="bt"><b class="badge">${{safe:'Aman',warn:'Waspada',over:'Bahaya / Over limit'}[c]}</b><b>${f(t)} / ${LIM} g</b></div><div class="meter"><div style="width:${Math.min(100,p)}%"></div></div><small>${Math.round(p)}% batas WHO · ${f(t/4)} sdt · ${f(t/12.5)} sdm · ${f(t*4)} kkal</small></div>`};

const estHTML=()=>`<div class="card"><h3>📸 Estimasi porsi dari foto</h3>
<p class="mu">Foto hanya tampil di perangkatmu dan tidak diunggah ke mana pun. Gunakan sebagai pembanding visual, bukan pengukur otomatis.</p>
<div class="rowb"><label class="btn sm">📷 Kamera<input type="file" id="eC" accept="image/*" capture="environment" hidden></label><label class="btn sm g">🖼️ Galeri<input type="file" id="eF" accept="image/*" hidden></label></div>
${EST.photo?`<img class="ph" src="${EST.photo}" alt="Foto makanan atau minuman">
<h3>Panduan perbandingan porsi</h3><p class="mu">Bandingkan ukuran wadah di fotomu dengan ilustrasi ini, lalu geser slider.</p>
<div class="guide">${GZ.map(g=>`<button type="button" class="gt" data-a="gz" data-ml="${g[0]}">${cup(g[3])}<b>${g[1]}</b><small>${g[2]}</small></button>`).join('')}</div>
<div class="row"><label>Jenis<select id="eK">${opt(EK,EST.k)}</select></label><label>Level manis<select id="eP">${opt(SWEET,EST.si)}</select></label></div>
<label>Takaran: <b id="eMlT"></b><input id="eMl" type="range" min="200" max="1000" step="50" value="${EST.ml}"></label>
<div class="out" id="eO" style="margin:.7rem 0"></div>
<button class="btn" data-a="estp">Tambahkan ke catatan</button>
<p class="mu" style="margin-top:.6rem">Estimasi memakai rata-rata gula per 100 ml. Cek label kemasan untuk angka pasti.</p>`:'<p class="mu">Unggah foto untuk membuka panduan porsi dan slider takaran.</p>'}</div>`;

const waterHTML=()=>`<div class="card"><div class="wt"><div class="tank"><div class="fill e" id="wF"></div><span id="wP">0%</span></div><div class="wi"><b id="wT"></b><small>Target 2.000 ml (8 gelas × 250 ml)</small><div class="bar"><i id="wB"></i></div><div class="rowb"><button class="btn sm" data-a="w250">+250 ml (1 gelas)</button><button class="btn sm" data-a="w500">+500 ml (1 botol sedang)</button><button class="btn sm g" data-a="wm">− 250 ml</button></div></div></div><p class="mu" style="margin:.6rem 0 0">Air putih yang cukup membantu hidrasi dan fungsi ginjal. Reset otomatis tiap hari.</p></div>`;

/* ---------- VIEWS ---------- */
const V={
'':()=>`<div class="card hero"><h1>Manis hari ini, tagihan di masa depan</h1><p>Gula berlebih bekerja diam-diam. Pelajari bagaimana minuman manis harian dapat membebani ginjal, hati, dan jantung, lalu cek asupanmu.</p><a class="btn" style="text-decoration:none" href="#/kalkulator">Hitung gula saya</a></div>
<h2>Krisis cuci darah usia muda</h2>${fact(ico('ginjal','#6cc4de'),`<p>Minuman manis kemasan atau es teh tinggi fruktosa yang dikonsumsi berulang dapat memicu <b>resistensi insulin</b> dan <b>sindrom metabolik</b>, lalu <b>diabetes melitus tipe 2 dini</b>, <b>nefropati diabetik</b>, hingga <b>gagal ginjal kronis</b> yang memerlukan <b>hemodialisis (cuci darah)</b>, bahkan di usia muda.</p><p class="mu">Gagal ginjal punya banyak penyebab (hipertensi, genetik, obesitas, dll). Gula berlebih adalah salah satu faktor yang bisa dikendalikan.</p>`)}
<h2>Biological sugar crash</h2><div class="card pink"><ul><li>Gula cepat serap membuat glukosa darah melonjak.</li><li>Pankreas melepas insulin berlebih (<b>insulin spike</b>).</li><li>Glukosa turun drastis: <b>food coma</b>, mengantuk, sulit fokus, lemas.</li><li>Tubuh meminta gula lagi (<b>cravings</b>) dan siklus berulang.</li></ul></div>
<h2>Dampak pada organ tubuh</h2><div class="og">${ORG.map(o=>`<div class="card oc">${ico(o[0],o[2])}<h3>${o[1]}</h3><p>${o[3]}</p></div>`).join('')}</div>
<h2>Cara membaca label Nutrition Facts</h2><div class="card lilac"><p><b>Hitung total gula:</b> gula per saji × jumlah sajian per kemasan (Servings Per Container). Kemasan 2 sajian dengan 15 g gula berarti 30 g jika dihabiskan.</p><h3>Gula tersembunyi</h3><ul>${HID.map(h=>`<li>${h}</li>`).join('')}</ul><p class="mu">Semakin atas posisi nama ini dalam daftar komposisi, semakin banyak kandungannya.</p></div>`,

tahu:()=>`<h1>Tahukah kamu?</h1>
${fact(cup(78),`<h3>Es teh jumbo</h3><p>Porsi 700–1000 ml berisi sekitar <b>36–50 g gula</b>, sudah menyamai batas harian WHO (50 g) dalam sekali minum.</p>${cubes(12)}<small>≈ 9–12 sendok teh gula</small>`,'warnbox')}
${fact('<span class="em">🍅</span>',`<h3>Gula tersembunyi</h3><p>1 sendok makan saus tomat atau sambal botolan mengandung ±4 g gula.</p>${cubes(1)}`)}
<h2>Data resmi Indonesia</h2>
<div class="card"><div class="out">
<div><b>47,5%</b>penduduk usia 3 tahun ke atas minum manis lebih dari 1× per hari (SKI 2023)</div>
<div><b>11,7%</b>penduduk dengan kadar gula di atas normal (SKI 2023)</div>
<div><b>17,9%</b>penyandang diabetes yang tahu kondisinya dan rutin berobat (SKI 2023)</div>
<div><b>235</b>per 1 juta penduduk menjalani hemodialisis (Kemenkes)</div>
<div><b>20–35 g</b>rata-rata gula per minuman kemasan manis (Menkes, Jan 2026)</div>
<div><b>31,4%</b>proporsi pasien cuci darah usia 25–34 tahun (2023), naik dari 19,29% (2018)*</div>
</div>
<p class="mu" style="margin-top:.7rem">*Dikutip dari pemberitaan yang merujuk SKI 2023. Gagal ginjal punya banyak penyebab, terutama diabetes dan hipertensi. Gula berlebih adalah faktor risiko yang bisa dikendalikan. Sumber: Kemenkes RI, Survei Kesehatan Indonesia 2023.</p></div>
<h2>Mitos vs Fakta</h2>${MYTH.map(m=>fact(`<span class="em">${m[0]}</span>`,`<p>❌ <b>Mitos:</b> ${m[1]}</p><p>✅ <b>Fakta:</b> ${m[2]}</p>`)).join('')}`,

kalkulator:()=>`<h1>Kalkulator asupan</h1>${meter()}
<div class="card"><div class="bt"><h3>Pilih makanan / minuman</h3><label class="qt">Jumlah<input id="pQ" type="number" min="1" max="20" value="${UI.pq}"></label></div>
<div class="tabs">${PRE.map((g,i)=>`<button type="button" class="chip${i===UI.tab?' on':''}" data-a="tab" data-i="${i}">${g[2]} ${g[0]}</button>`).join('')}</div>
<div class="fg">${PRE[UI.tab][1].map((x,i)=>fc(x,'pc',i,UI.tab)).join('')}</div><p class="mu" style="margin:0">Ketuk kartu untuk menambahkan ke catatan.</p></div>
<div class="card"><h3>Estimasi kaki lima (tanpa label)</h3><div class="fg sg">${STREET.map((x,i)=>fc(x,'ps',i,1,i===UI.sel)).join('')}</div>
<div class="row"><label>Ukuran<select id="eS">${opt(SIZE,UI.sz)}</select></label><label>Level manis<select id="eW">${opt(SWEET,UI.sw)}</select></label></div><button class="btn" data-a="est">Tambahkan estimasi</button></div>
${estHTML()}
<div class="card"><h3>Input manual</h3><div class="row"><label>Nama<input id="mN" maxlength="40" placeholder="Nama makanan"></label><label>Gula (gram)<input id="mG" type="number" min="0.1" step="0.1" placeholder="0"></label></div><button class="btn" data-a="man">Tambahkan</button></div>
<div class="card"><div class="bt"><h3>Catatan hari ini</h3><button class="btn sm g" data-a="clr">Hapus semua</button></div><ul class="list">${S.items.length?S.items.map((it,i)=>`<li><span>${esc(it.n)}<br><small>${it.q} × ${f(it.g)} g = ${f(it.g*it.q)} g</small></span><button data-a="del" data-i="${i}" aria-label="Hapus ${esc(it.n)}">✕</button></li>`).join(''):'<li class="mu">Belum ada catatan.</li>'}</ul></div>`,

konverter:()=>`<h1>Konverter & Burn Calculator</h1>
<div class="card"><h3>Konversi gula</h3><label>Gram gula<input id="cG" type="number" min="0" step="0.1" value="${f(tot()).replace(',','.')}"></label><div class="out" id="cO" style="margin-top:.7rem"></div><p class="mu" style="margin-top:.6rem">1 sdt = 4 g · 1 sdm = 12,5 g · 1 g gula = 4 kkal</p></div>
<div class="card mint"><h3>Burn calculator</h3><label>Kalori yang ingin dibakar (kkal)<input id="bK" type="number" min="0" value="${Math.round(tot()*4)}"></label><div class="out" id="bO" style="margin-top:.7rem"></div><p class="mu" style="margin-top:.6rem">Perkiraan kasar untuk berat badan ±60 kg. Hasil nyata bergantung berat badan dan intensitas.</p></div>`,

solusi:()=>{const t=tot();return `<h1>Solusi & action plan</h1>${meter()}
<div class="card ${t>LIM?'pink':t>=37.5?'warnbox':'mint'}"><h3>${t>LIM?'Kamu melebihi batas':t>=37.5?'Hampir mencapai batas':'Asupan masih aman'}</h3><p>${t>LIM?'Jalan cepat 30 menit atau olahraga ringan, perbanyak air putih, dan hentikan minuman manis sampai besok.':t>=37.5?'Ganti minuman manis berikutnya dengan air putih atau teh tawar.':'Pertahankan! Utamakan air putih dan buah utuh.'}</p></div>
<h2>Water tracker</h2>${waterHTML()}
<h2>Harm reduction: turunkan bertahap</h2><div class="card"><ul><li><b>Minggu 1–2:</b> turunkan level manis dari 100% ke 75%.</li><li><b>Minggu 3–4:</b> turun ke 50% (less sugar).</li><li><b>Minggu 5–6:</b> turun ke 25%, lalu coba tawar.</li><li>Kurangi ukuran: jumbo → standar → kecil.</li><li>Ganti satu minuman manis per hari dengan air putih.</li></ul></div>
<h2>Pemanis & perisa rendah kalori</h2><div class="card lilac"><ul><li><b>Stevia</b> dan <b>erythritol</b>: pemanis tanpa/rendah kalori.</li><li><b>Kayu manis</b> dan <b>ekstrak vanila</b>: memberi kesan manis tanpa gula.</li><li><b>Air lemon / jeruk nipis</b>: segar tanpa gula.</li></ul><p class="mu">Madu dan gula aren tetap dihitung sebagai gula.</p></div>`}
};

/* ---------- UPDATERS ---------- */
function conv(){const g=parseFloat($('#cG').value)||0;$('#cO').innerHTML=`<div><b>${f(g/4)}</b>sendok teh</div><div><b>${f(g/12.5)}</b>sendok makan</div><div><b>${f(g*4)}</b>kkal</div><div><b>${f(g)}</b>gram</div>`}
function burn(){const k=parseFloat($('#bK').value)||0;$('#bO').innerHTML=ACT.map(a=>`<div><b>${Math.ceil(k/a[1])} mnt</b>${a[0]}</div>`).join('')}
const estG=()=>EK[EST.k][1]*EST.ml/100*SWEET[EST.si][1];
function estUI(){if(!$('#eMl'))return;const g=estG(),ml=EST.ml;
$('#eMlT').textContent=`${ml} ml · ${['Kecil','Sedang','Jumbo'][zone(ml)]}`;$('#eMl').value=ml;
$('#eO').innerHTML=`<div><b>${f(g)} g</b>gula</div><div><b>${f(g*4)} kkal</b>dari gula</div><div><b>${f(g/4)} sdt</b>sendok teh</div><div><b>${Math.round(g/LIM*100)}%</b>batas harian</div>`;
$$('.gt').forEach(t=>t.classList.toggle('on',zone(+t.dataset.ml)===zone(ml)))}
function waterUI(){if(!$('#wT'))return;const p=Math.min(100,S.ml/GOAL*100);
$('#wF').classList.toggle('e',S.ml===0);$('#wF').style.height=p+'%';$('#wB').style.width=p+'%';$('#wP').textContent=Math.round(p)+'%';
$('#wT').textContent=`Terpenuhi: ${S.ml.toLocaleString('id-ID')} ml / 2.000 ml – ${f(S.ml/250)} gelas${S.ml>=GOAL?' ✅ Target tercapai':''}`}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),1600)}

/* ---------- ROUTER & EVENTS ---------- */
function render(){const r=location.hash.replace('#/','');const k=V.hasOwnProperty(r)?r:'';
$('#app').innerHTML=V[k]();$$('.bn a').forEach(a=>a.classList.toggle('on',a.dataset.r===k));
if(k==='konverter'){conv();burn();$('#cG').oninput=conv;$('#bK').oninput=burn}
if(k==='kalkulator')estUI();
if(k==='solusi')requestAnimationFrame(()=>requestAnimationFrame(waterUI));
window.scrollTo(0,0)}
function keep(){const y=window.scrollY;render();window.scrollTo(0,y)}
function add(n,g,q){if(n&&g>=0&&q>0){S.items.push({n,g,q});save();toast('Ditambahkan: '+n);keep()}}
function water(d){S.ml=Math.max(0,Math.min(4000,S.ml+d));save();waterUI()}

document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,i=+b.dataset.i;
if(a==='tab'){UI.pq=$('#pQ').value;UI.tab=i;keep()}
else if(a==='pc'){const p=PRE[UI.tab][1][i];UI.pq=$('#pQ').value;add(p[0],p[1],parseInt(UI.pq,10)||1)}
else if(a==='ps'){UI.sel=i;$$('.sg .fc').forEach((c,j)=>c.classList.toggle('sel',j===i))}
else if(a==='est'){const t=STREET[UI.sel],s=SIZE[UI.sz],w=SWEET[UI.sw];add(`${t[0]} (${s[0].split(' (')[0]}, ${w[0].split(' (')[0]})`,Math.round(t[1]*s[1]*w[1]*10)/10,1)}
else if(a==='gz'){EST.ml=+b.dataset.ml;estUI()}
else if(a==='estp'){add(`Foto: ${EK[EST.k][0]} ${EST.ml} ml (${SWEET[EST.si][0].split(' (')[0]})`,Math.round(estG()*10)/10,1)}
else if(a==='man'){add($('#mN').value.trim(),parseFloat($('#mG').value),1)}
else if(a==='del'){S.items.splice(i,1);save();keep()}
else if(a==='clr'){if(S.items.length&&confirm('Hapus semua catatan?')){S.items=[];save();keep()}}
else if(a==='w250')water(250);else if(a==='w500')water(500);else if(a==='wm')water(-250)});

document.addEventListener('change',e=>{const t=e.target,v=t.value;
if(t.id==='eS')UI.sz=+v;else if(t.id==='eW')UI.sw=+v;else if(t.id==='pQ')UI.pq=v;
else if(t.id==='eK'){EST.k=+v;estUI()}else if(t.id==='eP'){EST.si=+v;estUI()}
else if(t.id==='eC'||t.id==='eF'){const file=t.files[0];if(!file)return;if(EST.photo)URL.revokeObjectURL(EST.photo);EST.photo=URL.createObjectURL(file);keep()}});
document.addEventListener('input',e=>{if(e.target.id==='eMl'){EST.ml=+e.target.value;estUI()}});
window.addEventListener('hashchange',render);

/* ---------- PWA ---------- */
let dp;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#inst').hidden=false});
$('#inst').onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;$('#inst').hidden=true}};
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
render();
})();
