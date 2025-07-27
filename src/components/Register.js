import React, { useState } from 'react';
import './Auth.css';

const Register = ({ onSwitchToLogin, onRegister }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Generate a 16-character number ID
    const generateUserId = () => {
        let id = '';
        for (let i = 0; i < 16; i++) {
            id += Math.floor(Math.random() * 10);
        }
        return id;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name) {
            newErrors.full_name = 'Full name is required';
        } else if (formData.full_name.length < 2) {
            newErrors.full_name = 'Full name must be at least 2 characters';
        }

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.phone_number) {
            newErrors.phone_number = 'Phone number is required';
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            // Make API call to backend
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    email: formData.email,
                    phone_number: formData.phone_number,
                    address: formData.address,
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Store token in localStorage
            localStorage.setItem('token', data.token);

            // Call the onRegister callback with user data
            onRegister(data.user);

        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ general: error.message || 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    {errors.general && <div className="error-message">{errors.general}</div>}

                    <div className="form-group">
                        <label htmlFor="full_name">Full Name</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={errors.full_name ? 'error' : ''}
                            placeholder="Enter your full name"
                        />
                        {errors.full_name && <span className="error-text">{errors.full_name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'error' : ''}
                            placeholder="Choose a username"
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className={errors.phone_number ? 'error' : ''}
                            placeholder="Enter your phone number"
                        />
                        {errors.phone_number && <span className="error-text">{errors.phone_number}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={errors.address ? 'error' : ''}
                            placeholder="Enter your address"
                            rows="3"
                        />
                        {errors.address && <span className="error-text">{errors.address}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="switch-auth">
                    Already have an account?{' '}
                    <button
                        type="button"
                        className="link-button"
                        onClick={onSwitchToLogin}
                    >
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
