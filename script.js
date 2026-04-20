// ============================================================
//  Simulasi Kredit Motor — script.js
//  Logic: DP bebas, DP minimum = Setor Dealer (untung = 0)
//  Plafon: SEMUA LEASING bracket 15-30% dari plafon_data.js
// ============================================================

// ─── DOM ─────────────────────────────────────────────────────
const motorSelect   = document.getElementById('motor-select');
const otrBadge      = document.getElementById('otr-badge');
const otrValueEl    = document.getElementById('otr-value');
const tenorGroup    = document.getElementById('tenor-group');
const tenorBtnsEl   = document.getElementById('tenor-buttons');
const dpGroup       = document.getElementById('dp-group');
const dpInput       = document.getElementById('dp-input');
const dpMinHint     = document.getElementById('dp-min-hint');
const dpNormalHint  = document.getElementById('dp-normal-hint');
const dpError       = document.getElementById('dp-error');
const simulateBtn   = document.getElementById('simulate-btn');
const resultCard    = document.getElementById('result-card');
const resetBtn      = document.getElementById('reset-btn');

// Result
const resMotor       = document.getElementById('res-motor');
const resInstallment = document.getElementById('res-installment');
const resTenor       = document.getElementById('res-tenor');
const resOtr         = document.getElementById('res-otr');
const resDpCustomer  = document.getElementById('res-dp-customer');
const resDpNormal    = document.getElementById('res-dp-normal');
const resDpNote      = document.getElementById('res-dp-note');
const resPlafon      = document.getElementById('res-plafon');
const resSetor       = document.getElementById('res-setor');
const resUntung      = document.getElementById('res-untung');
const resDpMinNote   = document.getElementById('res-dp-min-note');
const resTotalKredit = document.getElementById('res-total-kredit');

// ─── State ───────────────────────────────────────────────────
let selectedSheetKey = null;
let selectedTenor    = null;
let rawDpValue       = '';

// Derived from selected motor + tenor (updated when tenor selected)
let currentDpMin    = 0;   // DP minimum = setor dealer
let currentDpNormal = 0;   // first DP in table (DP normal minimum)

// ─── Helpers ─────────────────────────────────────────────────
const fmt = n => 'Rp ' + Number(n).toLocaleString('id-ID');

function findClosestDp(dpTable, target) {
  return dpTable.reduce((best, row) =>
    Math.abs(row.dp - target) < Math.abs(best.dp - target) ? row : best
  );
}

function setDpInputValue(num) {
  rawDpValue = String(num);
  dpInput.value = num > 0 ? num.toLocaleString('id-ID') : '';
}

// ─── Compute DP min for current motor + tenor ─────────────────
function computeDpMin(sheetKey, tenor) {
  const data   = FIF_DATA[sheetKey];
  const plafon = getPlafonDiskon(sheetKey, tenor);
  // Walk dp_table from lowest DP; find first row where dp - plafon >= 0
  // i.e. setor dealer >= 0 and untung >= 0 when dpCustomer == setor
  // Setor dealer = dpNormal - plafon
  // dpMin = setor dealer = dpNormal - plafon
  // We use the smallest dp entry's setor as the dp minimum
  const firstRow = data.dp_table[0];
  const setor    = Math.max(0, firstRow.dp - plafon);
  return setor; // DP minimum customer bisa bayar tanpa nombok
}

// ─── Populate motor dropdown ──────────────────────────────────
function populateMotors() {
  Object.keys(FIF_DATA).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = FIF_DATA[key].name;
    motorSelect.appendChild(opt);
  });
}

// ─── Populate tenor buttons ───────────────────────────────────
function populateTenors(tenors) {
  tenorBtnsEl.innerHTML = '';
  tenors.forEach(t => {
    const btn = document.createElement('button');
    btn.className  = 'tenor-btn';
    btn.dataset.tenor = t;
    btn.innerHTML  = `${t}<small>bln</small>`;
    btn.addEventListener('click', () => selectTenor(t));
    tenorBtnsEl.appendChild(btn);
  });
}

function selectTenor(tenor) {
  selectedTenor = tenor;
  document.querySelectorAll('.tenor-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.dataset.tenor) === tenor)
  );

  const data = FIF_DATA[selectedSheetKey];
  const plafon = getPlafonDiskon(selectedSheetKey, tenor);

  // DP min = setor dealer from lowest dp row
  currentDpMin    = Math.max(0, data.dp_table[0].dp - plafon);
  currentDpNormal = data.dp_table[0].dp;

  // Update hints
  dpMinHint.textContent    = `Min: ${fmt(currentDpMin)}`;
  dpNormalHint.textContent = `Normal: ${fmt(currentDpNormal)}`;

  // Make chips clickable → auto-fill
  dpMinHint.onclick    = () => { setDpInputValue(currentDpMin);    validateAndUpdate(); };
  dpNormalHint.onclick = () => { setDpInputValue(currentDpNormal); validateAndUpdate(); };

  dpGroup.style.display = 'flex';
  dpInput.value = '';
  rawDpValue = '';
  dpError.classList.add('hidden');
  simulateBtn.classList.add('hidden');
  dpInput.focus();
}

