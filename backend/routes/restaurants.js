const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true })
            .sort({ rating: -1 });
        
        res.json({
            success: true,
            count: restaurants.length,
            restaurants: restaurants
        });
    } catch (error) {
        console.error('Get restaurants error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch restaurants'
        });
    }
});

router.get('/:id/menu', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        
        if (!restaurant || !restaurant.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        
        const menuItems = await FoodItem.find({ 
            restaurant: req.params.id,
            isAvailable: true 
        }).sort({ category: 1 });
        
        res.json({
            success: true,
            restaurant: restaurant,
            menu: menuItems
        });
    } catch (error) {
        console.error('Get restaurant menu error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch restaurant menu'
        });
    }
});

module.exports = router;