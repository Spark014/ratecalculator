import React from 'react';
import { Metal } from '@/lib/types';
import { CATALOG } from '@/lib/catalog';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { usePricing } from '@/lib/pricing-context';

interface MetalSectionProps {
    metal: Metal;
    subtotal: string;
    currency: string;
    onUpdate: (updates: Partial<Metal>) => void;
}

export const MetalSection: React.FC<MetalSectionProps> = ({ metal, subtotal, currency, onUpdate }) => {
    const { t } = useLanguage();
    const { config } = usePricing();
    const handleChange = (field: keyof Metal, value: any) => {
        onUpdate({ [field]: value });
    };

    const isGold = metal.materialKey.includes('18k') || metal.materialKey.includes('14k') || metal.materialKey.includes('9k') || metal.materialKey.includes('24k');

    return (
        <div className="section">
            <h3>{t.metal_details}</h3>
            <div className="grid-3">
                <div className="col">
                    <label>{t.material}</label>
                    <select
                        value={metal.materialKey}
                        onChange={(e) => {
                            const key = e.target.value;
                            const m = config.metals[key];
                            // Auto-update price and waste if metal changes
                            if (m) {
                                onUpdate({
                                    materialKey: key,
                                    pricePerGram: m.price,
                                    lossRate: m.waste,
                                    extraFee: m.extraFee,
                                    colorKey: undefined // Reset special color on metal change
                                });
                            } else {
                                handleChange('materialKey', key);
                            }
                        }}
                    >
                        <option value="">{t.select_metal}</option>
                        {Object.entries(config.metals).map(([k, m]) => (
                            <option key={k} value={k}>{m.name}</option>
                        ))}
                    </select>
                </div>

                {isGold && config.coloredGold && config.coloredGold.colors.length > 0 && (
                    <div className="col">
                        <label>Special Color (Optional)</label>
                        <select
                            value={metal.colorKey || ""}
                            onChange={(e) => {
                                const color = e.target.value;
                                const baseExtra = config.metals[metal.materialKey]?.extraFee || 0;
                                const colorExtra = color ? (config.coloredGold?.extraFee || 0) : 0;
                                onUpdate({
                                    colorKey: color as any,
                                    extraFee: baseExtra + colorExtra
                                });
                            }}
                        >
                            <option value="">Standard (Yellow/White/Rose)</option>
                            {config.coloredGold.colors.map(c => (
                                <option key={c} value={c}>{c} (+{config.coloredGold.extraFee})</option>
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
                <div className="col">
                    <label>{t.loss_pct}</label>
                    <input
                        type="number"
                        value={metal.lossRate}
                        onChange={(e) => handleChange('lossRate', e.target.value)}
                        placeholder="e.g. 15"
                    />
                </div>
            </div>
            <div className="row" style={{ marginTop: 10 }}>
                <div className="col">
                    <label>{t.price_mode}</label>
                    <select
                        value={metal.priceMode}
                        onChange={(e) => handleChange('priceMode', parseInt(e.target.value))}
                    >
                        <option value={0}>{t.auto_price}</option>
                        <option value={1}>{t.manual_price}</option>
                    </select>
                </div>
                <div className="col">
                    <label>{t.gold_price_g}</label>
                    <input
                        type="number"
                        className={metal.priceMode === 0 ? 'mono' : ''}
                        style={metal.priceMode === 0 ? { background: 'var(--pill-bg)' } : {}}
                        value={metal.pricePerGram}
                        onChange={(e) => handleChange('pricePerGram', e.target.value)}
                        disabled={metal.priceMode === 0}
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
