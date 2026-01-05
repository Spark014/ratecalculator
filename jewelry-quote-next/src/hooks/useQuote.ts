import { useState, useEffect, useCallback } from 'react';
import { CATALOG } from '@/lib/catalog';
import { Stone, Metal, Labor, Pack, QuoteState, ComputedValues } from '@/lib/types';
import {
    uid, makeQuoteNo, num, money,
    getLineTotalCt, getStoneAutoPricePerCt, calculateQuote
} from '@/lib/calculations';

const DEFAULT_METAL: Metal = {
    materialKey: CATALOG.metals[0].key,
    weightG: "",
    priceMode: 0,
    pricePerGram: String(CATALOG.metals[0].defaultPpg),
    lossRate: "",
    extraFee: ""
};

const DEFAULT_LABOR: Labor = { designFee: "", moldFee: "", makingFee: "", reworkFee: "" };
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

export function useQuote() {
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
        const newComputed = calculateQuote(state);
        setComputed(newComputed);

        // Save to local storage
        // Debounce could be good here, but for now direct save
        if (state.quoteNo) {
            localStorage.setItem("jewelry_quote_state_v1", JSON.stringify(state));
        }

    }, [state]);

    const updateState = useCallback((updates: Partial<QuoteState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const updateStone = useCallback((index: number, updates: Partial<Stone>) => {
        setState(prev => {
            const newStones = [...prev.stones];
            newStones[index] = { ...newStones[index], ...updates };
            return { ...prev, stones: newStones };
        });
    }, []);

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
            labor: { ...DEFAULT_LABOR },
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
