require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const menuItems = [
  {
    name: "Masala Dosa",
    description: "Crispy rice and lentil crepe stuffed with a spiced potato filling, served with sambar and chutneys.",
    price: 120,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Punjabi Samosa",
    description: "Flaky pastry filled with a spiced mixture of potatoes and peas, served with tamarind chutney.",
    price: 40,
    category: "Starters",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Maharaja Thali",
    description: "A grand platter featuring dal, paneer sabzi, seasonal vegetable, rice, roti, papad, and sweet.",
    price: 250,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1626779816240-fc866164d1f2?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Kadai Paneer",
    description: "Cottage cheese cooked in a spicy tomato-based gravy with bell peppers and fresh ground spices.",
    price: 220,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Dal Tadka",
    description: "Yellow lentils tempered with ghee, cumin, garlic, and dry red chilies.",
    price: 160,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Tandoori Roti",
    description: "Traditional whole wheat flatbread baked in a clay oven.",
    price: 25,
    category: "Breads",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Gulab Jamun",
    description: "Deep-fried milk dumplings soaked in cardamom-flavored sugar syrup.",
    price: 60,
    category: "Desserts",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Masala Chai",
    description: "Classic Indian tea brewed with milk and aromatic spices like cardamom and ginger.",
    price: 30,
    category: "Drinks",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Sweet Lassi",
    description: "Thick and creamy yogurt-based drink, sweetened and flavored with rose water.",
    price: 70,
    category: "Drinks",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1625902194916-f3316cc6de86?auto=format&fit=crop&q=80&w=600"
  }
];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for menu seeding...');

    // Clear existing menu items if any
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items.');

    await MenuItem.insertMany(menuItems);
    console.log('Successfully added sample menu items!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding menu:', error);
    process.exit(1);
  }
};

seedMenu();
