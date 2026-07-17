// Builds the embedded game data for index.html from the simplified geoBoundaries
// ADM2 GeoJSON (data/bgd-districts-simplified.geojson).
//
// Outputs data/game-data.json and injects it into index.html between the
// //<GAME_DATA> ... //</GAME_DATA> sentinels.
//
// Run: node tools/build-data.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const geo = JSON.parse(
  fs.readFileSync(path.join(root, "data", "bgd-districts-simplified.geojson"), "utf8")
);

// Keyed by the shapeName used in the geoBoundaries file (older spellings).
// en = current official romanization, bn = Bangla name, div = division,
// alias = other spellings people commonly type.
const NAMES = {
  Barguna:       { en: "Barguna", bn: "বরগুনা", div: "Barishal" },
  Barisal:       { en: "Barishal", bn: "বরিশাল", div: "Barishal", alias: ["Barisal"] },
  Bhola:         { en: "Bhola", bn: "ভোলা", div: "Barishal" },
  Jhalokati:     { en: "Jhalokathi", bn: "ঝালকাঠি", div: "Barishal", alias: ["Jhalokati", "Jhalakathi"] },
  Patuakhali:    { en: "Patuakhali", bn: "পটুয়াখালী", div: "Barishal" },
  Pirojpur:      { en: "Pirojpur", bn: "পিরোজপুর", div: "Barishal" },
  Bandarban:     { en: "Bandarban", bn: "বান্দরবান", div: "Chattogram" },
  Brahamanbaria: { en: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া", div: "Chattogram", alias: ["Brahamanbaria", "B Baria", "Brahmanbari"] },
  Chandpur:      { en: "Chandpur", bn: "চাঁদপুর", div: "Chattogram" },
  Chittagong:    { en: "Chattogram", bn: "চট্টগ্রাম", div: "Chattogram", alias: ["Chittagong", "Ctg"] },
  Comilla:       { en: "Cumilla", bn: "কুমিল্লা", div: "Chattogram", alias: ["Comilla"] },
  "Cox's Bazar": { en: "Cox's Bazar", bn: "কক্সবাজার", div: "Chattogram", alias: ["Coxs Bazar", "Cox Bazar", "Coxbazar", "কক্স বাজার"] },
  Feni:          { en: "Feni", bn: "ফেনী", div: "Chattogram", alias: ["Pheni"] },
  Khagrachhari:  { en: "Khagrachhari", bn: "খাগড়াছড়ি", div: "Chattogram", alias: ["Khagrachari"] },
  Lakshmipur:    { en: "Lakshmipur", bn: "লক্ষ্মীপুর", div: "Chattogram", alias: ["Laxmipur", "Lakshmipur", "Lokkhipur"] },
  Noakhali:      { en: "Noakhali", bn: "নোয়াখালী", div: "Chattogram" },
  Rangamati:     { en: "Rangamati", bn: "রাঙ্গামাটি", div: "Chattogram", alias: ["রাঙামাটি"] },
  Dhaka:         { en: "Dhaka", bn: "ঢাকা", div: "Dhaka", alias: ["Dacca"] },
  Faridpur:      { en: "Faridpur", bn: "ফরিদপুর", div: "Dhaka" },
  Gazipur:       { en: "Gazipur", bn: "গাজীপুর", div: "Dhaka", alias: ["Gajipur"] },
  Gopalganj:     { en: "Gopalganj", bn: "গোপালগঞ্জ", div: "Dhaka", alias: ["Gopalgonj"] },
  Kishoreganj:   { en: "Kishoreganj", bn: "কিশোরগঞ্জ", div: "Dhaka", alias: ["Kishorganj", "Kishoregonj"] },
  Madaripur:     { en: "Madaripur", bn: "মাদারীপুর", div: "Dhaka" },
  Manikganj:     { en: "Manikganj", bn: "মানিকগঞ্জ", div: "Dhaka", alias: ["Manikgonj"] },
  Munshiganj:    { en: "Munshiganj", bn: "মুন্সিগঞ্জ", div: "Dhaka", alias: ["Munshigonj", "Munshiganj"] },
  Narayanganj:   { en: "Narayanganj", bn: "নারায়ণগঞ্জ", div: "Dhaka", alias: ["Narayangonj"] },
  Narsingdi:     { en: "Narsingdi", bn: "নরসিংদী", div: "Dhaka", alias: ["Narshingdi"] },
  Rajbari:       { en: "Rajbari", bn: "রাজবাড়ী", div: "Dhaka", alias: ["Rajbari"] },
  Shariatpur:    { en: "Shariatpur", bn: "শরীয়তপুর", div: "Dhaka", alias: ["Shariyatpur"] },
  Tangail:       { en: "Tangail", bn: "টাঙ্গাইল", div: "Dhaka" },
  Bagerhat:      { en: "Bagerhat", bn: "বাগেরহাট", div: "Khulna" },
  Chuadanga:     { en: "Chuadanga", bn: "চুয়াডাঙ্গা", div: "Khulna" },
  Jessore:       { en: "Jashore", bn: "যশোর", div: "Khulna", alias: ["Jessore", "Jossore"] },
  Jhenaidah:     { en: "Jhenaidah", bn: "ঝিনাইদহ", div: "Khulna", alias: ["Jhenidah", "Jhinaidah"] },
  Khulna:        { en: "Khulna", bn: "খুলনা", div: "Khulna" },
  Kushtia:       { en: "Kushtia", bn: "কুষ্টিয়া", div: "Khulna", alias: ["Kustia"] },
  Magura:        { en: "Magura", bn: "মাগুরা", div: "Khulna" },
  Meherpur:      { en: "Meherpur", bn: "মেহেরপুর", div: "Khulna" },
  Narail:        { en: "Narail", bn: "নড়াইল", div: "Khulna", alias: ["Norail"] },
  Satkhira:      { en: "Satkhira", bn: "সাতক্ষীরা", div: "Khulna", alias: ["Shatkhira"] },
  Jamalpur:      { en: "Jamalpur", bn: "জামালপুর", div: "Mymensingh" },
  Mymensingh:    { en: "Mymensingh", bn: "ময়মনসিংহ", div: "Mymensingh", alias: ["Moymonshingho"] },
  Netrakona:     { en: "Netrokona", bn: "নেত্রকোণা", div: "Mymensingh", alias: ["Netrakona", "নেত্রকোনা"] },
  Sherpur:       { en: "Sherpur", bn: "শেরপুর", div: "Mymensingh" },
  Bogra:         { en: "Bogura", bn: "বগুড়া", div: "Rajshahi", alias: ["Bogra"] },
  Nawabganj:     { en: "Chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ", div: "Rajshahi", alias: ["Nawabganj", "Chapai Nawabganj", "Chapai", "চাঁপাই নবাবগঞ্জ"] },
  Joypurhat:     { en: "Joypurhat", bn: "জয়পুরহাট", div: "Rajshahi", alias: ["Jaipurhat", "Joipurhat"] },
  Naogaon:       { en: "Naogaon", bn: "নওগাঁ", div: "Rajshahi", alias: ["Nogaon"] },
  Natore:        { en: "Natore", bn: "নাটোর", div: "Rajshahi", alias: ["Nator"] },
  Pabna:         { en: "Pabna", bn: "পাবনা", div: "Rajshahi" },
  Rajshahi:      { en: "Rajshahi", bn: "রাজশাহী", div: "Rajshahi" },
  Sirajganj:     { en: "Sirajganj", bn: "সিরাজগঞ্জ", div: "Rajshahi", alias: ["Sirajgonj", "Shirajganj"] },
  Dinajpur:      { en: "Dinajpur", bn: "দিনাজপুর", div: "Rangpur" },
  Gaibandha:     { en: "Gaibandha", bn: "গাইবান্ধা", div: "Rangpur", alias: ["Gaibanda"] },
  Kurigram:      { en: "Kurigram", bn: "কুড়িগ্রাম", div: "Rangpur" },
  Lalmonirhat:   { en: "Lalmonirhat", bn: "লালমনিরহাট", div: "Rangpur", alias: ["Lalmonir hat"] },
  Nilphamari:    { en: "Nilphamari", bn: "নীলফামারী", div: "Rangpur", alias: ["Nilfamari"] },
  Panchagarh:    { en: "Panchagarh", bn: "পঞ্চগড়", div: "Rangpur", alias: ["Panchagar", "Ponchogor"] },
  Rangpur:       { en: "Rangpur", bn: "রংপুর", div: "Rangpur", alias: ["Rongpur"] },
  Thakurgaon:    { en: "Thakurgaon", bn: "ঠাকুরগাঁও", div: "Rangpur", alias: ["Thakurgao"] },
  Habiganj:      { en: "Habiganj", bn: "হবিগঞ্জ", div: "Sylhet", alias: ["Hobiganj", "Habigonj"] },
  Maulvibazar:   { en: "Moulvibazar", bn: "মৌলভীবাজার", div: "Sylhet", alias: ["Maulvibazar", "Moulovibazar", "Maulvi Bazar", "Moulvi Bazar"] },
  Sunamganj:     { en: "Sunamganj", bn: "সুনামগঞ্জ", div: "Sylhet", alias: ["Sunamgonj"] },
  Sylhet:        { en: "Sylhet", bn: "সিলেট", div: "Sylhet", alias: ["Silet"] },
};

const DIV_BN = {
  Dhaka: "ঢাকা", Chattogram: "চট্টগ্রাম", Rajshahi: "রাজশাহী", Khulna: "খুলনা",
  Barishal: "বরিশাল", Sylhet: "সিলেট", Rangpur: "রংপুর", Mymensingh: "ময়মনসিংহ",
};

// --- local equirectangular projection to km (Bangladesh spans ~5° lat, fine) ---
const LAT0 = 23.7;
const KX = 111.32 * Math.cos((LAT0 * Math.PI) / 180);
const KY = 110.574;
const toKm = ([lon, lat]) => [lon * KX, lat * KY];

function ringsOf(geom) {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  return polys.flat(); // all rings (outer + holes) as arrays of [lon,lat]
}

function largestRingCentroid(geom) {
  let best = null, bestArea = -1;
  for (const ring of ringsOf(geom)) {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i], [x2, y2] = ring[i + 1];
      const f = x1 * y2 - x2 * y1;
      a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f;
    }
    const area = Math.abs(a / 2);
    if (area > bestArea) {
      bestArea = area;
      cx /= 3 * a; cy /= 3 * a;
      best = [cx, cy];
    }
  }
  return [Number(best[0].toFixed(4)), Number(best[1].toFixed(4))];
}

