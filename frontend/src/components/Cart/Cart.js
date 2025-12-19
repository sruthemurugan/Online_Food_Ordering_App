import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orders';
import './Cart.css';

const Cart = ({ cartItems, removeFromCart, updateQuantity, clearCart }) => {
  
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        pinCode: '' 
    });
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    
    const navigate = useNavigate();

    useEffect(() => {
       
        if (cartItems.length > 0) {
            
            cartItems.forEach((item, index) => {
                console.log(`${index + 1}. ${item.name} - ₹${item.price} × ${item.quantity}`);
            });
        }
    }, [cartItems]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleAddressChange = (e) => {
        setDeliveryAddress({
            ...deliveryAddress,
            [e.target.name]: e.target.value
        });
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            setError('Your cart is empty');
            return;
        }

        const requiredFields = ['street', 'city', 'state', 'pinCode'];
        const missingFields = requiredFields.filter(field => !deliveryAddress[field] || !deliveryAddress[field].trim());
        
        if (missingFields.length > 0) {
            setError(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    foodItem: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                deliveryAddress: {
                    street: deliveryAddress.street.trim(),
                    city: deliveryAddress.city.trim(),
                    state: deliveryAddress.state.trim(),
                    pinCode: deliveryAddress.pinCode.trim()
                },
                paymentMethod: paymentMethod
            };

            console.log('Placing order with data:', orderData);
            
            const response = await createOrder(orderData);
            
            if (response.data.success) {
                clearCart();
                
                alert('Order placed successfully!');
                
                navigate('/orders');
            } else {
                setError(response.data.message || 'Failed to place order');
            }
            
        } catch (err) {
            console.error('Order error:', err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                setError(err.response.data.errors.join(', '));
            } else {
                setError('Failed to place order. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <div className="empty-cart">
                    <h2>🛒 Your Cart is Empty</h2>
                    <p>Add some delicious items from the menu!</p>
                    <button onClick={() => navigate('/menu')} className="browse-menu-btn">
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Your Cart ({cartItems.length} items)</h1>
            
            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item._id} className="cart-item">
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p className="cart-item-price">{formatPrice(item.price)} each</p>
                            </div>
                            <div className="cart-item-controls">
                                <div className="quantity-control">
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="item-total">
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    
                    <div className="summary-details">
                        {cartItems.map(item => (
                            <div key={item._id} className="summary-item">
                                <span>{item.name} × {item.quantity}</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        
                        <div className="summary-total">
                            <span>Total:</span>
                            <span>{formatPrice(getTotal())}</span>
                        </div>
                    </div>

                    <div className="delivery-address">
                        <h3>Delivery Address</h3>
                        <div className="address-form">
                            <input
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                value={deliveryAddress.street}
                                onChange={handleAddressChange}
                                required
                            />
                            <div className="address-row">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={deliveryAddress.city}
                                    onChange={handleAddressChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={deliveryAddress.state}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                name="pinCode"  
                                placeholder="PIN Code"
                                value={deliveryAddress.pinCode}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="payment-method">
                        <h3>Payment Method</h3>
                        <div className="payment-options">
                            <label>
                                <input
                                    type="radio"
                                    value="Cash on Delivery"
                                    checked={paymentMethod === 'Cash on Delivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                Cash on Delivery
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Online Payment"
                                    checked={paymentMethod === 'Online Payment'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                Online Payment
                            </label>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="cart-actions">
                        <button 
                            className="clear-cart-btn"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>
                        <button 
                            className="place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? 'Placing Order...' : `Place Order - ${formatPrice(getTotal())}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
   
};

export default Cart;