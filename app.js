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
const UI={tab:0,pq:1,sel:0,sz:1,sw:0,org:'ginjal',en:2000,stp:0},EST={photo:null,ml:500,k:0,si:0};

/* ---------- DATA ILUSTRASI ---------- */
const OI={
ginjal:'<path class="f" d="M30 7c-9-2-19 3-19 15 0 7 4 10 9 11 5 1 4 6 9 6 7 0 11-8 9-16-1-8-3-14-8-16z"/><path class="s" d="M34 20c-4 2-4 8 0 10"/>',
otak:'<path class="f" d="M24 9c-4-3-11-1-12 5-4 1-6 6-3 10-2 5 1 10 6 10 2 4 8 5 9 1 1 4 7 3 9-1 5 0 8-5 6-10 3-4 1-9-3-10-1-6-8-8-12-5z"/><path class="s" d="M24 10v28M16 20c3 0 5 2 8 2M32 20c-3 0-5 2-8 2M16 30c3 0 5-2 8-2M32 30c-3 0-5-2-8-2"/>',
hati:'<path class="f" d="M5 22c0-8 8-10 20-10 10 0 18 4 18 12 0 9-8 14-17 14-6 0-8-4-12-6-5-2-9-3-9-10z"/><path class="s" d="M30 18c2 4 1 8-2 11"/>',
kulit:'<rect class="f" x="8" y="9" width="32" height="9" rx="4.5"/><rect class="f" x="8" y="20" width="32" height="9" rx="4.5" opacity=".7"/><rect class="f" x="8" y="31" width="32" height="9" rx="4.5" opacity=".45"/>',
gigi:'<path class="f" d="M13 8c-5 0-7 6-6 12 1 6 3 9 4 16 1 5 5 5 6 0 1-4 2-7 3-7s2 3 3 7c1 5 5 5 6 0 1-7 3-10 4-16 1-6-1-12-6-12-4 0-6 2-7 2s-3-2-7-2z"/>',
jantung:'<path class="f" d="M24 41C8 30 5 21 8 14c3-6 11-6 16 1 5-7 13-7 16-1 3 7 0 16-16 27z"/><path class="s" d="M14 17c-2 2-2 5-1 7"/>',
mata:'<path class="f" d="M3 24c6-10 14-14 21-14s15 4 21 14c-6 10-14 14-21 14S9 34 3 24z"/><circle cx="24" cy="24" r="9" fill="#fff"/><circle class="f" cx="24" cy="24" r="5"/>'};
const ico=(k,c)=>`<svg class="ill" viewBox="0 0 48 48" style="--ic:${c}" aria-hidden="true">${OI[k]}</svg>`;

