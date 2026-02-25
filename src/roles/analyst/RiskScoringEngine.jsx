import React, { useState } from 'react';
import { ShieldAlert, TrendingUp, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, XCircle, Activity, Fingerprint } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';

const RiskScoringEngine = () => {
    const { evaluateRisk, loans } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');

    const [expandedId, setExpandedId] = useState(null);

    const pendingRequests = loanRequests.filter(r => r.status === 'pending');

    // Calculate Risk Stats
    const totalPending = pendingRequests.length;
    const highRiskCount = pendingRequests.filter(r => (r.cibilScore < 600 || r.latePayments > 2)).length;
    const medRiskCount = pendingRequests.filter(r => (r.cibilScore >= 600 && r.cibilScore < 750 && r.latePayments <= 2)).length;
    const _lowRiskCount = pendingRequests.filter(r => r.cibilScore >= 750).length;

    const avgScore = totalPending > 0
        ? Math.round(pendingRequests.reduce((acc, r) => acc + (r.cibilScore || 0), 0) / totalPending)
        : 0;

    const getRiskLevel = (score, late) => {
        if (score < 600 || late > 2) return { label: 'High', color: '#f43f5e', width: '90%', bg: 'rgba(244, 63, 94, 0.1)' };
        if (score < 750) return { label: 'Medium', color: '#f59e0b', width: '50%', bg: 'rgba(245, 158, 11, 0.1)' };
        return { label: 'Low', color: '#10b981', width: '15%', bg: 'rgba(16, 185, 129, 0.1)' };
    };

    return (
        <div className="module-container fade-in">
            {/* Enterprise Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-primary tracking-tight">Risk Verification Engine</h2>
                    <p className="text-secondary">Systemic credit auditing node active. Processing {totalPending} concurrent requests.</p>
                </div>
                <div className="hidden md:flex gap-4">
                    <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="block text-[10px] font-bold text-secondary uppercase">API Status</span>
                        <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                            <Activity size={12} /> Synchronized
                        </span>
                    </div>
                </div>
            </div>

            {/* Section 1 - Risk Overview KPI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="saas-card p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                            <ShieldAlert size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Active</span>
                    </div>
                    <p className="text-secondary text-xs font-bold uppercase mb-1">Queue Depth</p>
                    <h3 className="text-4xl font-black text-primary">{totalPending}</h3>
                </div>

                <div className="saas-card p-6 border-l-4 border-l-red-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Critical</span>
                    </div>
                    <p className="text-secondary text-xs font-bold uppercase mb-1">High Risk</p>
                    <h3 className="text-4xl font-black text-primary">{highRiskCount}</h3>
                </div>

                <div className="saas-card p-6 border-l-4 border-l-amber-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                            <Info size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Elevated</span>
                    </div>
                    <p className="text-secondary text-xs font-bold uppercase mb-1">Medium Risk</p>
                    <h3 className="text-4xl font-black text-primary">{medRiskCount}</h3>
                </div>

                <div className="saas-card p-6 border-l-4 border-l-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Stable</span>
                    </div>
                    <p className="text-secondary text-xs font-bold uppercase mb-1">Avg Score</p>
                    <h3 className="text-4xl font-black text-primary">{avgScore}</h3>
                </div>
            </div>

            {/* Section 2 - Verification Queue */}
            <div className="space-y-6">
                {pendingRequests.length === 0 ? (
                    <div className="saas-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                        <CheckCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--text-muted)' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No Pending Requests</h3>
                        <p style={{ color: 'var(--text-muted)' }}>All loan requests have been processed. New requests will appear here automatically.</p>
                    </div>
                ) : pendingRequests.map(req => {
                    const risk = getRiskLevel(req.cibilScore || 0, req.latePayments || 0);
                    const isExpanded = expandedId === req.id;

                    return (
                        <div key={req.id} className={`saas-card overflow-hidden transition-all duration-500 ${isExpanded ? 'ring-2 ring-indigo-500/50 scale-[1.01]' : ''}`}>
                            <div className="p-8">
                                <div className="flex flex-col lg:flex-row justify-between gap-10">
                                    {/* Left Side: Profile Summary */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-black text-2xl text-indigo-600 shadow-inner border border-white/10">
                                                {req.borrowerName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-black text-2xl text-primary">{req.borrowerName}</h4>
                                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-secondary uppercase border border-slate-200 dark:border-slate-700">Verified ID</span>
                                                </div>
                                                <p className="text-sm font-mono text-muted uppercase tracking-tighter">Node ID: {req.borrowerId.substring(0, 12)}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-[10px] uppercase text-secondary font-bold block mb-2">Credit Score</span>
                                                <span className="font-black text-2xl text-primary">{req.cibilScore || 'N/A'}</span>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-[10px] uppercase text-secondary font-bold block mb-2">Late Payments</span>
                                                <span className={`font-black text-2xl ${req.latePayments > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{req.latePayments || 0}</span>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-[10px] uppercase text-secondary font-bold block mb-2">DTI Ratio</span>
                                                <span className="font-black text-2xl text-primary">32.4%</span>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-[10px] uppercase text-secondary font-bold block mb-2">Req Amount</span>
                                                <span className="font-black text-2xl text-indigo-600">{formatINR(req.amount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center: Risk Analytics Gauge */}
                                    <div className="w-full lg:w-80 lg:border-l dark:border-slate-800 lg:pl-10">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Risk Telemetry</span>
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ color: risk.color, backgroundColor: risk.bg }}>{risk.label} Risk</span>
                                        </div>

                                        <div className="premium-progress-container h-3 mb-4">
                                            <div
                                                className="premium-progress-bar transition-all duration-1000 ease-out"
                                                style={{ width: risk.width, backgroundColor: risk.color, boxShadow: `0 0 20px ${risk.color}40` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between text-[10px] text-muted font-black tracking-tighter mb-8">
                                            <span>MINIMAL</span>
                                            <span>MODERATE</span>
                                            <span>EXTREME</span>
                                        </div>

                                        <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 backdrop-blur-sm">
                                            <div className="flex items-center gap-3 text-xs text-indigo-500 font-bold mb-2 uppercase tracking-tighter">
                                                <Activity size={16} />
                                                <span>Yield Recommendation</span>
                                            </div>
                                            <p className="text-sm font-bold text-primary leading-relaxed">
                                                Optimize node yield with <span className="text-indigo-600">{risk.label === 'High' ? '14.5% - 16.0%' : risk.label === 'Medium' ? '11.2% - 13.5%' : '8.5% - 10.8%'}</span> interest targeting.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Quick Logic Actions */}
                                    <div className="flex flex-col gap-3 lg:w-60">
                                        <button
                                            onClick={() => evaluateRisk(req.id, 'approve', 'Institutional verification complete. Logic: Low delta, stable history.')}
                                            className="btn-premium btn-premium-primary text-sm flex items-center justify-center gap-2 group"
                                        >
                                            <CheckCircle size={18} /> Execute Approval
                                        </button>
                                        <button
                                            onClick={() => evaluateRisk(req.id, 'reject', 'Risk protocol failure. Logic: Excessive late payment delta.')}
                                            className="btn-premium border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={18} /> Deny Request
                                        </button>
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                            className="btn-premium border border-slate-300 dark:border-slate-700 text-secondary text-sm flex items-center justify-center gap-2"
                                        >
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />} Full Forensic Report
                                        </button>
                                    </div>
                                </div>

                                {/* Forensic Deep Dive */}
                                {isExpanded && (
                                    <div className="mt-10 pt-10 border-t dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div>
                                                <h5 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-6 text-primary">
                                                    <Fingerprint size={16} className="text-indigo-500" />
                                                    Behavioral Distribution
                                                </h5>
                                                <div className="space-y-4">
                                                    <p className="text-sm text-secondary bg-slate-50 dark:bg-slate-900/80 p-6 rounded-2xl leading-relaxed border border-slate-100 dark:border-slate-800">
                                                        Node has been active for <span className="text-primary font-bold">1,095 days</span>. Algorithmic analysis suggests a <span className="text-emerald-500 font-bold">96.8% reliability rating</span> based on previous ecosystem interactions. Current DTI cluster sits within the optimal 15th percentile.
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-6 text-primary">
                                                    <Activity size={16} className="text-amber-500" />
                                                    Forensic Indicators
                                                </h5>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <li className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                                        <CheckCircle size={14} className="text-emerald-500" />
                                                        <span className="text-[11px] font-bold text-secondary uppercase">Zero Default History</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                                                        <CheckCircle size={14} className="text-indigo-500" />
                                                        <span className="text-[11px] font-bold text-secondary uppercase">Verified Employment</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                                        <AlertTriangle size={14} className="text-amber-500" />
                                                        <span className="text-[11px] font-bold text-secondary uppercase">Max Liquidity Trigger</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                                        <Activity size={14} className="text-blue-500" />
                                                        <span className="text-[11px] font-bold text-secondary uppercase">KYC Tier 4 Active</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mt-10 flex justify-end">
                                            <button
                                                onClick={() => evaluateRisk(req.id, 'hold', 'Forensic sweep requires manual OCR verification.')}
                                                className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                                            >
                                                Initialize Manual Forensics
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {pendingRequests.length === 0 && (
                    <div className="saas-card text-center py-24 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/50">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-2">Queue Clear</h3>
                        <p className="text-secondary max-w-sm mx-auto leading-relaxed">
                            No telemetry packets require manual risk processing at this time. The autonomous engine is currently managing existing nodes.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default RiskScoringEngine;
