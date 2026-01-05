/**
 * Jewelry Quote Web (vanilla JS)
 * - Multi-line stones (main/side)
 * - Stone type + quality + weight (ct)
 * - Diamond 4C simplified price table
 * - Treatment multipliers (heated/unheated/filling)
 * - Side stones by mm+qty => estimated ct
 * - Metal material + weight + auto/manual price + loss rate
 * - Labor + packaging + profit + tax
 * - Copy quote text
 *
 * NOTE: Built-in pricing is SAMPLE. Edit CATALOG.* to your own cost system.
 */

const CATALOG = {
  currencyList: ["LKR", "USD", "CNY", "HKD", "EUR"],
  stoneRoles: ["Main Stone", "Side Stone"],
  // priceMode: 0 auto, 1 manual
  priceModes: ["Auto Price", "Manual Price"],
  // weightMode: 0 total ct, 1 each*qty, 2 mm*qty estimate (round melee)
  weightModes: ["Total Weight (ct)", "Weight Each × Qty (ct)", "Diameter(mm) × Qty (Est. ct)"],
  // Treatment multiplier (typical industry handling; adjust to your business rules)
  treatments: [
    { key: "natural_unknown", name: "Natural (Default)", mult: 1.00 },
    { key: "heated", name: "Heated", mult: 0.90 },
    { key: "unheated", name: "Unheated", mult: 1.25 },
    { key: "oiled", name: "Oiled", mult: 0.85 },
    { key: "diffusion", name: "Diffusion", mult: 0.60 },
    { key: "glass_filled", name: "Glass Filled", mult: 0.45 },
    { key: "fracture_filled", name: "Fracture Filled", mult: 0.55 }
  ],
  // Colored gems base price per ct by grade (SAMPLE)
  coloredGems: [
    {
      key: "sapphire", name: "Sapphire", grades: [
        { grade: "Commercial", p: 120 }, { grade: "AA", p: 260 }, { grade: "AAA", p: 520 }, { grade: "Premium", p: 1200 }
      ]
    },
    {
      key: "ruby", name: "Ruby", grades: [
        { grade: "Commercial", p: 180 }, { grade: "AA", p: 420 }, { grade: "AAA", p: 900 }, { grade: "Premium", p: 2200 }
      ]
    },
    {
      key: "emerald", name: "Emerald", grades: [
        { grade: "Commercial", p: 160 }, { grade: "AA", p: 380 }, { grade: "AAA", p: 850 }, { grade: "Premium", p: 2000 }
      ]
    },
    {
      key: "spinel", name: "Spinel", grades: [
        { grade: "Commercial", p: 90 }, { grade: "AA", p: 220 }, { grade: "AAA", p: 480 }, { grade: "Premium", p: 900 }
      ]
    },
    {
      key: "tourmaline", name: "Tourmaline", grades: [
        { grade: "Commercial", p: 60 }, { grade: "AA", p: 140 }, { grade: "AAA", p: 320 }, { grade: "Premium", p: 800 }
      ]
    }
  ],
  // Diamond price: simplified, by carat bracket + color group + clarity group (SAMPLE, per ct)
  // You should replace with your own market/wholesale pricing rules.
  diamond: {
    name: "Diamond",
    caratBrackets: [
      { key: "0.30-0.49", min: 0.30, max: 0.49 },
      { key: "0.50-0.69", min: 0.50, max: 0.69 },
      { key: "0.70-0.99", min: 0.70, max: 0.99 },
      { key: "1.00-1.49", min: 1.00, max: 1.49 },
      { key: "1.50-1.99", min: 1.50, max: 1.99 },
      { key: "2.00+", min: 2.00, max: 99 }
    ],
    colors: ["D-F", "G-H", "I-J", "K-M"],
    clarities: ["IF/VVS", "VS", "SI", "I"],
    cuts: [
      { name: "Excellent", mult: 1.08 },
      { name: "Very Good", mult: 1.03 },
      { name: "Good", mult: 1.00 },
      { name: "Fair", mult: 0.92 }
    ],
    fluorescence: [
      { name: "None", mult: 1.00 },
      { name: "Faint", mult: 0.99 },
      { name: "Medium", mult: 0.96 },
      { name: "Strong", mult: 0.92 }
    ],
    // base[bracket][color][clarity] => price/ct
    base: {
      "0.30-0.49": {
        "D-F": { "IF/VVS": 3500, "VS": 2400, "SI": 1500, "I": 900 },
        "G-H": { "IF/VVS": 3000, "VS": 2100, "SI": 1350, "I": 820 },
        "I-J": { "IF/VVS": 2550, "VS": 1800, "SI": 1180, "I": 720 },
        "K-M": { "IF/VVS": 2000, "VS": 1450, "SI": 980, "I": 600 }
      },
      "0.50-0.69": {
        "D-F": { "IF/VVS": 5200, "VS": 3600, "SI": 2200, "I": 1300 },
        "G-H": { "IF/VVS": 4500, "VS": 3200, "SI": 2050, "I": 1200 },
        "I-J": { "IF/VVS": 3900, "VS": 2800, "SI": 1900, "I": 1100 },
        "K-M": { "IF/VVS": 3200, "VS": 2350, "SI": 1650, "I": 980 }
      },
      "0.70-0.99": {
        "D-F": { "IF/VVS": 6500, "VS": 4800, "SI": 3000, "I": 1800 },
        "G-H": { "IF/VVS": 5900, "VS": 4300, "SI": 2800, "I": 1650 },
        "I-J": { "IF/VVS": 5300, "VS": 3900, "SI": 2600, "I": 1550 },
        "K-M": { "IF/VVS": 4300, "VS": 3200, "SI": 2200, "I": 1350 }
      },
      "1.00-1.49": {
        "D-F": { "IF/VVS": 8800, "VS": 6500, "SI": 4200, "I": 2600 },
        "G-H": { "IF/VVS": 8000, "VS": 6000, "SI": 3900, "I": 2400 },
        "I-J": { "IF/VVS": 7200, "VS": 5400, "SI": 3600, "I": 2250 },
        "K-M": { "IF/VVS": 5900, "VS": 4500, "SI": 3100, "I": 2000 }
      },
      "1.50-1.99": {
        "D-F": { "IF/VVS": 11500, "VS": 8600, "SI": 5700, "I": 3600 },
        "G-H": { "IF/VVS": 10600, "VS": 8000, "SI": 5300, "I": 3300 },
        "I-J": { "IF/VVS": 9800, "VS": 7400, "SI": 5000, "I": 3100 },
        "K-M": { "IF/VVS": 8200, "VS": 6300, "SI": 4300, "I": 2800 }
      },
      "2.00+": {
        "D-F": { "IF/VVS": 15000, "VS": 11200, "SI": 7600, "I": 5000 },
        "G-H": { "IF/VVS": 14000, "VS": 10500, "SI": 7200, "I": 4700 },
        "I-J": { "IF/VVS": 13000, "VS": 9800, "SI": 6800, "I": 4500 },
        "K-M": { "IF/VVS": 11000, "VS": 8500, "SI": 6000, "I": 4100 }
      }
    }
  },
  metals: [
    { key: "18k", name: "18K Gold", defaultPpg: 70 },
    { key: "14k", name: "14K Gold", defaultPpg: 55 },
    { key: "pt950", name: "PT950", defaultPpg: 95 },
    { key: "s925", name: "S925 Silver", defaultPpg: 1.2 }
  ],
  // Melee size(mm) => ct each (round brilliant approx). Used for quick estimation.
  // Source: common trade approximation. Adjust as needed.
  meleeMmToCt: [
    [0.8, 0.003], [0.9, 0.004], [1.0, 0.005], [1.1, 0.006], [1.2, 0.008], [1.3, 0.010],
    [1.4, 0.012], [1.5, 0.015], [1.6, 0.018], [1.7, 0.022], [1.8, 0.025], [1.9, 0.030],
    [2.0, 0.035], [2.1, 0.040], [2.2, 0.045], [2.3, 0.050], [2.4, 0.060], [2.5, 0.070],
    [2.6, 0.080], [2.7, 0.090], [2.8, 0.100], [2.9, 0.110], [3.0, 0.120], [3.2, 0.140],
    [3.4, 0.160], [3.6, 0.180], [3.8, 0.200], [4.0, 0.250], [4.5, 0.350], [5.0, 0.500]
  ]
};

