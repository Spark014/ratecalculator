"use client";

import React from 'react';
import { useQuote } from '@/hooks/useQuote';
import { StoneRow } from './StoneRow';
import { MetalSection } from './MetalSection';
import { LaborSection } from './LaborSection';
import { SummarySection } from './SummarySection';
import { CATALOG } from '@/lib/catalog';
import { QuickGuide } from './QuickGuide';
import { Plus, Trash2, ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { PackagingSection } from './PackagingSection';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { usePricing } from '@/lib/pricing-context'; // Added this import


export const QuoteCalculator: React.FC = () => {
    const { config } = usePricing();
    const {
        state, computed, updateState, updateStone, addStone, removeStone, resetAll
    } = useQuote(config);
    const { t, language, setLanguage } = useLanguage();

    return (
        <div className="container">
            <div className="header">
                <div>
                    <div className="h1">{t.title}</div>
                    <div className="sub">
                        {t.subtitle}<br />
                        {t.subtitle_note}
                    </div>
                </div>
                <div className="nav">
                    <Link href="/test">
                        <ExternalLink size={14} /> {t.test_page}
                    </Link>
                    <button onClick={resetAll} className="secondary">
                        <RotateCcw size={14} /> {t.reset}
                    </button>
                    <button onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')} className="secondary">
                        {language === 'en' ? '中文' : 'English'}
                    </button>
                    <ThemeToggle />
                </div>
            </div>

            <div className="grid">
                <div className="left-col">
                    {/* Header Info */}
                    <div className="card">
                        <h2>{t.basic_info}</h2>
                        <div className="row">
                            <div className="col">
                                <label>{t.customer_name}</label>
                                <input
                                    type="text"
                                    value={state.customerName}
                                    onChange={(e) => updateState({ customerName: e.target.value })}
                                    placeholder={t.customer_placeholder}
                                />
                            </div>
                            <div className="col">
                                <label>{t.product_style}</label>
                                <input
                                    type="text"
                                    value={state.productName}
                                    onChange={(e) => updateState({ productName: e.target.value })}
                                    placeholder={t.product_placeholder}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: 10 }}>
                            <div className="col">
                                <label>{t.currency}</label>
                                <select
                                    value={state.currency}
                                    onChange={(e) => updateState({ currency: e.target.value })}
                                >
                                    {CATALOG.currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="col">
                                <label>{t.quote_no}</label>
                                <input
                                    type="text" className="mono"
                                    value={state.quoteNo} disabled
                                />
                            </div>
                        </div>
                        <div className="small" style={{ marginTop: 10 }}>
                            {t.subtitle}
                        </div>
                    </div>

                    {/* Stones */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>{t.gem_details}</h2>
                        </div>

                        <div className="btnrow" style={{ marginBottom: 12 }}>
                            <button onClick={() => addStone(0, false)}>{t.add_stone_row}</button>
                            <button className="secondary" onClick={() => addStone(1, true)}>{t.add_diamond_row}</button>
                        </div>

                        {state.stones.map((stone, index) => (
                            <StoneRow
                                key={stone.id}
                                stone={stone}
                                index={index}
                                currency={state.currency}
                                onUpdate={updateStone}
                                onRemove={removeStone}
                            />
                        ))}

                        <div className="total" style={{ marginTop: 10 }}>
                            {t.gems_total}: {state.currency} {computed.stonesTotal}
                        </div>
                    </div>

                    {/* Metal */}
                    <MetalSection
                        metal={state.metal}
                        subtotal={computed.metalSub}
                        currency={state.currency}
                        onUpdate={(updates) => updateState({ metal: { ...state.metal, ...updates } })}
                    />

                    {/* Labor */}
                    <LaborSection
                        labor={state.labor}
                        subtotal={computed.laborSub}
                        currency={state.currency}
                        onUpdate={(updates) => updateState({ labor: { ...state.labor, ...updates } })}
                    />

                    {/* Packaging */}
                    <PackagingSection
                        pack={state.pack}
                        subtotal={computed.packSub}
                        currency={state.currency}
                        onUpdate={(updates) => updateState({ pack: { ...state.pack, ...updates } })}
                    />
                </div>

                <div className="right-col">
                    {/* Summary */}
                    <SummarySection
                        state={state}
                        computed={computed}
                        onUpdateRate={(field, value) => updateState({ [field]: value })}
                        onClear={resetAll}
                    />

                    {/* Quick Guide */}
                    <QuickGuide />
                </div>
            </div>
        </div>
    );
};
