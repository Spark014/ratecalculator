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
    mainStones: {
        [key: string]: { // sapphire, ruby, emerald
            name: string;
            treatments: {
                heated: {
                    name: string;
                    colors: {
                        name: string;
                        prices: { [weight: string]: number }; // "1": 1000
                    }[];
                };
                unheated: {
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
        superComplicated: 60,
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
        zircon: { waxSet: 0.0043 },
        moissanite: { waxSet: { min: 0.4, max: 0.7 }, handSet: 0.6 },
    },
    packing: {
        defaultFee: 10,
    },
    coloredGold: {
        colors: ["Green", "Blue", "Purple", "Black"],
        extraFee: 15
    },
    mainStones: {
        sapphire: {
            name: "Blue Sapphire",
            treatments: {
                unheated: {
                    name: "Unheated",
                    colors: [
                        { name: "Royal Blue", prices: { "1": 1000, "1.5": 1500, "2": 2500, "3": 4000 } },
                        { name: "Cornflower Blue", prices: { "1": 800, "1.5": 1200, "2": 2000, "3": 3500 } },
                        { name: "Light Blue", prices: { "1": 500, "1.5": 700, "2": 1000, "3": 1500 } }
                    ]
                },
                heated: {
                    name: "Heated",
                    colors: [
                        { name: "Royal Blue", prices: { "1": 600, "1.5": 900, "2": 1500, "3": 2500 } },
                        { name: "Cornflower Blue", prices: { "1": 500, "1.5": 750, "2": 1200, "3": 2000 } },
                        { name: "Light Blue", prices: { "1": 300, "1.5": 450, "2": 700, "3": 1000 } }
                    ]
                }
            }
        },
        ruby: {
            name: "Ruby",
            treatments: {
                unheated: {
                    name: "Unheated",
                    colors: [
                        { name: "Pigeon Blood", prices: { "1": 3000, "1.5": 5000, "2": 8000, "3": 15000 } },
                        { name: "Red", prices: { "1": 2000, "1.5": 3000, "2": 5000, "3": 9000 } }
                    ]
                },
                heated: {
                    name: "Heated",
                    colors: [
                        { name: "Pigeon Blood", prices: { "1": 1500, "1.5": 2500, "2": 4000, "3": 7000 } },
                        { name: "Red", prices: { "1": 1000, "1.5": 1500, "2": 2500, "3": 4500 } }
                    ]
                }
            }
        },
        emerald: {
            name: "Emerald",
            treatments: {
                unheated: { // Emeralds are usually oiled, but fitting the structure
                    name: "No Oil/Minor",
                    colors: [
                        { name: "Vivid Green", prices: { "1": 2500, "1.5": 4000, "2": 7000, "3": 12000 } },
                        { name: "Green", prices: { "1": 1500, "1.5": 2500, "2": 4000, "3": 7000 } }
                    ]
                },
                heated: { // Using 'heated' slot for 'Oiled' conceptually or just generic 'Treated'
                    name: "Moderate/Significant",
                    colors: [
                        { name: "Vivid Green", prices: { "1": 1000, "1.5": 1500, "2": 2500, "3": 4500 } },
                        { name: "Green", prices: { "1": 600, "1.5": 900, "2": 1500, "3": 2500 } }
                    ]
                }
            }
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
