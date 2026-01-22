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

                {/* Type */}
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
                {isDiamond ? (
                    <div className="row">
                        <div className="col">
                            <label>{t.color}</label>
                            <select
                                value={stone.dColor}
                                onChange={(e) => handleChange('dColor', e.target.value)}
                            >
                                {CATALOG.diamond.colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col">
                            <label>{t.clarity}</label>
                            <select
                                value={stone.dClarity}
                                onChange={(e) => handleChange('dClarity', e.target.value)}
                            >
                                {CATALOG.diamond.clarities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col">
                            <label>{t.cut}</label>
                            <select
                                value={stone.dCutIndex}
                                onChange={(e) => handleChange('dCutIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.diamond.cuts.map((c, i) => {
                                    let label: string = c.name;
                                    if (c.name === 'Excellent') label = t.cut_excellent;
                                    if (c.name === 'Very Good') label = t.cut_very_good;
                                    if (c.name === 'Good') label = t.cut_good;
                                    if (c.name === 'Fair') label = t.cut_fair;
                                    return <option key={i} value={i}>{label}</option>
                                })}
                            </select>
                        </div>
                        <div className="col">
                            <label>{t.fluor}</label>
                            <select
                                value={stone.dFluorIndex}
                                onChange={(e) => handleChange('dFluorIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.diamond.fluorescence.map((f, i) => {
                                    let label: string = f.name;
                                    if (f.name === 'None') label = t.fluor_none;
                                    if (f.name === 'Faint') label = t.fluor_faint;
                                    if (f.name === 'Medium') label = t.fluor_medium;
                                    if (f.name === 'Strong') label = t.fluor_strong;
                                    return <option key={i} value={i}>{label}</option>
                                })}
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col">
                            <label>Grade</label>
                            <select
                                value={stone.gradeIndex}
                                onChange={(e) => handleChange('gradeIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.coloredGems.find(g => g.key === stone.typeKey)?.grades.map((g, i) => (
                                    <option key={i} value={i}>{g.grade}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col">
                            <label>{t.treatment}</label>
                            {isMainStone ? (
                                <select
                                    value={stone.treatmentKey}
                                    onChange={(e) => handleChange('treatmentKey', e.target.value)}
                                >
                                    <option value="unheated">Unheated</option>
                                    <option value="heated">Heated</option>
                                </select>
                            ) : (
                                <select
                                    value={stone.treatmentKey}
                                    onChange={(e) => handleChange('treatmentKey', e.target.value)}
                                >
                                    {CATALOG.treatments.map(tr => <option key={tr.key} value={tr.key}>{tr.name}</option>)}
                                </select>
                            )}
                        </div>
                        {isMainStone && (
                            <div className="col">
                                <label>Specific Color</label>
                                <select
                                    value={stone.gemColor || ""}
                                    onChange={(e) => handleChange('gemColor', e.target.value)}
                                >
                                    <option value="">Select Color</option>
                                    {config.advancedGems && Object.keys(config.advancedGems).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        )}
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
