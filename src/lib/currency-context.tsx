"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
    rates: { [key: string]: number };
    lastUpdated: number | null;
    refreshRates: () => Promise<void>;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
    rates: { USD: 1 },
    lastUpdated: null,
    refreshRates: async () => { },
    isLoading: false,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rates, setRates] = useState<{ [key: string]: number }>({ USD: 1 });
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRates = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await res.json();
            if (data && data.rates) {
                setRates(data.rates);
                setLastUpdated(Date.now());
                localStorage.setItem('jewelry_currency_rates', JSON.stringify({
                    rates: data.rates,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error("Failed to fetch rates", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Load from local storage or fetch
        const saved = localStorage.getItem('jewelry_currency_rates');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // If older than 24 hours, refresh
                if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
                    fetchRates();
                } else {
                    setRates(parsed.rates);
                    setLastUpdated(parsed.timestamp);
                }
            } catch (e) {
                fetchRates();
            }
        } else {
            fetchRates();
        }
    }, []);

    return (
        <CurrencyContext.Provider value={{ rates, lastUpdated, refreshRates: fetchRates, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
};
