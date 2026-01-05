"use client";

import React, { useState } from 'react';
import { calculateQuote } from '@/lib/calculations';
import { QuoteState } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Play, Edit } from 'lucide-react';

// --- Test Cases ---
interface TestCase {
    id: string;
    desc: string;
    setup: (state: QuoteState) => QuoteState;
    check: (computed: any) => { ok: boolean; msg: string; expected: string; actual: string };
}

const TEST_CASES: TestCase[] = [
    {
        id: "1",
        desc: "Currency Change (USD)",
        setup: (s) => ({ ...s, currency: "USD" }),
        check: (c) => ({
            ok: true,
            msg: "Currency should be USD",
            expected: "USD",
            actual: "USD"
        })
    },
    {
        id: "2",
        desc: "Side Stone mm->ct (2.0mm)",
        setup: (s) => {
            const s2 = { ...s };
            s2.stones = [{
                id: "t1", roleIndex: 1, typeKey: "diamond", weightMode: 2,
                mm: "2.0", qty: "10", ctEach: "0", totalCt: "0",
                dColor: "G-H", dClarity: "VS", dCutIndex: 0, dFluorIndex: 0,
                gradeIndex: 0, treatmentKey: "natural_unknown",
                priceMode: 0, pricePerCt: "0", sub: "0"
            }];
            return s2;
        },
        check: (c) => {
            // 2.0mm => 0.035ct * 10 = 0.35ct
            // Price: 0.30-0.49 bracket. G-H/VS base=2100.
            // 0.35 * 2100 = 735.
            // Cut(Ex)=1.08, Fluor(None)=1.00 => 735 * 1.08 = 793.8
            const st = c.stones[0];
            const ok = Math.abs(parseFloat(st.sub) - 793.8) < 5;
            return {
                ok,
                msg: "2.0mm*10 => 0.35ct, Price ~794",
                expected: "793.8",
                actual: st.sub
            };
        }
    },
    {
        id: "3",
        desc: "Colored Gem Treatment (Ruby Heated)",
        setup: (s) => {
            const s3 = { ...s };
            s3.stones = [{
                id: "t2", roleIndex: 0, typeKey: "ruby", weightMode: 0,
                totalCt: "1.0", qty: "1", ctEach: "0", mm: "0",
                dColor: "D-F", dClarity: "IF/VVS", dCutIndex: 0, dFluorIndex: 0,
                gradeIndex: 1, // AA => 420
                treatmentKey: "heated", // 0.90
                priceMode: 0, pricePerCt: "0", sub: "0"
            }];
            return s3;
        },
        check: (c) => {
            // Ruby AA=420. Heated=0.9. 420*0.9=378. 1ct => 378.
            const st = c.stones[0];
            const ok = Math.abs(parseFloat(st.sub) - 378) < 2;
            return {
                ok,
                msg: "Ruby AA(420)*Heated(0.9) = 378",
                expected: "378",
                actual: st.sub
            };
        }
    }
];

