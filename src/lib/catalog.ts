export const CATALOG = {
    currencyList: ["LKR", "USD", "CNY", "HKD", "EUR"],
    stoneRoles: ["Main Stone", "Side Stone"],
    // priceMode: 0 auto, 1 manual
    priceModes: ["Auto Price", "Manual Price"],
    // weightMode: 0 total ct, 1 each*qty, 2 mm*qty estimate (round melee)
    weightModes: ["Total Weight (ct)", "Weight Each × Qty (ct)", "Diameter(mm) × Qty (Est. ct)"],

    // NEW: Pricing Constants (in USD)
    LABOR_RATES: {
        simple: 21,
        middle: 33,
        complicated: 45,
        superComplicated: 70
    },

    METAL_RATES: {
        gold: {
            "9k": { wastage: 0.23, purity: 0.375 },
            "14k": { wastage: 0.17, purity: 0.585 },
            "18k": { wastage: 0.15, purity: 0.750 },
            "24k": { wastage: 0.10, purity: 0.999 }
        },
        platinum: {
            "p950": { wastage: 0.30, purity: 0.950 },
            "p900": { wastage: 0.30, purity: 0.900 }
        },
        silver: {
            "s925": { wastage: 0.0, purity: 0.925 }
        }
    },

    // Small stone prices (USD)
    // Diamond: per carat
    // Zircon/Moissanite: per piece
    SMALL_STONE: {
        diamond: {
            standard: {
                "SI": 600, // per ct
                "VS": 800  // per ct
            },
            singleCut: 300 // per ct
        },
        zircon: 0.035, // USD per piece (0.03-0.04 avg)
        moissanite: {
            "wax_set": 0.55, // USD per piece (0.4-0.7 avg)
            "hand_set": 1.05 // USD per piece (0.6-1.5 avg)
        }
    },

    // Treatment multiplier (typical industry handling; adjust to your business rules)
    treatments: [
        { key: "natural_unknown", name: "Natural (Default)", mult: 1.00 },
        { key: "heated", name: "Heated", mult: 0.90 },
        { key: "unheated", name: "Unheated", mult: 1.25 },
        { key: "oiled", name: "Oiled", mult: 0.85 },
        { key: "diffusion", name: "Diffusion", mult: 0.60 },
        { key: "glass_filled", name: "Glass Filled", mult: 0.45 },
        { key: "fracture_filled", name: "Fracture Filled", mult: 0.55 }
    ],
    // Colored gems base price per ct by grade (SAMPLE)
    coloredGems: [
        {
            key: "sapphire", name: "Sapphire",
            // New logic will rely on specific color matching dynamically more than this static list, 
            // but keeping this for fallback.
            grades: [
                { grade: "Commercial", p: 120 }, { grade: "AA", p: 260 }, { grade: "AAA", p: 520 }, { grade: "Premium", p: 1200 }
            ]
        },
        {
            key: "ruby", name: "Ruby", grades: [
                { grade: "Commercial", p: 180 }, { grade: "AA", p: 420 }, { grade: "AAA", p: 900 }, { grade: "Premium", p: 2200 }
            ]
        },
        {
            key: "emerald", name: "Emerald", grades: [
                { grade: "Commercial", p: 160 }, { grade: "AA", p: 380 }, { grade: "AAA", p: 850 }, { grade: "Premium", p: 2000 }
            ]
        },
        {
            key: "spinel", name: "Spinel", grades: [
                { grade: "Commercial", p: 90 }, { grade: "AA", p: 220 }, { grade: "AAA", p: 480 }, { grade: "Premium", p: 900 }
            ]
        },
        {
            key: "tourmaline", name: "Tourmaline", grades: [
                { grade: "Commercial", p: 60 }, { grade: "AA", p: 140 }, { grade: "AAA", p: 320 }, { grade: "Premium", p: 800 }
            ]
        }
    ],

    // NEW: Advanced Main Stone Pricing (Royal Blue etc)
    // Structure: [ColorName][Grade][SizeBracket] -> USD/ct
    ADVANCED_GEMS: {
        "Royal Blue": {
            "AAA": { // Best Quality
                "<1": 380,
                "1-1.5": 500,
                "1.5-2": 700,
                "2-3": 1400
            },
            "AA": { // Front Full Clean
                "<1": 220,
                "1-1.5": 450,
                "1.5-2": 500,
                "2-3": 1100
            },
            "A": { // Little Impurity
                "<1": 150,
                "1-1.5": 380,
                "1.5-2": 450,
                "2-3": 900
            }
        },
        "Cornflower Blue": {
            "AAA": {
                "<1": 200,
                "1-1.5": 350,
                "1.5-2": 500,
                "2-3": 1100
            },
            "AA": {
                "<1": 150,
                "1-1.5": 300,
                "1.5-2": 430,
                "2-3": 900
            },
            "A": {
                "<1": 100,
                "1-1.5": 200,
                "1.5-2": 300,
                "2-3": 600
            }
        },
        "Pigeon Blood": { // Ruby
            "AAA": {
                "<1": 1500,
                "1-1.5": 2500,
                "1.5-2": 4000,
                "2-3": 8000
            },
            "AA": {
                "<1": 800,
                "1-1.5": 1500,
                "1.5-2": 2500,
                "2-3": 5000
            },
            "A": {
                "<1": 400,
                "1-1.5": 800,
                "1.5-2": 1200,
                "2-3": 2500
            }
        },
        "Vivid Green": { // Emerald
            "AAA": {
                "<1": 1200,
                "1-1.5": 2000,
                "1.5-2": 3500,
                "2-3": 6000
            },
            "AA": {
                "<1": 700,
                "1-1.5": 1200,
                "1.5-2": 2000,
                "2-3": 4000
            },
            "A": {
                "<1": 300,
                "1-1.5": 600,
                "1.5-2": 1000,
                "2-3": 2000
            }
        }
    },

    // Diamond price: simplified, by carat bracket + color group + clarity group (SAMPLE, per ct)
    // You should replace with your own market/wholesale pricing rules.
    diamond: {
        name: "Diamond",
        caratBrackets: [
            { key: "0.30-0.49", min: 0.30, max: 0.49 },
            { key: "0.50-0.69", min: 0.50, max: 0.69 },
            { key: "0.70-0.99", min: 0.70, max: 0.99 },
            { key: "1.00-1.49", min: 1.00, max: 1.49 },
            { key: "1.50-1.99", min: 1.50, max: 1.99 },
            { key: "2.00+", min: 2.00, max: 99 }
        ],
        colors: ["D-F", "G-H", "I-J", "K-M"],
        clarities: ["IF/VVS", "VS", "SI", "I"],
        cuts: [
            { name: "Excellent", mult: 1.08 },
            { name: "Very Good", mult: 1.03 },
            { name: "Good", mult: 1.00 },
            { name: "Fair", mult: 0.92 }
        ],
        fluorescence: [
            { name: "None", mult: 1.00 },
            { name: "Faint", mult: 0.99 },
            { name: "Medium", mult: 0.96 },
            { name: "Strong", mult: 0.92 }
        ],
        // base[bracket][color][clarity] => price/ct
        base: {
            "0.30-0.49": {
                "D-F": { "IF/VVS": 3500, "VS": 2400, "SI": 1500, "I": 900 },
                "G-H": { "IF/VVS": 3000, "VS": 2100, "SI": 1350, "I": 820 },
                "I-J": { "IF/VVS": 2550, "VS": 1800, "SI": 1180, "I": 720 },
                "K-M": { "IF/VVS": 2000, "VS": 1450, "SI": 980, "I": 600 }
            },
            "0.50-0.69": {
                "D-F": { "IF/VVS": 5200, "VS": 3600, "SI": 2200, "I": 1300 },
                "G-H": { "IF/VVS": 4500, "VS": 3200, "SI": 2050, "I": 1200 },
                "I-J": { "IF/VVS": 3900, "VS": 2800, "SI": 1900, "I": 1100 },
                "K-M": { "IF/VVS": 3200, "VS": 2350, "SI": 1650, "I": 980 }
            },
            "0.70-0.99": {
                "D-F": { "IF/VVS": 6500, "VS": 4800, "SI": 3000, "I": 1800 },
                "G-H": { "IF/VVS": 5900, "VS": 4300, "SI": 2800, "I": 1650 },
                "I-J": { "IF/VVS": 5300, "VS": 3900, "SI": 2600, "I": 1550 },
                "K-M": { "IF/VVS": 4300, "VS": 3200, "SI": 2200, "I": 1350 }
            },
            "1.00-1.49": {
                "D-F": { "IF/VVS": 8800, "VS": 6500, "SI": 4200, "I": 2600 },
                "G-H": { "IF/VVS": 8000, "VS": 6000, "SI": 3900, "I": 2400 },
                "I-J": { "IF/VVS": 7200, "VS": 5400, "SI": 3600, "I": 2250 },
                "K-M": { "IF/VVS": 5900, "VS": 4500, "SI": 3100, "I": 2000 }
            },
            "1.50-1.99": {
                "D-F": { "IF/VVS": 11500, "VS": 8600, "SI": 5700, "I": 3600 },
                "G-H": { "IF/VVS": 10600, "VS": 8000, "SI": 5300, "I": 3300 },
                "I-J": { "IF/VVS": 9800, "VS": 7400, "SI": 5000, "I": 3100 },
                "K-M": { "IF/VVS": 8200, "VS": 6300, "SI": 4300, "I": 2800 }
            },
            "2.00+": {
                "D-F": { "IF/VVS": 15000, "VS": 11200, "SI": 7600, "I": 5000 },
                "G-H": { "IF/VVS": 14000, "VS": 10500, "SI": 7200, "I": 4700 },
                "I-J": { "IF/VVS": 13000, "VS": 9800, "SI": 6800, "I": 4500 },
                "K-M": { "IF/VVS": 11000, "VS": 8500, "SI": 6000, "I": 4100 }
            }
        }
    },
    metals: [
        { key: "18k", name: "18K Gold", defaultPpg: 70 },
        { key: "14k", name: "14K Gold", defaultPpg: 55 },
        { key: "pt950", name: "PT950", defaultPpg: 95 },
        { key: "s925", name: "S925 Silver", defaultPpg: 1.2 }
    ],
    // Melee size(mm) => ct each (round brilliant approx). Used for quick estimation.
    // Source: common trade approximation. Adjust as needed.
    meleeMmToCt: [
        [0.8, 0.003], [0.9, 0.004], [1.0, 0.005], [1.1, 0.006], [1.2, 0.008], [1.3, 0.010],
        [1.4, 0.012], [1.5, 0.015], [1.6, 0.018], [1.7, 0.022], [1.8, 0.025], [1.9, 0.030],
        [2.0, 0.035], [2.1, 0.040], [2.2, 0.045], [2.3, 0.050], [2.4, 0.060], [2.5, 0.070],
        [2.6, 0.080], [2.7, 0.090], [2.8, 0.100], [2.9, 0.110], [3.0, 0.120], [3.2, 0.140],
        [3.4, 0.160], [3.6, 0.180], [3.8, 0.200], [4.0, 0.250], [4.5, 0.350], [5.0, 0.500]
    ]
} as const;
