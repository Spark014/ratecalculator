import { useState, useEffect, useCallback } from 'react';
import { CATALOG } from '@/lib/catalog';
import { Stone, Metal, Labor, Pack, QuoteState, ComputedValues } from '@/lib/types';
import {
    uid, makeQuoteNo, num, money,
    getLineTotalCt, getStoneAutoPricePerCt, calculateQuote
} from '@/lib/calculations';
import { PricingConfig } from '@/lib/pricing-context';
import { useCurrency } from '@/lib/currency-context';

const DEFAULT_METAL: Metal = {
    materialKey: CATALOG.metals[0].key,
    weightG: "",
    priceMode: 0,
    pricePerGram: CATALOG.metals[0].defaultPpg,
    lossRate: 0,
    extraFee: 0
};

const DEFAULT_LABOR: Labor = { complexity: 'simple', makingFee: "" };
const DEFAULT_PACK: Pack = { packFee: "", certFee: "" };

export function newStoneLine({ roleIndex = 0, isDiamond = false } = {}): Stone {
    const gem = isDiamond ? { key: "diamond" } : CATALOG.coloredGems[0];
    const typeKey = isDiamond ? "diamond" : gem.key;

    const line: Stone = {
        id: uid(),
        roleIndex,
        typeKey,
        weightMode: 0,
        totalCt: "",
        ctEach: "",
        qty: roleIndex === 0 ? "1" : "0",
        mm: "",
        gradeIndex: 1,
        treatmentKey: "natural_unknown",
        dColor: "G-H",
        dClarity: "VS",
        dCutIndex: 0,
        dFluorIndex: 0,
        priceMode: 0,
        pricePerCt: "",
        sub: "0.00"
    };

    line.pricePerCt = String(getStoneAutoPricePerCt(line));
    return line;
}

export function useQuote(config?: PricingConfig) {
    const { rates } = useCurrency();
    const [state, setState] = useState<QuoteState>({
        quoteNo: "", // set in useEffect
        customerName: "",
        productName: "",
        currency: CATALOG.currencyList[0],
        stones: [],
        metal: { ...DEFAULT_METAL },
        labor: { ...DEFAULT_LABOR },
        pack: { ...DEFAULT_PACK },
        profitRate: "",
        taxRate: ""
    });

    const [computed, setComputed] = useState<ComputedValues>({
        stonesTotal: "0.00",
        metalSub: "0.00",
        laborSub: "0.00",
        packSub: "0.00",
        costTotal: "0.00",
        quoteTotal: "0.00"
    });

    // Initialize
    useEffect(() => {
        const saved = localStorage.getItem("jewelry_quote_state_v1");
        if (saved) {
            try {
                const obj = JSON.parse(saved);
                if (obj && Array.isArray(obj.stones)) {
                    setState(obj);
                    return;
                }
            } catch (e) {
                console.error("Failed to load state", e);
            }
        }
        // Default init
        setState(s => ({
            ...s,
            quoteNo: makeQuoteNo(),
            stones: [newStoneLine({ roleIndex: 0 })]
        }));
    }, []);

    // Recalculate whenever state changes
    useEffect(() => {
        // Calculate using shared logic
        const newComputed = calculateQuote(state, config, rates);
        setComputed(newComputed);

        // Save to local storage
        // Debounce could be good here, but for now direct save
        if (state.quoteNo) {
            localStorage.setItem("jewelry_quote_state_v1", JSON.stringify(state));
        }

    }, [state, config, rates]);

    const updateState = useCallback((updates: Partial<QuoteState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const updateStone = useCallback((index: number, updates: Partial<Stone>) => {
        setState(prev => {
            const newStones = [...prev.stones];
            let newStone = { ...newStones[index], ...updates };

            // Recalculate price if in Auto Mode
            if (newStone.priceMode === 0) {
                // Get base price in USD
                const basePpc = getStoneAutoPricePerCt(newStone, config);
                // Convert to current currency (conceptually, though rate might be separate)
                // Actually the StoneRow displays Price/ct. 
                // The 'pricePerCt' field usually stores the value relative to the displayed currency?
                // Wait, useQuote state 'pricePerCt' usage:
                // calculateQuote converts it using 'rate' ONLY if priceMode=0?
                // Let's stick to standard practice: 
                // If Auto: pricePerCt field should hold the AUTO GENERATED VALUE.
                // calculateQuote: "if (line.priceMode === 0) ppc = basePpc * rate"
                // So line.pricePerCt is technically ignored during total Calc if Auto.
                // BUT the UI reads it. So we should update it for UI consistency.
                
                // Note: The UI StoneRow displays pricePerCt. 
                // Is the stored pricePerCt in USD? or Local Currency?
                // In calculateQuote, if priceMode=0, it effectively ignores stored pricePerCt 
                // and re-derives.
                // But for display, we want the user to see the value.
                // If the user selects a stone, we want to show existing price.
                
                // Let's store the USD value or the Converted value?
                // If the App supports multi-currency, usually we store Base or Converted.
                // Given `calculateQuote` does `ppc = basePpc * rate`, the `stonesTotal` is correct.
                // The `StoneRow` shows `stone.pricePerCt`.
                // If I store `basePpc` (USD) in `pricePerCt`, but the user has selected LKR...
                // The user sees USD value in LKR view? That's confusing.
                
                // However, `updateStone` doesn't know the current 'rate' easily (it's in the hook scope `rates`?).
                // `const { rates } = useCurrency();` is at the top of hook.
                // So I CAN access `rates`.
                
                // Let's proceed carefully.
                // If I simply update it here, I fix the UI 'Blue Text' (Total Price/Price Per Ct).
            }

            // We need to fetch the rate for the current currency
            // `rates` is from useCurrency().
            const rate = rates[prev.currency] || 1; 

            if (newStone.priceMode === 0) {
                 const basePpc = getStoneAutoPricePerCt(newStone, config);
                 const localPpc = basePpc * rate;
                 newStone.pricePerCt = String(money(localPpc));
            }

            // Recalculate Subtotal
            // sub = totalCt * pricePerCt
            const totalCt = getLineTotalCt(newStone);
            const ppc = num(newStone.pricePerCt);
            newStone.sub = String(money(totalCt * ppc));

            newStones[index] = newStone;
            return { ...prev, stones: newStones };
        });
    }, [config, rates]);

    const addStone = useCallback((roleIndex: number, isDiamond: boolean) => {
        setState(prev => ({
            ...prev,
            stones: [...prev.stones, newStoneLine({ roleIndex, isDiamond })]
        }));
    }, []);

    const removeStone = useCallback((index: number) => {
        setState(prev => ({
            ...prev,
            stones: prev.stones.filter((_, i) => i !== index)
        }));
    }, []);

    const resetAll = useCallback(() => {
        setState({
            quoteNo: makeQuoteNo(),
            customerName: "",
            productName: "",
            currency: CATALOG.currencyList[0],
            stones: [newStoneLine({ roleIndex: 0 })],
            metal: { ...DEFAULT_METAL },
            labor: { ...DEFAULT_LABOR, complexity: 'simple' },
            pack: { ...DEFAULT_PACK },
            profitRate: "",
            taxRate: ""
        });
    }, []);

    return {
        state,
        computed,
        updateState,
        updateStone,
        addStone,
        removeStone,
        resetAll
    };
}