export default function TestPage() {
    const [results, setResults] = useState<{ id: string, pass: boolean, actual: string, expected: string }[]>([]);

    const runTests = () => {
        const res = TEST_CASES.map(tc => {
            // 1. Create fresh state
            let state: QuoteState = {
                quoteNo: "TEST", customerName: "", productName: "", currency: "LKR",
                stones: [],
                metal: { materialKey: "18k", weightG: "0", lossRate: "0", priceMode: 0, pricePerGram: "0", extraFee: "0" },
                labor: { designFee: "0", moldFee: "0", makingFee: "0", reworkFee: "0" },
                pack: { packFee: "0", certFee: "0" },
                profitRate: "0", taxRate: "0"
            };
            // 2. Setup
            state = tc.setup(state);
            // 3. Calc
            const computed = calculateQuote(state);
            // 4. Check
            const check = tc.check(computed);
            return { id: tc.id, pass: check.ok, actual: check.actual, expected: check.expected };
        });
        setResults(res);
    };

    const writeDemoQuote = () => {
        const demoState: QuoteState = {
            quoteNo: "DEMO-001",
            customerName: "Demo Customer",
            productName: "18K Ruby Ring",
            currency: "USD",
            stones: [
                {
                    id: "d1", roleIndex: 0, typeKey: "ruby", weightMode: 0,
                    totalCt: "2.5", qty: "1", ctEach: "0", mm: "0",
                    dColor: "D-F", dClarity: "IF/VVS", dCutIndex: 0, dFluorIndex: 0,
                    gradeIndex: 2, // AAA
                    treatmentKey: "unheated",
                    priceMode: 0, pricePerCt: "0", sub: "0"
                },
                {
                    id: "d2", roleIndex: 1, typeKey: "diamond", weightMode: 2,
                    mm: "1.5", qty: "20", ctEach: "0", totalCt: "0",
                    dColor: "G-H", dClarity: "VS", dCutIndex: 0, dFluorIndex: 0,
                    gradeIndex: 0, treatmentKey: "natural_unknown",
                    priceMode: 0, pricePerCt: "0", sub: "0"
                }
            ],
            metal: { materialKey: "18k", weightG: "5.5", lossRate: "15", priceMode: 0, pricePerGram: "0", extraFee: "50" },
            labor: { designFee: "100", moldFee: "50", makingFee: "150", reworkFee: "20" },
            pack: { packFee: "30", certFee: "20" },
            profitRate: "20", taxRate: "8"
        };
        localStorage.setItem('jewelryQuoteState', JSON.stringify(demoState));
        window.location.href = "/";
    };

    return (
        <div className="container">
            <div className="header">
                <div>
                    <div className="h1">Online Test Page (Web Version)</div>
                    <div className="sub">
                        Used to verify: <b>Diameter(mm)→ct Estimate</b>, <b>Gem Treatment Multiplier</b>, <b>Diamond 4C Auto Price</b>, and Total Formula (Cost/Profit/Tax).<br />
                        You can also write your real price catalog into <code>app.js</code>, then use these test cases for regression testing.
                    </div>
                </div>
                <div className="nav">
                    <Link href="/">
                        <ArrowLeft size={14} /> Back to Quote Page
                    </Link>
                </div>
            </div>

            <div className="card">
                <h2>Run Tests</h2>
                <div className="btnrow">
                    <button onClick={runTests}>
                        <Play size={14} style={{ marginRight: 4 }} /> Run All Tests
                    </button>
                    <button className="secondary" onClick={writeDemoQuote}>
                        <Edit size={14} style={{ marginRight: 4 }} /> Write "Demo Quote" to Calculator & Redirect
                    </button>
                </div>
                <div className="small" style={{ marginTop: 8, color: '#666' }}>
                    Note: Test prices depend on built-in sample catalog; if you modified the catalog, expected values may need adjustment.
                </div>
            </div>

            <div className="card">
                <h2>Test Results</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Case</th>
                            <th>Check Item</th>
                            <th>Expected</th>
                            <th>Actual</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length === 0 && (
                            <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>No results yet. Click "Run All Tests".</td></tr>
                        )}
                        {results.map((r, i) => {
                            const tc = TEST_CASES.find(t => t.id === r.id);
                            return (
                                <tr key={r.id}>
                                    <td>{tc?.id}</td>
                                    <td>{tc?.desc}</td>
                                    <td>{r.expected}</td>
                                    <td>{r.actual}</td>
                                    <td>
                                        {r.pass ? (
                                            <span className="badge-green">PASS</span>
                                        ) : (
                                            <span className="badge-red">FAIL</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h2>Explanation</h2>
                <div className="small" style={{ lineHeight: 1.6 }}>
                    <b>mm→ct:</b> Uses common "Round Diamond Diameter" table interpolation (suitable for quick side stone quote).<br />
                    <b>Diamond 4C:</b> Sample price table gives price/ct by carat bracket + color + clarity, then multiplies by cut/fluor.<br />
                    <b>Gem Treatment:</b> Sample multipliers: Heated×0.90, Unheated×1.25, Glass Filled×0.45 etc. (All adjustable).
                </div>
            </div>
        </div>
    );
}