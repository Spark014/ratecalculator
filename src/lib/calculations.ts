import { Stone, QuoteState, ComputedValues } from './types';
import { PricingConfig } from './pricing-context';
import { CATALOG } from './catalog';

export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
export const num = (v: string | number) => { const x = typeof v === 'string' ? parseFloat(v) : v; return Number.isFinite(x) ? x : 0; };
export const money = (v: number) => (Math.round(v * 100) / 100).toFixed(2);
export const uid = () => (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)).toUpperCase();

export function interpolateMeleeCt(mm: string | number): number {
    const x = num(mm);
    if (x <= 0) return 0;
    const arr = CATALOG.meleeMmToCt;
    if (x <= arr[0][0]) return arr[0][1];
    if (x >= arr[arr.length - 1][0]) return arr[arr.length - 1][1];
    for (let i = 0; i < arr.length - 1; i++) {
        const [m1, c1] = arr[i];
        const [m2, c2] = arr[i + 1];
        if (x >= m1 && x <= m2) {
            const t = (x - m1) / (m2 - m1);
            return c1 + t * (c2 - c1);
        }
    }
    return 0;
}

export function diamondBracketKey(carat: string | number): string {
    const c = num(carat);
    for (const b of CATALOG.diamond.caratBrackets) {
        if (c >= b.min && c <= b.max) return b.key;
    }
    return "0.30-0.49";
}

interface DiamondPriceOpts {
    carat: string | number;
    color: string;
    clarity: string;
    cutIndex: number;
    fluorIndex: number;
}

export function diamondAutoPricePerCt(opts: DiamondPriceOpts): number {
    const c = num(opts.carat);
    if (c <= 0) return 0;
    const bkey = diamondBracketKey(c);
    // @ts-ignore - Dynamic key access for diamond base price
    const base = CATALOG.diamond.base[bkey]?.[opts.color]?.[opts.clarity] ?? 0;
    const cutMult = CATALOG.diamond.cuts[opts.cutIndex]?.mult ?? 1;
    const fluMult = CATALOG.diamond.fluorescence[opts.fluorIndex]?.mult ?? 1;
    return base * cutMult * fluMult;
}

export function treatmentMult(key: string): number {
    return CATALOG.treatments.find(t => t.key === key)?.mult ?? 1;
}

