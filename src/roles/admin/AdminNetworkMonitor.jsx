import React from 'react';
import useStore from '../../store/useStore';
import BackButton from '../../components/common/BackButton';
import { Globe, Activity, Users, CreditCard, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const AdminNetworkMonitor = () => {
    const { users, loans } = useStore();
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

    // Bar Colors mapping based on index
    const barColors = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1'];

    return (
        <div className="container" style={{ maxWidth: '100%', paddingBottom: '4rem' }}>
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

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Role Breakdown Chart */}
                <div className="saas-card" style={{ padding: '2rem' }}>
                    <h3 className="mb-6 font-bold text-xl text-primary">Node Distribution by Role</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roleBreakdown} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                                <XAxis dataKey="role" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ fill: 'rgba(150,150,150,0.05)' }}
                                />
                                <Bar dataKey="count" radius={[8, 8, 8, 8]} maxBarSize={60}>
                                    {roleBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Role Breakdown Numbers (Original Grid) */}
                <div className="saas-card" style={{ padding: '2rem' }}>
                    <h3 className="mb-6 font-bold text-xl text-primary">Raw Node Metrics</h3>
                    <div className="grid grid-cols-2 gap-4 h-full">
                        {roleBreakdown.map((r, i) => (
                            <div key={i} className="flex flex-col justify-center items-center rounded-2xl border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                                <p style={{ fontSize: '2.5rem', fontWeight: 900, color: barColors[i % barColors.length] }}>{r.count}</p>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>{r.role} Nodes</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNetworkMonitor;
