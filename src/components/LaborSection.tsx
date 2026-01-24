import React from 'react';
import { Labor } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { usePricing } from '@/lib/pricing-context';

interface LaborSectionProps {
    labor: Labor;
    subtotal: string;
    currency: string;
    onUpdate: (updates: Partial<Labor>) => void;
}

export const LaborSection: React.FC<LaborSectionProps> = ({ labor, subtotal, currency, onUpdate }) => {
    const { t } = useLanguage();
    const { config } = usePricing();

    const handleChange = (field: keyof Labor, value: any) => {
        onUpdate({ [field]: value });
    };

    // Auto-update making fee based on complexity
    React.useEffect(() => {
        if (labor.complexity) {
            const fee = config.makingFees[labor.complexity];
            if (fee && fee.toString() !== labor.makingFee) {
                onUpdate({ makingFee: fee.toString() });
            }
        }
    }, [labor.complexity, config.makingFees, onUpdate, labor.makingFee]);

    return (
        <div className="card">
            <h2>{t.labor_section_title}</h2>
            <div className="row">
                <div className="col">
                    <label>{t.complexity}</label>
                    <select
                        value={labor.complexity || 'simple'}
                        onChange={(e) => handleChange('complexity', e.target.value)}
                    >
                        <option value="simple">Simple ({config.makingFees.simple})</option>
                        <option value="middle">Middle ({config.makingFees.middle})</option>
                        <option value="complicated">Complicated ({config.makingFees.complicated})</option>
                        <option value="superComplicated">Super Complicated ({config.makingFees.superComplicated})</option>
                    </select>
                </div>
                <div className="col">
                    <label>{t.cost}</label>
                    <input
                        type="number"
                        value={labor.makingFee}
                        onChange={(e) => handleChange('makingFee', e.target.value)}
                    // Allow manual override? User said "only need complexity and its price". 
                    // Usually implies auto, but often manual tweak needed.
                    />
                </div>
            </div>
            <div className="total" style={{ textAlign: 'right', marginTop: 10 }}>
                {t.labor_cost}: {currency} {subtotal}
            </div>
        </div>
    );
};
