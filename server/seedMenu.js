require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const menuItems = [
  {
    name: "Classic Paneer Tikka",
    description: "Succulent paneer cubes marinated in spices and grilled to perfection in a tandoor.",
    price: 280,
    category: "Starters",
    isVeg: true,
    isAvailable: true,
    image: ""
  },
  {
    name: "Butter Chicken",
    description: "Tender chicken pieces cooked in a rich, creamy tomato-based gravy with a touch of butter.",
    price: 350,
    category: "Main Course",
    isVeg: false,
    isAvailable: true,
    image: ""
  },
  {
    name: "Dal Makhani",
    description: "Black lentils and kidney beans slow-cooked overnight with cream and butter.",
    price: 240,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: ""
  },
  {
    name: "Garlic Naan",
    description: "Soft leavened bread topped with garlic and coriander, baked in a clay oven.",
    price: 60,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: ""
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream.",
    price: 180,
    category: "Desserts",
    isVeg: true,
    isAvailable: true,
    image: ""
  },
  {
    name: "Mango Lassi",
    description: "Refreshing yogurt-based drink blended with sweet mango pulp.",
    price: 120,
    category: "Drinks",
    isVeg: true,
    isAvailable: true,
    image: ""
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
