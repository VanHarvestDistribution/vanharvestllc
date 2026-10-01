export const contact = {
  phoneDisplay: '(704) 392-8717',
  phoneHref: '+17043928717',
  officeEmail: 'vanharvestoffice2019@gmail.com',
  address: '5226 Terminal St, Charlotte, NC 28208',
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=5226+Terminal+St%2C+Charlotte%2C+NC+28208',
  mapsEmbedUrl: 'https://www.google.com/maps?q=5226+Terminal+St%2C+Charlotte%2C+NC+28208&output=embed'
};

export const categories = [
  { key: 'meat', prefix: '1', index: '01', name: 'Meat & Poultry', short: 'Fresh and frozen pork, beef, chicken, lamb and specialty cuts.', image: '/images/category-meat.webp', featuredIds: ['10104', '12023', '12110', '24324'] },
  { key: 'produce', prefix: '2', index: '02', name: 'Produce & Fruit', short: 'Fresh vegetables, mushrooms, specialty greens, tropical fruit and staples.', image: '/images/category-produce.webp', featuredIds: ['20000', '20100', '20410', '21389'] },
  { key: 'seafood', prefix: '3', index: '03', name: 'Seafood', short: 'Shrimp, fish, shellfish and frozen seafood for professional kitchens.', image: '/images/category-seafood.webp', featuredIds: ['30040', '32008', '33140', '33608'] },
  { key: 'pantry', prefix: '4', index: '04', name: 'Sauces & Seasonings', short: 'Cooking wines, sauces, spices, oils and flavor-building essentials.', image: '/images/category-pantry.webp', featuredIds: ['41130', '41012', '42200', '43225'] },
  { key: 'preserved', prefix: '5', index: '05', name: 'Canned & Preserved', short: 'Bamboo shoots, water chestnuts, mushrooms and shelf-stable ingredients.', image: '/images/category-preserved.webp', featuredIds: ['21277', '25025', '25102', '25427'] },
  { key: 'supplies', prefix: '6', index: '06', name: 'Restaurant Supplies', short: 'Foodservice film, foil, paper goods, disposables and operational supplies.', image: '/images/category-supplies.webp', featuredIds: ['60000', '60020', '60105', '60320'] },
  { key: 'dry', prefix: '7', index: '07', name: 'Rice, Noodles & Dry Goods', short: 'Rice, noodles, flours, grains and pantry foundations in wholesale formats.', image: '/images/category-dry.webp', featuredIds: ['73332', '74074', '74225', '74500'] },
  { key: 'cleaning', prefix: '8', index: '08', name: 'Cleaning & Janitorial', short: 'Commercial cleaning products, brushes, mops and maintenance essentials.', image: '/images/category-cleaning.webp', featuredIds: ['80001', '80004', '80100', '80115'] },
  { key: 'prepared', prefix: '9', index: '09', name: 'Frozen, Prepared & Snacks', short: 'Frozen dim sum, appetizers, drinks, bakery treats and ready-to-cook specialties.', image: '/images/category-prepared.webp', featuredIds: ['25521', '25943', '92641', '92842'] }
] as const;

export const heroImage = '/images/hero-warehouse.webp';
