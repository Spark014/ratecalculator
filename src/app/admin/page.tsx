"use client";

import React, { useState } from 'react';
import { usePricing, PricingConfig } from '@/lib/pricing-context';
import { useCurrency } from '@/lib/currency-context';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { ArrowLeft, Save, RotateCcw, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function AdminPage() {
    const { config, updateConfig, resetConfig } = usePricing();
    const { refreshRates, lastUpdated, isLoading } = useCurrency();
    const { language, setLanguage } = useLanguage();
    const [localConfig, setLocalConfig] = useState<PricingConfig>(config);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'general' | 'metals' | 'gems'>('general');

    const { t } = useLanguage();

    const handleSave = () => {
        updateConfig(localConfig);
        setMessage(t.save_success || 'Configuration saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleReset = () => {
        if (confirm(t.reset_confirm || 'Are you sure you want to reset to default values?')) {
            resetConfig();
            window.location.reload();
        }
    };

    const updateMetal = (key: string, field: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            metals: {
                ...prev.metals,
                [key]: {
                    ...prev.metals[key],
                    [field]: parseFloat(value) || 0
                }
            }
        }));
    };

    const updateMaking = (key: keyof PricingConfig['makingFees'], value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            makingFees: {
                ...prev.makingFees,
                [key]: parseFloat(value) || 0
            }
        }));
    };

    // --- Advanced Gem Helpers ---
    const updateGemPrice = (gemKey: string, treatmentKey: 'heated' | 'unheated', colorIndex: number, weight: string, price: string) => {
        setLocalConfig(prev => {
            const newConfig = { ...prev };
            const gem = newConfig.mainStones[gemKey];
            const treatment = gem.treatments[treatmentKey];
            const color = treatment.colors[colorIndex];
            color.prices[weight] = parseFloat(price) || 0;
            return newConfig;
        });
    };

    const addGemColor = (gemKey: string, treatmentKey: 'heated' | 'unheated') => {
        const name = prompt(t.enter_color_name || "Enter Color Name (e.g. Royal Blue):");
        if (!name) return;
        setLocalConfig(prev => {
            const newConfig = { ...prev };
            newConfig.mainStones[gemKey].treatments[treatmentKey].colors.push({
                name,
                prices: { "1": 0, "1.5": 0, "2": 0, "3": 0 }
            });
            return newConfig;
        });
    };

    const removeGemColor = (gemKey: string, treatmentKey: 'heated' | 'unheated', index: number) => {
        if (!confirm(t.remove_color_confirm || "Remove this color?")) return;
        setLocalConfig(prev => {
            const newConfig = { ...prev };
            newConfig.mainStones[gemKey].treatments[treatmentKey].colors.splice(index, 1);
            return newConfig;
        });
    };

    return (
        <div className="container">
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link href="/" className="secondary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <ArrowLeft size={16} /> {t.back || 'Back'}
                    </Link>
                    <h1 className="h1">{t.pricing_config || 'Pricing Configuration'} <span className="sub">({t.base_usd || 'Base: USD'})</span></h1>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')} className="secondary">
                        {language === 'en' ? '中文' : 'English'}
                    </button>
                    <ThemeToggle />
                    <button onClick={refreshRates} className="secondary" disabled={isLoading}>
                        <RefreshCw size={16} className={isLoading ? "spin" : ""} />
                        {isLoading ? ` ${t.updating || 'Updating...'}` : ` ${t.refresh_rates || 'Refresh Rates'}`}
                    </button>
                    <button onClick={handleReset} className="danger">
                        <RotateCcw size={16} /> {t.reset_defaults || 'Reset Defaults'}
                    </button>
                    <button onClick={handleSave} className="primary">
                        <Save size={16} /> {t.save_changes || 'Save Changes'}
                    </button>
                </div>
            </div>

            {lastUpdated && (
                <div className="sub" style={{ textAlign: 'right', marginBottom: 10 }}>
                    {t.currency_updated || 'Currency Rates Last Updated'}: {new Date(lastUpdated).toLocaleString()}
                </div>
            )}

            {message && <div className="notice pass" style={{ marginBottom: 20 }}>{message}</div>}

            <div className="btnrow" style={{ marginBottom: 20, borderBottom: '1px solid var(--table-border)', paddingBottom: 10 }}>
                <button className={activeTab === 'general' ? 'primary' : 'secondary'} onClick={() => setActiveTab('general')}>{t.tab_general || 'General & Small Stones'}</button>
                <button className={activeTab === 'metals' ? 'primary' : 'secondary'} onClick={() => setActiveTab('metals')}>{t.tab_metals || 'Metals'}</button>
                <button className={activeTab === 'gems' ? 'primary' : 'secondary'} onClick={() => setActiveTab('gems')}>{t.tab_gems || 'Main Stones'}</button>
            </div>

            {activeTab === 'general' && (
                <>
                    <div className="card">
                        <h2>{t.making_fees_title || 'Making Fees (USD/item)'}</h2>
                        <div className="grid">
                            {Object.entries(localConfig.makingFees).map(([key, val]) => (
                                <div key={key}>
                                    <label style={{ textTransform: 'capitalize' }}>{t[key as keyof typeof t] || key}</label>
                                    <input type="number" value={val} onChange={e => updateMaking(key as any, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2>{t.small_stones_title || 'Small Stones'}</h2>
                        <div className="row">
                            <div className="col">
                                <label>{t.diamond_std_min || 'Diamond Standard (Min)'}</label>
                                <input type="number" value={localConfig.smallStones.diamond.standard.min}
                                    onChange={e => setLocalConfig(prev => ({ ...prev, smallStones: { ...prev.smallStones, diamond: { ...prev.smallStones.diamond, standard: { ...prev.smallStones.diamond.standard, min: parseFloat(e.target.value) } } } }))} />
                            </div>
                            <div className="col">
                                <label>{t.diamond_std_max || 'Diamond Standard (Max)'}</label>
                                <input type="number" value={localConfig.smallStones.diamond.standard.max}
                                    onChange={e => setLocalConfig(prev => ({ ...prev, smallStones: { ...prev.smallStones, diamond: { ...prev.smallStones.diamond, standard: { ...prev.smallStones.diamond.standard, max: parseFloat(e.target.value) } } } }))} />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: 10 }}>
                            <div className="col">
                                <label>{t.zircon_wax || 'Zircon Wax Set'}</label>
                                <input type="number" value={localConfig.smallStones.zircon.waxSet}
                                    onChange={e => setLocalConfig(prev => ({ ...prev, smallStones: { ...prev.smallStones, zircon: { ...prev.smallStones.zircon, waxSet: parseFloat(e.target.value) } } }))} />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'metals' && (
                <>
                    <div className="card">
                        <h2>{t.standard_metals_title || 'Standard Metals'}</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t.metal_header || 'Metal'}</th>
                                    <th>{t.waste_header || 'Waste %'}</th>
                                    <th>{t.price_g_header || 'Price/g'}</th>
                                    <th>{t.extra_fee_header || 'Extra Fee'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(localConfig.metals).map(([key, metal]) => (
                                    <tr key={key}>
                                        <td>{metal.name}</td>
                                        <td>
                                            <input type="number" value={metal.waste} onChange={e => updateMetal(key, 'waste', e.target.value)} style={{ width: 80 }} />
                                        </td>
                                        <td>
                                            <input type="number" value={metal.price} onChange={e => updateMetal(key, 'price', e.target.value)} style={{ width: 80 }} />
                                        </td>
                                        <td>
                                            <input type="number" value={metal.extraFee} onChange={e => updateMetal(key, 'extraFee', e.target.value)} style={{ width: 80 }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card">
                        <h2>{t.special_colored_gold_title || 'Special Colored Gold'}</h2>
                        <div className="row">
                            <div className="col">
                                <label>{t.available_colors || 'Available Colors (Comma separated)'}</label>
                                <input
                                    type="text"
                                    value={localConfig.coloredGold?.colors.join(", ") || ""}
                                    onChange={e => setLocalConfig(prev => ({ ...prev, coloredGold: { ...prev.coloredGold, colors: e.target.value.split(",").map(s => s.trim()) } }))}
                                />
                            </div>
                            <div className="col">
                                <label>{t.extra_fee_added || 'Extra Fee (Added to base gold price)'}</label>
                                <input
                                    type="number"
                                    value={localConfig.coloredGold?.extraFee || 0}
                                    onChange={e => setLocalConfig(prev => ({ ...prev, coloredGold: { ...prev.coloredGold, extraFee: parseFloat(e.target.value) || 0 } }))}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'gems' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {Object.entries(localConfig.mainStones || {}).map(([gemKey, gem]) => (
                        <div key={gemKey} className="card">
                            <h2 style={{ textTransform: 'capitalize', borderBottom: '1px solid var(--table-border)', paddingBottom: 10 }}>{gem.name}</h2>

                            <div className="grid" style={{ gap: 40 }}>
                                {/* Unheated */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <h3>{t.unheated || 'Unheated'}</h3>
                                        <button className="small" onClick={() => addGemColor(gemKey, 'unheated')}><Plus size={12} /> {t.add_color || 'Add Color'}</button>
                                    </div>
                                    {gem.treatments.unheated.colors.map((color, cIdx) => (
                                        <div key={cIdx} className="stone">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 5 }}>
                                                {color.name}
                                                <button className="danger small" onClick={() => removeGemColor(gemKey, 'unheated', cIdx)}><Trash2 size={12} /></button>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                                                {Object.entries(color.prices).map(([weight, price]) => (
                                                    <div key={weight} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <span style={{ fontSize: 12, width: 40 }}>{weight}ct:</span>
                                                        <input
                                                            type="number"
                                                            value={price}
                                                            onChange={e => updateGemPrice(gemKey, 'unheated', cIdx, weight, e.target.value)}
                                                            style={{ padding: 4, fontSize: 12 }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Heated */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <h3>{t.heated || 'Heated'}</h3>
                                        <button className="small" onClick={() => addGemColor(gemKey, 'heated')}><Plus size={12} /> {t.add_color || 'Add Color'}</button>
                                    </div>
                                    {gem.treatments.heated.colors.map((color, cIdx) => (
                                        <div key={cIdx} className="stone">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 5 }}>
                                                {color.name}
                                                <button className="danger small" onClick={() => removeGemColor(gemKey, 'heated', cIdx)}><Trash2 size={12} /></button>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                                                {Object.entries(color.prices).map(([weight, price]) => (
                                                    <div key={weight} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <span style={{ fontSize: 12, width: 40 }}>{weight}ct:</span>
                                                        <input
                                                            type="number"
                                                            value={price}
                                                            onChange={e => updateGemPrice(gemKey, 'heated', cIdx, weight, e.target.value)}
                                                            style={{ padding: 4, fontSize: 12 }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
