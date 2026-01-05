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
        <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-bold text-lg mb-3 border-b pb-1">Precious Metal</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs text-gray-500">Material</label>
                    <select
                        className="w-full border rounded p-1"
                        value={metal.materialKey}
                        onChange={(e) => handleChange('materialKey', e.target.value)}
                    >
                        {CATALOG.metals.map(m => <option key={m.key} value={m.key}>{m.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Weight (g)</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={metal.weightG}
                        onChange={(e) => handleChange('weightG', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Loss Rate (%)</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={metal.lossRate}
                        onChange={(e) => handleChange('lossRate', e.target.value)}
                        placeholder="e.g. 15"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Price Mode</label>
                    <select
                        className="w-full border rounded p-1"
                        value={metal.priceMode}
                        onChange={(e) => handleChange('priceMode', parseInt(e.target.value))}
                    >
                        {CATALOG.priceModes.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Price/g</label>
                    <input
                        type="number"
                        className={`w-full border rounded p-1 ${metal.priceMode === 0 ? 'bg-gray-100' : ''}`}
                        value={metal.pricePerGram}
                        onChange={(e) => handleChange('pricePerGram', e.target.value)}
                        disabled={metal.priceMode === 0}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Extra Fee</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={metal.extraFee}
                        onChange={(e) => handleChange('extraFee', e.target.value)}
                    />
                </div>
            </div>
            <div className="mt-3 text-right font-bold text-gray-700">
                Metal Subtotal: {currency} {subtotal}
            </div>
        </div>
    );
};
