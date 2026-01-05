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
        <div className="p-3 mb-2 bg-gray-50 border rounded-md text-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-gray-700">#{index + 1}</div>
                <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                {/* Role */}
                <div>
                    <label className="block text-xs text-gray-500">Role</label>
                    <select
                        className="w-full border rounded p-1"
                        value={stone.roleIndex}
                        onChange={(e) => handleChange('roleIndex', parseInt(e.target.value))}
                    >
                        {CATALOG.stoneRoles.map((r, i) => <option key={i} value={i}>{r}</option>)}
                    </select>
                </div>

                {/* Type */}
                <div>
                    <label className="block text-xs text-gray-500">Gem Type</label>
                    {isDiamond ? (
                        <input type="text" value="Diamond" disabled className="w-full border rounded p-1 bg-gray-100" />
                    ) : (
                        <select
                            className="w-full border rounded p-1"
                            value={stone.typeKey}
                            onChange={(e) => handleChange('typeKey', e.target.value)}
                        >
                            {CATALOG.coloredGems.map(g => <option key={g.key} value={g.key}>{g.name}</option>)}
                        </select>
                    )}
                </div>

                {/* Weight Mode */}
                <div className="col-span-2">
                    <label className="block text-xs text-gray-500">Weight Mode</label>
                    <select
                        className="w-full border rounded p-1"
                        value={stone.weightMode}
                        onChange={(e) => handleChange('weightMode', parseInt(e.target.value))}
                    >
                        {CATALOG.weightModes.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                </div>
            </div>

            {/* Weight Inputs */}
            <div className="grid grid-cols-3 gap-2 mb-2">
                {stone.weightMode === 0 && (
                    <div>
                        <label className="block text-xs text-gray-500">Total Weight (ct)</label>
                        <input
                            type="number" className="w-full border rounded p-1"
                            value={stone.totalCt}
                            onChange={(e) => handleChange('totalCt', e.target.value)}
                        />
                    </div>
                )}
                {stone.weightMode === 1 && (
                    <>
                        <div>
                            <label className="block text-xs text-gray-500">Weight Each (ct)</label>
                            <input
                                type="number" className="w-full border rounded p-1"
                                value={stone.ctEach}
                                onChange={(e) => handleChange('ctEach', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Qty</label>
                            <input
                                type="number" className="w-full border rounded p-1"
                                value={stone.qty}
                                onChange={(e) => handleChange('qty', e.target.value)}
                            />
                        </div>
                    </>
                )}
                {stone.weightMode === 2 && (
                    <>
                        <div>
                            <label className="block text-xs text-gray-500">Diameter (mm)</label>
                            <input
                                type="number" className="w-full border rounded p-1"
                                value={stone.mm}
                                onChange={(e) => handleChange('mm', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Qty</label>
                            <input
                                type="number" className="w-full border rounded p-1"
                                value={stone.qty}
                                onChange={(e) => handleChange('qty', e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Quality / 4C */}
            <div className="mb-2 p-2 bg-white rounded border">
                {isDiamond ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                            <label className="block text-xs text-gray-500">Color</label>
                            <select
                                className="w-full border rounded p-1"
                                value={stone.dColor}
                                onChange={(e) => handleChange('dColor', e.target.value)}
                            >
                                {CATALOG.diamond.colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Clarity</label>
                            <select
                                className="w-full border rounded p-1"
                                value={stone.dClarity}
                                onChange={(e) => handleChange('dClarity', e.target.value)}
                            >
                                {CATALOG.diamond.clarities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Cut</label>
                            <select
                                className="w-full border rounded p-1"
                                value={stone.dCutIndex}
                                onChange={(e) => handleChange('dCutIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.diamond.cuts.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Fluor</label>
                            <select
                                className="w-full border rounded p-1"
                                value={stone.dFluorIndex}
                                onChange={(e) => handleChange('dFluorIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.diamond.fluorescence.map((f, i) => <option key={i} value={i}>{f.name}</option>)}
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-500">Grade</label>
                            <select
                                className="w-full border rounded p-1"
                                value={stone.gradeIndex}
                                onChange={(e) => handleChange('gradeIndex', parseInt(e.target.value))}
                            >
                                {CATALOG.coloredGems.find(g => g.key === stone.typeKey)?.grades.map((g, i) => (
                                    <option key={i} value={i}>{g.grade}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Treatment</label>
                            <select
                                className="w-full border rounded p-1"
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
            <div className="grid grid-cols-3 gap-2 items-end">
                <div>
                    <label className="block text-xs text-gray-500">Price Mode</label>
                    <select
                        className="w-full border rounded p-1"
                        value={stone.priceMode}
                        onChange={(e) => handleChange('priceMode', parseInt(e.target.value))}
                    >
                        {CATALOG.priceModes.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Price/ct</label>
                    <input
                        type="number"
                        className={`w-full border rounded p-1 ${stone.priceMode === 0 ? 'bg-gray-100' : ''}`}
                        value={stone.pricePerCt}
                        onChange={(e) => handleChange('pricePerCt', e.target.value)}
                        disabled={stone.priceMode === 0}
                    />
                </div>
                <div className="text-right font-bold text-blue-600">
                    {currency} {stone.sub}
                </div>
            </div>
        </div>
    );
};
