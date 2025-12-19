import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantList.css';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (selectedCuisine === 'All') {
            setFilteredRestaurants(restaurants);
        } else {
            setFilteredRestaurants(
                restaurants.filter(r => r.cuisine === selectedCuisine)
            );
        }
    }, [selectedCuisine, restaurants]);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/restaurants');
            const data = await response.json();
            
            if (data.success) {
                setRestaurants(data.restaurants);
                setFilteredRestaurants(data.restaurants);
            }
        } catch (err) {
            console.error('Failed to load restaurants:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/restaurant/${restaurantId}/menu`);
    };

    const cuisines = ['All', 'Indian', 'Chinese', 'Italian', 'Fast Food', 'Desserts'];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    if (loading) {
        return <div className="loading">Loading restaurants...</div>;
    }

    return (
        <div className="restaurants-container">
            <div className="restaurants-header">
                <h1>Restaurants Near You</h1>
                <p>Choose from the best restaurants in your area</p>
            </div>

            <div className="cuisine-filter">
                {cuisines.map(cuisine => (
                    <button
                        key={cuisine}
                        className={`cuisine-btn ${selectedCuisine === cuisine ? 'active' : ''}`}
                        onClick={() => setSelectedCuisine(cuisine)}
                    >
                        {cuisine}
                    </button>
                ))}
            </div>

            <div className="restaurants-grid">
                {filteredRestaurants.map(restaurant => (
                    <div 
                        key={restaurant._id} 
                        className="restaurant-card"
                        onClick={() => handleRestaurantClick(restaurant._id)}
                    >
                        <div className="restaurant-image">
                            <img src={restaurant.imageUrl} alt={restaurant.name} />
                            <div className="restaurant-rating">
                                <i class="fa-solid fa-star"></i> {restaurant.rating}
                            </div>
                        </div>
                        
                        <div className="restaurant-details">
                            <h3>{restaurant.name}</h3>
                            <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                            <p className="restaurant-description">{restaurant.description}</p>
                            
                            <div className="restaurant-info">
                                <div className="info-item">
                                    <span className="info-icon"><i class="fa-solid fa-stopwatch"></i></span>
                                    <span>{restaurant.deliveryTime}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon"><i class="fa-solid fa-indian-rupee-sign"></i></span>
                                    <span>Min: {formatPrice(restaurant.minimumOrder)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon"><i class="fa-solid fa-motorcycle"></i></span>
                                    <span>Delivery: {formatPrice(restaurant.deliveryFee)}</span>
                                </div>
                            </div>
                            
                            <button className="view-menu-btn">
                                View Menu 
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredRestaurants.length === 0 && (
                <div className="no-restaurants">
                    <h3>No restaurants found</h3>
                    <p>Try selecting a different cuisine</p>
                </div>
            )}
        </div>
    );
};

export default RestaurantList;