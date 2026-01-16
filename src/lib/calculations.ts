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

export function getAdvancedGemPrice(line: Stone, config: PricingConfig): number {
    const gemConfig = config.mainStones[line.typeKey];
    if (!gemConfig) return 0;

    const treatment = gemConfig.treatments[line.treatmentKey as 'heated' | 'unheated'];
    if (!treatment) return 0;

    const color = treatment.colors.find(c => c.name === line.gemColor);
    if (!color) return 0;

    // Find price based on weight bracket
    // Logic: Find the highest weight key that is <= current weight? 
    // Or exact match? The image shows "1ct", "1.5ct", "2ct".
    // Usually this means ranges. Let's assume:
    // < 1.5 use 1ct price
    // < 2.0 use 1.5ct price
    // < 3.0 use 2ct price
    // >= 3.0 use 3ct price
    // We need to sort keys and find the appropriate bracket.

    const weight = getLineTotalCt(line); // Or ctEach? Usually price/ct depends on individual stone size.
    // "Size" in image implies individual stone size.
    const size = line.weightMode === 1 ? num(line.ctEach) : num(line.totalCt); // If total mode, assume 1 stone? Or just use total.
    // Safest to use individual size if available, or total if count is 1.
    // Let's use `getLineTotalCt(line) / num(line.qty)` if qty > 0?
    // For simplicity, let's use the total weight if weightMode is 0 (Total), or ctEach if mode 1.

    let checkWeight = 0;
    if (line.weightMode === 1) checkWeight = num(line.ctEach);
    else if (line.weightMode === 0) checkWeight = num(line.totalCt) / (num(line.qty) || 1);
    else checkWeight = interpolateMeleeCt(line.mm); // Mode 2

    const sortedWeights = Object.keys(color.prices).map(parseFloat).sort((a, b) => a - b);

    // Find the largest bracket that is <= checkWeight
    // Actually, usually pricing jumps AT the bracket. 
    // e.g. 0.9ct is cheap, 1.0ct jumps up.
    // So we want the largest key <= checkWeight.
    // Wait, if I have 1.2ct, it should use 1ct price.
    // If I have 0.9ct, it might fall below 1ct? 
    // Let's assume < 1ct uses 1ct price for now or 0? 
    // Let's find the closest lower bound.

    let foundW = sortedWeights[0];
    for (const w of sortedWeights) {
        if (w <= checkWeight) foundW = w;
        else break;
    }

    return color.prices[foundW.toString()] || 0;
}

export function getStoneAutoPricePerCt(line: Stone, config?: PricingConfig): number {
    if (isDiamondLine(line)) {
        // ... existing diamond logic
        const carat = getLineTotalCt(line);
        return diamondAutoPricePerCt({
            carat,
            color: line.dColor,
            clarity: line.dClarity,
            cutIndex: line.dCutIndex,
            fluorIndex: line.dFluorIndex
        });
    } else {
        // Check if it's an advanced main stone
        if (config && config.mainStones && config.mainStones[line.typeKey]) {
            return getAdvancedGemPrice(line, config);
        }

        // Fallback to old logic
        const gem = CATALOG.coloredGems.find(g => g.key === line.typeKey) || CATALOG.coloredGems[0];
        const g = gem.grades[clamp(line.gradeIndex, 0, gem.grades.length - 1)]?.p ?? 0;
        return g * treatmentMult(line.treatmentKey);
    }
}

export function calculateQuote(state: QuoteState, config?: PricingConfig): ComputedValues {
    // stones
    let stonesTotal = 0;
    const stonesWithSub = state.stones.map(line => {
        const totalCt = getLineTotalCt(line);
        let ppc = num(line.pricePerCt);

        if (line.priceMode === 0) {
            ppc = getStoneAutoPricePerCt(line, config);
        }

        const sub = totalCt * ppc;
        return { sub };
    });

    stonesTotal = stonesWithSub.reduce((acc, s) => acc + s.sub, 0);

    // metal
    const metal = state.metal;
    let ppg = num(metal.pricePerGram);
    // If auto price mode and config is available, use config price (though UI should have set it)
    // We rely on the UI to set the pricePerGram based on config, but if we wanted to enforce it here:
    // const matConfig = config?.metals[metal.materialKey];
    // if (metal.priceMode === 0 && matConfig) {
    //     ppg = matConfig.price;
    // }

    const loss = num(metal.lossRate) / 100;
    // Formula: Weight * (1 + Waste%) * Price + Extra
    const metalSub = num(metal.weightG) * (1 + loss) * ppg + num(metal.extraFee);

    // labor
    const laborSub = num(state.labor.designFee) + num(state.labor.moldFee) + num(state.labor.makingFee) + num(state.labor.reworkFee);

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
