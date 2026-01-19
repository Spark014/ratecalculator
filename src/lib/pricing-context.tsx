"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PricingConfig {
    makingFees: {
        simple: number;
        middle: number;
        complicated: number;
        superComplicated: number;
    };
    metals: {
        [key: string]: {
            name: string;
            waste: number; // percentage
            price: number; // per gram
            extraFee: number;
        };
    };
    smallStones: {
        diamond: {
            standard: { min: number; max: number };
            single: { min: number; max: number };
        };
        zircon: { waxSet: number };
        moissanite: { waxSet: { min: number; max: number }; handSet: number };
    };
    packing: {
        defaultFee: number;
    };
    // New Advanced Pricing
    coloredGold: {
        colors: string[];
        extraFee: number;
    };
    advancedGems: {
        [color: string]: { // "Royal Blue"
            [grade: string]: { // "AAA", "AA", "A"
                [bracket: string]: number; // "<1": 380
            };
        };
    };
    mainStones: {
        [key: string]: { // sapphire, ruby, emerald
            name: string;
            treatments: {
                [key: string]: { // heated, unheated
                    name: string;
                    colors: {
                        name: string;
                        prices: { [weight: string]: number };
                    }[];
                };
            };
        };
    };
}

const defaultPricing: PricingConfig = {
    makingFees: {
        simple: 21,
        middle: 33,
        complicated: 45,
        superComplicated: 70,
    },
    metals: {
        '18k_yellow': { name: '18K Yellow Gold', waste: 15, price: 70, extraFee: 0 },
        '18k_white': { name: '18K White Gold', waste: 15, price: 70, extraFee: 0 },
        '18k_rose': { name: '18K Rose Gold', waste: 15, price: 70, extraFee: 0 },
        '14k': { name: '14K Gold', waste: 17, price: 55, extraFee: 0 },
        '9k': { name: '9K Gold', waste: 23, price: 40, extraFee: 0 },
        '24k': { name: '24K Gold', waste: 10, price: 90, extraFee: 0 },
        'pt950': { name: 'PT950', waste: 30, price: 95, extraFee: 0 },
        'pt900': { name: 'PT900', waste: 30, price: 90, extraFee: 0 },
        's925': { name: 'S925 Silver', waste: 0, price: 1.2, extraFee: 0 },
    },
    smallStones: {
        diamond: {
            standard: { min: 500, max: 800 },
            single: { min: 1500, max: 2200 },
        },
        zircon: { waxSet: 0.035 },
        moissanite: { waxSet: { min: 0.55, max: 0.55 }, handSet: 1.05 },
    },
    packing: {
        defaultFee: 10,
    },
    coloredGold: {
        colors: ["Green", "Blue", "Purple", "Black"],
        extraFee: 15
    },
    mainStones: {
        // Keep legacy or simply empty if not used, but let's keep for non-advanced fallback
        ruby: {
            name: "Ruby",
            treatments: {
                unheated: { name: "Unheated", colors: [] },
                heated: { name: "Heated", colors: [] }
            }
        },
        emerald: {
            name: "Emerald",
            treatments: {
                unheated: { name: "Minor", colors: [] },
                heated: { name: "Treated", colors: [] }
            }
        }
    },
    advancedGems: {
        "Royal Blue": {
            "AAA": { "<1": 380, "1-1.5": 500, "1.5-2": 700, "2-3": 1400 },
            "AA": { "<1": 220, "1-1.5": 450, "1.5-2": 500, "2-3": 1100 },
            "A": { "<1": 150, "1-1.5": 380, "1.5-2": 450, "2-3": 900 }
        },
        "Cornflower Blue": {
            "AAA": { "<1": 200, "1-1.5": 350, "1.5-2": 500, "2-3": 1100 },
            "AA": { "<1": 150, "1-1.5": 300, "1.5-2": 430, "2-3": 900 },
            "A": { "<1": 100, "1-1.5": 200, "1.5-2": 300, "2-3": 600 }
        },
        "Pigeon Blood": {
            "AAA": { "<1": 1500, "1-1.5": 2500, "1.5-2": 4000, "2-3": 8000 },
            "AA": { "<1": 800, "1-1.5": 1500, "1.5-2": 2500, "2-3": 5000 },
            "A": { "<1": 400, "1-1.5": 800, "1.5-2": 1200, "2-3": 2500 }
        },
        "Vivid Green": {
            "AAA": { "<1": 1200, "1-1.5": 2000, "1.5-2": 3500, "2-3": 6000 },
            "AA": { "<1": 700, "1-1.5": 1200, "1.5-2": 2000, "2-3": 4000 },
            "A": { "<1": 300, "1-1.5": 600, "1.5-2": 1000, "2-3": 2000 }
        }
    }
};

interface PricingContextType {
    config: PricingConfig;
    updateConfig: (newConfig: PricingConfig) => void;
    resetConfig: () => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<PricingConfig>(defaultPricing);

    useEffect(() => {
        const saved = localStorage.getItem('jewelry_pricing_config');
        if (saved) {
            try {
                setConfig(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse pricing config", e);
            }
        }
    }, []);

    const updateConfig = (newConfig: PricingConfig) => {
        setConfig(newConfig);
        localStorage.setItem('jewelry_pricing_config', JSON.stringify(newConfig));
    };

    const resetConfig = () => {
        setConfig(defaultPricing);
        localStorage.setItem('jewelry_pricing_config', JSON.stringify(defaultPricing));
    };

    return (
        <PricingContext.Provider value={{ config, updateConfig, resetConfig }}>
            {children}
        </PricingContext.Provider>
    );
};

export const usePricing = () => {
    const context = useContext(PricingContext);
    if (context === undefined) {
        throw new Error('usePricing must be used within a PricingProvider');
    }
    return context;
};
