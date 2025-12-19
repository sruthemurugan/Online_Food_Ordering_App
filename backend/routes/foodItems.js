const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');

router.get('/', async (req, res) => {
    try {
        const foodItems = await FoodItem.find({ isAvailable: true });
        res.json(foodItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        const foodItems = await FoodItem.find({ 
            category: req.params.category,
            isAvailable: true 
        });
        res.json(foodItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const foodItem = new FoodItem(req.body);
        await foodItem.save();
        res.status(201).json(foodItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;