/* ---------- DATA EDUKASI ---------- */
const ORG=[
{k:'otak',n:'Otak',c:'#b9a2e6',x:100,y:24,h:'Ketergantungan dopamin, brain fog, dan neuroinflamasi',p:['Gula mengaktifkan jalur reward dan melepas dopamin. Konsumsi berulang membuat kamu butuh porsi lebih besar untuk rasa puas yang sama.','Naik-turun glukosa darah memicu sulit fokus, lemas, dan "brain fog".','Pola makan tinggi gula dikaitkan dengan peradangan saraf (neuroinflamasi). Bukti pada manusia masih berkembang.']},
{k:'mata',n:'Mata',c:'#6cc4de',x:100,y:44,h:'Retinopati diabetik: risiko gangguan penglihatan hingga kebutaan',p:['Gula darah tinggi kronis merusak pembuluh darah halus di retina.','Tahap awal sering tanpa gejala. Penyandang diabetes perlu periksa mata rutin.','Retinopati diabetik termasuk penyebab utama gangguan penglihatan pada usia produktif.']},
{k:'gigi',n:'Gigi',c:'#7fd6e6',x:100,y:64,h:'Karies dan erosi email gigi',p:['Bakteri mulut mengubah gula menjadi asam yang mengikis email.','Frekuensi lebih berbahaya daripada jumlah: menyeruput minuman manis sepanjang hari membuat gigi terus terpapar asam.','WHO menyebut pembatasan gula bebas di bawah 10% (idealnya 5%) membantu menekan karies.']},
{k:'jantung',n:'Jantung',c:'#e5566d',x:112,y:112,h:'Trigliserida naik dan risiko kardiovaskular meningkat',p:['Gula berlebih meningkatkan trigliserida dan menurunkan kolesterol HDL.','Kalori cair dari minuman manis mendorong kenaikan berat badan dan tekanan darah.','Kombinasi ini meningkatkan risiko penyakit jantung dan stroke.']},
{k:'hati',n:'Hati',c:'#f0a07a',x:82,y:150,h:'Perlemakan hati non-alkohol (NAFLD)',p:['Fruktosa hampir seluruhnya diolah di hati. Kelebihannya diubah menjadi lemak (lipogenesis).','Lemak yang menumpuk menyebabkan perlemakan hati, sering tanpa gejala.','Tanpa perubahan pola hidup, bisa berlanjut menjadi peradangan dan fibrosis hati. Istilah medis terbaru: MASLD.']},
{k:'ginjal',n:'Ginjal',c:'#6cc4de',x:84,y:182,h:'Kerusakan glomerulus dan gagal ginjal kronis',p:['Gula darah tinggi menahun dan hipertensi merusak glomerulus, unit penyaring ginjal (nefropati diabetik).','Tanda awalnya protein bocor ke urin. Tanpa kendali, fungsi ginjal turun menjadi gagal ginjal kronis.','Tahap akhir memerlukan hemodialisis (cuci darah) atau transplantasi. Gagal ginjal punya banyak penyebab, tetapi diabetes adalah salah satu yang utama.']},
{k:'kulit',n:'Kulit',c:'#f4a6c6',x:40,y:150,h:'Glikasi kolagen (AGEs): keriput dini dan jerawat',p:['Gula menempel pada kolagen dan elastin membentuk AGEs (Advanced Glycation End-products) sehingga kulit kaku dan cepat berkeriput.','Lonjakan insulin dapat meningkatkan produksi minyak kulit sehingga jerawat lebih mudah muncul.','Mengurangi gula tidak langsung menghapus keriput, tetapi memperlambat kerusakan baru.']}];
const FLOW=[['🥤','Minuman manis harian','Kalori cair terserap cepat dan tidak membuat kenyang, sehingga asupan gula mudah berlebih.'],['📈','Resistensi insulin','Sel makin kurang peka terhadap insulin, sehingga pankreas harus memproduksi lebih banyak.'],['⚖️','Sindrom metabolik','Lemak perut, trigliserida, tekanan darah, dan gula darah naik bersamaan.'],['🩸','Diabetes tipe 2 dini','Pankreas tak lagi mengimbangi, gula darah tetap tinggi bahkan pada usia muda.'],['🫘','Nefropati diabetik','Gula tinggi dan hipertensi merusak glomerulus ginjal; protein bocor ke urin.'],['⚠️','Gagal ginjal kronis','Fungsi penyaringan ginjal menurun drastis dan tidak pulih.'],['🏥','Hemodialisis','Cuci darah rutin seumur hidup, atau transplantasi ginjal. Tidak semua orang mengikuti alur ini: genetik, berat badan, dan tekanan darah ikut berperan.']];
const DICT=[
['High Fructose Corn Syrup (HFCS)','sirup jagung fruktosa tinggi','Sirup dari pati jagung dengan fruktosa tinggi. Umum di minuman bersoda dan sirup.'],
['Isoglucose','isoglukosa, glukosa-fruktosa','Nama lain HFCS di Uni Eropa.'],
['Corn syrup','sirup jagung, sirup glukosa','Sirup glukosa dari pati jagung, pemanis murah di banyak produk olahan.'],
['Maltodextrin','maltodekstrin','Karbohidrat olahan yang cepat terserap dan indeks glikemiknya tinggi. Sering ada di minuman serbuk dan tidak selalu terasa manis.'],
['Dextrose','dekstrosa, glukosa','Bentuk glukosa murni yang langsung menaikkan gula darah.'],
['Glucose / glucose syrup','glukosa, sirup glukosa','Gula sederhana yang menjadi bahan bakar utama tubuh. Berlebih tetap dihitung gula tambahan.'],
['Sucrose','sukrosa, gula pasir, gula meja','Gula meja: setengah glukosa, setengah fruktosa.'],
['Fructose / Crystalline fructose','fruktosa, fruktosa kristal','Gula buah dalam bentuk murni. Diolah di hati; berlebihan memicu lemak hati.'],
['Maltose','maltosa, gula malt','Gula malt dari pati; ada di sirup malt, sereal, dan minuman malt.'],
['Lactose','laktosa','Gula alami susu. Susu berperisa biasanya masih ditambah gula lain.'],
['Invert sugar','gula invert, sirup invert','Sukrosa yang dipecah menjadi glukosa dan fruktosa. Lebih manis dan lembap, dipakai di kue dan minuman.'],
['Agave nectar','agave, sirup agave','Sering dipasarkan sebagai "alami", tetapi sangat tinggi fruktosa.'],
['Molasses','molase, tetes tebu','Sisa pengolahan tebu. Ada sedikit mineral, tetapi tetap gula.'],
['Honey','madu','Campuran glukosa dan fruktosa. Tetap dihitung gula tambahan.'],
['Palm / coconut sugar','gula aren, gula kelapa, gula jawa','Sebagian besar sukrosa. Dihitung sebagai gula tambahan.'],
['Cane / raw / brown sugar','gula tebu, gula mentah, gula merah, brown sugar','Kurang dimurnikan, tetapi kalorinya hampir sama dengan gula pasir.'],
['Concentrated fruit juice','sari buah pekat, jus konsentrat','Jus yang dipekatkan tanpa serat. Termasuk gula bebas menurut WHO.'],
['Rice / malt syrup','sirup beras, sirup malt','Sirup pati yang kaya glukosa dan maltosa.'],
['Caramel','karamel','Gula yang dipanaskan; pemanis sekaligus pewarna pada minuman.']];
const HID=DICT.length;
const MYTH=[
['🍯','Gula aren sehat, aman dikonsumsi banyak','Gula aren memang punya sedikit mineral dan indeks glikemik yang dilaporkan lebih rendah, tetapi sebagian besar tetap sukrosa. Dihitung gula tambahan, jadi total tetap maksimal 50 g per hari.'],
['🧃','Jus buah kemasan sama sehatnya dengan buah utuh','Jus kehilangan serat dan sering ditambah gula. Menkes (Jan 2026) menyoroti jus kemasan yang gulanya lebih menonjol daripada porsi buahnya. WHO menghitung gula dalam jus sebagai gula bebas, sedangkan buah utuh tidak.'],
['🧊','Minuman es bikin gemuk','Dinginnya tidak menambah lemak. Yang menambah kalori adalah gula, sirup, dan susu kental manis di dalamnya. Es batu dan air tidak berkalori.'],
['🧋','Less sugar berarti bebas gula','Boba 45 g gula pada level 50% masih ±22 g, sudah hampir setengah batas harian. Pilih no sugar atau 25% kalau ingin benar-benar rendah.']];
const SPN=[['🧋','Boba milk tea',45],['🥫','Soda kaleng',35],['🥤','Es teh jumbo',40]];
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

