import React from 'react';
import {
    Users, Shield, Activity,
    BarChart3, ArrowRight,
    Globe, Settings, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';

const AdminDashboard = () => {
    const { users, loans } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');
    const activeLoans = (loans || []).filter(l => l.status === 'approved' || l.status === 'active' || l.status === 'closed');


    const navCards = [
        {
            title: 'Manage Users',
            desc: 'View and manage all platform users.',
            icon: <Users size={36} className="text-indigo-600" />,
            link: '/admin/users',
            color: 'indigo'
        },
        {
            title: 'Activity Logs',
            desc: 'Review security logs and user activity.',
            icon: <Lock size={36} className="text-red-600" />,
            link: '/admin/audit-logs',
            color: 'red'
        },
        {
            title: 'Reports',
            desc: 'View financial reports and analytics.',
            icon: <BarChart3 size={36} className="text-amber-600" />,
            link: '/admin/reports',
            color: 'amber'
        },
        {
            title: 'System Settings',
            desc: 'View platform configuration and rules.',
            icon: <Settings size={36} className="text-slate-600" />,
            link: '/admin/settings',
            color: 'slate'
        },
        {
            title: 'Network Monitor',
            desc: 'View platform-wide stats and user distribution.',
            icon: <Globe size={36} className="text-blue-600" />,
            link: '/admin/network',
            color: 'blue'
        },
        {
            title: 'Risk Protocol',
            desc: 'View loan risk parameters and approval pipeline.',
            icon: <Shield size={36} className="text-emerald-600" />,
            link: '/admin/risk-protocol',
            color: 'emerald'
        }
    ];

    return (
        <div className="dashboard-wrapper fade-in section-admin">
            {/* Header */}
            <div className="hero-card mb-10 flex flex-col md:flex-row justify-between items-center">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
                            Administrator
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1">
                            <Activity size={12} /> System: Active
                        </span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--text)' }}>
                        Admin Dashboard
                    </h1>
                    <p className="text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Manage users, view reports, and monitor platform activity.
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-6 relative z-10 hero-card-stat-panel">
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Total Loan Value</p>
                        <p className="text-3xl font-black" style={{ color: 'var(--text)' }}>{formatINR(activeLoans.reduce((sum, l) => sum + Number(l.amount), 0))}</p>
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

            {/* Platform Overview */}
            <div className="saas-card glass border-dashed border-2 p-10 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black mb-4">Platform Overview</h3>
                <div className="grid grid-cols-3 gap-20 mb-8">
                    <div>
                        <p className="text-xs text-secondary font-bold uppercase mb-1">Total Users</p>
                        <p className="text-3xl font-black">{users.length}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-border my-auto"></div>
                    <div>
                        <p className="text-xs text-secondary font-bold uppercase mb-1">Active Requests</p>
                        <p className="text-3xl font-black text-indigo-600">{loanRequests.length}</p>
                    </div>
                </div>
                <div className="premium-progress-container">
                    <div className="premium-progress-bar" style={{ width: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4, #6366f1)' }}></div>
                </div>
                <div className="mt-4 text-xs font-bold text-muted uppercase tracking-tighter flex gap-10">
                    <span>All Systems Active</span>
                    <span>Security: OK</span>
                    <span>Session: Active</span>
                </div>
            </div>
        </div>
    );
};


export default AdminDashboard;
