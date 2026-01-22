import React from 'react';
import { QuoteState, ComputedValues, Pack } from '@/lib/types';
import { CATALOG } from '@/lib/catalog';
import { getLineTotalCt, isDiamondLine, num, money } from '@/lib/calculations';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SummarySectionProps {
    state: QuoteState;
    computed: ComputedValues;
    onUpdateRate: (field: 'profitRate' | 'taxRate', value: string) => void;
    onClear: () => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ state, computed, onUpdateRate, onClear }) => {
    const { t } = useLanguage();

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
                const colorInfo = s.gemColor ? ` | Color:${s.gemColor}` : "";
                detail = `Grade:${grade} | Treat:${tName}${colorInfo}`;
            }
            const wmode = CATALOG.weightModes[s.weightMode];
            let wtxt = "";
            if (s.weightMode === 0) wtxt = `${s.totalCt || 0}ct`;
            else if (s.weightMode === 1) wtxt = `${s.ctEach || 0}×${s.qty || 0}ct`;
            else wtxt = `${s.mm || 0}mm×${s.qty || 0} (Est. ct)`;

            return `${i + 1}. ${role} | ${type} | ${detail} | W.Mode:${wmode} | Weight:${wtxt} | Price/ct:${money(num(s.pricePerCt))} | Sub:${ccy} ${s.sub}`;
        }).join("\n");

        const mat = CATALOG.metals.find(m => m.key === state.metal.materialKey) || CATALOG.metals[0];
        let matName: string = mat.name;
        if (mat.key === '18k') matName = t.gold_18k;
        if (mat.key === '14k') matName = t.gold_14k;
        if (mat.key === 'pt950') matName = t.pt950;
        if (mat.key === 's925') matName = t.s925;
        // Basic mapping, though dynamic config is better, this is just for display text.

        const text =
            `${t.title}
${t.quote_no}: ${state.quoteNo}
${t.customer}: ${state.customerName || "-"}
${t.product}: ${state.productName || "-"}
${t.currency}: ${ccy}

【${t.gem_details}】
${lines}
${t.gems_total}: ${ccy} ${computed.stonesTotal}

【${t.metal_details}】
${t.material}: ${matName}
${t.weight_g}: ${state.metal.weightG || 0}
${t.gold_price_g}: ${state.metal.pricePerGram || 0} (${CATALOG.priceModes[state.metal.priceMode] || ""})
${t.loss_rate}: ${state.metal.lossRate || 0}%
${t.extra_fee}: ${state.metal.extraFee || 0}
${t.metal_cost}: ${ccy} ${computed.metalSub}

【${t.labor_details}】
${t.making_fee}: ${state.labor.makingFee || 0}
${t.labor_cost}: ${ccy} ${computed.laborSub}

【${t.packaging_details}】
${t.pack_fee}: ${state.pack.packFee || 0}
${t.cert_tag}: ${state.pack.certFee || 0}
${t.packaging_subtotal}: ${ccy} ${computed.packSub}

${t.total_cost}: ${ccy} ${computed.costTotal}
${t.profit_pct}: ${state.profitRate || 0}%
${t.tax_pct}: ${state.taxRate || 0}%
${t.final_quote}: ${ccy} ${computed.quoteTotal}
`;

        navigator.clipboard.writeText(text).then(() => {
            alert("Quote copied to clipboard");
        }).catch(() => {
            alert("Failed to copy");
        });
    };

    return (
        <div className="card">
            <h2>{t.summary_title}</h2>

            <div className="kv" style={{ marginTop: 10 }}>
                <span className="k">{t.total_cost}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
                {state.currency} {computed.costTotal}
            </div>

            <div className="col" style={{ marginBottom: 10 }}>
                <label>{t.profit_rate_optional}</label>
                <input
                    type="number"
                    value={state.profitRate}
                    onChange={(e) => onUpdateRate('profitRate', e.target.value)}
                    placeholder="e.g. 20"
                />
            </div>
            <div className="col" style={{ marginBottom: 10 }}>
                <label>{t.tax_rate_optional}</label>
                <input
                    type="number"
                    value={state.taxRate}
                    onChange={(e) => onUpdateRate('taxRate', e.target.value)}
                    placeholder="e.g. 8"
                />
            </div>

            <div className="kv" style={{ marginTop: 10 }}>
                <span className="k">{t.final_quote}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--link)', marginBottom: 20 }}>
                {state.currency} {computed.quoteTotal}
            </div>

            <div className="btnrow">
                <button onClick={copyQuote}>{t.copy_quote}</button>
                <button onClick={onClear} className="secondary">{t.clear}</button>
            </div>

            <div className="notice" style={{ marginTop: 20 }}>
                {t.note_content}
            </div>
        </div>
    );
};