export function makeQuoteNo(): string {
    const d = new Date();
    const pad = (x: number) => x < 10 ? ("0" + x) : ("" + x);
    return `Q${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export function isDiamondLine(line: Stone): boolean {
    return line.typeKey === "diamond";
}

export function getLineTotalCt(line: Stone): number {
    if (line.weightMode === 0) return num(line.totalCt);
    if (line.weightMode === 1) return num(line.ctEach) * num(line.qty);
    // melee estimate
    const eachCt = interpolateMeleeCt(line.mm);
    return eachCt * num(line.qty);
}

// NEW: Advanced Colored Gem Pricing (Royal Blue etc)
export function getAdvancedGemPrice(line: Stone, config?: PricingConfig): number {
    const colorKey = line.gemColor;
    if (!colorKey) return 0;

    let gemData: any = null;

    // 1. Try Config First
    if (config && config.advancedGems && config.advancedGems[colorKey]) {
        gemData = config.advancedGems[colorKey];
    }
    // 2. Fallback to Catalog
    else if (CATALOG.ADVANCED_GEMS[colorKey as keyof typeof CATALOG.ADVANCED_GEMS]) {
        gemData = CATALOG.ADVANCED_GEMS[colorKey as keyof typeof CATALOG.ADVANCED_GEMS];
    }

    if (!gemData) return 0;

    // Determine individual stone size
    let w = 0;
    if (line.weightMode === 1) w = parseFloat(line.ctEach || '0');
    else if (line.weightMode === 0) w = parseFloat(line.totalCt || '0') / (parseFloat(line.qty || '1') || 1);
    else w = interpolateMeleeCt(line.mm || '0');

    let gradeKey = "A";
    if (line.gradeIndex === 1) gradeKey = "AA";
    if (line.gradeIndex >= 2) gradeKey = "AAA";

    const priceTable = gemData[gradeKey]; // e.g. { "<1": 380, "1-1.5": ... }

    // Find bracket
    // Keys like "<1", "1-1.5", "1.5-2", "2-3"
    let price = 0;
    if (priceTable) {
        for (const rangeKey of Object.keys(priceTable)) {
            if (rangeKey.startsWith("<")) {
                const limit = parseFloat(rangeKey.substring(1));
                if (w < limit) {
                    price = priceTable[rangeKey];
                    break;
                }
            } else {
                const [minStr, maxStr] = rangeKey.split("-");
                const min = parseFloat(minStr);
                const max = parseFloat(maxStr);
                if (w >= min && w < max) {
                    price = priceTable[rangeKey];
                    break;
                }
            }
        }
    }
    return price;
}

export function getSmallStonePrice(line: Stone): { pricePerUnit: number, unit: 'ct' | 'piece' } {
    const type = line.smallStoneType || 'diamond_std';

    if (type === 'zircon') {
        return { pricePerUnit: CATALOG.SMALL_STONE.zircon, unit: 'piece' };
    }

    if (type === 'moissanite') {
        const mType = line.moissaniteType || 'wax_set';
        return {
            pricePerUnit: CATALOG.SMALL_STONE.moissanite[mType] || 0,
            unit: 'piece'
        };
    }

    if (type === 'diamond_single') {
        return { pricePerUnit: CATALOG.SMALL_STONE.diamond.singleCut, unit: 'ct' };
    }

    // Default Diamond Standard
    // Use line.smallDiamondQuality (SI/VS) or fallback to SI
    const quality = line.smallDiamondQuality || 'SI';
    return {
        pricePerUnit: CATALOG.SMALL_STONE.diamond.standard[quality] || 0,
        unit: 'ct'
    };
}


export function getStoneAutoPricePerCt(line: Stone, config?: PricingConfig): number {
    if (isDiamondLine(line)) {
        const carat = getLineTotalCt(line);
        return diamondAutoPricePerCt({
            carat,
            color: line.dColor,
            clarity: line.dClarity,
            cutIndex: line.dCutIndex,
            fluorIndex: line.dFluorIndex
        });
    } else {
        // Check for advanced gem colors first
        if (line.gemColor && ["Royal Blue", "Cornflower Blue"].includes(line.gemColor)) {
            const advancedPrice = getAdvancedGemPrice(line, config);
            if (advancedPrice > 0) {
                // For these Advanced Gems, the catalog price is explicitly for "Heated".
                // So we treat "Heated" as baseline (1.0 relative to table), and adjust others relative to it.
                // Current global multipliers: Heated=0.9, Natural=1.0, Unheated=1.25.
                // To make Heated = TablePrice * 1.0, we need to divide out the global heated discount 
                // or just override formatting.

                // If Treatment is 'heated', use Table Price.
                if (line.treatmentKey === 'heated') return advancedPrice;

                // If Treatment is 'unheated', apply premium relative to Heated base.
                // Typically Unheated is ~30-50% more than Heated?
                // Catalog global relation: Unheated(1.25) / Heated(0.9) ~= 1.39
                if (line.treatmentKey === 'unheated') return advancedPrice * 1.4;

                // If Natural (default), assume standard market which often aligns with Heated for these listings?
                // Or if "Natural" means Unheated to the user? "Natural (Default)" usually allows treatment.
                // Let's assume standard market price (Heated) for default if unsure, or apply small adjustment.
                // If default/natural_unknown:
                if (line.treatmentKey === 'natural_unknown') return advancedPrice;

                // Fallback for others (Diffusion etc): Apply standard multiplier relative to Heated?
                // Heated(0.9) -> Diffusion(0.6). Ratio: 0.6/0.9 = 0.66
                const regularMult = treatmentMult(line.treatmentKey);
                return advancedPrice * (regularMult / 0.9);
            }
        }

        // Fallback or Legacy Logic
        const gem = CATALOG.coloredGems.find(g => g.key === line.typeKey) || CATALOG.coloredGems[0];
        const g = gem.grades[clamp(line.gradeIndex, 0, gem.grades.length - 1)]?.p ?? 0;
        return g * treatmentMult(line.treatmentKey);
    }
}

export function calculateQuote(state: QuoteState, config?: PricingConfig, rates?: { [key: string]: number }): ComputedValues {
    const { stones, metal, labor, pack, profitRate, taxRate, currency } = state;

    const rate = (rates && rates[currency]) ? rates[currency] : 1;

    // stones
    let stonesTotal = 0;
    const stonesWithSub = state.stones.map(line => {
        let sub = 0;

        // Check if it's a side stone with specific small stone type
        if (line.roleIndex === 1 && line.smallStoneType && line.smallStoneType !== 'other') {
            const { pricePerUnit, unit } = getSmallStonePrice(line);

            if (unit === 'ct') {
                const totalCt = getLineTotalCt(line);
                sub = totalCt * pricePerUnit;
            } else {
                // per piece
                sub = num(line.qty) * pricePerUnit;
            }
            // Convert to target currency if needed (assuming base prices are USD)
            if (line.priceMode === 0) sub = sub * rate;

        } else {
            // Main stone or generic side stone calculation
            const totalCt = getLineTotalCt(line);
            let ppc = num(line.pricePerCt);

            if (line.priceMode === 0) {
                // Get base price in USD
                const basePpc = getStoneAutoPricePerCt(line, config);
                // Convert to target currency
                ppc = basePpc * rate;
            }
            sub = totalCt * ppc;
        }

        return { sub };
    });

    stonesTotal = stonesWithSub.reduce((acc, s) => acc + s.sub, 0);

    // metal
    const metalDetails = state.metal;
    let ppg = num(metalDetails.pricePerGram);

    // Auto-calculate metal price specifics (Wastage)
    // Formula: Weight * (1 + Wastage%) * PricePerGram + ExtraFee

    // Determine Wastage Rate
    let wastage = 0;
    // Map materialKey to CATALOG.METAL_RATES keys?
    // Actually the UI likely stores materialKey as "18k", "pt950" etc.
    // Let's use `purityKey` if available, or fallback to infer from `materialKey`

    // Use the lossRate from state (which is populated from Config in UI)
    // lossRate is stored as percentage (e.g. 15), so divide by 100.
    wastage = num(metalDetails.lossRate) / 100;

    // Checking for special color extra fee
    let colorExtra = 0;
    if (metalDetails.colorKey) {
        if (['blue', 'purple', 'green'].includes(metalDetails.colorKey)) {
            // Arbitrary extra fee? User image says "Additional Fee". 
            // Let's assume a placeholder or leave it to manual extraFee input for now 
            // unless we standardize a value. Let's make it 0 but ensure extraFee is added.
        }
    }

    const lossMult = 1 + wastage;
    const metalSub = num(metalDetails.weightG) * lossMult * ppg + num(metalDetails.extraFee) + colorExtra;


    // labor
    // Calculate Making Fee based on complexity if in auto mode or just usage
    let makingFee = num(state.labor.makingFee);

    // If we assume the UI sets `makingFee` manually, we respect it.
    // BUT if we want to auto-calculate based on complexity:
    if (state.labor.complexity) {
        const autoMaking = CATALOG.LABOR_RATES[state.labor.complexity] || 0;
        // Logic: if UI hasn't manually overridden it? 
        // For now, let's assume if there's a complexity set, we enforce that rate 
        // OR we just use it as default value in UI. 
        // Given this function calculates the TOTAL, let's use the auto value if makingFee is 0 or matches?
        // Safest: Use the complexity value directly if valid, converting currency.
        const complexityFeeUsd = CATALOG.LABOR_RATES[state.labor.complexity];
        if (complexityFeeUsd) {
            makingFee = complexityFeeUsd * rate;
        }
    }

    const laborSub = makingFee;

    // packaging
    const packSub = num(state.pack.packFee) + num(state.pack.certFee);

    const costTotal = stonesTotal + metalSub + laborSub + packSub;
    const profit = num(state.profitRate) / 100;
    const tax = num(state.taxRate) / 100;
    const quoteTotal = costTotal * (1 + profit) * (1 + tax);

    return {
        stonesTotal: money(stonesTotal),
        metalSub: money(metalSub),
        laborSub: money(laborSub),
        packSub: money(packSub),
        costTotal: money(costTotal),
        quoteTotal: money(quoteTotal)
    };
}
