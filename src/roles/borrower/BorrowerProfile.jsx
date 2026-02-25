import React, { useState } from 'react';
import { User, Mail, Calendar, ShieldCheck, CreditCard, Landmark, Plus, FileText, Smartphone } from 'lucide-react';
import useStore from '../../store/useStore';
import BackButton from '../../components/common/BackButton';

const BorrowerProfile = () => {
    const { currentUser, showSuccess } = useStore();

    const handleAddBankAccount = () => {
        showSuccess("Account Link Requested", "The secure bank linking portal has been dispatched to your registered email.");
    };

    const handleAddCard = () => {
        showSuccess("Add Card", "Redirecting to PCI-compliant card registration gateway...");
    };

    return (
        <div className="container overflow-hidden" style={{ maxWidth: '100%' }}>
            <BackButton />
            <div className="mb-8">
                <h1 className="text-3xl font-black text-primary tracking-tight">My Profile</h1>
                <p className="text-secondary mt-2">Manage your account details and connected payment methods.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="saas-card lg:col-span-1 border-t-4 border-t-indigo-500">
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
                            <User size={48} className="text-indigo-500" />
                        </div>
                        <h2 className="text-2xl font-black text-primary">{currentUser?.name || "Borrower"}</h2>
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-bold uppercase mt-2 border border-indigo-500/20">
                            Verified Borrower
                        </span>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <div className="flex items-center gap-3 text-secondary">
                            <Mail size={18} className="text-indigo-500" />
                            <span>{currentUser?.email || "user@example.com"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-secondary">
                            <Calendar size={18} className="text-indigo-500" />
                            <span>Joined: {currentUser?.joinDate || "2024-01-01"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-secondary">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            <span>Status: {currentUser?.status?.toUpperCase() || "ACTIVE"}</span>
                        </div>
                    </div>
                </div>

                {/* Details & Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* EMI / Loan Actions */}
                    <div className="saas-card bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/10">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-indigo-500" /> Quick Applications
                        </h3>
                        <p className="text-secondary mb-6">Need a new line of credit? Use our quick application options.</p>
                        <div className="flex gap-4 flex-wrap">
                            <a href="/borrower/emi" className="btn btn-primary flex items-center gap-2">
                                Apply for EMI
                            </a>
                            <a href="/borrower/apply" className="btn btn-outline flex items-center gap-2">
                                Standard Loan
                            </a>
                        </div>
                    </div>

                    {/* Connected Accounts */}
                    <div className="saas-card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Landmark size={20} className="text-slate-500" /> Connected Methods
                        </h3>

                        <div className="space-y-4">
                            {/* Empty Bank State */}
                            <div className="flex items-center justify-between p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <Landmark size={20} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">No Bank Account Linked</p>
                                        <p className="text-xs text-secondary">Required for loan disbursement.</p>
                                    </div>
                                </div>
                                <button onClick={handleAddBankAccount} className="btn btn-outline text-sm flex items-center gap-2">
                                    <Plus size={16} /> Add Bank
                                </button>
                            </div>

                            {/* Empty Card State */}
                            <div className="flex items-center justify-between p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <CreditCard size={20} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">No Debit/Credit Card Linked</p>
                                        <p className="text-xs text-secondary">Used for automated EMI deductions.</p>
                                    </div>
                                </div>
                                <button onClick={handleAddCard} className="btn btn-outline text-sm flex items-center gap-2">
                                    <Plus size={16} /> Add Card
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowerProfile;
