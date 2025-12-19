import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Common/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import FoodMenu from './components/Menu/FoodMenu';
import Cart from './components/Cart/Cart';
import OrderHistory from './components/Orders/OrderHistory';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import './App.css';
import RestaurantList from './components/Restaurants/RestaurantList';
import RestaurantMenu from './components/Restaurants/RestaurantMenu';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    
    return user ? children : <Navigate to="/login" />;
};

function AppContent() {
    const { user } = useAuth();
    const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount } = useCart();

    return (
        <>
            <Header cartCount={getCartCount()} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<RestaurantList />} />
                    <Route path="/restaurants" element={<RestaurantList />} />
                    <Route 
                        path="/restaurant/:restaurantId/menu" 
                        element={
                            <RestaurantMenu addToCart={addToCart} />
                        } 
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/cart" 
                        element={
                            <PrivateRoute>
                                <Cart 
                                    cartItems={cartItems}
                                    removeFromCart={removeFromCart}
                                    updateQuantity={updateQuantity}
                                    clearCart={clearCart}
                                />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/orders" 
                        element={
                            <PrivateRoute>
                                <OrderHistory />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="/" element={<Navigate to={user ? "/menu" : "/login"} />} />
                </Routes>
            </main>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;