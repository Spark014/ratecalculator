export interface Stone {
    id: string;
    roleIndex: number; // 0: Main Stone, 1: Side Stone
    typeKey: string;

    // weight modes
    weightMode: number; // 0: total ct, 1: each*qty, 2: mm*qty
    totalCt: string;
    ctEach: string;
    qty: string;
    mm: string;

    // colored gem quality
    gradeIndex: number;
    treatmentKey: string;
    gemColor?: string; // e.g. "Royal Blue"

    // diamond 4C
    dColor: string;
    dClarity: string;
    dCutIndex: number;
    dFluorIndex: number;

    // NEW: Small stone specific types (Diamond vs Zircon etc)
    smallStoneType?: 'diamond_std' | 'diamond_single' | 'zircon' | 'moissanite' | 'other';
    // For specialized diamonds (like SI/VS distinction for small stones)
    smallDiamondQuality?: 'SI' | 'VS';
    moissaniteType?: 'wax_set' | 'hand_set';

    // pricing
    priceMode: number; // 0: auto, 1: manual
    pricePerCt: string;
    sub: string;
}

export interface Metal {
    materialKey: string;
    weightG: string;
    priceMode: number; // 0: auto, 1: manual
    pricePerGram: number;
    lossRate: number;
    extraFee: number;

    // NEW: Detailed metal types
    purityKey?: '9k' | '14k' | '18k' | '24k' | 'p950' | 'p900' | 's925';
    colorKey?: 'yellow' | 'white' | 'rose' | 'black' | 'purple' | 'blue' | 'green';
}

export interface Labor {
    complexity: 'simple' | 'middle' | 'complicated' | 'superComplicated';
    makingFee: string;
}

export interface Pack {
    packFee: string;
    certFee: string;
}

export interface QuoteState {
    quoteNo: string;
    customerName: string;
    productName: string;
    currency: string;
    stones: Stone[];
    metal: Metal;
    labor: Labor;
    pack: Pack;
    profitRate: string;
    taxRate: string;
}

export interface ComputedValues {
    stonesTotal: string;
    metalSub: string;
    laborSub: string;
    packSub: string;
    costTotal: string;
    quoteTotal: string;
}
