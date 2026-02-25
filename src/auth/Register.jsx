import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, ShieldCheck } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import useStore from '../store/useStore';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const registerUser = useStore((state) => state.registerUser);

    const queryParams = new URLSearchParams(location.search);
    const queryRole = queryParams.get('role');
    const defaultRole = queryRole || 'borrower';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: defaultRole
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error on change
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const { name, email, phone, password, role } = formData;

        const result = registerUser({
            name,
            email,
            phone,
            password,
            role
        });

        if (!result.success) {
            alert(result.error);
            return;
        }

        alert("Registration successful");
        navigate("/login");
    };

    return (
        <div className="public-page-wrapper">
            <Navbar />
            <div className="login-page-center">
                <div className="card login-card">
                    <div className="text-center">
                        <div className="login-icon-wrap">
                            <ShieldCheck className="text-primary" size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-center mb-4">
                            Create a new account
                        </h2>
                        <p className="text-sm text-secondary text-center">
                            Already have an account? <Link to="/login" className="login-register-link">Sign in</Link>
                        </p>
                    </div>
                    <form onSubmit={handleRegister} className="login-form">
                        <div className="login-input-group">
                            <div className="login-input-wrap">
                                <User size={20} className="login-input-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`input login-input-with-icon login-input-top ${errors.name ? 'input--error' : ''}`}
                                    placeholder="Full Name"
                                    aria-label="Full Name"
                                    aria-invalid={!!errors.name}
                                />
                            </div>
                            {errors.name && <p className="field-error">{errors.name}</p>}

                            <div className="login-input-wrap">
                                <Mail size={20} className="login-input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`input login-input-with-icon login-input-mid ${errors.email ? 'input--error' : ''}`}
                                    placeholder="Email address"
                                    aria-label="Email address"
                                    aria-invalid={!!errors.email}
                                />
                            </div>
                            {errors.email && <p className="field-error">{errors.email}</p>}

                            <div className="login-input-wrap">
                                <Phone size={20} className="login-input-icon" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className={`input login-input-with-icon login-input-mid ${errors.phone ? 'input--error' : ''}`}
                                    placeholder="Phone Number"
                                    aria-label="Phone Number"
                                    aria-invalid={!!errors.phone}
                                />
                            </div>
                            {errors.phone && <p className="field-error">{errors.phone}</p>}

                            <div className="login-input-wrap">
                                <Lock size={20} className="login-input-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={`input login-input-with-icon login-input-bottom ${errors.password ? 'input--error' : ''}`}
                                    placeholder="Password (min 6 characters)"
                                    aria-label="Password"
                                    aria-invalid={!!errors.password}
                                />
                            </div>
                            {errors.password && <p className="field-error">{errors.password}</p>}
                        </div>

                        {!queryRole && (
                            <div>
                                <label className="form-label">I want to apply as:</label>
                                <div className="flex gap-4">
                                    {['borrower', 'lender', 'analyst'].map((r) => (
                                        <label key={r} className="flex items-center register-radio-label">
                                            <input
                                                type="radio"
                                                name="role"
                                                value={r}
                                                checked={formData.role === r}
                                                onChange={handleChange}
                                                className="register-radio"
                                            />
                                            <span className="register-radio-text">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary login-submit-btn"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
