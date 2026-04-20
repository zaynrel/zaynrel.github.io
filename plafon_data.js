// ============================================================
//  PLAFON DISKON — SEMUA LEASING, bracket 15-30% DP/OTR
//  Sumber: MOTOR 2025 - APRIL 2026 - DGM
// ============================================================

const MOTOR_TO_PLAFON_KEY = {
  "BEAT CBS NEW":"BEAT","BEAT DELUXE CBS ISS NEW":"BEAT","BEAT DELUXE SMART KEY":"BEAT","BEAT STREET NEW":"BEAT",
  "GENIO CBS":"GENIO","GENIO CBS White & White Red Blu":"GENIO","GENIO CBS ISS":"GENIO",
  "ALL NEW SCOOPY ENERGETIC":"SCOOPY KUNCI","ALL NEW SCOOPY FASHION":"SCOOPY KUNCI",
  "ALL NEW SCOOPY PRESTIGE & STYLI":"SCOOPY REMOTE",
  "REVO FIT FI":"REVO","REVO X":"REVO",
  "SUPRA X 125 SW":"SUPRA","SUPRA X 125 CW":"SUPRA X CW",
  "SUPRA GTR 150 SPORTY":"GTR","SUPRA GTR 150 EXCLUSIVE":"GTR",
  "VARIO 125 CBS":"VARIO 125","VARIO 125 CBS ISS":"VARIO 125","VARIO 125 STREET":"VARIO 125 ST",
  "VARIO 160 CBS":"VARIO 160","VARIO 160 CBS SP":"VARIO 160","VARIO 160 ABS":"VARIO 160",
  "New Stylo 160 CBS":"STYLO","New Stylo 160 ABS":"STYLO","New Stylo 160 SE":"STYLO",
  "NEW PCX 160 CBS":"PCX","NEW PCX 160 ABS":"PCX","NEW PCX 160 ABS ROAD SYNC":"PCX",
  "ADV 160 CBS":"ADV","ADV 160 ABS":"ADV","ADV 160 ABS ROADSYNC":"ADV ROADSYNC",
  "CB 150X SE":"CB & CBR 150","CB 150X STD":"CB & CBR 150","CRF 150L":"CRF",
  "CB 150 VERZA STD":"CB & CBR 150","CB 150 VERZA CW":"CB & CBR 150",
  "SONIC 150 STD MMC":"CB & CBR 150","SONIC 150 SE RR":"CB & CBR 150",
  "CB 150 R STD":"CB & CBR 150","CB 150 R SE":"CB & CBR 150",
  "CBR 150 R STD (BK)":"CB & CBR 150","CBR 150 R STD (MH) (RD)":"CB & CBR 150",
  "CBR 150 R ABS (BK)":"CB & CBR 150","CBR 150 R ABS (RD)":"CB & CBR 150",
  "CBR250RR STD":"CBX","CBR250RR STD MB MH":"CBX","CBR250RR ABS RR":"CBX",
  "CBR250RR QS MH":"CBX","CBR 250 RR QS RRTC":"CBX",
  "CRF 250 RALLY":"CRF","CRF 250 L":"CRF",
  "MONKEY 125":"CBX","ST 125 DAX":"CBX","FORZA":"CBX",
  "SUPERCUB 125":"CBX","CT 125":"CBX",
  "EM1 e + Charger":"CBX","EM1 e Plus + Charger":"CBX","CUV eplus":"CBX","ICON E":"CBX"
};

// Plafon diskon SEMUA LEASING 15-30% | tenor key: "11_17", "23_29", "35"
const PLAFON_15_30 = {
  "BEAT":          {"11_17":600000,  "23_29":1500000, "35":1700000},
  "GENIO":         {"11_17":600000,  "23_29":1300000, "35":1600000},
  "SCOOPY KUNCI":  {"11_17":600000,  "23_29":1400000, "35":1700000},
  "SCOOPY REMOTE": {"11_17":500000,  "23_29":1200000, "35":1500000},
  "VARIO 125":     {"11_17":200000,  "23_29":1000000, "35":1000000},
  "VARIO 125 ST":  {"11_17":200000,  "23_29":1200000, "35":1400000},
  "STYLO":         {"11_17":100000,  "23_29":100000,  "35":100000},
  "VARIO 160":     {"11_17":600000,  "23_29":1700000, "35":2000000},
  "PCX":           {"11_17":600000,  "23_29":1900000, "35":2200000},
  "ADV":           {"11_17":600000,  "23_29":2000000, "35":2200000},
  "ADV ROADSYNC":  {"11_17":100000,  "23_29":100000,  "35":100000},
  "CB & CBR 150":  {"11_17":600000,  "23_29":2400000, "35":2400000},
  "CBX":           {"11_17":600000,  "23_29":2400000, "35":2400000},
  "GTR":           {"11_17":600000,  "23_29":1500000, "35":1700000},
  "CRF":           {"11_17":600000,  "23_29":1500000, "35":1700000},
  "SUPRA X CW":    {"11_17":600000,  "23_29":1100000, "35":1300000},
  "REVO":          {"11_17":600000,  "23_29":1100000, "35":1300000},
  "SUPRA":         {"11_17":600000,  "23_29":1100000, "35":1300000},
  "REVO + SUPRA":  {"11_17":600000,  "23_29":1100000, "35":1300000},
};

function getTenorKey(tenor) {
  if (tenor === 11 || tenor === 17) return "11_17";
  if (tenor === 23 || tenor === 29) return "23_29";
  return "35";
}

function getPlafonDiskon(sheetKey, tenor) {
  const pk = MOTOR_TO_PLAFON_KEY[sheetKey];
  if (!pk) return 0;
  const tbl = PLAFON_15_30[pk];
  if (!tbl) return 0;
  return tbl[getTenorKey(tenor)] || 0;
}
