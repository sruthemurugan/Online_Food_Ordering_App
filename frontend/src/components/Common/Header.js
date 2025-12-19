import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaUser, FaUtensils } from 'react-icons/fa';
import './Header.css';

const Header = ({ cartCount }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <FaUtensils />
                    <span>FoodEx</span>
                </Link>

                <nav className="nav">
                    <Link to="/restaurants">Restaurants</Link>
                    {user ? (
                        <>
                            <Link to="/orders">My Orders</Link>
                            <Link to="/cart" className="cart-link">
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                            </Link>
                            <div className="user-menu">
                                <FaUser />
                                <span>{user.name}</span>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="register-btn">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;