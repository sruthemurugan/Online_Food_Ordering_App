const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true,
        enum: ['Indian', 'Chinese', 'Italian', 'Mexican', 'Continental', 'Fast Food', 'Desserts', 'Beverages']
    },
    deliveryTime: {
        type: String,
        required: true,
        default: '30-40 mins'
    },
    minimumOrder: {
        type: Number,
        required: true,
        default: 100
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 20
    },
    rating: {
        type: Number,
        default: 4.0,
        min: 0,
        max: 5
    },
    imageUrl: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pinCode: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);