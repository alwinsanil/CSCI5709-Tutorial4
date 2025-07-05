import React, { useState, useEffect } from 'react';

function App() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLogin, setIsLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [products, setProducts] = useState([]);

    const validateForm = () => {
        const newErrors = {};
        if (isLogin) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        } else {
            if (!formData.fullName.trim()) newErrors.fullName = 'Fullname is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
            const phoneRegex = /^\d{10,15}$/;
            if (!formData.phone) newErrors.phone = 'Phone is required';
            else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Phone number must be 10 to 15 digits';
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
            else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const url = isLogin ? '/api/auth/login' : '/api/auth/register';
            const data = isLogin ? { email: formData.email, password: formData.password } : { fullName: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password };

            try {
                const response = await fetch(`https://b01025612-tutorial05.onrender.com${url}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (response.ok) {
                    setToken(result.token);
                    localStorage.setItem('token', result.token);
                    setFormData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
                    setErrors({});
                    fetchProducts();
                } else {
                    setErrors({ submit: result.message });
                }
            } catch (error) {
                setErrors({ submit: 'Server error' });
            }
        }
    };

    const fetchProducts = async () => {
        if (!token) return;
        try {
            const response = await fetch('https://b01025612-tutorial05.onrender.com/api/products', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (response.ok) setProducts(result.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        if (token) fetchProducts();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Fullname
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>
                    )}
                    {!isLogin && (
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                    )}
                    {!isLogin && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    {errors.submit && <p className="text-red-500 text-sm mt-1">{errors.submit}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="w-full bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 mt-2"
                    >
                        {isLogin ? 'Back to Sign Up' : 'Switch to Login'}
                    </button>
                </form>
                {token && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Products</h3>
                        <ul>
                            {products.map((product) => (
                                <li key={product.id} className="border-b py-2">{product.title}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;