function segDist2(p, a, b) {
  const abx = b[0] - a[0], aby = b[1] - a[1];
  const apx = p[0] - a[0], apy = p[1] - a[1];
  const len2 = abx * abx + aby * aby;
  let t = len2 ? (apx * abx + apy * aby) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const dx = apx - t * abx, dy = apy - t * aby;
  return dx * dx + dy * dy;
}

function minBorderDistKm(ringsA, ringsB) {
  let best = Infinity;
  const pass = (P, Q) => {
    for (const rp of P) for (const p of rp)
      for (const rq of Q) for (let i = 0; i < rq.length - 1; i++) {
        const d2 = segDist2(p, rq[i], rq[i + 1]);
        if (d2 < best) best = d2;
      }
  };
  pass(ringsA, ringsB);
  pass(ringsB, ringsA);
  return Math.sqrt(best);
}

// --- assemble districts, sorted by English name for a stable order ---
const feats = geo.features.map((f) => {
  const meta = NAMES[f.properties.shapeName];
  if (!meta) throw new Error("No name entry for " + f.properties.shapeName);
  return { meta, geom: f.geometry };
});
feats.sort((a, b) => a.meta.en.localeCompare(b.meta.en));

const districts = feats.map((f) => ({
  en: f.meta.en,
  bn: f.meta.bn,
  div: f.meta.div,
  alias: f.meta.alias || [],
  c: largestRingCentroid(f.geom),
  // polys: array of rings, each ring an array of [lon, lat]
  polys: ringsOf(f.geom),
}));

