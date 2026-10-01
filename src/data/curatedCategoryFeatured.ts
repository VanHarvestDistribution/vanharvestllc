/**
 * Curated Featured Product IDs for the nine departments.
 *
 * Every ID below has a conservatively verified match in
 * yellowLabelProductImages.ts, so the public Featured Products cards use
 * Van Harvest's supplied yellow-label warehouse photos only.
 *
 * Supplies and Cleaning are deliberately empty: no verified yellow-label
 * product photo has been supplied for those departments yet. The category
 * page therefore omits the Featured Products section instead of substituting
 * a generic or mismatched image.
 */
export const curatedCategoryFeaturedIds: Record<string, string[]> = {
  meat: [
    '10104', // FRZ Pork Back Ribs
    '10229', // Pork Sparerib Tips
    '11042', // General Tso's Chicken
    '12023', // Australian Flank Steak
    '12110', // Beef Short Ribs
    '12129', // Beef Short Rib
    '12152', // Beef Tenderloin / Filet Mignon
    '12270', // Individually Packed Beef Bone
    '12271', // Beef Bone
    '12392', // Lean Beef Strips
  ],
  produce: [
    '20723', // Mexican Jalapeño
    '21162', // White Dragon Fruit
    '21165', // Avocado
    '21223', // Persian Cucumber
    '21311', // Fresh Pineapple
    '21636', // Vietnamese Durian
    '22017', // Taiwan Spinach
    '22040', // Gai Choy
    '22057', // Taiwan Loofah
    '22149', // Fresh Lychee
    '22310', // Lotus Root Slice
  ],
  seafood: [
    '23045', // Gutted Tilapia
    '30026', // P&D IQF Shrimp
    '30530', // Head-on Shrimp
    '32008', // U-10 Scallops
    '33250', // Crawfish
    '33291', // Salmon Fish
    '33314', // Swai Fillet
    '33603', // Whole Boiled Clams
    '35021', // Baby Octopus
    '35508', // Chum Salmon Fillets
    '36101', // Black Tobikko
    '37106', // Shrimp Tempura
  ],
  pantry: [
    '40204', // Hua Tiao Cooking Wine
    '40534', // LKK Aromatic Vinegar
    '41002', // LKK Hoisin Sauce
    '42040', // Kum Chun Mushroom Soy Sauce
    '42200', // LKK Panda Oyster Sauce
    '43123', // LKK Chicken Bouillon
    '43221', // LKK Supreme Soy Sauce
    '44141', // Onion Powder
    '44521', // Panang Curry Paste
    '45004', // LKK Honey BBQ Sauce
    '45430', // Szechuan Pepper
    '45730', // Dried Goji Berries
  ],
  preserved: [
    '21277', // Salted Duck Egg Yolk
    '25025', // Traditional Fermented Beancurd
    '25102', // Preserved Mustard Stem
    '25427', // Salted Kelp Knot
    '54034', // FOCO Coconut Juice
    '55060', // Purple Skin Peanuts
  ],
  supplies: [],
  dry: [
    '70137', // Jasmine Rice
    '70315', // Sweet Rice
    '73220', // Selva Spaghetti
    '73275', // Rice Flakes
    '73310', // Acecook Beef Ramen
    '74039', // Twin Marquis Thin Noodles
    '74100', // Egg Roll Skin
    '74225', // HK Wonton Skin
    '74505', // HK Dumpling Wrapper
    '74619', // Wei Chuan Beef Don Rice Bowl
    '74690', // Fried Bean Curd Roll
  ],
  cleaning: [],
  prepared: [
    '25940', // Kangshifu Jasmine Long Jing Tea
    '25943', // Kangshifu Green Tea
    '91027', // Cantaloupe Toast
    '91028', // Watermelon Toast
    '91040', // Milk Toast (Quinoa)
    '92621', // Garlic Toast
    '92641', // JNK Mini Soupy Bun
    '92653', // JNK Shrimp Dumpling
    '92655', // Durian Snowy Rice Dumpling
    '92842', // JNK Crab Meat Soupy Bun
    '99700', // JNK Osmanthus Cake
  ],
};
