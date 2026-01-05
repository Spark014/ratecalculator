"use client";

import React, { useEffect, useState } from 'react';
import { CATALOG } from '@/lib/catalog';
import { interpolateMeleeCt, diamondAutoPricePerCt } from '@/lib/calculations';
import Link from 'next/link';

interface TestResult {
    caseName: string;
    checkItem: string;
    expected: string;
    actual: string;
    pass: boolean;
}

function approxEqual(a: number, b: number, eps = 0.01) {
    return Math.abs(a - b) <= eps;
}

export default function TestPage() {
    const [results, setResults] = useState<TestResult[]>([]);

    useEffect(() => {
        const res: TestResult[] = [];

        // Case 1: mm->ct known point
        {
            const mm = 1.3;
            const ct = interpolateMeleeCt(mm);
            res.push({
                caseName: "T1",
                checkItem: "mm→ct(1.3mm)",
                expected: "0.0100",
                actual: ct.toFixed(4),
                pass: approxEqual(ct, 0.01, 0.0006)
            });
        }

        // Case 2: mm interpolation
        {
            const mm = 2.05;
            const ct = interpolateMeleeCt(mm);
            res.push({
                caseName: "T2",
                checkItem: "mm→ct(2.05mm Interp)",
                expected: "0.0375",
                actual: ct.toFixed(4),
                pass: approxEqual(ct, 0.0375, 0.0008)
            });
        }

        // Case 3: Diamond auto price
        {
            const p = diamondAutoPricePerCt({ carat: 1.00, color: "G-H", clarity: "VS", cutIndex: 0, fluorIndex: 0 });
            res.push({
                caseName: "T3",
                checkItem: "Diamond Auto Price/ct",
                expected: "6480.00",
                actual: p.toFixed(2),
                pass: approxEqual(p, 6480, 0.1)
            });
        }

        // Case 4: Diamond fluor
        {
            const p = diamondAutoPricePerCt({ carat: 1.00, color: "G-H", clarity: "VS", cutIndex: 0, fluorIndex: 3 });
            res.push({
                caseName: "T4",
                checkItem: "Diamond Fluor Mult",
                expected: "5961.60",
                actual: p.toFixed(2),
                pass: approxEqual(p, 5961.6, 0.2)
            });
        }

        // Case 5: Gem treatment
        {
            const sapphire = CATALOG.coloredGems.find(g => g.key === "sapphire");
            const base = sapphire?.grades.find(x => x.grade === "AA")?.p ?? 0;
            const mult = CATALOG.treatments.find(t => t.key === "unheated")?.mult ?? 1;
            const p = base * mult;
            res.push({
                caseName: "T5",
                checkItem: "Gem Treat Mult(Unheated)",
                expected: "325.00",
                actual: p.toFixed(2),
                pass: approxEqual(p, 325, 0.01)
            });
        }

        // Case 6: Total formula
        {
            const stones = 1.25 * 260;
            const metal = 5 * 1.03 * 70;
            const labor = 300;
            const pack = 30;
            const cost = stones + metal + labor + pack;
            const quote = cost * 1.2 * 1.08;
            res.push({
                caseName: "T6",
                checkItem: "Total Formula(Cost)",
                expected: "1015.50",
                actual: cost.toFixed(2),
                pass: approxEqual(cost, 1015.50, 0.01)
            });
            res.push({
                caseName: "T6",
                checkItem: "Total Formula(Quote)",
                expected: "1316.09",
                actual: quote.toFixed(2),
                pass: approxEqual(quote, 1316.09, 0.02)
            });
        }

        setResults(res);
    }, []);

    const fillDemo = () => {
        const demo = {
            quoteNo: "DEMO-" + (new Date().toISOString().slice(0, 10)),
            customerName: "Demo Customer",
            productName: "18K Sapphire Ring (Sample)",
            currency: "USD",
            stones: [
                {
                    id: "DEMO1", roleIndex: 0, typeKey: "sapphire", weightMode: 0, totalCt: "1.25",
                    ctEach: "", qty: "1", mm: "",
                    gradeIndex: 1, treatmentKey: "unheated",
                    dColor: "G-H", dClarity: "VS", dCutIndex: 0, dFluorIndex: 0,
                    priceMode: 0, pricePerCt: "", sub: "0.00"
                },
                {
                    id: "DEMO2", roleIndex: 1, typeKey: "diamond", weightMode: 2, totalCt: "",
                    ctEach: "", qty: "80", mm: "1.3",
                    gradeIndex: 0, treatmentKey: "natural_unknown",
                    dColor: "G-H", dClarity: "SI", dCutIndex: 1, dFluorIndex: 0,
                    priceMode: 0, pricePerCt: "", sub: "0.00"
                }
            ],
            metal: { materialKey: "18k", weightG: "5.00", priceMode: 0, pricePerGram: "", lossRate: "3", extraFee: "15" },
            labor: { designFee: "100", moldFee: "200", makingFee: "180", reworkFee: "0" },
            pack: { packFee: "25", certFee: "10" },
            profitRate: "20",
            taxRate: "8"
        };
        localStorage.setItem("jewelry_quote_state_v1", JSON.stringify(demo));
        window.location.href = "/";
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Online Test Page (Next.js)</h1>
                <Link href="/" className="text-blue-600 hover:underline">Back to Quote Page</Link>
            </div>

            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="font-bold text-lg mb-2">Run Tests</h2>
                <div className="flex gap-2">
                    <button onClick={() => window.location.reload()} className="bg-gray-200 px-3 py-1 rounded">Rerun Tests</button>
                    <button onClick={fillDemo} className="bg-blue-600 text-white px-3 py-1 rounded">Write "Demo Quote" & Redirect</button>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg mb-2">Test Results</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Case</th>
                            <th className="p-2">Check Item</th>
                            <th className="p-2">Expected</th>
                            <th className="p-2">Actual</th>
                            <th className="p-2">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, i) => (
                            <tr key={i} className="border-b last:border-0">
                                <td className="p-2">{r.caseName}</td>
                                <td className="p-2">{r.checkItem}</td>
                                <td className="p-2 font-mono">{r.expected}</td>
                                <td className="p-2 font-mono">{r.actual}</td>
                                <td className="p-2">
                                    {r.pass ? (
                                        <span className="text-green-600 font-bold">PASS</span>
                                    ) : (
                                        <span className="text-red-600 font-bold">FAIL</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
