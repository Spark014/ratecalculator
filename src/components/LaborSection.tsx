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
        <div className="card">
            <h2>Labor</h2>
            <div className="row">
                <div className="col">
                    <label>Design</label>
                    <input
                        type="number"
                        value={labor.designFee}
                        onChange={(e) => handleChange('designFee', e.target.value)}
                    />
                </div>
                <div className="col">
                    <label>Mold</label>
                    <input
                        type="number"
                        value={labor.moldFee}
                        onChange={(e) => handleChange('moldFee', e.target.value)}
                    />
                </div>
                <div className="col">
                    <label>Making</label>
                    <input
                        type="number"
                        value={labor.makingFee}
                        onChange={(e) => handleChange('makingFee', e.target.value)}
                    />
                </div>
                <div className="col">
                    <label>Buffer</label>
                    <input
                        type="number"
                        value={labor.reworkFee}
                        onChange={(e) => handleChange('reworkFee', e.target.value)}
                    />
                </div>
            </div>
            <div className="total" style={{ textAlign: 'right', marginTop: 10 }}>
                Labor Subtotal: {currency} {subtotal}
            </div>
        </div>
    );
};
