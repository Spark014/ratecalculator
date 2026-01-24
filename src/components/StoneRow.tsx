import React from 'react';
import { Stone } from '@/lib/types';
import { CATALOG } from '@/lib/catalog';
import { Trash2, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { usePricing } from '@/lib/pricing-context';

interface StoneRowProps {
    stone: Stone;
    index: number;
    currency: string;
    onUpdate: (index: number, updates: Partial<Stone>) => void;
    onRemove: (index: number) => void;
}

export const StoneRow: React.FC<StoneRowProps> = ({ stone, index, currency, onUpdate, onRemove }) => {
    const { t } = useLanguage();
    const { config } = usePricing();
    const isDiamond = stone.typeKey === 'diamond';
    // Check if it is a specific small stone (melee) type
    const isSmallStone = stone.roleIndex === 1 && stone.smallStoneType && stone.smallStoneType !== 'other';
    const isMainStone = ['sapphire', 'ruby', 'emerald'].includes(stone.typeKey);

    const handleChange = (field: keyof Stone, value: any) => {
        onUpdate(index, { [field]: value });
    };

    return (
        <div className="stone">
            <div className="stone-head">
                <div className="badge">
                    <b>#{index + 1}</b>
                    <div className="pill">{isDiamond ? t.diamond : t.gem_type}</div>
                </div>
                <button onClick={() => onRemove(index)} className="danger" title="Remove Row">
                    <Trash2 size={14} /> {t.delete}
                </button>
            </div>

            <div className="row" style={{ marginTop: 10 }}>
                {/* Role */}
                <div className="col">
                    <label>{t.role}</label>
                    <select
                        value={stone.roleIndex}
                        onChange={(e) => handleChange('roleIndex', parseInt(e.target.value))}
                    >
                        <option value={0}>{t.main_stone}</option>
                        <option value={1}>{t.side_stone}</option>
                    </select>
                </div>

                {/* NEW: Small Stone Type Selector */}
                {stone.roleIndex === 1 && (
                    <div className="col">
                        <label>Small Stone</label>
                        <select
                            value={stone.smallStoneType || 'other'}
                            onChange={(e) => handleChange('smallStoneType', e.target.value === 'other' ? undefined : e.target.value)}
                        >
                            <option value="other">None (Standard Gem)</option>
                            <option value="diamond_std">Diamond - Standard Cut</option>
                            <option value="diamond_single">Diamond - Single Refraction/Cut</option>
                            <option value="zircon">Zircon</option>
                            <option value="moissanite">Moissanite</option>
                        </select>
                    </div>
                )}

                {/* Type */}
                {!isSmallStone && (
                    <div className="col">
                        <label>{t.gem_type}</label>
                        {isDiamond ? (
                            <input type="text" value={t.diamond} disabled style={{ background: 'var(--pill-bg)' }} />
                        ) : (
                            <select
                                value={stone.typeKey}
                                onChange={(e) => handleChange('typeKey', e.target.value)}
                            >
                                {CATALOG.coloredGems.map(g => <option key={g.key} value={g.key}>{t[g.key as keyof typeof t] || g.name}</option>)}
                            </select>
                        )}
                    </div>
                )}

                {/* Weight Mode */}
                <div className="col" style={{ flex: 2 }}>
                    <label>{t.weight_mode}</label>
                    <select
                        value={stone.weightMode}
                        onChange={(e) => handleChange('weightMode', parseInt(e.target.value))}
                    >
                        <option value={0}>{t.total_weight}</option>
                        <option value={1}>{t.weight_each_qty}</option>
                        <option value={2}>{t.diameter_qty}</option>
                    </select>
                </div>
            </div>

            {/* Weight Inputs */}
            <div className="row" style={{ marginTop: 10 }}>
                {stone.weightMode === 0 && (
                    <div className="col">
                        <label>{t.total_weight}</label>
                        <input
                            type="number"
                            value={stone.totalCt}
                            onChange={(e) => handleChange('totalCt', e.target.value)}
                        />
                    </div>
                )}
                {stone.weightMode === 1 && (
                    <>
                        <div className="col">
                            <label>{t.weight}</label>
                            <input
                                type="number"
                                value={stone.ctEach}
                                onChange={(e) => handleChange('ctEach', e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <label>{t.qty}</label>
                            <input
                                type="number"
                                value={stone.qty}
                                onChange={(e) => handleChange('qty', e.target.value)}
                            />
                        </div>
                    </>
                )}
                {stone.weightMode === 2 && (
                    <>
                        <div className="col">
                            <label>{t.size_mm}</label>
                            <input
                                type="number"
                                value={stone.mm}
                                onChange={(e) => handleChange('mm', e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <label>{t.qty}</label>
                            <input
                                type="number"
                                value={stone.qty}
                                onChange={(e) => handleChange('qty', e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Quality / 4C */}
            <div style={{ background: 'var(--card)', padding: 10, borderRadius: 8, border: '1px solid var(--stone-border)', margin: '10px 0' }}>
                {isSmallStone ? (
                    <div className="row">
                        {stone.smallStoneType === 'diamond_std' && (
                            <div className="col">
                                <label>{t.quality_clarity}</label>
                                <select
                                    value={stone.smallDiamondQuality || 'SI'}
                                    onChange={(e) => handleChange('smallDiamondQuality', e.target.value)}
                                >
                                    <option value="SI">SI (600 USD/ct)</option>
                                    <option value="VS">VS (800 USD/ct)</option>
                                </select>
                            </div>
                        )}
                        {stone.smallStoneType === 'moissanite' && (
                            <div className="col">
                                <label>{t.setting_type}</label>
                                <select
                                    value={stone.moissaniteType || 'wax_set'}
                                    onChange={(e) => handleChange('moissaniteType', e.target.value)}
                                >
                                    <option value="wax_set">{t.wax_set}</option>
                                    <option value="hand_set">{t.hand_set}</option>
                                </select>
                            </div>
                        )}
                        {(stone.smallStoneType === 'zircon' || stone.smallStoneType === 'diamond_single') && (
                            <div className="col" style={{ display: 'flex', alignItems: 'center', marginTop: 15, color: 'var(--text-weak)' }}>
                                <i>{t.std_pricing}</i>
                            </div>
                        )}
                    </div>
                ) : isDiamond ? (
                    <div className="row">
                        {/* Replace Complex 4C with "Small Stone" style Logic even for Main/Generic "Diamond" type */}
                        <div className="col">
                            <label>{t.diamond_type}</label>
                            <select
                                value={stone.smallStoneType || 'diamond_std'}
                                onChange={(e) => handleChange('smallStoneType', e.target.value)}
                            >
                                <option value="diamond_std">Standard Cut</option>
                                <option value="diamond_single">Single Refraction/Cut</option>
                            </select>
                        </div>

                        {(stone.smallStoneType === 'diamond_std' || !stone.smallStoneType) && (
                            <div className="col">
                                <label>{t.quality_clarity}</label>
                                <select
                                    value={stone.smallDiamondQuality || 'SI'}
                                    onChange={(e) => handleChange('smallDiamondQuality', e.target.value)}
                                >
                                    <option value="SI">SI (600 USD/ct)</option>
                                    <option value="VS">VS (800 USD/ct)</option>
                                </select>
                            </div>
                        )}
                        {stone.smallStoneType === 'diamond_single' && (
                            <div className="col" style={{ display: 'flex', alignItems: 'center', marginTop: 15, color: 'var(--text-weak)' }}>
                                <i>{t.price_usd_ct}</i>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="row">
                        {/* 1. Specific Color */}
                        {isMainStone && (
                            <div className="col">
                                <label>{t.specific_color}</label>
                                <select
                                    value={stone.gemColor || ""}
                                    onChange={(e) => handleChange('gemColor', e.target.value)}
                                >
                                    <option value="">{t.select_color}</option>
                                    {config.advancedGems && Object.keys(config.advancedGems)
                                        .filter(colorName => {
                                            const type = stone.typeKey?.toLowerCase().trim();
                                            const color = colorName.trim();
                                            if (type === 'sapphire') return ['Royal Blue', 'Cornflower Blue', 'Light Blue'].includes(color);
                                            if (type === 'ruby') return ['Pigeon Blood'].includes(color);
                                            if (type === 'emerald') return ['Vivid Green'].includes(color);
                                            return false;
                                        })
                                        .map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                </select>
                            </div>
                        )}

                        {/* 2. Treatment */}
                        <div className="col">
                            <label>{t.treatment}</label>
                            {isMainStone ? (
                                <select
                                    value={stone.treatmentKey}
                                    onChange={(e) => handleChange('treatmentKey', e.target.value)}
                                    disabled
                                    title="Locked to Heated (Standard)"
                                    style={{ opacity: 0.7, cursor: 'not-allowed', background: 'var(--pill-bg)' }}
                                >
                                    <option value="heated">{t.heated}</option>
                                    <option value="unheated">{t.unheated}</option>
                                </select>
                            ) : (
                                <select
                                    value={stone.treatmentKey}
                                    onChange={(e) => handleChange('treatmentKey', e.target.value)}
                                >
                                    {CATALOG.treatments.map(tr => <option key={tr.key} value={tr.key}>{t[tr.key as keyof typeof t] || tr.name}</option>)}
                                </select>
                            )}
                        </div>

                        {/* 3. Grade */}
                        <div className="col">
                            <label>{t.grade}</label>
                            <select
                                value={stone.gradeIndex}
                                onChange={(e) => handleChange('gradeIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.coloredGems.find(g => g.key === stone.typeKey)?.grades.map((g, i) => (
                                    <option key={i} value={i}>{g.grade}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="row" style={{ alignItems: 'flex-end' }}>
                <div className="col">
                    <label>{t.price_mode}</label>
                    <select
                        value={stone.priceMode}
                        onChange={(e) => handleChange('priceMode', parseInt(e.target.value))}
                    >
                        <option value={0}>{t.auto_price}</option>
                        <option value={1}>{t.manual_price}</option>
                    </select>
                </div>
                <div className="col">
                    <label>{t.price_ct}</label>
                    <input
                        type="number"
                        className={stone.priceMode === 0 ? 'mono' : ''}
                        style={stone.priceMode === 0 ? { background: 'var(--pill-bg)' } : {}}
                        value={stone.pricePerCt}
                        onChange={(e) => handleChange('pricePerCt', e.target.value)}
                        disabled={stone.priceMode === 0}
                    />
                </div>
                <div className="col" style={{ textAlign: 'right', fontWeight: 900, color: 'var(--link)', fontSize: 15, paddingBottom: 10 }}>
                    {currency} {stone.sub}
                </div>
            </div>
        </div>
    );
};
