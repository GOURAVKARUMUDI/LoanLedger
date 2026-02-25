import React, { useState } from 'react';
import { Search, User, Key, AlertTriangle, CheckCircle, Clock, Download } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import BackButton from '../../components/common/BackButton';

const AnalystBorrowers = () => {
    const { users, loans, payments } = useStore();

    const [searchTerm, setSearchTerm] = useState('');

    // Filter to only true borrowers who have taken a loan or are marked as borrower role
    // For this simulation, we'll grab anyone who has an active/closed loan or role='borrower'
    const borrowers = (users || []).filter(u => u.role === 'borrower' || loans.some(l => l.email === u.email));

    const computeBorrowerProfile = (email) => {
        const userLoans = (loans || []).filter(l => l.email === email);
        const userPayments = (payments || []).filter(p => userLoans.some(l => l.id === p.loanId));

        const totalBorrowed = userLoans.reduce((sum, l) => sum + Number(l.amount), 0);
        const activeLoansCount = userLoans.filter(l => l.status === 'active').length;

        const latePayments = userPayments.filter(p => p.status === 'Late').length;
        const rejectedPayments = userPayments.filter(p => p.status === 'Rejected').length;
        const totalPaymentsMade = userPayments.filter(p => p.status === 'Verified' || p.status === 'completed').length;

        // Dynamic Risk Tagging Logic based on history
        let riskTag = 'Low Risk';
        let riskColor = 'bg-emerald-100 text-emerald-700';

        if (latePayments > 0 || rejectedPayments > 0) {
            riskTag = 'High Risk';
            riskColor = 'bg-red-100 text-red-700';
        } else if (activeLoansCount > 2 || totalBorrowed > 200000) {
            riskTag = 'Moderate Risk';
            riskColor = 'bg-yellow-100 text-yellow-700';
        }

        return { totalBorrowed, activeLoansCount, latePayments, totalPaymentsMade, riskTag, riskColor };
    };

    const filteredBorrowers = borrowers.filter(b =>
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadReport = (borrower, profile) => {
        const reportData = {
            borrowerName: borrower.name,
            borrowerEmail: borrower.email,
            platformMemberSince: borrower.joinDate || '2024-01-01',
            riskStatus: profile.riskTag,
            financials: {
                totalBorrowed: profile.totalBorrowed,
                activeLoansCount: profile.activeLoansCount,
                successfulPayments: profile.totalPaymentsMade,
                lateMissedPayments: profile.latePayments
            },
            generatedAt: new Date().toISOString()
        };

        const jsonString = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `RiskReport_${borrower.name.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container" style={{ maxWidth: '100%', paddingBottom: '4rem' }}>
            <BackButton />
            <h1 className="text-2xl font-bold mb-6">Borrower Intelligence</h1>

            <div className="card p-6 mb-6 bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-1/2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search borrowers by name or email..."
                        className="input pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-secondary">
                    Showing profile data for <strong>{filteredBorrowers.length}</strong> registered borrowers.
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBorrowers.map((borrower, idx) => {
                    const profile = computeBorrowerProfile(borrower.email);

                    return (
                        <div key={idx} className="card p-0 bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                                        {borrower.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{borrower.name}</h3>
                                        <p className="text-sm text-gray-500">{borrower.email}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile.riskColor}`}>
                                    {profile.riskTag}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="p-6 grid grid-cols-2 gap-4 flex-grow">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 mb-1">Total Borrowed</p>
                                    <h4 className="font-bold text-lg text-gray-800">{formatINR(profile.totalBorrowed)}</h4>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 mb-1">Active Loans</p>
                                    <h4 className="font-bold text-lg text-gray-800">{profile.activeLoansCount}</h4>
                                </div>
                                <div className="col-span-2 mt-2">
                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Behavior</h5>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded border border-green-100 flex-1">
                                            <CheckCircle size={16} className="text-green-500" />
                                            <div>
                                                <p className="text-xs text-green-700 font-medium">Successful</p>
                                                <p className="font-bold text-green-800">{profile.totalPaymentsMade}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded border border-red-100 flex-1">
                                            <AlertTriangle size={16} className="text-red-500" />
                                            <div>
                                                <p className="text-xs text-red-700 font-medium">Late/Missed</p>
                                                <p className="font-bold text-red-800">{profile.latePayments}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                <span className="flex items-center gap-1 text-gray-500 font-medium">
                                    <Key size={14} /> Verified Identity
                                </span>
                                <button
                                    onClick={() => downloadReport(borrower, profile)}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                                >
                                    <Download size={14} /> Download Report
                                </button>
                            </div>
                        </div>
                    );
                })}
                {filteredBorrowers.length === 0 && (
                    <div className="col-span-full card p-10 text-center text-gray-500 flex flex-col items-center justify-center">
                        <User size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-700 mb-2">No Borrowers Found</h3>
                        <p>We couldn't find any borrowers matching your search criteria.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AnalystBorrowers;
