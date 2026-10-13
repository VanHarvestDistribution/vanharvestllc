/**
 * Featured Product IDs per department (shown on each category page).
 *
 * Each ID needs an image in src/data/productImages.ts (a studio image in
 * public/images/products/ai/ or a warehouse photo); IDs without one are skipped.
 * Supplies and Cleaning stay empty: no product imagery for those departments.
 */
export const curatedCategoryFeaturedIds: Record<string, string[]> = {
  meat: [
    '12152', // Beef Tenderloin EXCEL
    '12001', // Fresh Flank Steak EXCEL
    '12151', // Beef Strip Loin (Cargill)
    '12110', // Beef Short Ribs
    '24330', // Beef Brisket 5LB/PKG
    '24372', // Ox Tail 5LB /PKG (PACKAGE ONLY)
    '10099', // (JBS) ST Louis Ribs
    '24220', // Pork Bellies 5LB/Pkg
    '10050', // Pork Chop 10LB /PKG
    '11113', // Boneless Breast (Pilgrim's)
    '11360', // FRZ Jumbo Cut Wing
    '24403', // Boneless Lamb Leg (Thomas)
  ],
  produce: [
    '21165', // Avocado 48'
    '21320', // Large Tomato
    '20700', // Green Pepper
    '21399', // King Oyster Mushrooms 11LB
    '21604', // Lemon 5LB/Pkg
    '21603', // Peeled Garlic 5LB/PKG
    '21600', // Ginger-5LB
    '20410', // Yellow Jumbo Onion 50LB
    '22011', // Gai Lan
    '22002', // Shanghai Bok 2LB/Pkg
    '21311', // Fresh Pineapple
    '22109', // Coconut Young 9ct Easy Open
  ],
  seafood: [
    '30020', // 16-20 P&D IQF Shrimp 20 LB / CS
    '31021', // 21-25 Headless Shell-On Shrimp 40LB Ocean
    '30530', // 30-40 Head on Shrimp 4LB /PKG AQUA
    '32008', // Scallop U-10 IQF 6x5 LB BLUE GEM-ORANGE
    '33291', // Salmon Fish 13+ 30LB /CS
    '33306', // Swai Fillet (7-9 IQF) 15LB
    '33315', // (FRESH) Lobster
    '33208', // CANADA Frz Snow Crab 30LB
    '33510', // Half Shell Mussel (M) 24LB/CS GREEN OPEN OCEAN
    '33362', // (FRESH) Oyster In Shell 6 /PKG
    '35400', // Baby Octopus 24LB
    '36107', // SHOICHI Tuna Saku 22LB / CS AAA
  ],
  pantry: [
    '35150', // Tempura Batter 30LB
    '35300', // Roasted Cooked Sesame Seed 2.2 LB /PKG
    '45443', // Star Aniseed 16oz
    '45430', // Szechuan Pepper 16oz/ pkg
    '45427', // Dried Chili Pepper 5LB
    '45522', // Dried Black Mushrooms 5LB/Pkg
    '45730', // DRIED Goji Berres 227g /Pkg
    '44141', // Onion Powder 5LB
    '41663', // BROWN Rock Sugar (Lump) /PKG
    '21253', // Large Egg 30 Doz
    '43893', // Cream Cheese 1x30LB Block
    '45417', // Orange Peel ( SELECTED SLICES)
  ],
  preserved: [
    '25306', // Salted Duck Egg
    '25427', // Salted kelp Knot 11LB
    '55101', // Cashewnut 5LB/Pkg
    '55012', // Blanched Peanut (Kernel) 5LB/PKG
    '55300', // White Sesame Seed 5LB
    '53058', // Boiled Sweet Corn 3pc
    '50115', // Bamboo Shoot HAVLES 6 Can
    '52002', // Straw Mushroom 6Can (ANY BRAND)
    '54311', // Canned Longan in Syrup 24 Can/ CS
    '55550', // Dried Red Bean - 50LB / CS
    '55060', // Purple Skin Peanuts 2kg /PKG
    '25100', // Szchuan Preserved 12oz /PKG
  ],
  supplies: [],
  dry: [
    '72039', // Japanese Bread Crumb 20LB (B61638)
    '72025', // Royal Wagon Potato Starch 44LB
    '72096', // Cornstarch 50LB (Ingredion)
    '74312', // THIN Wonton Wrapper 24LB FWTDT24
    '74505', // HK style dumpling wrapper 16oz Twin
    '74006', // Dry Noodle - ATLANTA NOODLE
    '74012', // Small Popular Noodle (S) 20LB
    '73004', // Rice Stick Pkg
    '74690', // Fried Bean Curd Roll 180g /PKG ANYBRAND
    '74546', // Mi Trung Ga 1LBx40 Small
    '74548', // Banh Canh Pkg
    '71081', // Dried Fennel Powder 1LB
  ],
  cleaning: [],
  prepared: [
    '34064', // 5/16'' Thin Regular Cut Fries 30LB
    '34066', // 3/8" Straight Cut Seasoned Fries 27LB
    '34501', // Corn Nugget 6x2LB /CS
    '92670', // GK Veg Spring Roll 25G
    '36340', // Shrimp Shumai (Ajinomoto) 50PC/ PKG
    '92790', // Scallion Layered Pancake /PKG Little Alley
    '99551', // EA - 3.5" Egg Tart Crust (64PC)
    '35010', // Pink Sushi Ginger 20LB
    '35171', // Wakame Dried Seaweed 1lb /PKG
    '36100', // Sushi INARI Bean Curd 2.2LB /PKG
    '92641', // JNK (Pork) Mini Soupy Bun 10x1.1lb /CS (warehouse photo)
    '92653', // JNK Shrimp Dumpling 16LB 4LBX4BAG (warehouse photo)
  ],
};
