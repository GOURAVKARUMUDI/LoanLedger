import React, { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, ComposedChart, Line
} from 'recharts';
import {
    Activity, Server, ShieldCheck, Globe,
    TrendingUp, DollarSign, Users, AlertCircle,
    ChevronRight, ArrowUpRight
} from 'lucide-react';
import useStore from '../../store/useStore';
import BackButton from '../../components/common/BackButton';
import { formatINR } from '../../utils/format';

const AdminReports = () => {
    const { loans, payments } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');


    // 1. Calculate Aggregates
    const stats = useMemo(() => {
        const totalCapital = loans.reduce((sum, l) => sum + Number(l.loanAmount), 0);
        const avgInterest = loans.length > 0
            ? (loans.reduce((sum, l) => sum + Number(l.interestRate), 0) / loans.length).toFixed(1)
            : 0;
        const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const activeCount = (loans || []).filter(l => l.status === 'active').length;

        // Funnel Data
        const funnelData = [
            { stage: 'Requested', volume: loanRequests.length },
            { stage: 'Risk Evaluated', volume: loanRequests.filter(r => r.status === 'analystApproved' || r.status === 'funded' || r.status === 'active').length },
            { stage: 'Lender Matched', volume: loans.length },
            { stage: 'Capital Funded', volume: activeCount }
        ];

        // Risk Data
        const riskData = [
            { name: 'Low Risk', value: (loans || []).filter(l => l.risk === 'low').length || 1, color: '#10b981' },
            { name: 'Medium Risk', value: (loans || []).filter(l => l.risk === 'medium').length || 1, color: '#f59e0b' },
            { name: 'High Risk', value: (loans || []).filter(l => l.risk === 'high').length || 0, color: '#ef4444' }
        ];

        return { totalCapital, avgInterest, totalPayments, activeCount, funnelData, riskData };
    }, [loans, payments, loanRequests]);

    return (
        <div className="dashboard-wrapper section-admin fade-in">
            <BackButton />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-primary">Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Hub</span></h1>
                    <p className="text-secondary text-xl mt-2">Enterprise-grade systemic oversight and capital velocity analytics.</p>
                </div>

                <div className="flex gap-4">
                    <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-white/20">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Core Systems Online</span>
                    </div>
                </div>
            </div>

            {/* Premium KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                <div className="saas-card group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                            <DollarSign size={24} />
                        </div>
                        <ArrowUpRight size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Global Capital Volume</p>
                    <h3 className="text-3xl font-black text-primary mt-1">{formatINR(stats.totalCapital)}</h3>
                    <div className="mt-4 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[65%]" />
                    </div>
                </div>

                <div className="saas-card group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+2.4%</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Avg Interest Yield</p>
                    <h3 className="text-3xl font-black text-primary mt-1">{stats.avgInterest}%</h3>
                    <div className="mt-4 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[45%]" />
                    </div>
                </div>

                <div className="saas-card group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Active Contracts</p>
                    <h3 className="text-3xl font-black text-primary mt-1">{stats.activeCount}</h3>
                    <div className="mt-4 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[80%]" />
                    </div>
                </div>

                <div className="saas-card group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Revenue Recovered</p>
                    <h3 className="text-3xl font-black text-primary mt-1">{formatINR(stats.totalPayments)}</h3>
                    <div className="mt-4 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[30%]" />
                    </div>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
                {/* Approval Funnel */}
                <div className="saas-card xl:col-span-2 p-8">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
                        <Activity size={24} className="text-indigo-500" />
                        LOAN APPROVAL FUNNEL
                    </h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.funnelData}>
                                <defs>
                                    <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="stage" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                                />
                                <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={6} fill="url(#funnelGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-6 px-4">
                        {stats.funnelData.map(d => (
                            <div key={d.stage} className="text-center">
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{d.stage}</p>
                                <p className="text-lg font-black text-primary">{d.volume}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="saas-card p-8 flex flex-col items-center">
                    <h3 className="text-2xl font-black mb-10 self-start italic">
                        <AlertCircle size={24} className="inline mr-3 text-amber-500" />
                        RISK PROFILE
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.riskData}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-3 w-full">
                        {stats.riskData.map(r => (
                            <div key={r.name} className="flex items-center justify-between p-3 glass rounded-xl border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                                    <span className="text-xs font-bold text-secondary">{r.name}</span>
                                </div>
                                <span className="text-sm font-black text-primary">{r.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Intelligence Feed */}
            <div className="saas-card p-0 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
                    <h3 className="text-2xl font-black italic flex items-center gap-3">
                        <ShieldCheck size={24} className="text-emerald-500" />
                        SYSTEM AUDIT LOGS
                    </h3>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full tracking-widest">REAL-TIME SYNC</span>
                </div>
                <div className="p-8 space-y-4">
                    {(useStore().logs || []).slice(0, 4).map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl group hover:border-white/20 transition-all">
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-indigo-400 text-xs">
                                    {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <div>
                                    <p className="text-xs font-black tracking-widest text-primary mb-1 uppercase">{log.action}</p>
                                    <p className="text-[10px] text-muted font-bold">{log.user}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={'text-[10px] font-black ' + (log.status === 'Failed' ? 'text-red-500' : 'text-emerald-500')}>
                                    {log.status.toUpperCase()}
                                </span>
                                <ChevronRight size={16} className="text-muted group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