// ---------- helpers ----------
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const num = (v) => { const x = parseFloat(v); return Number.isFinite(x) ? x : 0; };
const money = (v) => (Math.round(v * 100) / 100).toFixed(2);
const uid = () => (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)).toUpperCase();

function getCcy() { return state.currency; }

function interpolateMeleeCt(mm) {
  const x = num(mm);
  if (x <= 0) return 0;
  const arr = CATALOG.meleeMmToCt;
  if (x <= arr[0][0]) return arr[0][1];
  if (x >= arr[arr.length - 1][0]) return arr[arr.length - 1][1];
  for (let i = 0; i < arr.length - 1; i++) {
    const [m1, c1] = arr[i], [m2, c2] = arr[i + 1];
    if (x >= m1 && x <= m2) {
      const t = (x - m1) / (m2 - m1);
      return c1 + t * (c2 - c1);
    }
  }
  return 0;
}

function diamondBracketKey(carat) {
  const c = num(carat);
  for (const b of CATALOG.diamond.caratBrackets) {
    if (c >= b.min && c <= b.max) return b.key;
  }
  return "0.30-0.49";
}

function diamondAutoPricePerCt(opts) {
  const c = num(opts.carat);
  if (c <= 0) return 0;
  const bkey = diamondBracketKey(c);
  const base = CATALOG.diamond.base[bkey]?.[opts.color]?.[opts.clarity] ?? 0;
  const cutMult = CATALOG.diamond.cuts[opts.cutIndex]?.mult ?? 1;
  const fluMult = CATALOG.diamond.fluorescence[opts.fluorIndex]?.mult ?? 1;
  return base * cutMult * fluMult;
}

