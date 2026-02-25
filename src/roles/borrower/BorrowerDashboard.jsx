import React from 'react';
import { CreditCard, HandCoins, TrendingUp, ReceiptText, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import StatusBadge from '../../components/common/StatusBadge';
import LoanProgress from '../../components/common/LoanProgress';

const BorrowerDashboard = () => {
    const { currentUser } = useStore();


    const navCards = [
        {
            title: 'Apply for Loan',
            desc: 'Request money from lenders with competitive rates.',
            icon: <HandCoins size={36} className="text-indigo-600" />,
            link: '/borrower/apply',
            color: 'indigo'
        },
        {
            title: 'Loan Requests',
            desc: 'Track your pending and submitted loan applications.',
            icon: <TrendingUp size={36} className="text-emerald-600" />,
            link: '/borrower/requests',
            color: 'emerald'
        },
        {
            title: 'My Loans',
            desc: 'View your approved and active loans.',
            icon: <CreditCard size={36} className="text-blue-600" />,
            link: '/borrower/my-loans',
            color: 'blue'
        },
        {
            title: 'My Payments',
            desc: 'View upcoming EMIs and payment history.',
            icon: <ReceiptText size={36} className="text-purple-600" />,
            link: '/borrower/payments',
            color: 'purple'
        },
        {
            title: 'EMI Calculator',
            desc: 'Plan your loan with monthly EMI projections.',
            icon: <Calculator size={36} className="text-amber-600" />,
            link: '/borrower/emi',
            color: 'amber'
        },
        {
            title: 'My Profile',
            desc: 'View your credit score and account details.',
            icon: <ShieldCheck size={36} className="text-slate-600" />,
            link: '/borrower/profile',
            color: 'slate'
        }
    ];

    return (
        <div className="dashboard-wrapper fade-in section-borrower">
            {/* Header */}
            <div className="hero-card mb-10 flex flex-col md:flex-row justify-between items-center">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
                            Verified Borrower
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30">
                            Score: {currentUser?.creditScore || '780'}
                        </span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--text)' }}>
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{currentUser?.name}</span>
                    </h1>
                    <p className="text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Manage your loans, track payments, and plan your finances — all in one place.
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-6 relative z-10 hero-card-stat-panel">
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Account Status</p>
                        <p className="text-3xl font-black text-emerald-400">Active</p>
                    </div>
                </div>


            </div>

            {/* Navigation Cards */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-primary tracking-tight">Quick Actions</h2>
            </div>

            <div className="card-grid mb-10">
                {navCards.map((card, idx) => (
                    <Link key={idx} to={card.link} className="saas-card nav-hub-card no-underline group hover:border-indigo-500/50">
                        <div className="flex-1">
                            <div className={`icon-box transition-transform group-hover:scale-110 group-hover:bg-indigo-500/10`}>
                                {card.icon}
                            </div>
                            <h3 className="text-primary group-hover:text-indigo-600 transition-colors">{card.title}</h3>
                            <p className="text-secondary text-base leading-relaxed">{card.desc}</p>
                        </div>
                        <div className="mt-8 flex items-center text-sm font-bold text-indigo-600 gap-2 opacity-40 group-hover:opacity-100 transition-all">
                            Open <ArrowRight size={18} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Status Section */}
            <div className="saas-card glass border-dashed border-2 p-10 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black mb-4">Account Overview</h3>
                <p className="text-secondary max-w-xl mb-8">
                    Your account is verified and active. Use Quick Actions above to manage your loans and payments.
                </p>
                <div className="premium-progress-container">
                    <div className="premium-progress-bar" style={{ width: '65%' }}></div>
                </div>
                <div className="mt-4 text-xs font-bold text-muted uppercase tracking-tighter flex gap-10">
                    <span>Identity Verified</span>
                    <span>KYC Active</span>
                    <span>Risk: Low</span>
                </div>
            </div>
        </div>
    );
};


export default BorrowerDashboard;
