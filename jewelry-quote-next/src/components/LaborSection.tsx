import React from 'react';
import { Labor } from '@/lib/types';

interface LaborSectionProps {
    labor: Labor;
    subtotal: string;
    currency: string;
    onUpdate: (updates: Partial<Labor>) => void;
}

export const LaborSection: React.FC<LaborSectionProps> = ({ labor, subtotal, currency, onUpdate }) => {
    const handleChange = (field: keyof Labor, value: string) => {
        onUpdate({ [field]: value });
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-bold text-lg mb-3 border-b pb-1">Labor</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                    <label className="block text-xs text-gray-500">Design</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={labor.designFee}
                        onChange={(e) => handleChange('designFee', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Mold</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={labor.moldFee}
                        onChange={(e) => handleChange('moldFee', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Making</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={labor.makingFee}
                        onChange={(e) => handleChange('makingFee', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Buffer</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={labor.reworkFee}
                        onChange={(e) => handleChange('reworkFee', e.target.value)}
                    />
                </div>
            </div>
            <div className="mt-3 text-right font-bold text-gray-700">
                Labor Subtotal: {currency} {subtotal}
            </div>
        </div>
    );
};