function treatmentMult(key) {
  return CATALOG.treatments.find(t => t.key === key)?.mult ?? 1;
}

function makeQuoteNo() {
  const d = new Date();
  const pad = (x) => x < 10 ? ("0" + x) : ("" + x);
  return `Q${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// ---------- state ----------
let state = {
  quoteNo: makeQuoteNo(),
  customerName: "",
  productName: "",
  currency: CATALOG.currencyList[0],
  stones: [],
  metal: {
    materialKey: CATALOG.metals[0].key,
    weightG: "",
    priceMode: 0,
    pricePerGram: String(CATALOG.metals[0].defaultPpg),
    lossRate: "",
    extraFee: ""
  },
  labor: { designFee: "", moldFee: "", makingFee: "", reworkFee: "" },
  pack: { packFee: "", certFee: "" },
  profitRate: "",
  taxRate: ""
};

// ---------- stone model ----------
function newStoneLine({ roleIndex = 0, isDiamond = false } = {}) {
  const gem = isDiamond ? { key: "diamond" } : CATALOG.coloredGems[0];
  const typeKey = isDiamond ? "diamond" : gem.key;

  const line = {
    id: uid(),
    roleIndex,
    typeKey,
    // weight modes
    weightMode: 0, // 0 total ct; 1 each*qty; 2 mm*qty (melee)
    totalCt: "",
    ctEach: "",
    qty: roleIndex === 0 ? "1" : "0",
    mm: "",

    // colored gem quality
    gradeIndex: 1, // default AA
    treatmentKey: "natural_unknown",

    // diamond 4C
    dColor: "G-H",
    dClarity: "VS",
    dCutIndex: 0,
    dFluorIndex: 0,

    // pricing
    priceMode: 0, // auto/manual
    pricePerCt: "", // if manual or auto-filled
    sub: "0.00"
  };

  // init auto price per ct
  line.pricePerCt = String(getStoneAutoPricePerCt(line));
  return line;
}

function isDiamondLine(line) { return line.typeKey === "diamond"; }

function getStoneAutoPricePerCt(line) {
  if (isDiamondLine(line)) {
    // Use total carat (or derived) for bracket
    const carat = getLineTotalCt(line);
    return diamondAutoPricePerCt({
      carat,
      color: line.dColor,
      clarity: line.dClarity,
      cutIndex: line.dCutIndex,
      fluorIndex: line.dFluorIndex
    });
  } else {
    const gem = CATALOG.coloredGems.find(g => g.key === line.typeKey) || CATALOG.coloredGems[0];
    const g = gem.grades[clamp(line.gradeIndex, 0, gem.grades.length - 1)]?.p ?? 0;
    return g * treatmentMult(line.treatmentKey);
  }
}

function getLineTotalCt(line) {
  if (line.weightMode === 0) return num(line.totalCt);
  if (line.weightMode === 1) return num(line.ctEach) * num(line.qty);
  // melee estimate
  const eachCt = interpolateMeleeCt(line.mm);
  return eachCt * num(line.qty);
}

function recalc() {
  // stones
  let stonesTotal = 0;
  state.stones = state.stones.map(line => {
    const totalCt = getLineTotalCt(line);
    let ppc = num(line.pricePerCt);

    if (line.priceMode === 0) {
      ppc = getStoneAutoPricePerCt(line);
    }

    const sub = totalCt * ppc;
    const out = { ...line, pricePerCt: (line.priceMode === 0 ? String(ppc) : line.pricePerCt), sub: money(sub) };
    stonesTotal += num(out.sub);
    return out;
  });

  // metal
  const metal = { ...state.metal };
  const mat = CATALOG.metals.find(m => m.key === metal.materialKey) || CATALOG.metals[0];
  if (metal.priceMode === 0) {
    metal.pricePerGram = String(mat.defaultPpg);
  }
  const loss = num(metal.lossRate) / 100;
  const metalSub = num(metal.weightG) * (1 + loss) * num(metal.pricePerGram) + num(metal.extraFee);

  // labor
  const laborSub = num(state.labor.designFee) + num(state.labor.moldFee) + num(state.labor.makingFee) + num(state.labor.reworkFee);

  // packaging
  const packSub = num(state.pack.packFee) + num(state.pack.certFee);

  const costTotal = stonesTotal + metalSub + laborSub + packSub;

  const profit = num(state.profitRate) / 100;
  const tax = num(state.taxRate) / 100;
  const quoteTotal = costTotal * (1 + profit) * (1 + tax);

  // update computed
  Object.assign(computed, {
    stonesTotal: money(stonesTotal),
    metalSub: money(metalSub),
    laborSub: money(laborSub),
    packSub: money(packSub),
    costTotal: money(costTotal),
    quoteTotal: money(quoteTotal)
  });

  // persist state
  try { localStorage.setItem("jewelry_quote_state_v1", JSON.stringify(state)); } catch (_) { }

  // render if page has renderer
  if (typeof window.render === "function") window.render();
}

let computed = {
  stonesTotal: "0.00", metalSub: "0.00", laborSub: "0.00", packSub: "0.00", costTotal: "0.00", quoteTotal: "0.00"
};

// ---------- persistence ----------
function loadState() {
  try {
    const raw = localStorage.getItem("jewelry_quote_state_v1");
    if (!raw) return false;
    const obj = JSON.parse(raw);
    if (!obj || !Array.isArray(obj.stones)) return false;

    // Mutate existing state object
    Object.keys(state).forEach(k => delete state[k]);
    Object.assign(state, obj);

    // sanity: ensure at least one stone
    if (state.stones.length === 0) state.stones = [newStoneLine({ roleIndex: 0 })];
    // ensure quoteNo exists
    if (!state.quoteNo) state.quoteNo = makeQuoteNo();
    return true;
  } catch (_) { return false; }
}

function resetAll() {
  const newState = {
    quoteNo: makeQuoteNo(),
    customerName: "",
    productName: "",
    currency: CATALOG.currencyList[0],
    stones: [newStoneLine({ roleIndex: 0 })],
    metal: {
      materialKey: CATALOG.metals[0].key,
      weightG: "",
      priceMode: 0,
      pricePerGram: String(CATALOG.metals[0].defaultPpg),
      lossRate: "",
      extraFee: ""
    },
    labor: { designFee: "", moldFee: "", makingFee: "", reworkFee: "" },
    pack: { packFee: "", certFee: "" },
    profitRate: "",
    taxRate: ""
  };

  // Mutate existing state object
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, newState);

  recalc();
}

function copyQuoteText() {
  const ccy = getCcy();
  const lines = state.stones.map((s, i) => {
    const role = CATALOG.stoneRoles[s.roleIndex] || "—";
    const totalCt = getLineTotalCt(s);
    const type = isDiamondLine(s) ? CATALOG.diamond.name : (CATALOG.coloredGems.find(g => g.key === s.typeKey)?.name ?? s.typeKey);
    let detail = "";
    if (isDiamondLine(s)) {
      detail = `4C: ${s.dColor} / ${s.dClarity} / ${CATALOG.diamond.cuts[s.dCutIndex]?.name} | Fluor:${CATALOG.diamond.fluorescence[s.dFluorIndex]?.name}`;
    } else {
      const gem = CATALOG.coloredGems.find(g => g.key === s.typeKey) || CATALOG.coloredGems[0];
      const grade = gem.grades[s.gradeIndex]?.grade ?? "—";
      const tName = CATALOG.treatments.find(t => t.key === s.treatmentKey)?.name ?? "—";
      detail = `Grade:${grade} | Treat:${tName}`;
    }
    const wmode = CATALOG.weightModes[s.weightMode];
    let wtxt = "";
    if (s.weightMode === 0) wtxt = `${s.totalCt || 0}ct`;
    else if (s.weightMode === 1) wtxt = `${s.ctEach || 0}×${s.qty || 0}ct`;
    else wtxt = `${s.mm || 0}mm×${s.qty || 0} (Est. ct)`;
    return `${i + 1}. ${role} | ${type} | ${detail} | W.Mode:${wmode} | Weight:${wtxt} | Price/ct:${money(num(s.pricePerCt))} | Sub:${ccy} ${s.sub}`;
  }).join("\n");

  const mat = CATALOG.metals.find(m => m.key === state.metal.materialKey) || CATALOG.metals[0];
  const text =
    `Jewelry Quote
Quote No: ${state.quoteNo}
Customer: ${state.customerName || "-"}
Product: ${state.productName || "-"}
Currency: ${ccy}

【Gem Details】
${lines}
Gems Total: ${ccy} ${computed.stonesTotal}

【Precious Metal】
Material: ${mat.name}
Weight(g): ${state.metal.weightG || 0}
Price/g: ${state.metal.pricePerGram || 0} (${CATALOG.priceModes[state.metal.priceMode] || ""})
Loss Rate: ${state.metal.lossRate || 0}%
Extra Fee: ${state.metal.extraFee || 0}
Metal Subtotal: ${ccy} ${computed.metalSub}

【Labor】
Design: ${state.labor.designFee || 0}
Mold: ${state.labor.moldFee || 0}
Making: ${state.labor.makingFee || 0}
Buffer: ${state.labor.reworkFee || 0}
Labor Subtotal: ${ccy} ${computed.laborSub}

【Packaging】
Pack Fee: ${state.pack.packFee || 0}
Cert/Tag: ${state.pack.certFee || 0}
Pack Subtotal: ${ccy} ${computed.packSub}

Total Cost: ${ccy} ${computed.costTotal}
Profit Rate: ${state.profitRate || 0}%
Tax Rate: ${state.taxRate || 0}%
Final Quote: ${ccy} ${computed.quoteTotal}
`;
  navigator.clipboard?.writeText(text).then(() => {
    alert("Quote copied to clipboard");
  }).catch(() => {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    alert("Quote copied to clipboard");
  });
}

window.__JQ = { CATALOG, state, computed, recalc, resetAll, newStoneLine, loadState, copyQuoteText, getLineTotalCt, interpolateMeleeCt, diamondAutoPricePerCt };
