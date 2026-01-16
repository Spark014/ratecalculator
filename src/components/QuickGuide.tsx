import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const QuickGuide: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="card">
            <h2>{t.guide_title}</h2>
            <div className="small" style={{ lineHeight: 1.6 }}>
                <div>{t.guide_step1}</div>
                <div>{t.guide_step2}</div>
                <div>{t.guide_step3}</div>
            </div>
        </div>
    );
};
