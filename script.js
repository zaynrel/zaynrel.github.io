// ============================================================
//  FIF Simulasi Kredit Motor — script.js
//  Uses FIF_DATA from data.js (no formula calculations)
// ============================================================

const motorSelect    = document.getElementById('motor-select');
const otrBadge       = document.getElementById('otr-badge');
const otrValue       = document.getElementById('otr-value');
const tenorGroup     = document.getElementById('tenor-group');
const tenorButtons   = document.getElementById('tenor-buttons');
const dpGroup        = document.getElementById('dp-group');
const dpInput        = document.getElementById('dp-input');
const dpRangeHint    = document.getElementById('dp-range-hint');
const dpError        = document.getElementById('dp-error');
const simulateBtn    = document.getElementById('simulate-btn');
const resultCard     = document.getElementById('result-card');
const resetBtn       = document.getElementById('reset-btn');

// Result elements
const resMotor       = document.getElementById('res-motor');
const resDp          = document.getElementById('res-dp');
const resDpNote      = document.getElementById('res-dp-note');
const resInstallment = document.getElementById('res-installment');
const resTenor       = document.getElementById('res-tenor');
const resOtr         = document.getElementById('res-otr');
const resTotal       = document.getElementById('res-total');

let selectedSheetKey = null;
let selectedTenor    = null;
let rawDpValue       = '';

// ─── Helpers ────────────────────────────────────────────────

function formatRp(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function parseRpInput(str) {
  // Remove all non-digit characters
  return parseInt(str.replace(/\D/g, ''), 10) || 0;
}

function formatDpDisplay(num) {
  // Format number with thousand separators for the input field
  return num === 0 ? '' : num.toLocaleString('id-ID');
}

function findClosestDp(dpTable, targetDp) {
  let closest = null;
  let minDiff = Infinity;
  for (const row of dpTable) {
    const diff = Math.abs(row.dp - targetDp);
    if (diff < minDiff) {
      minDiff = diff;
      closest = row;
    }
  }
  return closest;
}

// ─── Populate motor dropdown ─────────────────────────────────

function populateMotors() {
  const keys = Object.keys(FIF_DATA);
  keys.forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = FIF_DATA[key].name;
    motorSelect.appendChild(opt);
  });
}

// ─── Populate tenor buttons ───────────────────────────────────

function populateTenors(tenors) {
  tenorButtons.innerHTML = '';
  tenors.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'tenor-btn';
    btn.dataset.tenor = t;
    btn.innerHTML = `${t}<small>bln</small>`;
    btn.addEventListener('click', () => selectTenor(t));
    tenorButtons.appendChild(btn);
  });
}

function selectTenor(tenor) {
  selectedTenor = tenor;
  document.querySelectorAll('.tenor-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.tenor) === tenor);
  });
  // Show DP field
  dpGroup.style.display = 'flex';
  const data = FIF_DATA[selectedSheetKey];
  const minDp = data.dp_table[0].dp;
  const maxDp = data.dp_table[data.dp_table.length - 1].dp;
  dpRangeHint.textContent = `Tersedia: ${formatRp(minDp)} – ${formatRp(maxDp)}`;
  dpInput.focus();
  checkShowSimulateBtn();
}

// ─── Event: motor select ──────────────────────────────────────

motorSelect.addEventListener('change', () => {
  const key = motorSelect.value;
  selectedSheetKey = key || null;
  selectedTenor = null;
  rawDpValue = '';
  dpInput.value = '';
  dpError.classList.add('hidden');

  if (!key) {
    otrBadge.classList.add('hidden');
    tenorGroup.style.display = 'none';
    dpGroup.style.display = 'none';
    simulateBtn.classList.add('hidden');
    return;
  }

  const data = FIF_DATA[key];
  otrValue.textContent = formatRp(data.otr);
  otrBadge.classList.remove('hidden');

  tenorGroup.style.display = 'flex';
  populateTenors(data.tenors);

  dpGroup.style.display = 'none';
  simulateBtn.classList.add('hidden');
});

// ─── Event: DP input ──────────────────────────────────────────

dpInput.addEventListener('input', (e) => {
  // Remove non-numeric characters and reformat
  const raw = e.target.value.replace(/\D/g, '');
  rawDpValue = raw;
  const num = parseInt(raw, 10) || 0;
  // Reformat with thousand separator
  const formatted = num > 0 ? num.toLocaleString('id-ID') : '';
  // Set cursor correction
  e.target.value = formatted;

  dpError.classList.add('hidden');
  checkShowSimulateBtn();
  validateDpRange(num);
});

function validateDpRange(num) {
  if (!selectedSheetKey || num === 0) return;
  const data = FIF_DATA[selectedSheetKey];
  const minDp = data.dp_table[0].dp;
  const maxDp = data.dp_table[data.dp_table.length - 1].dp;
  if (num < minDp || num > maxDp) {
    dpError.classList.remove('hidden');
  } else {
    dpError.classList.add('hidden');
  }
}

function checkShowSimulateBtn() {
  const dpNum = parseInt(rawDpValue, 10) || 0;
  if (selectedSheetKey && selectedTenor && dpNum > 0) {
    simulateBtn.classList.remove('hidden');
  } else {
    simulateBtn.classList.add('hidden');
  }
}

// ─── Simulate ─────────────────────────────────────────────────

simulateBtn.addEventListener('click', simulate);

function simulate() {
  const dpNum = parseInt(rawDpValue, 10) || 0;
  if (!selectedSheetKey || !selectedTenor || dpNum === 0) return;

  const data = FIF_DATA[selectedSheetKey];
  const minDp = data.dp_table[0].dp;
  const maxDp = data.dp_table[data.dp_table.length - 1].dp;

  if (dpNum < minDp || dpNum > maxDp) {
    dpError.classList.remove('hidden');
    return;
  }

  // Find closest DP row
  const closest = findClosestDp(data.dp_table, dpNum);
  const tenorKey = String(selectedTenor);
  const installment = closest.installments[tenorKey];

  if (!installment) {
    alert('Data angsuran tidak ditemukan untuk tenor ini.');
    return;
  }

  // Calculate total
  const total = installment * selectedTenor;

  // Populate result
  resMotor.textContent = data.name;
  resDp.textContent = formatRp(closest.dp);
  if (closest.dp !== dpNum) {
    resDpNote.textContent = `(DP terdekat dari ${formatRp(dpNum)})`;
  } else {
    resDpNote.textContent = '';
  }
  resInstallment.textContent = formatRp(installment);
  resTenor.textContent = selectedTenor + ' bulan';
  resOtr.textContent = formatRp(data.otr);
  resTotal.textContent = formatRp(total + closest.dp);

  // Show result, hide form
  document.querySelector('.form-card').style.display = 'none';
  resultCard.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Reset ────────────────────────────────────────────────────

resetBtn.addEventListener('click', () => {
  document.querySelector('.form-card').style.display = 'flex';
  resultCard.classList.add('hidden');
  // Don't reset motor/tenor selection — let user just change DP
  dpInput.value = '';
  rawDpValue = '';
  dpError.classList.add('hidden');
  simulateBtn.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Init ─────────────────────────────────────────────────────
populateMotors();