/* ---------- SEKSI EDUKASI ---------- */
const secReg=()=>`<section class="sec"><h2>Batas aman konsumsi gula</h2>
<div class="two"><div class="card big"><b>50 g</b><span>Batas maksimal harian</span><small>Permenkes No. 30 Tahun 2013 · ≈ 4 sdm · 10% dari 2.000 kkal</small></div>
<div class="card big mint"><b>25 g</b><span>Anjuran ideal WHO</span><small>Conditional recommendation · ≈ 2 sdm · 5% energi</small></div></div>
<div class="card"><h3>Hitung batasmu sendiri</h3><label>Kebutuhan energi: <b id="enT"></b><input id="en" type="range" min="1200" max="3000" step="100" value="${UI.en}"></label><div class="out" id="enO" style="margin-top:.7rem"></div>
<p class="mu" style="margin:.6rem 0 0">WHO (2015) menyarankan gula bebas (gula tambahan, madu, sirup, dan gula dalam jus) kurang dari 10% energi harian. Di bawah 5% memberi manfaat kesehatan tambahan. Permenkes 30/2013 juga membatasi natrium 2.000 mg dan lemak total 67 g per hari.</p></div></section>`;

const secData=()=>`<section class="sec"><h2>Krisis diabetes dan cuci darah</h2>
<div class="card hero2 lilac"><div class="rk">#5</div><p><b>Peringkat 5 dunia.</b> IDF Diabetes Atlas menempatkan Indonesia di peringkat kelima jumlah dewasa (20–79 tahun) dengan diabetes, sekitar 19,47 juta orang pada 2021. Secara global, 589 juta dewasa hidup dengan diabetes pada 2024 (IDF Atlas edisi ke-11).</p></div>
<div class="card"><div class="out">
<div><b>47,5%</b>penduduk usia 3 tahun ke atas minum manis lebih dari 1× sehari (SKI 2023)</div>
<div><b>11,7%</b>penduduk dengan kadar gula di atas normal (SKI 2023)</div>
<div><b>17,9%</b>penyandang diabetes yang tahu kondisinya dan rutin berobat (SKI 2023)</div>
<div><b>20–35 g</b>rata-rata gula per minuman kemasan manis (Menkes, Jan 2026)</div>
<div><b>235</b>per 1 juta penduduk menjalani hemodialisis (Kemenkes)</div>
<div><b>1.225</b>layanan hemodialisis di Indonesia (Kemenkes)</div>
<div><b>31,4%</b>proporsi pasien cuci darah usia 25–34 tahun (2023), naik dari 19,29% (2018)*</div>
<div><b>56,4%</b>remaja 15–19 tahun minum manis minimal 1× sehari*</div></div>
<p class="mu" style="margin:.7rem 0 0">Kemenkes menyatakan gagal ginjal kronis mulai merambah usia produktif, dan data Indonesian Renal Registry (Pernefri) menunjukkan pasien baru hemodialisis meningkat pada 2016–2020. Gagal ginjal punya banyak penyebab, terutama diabetes dan hipertensi; minuman manis harian adalah faktor risiko yang bisa dikendalikan.<br>*Dikutip dari pemberitaan/skripsi yang merujuk SKI 2023. Cek angka resmi terbaru di Kemenkes BKPK, IDF, dan Pernefri.</p></div>
<details><summary>Alur dari minuman manis sampai cuci darah</summary><ol class="flow">${FLOW.map((s,i)=>`<li><button type="button" data-a="stp" data-i="${i}" class="${i?'':'on'}"><span>${s[0]}</span>${s[1]}</button></li>`).join('')}</ol><div class="card lilac" id="stpD" style="margin-bottom:.8rem"></div></details></section>`;

