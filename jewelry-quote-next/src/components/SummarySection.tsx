import React from 'react';
import { QuoteState, ComputedValues, Pack } from '@/lib/types';
import { CATALOG } from '@/lib/catalog';
import { getLineTotalCt, isDiamondLine, num, money } from '@/lib/calculations';

interface SummarySectionProps {
    state: QuoteState;
    computed: ComputedValues;
    onUpdateRate: (field: 'profitRate' | 'taxRate', value: string) => void;
    onClear: () => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ state, computed, onUpdateRate, onClear }) => {

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
        <div className="card">
            <h2>Summary & Quote</h2>

            <div className="kv" style={{ marginTop: 10 }}>
                <span className="k">Total Cost</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
                {state.currency} {computed.costTotal}
            </div>

            <div className="col" style={{ marginBottom: 10 }}>
                <label>Profit Rate (% Optional)</label>
                <input
                    type="number"
                    value={state.profitRate}
                    onChange={(e) => onUpdateRate('profitRate', e.target.value)}
                    placeholder="e.g. 20"
                />
            </div>
            <div className="col" style={{ marginBottom: 10 }}>
                <label>Tax Rate (% Optional)</label>
                <input
                    type="number"
                    value={state.taxRate}
                    onChange={(e) => onUpdateRate('taxRate', e.target.value)}
                    placeholder="e.g. 8"
                />
            </div>

            <div className="kv" style={{ marginTop: 10 }}>
                <span className="k">Final Quote</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--link)', marginBottom: 20 }}>
                {state.currency} {computed.quoteTotal}
            </div>

            <div className="btnrow">
                <button onClick={copyQuote}>Copy Quote</button>
                <button onClick={onClear} className="secondary">Clear</button>
            </div>

            <div className="notice" style={{ marginTop: 20 }}>
                <b>Note:</b> The built-in gem/metal prices are SAMPLES only and do not represent market prices. In actual business, please change the price catalog to your purchase/factory prices, or connect to your internal price list.
            </div>
        </div>
    );
};
