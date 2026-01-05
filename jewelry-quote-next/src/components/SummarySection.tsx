import React from 'react';
import { QuoteState, ComputedValues, Pack } from '@/lib/types';
import { CATALOG } from '@/lib/catalog';
import { getLineTotalCt, isDiamondLine, num, money } from '@/lib/calculations';

interface SummarySectionProps {
    state: QuoteState;
    computed: ComputedValues;
    onUpdatePack: (updates: Partial<Pack>) => void;
    onUpdateRate: (field: 'profitRate' | 'taxRate', value: string) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ state, computed, onUpdatePack, onUpdateRate }) => {

    const copyQuote = () => {
        const ccy = state.currency;
        const lines = state.stones.map((s, i) => {
            const role = CATALOG.stoneRoles[s.roleIndex] || "—";
            const type = isDiamondLine(s) ? CATALOG.diamond.name : (CATALOG.coloredGems.find(g => g.key === s.typeKey)?.name ?? s.typeKey);
            let detail = "";
            if (isDiamondLine(s)) {
                detail = `4C: ${s.dColor} / ${s.dClarity} / ${CATALOG.diamond.cuts[s.dCutIndex]?.name} | Fluor:${CATALOG.diamond.fluorescence[s.dFluorIndex]?.name}`;
            } else {
                const gem = CATALOG.coloredGems.find(g => g.key === s.typeKey) || CATALOG.coloredGems[0];
                const grade = gem.grades[s.gradeIndex]?.grade ?? "—";
                const tName = CATALOG.treatments.find(t => t.key === s.treatmentKey)?.name ?? "—";
                detail = `Grade:${grade} | Treat:${tName}`;
            }
            const wmode = CATALOG.weightModes[s.weightMode];
            let wtxt = "";
            if (s.weightMode === 0) wtxt = `${s.totalCt || 0}ct`;
            else if (s.weightMode === 1) wtxt = `${s.ctEach || 0}×${s.qty || 0}ct`;
            else wtxt = `${s.mm || 0}mm×${s.qty || 0} (Est. ct)`;

            return `${i + 1}. ${role} | ${type} | ${detail} | W.Mode:${wmode} | Weight:${wtxt} | Price/ct:${money(num(s.pricePerCt))} | Sub:${ccy} ${s.sub}`;
        }).join("\n");

        const mat = CATALOG.metals.find(m => m.key === state.metal.materialKey) || CATALOG.metals[0];
        const text =
            `Jewelry Quote
Quote No: ${state.quoteNo}
Customer: ${state.customerName || "-"}
Product: ${state.productName || "-"}
Currency: ${ccy}

【Gem Details】
${lines}
Gems Total: ${ccy} ${computed.stonesTotal}

【Precious Metal】
Material: ${mat.name}
Weight(g): ${state.metal.weightG || 0}
Price/g: ${state.metal.pricePerGram || 0} (${CATALOG.priceModes[state.metal.priceMode] || ""})
Loss Rate: ${state.metal.lossRate || 0}%
Extra Fee: ${state.metal.extraFee || 0}
Metal Subtotal: ${ccy} ${computed.metalSub}

【Labor】
Design: ${state.labor.designFee || 0}
Mold: ${state.labor.moldFee || 0}
Making: ${state.labor.makingFee || 0}
Buffer: ${state.labor.reworkFee || 0}
Labor Subtotal: ${ccy} ${computed.laborSub}

【Packaging】
Pack Fee: ${state.pack.packFee || 0}
Cert/Tag: ${state.pack.certFee || 0}
Pack Subtotal: ${ccy} ${computed.packSub}

Total Cost: ${ccy} ${computed.costTotal}
Profit Rate: ${state.profitRate || 0}%
Tax Rate: ${state.taxRate || 0}%
Final Quote: ${ccy} ${computed.quoteTotal}
`;

        navigator.clipboard.writeText(text).then(() => {
            alert("Quote copied to clipboard");
        }).catch(() => {
            alert("Failed to copy");
        });
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-bold text-lg mb-3 border-b pb-1">Packaging & Totals</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div>
                    <label className="block text-xs text-gray-500">Pack Fee</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={state.pack.packFee}
                        onChange={(e) => onUpdatePack({ packFee: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Cert/Tag</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={state.pack.certFee}
                        onChange={(e) => onUpdatePack({ certFee: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Profit Rate (%)</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={state.profitRate}
                        onChange={(e) => onUpdateRate('profitRate', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500">Tax Rate (%)</label>
                    <input
                        type="number" className="w-full border rounded p-1"
                        value={state.taxRate}
                        onChange={(e) => onUpdateRate('taxRate', e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-gray-100 p-3 rounded space-y-1 text-sm">
                <div className="flex justify-between"><span>Gems:</span> <span>{state.currency} {computed.stonesTotal}</span></div>
                <div className="flex justify-between"><span>Metal:</span> <span>{state.currency} {computed.metalSub}</span></div>
                <div className="flex justify-between"><span>Labor:</span> <span>{state.currency} {computed.laborSub}</span></div>
                <div className="flex justify-between"><span>Pack:</span> <span>{state.currency} {computed.packSub}</span></div>
                <div className="border-t my-1"></div>
                <div className="flex justify-between font-bold"><span>Cost Total:</span> <span>{state.currency} {computed.costTotal}</span></div>
                <div className="flex justify-between text-xl font-bold text-blue-700 mt-2">
                    <span>Final Quote:</span> <span>{state.currency} {computed.quoteTotal}</span>
                </div>
            </div>

            <div className="mt-4 text-center">
                <button
                    onClick={copyQuote}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
                >
                    Copy Quote Text
                </button>
            </div>
        </div>
    );
};
