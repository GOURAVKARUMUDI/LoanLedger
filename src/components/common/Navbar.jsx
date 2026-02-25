import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogOut, Moon, Sun, Monitor, Bell, Trash2 } from 'lucide-react';
import useStore from '../../store/useStore';

const Navbar = ({ role }) => {
    const { theme, setTheme, logoutUser, notifications, removeNotification } = useStore();

    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register';

    const handleLogout = () => {
        logoutUser();
        navigate('/', { replace: true });
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getDashboardLink = () => {
        if (!role) return '/';
        return `/${role}/dashboard`;
    };

    const getRoleDisplayName = (r) => {
        switch (r) {
            case 'admin': return 'Administrator';
            case 'lender': return 'Lender';
            case 'analyst': return 'Financial Analyst';
            case 'borrower': return 'Borrower';
            default: return 'User';
        }
    };

    const isDashboard = location.pathname.includes('/dashboard');

    return (
        <nav className="navbar border-b backdrop-blur-xl sticky top-0 z-[100]">
            <div className="nav-container max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                {/* Left - Branding & Core Nav */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="brand-container no-underline">
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ShieldCheck className="text-white" size={20} />
                        </div>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: '18px', letterSpacing: '0.3px', color: 'var(--text)' }}>LoanLedger</span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '-2px', letterSpacing: '0.2px' }}>Transparency in Every Transaction</span>
                        </div>
                    </Link>

                    {isAuth && (
                        <div className="hidden h-6 w-[1px] bg-slate-200 dark:bg-slate-800 md:block"></div>
                    )}

                    {isAuth && (
                        <Link
                            to={getDashboardLink()}
                            className={`text-sm font-black tracking-tight uppercase px-4 py-2 rounded-lg transition-all ${isDashboard
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                                : 'text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            Hub Control
                        </Link>
                    )}
                </div>

                {/* Center - Role Manifest */}
                <div className="hidden lg:flex items-center gap-2">
                    {isAuth && role && (
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${role === 'admin' ? 'bg-indigo-500' :
                                role === 'lender' ? 'bg-emerald-500' :
                                    role === 'analyst' ? 'bg-amber-500' :
                                        'bg-blue-500'
                                }`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">
                                {getRoleDisplayName(role)} Access
                            </span>
                        </div>
                    )}
                </div>

                {/* Right - Profile & Telemetry */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`notif-bell-btn ${notifications.length > 0 ? 'notif-bell-btn--active' : ''}`}
                            title="Notifications"
                        >
                            <Bell size={18} />
                            {notifications.length > 0 && (
                                <span className="notif-badge">{notifications.length}</span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notif-panel">
                                <div className="notif-panel-header">
                                    <h4>Notifications</h4>
                                    {notifications.length > 0 && (
                                        <button onClick={() => notifications.forEach(n => removeNotification(n.id))} className="notif-panel-clear">
                                            <Trash2 size={10} /> Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="notif-panel-list">
                                    {notifications.length === 0 ? (
                                        <div className="notif-panel-empty">
                                            <Bell size={28} className="mx-auto text-muted mb-2" style={{ opacity: 0.4 }} />
                                            <p>No notifications</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className="notif-panel-item">
                                                <div className={`notif-dot ${n.type === 'error' ? 'notif-dot--error' :
                                                    n.type === 'success' ? 'notif-dot--success' : 'notif-dot--info'}`} />
                                                <div>
                                                    <p className="toast-title">{n.title}</p>
                                                    <p className="toast-message">{n.message}</p>
                                                    <p className="toast-time">
                                                        {new Date(n.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 text-secondary hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        title="Toggle Dark/Light Mode"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

                    {isAuth ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                                title="Secure Logout"
                            >
                                <LogOut size={16} />
                                <span className="hidden md:inline">Terminate</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-bold text-secondary px-4 py-2 hover:text-primary no-underline">
                                Login
                            </Link>
                            <Link to="/register" className="btn-premium btn-premium-primary text-sm no-underline">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};


export default Navbar;
