"use client";

import React from 'react';
import { useQuote } from '@/hooks/useQuote';
import { StoneRow } from './StoneRow';
import { MetalSection } from './MetalSection';
import { LaborSection } from './LaborSection';
import { SummarySection } from './SummarySection';
import { CATALOG } from '@/lib/catalog';
import { Plus } from 'lucide-react';

export const QuoteCalculator: React.FC = () => {
    const {
        state, computed, updateState, updateStone, addStone, removeStone, resetAll
    } = useQuote();

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Jewelry Quote (Next.js)</h1>
                <button onClick={resetAll} className="text-sm text-red-500 underline">Reset All</button>
            </div>

            {/* Header Info */}
            <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-gray-500">Quote No</label>
                    <input
                        type="text" className="w-full border rounded p-1 bg-gray-100"
                        value={state.quoteNo} disabled
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Currency</label>
                    <select
                        className="w-full border rounded p-1"
                        value={state.currency}
                        onChange={(e) => updateState({ currency: e.target.value })}
                    >
                        {CATALOG.currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Customer Name</label>
                    <input
                        type="text" className="w-full border rounded p-1"
                        value={state.customerName}
                        onChange={(e) => updateState({ customerName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Product / Style</label>
                    <input
                        type="text" className="w-full border rounded p-1"
                        value={state.productName}
                        onChange={(e) => updateState({ productName: e.target.value })}
                    />
                </div>
            </div>

            {/* Stones */}
            <div className="bg-white p-4 rounded shadow mb-4">
                <h3 className="font-bold text-lg mb-3 border-b pb-1">Gem Details</h3>
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
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => addStone(0, false)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                        <Plus size={16} /> Add Stone Row
                    </button>
                    <button
                        onClick={() => addStone(0, true)}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                        <Plus size={16} /> Add Diamond Row
                    </button>
                </div>
                <div className="mt-3 text-right font-bold text-gray-700">
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

            {/* Summary */}
            <SummarySection
                state={state}
                computed={computed}
                onUpdatePack={(updates) => updateState({ pack: { ...state.pack, ...updates } })}
                onUpdateRate={(field, value) => updateState({ [field]: value })}
            />
        </div>
    );
};
