const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    console.log('Order creation request received');
    console.log('User ID:', req.userId);
    console.log('Order data:', req.body);
    
    try {
        const { items, deliveryAddress, paymentMethod } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }
        
        if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || 
            !deliveryAddress.state || !deliveryAddress.pinCode) {
            return res.status(400).json({
                success: false,
                message: 'Please provide complete delivery address'
            });
        }
        
        let totalAmount = 0;
        const validatedItems = [];
        let restaurantId = null;
        
        for (const item of items) {
            if (!item.foodItem || !item.quantity || !item.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid item format'
                });
            }
            
            const foodItem = await FoodItem.findById(item.foodItem);
            if (!foodItem) {
                return res.status(404).json({
                    success: false,
                    message: `Food item not found: ${item.foodItem}`
                });
            }

            if (!restaurantId) {
                restaurantId = foodItem.restaurant;
            }
            
            totalAmount += item.price * item.quantity;
            
            validatedItems.push({
                foodItem: item.foodItem,
                quantity: item.quantity,
                price: item.price
            });
        }
        
        const order = new Order({
            user: req.userId, 
            restaurant: restaurantId,
            items: validatedItems,
            totalAmount: totalAmount,
            deliveryAddress: {
                street: deliveryAddress.street.trim(),
                city: deliveryAddress.city.trim(),
                state: deliveryAddress.state.trim(),
                pinCode: deliveryAddress.pinCode.trim()
            },
            paymentMethod: paymentMethod || 'Cash on Delivery'
        });
        
        const savedOrder = await order.save();
        
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('items.foodItem', 'name price imageUrl')
            .populate('restaurant', 'name address contact')
            .exec();
        
        console.log('Order created successfully:', savedOrder._id);
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order: populatedOrder
        });
        
    } catch (error) {
        console.error('Order creation error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
});

router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate('items.foodItem', 'name price imageUrl category')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: orders.length,
            orders: orders
        });
        
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.foodItem', 'name price imageUrl category')
            .populate('user', 'name email phone');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        if (order.user._id.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }
        
        res.json({
            success: true,
            order: order
        });
        
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
});

module.exports = router;