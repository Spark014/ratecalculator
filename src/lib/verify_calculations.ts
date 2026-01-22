
import { calculateQuote, getAdvancedGemPrice, getSmallStonePrice } from './calculations';
import { QuoteState, Stone, Metal, Labor, Pack } from './types';
import { CATALOG } from './catalog';

// Mock Data
const mockStone: Stone = {
    id: '1', roleIndex: 0, typeKey: 'sapphire',
    weightMode: 0, totalCt: '1.2', ctEach: '1.2', qty: '1', mm: '0',
    gradeIndex: 2, treatmentKey: 'heated', gemColor: 'Royal Blue', // AAA Royal Blue 1.2ct
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

console.log("--- START VERIFICATION ---");

// Test 1: Advanced Gem Price (Royal Blue AAA 1.2ct)
// Catalog: Royal Blue > AAA > 1-1.5ct = 500 USD/ct
// Treatment: heated = 0.9 mult
// Expected: 500 * 0.9 = 450 USD/ct
// Total: 1.2 * 450 = 540
const price = getAdvancedGemPrice(mockStone); // Should return base bracket price 500
console.log(`Test 1 (Gem Base): Expected 500, Got ${price}`);

const quote = calculateQuote(state);
// Stones Total: 540
// Metal Sub: 10 * 1.15 * 70 = 805
// Labor Sub: 45
// Total Cost: 540 + 805 + 45 = 1390
console.log(`Test 1 (Quote Total): Expected 1390.00, Got ${quote.costTotal}`);


// Test 2: Small Stone (Zircon)
const sideStone: Stone = {
    ...mockStone, id: '2', roleIndex: 1, typeKey: 'other',
    smallStoneType: 'zircon', qty: '100', // 100 pcs
    priceMode: 0
};
// Zircon price = 0.035/pc * 100 = 3.50
const smallPrice = getSmallStonePrice(sideStone);
console.log(`Test 2 (Zircon Base): Expected 0.035, Got ${smallPrice.pricePerUnit}`);

state.stones = [sideStone];
// Metal: 805
// Labor: 45
// Stones: 3.50
// Total: 853.50
const quote2 = calculateQuote(state);
console.log(`Test 2 (Quote Total w/ Zircon): Expected 853.50, Got ${quote2.costTotal}`);

console.log("--- END VERIFICATION ---");
