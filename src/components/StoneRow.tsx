import React from 'react';
import { Stone } from '@/lib/types';
import { CATALOG } from '@/lib/catalog';
import { Trash2 } from 'lucide-react';

interface StoneRowProps {
    stone: Stone;
    index: number;
    currency: string;
    onUpdate: (index: number, updates: Partial<Stone>) => void;
    onRemove: (index: number) => void;
}

export const StoneRow: React.FC<StoneRowProps> = ({ stone, index, currency, onUpdate, onRemove }) => {
    const isDiamond = stone.typeKey === 'diamond';

    const handleChange = (field: keyof Stone, value: any) => {
        onUpdate(index, { [field]: value });
    };

    return (
        <div className="stone">
            <div className="stone-head">
                <div className="badge">
                    <b>#{index + 1}</b>
                    <div className="pill">{isDiamond ? 'Diamond' : 'Colored Gem'}</div>
                </div>
                <button onClick={() => onRemove(index)} className="danger" title="Remove Row">
                    <Trash2 size={14} /> Remove
                </button>
            </div>

            <div className="row" style={{ marginTop: 10 }}>
                {/* Role */}
                <div className="col">
                    <label>Role</label>
                    <select
                        value={stone.roleIndex}
                        onChange={(e) => handleChange('roleIndex', parseInt(e.target.value))}
                    >
                        {CATALOG.stoneRoles.map((r, i) => <option key={i} value={i}>{r}</option>)}
                    </select>
                </div>

                {/* Type */}
                <div className="col">
                    <label>Gem Type</label>
                    {isDiamond ? (
                        <input type="text" value="Diamond" disabled style={{ background: 'var(--pill-bg)' }} />
                    ) : (
                        <select
                            value={stone.typeKey}
                            onChange={(e) => handleChange('typeKey', e.target.value)}
                        >
                            {CATALOG.coloredGems.map(g => <option key={g.key} value={g.key}>{g.name}</option>)}
                        </select>
                    )}
                </div>

                {/* Weight Mode */}
                <div className="col" style={{ flex: 2 }}>
                    <label>Weight Mode</label>
                    <select
                        value={stone.weightMode}
                        onChange={(e) => handleChange('weightMode', parseInt(e.target.value))}
                    >
                        {CATALOG.weightModes.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                </div>
            </div>

            {/* Weight Inputs */}
            <div className="row" style={{ marginTop: 10 }}>
                {stone.weightMode === 0 && (
                    <div className="col">
                        <label>Total Weight (ct)</label>
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
                            <label>Weight Each (ct)</label>
                            <input
                                type="number"
                                value={stone.ctEach}
                                onChange={(e) => handleChange('ctEach', e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <label>Qty</label>
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
                            <label>Diameter (mm)</label>
                            <input
                                type="number"
                                value={stone.mm}
                                onChange={(e) => handleChange('mm', e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <label>Qty</label>
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
                            <label>Color</label>
                            <select
                                value={stone.dColor}
                                onChange={(e) => handleChange('dColor', e.target.value)}
                            >
                                {CATALOG.diamond.colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col">
                            <label>Clarity</label>
                            <select
                                value={stone.dClarity}
                                onChange={(e) => handleChange('dClarity', e.target.value)}
                            >
                                {CATALOG.diamond.clarities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col">
                            <label>Cut</label>
                            <select
                                value={stone.dCutIndex}
                                onChange={(e) => handleChange('dCutIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.diamond.cuts.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="col">
                            <label>Fluor</label>
                            <select
                                value={stone.dFluorIndex}
                                onChange={(e) => handleChange('dFluorIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.diamond.fluorescence.map((f, i) => <option key={i} value={i}>{f.name}</option>)}
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
                            <label>Treatment</label>
                            <select
                                value={stone.treatmentKey}
                                onChange={(e) => handleChange('treatmentKey', e.target.value)}
                            >
                                {CATALOG.treatments.map(t => <option key={t.key} value={t.key}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="row" style={{ alignItems: 'flex-end' }}>
                <div className="col">
                    <label>Price Mode</label>
                    <select
                        value={stone.priceMode}
                        onChange={(e) => handleChange('priceMode', parseInt(e.target.value))}
                    >
                        {CATALOG.priceModes.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                </div>
                <div className="col">
                    <label>Price/ct</label>
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