const secCrash=()=>`<section class="sec"><details open><summary>⚡ Biological sugar crash</summary><ol><li>Gula cepat serap membuat glukosa darah melonjak.</li><li>Pankreas melepas insulin berlebih (<b>insulin spike</b>).</li><li>Glukosa turun drastis: <b>food coma</b>, mengantuk, sulit fokus, lemas.</li><li>Tubuh meminta gula lagi (<b>cravings</b>) dan siklus berulang.</li></ol></details>
<details><summary>🥤 Apa itu SSB?</summary><p><b>Sugar-Sweetened Beverages</b> adalah minuman dengan gula tambahan: teh manis, soda, boba, kopi susu, minuman serbuk, dan jus kemasan. Kalori cair tidak membuat kenyang, sehingga mudah melampaui batas harian.</p></details></section>`;

const secBody=()=>`<section class="sec"><h2>Peta dampak pada organ tubuh</h2><div class="card"><div class="bm"><svg class="body" viewBox="0 0 200 330" role="group" aria-label="Peta organ tubuh">
<g class="sil"><circle cx="100" cy="44" r="34"/><rect x="88" y="74" width="24" height="16" rx="6"/><rect x="58" y="86" width="84" height="132" rx="38"/><rect x="26" y="96" width="26" height="120" rx="13"/><rect x="148" y="96" width="26" height="120" rx="13"/><rect x="66" y="208" width="30" height="112" rx="15"/><rect x="104" y="208" width="30" height="112" rx="15"/></g>
${ORG.map(o=>{const pts=o.k==='ginjal'?[[84,182],[116,182]]:[[o.x,o.y]];return pts.map(p=>`<g class="hs" data-a="org" data-k="${o.k}" tabindex="0" role="button" aria-label="${o.n}" style="--hc:${o.c}"><circle class="r" cx="${p[0]}" cy="${p[1]}" r="8"/><circle class="c" cx="${p[0]}" cy="${p[1]}" r="8"/></g>`).join('')}).join('')}</svg>
<div><div class="tabs">${ORG.map(o=>`<button type="button" class="chip" data-a="org" data-k="${o.k}">${o.n}</button>`).join('')}</div><div id="orgD"></div></div></div><p class="mu" style="margin:0">Ketuk titik pada tubuh atau pilih nama organ.</p></div></section>`;

const secDict=()=>`<section class="sec"><h2>Kamus gula tersembunyi</h2><div class="card"><input id="dq" type="search" placeholder="Cari nama gula, mis. HFCS, maltodekstrin, madu" aria-label="Cari nama gula"><p class="mu" id="dn" style="margin:.5rem 0"></p><div id="dl"></div><p class="mu" style="margin:.6rem 0 0">Tips: nama berakhiran <b>-osa</b> (sukrosa, dekstrosa, maltosa) biasanya gula. Semakin awal posisinya di daftar komposisi, semakin banyak kandungannya.</p></div></section>`;

const secLabel=()=>`<section class="sec"><h2>Panduan label BPOM</h2>
<div class="card lilac"><h3>Logo "Pilihan Lebih Sehat"</h3><p><span class="pls"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e8f68" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>Pilihan Lebih Sehat</span></p><p>Logo centang hijau dari BPOM RI, dipasang secara sukarela pada produk yang memenuhi batas gula, garam, dan lemak. Untuk minuman, ambang gulanya sekitar 6 g per 100 ml (Peraturan BPOM No. 22/2019 dan No. 26/2021). Logo ini bukan berarti boleh diminum sebanyak-banyaknya.</p>
<h3>Nutri-Level A–D</h3><div clas
