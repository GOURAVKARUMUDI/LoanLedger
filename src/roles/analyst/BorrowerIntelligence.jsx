import React, { useState } from 'react';
import { User, Activity, AlertCircle, FileText, ChevronDown, ChevronRight, Download } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';

const BorrowerIntelligence = () => {
    const { users, loans } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');

    const [expandedBorrowerId, setExpandedBorrowerId] = useState(null);

    // Filter only borrowers
    const borrowers = (users || []).filter(u => u.role === 'borrower');

    const toggleBorrower = (id) => {
        if (expandedBorrowerId === id) {
            setExpandedBorrowerId(null);
        } else {
            setExpandedBorrowerId(id);
        }
    };

    if (borrowers.length === 0) {
        return (
            <div className="card text-center p-8 text-secondary">
                <p>No borrowers registered in the system yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {borrowers.map(borrower => {
                // Calculate borrower intel
                const borrowerRequests = loanRequests.filter(r => r.borrowerId === borrower.id);
                const borrowerLoans = (loans || []).filter(l => l.borrowerId === borrower.id);
                const isExpanded = expandedBorrowerId === borrower.id;

                const totalRequestedAmount = borrowerRequests.reduce((sum, r) => sum + Number(r.amount), 0);
                const totalActiveAmount = borrowerLoans.reduce((sum, l) => sum + Number(l.amount), 0);

                // Risk Assessment based on CIBIL and history
                const mockCibil = 650 + (borrowerLoans.length * 20) - (borrowerRequests.filter(r => r.status === 'rejected').length * 40);
                const boundedCibil = Math.max(300, Math.min(900, mockCibil));

                let riskLevel = 'Medium';
                let riskColor = 'text-yellow-600';
                if (boundedCibil >= 750) { riskLevel = 'Low Risk'; riskColor = 'text-green-600'; }
                else if (boundedCibil < 600) { riskLevel = 'High Risk'; riskColor = 'text-red-600'; }

                return (
                    <div key={borrower.id} className="card overflow-hidden">
                        {/* Summary Header */}
                        <div
                            className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-border flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => toggleBorrower(borrower.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full dark:bg-indigo-900/40">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{borrower.name}</h3>
                                    <p className="text-sm text-secondary">{borrower.email} • {borrower.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex flex-col text-right">
                                    <span className="text-xs text-secondary font-bold uppercase">Requests</span>
                                    <span className="font-bold">{borrowerRequests.length}</span>
                                </div>
                                <div className="hidden md:flex flex-col text-right">
                                    <span className="text-xs text-secondary font-bold uppercase">Active Debt</span>
                                    <span className="font-bold">{formatINR(totalActiveAmount)}</span>
                                </div>
                                <div className="text-secondary">
                                    {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Content */}
                        {isExpanded && (
                            <div className="p-6 bg-white dark:bg-slate-950">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <h4 className="text-sm font-bold text-secondary uppercase mb-2 flex items-center gap-2">
                                            <Activity size={16} /> Risk Classification
                                        </h4>
                                        <p className="text-2xl font-black mb-1">{boundedCibil}</p>
                                        <p className={`text-sm font-bold ${riskColor}`}>{riskLevel}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <h4 className="text-sm font-bold text-secondary uppercase mb-2">Loan Volume Requested</h4>
                                        <p className="text-2xl font-bold mb-1">{formatINR(totalRequestedAmount)}</p>
                                        <p className="text-sm text-secondary">{borrowerRequests.length} Total Requests</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <h4 className="text-sm font-bold text-secondary uppercase mb-2 flex items-center gap-2">
                                            <AlertCircle size={16} /> History
                                        </h4>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Approved:</span> <span className="font-bold text-emerald-600">{borrowerRequests.filter(r => r.status === 'analystApproved' || r.status === 'active').length}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Rejected:</span> <span className="font-bold text-red-600">{borrowerRequests.filter(r => r.status === 'rejected').length}</span>
                                        </div>
                                    </div>
                                </div>

                                {borrowerRequests.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-secondary uppercase mb-3 flex items-center gap-2">
                                            <FileText size={16} /> Request Ledger
                                        </h4>
                                        <div className="space-y-3">
                                            {borrowerRequests.map(req => (
                                                <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-border rounded-lg bg-white">
                                                    <div>
                                                        <span className="font-medium">{formatINR(req.amount)}</span>
                                                        <span className="text-sm text-secondary mx-2">•</span>
                                                        <span className="text-sm text-secondary">{req.purpose || 'General'}</span>
                                                    </div>
                                                    <div className="mt-2 md:mt-0 flex gap-4 items-center">
                                                        <span className="text-xs text-secondary">{req.type === 'preOffer' ? 'Pre-Offer' : 'Custom'}</span>
                                                        <StatusBadge status={req.status} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BorrowerIntelligence;
