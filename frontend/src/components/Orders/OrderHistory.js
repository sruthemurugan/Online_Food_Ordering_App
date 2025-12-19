import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../../services/orders';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            console.log('Loading orders...');
            const response = await getMyOrders();
            console.log('Orders API response:', response);
            console.log('Response data:', response.data);
            
            let ordersData = [];
            
            if (response.data && Array.isArray(response.data)) {
                ordersData = response.data;
            } else if (response.data && response.data.orders && Array.isArray(response.data.orders)) {
                ordersData = response.data.orders;
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                ordersData = response.data.data;
            }
            
            console.log('Processed orders data:', ordersData);
            setOrders(ordersData);
            
        } catch (err) {
            console.error('Failed to load orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': '#f6ad55',
            'Confirmed': '#4299e1',
            'Preparing': '#38b2ac',
            'Out for Delivery': '#9f7aea',
            'Delivered': '#48bb78',
            'Cancelled': '#f56565'
        };
        return colors[status] || '#718096';
    };

    if (loading) {
        return (
            <div className="order-history">
                <div className="loading">Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-history">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="order-history">
                <div className="no-orders">
                    <h2>📭 No Orders Yet</h2>
                    <p>Place your first order from our menu!</p>
                    <button 
                        onClick={() => window.location.href = '/menu'}
                        className="browse-menu-btn"
                        style={{
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            marginTop: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-history">
            <h1>Your Orders ({orders.length})</h1>
            
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order._id || order.id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h3>Order #{order._id ? order._id.slice(-6) : 'N/A'}</h3>
                                <p className="order-date">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="order-status">
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {order.status || 'Pending'}
                                </span>
                                <span className="order-total">
                                    {formatPrice(order.totalAmount || 0)}
                                </span>
                            </div>
                        </div>

                        <div className="order-items">
                            <h4>Items:</h4>
                            {order.items && Array.isArray(order.items) ? (
                                order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span className="item-name">
                                            {item.foodItem?.name || 'Item'} × {item.quantity || 1}
                                        </span>
                                        <span className="item-price">
                                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No items found</p>
                            )}
                        </div>

                        <div className="order-footer">
                            <div className="order-details">
                                {order.deliveryAddress && (
                                    <p>
                                        <strong>Delivery Address:</strong> 
                                        {order.deliveryAddress.street}, {order.deliveryAddress.city}, 
                                        {order.deliveryAddress.state} - {order.deliveryAddress.pinCode || order.deliveryAddress.zipCode}
                                    </p>
                                )}
                                <p>
                                    <strong>Payment:</strong> {order.paymentMethod || 'Cash on Delivery'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;