import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RestaurantMenu.css';

const RestaurantMenu = ({ addToCart }) => {
    const { restaurantId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    useEffect(() => {
        fetchRestaurantMenu();
    }, [restaurantId]);

    const fetchRestaurantMenu = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}/menu`);
            const data = await response.json();
            
            if (data.success) {
                setRestaurant(data.restaurant);
                setMenuItems(data.menu);
            }
        } catch (err) {
            console.error('Failed to load menu:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        if (!user) {
            alert('Please login to add items to cart!');
            navigate('/login');
            return;
        }
        
        addToCart({
            ...item,
            restaurant: restaurantId  
        });
        
        
    };

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];
    
    const filteredItems = selectedCategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    if (loading) {
        return <div className="loading">Loading menu...</div>;
    }

    if (!restaurant) {
        return <div className="error">Restaurant not found</div>;
    }

    return (
        <div className="restaurant-menu-container">
           
            <div className="restaurant-header">
                <div className="restaurant-info">
                    <h1>{restaurant.name}</h1>
                    <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                    <p className="restaurant-description">{restaurant.description}</p>
                    
                    <div className="restaurant-meta">
                        <span className="meta-item"><i class="fa-solid fa-star"></i> {restaurant.rating}</span>
                        <span className="meta-item"><i class="fa-solid fa-stopwatch"></i> {restaurant.deliveryTime}</span>
                        <span className="meta-item"><i class="fa-solid fa-motorcycle"></i> Delivery: {restaurant.deliveryFee}</span>
                        <span className="meta-item"> Min: {restaurant.minimumOrder}</span>
                    </div>
                </div>
                
                <div className="restaurant-image">
                    <img src={restaurant.imageUrl} alt={restaurant.name} />
                </div>
            </div>

           
            <div className="menu-categories">
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

            
            <div className="menu-items-grid">
                {filteredItems.map(item => (
                    <div key={item._id} className="menu-item-card">
                        <div className="menu-item-image">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} />
                            ) : (
                                <div className="image-placeholder">
                                    {item.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        
                        <div className="menu-item-details">
                            <h3>{item.name}</h3>
                            <p className="item-description">{item.description}</p>
                            <div className="item-footer">
                                <span className="item-price">{formatPrice(item.price)}</span>
                                <span className={`item-veg ${item.isVegetarian ? 'veg' : 'non-veg'}`}>
                                    {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                                </span>

                            </div>
                            
                            <button 
                                className="add-to-cart-btn"
                                onClick={() => handleAddToCart(item)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredItems.length === 0 && (
                <div className="no-items">
                    <h3>No items in this category</h3>
                    <p>Try selecting a different category</p>
                </div>
            )}
        </div>
    );
};

export default RestaurantMenu;