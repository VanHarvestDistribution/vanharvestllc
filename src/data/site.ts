export const contact = {
  phoneDisplay: '(704) 392-8717',
  phoneHref: '+17043928717',
  salesEmail: 'ordersvhd@gmail.com',
  officeEmail: 'vanharvestoffice2019@gmail.com',
  address: '5226 Terminal St, Charlotte, NC 28208',
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=5226+Terminal+St%2C+Charlotte%2C+NC+28208',
  mapsEmbedUrl: 'https://www.google.com/maps?q=5226+Terminal+St%2C+Charlotte%2C+NC+28208&output=embed'
};

export const categories = [
  { key: 'meat', prefix: '1', index: '01', name: 'Meat & Poultry', nameZh: '肉类禽类', short: 'Fresh and frozen pork, beef, chicken, lamb and specialty cuts.', shortZh: '新鲜及冷冻肉类、禽类与特色部位。', image: '/images/category-meat-v2.webp', featuredIds: ['10022', '10089', '10087', '10033', '10109', '11042', '11113', '11321', '11358', '12152', '12151', '12097'] },
  { key: 'produce', prefix: '2', index: '02', name: 'Produce & Fruit', nameZh: '蔬菜水果', short: 'Fresh vegetables, mushrooms, specialty greens, tropical fruit and staples.', shortZh: '新鲜蔬菜、水果、菇类与亚洲特色叶菜。', image: '/images/category-produce-v2.webp', featuredIds: ['22001', '22011', '22051', '22031', '21408', '21162', '21163', '21384', '22307', '21618', '22149', '22135'] },
  { key: 'seafood', prefix: '3', index: '03', name: 'Seafood', nameZh: '海鲜', short: 'Shrimp, fish, shellfish and frozen seafood for professional kitchens.', shortZh: '鲜虾、鱼类、贝类及冷冻海鲜，满足专业厨房采购需求。', image: '/images/category-seafood-v2.webp', featuredIds: ['36101', '36102', '36103', '36107', '36109', '36248', '36340', '37101', '37102', '37106', '37600', '37601'] },
  { key: 'pantry', prefix: '4', index: '04', name: 'Sauces & Seasonings', nameZh: '酱料调味', short: 'Cooking wines, sauces, spices, oils and flavor-building essentials.', shortZh: '酱料、香辛料、食用油与厨房基础调味。', image: '/images/category-pantry-v2.webp', featuredIds: ['41002', '41144', '42200', '42304', '43200', '41152', '41200', '41183', '43000', '43110', '45026', '41130'] },
  { key: 'preserved', prefix: '5', index: '05', name: 'Canned & Preserved', nameZh: '罐头腌制', short: 'Bamboo shoots, water chestnuts, mushrooms and shelf-stable ingredients.', shortZh: '笋类、马蹄、菇类及常温储存食材。', image: '/images/category-preserved-v2.webp', featuredIds: ['54011', '54031', '54038', '54037', '54101', '54102', '54371', '54358', '54365', '54463', '54464', '53095'] },
  { key: 'supplies', prefix: '6', index: '06', name: 'Restaurant Supplies', nameZh: '餐饮用品', short: 'Foodservice film, foil, paper goods, disposables and operational supplies.', shortZh: '保鲜膜、锡纸、纸品、一次性用品与餐厅运营耗材。', image: '/images/category-supplies-v2.webp', featuredIds: ['67408', '67421', '67422', '67424', '67425', '67426', '67014', '67015', '67016', '67402', '67403', '67201'] },
  { key: 'dry', prefix: '7', index: '07', name: 'Rice, Noodles & Dry Goods', nameZh: '米面干货', short: 'Rice, noodles, flours, grains and pantry foundations in wholesale formats.', shortZh: '米、面、粉类、谷物及厨房常备干货。', image: '/images/category-dry-v2.webp', featuredIds: ['74602', '74608', '74603', '74605', '74710', '74753', '74500', '74501', '74505', '74515', '74526', '74641'] },
  { key: 'cleaning', prefix: '8', index: '08', name: 'Cleaning & Janitorial', nameZh: '清洁用品', short: 'Commercial cleaning products, brushes, mops and maintenance essentials.', shortZh: '商用清洁剂、刷具、拖把及日常维护用品。', image: '/images/category-cleaning-v2.webp', featuredIds: ['80001', '80004', '80010', '80100', '80115', '80125', '80127', '81000', '81001', '81020', '85104', '85105'] },
  { key: 'prepared', prefix: '9', index: '09', name: 'Frozen, Prepared & Snacks', nameZh: '冷冻点心与零食', short: 'Frozen dim sum, appetizers, drinks, bakery treats and ready-to-cook specialties.', shortZh: '冷冻点心、小食、饮料、烘焙及方便烹饪食品。', image: '/images/category-prepared-v2.webp', featuredIds: ['74622', '74630', '74615', '74618', '74612', '74613', '74639', '92641', '92643', '92653', '92651', '92790'] }
] as const;

/** Homepage-only food imagery; distinct from the Products department card images. */
export const heroImages = [
  '/images/home/hero-fruit-still-life.webp',
  '/images/home/hero-beef-steaks.webp',
  '/images/home/hero-asian-produce.webp',
] as const;

export const heroImage = heroImages[0];

export const facilityImages = {
  warehouse: '/images/facilities/warehouse-facility.webp',
  coldStorage: '/images/facilities/cold-storage-facility.webp',
  distribution: '/images/facilities/distribution-facility.webp'
};