// ─── Motor change ─────────────────────────────────────────────
motorSelect.addEventListener('change', () => {
  const key = motorSelect.value;
  selectedSheetKey = key || null;
  selectedTenor    = null;
  rawDpValue       = '';
  dpInput.value    = '';
  dpError.classList.add('hidden');

  if (!key) {
    otrBadge.classList.add('hidden');
    tenorGroup.style.display = 'none';
    dpGroup.style.display    = 'none';
    simulateBtn.classList.add('hidden');
    return;
  }

  otrValueEl.textContent = fmt(FIF_DATA[key].otr);
  otrBadge.classList.remove('hidden');
  tenorGroup.style.display = 'flex';
  populateTenors(FIF_DATA[key].tenors);
  dpGroup.style.display    = 'none';
  simulateBtn.classList.add('hidden');
});

// ─── DP input ─────────────────────────────────────────────────
dpInput.addEventListener('input', e => {
  rawDpValue = e.target.value.replace(/\D/g, '');
  const num = parseInt(rawDpValue, 10) || 0;
  e.target.value = num > 0 ? num.toLocaleString('id-ID') : '';
  validateAndUpdate(num);
});

function validateAndUpdate(num) {
  if (num === undefined) num = parseInt(rawDpValue, 10) || 0;
  if (!selectedSheetKey || !selectedTenor) return;

  const data   = FIF_DATA[selectedSheetKey];
  const maxDp  = data.dp_table[data.dp_table.length - 1].dp;

  if (num === 0) {
    dpError.classList.add('hidden');
    simulateBtn.classList.add('hidden');
    return;
  }

  if (num < currentDpMin) {
    dpError.textContent = `⚠ DP minimum ${fmt(currentDpMin)} — sales akan nombok di bawah ini`;
    dpError.classList.remove('hidden');
    simulateBtn.classList.add('hidden');
  } else if (num > maxDp) {
    dpError.textContent = `⚠ DP maksimum ${fmt(maxDp)}`;
    dpError.classList.remove('hidden');
    simulateBtn.classList.add('hidden');
  } else {
    dpError.classList.add('hidden');
    simulateBtn.classList.remove('hidden');
  }
}

// ─── Simulate ─────────────────────────────────────────────────
simulateBtn.addEventListener('click', simulate);

function simulate() {
  const dpCustomer = parseInt(rawDpValue, 10) || 0;
  if (!selectedSheetKey || !selectedTenor || dpCustomer === 0) return;

  const data        = FIF_DATA[selectedSheetKey];
  const closestRow  = findClosestDp(data.dp_table, dpCustomer);
  const dpNormal    = closestRow.dp;
  const installment = closestRow.installments[String(selectedTenor)];
  if (!installment) { alert('Data angsuran tidak tersedia.'); return; }

  const plafon  = getPlafonDiskon(selectedSheetKey, selectedTenor);
  const setor   = Math.max(0, dpNormal - plafon);
  const untung  = Math.max(0, dpCustomer - setor);
  const totalKredit = dpCustomer + (installment * selectedTenor);

  // Render
  resMotor.textContent        = data.name;
  resInstallment.textContent  = fmt(installment);
  resTenor.textContent        = selectedTenor + ' bulan';
  resOtr.textContent          = fmt(data.otr);
  resDpCustomer.textContent   = fmt(dpCustomer);
  resDpNormal.textContent     = fmt(dpNormal);
  resDpNote.textContent       = dpNormal !== dpCustomer ? `terdekat dari ${fmt(dpCustomer)}` : '';
  resPlafon.textContent       = fmt(plafon);
  resSetor.textContent        = fmt(setor);
  resUntung.textContent       = fmt(untung);
  resUntung.className         = 'profit-value' + (untung === 0 ? ' zero' : '');
  resDpMinNote.textContent    = untung === 0
    ? '⚠ Ini DP minimum — untung sales = 0'
    : `DP minimum untuk motor ini: ${fmt(setor)}`;
  resTotalKredit.textContent  = fmt(totalKredit);

  document.querySelector('.form-card').style.display = 'none';
  resultCard.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Reset ────────────────────────────────────────────────────
resetBtn.addEventListener('click', () => {
  document.querySelector('.form-card').style.display = 'flex';
  resultCard.classList.add('hidden');
  dpInput.value = '';
  rawDpValue    = '';
  dpError.classList.add('hidden');
  simulateBtn.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Init ─────────────────────────────────────────────────────
populateMotors();
