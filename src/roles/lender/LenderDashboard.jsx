import React from 'react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

import {
    CreditCard, Wallet, Briefcase,
    ShieldCheck, TrendingUp, PlusCircle, ArrowRight,
    PieChart, Search
} from 'lucide-react';

const LenderDashboard = () => {
    const { currentUser, lenderBalances } = useStore();

    // Get available balance, fallback to 5M for UI testing
    const availableBalance = lenderBalances[currentUser?.name] || 5000000;

    const navCards = [
        {
            title: 'Loan Marketplace',
            desc: 'Browse approved loan requests from verified borrowers.',
            icon: <Search size={36} className="text-emerald-600" />,
            link: '/lender/requests',
            color: 'emerald'
        },
        {
            title: 'My Active Loans',
            desc: 'View loans you have funded and track repayments.',
            icon: <Briefcase size={36} className="text-blue-600" />,
            link: '/lender/active-loans',
            color: 'blue'
        },
        {
            title: 'Create Loan Offer',
            desc: 'Set your lending terms and create a new loan offer.',
            icon: <PlusCircle size={36} className="text-purple-600" />,
            link: '/lender/create-offer',
            color: 'purple'
        },
        {
            title: 'My Earnings',
            desc: 'View your interest earnings and portfolio performance.',
            icon: <TrendingUp size={36} className="text-indigo-600" />,
            link: '/lender/earnings',
            color: 'indigo'
        },
        {
            title: 'Add Money',
            desc: 'Add funds to your lending balance.',
            icon: <Wallet size={36} className="text-amber-600" />,
            link: '/lender/addfunds',
            color: 'amber'
        },
        {
            title: 'My Lending Profile',
            desc: 'View your lender details and overall lending stats.',
            icon: <PieChart size={36} className="text-slate-600" />,
            link: '/lender/profile',
            color: 'slate'
        }
    ];

    return (
        <div className="dashboard-wrapper fade-in section-lender">
            {/* Header */}
            <div className="hero-card mb-10 flex flex-col md:flex-row justify-between items-center">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30">
                            Verified Lender
                        </span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/30">
                            Balance: {formatINR(availableBalance)}
                        </span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--text)' }}>
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">{currentUser?.name}</span>
                    </h1>
                    <p className="text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Fund loans, track earnings, and manage your lending portfolio from one place.
                    </p>
                </div>

                <div className="hidden lg:flex flex-col items-center gap-4 relative z-10 hero-card-stat-panel">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Available Balance</p>
                    <p className="text-4xl font-black" style={{ color: 'var(--text)' }}>{formatINR(availableBalance)}</p>
                    <Link to="/lender/addfunds" className="btn-premium btn-premium-primary mt-2 w-full text-center">
                        Add Money
                    </Link>
                </div>


            </div>

            {/* Navigation Cards */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-primary tracking-tight">Quick Actions</h2>
            </div>

            <div className="card-grid mb-10">
                {navCards.map((card, idx) => (
                    <Link key={idx} to={card.link} className="saas-card nav-hub-card no-underline group hover:border-emerald-500/50">
                        <div className="flex-1">
                            <div className={`icon-box transition-transform group-hover:scale-110 group-hover:bg-emerald-500/10`}>
                                {card.icon}
                            </div>
                            <h3 className="text-primary group-hover:text-emerald-600 transition-colors">{card.title}</h3>
                            <p className="text-secondary text-base leading-relaxed">{card.desc}</p>
                        </div>
                        <div className="mt-8 flex items-center text-sm font-bold text-emerald-600 gap-2 opacity-40 group-hover:opacity-100 transition-all">
                            Open <ArrowRight size={18} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Market Summary */}
            <div className="saas-card glass border-dashed border-2 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-2xl font-black">Market Summary</h3>
                        <p className="text-secondary">Browse loan requests from verified borrowers.</p>
                    </div>
                    <Link to="/lender/requests" className="btn-premium border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white">
                        Browse Loans
                    </Link>
                </div>
                <div className="premium-progress-container">
                    <div className="premium-progress-bar" style={{ width: '82%', background: 'linear-gradient(90deg, #10b981, #06b6d4, #10b981)' }}></div>
                </div>
                <div className="mt-4 text-xs font-bold text-muted uppercase tracking-tighter flex gap-10">
                    <span>Loan Demand: High</span>
                    <span>Average Rate: 12.4%</span>
                    <span>Your Status: Active</span>
                </div>
            </div>
        </div>
    );
};


export default LenderDashboard;
