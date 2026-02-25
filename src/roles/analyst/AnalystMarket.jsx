import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Percent, Activity, Zap, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar, Cell } from 'recharts';
import BackButton from '../../components/common/BackButton';

import useStore from '../../store/useStore';

// Numeric Animation Hook
const useAnimatedValue = (value) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValue = useRef(value);

    useEffect(() => {
        const start = prevValue.current;
        const end = value;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuad = (t) => t * (2 - t);
            const currentVal = start + (end - start) * easeOutQuad(progress);

            setDisplayValue(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
        prevValue.current = value;
    }, [value]);

    return displayValue;
};

const CHART_COLORS = {
    area: ['#6366f1', '#22d3ee'],
    bar: ['#10b981', '#f59e0b', '#ef4444'],
    grid: '#334155',
    text: '#94a3b8'
};

const RiskGauge = ({ level }) => {
    const colors = {
        low: { fill: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'LOW RISK' },
        medium: { fill: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'MEDIUM' },
        high: { fill: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'HIGH RISK' }
    };
    const cfg = colors[level] || colors.low;
    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ background: cfg.bg }}>
            <div className="w-3 h-3 rounded-full" style={{ background: cfg.fill }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.fill }}>{cfg.label}</span>
        </div>
    );
};

const AnalystMarket = () => {
    const { loans } = useStore();

    // Live Market Telemetry from DB
    const allLoans = loans || [];
    const activeLoanCount = allLoans.filter(l => l.status === 'active').length;
    const totalLoanCount = allLoans.length || 1;

    // Create rolling data out of the mock loan data durations
    const generateRealHistory = () => {
        const history = [];
        for (let i = 0; i < 12; i++) {
            let monthBaseDemand = 70 + (allLoans.length * 2);
            history.push({
                time: `${i}:00`,
                rate: 6.50 + (activeLoanCount * 0.05) + Math.random() * 0.2,
                demand: monthBaseDemand + Math.random() * 10
            });
        }
        return history;
    };

    // Internal Simulation State — lazy init avoids impure-call-during-render lint
    const [marketData, setMarketData] = useState(() => ({
        rbiRate: 6.50,
        volatility: 12.4 + (activeLoanCount * 0.1),
        loanDemand: 88 + activeLoanCount,
        riskIndex: 2.1 + (allLoans.filter(l => l.cibilScore < 600).length * 0.5),
        history: generateRealHistory()
    }));

    useEffect(() => {
        // Data randomization removed to stabilize Market Overview
    }, []);

    const animatedRate = useAnimatedValue(marketData.rbiRate);
    const animatedDemand = useAnimatedValue(marketData.loanDemand);
    const animatedRisk = useAnimatedValue(marketData.riskIndex);

    return (
        <div className="dashboard-wrapper section-analyst fade-in">
            <BackButton />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/30 flex items-center gap-2">
                            <Activity size={12} className="animate-pulse" /> Live Market Feed
                        </span>
                        <span className="px-3 py-1 bg-slate-500/10 text-slate-400 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-500/20">
                            v4.2 Simulation
                        </span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-primary">Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Terminal</span></h1>
                    <p className="text-secondary text-xl mt-2">Macroeconomic telemetry and real-time systemic risk monitoring.</p>
                </div>

                <div className="glass p-6 rounded-3xl border-white/20 flex gap-10 items-center">
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">System Health</p>
                        <p className="text-2xl font-black text-emerald-400">OPTIMAL</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Volatility</p>
                        <p className="text-2xl font-black text-primary">{marketData.volatility}%</p>
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="card-grid mb-10">
                <div className="saas-card group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform">
                            <Percent size={32} />
                        </div>
                        <TrendingUp size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-secondary uppercase tracking-widest">RBI Base Rate</p>
                    <h3 className="text-5xl font-black text-primary mt-2 font-mono tracking-tighter">
                        {animatedRate.toFixed(2)}%
                    </h3>
                    <p className="text-xs text-muted mt-4">Current Central Bank benchmark rate sync.</p>
                </div>

                <div className="saas-card group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                            <Zap size={32} />
                        </div>
                        <span className="text-xs font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">HIGH</span>
                    </div>
                    <p className="text-sm font-bold text-secondary uppercase tracking-widest">Loan Demand Index</p>
                    <h3 className="text-5xl font-black text-primary mt-2 font-mono tracking-tighter">
                        {animatedDemand.toFixed(0)}
                    </h3>
                    <p className="text-xs text-muted mt-4">Platform utilization velocity (0-100 scale).</p>
                </div>

                <div className="saas-card group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
                            <AlertCircle size={32} />
                        </div>
                        <ShieldCheck size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-secondary uppercase tracking-widest">Macro Risk Index</p>
                    <h3 className="text-5xl font-black text-primary mt-2 font-mono tracking-tighter">
                        {animatedRisk.toFixed(1)}
                    </h3>
                    <p className="text-xs text-muted mt-4">Systemic risk exposure coefficient.</p>
                </div>
            </div>

            {/* Live Analytics Dashboard */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
                {/* Interest Rate Trend */}
                <div className="saas-card p-8">
                    <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                        <Activity size={24} className="text-indigo-500" />
                        Yield Velocity Telemetry
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketData.history}>
                                <defs>
                                    <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['dataMin - 0.1', 'dataMax + 0.1']} hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={4} fill="url(#velocityGrad)" animationDuration={1000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demand Volume */}
                <div className="saas-card p-8">
                    <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                        <BarChart3 size={24} className="text-blue-500" />
                        Volume Distribution
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marketData.history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="demand" radius={[8, 8, 8, 8]}>
                                    {marketData.history.map((entry, index) => (
                                        <Cell key={index} fill={entry.demand > 80 ? '#3b82f6' : '#6366f1'} opacity={0.6 + (index / 20)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Institutional Risk Meter */}
            <div className="saas-card glass border-dashed border-2 flex flex-col items-center justify-center p-12 text-center">
                <ShieldCheck size={48} className="text-emerald-500 mb-6 animate-pulse" />
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Platform Stability Node</h3>
                <p className="text-secondary max-w-2xl text-lg leading-relaxed mb-10">
                    Macroeconomic volatility is currently within institutional tolerance boundaries. Our AI simulation recommends maintaining current interest rate spreads to optimize liquidity velocity while preserving capital security.
                </p>
                <div className="premium-progress-container h-4 mb-2">
                    <div className="premium-progress-bar" style={{ width: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6, #10b981)' }}></div>
                </div>
                <div className="flex gap-12 mt-6">
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-muted">Node Sync</p>
                        <p className="text-xl font-black">ACTIVE</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-muted">Latency</p>
                        <p className="text-xl font-black">2.4ms</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-muted">Confidence</p>
                        <p className="text-xl font-black">99.2%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalystMarket;