// --- pairwise min border distance matrix (lower triangle, integer km) ---
const kmRings = feats.map((f) => ringsOf(f.geom).map((r) => r.map(toKm)));
const n = feats.length;
const dist = [];
let maxKm = 0;
for (let i = 1; i < n; i++) {
  for (let j = 0; j < i; j++) {
    let d = minBorderDistKm(kmRings[i], kmRings[j]);
    if (d < 0.75) d = 0; // shared border after simplification → adjacent
    const km = Math.round(d);
    dist.push(km);
    if (km > maxKm) maxKm = km;
  }
}

const out = { n, maxKm, divBn: DIV_BN, districts, dist };
fs.writeFileSync(path.join(root, "data", "game-data.json"), JSON.stringify(out));

// --- sanity report ---
const idx = Object.fromEntries(districts.map((d, i) => [d.en, i]));
const D = (a, b) => {
  const i = idx[a], j = idx[b];
  if (i === j) return 0;
  const [hi, lo] = i > j ? [i, j] : [j, i];
  return dist[(hi * (hi - 1)) / 2 + lo];
};
const neighborsOf = (name) =>
  districts.filter((d) => d.en !== name && D(name, d.en) === 0).map((d) => d.en);

console.log("districts:", n, "| maxKm:", maxKm);
console.log("Dhaka neighbors:", neighborsOf("Dhaka").join(", "));
console.log("Dhaka–Chattogram km:", D("Dhaka", "Chattogram"));
console.log("Panchagarh–Cox's Bazar km:", D("Panchagarh", "Cox's Bazar"));
console.log("Sylhet neighbors:", neighborsOf("Sylhet").join(", "));
console.log("json bytes:", fs.statSync(path.join(root, "data", "game-data.json")).size);

// --- inject into index.html if present ---
const htmlPath = path.join(root, "index.html");
if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const re = /(\/\/<GAME_DATA>)[\s\S]*?(\/\/<\/GAME_DATA>)/;
  if (re.test(html)) {
    fs.writeFileSync(
      htmlPath,
      html.replace(re, `$1\nwindow.GAME_DATA = ${JSON.stringify(out)};\n$2`)
    );
    console.log("injected into index.html");
  } else {
    console.log("index.html has no GAME_DATA sentinels; skipped injection");
  }
}
