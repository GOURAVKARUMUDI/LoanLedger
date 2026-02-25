import React from 'react';
import {
    TrendingUp, FileText, Activity,
    ShieldAlert, ArrowRight, Fingerprint, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';

const AnalystDashboard = () => {
    const { currentUser } = useStore();


    const navCards = [
        {
            title: 'Check Loan Risk',
            desc: 'Review and approve pending loan applications.',
            icon: <ShieldAlert size={36} className="text-amber-600" />,
            link: '/analyst/risk-verification',
            color: 'amber'
        },
        {
            title: 'Borrower Details',
            desc: 'View borrower profiles and credit information.',
            icon: <Fingerprint size={36} className="text-emerald-600" />,
            link: '/analyst/borrower-intelligence',
            color: 'emerald'
        },
        {
            title: 'Market Overview',
            desc: 'See current interest rates and loan demand trends.',
            icon: <TrendingUp size={36} className="text-blue-600" />,
            link: '/analyst/market-trends',
            color: 'blue'
        },
        {
            title: 'Reports',
            desc: 'View borrower reports and platform analytics.',
            icon: <FileText size={36} className="text-purple-600" />,
            link: '/analyst/reports',
            color: 'purple'
        },
        {
            title: 'My Profile',
            desc: 'Review node diagnostics and system performance.',
            icon: <ShieldCheck size={36} className="text-slate-600" />,
            link: '/analyst/profile',
            color: 'slate'
        }
    ];

    return (
        <div className="dashboard-wrapper fade-in section-analyst">
            {/* Header */}
            <div className="hero-card mb-10 flex flex-col md:flex-row justify-between items-center">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/30">
                            Financial Analyst
                        </span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--text)' }}>
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">{currentUser?.name}</span>
                    </h1>
                    <p className="text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Review loan applications, analyze borrower data, and monitor market trends.
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-6 relative z-10 hero-card-stat-panel">
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>System Status</p>
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
                    <Link key={idx} to={card.link} className="saas-card nav-hub-card no-underline group hover:border-amber-500/50">
                        <div className="flex-1">
                            <div className={`icon-box transition-transform group-hover:scale-110 group-hover:bg-amber-500/10`}>
                                {card.icon}
                            </div>
                            <h3 className="text-primary group-hover:text-amber-600 transition-colors">{card.title}</h3>
                            <p className="text-secondary text-base leading-relaxed">{card.desc}</p>
                        </div>
                        <div className="mt-8 flex items-center text-sm font-bold text-amber-600 gap-2 opacity-40 group-hover:opacity-100 transition-all">
                            Open <ArrowRight size={18} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Status Footer */}
            <div className="saas-card glass border-dashed border-2 p-10 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black mb-4">System Status</h3>
                <p className="text-secondary max-w-xl mb-8">
                    All systems are running normally. Use Quick Actions above to review loan applications and analyze data.
                </p>
                <div className="premium-progress-container">
                    <div className="premium-progress-bar" style={{ width: '42%', background: 'linear-gradient(90deg, #f59e0b, #ea580c, #f59e0b)' }}></div>
                </div>
                <div className="mt-4 text-xs font-bold text-muted uppercase tracking-tighter flex gap-10">
                    <span>Audit: OK</span>
                    <span>Database: Synced</span>
                    <span>Status: Active</span>
                </div>
            </div>
        </div>
    );
};


export default AnalystDashboard;
