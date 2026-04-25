require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const newMenuItems = [
  {
    name: "Paneer Tikka Masala",
    description: "Grilled paneer cubes cooked in a rich and creamy tomato gravy.",
    price: 240,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1599487405270-8e658e4e9b97?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Vegetable Biryani",
    description: "Aromatic basmati rice cooked with mixed vegetables and traditional spices, served with raita.",
    price: 210,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Aloo Gobi",
    description: "Classic dry dish made with potatoes, cauliflower, and Indian spices.",
    price: 150,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Butter Naan",
    description: "Soft and fluffy leavened bread brushed with generous amounts of butter.",
    price: 45,
    category: "Breads",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Rasgulla",
    description: "Soft and spongy milk dumplings soaked in light sugar syrup.",
    price: 50,
    category: "Desserts",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Fresh Lime Soda",
    description: "Refreshing cooler made with fresh lemon juice, soda, and sweet/salt flavor.",
    price: 60,
    category: "Drinks",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Masala Papad",
    description: "Crispy roasted papad topped with chopped onions, tomatoes, and tangy spices.",
    price: 35,
    category: "Starters",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1625938146369-adc83368bda7?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Jeera Rice",
    description: "Fragrant basmati rice tempered with cumin seeds and ghee.",
    price: 130,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Chole Bhature",
    description: "Spicy chickpea curry served with two deep-fried, fluffy breads.",
    price: 180,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1539755530862-00f6226178d6?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Palak Paneer",
    description: "Soft paneer cubes cooked in a smooth, mildly spiced spinach gravy.",
    price: 230,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600"
  }
];

const fallbackImages = {
  "Starters": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600",
  "Main Course": "https://images.unsplash.com/photo-1626779816240-fc866164d1f2?auto=format&fit=crop&q=80&w=600",
  "Breads": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600",
  "Desserts": "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=600",
  "Drinks": "https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?auto=format&fit=crop&q=80&w=600",
  "default": "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=600"
};

const updateMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Find items with missing images
    const itemsWithoutImages = await MenuItem.find({ $or: [{ image: null }, { image: "" }] });
    let updatedCount = 0;
    
    for (const item of itemsWithoutImages) {
      item.image = fallbackImages[item.category] || fallbackImages["default"];
      await item.save();
      updatedCount++;
    }
    console.log(`Updated ${updatedCount} items with missing images.`);

    // Insert new items
    await MenuItem.insertMany(newMenuItems);
    console.log(`Successfully added ${newMenuItems.length} new menu items!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating menu:', error);
    process.exit(1);
  }
};

updateMenu();
