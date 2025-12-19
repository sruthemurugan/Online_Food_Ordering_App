import React, { useState, useEffect } from 'react';
import { getFoodItems } from '../../services/foodItems';
import './FoodMenu.css';

const FoodMenu = ({ addToCart }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories] = useState([
        'All',
        'Indian',
        'Chinese',
        'Italian',
        'Starters',
        'Main Course',
        'Desserts',
        'Beverages'
    ]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadFoodItems();
    }, []);

    const loadFoodItems = async () => {
        try {
            const response = await getFoodItems();
            setFoodItems(response.data);
        } catch (err) {
            console.error('Failed to load food items:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = selectedCategory === 'All' 
        ? foodItems 
        : foodItems.filter(item => item.category === selectedCategory);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const handleAddToCart = (item) => {
        console.log('Adding to cart:', {
            id: item._id,
            name: item.name,
            price: item.price,
            category: item.category
        });
        
        addToCart(item);
        
    };

    if (loading) {
        return <div className="loading">Loading menu...</div>;
    }

    return (
        <div className="menu-container">
            <h1>Our Menu</h1>
            
            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="food-grid">
                {filteredItems.map(item => (
                    <div key={item._id} className="food-card">
                        <div className="food-image">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} />
                            ) : (
                                <div className="image-placeholder">
                                    {item.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="food-details">
                            <h3>{item.name}</h3>
                            <p className="food-description">{item.description}</p>
                            <div className="food-footer">
                                <span className="food-price">{formatPrice(item.price)}</span>
                                <button 
                                    className="add-to-cart-btn"
                                    onClick={() => handleAddToCart(item)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodMenu;