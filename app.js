(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const f=n=>(Math.round(n*10)/10).toString().replace('.',',');
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const LIM=50,K='manisku2',TODAY=new Date().toDateString();
let S={items:[],water:0,day:TODAY};
try{Object.assign(S,JSON.parse(localStorage.getItem(K))||{})}catch(e){}
if(S.day!==TODAY){S.water=0;S.day=TODAY}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const tot=()=>S.items.reduce((a,i)=>a+i.g*i.q,0);

/* ---------- DATA ---------- */
const ORG=[['🧠 Otak','Gula memicu pelepasan dopamin. Konsumsi berulang dapat membentuk pola ketergantungan dan keinginan makan manis.'],
['✨ Kulit','Glikasi merusak kolagen dan elastin sehingga kulit cepat menua. Lonjakan insulin juga dapat memperburuk jerawat.'],
['🫀 Hati','Fruktosa diolah di hati. Berlebihan dapat tertimbun sebagai lemak (Nonalcoholic Fatty Liver Disease).'],
['🦷 Gigi','Bakteri mengubah gula menjadi asam yang menyebabkan karies dan erosi email.'],
['❤️ Jantung','Gula berlebih meningkatkan trigliserida, berat badan, dan risiko penyakit kardiovaskular.']];
const HID=['High Fructose Corn Syrup (HFCS)','Maltodextrin','Dextrose','Sucrose','Agave nectar','Invert sugar','Concentrated fruit juice','Glukosa / fruktosa / maltosa','Sirup jagung'];
const MYTH=[['Gula aren, madu, dan gula jawa bebas kalori dan aman dikonsumsi sebanyak-banyaknya.','Semuanya tetap mengandung glukosa/fruktosa dan menaikkan gula darah, jadi tetap harus dibatasi.'],
['Jus buah kemasan sama sehatnya dengan buah utuh.','Jus kemasan kehilangan serat alami dan sering ditambah gula konsentrat, sehingga gula terserap secepat soda.']];
const STREET=[['Es Teh Manis',25],['Es Jeruk',28],['Kopi Susu Aren',25],['Thai Tea / Green Tea',38],['Boba Drink',45],['Nutrisari / Minuman Serbuk',20],['Es Doger / Cendol / Teler',35],['Martabak Manis',36],['Kolak',30],['Klepon',15],['Lupis Ketan',22],['Bubur Sumsum',28],['Kue Basah / Cubit',18]];
const SIZE=[['Kecil / plastik cucuk (x0,75)',.75],['Gelas standar / mangkok (x1)',1],['Jumbo / bungkus besar (x1,5)',1.5]];
const SWEET=[['Normal sweet (100%)',1],['Less sugar (50%)',.5],['Extra sweet (150%)',1.5],['Tawar / no sugar (0 g)',0]];
const PRE=[['Minuman Kekinian & Kemasan',[['Boba Milk Tea',45],['Thai Tea',38],['Kopi Susu Aren',25],['Soda Kaleng',35],['Energy Drink',28],['Jus Kotak',24],['Susu UHT Berperisa',20]]],
['Makanan & Kuliner Tradisional',[['Martabak Manis Cokelat Keju (2 potong)',36],['Kolak Pisang/Ubi (1 mangkok)',30],['Es Doger/Cendol (1 gelas)',35],['Bubur Ketan Hitam/Sumsum (1 porsi)',28],['Klepon (3 pcs)',15],['Lupis Ketan Juruh (1 porsi)',22],['Kue Cubit (3 pcs)',18],['Pisang Goreng Crispy Toping (2 pcs)',20]]],
['Camilan Manis Modern',[['Donat Glaze',14],['Cokelat Batangan',24],['Es Krim Cone',22],['Roti Manis Isian',18]]],
['Gula Tersembunyi & Makanan Utama',[['Saus Tomat/Sambal Botol (1 sdm)',4],['Sereal Sarapan Manis',12],['Yogurt Berperisa',18]]]];
const ACT=[['🚶 Jalan cepat',5],['🏃 Jogging / lari santai',9],['🚴 Bersepeda',7],['🪢 Lompat tali',12]]; // kkal/menit, perkiraan untuk berat ±60 kg
const opt=(a,sel)=>a.map((x,i)=>`<option value="${i}"${i===sel?' selected':''}>${x[0]}</option>`).join('');

/* ---------- VIEWS ---------- */
const meter=()=>{const t=tot(),p=t/LIM*100,c=t>LIM?'over':t>=37.5?'warn':'safe';
return `<div class="card ${c}"><div class="bt"><b class="badge">${{safe:'Aman',warn:'Waspada',over:'Bahaya / Over limit'}[c]}</b><b>${f(t)} / ${LIM} g</b></div><div class="meter"><div style="width:${Math.min(100,p)}%"></div></div><small>${Math.round(p)}% batas WHO · ${f(t/4)} sdt · ${f(t/12.5)} sdm · ${f(t*4)} kkal</small></div>`};

const V={
'':()=>`<div class="card hero"><h1>Manis hari ini, tagihan di masa depan</h1><p>Gula berlebih bekerja diam-diam. Pelajari bagaimana minuman manis harian dapat membebani ginjal, hati, dan jantung, lalu cek asupanmu.</p><a class="btn" style="text-decoration:none;display:inline-block" href="#/kalkulator">Hitung gula saya</a></div>
<h2>Krisis cuci darah usia muda</h2><div class="card"><p>Minuman manis kemasan atau es teh tinggi fruktosa yang dikonsumsi berulang dapat memicu <b>resistensi insulin</b> dan <b>sindrom metabolik</b>. Kondisi ini bisa berlanjut ke <b>diabetes melitus tipe 2 dini</b>, <b>nefropati diabetik</b>, lalu <b>gagal ginjal kronis</b> yang memerlukan <b>hemodialisis (cuci darah)</b>, bahkan pada usia muda dan remaja.</p><p class="mu">Gagal ginjal punya banyak penyebab (hipertensi, genetik, obesitas, dll). Gula berlebih adalah salah satu faktor risiko yang bisa kamu kendalikan.</p></div>
<h2>Biological sugar crash</h2><div class="card pink"><ul><li>Gula cepat serap membuat glukosa darah melonjak.</li><li>Pankreas melepas insulin berlebih (<b>insulin spike</b>).</li><li>Glukosa turun drastis: <b>food coma</b>, mengantuk, sulit fokus, lemas.</li><li>Tubuh meminta gula lagi (<b>cravings</b>) dan siklus berulang.</li></ul></div>
<h2>Dampak pada organ tubuh</h2>${ORG.map(o=>`<div class="card"><h3>${o[0]}</h3><p>${o[1]}</p></div>`).join('')}
<h2>Cara membaca label Nutrition Facts</h2><div class="card lilac"><p><b>Hitung total gula:</b> gula per saji × jumlah sajian per kemasan (Servings Per Container). Kemasan 2 sajian dengan 15 g gula berarti 30 g jika dihabiskan.</p><h3>Gula tersembunyi</h3><ul>${HID.map(h=>`<li>${h}</li>`).join('')}</ul><p class="mu">Semakin atas posisi nama ini dalam daftar komposisi, semakin banyak kandungannya.</p></div>`,

tahu:()=>`<h1>Tahukah kamu?</h1>
<div class="card warnbox"><h3>🧋 Es teh jumbo</h3><p>Satu porsi es teh manis jumbo (700–1000 ml) mengandung sekitar <b>36–50 g gula</b>. Itu sudah memenuhi atau melampaui batas harian WHO (50 g) dalam sekali minum.</p></div>
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
<h2>Mitos vs Fakta</h2>${MYTH.map(m=>`<div class="card"><p>❌ <b>Mitos:</b> ${m[0]}</p><p>✅ <b>Fakta:</b> ${m[1]}</p></div>`).join('')}`,

kalkulator:()=>`<h1>Kalkulator asupan</h1>${meter()}
<div class="card"><h3>Estimasi kaki lima (tanpa label)</h3><div class="row"><label class="full">Jenis<select id="eT">${opt(STREET)}</select></label><label>Ukuran<select id="eS">${opt(SIZE,1)}</select></label><label>Level manis<select id="eW">${opt(SWEET)}</select></label></div><button class="btn" data-a="est">Tambahkan estimasi</button></div>
<div class="card"><h3>Pilih dari daftar</h3><div class="row"><label class="full">Makanan / minuman<select id="pS">${PRE.map((g,gi)=>`<optgroup label="${g[0]}">${g[1].map((x,ii)=>`<option value="${gi}.${ii}">${x[0]} (~${x[1]} g)</option>`).join('')}</optgroup>`).join('')}</select></label><label>Jumlah<input id="pQ" type="number" min="1" value="1"></label><button class="btn" data-a="pre">Tambahkan</button></div></div>
<div class="card"><h3>Input manual</h3><div class="row"><label>Nama<input id="mN" maxlength="40" placeholder="Nama makanan"></label><label>Gula (gram)<input id="mG" type="number" min="0.1" step="0.1" placeholder="0"></label></div><button class="btn" data-a="man">Tambahkan</button></div>
<div class="card"><div class="bt"><h3>Catatan hari ini</h3><button class="btn sm g" data-a="clr">Hapus semua</button></div><ul class="list">${S.items.length?S.items.map((it,i)=>`<li><span>${esc(it.n)}<br><small>${it.q} × ${f(it.g)} g = ${f(it.g*it.q)} g</small></span><button data-a="del" data-i="${i}" aria-label="Hapus ${esc(it.n)}">✕</button></li>`).join(''):'<li class="mu">Belum ada catatan.</li>'}</ul></div>`,

konverter:()=>`<h1>Konverter & Burn Calculator</h1>
<div class="card"><h3>Konversi gula</h3><label>Gram gula<input id="cG" type="number" min="0" step="0.1" value="${f(tot()).replace(',','.')}"></label><div class="out" id="cO" style="margin-top:.7rem"></div><p class="mu" style="margin-top:.6rem">1 sdt = 4 g · 1 sdm = 12,5 g · 1 g gula = 4 kkal</p></div>
<div class="card mint"><h3>Burn calculator</h3><label>Kalori yang ingin dibakar (kkal)<input id="bK" type="number" min="0" value="${Math.round(tot()*4)}"></label><div class="out" id="bO" style="margin-top:.7rem"></div><p class="mu" style="margin-top:.6rem">Perkiraan kasar untuk berat badan ±60 kg. Hasil nyata bergantung berat badan dan intensitas.</p></div>`,

solusi:()=>{const t=tot();return `<h1>Solusi & action plan</h1>${meter()}
<div class="card ${t>LIM?'pink':t>=37.5?'warnbox':'mint'}"><h3>${t>LIM?'Kamu melebihi batas':t>=37.5?'Hampir mencapai batas':'Asupan masih aman'}</h3><p>${t>LIM?'Jalan cepat 30 menit atau olahraga ringan, perbanyak air putih, dan hentikan minuman manis sampai besok.':t>=37.5?'Ganti minuman manis berikutnya dengan air putih atau teh tawar.':'Pertahankan! Utamakan air putih dan buah utuh.'}</p></div>
<h2>Harm reduction: turunkan bertahap</h2><div class="card"><ul><li><b>Minggu 1–2:</b> turunkan level manis dari 100% ke 75%.</li><li><b>Minggu 3–4:</b> turun ke 50% (less sugar).</li><li><b>Minggu 5–6:</b> turun ke 25%, lalu coba tawar.</li><li>Kurangi ukuran: jumbo → standar → kecil.</li><li>Ganti satu minuman manis per hari dengan air putih.</li></ul></div>
<h2>Pemanis & perisa rendah kalori</h2><div class="card lilac"><ul><li><b>Stevia</b> dan <b>erythritol</b>: pemanis tanpa/rendah kalori.</li><li><b>Kayu manis</b> dan <b>ekstrak vanila</b>: memberi kesan manis tanpa gula.</li><li><b>Air lemon / jeruk nipis</b>: segar tanpa gula.</li></ul><p class="mu">Madu dan gula aren tetap dihitung sebagai gula.</p></div>
<h2>Water tracker</h2><div class="card"><div class="bt"><b>${S.water} / 8 gelas</b><small>${f(S.water*.25)} / 2 L</small></div><div class="water">${Array.from({length:8},(_,i)=>`<i class="${i<S.water?'on':''}">💧</i>`).join('')}</div><button class="btn" data-a="w+">+ 1 gelas</button> <button class="btn g" data-a="w-">−</button><p class="mu" style="margin-top:.6rem">Air putih yang cukup membantu hidrasi dan fungsi ginjal. Reset otomatis tiap hari.</p></div>`}
};

/* ---------- UPDATERS ---------- */
function conv(){const g=parseFloat($('#cG').value)||0;$('#cO').innerHTML=`<div><b>${f(g/4)}</b>sendok teh</div><div><b>${f(g/12.5)}</b>sendok makan</div><div><b>${f(g*4)}</b>kkal</div><div><b>${f(g)}</b>gram</div>`}
function burn(){const k=parseFloat($('#bK').value)||0;$('#bO').innerHTML=ACT.map(a=>`<div><b>${Math.ceil(k/a[1])} mnt</b>${a[0]}</div>`).join('')}

/* ---------- ROUTER & EVENTS ---------- */
function render(){const r=(location.hash.replace('#/','')||'');const k=V[r]?r:'';
$('#app').innerHTML=V[k]();$$('.bn a').forEach(a=>a.classList.toggle('on',a.dataset.r===k));
if(k==='konverter'){conv();burn();$('#cG').oninput=conv;$('#bK').oninput=burn}
window.scrollTo(0,0)}
function add(n,g,q){if(n&&g>=0&&q>0){S.items.push({n,g,q});save();keep()}}
function keep(){const y=window.scrollY;render();window.scrollTo(0,y)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
if(a==='est'){const t=STREET[$('#eT').value],s=SIZE[$('#eS').value],w=SWEET[$('#eW').value];add(`${t[0]} (${s[0].split(' (')[0]}, ${w[0].split(' (')[0]})`,Math.round(t[1]*s[1]*w[1]*10)/10,1)}
else if(a==='pre'){const[gi,ii]=$('#pS').value.split('.'),p=PRE[gi][1][ii];add(p[0],p[1],parseInt($('#pQ').value,10))}
else if(a==='man'){add($('#mN').value.trim(),parseFloat($('#mG').value),1)}
else if(a==='del'){S.items.splice(+b.dataset.i,1);save();keep()}
else if(a==='clr'){if(S.items.length&&confirm('Hapus semua catatan?')){S.items=[];save();keep()}}
else if(a==='w+'){S.water=Math.min(16,S.water+1);save();keep()}
else if(a==='w-'){S.water=Math.max(0,S.water-1);save();keep()}});
window.addEventListener('hashchange',render);

/* ---------- PWA ---------- */
let dp;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#inst').hidden=false});
$('#inst').onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;$('#inst').hidden=true}};
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
render();
})();
