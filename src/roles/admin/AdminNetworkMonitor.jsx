import React from 'react';
import useStore from '../../store/useStore';
import BackButton from '../../components/common/BackButton';
import { Globe, Activity, Users, CreditCard, TrendingUp } from 'lucide-react';

const AdminNetworkMonitor = () => {
    const { users , loans } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');
    const activeLoans = (loans || []).filter(l => l.status === 'approved' || l.status === 'active' || l.status === 'closed');


    const stats = [
        { label: 'Total Users', value: users.length, icon: <Users size={24} className="text-indigo-500" />, color: '#6366f1' },
        { label: 'Active Loans', value: activeLoans.length, icon: <CreditCard size={24} className="text-emerald-500" />, color: '#10b981' },
        { label: 'Pending Requests', value: loanRequests.filter(r => r.status === 'pending').length, icon: <TrendingUp size={24} className="text-amber-500" />, color: '#f59e0b' },
        { label: 'System Uptime', value: '99.9%', icon: <Activity size={24} className="text-blue-500" />, color: '#3b82f6' },
    ];

    const roleBreakdown = ['admin', 'borrower', 'lender', 'analyst'].map(role => ({
        role: role.charAt(0).toUpperCase() + role.slice(1),
        count: (users || []).filter(u => u.role === role).length
    }));

    return (
        <div>
            <BackButton />
            <div className="flex items-center gap-3 mb-6">
                <Globe size={28} className="text-blue-500" />
                <h1 className="text-2xl font-bold">Network Monitor</h1>
            </div>

            {/* Stats Grid */}
            <div className="card-grid mb-8">
                {stats.map((s, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem' }}>
                        <div className="flex items-center gap-3 mb-3">
                            {s.icon}
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>{s.label}</span>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Role Breakdown */}
            <div className="saas-card" style={{ padding: '2rem' }}>
                <h3 className="mb-4">Node Distribution by Role</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roleBreakdown.map((r, i) => (
                        <div key={i} style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{r.count}</p>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminNetworkMonitor;
