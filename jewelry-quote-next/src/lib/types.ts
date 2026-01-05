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

    // diamond 4C
    dColor: string;
    dClarity: string;
    dCutIndex: number;
    dFluorIndex: number;

    // pricing
    priceMode: number; // 0: auto, 1: manual
    pricePerCt: string;
    sub: string;
}

export interface Metal {
    materialKey: string;
    weightG: string;
    priceMode: number; // 0: auto, 1: manual
    pricePerGram: string;
    lossRate: string;
    extraFee: string;
}

export interface Labor {
    designFee: string;
    moldFee: string;
    makingFee: string;
    reworkFee: string;
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
