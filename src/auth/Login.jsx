import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import useStore from '../store/useStore';

const Login = () => {
    const loginUser = useStore((state) => state.loginUser);

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const queryRole = queryParams.get('role');
    const defaultRole = queryRole || 'borrower';

    const [role, setRole] = useState(defaultRole);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (role === 'admin') {
            setEmail('admin@loanledger.com');
            setPassword('1234567890');
        }
    }, [role]);

    const handleLogin = (e) => {
        e.preventDefault();

        const result = loginUser(email, password);

        if (!result.success) {
            alert(result.error);
            return;
        }

        navigate(`/${result.role}/dashboard`);
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
                            Welcome to LoanLedger
                        </h2>
                        <p className="text-sm text-secondary text-center">
                            You are at the right place for your financial needs. <br />
                            <Link to={`/register?role=${role}`} className="login-register-link">Don't have an account? Register here</Link>
                        </p>
                    </div>
                    <form className="login-form" onSubmit={handleLogin}>
                        {/* Role Selection */}
                        {!queryRole && (
                            <div>
                                <label className="form-label">Select Sandbox Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="input"
                                >
                                    <option value="borrower">Borrower</option>
                                    <option value="lender">Lender</option>
                                    <option value="analyst">Financial Analyst</option>
                                </select>
                            </div>
                        )}

                        <div className="login-input-group">
                            <div className="login-input-wrap">
                                <Mail size={20} className="login-input-icon" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input login-input-with-icon login-input-top"
                                    placeholder="Email address"
                                />
                            </div>
                            <div className="login-input-wrap">
                                <Lock size={20} className="login-input-icon" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input login-input-with-icon login-input-bottom"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="login-checkbox" />
                                <label htmlFor="remember-me" className="login-checkbox-label">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="login-forgot-link">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary login-submit-btn"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
