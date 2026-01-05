import React from 'react';
import { Metal } from '@/lib/types';
import { CATALOG } from '@/lib/catalog';

interface MetalSectionProps {
    metal: Metal;
    subtotal: string;
    currency: string;
    onUpdate: (updates: Partial<Metal>) => void;
}

export const MetalSection: React.FC<MetalSectionProps> = ({ metal, subtotal, currency, onUpdate }) => {
    const handleChange = (field: keyof Metal, value: any) => {
        onUpdate({ [field]: value });
    };

    return (
        <div className="card">
            <h2>Precious Metal</h2>
            <div className="row">
                <div className="col">
                    <label>Material</label>
                    <select
                        value={metal.materialKey}
                        onChange={(e) => handleChange('materialKey', e.target.value)}
                    >
                        {CATALOG.metals.map(m => <option key={m.key} value={m.key}>{m.name}</option>)}
                    </select>
                </div>
                <div className="col">
                    <label>Weight (g)</label>
                    <input
                        type="number"
                        value={metal.weightG}
                        onChange={(e) => handleChange('weightG', e.target.value)}
                    />
                </div>
                <div className="col">
                    <label>Loss Rate (%)</label>
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
                    <label>Price Mode</label>
                    <select
                        value={metal.priceMode}
                        onChange={(e) => handleChange('priceMode', parseInt(e.target.value))}
                    >
                        {CATALOG.priceModes.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                </div>
                <div className="col">
                    <label>Price/g</label>
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
                    <label>Extra Fee</label>
                    <input
                        type="number"
                        value={metal.extraFee}
                        onChange={(e) => handleChange('extraFee', e.target.value)}
                    />
                </div>
            </div>
            <div className="total" style={{ textAlign: 'right', marginTop: 10 }}>
                Metal Subtotal: {currency} {subtotal}
            </div>
        </div>
    );
};
