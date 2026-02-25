import React from 'react';
import { Mail, Calendar, ShieldCheck, Wallet, ArrowDownToLine, Landmark } from 'lucide-react';
import useStore from '../../store/useStore';
import BackButton from '../../components/common/BackButton';
import { formatINR } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

const LenderProfile = () => {
    const { currentUser, lenderBalances, showSuccess } = useStore();
    const navigate = useNavigate();
    // Get available balance, fallback to 5M for UI testing
    const availableBalance = lenderBalances[currentUser?.name] || 5000000;

    const handleWithdraw = () => {
        showSuccess("Withdrawal Initiated", "Funds have been scheduled for transfer to your linked bank account.");
    };

    return (
        <div className="container overflow-hidden" style={{ maxWidth: '100%' }}>
            <BackButton />
            <div className="mb-8">
                <h1 className="text-3xl font-black text-primary tracking-tight">Institutional Profile</h1>
                <p className="text-secondary mt-2">Manage your lending firm details and capital reserves.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="saas-card lg:col-span-1 border-t-4 border-t-emerald-500">
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                            <Landmark size={48} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-primary">{currentUser?.name || "Lender Firm"}</h2>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase mt-2 border border-emerald-500/20">
                            Verified Lender
                        </span>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <div className="flex items-center gap-3 text-secondary">
                            <Mail size={18} className="text-emerald-500" />
                            <span>{currentUser?.email || "lender@example.com"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-secondary">
                            <Calendar size={18} className="text-emerald-500" />
                            <span>Joined: {currentUser?.joinDate || "2024-01-01"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-secondary">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            <span>Status: {currentUser?.status?.toUpperCase() || "ACTIVE"}</span>
                        </div>
                    </div>
                </div>

                {/* Actions and Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Capital Reserves */}
                    <div className="saas-card bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">Available Capital</p>
                            <h3 className="text-5xl font-black text-primary tracking-tighter">{formatINR(availableBalance)}</h3>
                            <p className="text-xs text-secondary mt-2">Ready to be deployed for loan funding.</p>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button onClick={() => navigate('/lender/addfunds')} className="btn btn-primary w-full md:w-48 flex justify-center items-center gap-2">
                                <Wallet size={18} /> Add Capital
                            </button>
                            <button onClick={handleWithdraw} className="btn border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 w-full md:w-48 flex justify-center items-center gap-2">
                                <ArrowDownToLine size={18} /> Withdraw
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="saas-card p-6">
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Portfolio Rating</p>
                            <p className="text-3xl font-black text-emerald-500">A+</p>
                            <p className="text-xs text-muted mt-2">Top 5% performing lender tier.</p>
                        </div>
                        <div className="saas-card p-6">
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Default Rate</p>
                            <p className="text-3xl font-black text-primary">0.02%</p>
                            <p className="text-xs text-muted mt-2">Well below market average.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LenderProfile;
