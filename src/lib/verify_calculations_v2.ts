
import { calculateQuote, getAdvancedGemPrice, getSmallStonePrice } from './calculations';
import { QuoteState, Stone, Metal, Labor, Pack } from './types';
import { CATALOG } from './catalog';

// Mock Data
const mockStone: Stone = {
    id: '1', roleIndex: 0, typeKey: 'sapphire',
    weightMode: 0, totalCt: '1.2', ctEach: '1.2', qty: '1', mm: '0',
    gradeIndex: 2, treatmentKey: 'heated', gemColor: 'Royal Blue', // AAA Royal Blue 1.2ct Heated
    dColor: 'G', dClarity: 'VS', dCutIndex: 0, dFluorIndex: 0,
    priceMode: 0, pricePerCt: '0', sub: '0'
};

const mockMetal: Metal = {
    materialKey: '18k', purityKey: '18k', weightG: '10',
    priceMode: 0, pricePerGram: 70, lossRate: 0, extraFee: 0,
    // Expect 15% wastage -> 10 * 1.15 * 70 = 805
};

const mockLabor: Labor = {
    complexity: 'complicated', // $45
    makingFee: '0'
};

const mockPack: Pack = { packFee: '0', certFee: '0' };

const state: QuoteState = {
    quoteNo: 'TEST', customerName: 'Test', productName: 'Test', currency: 'USD',
    stones: [mockStone], metal: mockMetal, labor: mockLabor, pack: mockPack,
    profitRate: '0', taxRate: '0'
};

console.log("--- START VERIFICATION 2 (Heated Logic) ---");

// Test 1: Royal Blue Heated
// Catalog: Royal Blue AAA 1-1.5ct = 500 USD/ct
// Logic: Heated should be exact table price (500).
// Previous logic was 500 * 0.9 = 450.
const quoteHeated = calculateQuote(state);
// Stone total should be 1.2 * 500 = 600.
// Metal 805, Labor 45 -> Total 1450.
console.log(`Test 1 (Heated): Stone Total 600? Got ${quoteHeated.stonesTotal}`);

// Test 2: Royal Blue Unheated
const unheatedStone = { ...mockStone, treatmentKey: 'unheated', id: '2' };
const stateUnheated = { ...state, stones: [unheatedStone] };
// Logic: 500 * 1.4 = 700 USD/ct.
// Total: 1.2 * 700 = 840.
const quoteUnheated = calculateQuote(stateUnheated);
console.log(`Test 2 (Unheated): Stone Total 840? Got ${quoteUnheated.stonesTotal}`);

console.log("--- END VERIFICATION 2 ---");
