import React from 'react';
import { Pack } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PackagingSectionProps {
    pack: Pack;
    subtotal: string;
    currency: string;
    onUpdate: (updates: Partial<Pack>) => void;
}

export const PackagingSection: React.FC<PackagingSectionProps> = ({ pack, subtotal, currency, onUpdate }) => {
    const { t } = useLanguage();
    const handleChange = (field: keyof Pack, value: string) => {
        onUpdate({ [field]: value });
    };

    return (
        <div className="card">
            <h2>{t.packaging_details}</h2>
            <div className="row">
                <div className="col">
                    <label>{t.packaging_fee}</label>
                    <input
                        type="number"
                        value={pack.packFee}
                        onChange={(e) => handleChange('packFee', e.target.value)}
                    />
                </div>
                <div className="col">
                    <label>{t.cert_fee_optional}</label>
                    <input
                        type="number"
                        value={pack.certFee}
                        onChange={(e) => handleChange('certFee', e.target.value)}
                    />
                </div>
            </div>
            <div className="total" style={{ textAlign: 'right', marginTop: 10 }}>
                {t.packaging_subtotal}: {currency} {subtotal}
            </div>
        </div>
    );
};
