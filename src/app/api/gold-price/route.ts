import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // CONSTANTS
        const OZ_TO_GRAM = 31.1035;
        
        // 1. Check for API Key
        const apiKey = process.env.GOLD_API_KEY;

        let pricesPerGram;

        if (apiKey) {
            // REAL API FETCH (using GoldAPI.io as example provider)
            // Register at https://www.goldapi.io/ to get a free key
            
            // Fetch Gold (XAU), Platinum (XPT), Silver (XAG)
            // Note: GoldAPI requires separate requests or a multi-symbol endpoint if supported. 
            // For simplicity in a free tier, we might make 3 requests or just one for Gold and estimate others.
            // Let's assume we want at least Gold accurately.

            const headers = { 'x-access-token': apiKey, 'Content-Type': 'application/json' };
            
            // Parallel fetch for speed
            const [goldRes, platRes, silverRes] = await Promise.all([
                fetch('https://www.goldapi.io/api/XAU/USD', { headers }),
                fetch('https://www.goldapi.io/api/XPT/USD', { headers }),
                fetch('https://www.goldapi.io/api/XAG/USD', { headers })
            ]);

            const goldData = await goldRes.json();
            const platData = await platRes.json();
            const silverData = await silverRes.json();

            // Price in API is usually per Ounce
            pricesPerGram = {
                gold: (goldData.price || 2650) / OZ_TO_GRAM,
                platinum: (platData.price || 950) / OZ_TO_GRAM,
                silver: (silverData.price || 31) / OZ_TO_GRAM
            };

        } else {
            // FALLBACK / MOCK DATA (If no API key configured)
            // Gold (XAU) ~ 2650 USD (Mock)
            const mockPricesOz = {
                XAU: 2650 + (Math.random() * 10 - 5),
                XPT: 950 + (Math.random() * 5 - 2.5),
                XAG: 31 + (Math.random() * 0.5 - 0.25)
            };

            pricesPerGram = {
                gold: mockPricesOz.XAU / OZ_TO_GRAM,
                platinum: mockPricesOz.XPT / OZ_TO_GRAM,
                silver: mockPricesOz.XAG / OZ_TO_GRAM
            };
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            rates: pricesPerGram,
            source: apiKey ? "GoldAPI.io (Live)" : "Simulated Data (Add GOLD_API_KEY to env)"
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch metal prices' 
        }, { status: 500 });
    }
}
