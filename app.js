(() => {
'use strict';

const PRESETS = [
  { n: 'Boba Milk Tea', g: 40, e: '🧋' },
  { n: 'Kopi Susu Kekinian', g: 25, e: '☕' },
  { n: 'Minuman Bersoda', g: 33, e: '🥤' },
  { n: 'Cokelat Batangan', g: 24, e: '🍫' },
  { n: 'Es Krim', g: 20, e: '🍦' },
  { n: 'Donat Glaze', g: 12, e: '🍩' }
];
const LIMITS = { anak: 25, remaja: 40, dewasa: 50, lansia: 40 };
const SDT = 4, SDM = 12.5; // gram gula per sendok teh / sendok makan
const KEY = 'manisku-v1';
const $ = s => document.querySelector(s);
const fmt = n => (Math.round(n * 10) / 10).toString().replace('.', ',');

/* ---------- State ---------- */
let state = { items: [], profile: 'dewasa', custom: '' };
try { Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
const limit = () => { const c = parseFloat(state.custom); return c > 0 ? c : LIMITS[state.profile] || 50; };
const total = () => state.items.reduce((s, i) => s + i.g * i.qty, 0);

/* ---------- Router (hash-based SPA) ---------- */
function route() {
  const calc = location.hash.startsWith('#/kalkulator');
  $('#view-home').hidden = calc;
  $('#view-calc').hidden = !calc;
  document.querySelectorAll('[data-nav]').forEach(a =>
    a.classList.toggle('active', a.dataset.nav === (calc ? 'calc' : 'home')));
  document.title = calc ? 'Kalkulator Gula – ManisKu' : 'ManisKu – Kalkulator Gula Harian';
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* ---------- Render ---------- */
function renderPresets() {
  const box = $('#presets');
  PRESETS.forEach(p => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip';
    b.textContent = `${p.e} ${p.n} `;
    const s = document.createElement('small'); s.textContent = `~${p.g} g`;
    b.appendChild(s);
    b.addEventListener('click', () => addItem(p.n, p.g, 1));
    box.appendChild(b);
  });
}

function renderList() {
  const ul = $('#list'); ul.innerHTML = '';
  if (!state.items.length) {
    const li = document.createElement('li'); li.className = 'empty';
    li.textContent = 'Belum ada catatan. Pilih makanan di atas atau isi manual.';
    ul.appendChild(li); return;
  }
  state.items.forEach(it => {
    const li = document.createElement('li');
    const sp = document.createElement('span');
    sp.textContent = it.name;
    const sm = document.createElement('small');
    sm.textContent = `${it.qty} × ${fmt(it.g)} g = ${fmt(it.g * it.qty)} g gula`;
    sp.appendChild(sm);
    const del = document.createElement('button');
    del.type = 'button'; del.textContent = '✕';
    del.setAttribute('aria-label', 'Hapus ' + it.name);
    del.addEventListener('click', () => { state.items = state.items.filter(x => x.id !== it.id); update(); });
    li.append(sp, del); ul.appendChild(li);
  });
}

function tip(cls, title, body) {
  const d = document.createElement('div'); d.className = 'tip ' + cls;
  const h = document.createElement('h4'); h.textContent = title; d.appendChild(h);
  if (Array.isArray(body)) {
    const ul = document.createElement('ul');
    body.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    d.appendChild(ul);
  } else { const p = document.createElement('p'); p.textContent = body; d.appendChild(p); }
  return d;
}

function renderResult() {
  const t = total(), l = limit(), pct = (t / l) * 100;
  const level = pct > 100 ? 'over' : pct >= 75 ? 'warn' : 'safe';
  const r = $('#result');
  r.className = 'card ' + level;
  $('#badge').textContent = { safe: 'Aman', warn: 'Waspada', over: 'Melebihi batas' }[level];
  $('#pct').textContent = Math.round(pct) + '%';
  $('#bar').style.width = Math.min(100, pct) + '%';
  r.querySelector('.meter').setAttribute('aria-valuenow', Math.min(100, Math.round(pct)));
  $('#sTotal').textContent = fmt(t) + ' g';
  $('#sLimit').textContent = fmt(l) + ' g';
  $('#sSdt').textContent = fmt(t / SDT) + ' sdt';
  $('#sSdm').textContent = fmt(t / SDM) + ' sdm';

  const adv = $('#advice'); adv.innerHTML = '';
  if (!state.items.length) {
    adv.appendChild(tip('', 'Mulai dari catatan pertama', 'Tambahkan minuman atau makanan manis yang kamu konsumsi hari ini untuk melihat analisisnya.'));
    return;
  }
  if (level === 'safe') {
    adv.appendChild(tip('mint', 'Kerja bagus! 🎉', 'Asupan gula hari ini masih terkendali. Kamu punya sisa sekitar ' + fmt(l - t) + ' g.'));
    adv.appendChild(tip('', 'Tips menjaga pola sehat', ['Utamakan air putih sebagai minuman utama.', 'Pilih buah utuh dibanding jus kemasan.', 'Biasakan memesan minuman dengan gula less atau sedikit.']));
  } else if (level === 'warn') {
    adv.appendChild(tip('', 'Hampir mencapai batas ⚠️', 'Sisa jatah gulamu tinggal ' + fmt(Math.max(0, l - t)) + ' g. Sebaiknya hentikan minuman manis berikutnya hari ini.'));
    adv.appendChild(tip('mint', 'Langkah berikutnya', ['Ganti minuman manis dengan air putih atau teh tawar.', 'Pilih camilan tanpa tambahan gula, seperti buah atau kacang.', 'Kurangi level gula saat memesan minuman.']));
  } else {
    const over = t - l, mins = Math.max(30, Math.round((over * 4) / 5 / 5) * 5);
    adv.appendChild(tip('pink', 'Kamu melebihi batas ' + fmt(over) + ' g 🚨', 'Tidak perlu panik. Satu hari berlebih bisa diimbangi dengan pola yang lebih baik mulai sekarang.'));
    adv.appendChild(tip('mint', 'Aktivitas fisik untuk membantu', ['Jalan cepat minimal 30 menit (perkiraan kasar ' + mins + ' menit untuk mengimbangi kelebihan kalorinya).', 'Atau olahraga ringan seperti bersepeda santai, senam, atau naik tangga.', 'Minum air putih yang cukup sepanjang hari.']));
    adv.appendChild(tip('lilac', 'Pengganti gula yang lebih baik', ['Buah segar seperti pisang, apel, atau beri.', 'Stevia sebagai pemanis tanpa kalori.', 'Madu murni, tetapi tetap secukupnya karena tetap dihitung gula.']));
    adv.appendChild(tip('', 'Cara membaca label Nutrition Facts', ['Cek takaran saji dan jumlah sajian per kemasan, lalu kalikan.', 'Lihat baris "Gula" dalam gram, bukan hanya karbohidrat total.', 'Waspadai nama lain gula: sukrosa, fruktosa, sirup jagung, glukosa, dekstrosa, maltosa.', 'Bandingkan produk dan pilih yang gulanya paling rendah per sajian.']));
  }
}

function update() { save(); renderList(); renderResult(); }

function addItem(name, g, qty) {
  state.items.push({ id: Date.now() + Math.random(), name, g, qty });
  update();
}

/* ---------- Events ---------- */
function init() {
  renderPresets();
  $('#profile').value = state.profile;
  $('#custom').value = state.custom;
  $('#profile').addEventListener('change', e => { state.profile = e.target.value; update(); });
  $('#custom').addEventListener('input', e => { state.custom = e.target.value; update(); });
  $('#addForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name').value.trim(), g = parseFloat($('#grams').value), qty = parseInt($('#qty').value, 10);
    if (!name || !(g > 0) || !(qty > 0)) return;
    addItem(name, g, qty);
    e.target.reset(); $('#qty').value = 1; $('#name').focus();
  });
  $('#clearBtn').addEventListener('click', () => {
    if (state.items.length && confirm('Hapus semua catatan hari ini?')) { state.items = []; update(); }
  });
  route(); update();
}

/* ---------- PWA ---------- */
let deferred;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferred = e; $('#installBtn').hidden = false;
});
$('#installBtn').addEventListener('click', async () => {
  if (!deferred) return;
  deferred.prompt(); await deferred.userChoice; deferred = null; $('#installBtn').hidden = true;
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

init();
})();
