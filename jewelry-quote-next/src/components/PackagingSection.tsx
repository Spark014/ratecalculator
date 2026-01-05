import React from 'react';
import { Pack } from '@/lib/types';

interface PackagingSectionProps {
    pack: Pack;
    subtotal: string;
    currency: string;
    onUpdate: (updates: Partial<Pack>) => void;
}

export const PackagingSection: React.FC<PackagingSectionProps> = ({ pack, subtotal, currency, onUpdate }) => {
    const handleChange = (field: keyof Pack, value: string) => {
        onUpdate({ [field]: value });
    };

    return (
        <div className="card">
            <h2>Packaging</h2>
            <div className="row">
                <div className="col">
                    <label>Packaging Fee</label>
                    <input
                        type="number"
                        value={pack.packFee}
                        onChange={(e) => handleChange('packFee', e.target.value)}
                    />
                </div>
                <div className="col">
                    <label>Cert/Tag Fee (Optional)</label>
                    <input
                        type="number"
                        value={pack.certFee}
                        onChange={(e) => handleChange('certFee', e.target.value)}
                    />
                </div>
            </div>
            <div className="total" style={{ textAlign: 'right', marginTop: 10 }}>
                Packaging Subtotal: {currency} {subtotal}
            </div>
        </div>
    );
};
