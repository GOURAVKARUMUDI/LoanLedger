import React, { useState } from 'react';
import { Check, X, User, ShieldAlert, Clock } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import BackButton from '../../components/common/BackButton';
import StatusBadge from '../../components/common/StatusBadge';
import LenderEarningsCalculator from './LenderEarningsCalculator';

const LenderRequests = () => {
    const { acceptRequest, rejectRequest, holdRequest, currentUser, lenderBalances, loans } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');

    const [selectedRequest, setSelectedRequest] = useState(null);

    // Get available capital from context, fallback to 5M for UI testing
    const availableCapital = lenderBalances[currentUser.name] || 5000000;

    // Filter requests: Must be approved by analyst AND not exceed our capital
    const eligibleRequests = loanRequests.filter(req =>
        req.status === 'analystApproved' &&
        (!req.lenderName || req.lenderName === currentUser.name || req.isCustom) &&
        Number(req.amount) <= availableCapital
    );

    const handleAction = (id, action) => {
        if (action === 'accept') {
            acceptRequest(id);
        } else if (action === 'reject') {
            rejectRequest(id);
        } else if (action === 'hold') {
            holdRequest(id);
        }
        setSelectedRequest(null);
    };

    return (
        <div className="container" style={{ maxWidth: '100%' }}>
            <BackButton />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Loan Requests</h1>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold">
                    Available Capital: {formatINR(availableCapital)}
                </div>
            </div>

            <div className="card overflow-hidden" style={{ padding: 0 }}>
                {eligibleRequests.length > 0 ? (
                    <div className="table-wrapper">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Borrower</th>
                                        <th>Amount</th>
                                        <th>Select Offer</th>
                                        <th>Risk Status</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eligibleRequests.map((req) => (
                                        <tr key={req.id}>
                                            <td>
                                                <div className="font-bold">{req.borrowerName}</div>
                                                <div className="text-xs text-secondary">{req.email}</div>
                                            </td>
                                            <td>{formatINR(req.amount)}</td>
                                            <td className="text-sm">
                                                {req.isCustom ? (
                                                    <span className="font-bold text-indigo-700">Custom Rate: {req.requestedInterestRate}%</span>
                                                ) : (
                                                    req.offerSelected || <span className="text-gray-400 italic">No offer selected</span>
                                                )}
                                            </td>
                                            <td>
                                                <StatusBadge status={req.riskStatus === 'low' ? 'low risk' : req.riskStatus === 'high' ? 'high risk' : req.riskStatus} />
                                            </td>
                                            <td>
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td>
                                                {req.status === 'analystApproved' ? (
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => setSelectedRequest(req)}
                                                    >
                                                        Review
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-secondary">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-secondary">
                        <p>No eligible loan requests found awaiting your approval.</p>
                        <p className="text-sm mt-2">Requests only appear here if they are 'Approved by Analyst' and within your Available Capital.</p>
                    </div>
                )}
            </div>

            {/* Borrower Profile Modal */}
            {selectedRequest && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                }}>
                    <div className="card p-6" style={{ width: '100%', maxWidth: '600px', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <User size={20} /> Review Request
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-secondary">Borrower</p>
                                <p className="font-medium">{selectedRequest.borrowerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Amount</p>
                                <p className="font-medium">{formatINR(selectedRequest.amount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Purpose</p>
                                <p className="font-medium">{selectedRequest.purpose}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Record Quality</p>
                                <p className="font-medium"><span className="badge badge-info">{selectedRequest.cibilScore || selectedRequest.creditScore}</span></p>
                            </div>
                        </div>

                        {selectedRequest.isCustom && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                                <div>
                                    <p className="text-sm text-indigo-700 font-bold uppercase">Requested Rate</p>
                                    <p className="text-2xl font-bold text-indigo-900">{selectedRequest.requestedInterestRate}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-indigo-700 font-bold uppercase">Analyst Recommended</p>
                                    <p className={`text-2xl font-bold ${selectedRequest.analystRecommendedRate ? 'text-green-700' : 'text-gray-500 italic'}`}>
                                        {selectedRequest.analystRecommendedRate ? `${selectedRequest.analystRecommendedRate}%` : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Earnings Calculator */}
                        <div className="mb-6">
                            <LenderEarningsCalculator
                                principal={selectedRequest.amount}
                                interestRate={selectedRequest.isCustom ? (selectedRequest.analystRecommendedRate || selectedRequest.requestedInterestRate) : selectedRequest.interestRate}
                                duration={selectedRequest.duration}
                            />
                        </div>

                        {/* Risk Assessment Section for Lender */}
                        <div className="bg-slate-50 p-4 rounded-lg border mb-6">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <ShieldAlert size={16} /> Analyst Risk Assessment
                            </h3>
                            {selectedRequest.analystDecision ? (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-secondary">Risk Level:</span>
                                        <span className={`badge ${selectedRequest.analystDecision === 'approve' ? 'badge-success' :
                                            selectedRequest.analystDecision === 'reject' ? 'badge-danger' : 'badge-warning'
                                            }`}>
                                            {selectedRequest.analystDecision.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 bg-white p-3 rounded border">
                                        "{selectedRequest.riskReport}"
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">Pending analysis by Financial Analyst.</p>
                            )}
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button
                                className="btn btn-outline hover:bg-yellow-50 text-slate-600 hover:text-yellow-600 hover:border-yellow-200"
                                onClick={() => handleAction(selectedRequest.id, 'hold')}
                            >
                                <Clock size={16} className="inline mr-1" /> Put On Hold
                            </button>
                            <button
                                className="btn btn-outline hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                onClick={() => handleAction(selectedRequest.id, 'reject')}
                            >
                                <X size={16} className="inline mr-1" /> Reject
                            </button>
                            <button
                                className="btn btn-primary bg-green-600 hover:bg-green-700 border-green-600"
                                onClick={() => handleAction(selectedRequest.id, 'accept')}
                            >
                                <Check size={16} className="inline mr-1" /> Accept
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={() => setSelectedRequest(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LenderRequests;
