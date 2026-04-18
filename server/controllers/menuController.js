const MenuItem = require('../models/MenuItem');

// @desc Get all menu items
// @route GET /api/menu
exports.getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({});
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a menu item
// @route POST /api/menu
exports.createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, isVeg, isAvailable } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            isVeg: isVeg === 'true' || isVeg === true,
            isAvailable: isAvailable === 'true' || isAvailable === true,
            image
        });

        const createdMenuItem = await menuItem.save();
        res.status(201).json(createdMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Update a menu item
// @route PUT /api/menu/:id
exports.updateMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, isVeg, isAvailable } = req.body;
        const menuItem = await MenuItem.findById(req.params.id);

        if (menuItem) {
            menuItem.name = name || menuItem.name;
            menuItem.description = description || menuItem.description;
            menuItem.price = price !== undefined ? price : menuItem.price;
            menuItem.category = category || menuItem.category;
            menuItem.isVeg = isVeg !== undefined ? (isVeg === 'true' || isVeg === true) : menuItem.isVeg;
            menuItem.isAvailable = isAvailable !== undefined ? (isAvailable === 'true' || isAvailable === true) : menuItem.isAvailable;
            
            if (req.file) {
                menuItem.image = `/uploads/${req.file.filename}`;
            }

            const updatedMenuItem = await menuItem.save();
            res.json(updatedMenuItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Delete a menu item
// @route DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (menuItem) {
            await menuItem.deleteOne();
            res.json({ message: 'Menu item removed' });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
