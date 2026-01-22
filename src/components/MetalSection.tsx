import React, { useState } from 'react';
import { Metal } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { usePricing } from '@/lib/pricing-context';
import { CATALOG } from '@/lib/catalog';
import { RefreshCw } from 'lucide-react';

interface MetalSectionProps {
    metal: Metal;
    subtotal: string;
    currency: string;
    onUpdate: (updates: Partial<Metal>) => void;
}

export const MetalSection: React.FC<MetalSectionProps> = ({ metal, subtotal, currency, onUpdate }) => {
    const { t } = useLanguage();
    const { config } = usePricing();
    const [loading, setLoading] = useState(false);
    
    // Store latest fetched market rates (per gram 24k/pure) to strictly enforce across metal changes
    const [cachedRates, setCachedRates] = useState<{ gold: number; platinum: number; silver: number } | null>(null);

    const handleChange = (field: keyof Metal, value: any) => {
        onUpdate({ [field]: value });
    };

    // Sorted keys for display: Silver -> Gold 9k..24k -> Platinum
    const sortedKeys = ['s925', '9k', '14k', '18k', '24k', 'p900', 'p950'];

    const calculatePriceFromRates = (key: string, rates: { gold: number; platinum: number; silver: number }) => {
        let purity = 0;
        let baseRate = 0;

        // @ts-ignore
        if (CATALOG.METAL_RATES.gold[key]) {
            // @ts-ignore
            purity = CATALOG.METAL_RATES.gold[key].purity;
            baseRate = rates.gold;
        }
        // @ts-ignore
        else if (CATALOG.METAL_RATES.platinum[key]) {
            // @ts-ignore
            purity = CATALOG.METAL_RATES.platinum[key].purity;
            baseRate = rates.platinum;
        }
        // @ts-ignore
        else if (CATALOG.METAL_RATES.silver[key]) {
            // @ts-ignore
            purity = CATALOG.METAL_RATES.silver[key].purity;
            baseRate = rates.silver;
        }

        if (purity && baseRate) {
            return parseFloat((baseRate * purity).toFixed(2));
        }
        return null;
    };

    const handleRefreshRate = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/gold-price');
            const data = await res.json();

            if (data.success && data.rates) {
                setCachedRates(data.rates);
                
                // If a metal is currently selected, update it immediately
                if (metal.materialKey) {
                    const m = config.metals[metal.materialKey]; // Get default wastage/loss
                    const newPrice = calculatePriceFromRates(metal.materialKey, data.rates);
                    
                    if (newPrice !== null && m) {
                        onUpdate({
                            pricePerGram: newPrice,
                            lossRate: m.waste,
                            extraFee: m.extraFee
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Rate fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    const isGold = metal.materialKey.includes('18k') || metal.materialKey.includes('14k') || metal.materialKey.includes('9k') || metal.materialKey.includes('24k');

    return (
        <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{t.metal_details}</h3>
                <button 
                    className="secondary small" 
                    onClick={handleRefreshRate} 
                    disabled={loading}
                    style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Fetching...' : 'Refresh Live Rate'}
                </button>
            </div>
            <div className="grid-3">
                <div className="col">
                    <label>{t.material}</label>
                    <select
                        value={metal.materialKey}
                        onChange={(e) => {
                            const key = e.target.value;
                            const m = config.metals[key];
                            
                            if (m) {
                                let newPrice = m.price;
                                // If we have cached live rates, use them instead of config default
                                if (cachedRates) {
                                    const calc = calculatePriceFromRates(key, cachedRates);
                                    if (calc !== null) newPrice = calc;
                                }

                                onUpdate({
                                    materialKey: key,
                                    pricePerGram: newPrice,
                                    lossRate: m.waste,
                                    extraFee: m.extraFee,
                                    colorKey: undefined
                                });
                            } else {
                                handleChange('materialKey', key);
                            }
                        }}
                    >
                        <option value="">{t.select_metal}</option>
                        {sortedKeys.filter(k => config.metals[k]).map(k => (
                            <option key={k} value={k}>{config.metals[k].name}</option>
                        ))}
                    </select>
                </div>

                {isGold && config.coloredGold && config.coloredGold.colors.length > 0 && (
                    <div className="col">
                        <label>Color</label>
                        <select
                            value={metal.colorKey || ""}
                            onChange={(e) => {
                                const color = e.target.value;
                                onUpdate({
                                    colorKey: color as any,
                                });
                            }}
                        >
                            <option value="">Standard</option>
                            {config.coloredGold.colors.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="col">
                    <label>{t.weight_g}</label>
                    <input
                        type="number"
                        value={metal.weightG}
                        onChange={(e) => handleChange('weightG', e.target.value)}
                    />
                </div>
            </div>
            <div className="row" style={{ marginTop: 10 }}>
                <div className="col">
                    <label>{t.gold_price_g} (International)</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <input
                            type="number"
                            value={metal.pricePerGram}
                            onChange={(e) => handleChange('pricePerGram', e.target.value)}
                            disabled
                            style={{ background: 'var(--pill-bg)', cursor: 'not-allowed', color: 'var(--text-main)' }}
                        />
                    </div>
                </div>
                <div className="col">
                    <label>{t.loss_pct} (Waste)</label>
                    <input
                        type="number"
                        value={metal.lossRate}
                        onChange={(e) => handleChange('lossRate', e.target.value)}
                        placeholder="e.g. 15"
                        disabled
                        style={{ background: 'var(--pill-bg)', cursor: 'not-allowed' }}
                    />
                </div>
                <div className="col">
                    <label>{t.extra_fee}</label>
                    <input
                        type="number"
                        value={metal.extraFee}
                        onChange={(e) => handleChange('extraFee', e.target.value)}
                    />
                </div>
            </div>
            <div className="total" style={{ textAlign: 'right', marginTop: 10 }}>
                {t.metal_cost}: {currency} {subtotal}
            </div>
        </div>
    );
};
