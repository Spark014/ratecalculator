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

export const QuoteCalculator: React.FC = () => {
    const {
        state, computed, updateState, updateStone, addStone, removeStone, resetAll
    } = useQuote();

    return (
        <div className="container">
            <div className="header">
                <div>
                    <div className="h1">Jewelry Quote (Web Version)</div>
                    <div className="sub">
                        Supports: Multi-line Main/Side Stones, Gem Type/Quality/Weight, <b>Diamond 4C (Simplified Table)</b>, Treatment Multipliers,
                        <b>Side Stone Estimate by Diameter(mm)</b>, Metal Material/Weight/Loss, Labor/Packaging, Profit/Tax, Copy Quote.<br />
                        Built-in prices are SAMPLES only: Please replace with your purchase/factory prices in CATALOG inside <code>app.js</code>.
                    </div>
                </div>
                <div className="nav">
                    <Link href="/test">
                        <ExternalLink size={14} /> Test Page
                    </Link>
                    <button onClick={resetAll} className="secondary">
                        <RotateCcw size={14} /> Reset
                    </button>
                    <ThemeToggle />
                </div>
            </div>

            <div className="grid">
                <div className="left-col">
                    {/* Header Info */}
                    <div className="card">
                        <h2>Basic Info</h2>
                        <div className="row">
                            <div className="col">
                                <label>Customer Name (Optional)</label>
                                <input
                                    type="text"
                                    value={state.customerName}
                                    onChange={(e) => updateState({ customerName: e.target.value })}
                                    placeholder="e.g. Customer A / LAKSALA"
                                />
                            </div>
                            <div className="col">
                                <label>Product/Style (Optional)</label>
                                <input
                                    type="text"
                                    value={state.productName}
                                    onChange={(e) => updateState({ productName: e.target.value })}
                                    placeholder="e.g. 18K Sapphire Ring"
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: 10 }}>
                            <div className="col">
                                <label>Currency</label>
                                <select
                                    value={state.currency}
                                    onChange={(e) => updateState({ currency: e.target.value })}
                                >
                                    {CATALOG.currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="col">
                                <label>Quote No.</label>
                                <input
                                    type="text" className="mono"
                                    value={state.quoteNo} disabled
                                />
                            </div>
                        </div>
                        <div className="small" style={{ marginTop: 10 }}>
                            Gems default to "Price per ct"; Side stones can use "Diameter(mm) × Qty" to estimate ct (approx for round diamonds).
                            Diamond auto-price calculated by "Simplified 4C Table + Cut/Fluor Multiplier".
                        </div>
                    </div>

                    {/* Stones */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Gem Details (Main/Side)</h2>
                        </div>

                        <div className="btnrow" style={{ marginBottom: 12 }}>
                            <button onClick={() => addStone(0, false)}>+ Add Stone Row</button>
                            <button className="secondary" onClick={() => addStone(0, true)}>+ Add Diamond Row</button>
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
                            Gems Total: {state.currency} {computed.stonesTotal}
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
