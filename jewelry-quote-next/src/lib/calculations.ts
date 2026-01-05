import { CATALOG } from './catalog';
import { Stone } from './types';

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

export function getStoneAutoPricePerCt(line: Stone): number {
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
