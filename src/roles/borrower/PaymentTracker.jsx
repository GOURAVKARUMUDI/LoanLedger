import React from 'react';
import { CreditCard, CheckCircle, TrendingUp } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import PaymentTimeline from '../../components/common/PaymentTimeline';

const PaymentTracker = () => {
    const { payments, loans, currentUser, makePayment } = useStore();


    // Strict filtering so users only see their own assigned payments and active loans
    const userPayments = (payments || []).filter(p => p.borrowerId === currentUser?.id);
    const activeLoans = (loans || []).filter(l => l.borrowerId === currentUser?.id && l.status === 'active');

    const handlePay = (loanId, amount) => {
        makePayment(loanId, amount);
        // Soft notification could be added here
    };

    const checkPendingPayment = (loanId) => {
        return userPayments.some(p => p.loanId === loanId && p.status === 'Under Review');
    };

    return (
        <div className="module-container fade-in">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-primary tracking-tight">Payments & Timeline</h1>
                    <p className="text-secondary">Track your repayment roadmap and manage upcoming EMIs.</p>
                </div>
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
                    <TrendingUp size={32} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Upcoming Dues */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <CreditCard size={20} className="text-indigo-600" />
                        Upcoming EMIs
                    </h2>

                    {activeLoans.length > 0 ? activeLoans.map(loan => (
                        <div key={loan.id} className="saas-card overflow-hidden border-l-4 border-l-indigo-600">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="font-bold text-lg text-primary">{loan.purpose || 'Active Loan'}</h3>
                                    <p className="text-secondary text-xs font-medium uppercase tracking-wider">Loan ID: #{loan.id.substring(0, 8)}</p>
                                    <div className="flex gap-4 mt-3">
                                        <div className="text-sm">
                                            <span className="text-secondary block text-[10px] font-bold uppercase">Next Due</span>
                                            <span className="font-bold text-red-500">{loan.nextDueDate}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-secondary block text-[10px] font-bold uppercase">EMI Amount</span>
                                            <span className="font-bold text-primary">{formatINR(loan.emi)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 w-full md:w-auto"
                                    onClick={() => handlePay(loan.id, loan.emi)}
                                    disabled={checkPendingPayment(loan.id)}
                                >
                                    {checkPendingPayment(loan.id) ? 'Processing...' : 'Pay EMI Now'}
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="saas-card py-16 text-center">
                            <CheckCircle size={48} className="mx-auto text-emerald-500 opacity-20 mb-4" />
                            <h3 className="text-lg font-bold text-primary">No Pending Payments</h3>
                            <p className="text-secondary text-sm">You are all caught up with your installments.</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Visual Timeline */}
                <div className="lg:col-span-1">
                    <PaymentTimeline
                        payments={userPayments}
                        loanDetails={activeLoans[0] || {}}
                    />
                </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
                    <CheckCircle size={18} />
                </div>
                <div>
                    <h5 className="font-bold text-sm text-primary">Auto-Pay Active</h5>
                    <p className="text-xs text-secondary mt-1">
                        Your account is enrolled in automated repayments. Funds will be deducted 24 hours prior to the due date if sufficient balance is available.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentTracker;
