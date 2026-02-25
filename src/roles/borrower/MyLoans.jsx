import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoanCard from '../../components/common/LoanCard';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import BackButton from '../../components/common/BackButton';
import StatusBadge from '../../components/common/StatusBadge';

const MyLoans = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isRequestsView = location.pathname.includes('/requests');
    const { loans, currentUser } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');

    const [filter, setFilter] = useState(isRequestsView ? 'pending' : 'active'); // 'active', 'pending', or 'closed'

    // Strict filtering so users only see their own assigned loans
    const userLoans = (loans || []).filter(l => l.borrowerId === currentUser?.id);
    const userRequests = loanRequests.filter(r => r.borrowerId === currentUser?.id);

    let displayItems = [];
    if (filter === 'pending') {
        displayItems = userRequests.filter(r =>
            r.status.toLowerCase().includes('pending') ||
            r.status === 'analystApproved'
        );
    } else if (filter === 'rejected') {
        displayItems = userRequests.filter(r => r.status.toLowerCase().includes('reject'));
    } else {
        displayItems = userLoans.filter(loan =>
            filter === 'active' ? loan.status === 'active' : loan.status === 'closed'
        );
    }

    const handleViewDetails = (loanId) => {
        navigate(`/borrower/loans/${loanId}`);
    };

    return (
        <div className="container" style={{ maxWidth: '100%' }}>
            <BackButton />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{isRequestsView ? 'Loan Requests' : 'My Loans'}</h1>

                {/* Filter Toggle */}
                <div style={{ display: 'flex', backgroundColor: 'var(--surface-color)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    {!isRequestsView && (
                        <button
                            onClick={() => setFilter('active')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                backgroundColor: filter === 'active' ? 'var(--primary-color)' : 'transparent',
                                color: filter === 'active' ? 'white' : 'var(--text-secondary)',
                                transition: 'all 0.2s',
                            }}
                        >
                            Active Loans
                        </button>
                    )}
                    {isRequestsView && (
                        <button
                            onClick={() => setFilter('pending')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                backgroundColor: filter === 'pending' ? '#eab308' : 'transparent',
                                color: filter === 'pending' ? 'white' : 'var(--text-secondary)',
                                transition: 'all 0.2s',
                            }}
                        >
                            Pending Applications
                        </button>
                    )}
                    {isRequestsView && (
                        <button
                            onClick={() => setFilter('rejected')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                backgroundColor: filter === 'rejected' ? '#ef4444' : 'transparent',
                                color: filter === 'rejected' ? 'white' : 'var(--text-secondary)',
                                transition: 'all 0.2s',
                            }}
                        >
                            Rejected
                        </button>
                    )}
                    {!isRequestsView && (
                        <button
                            onClick={() => setFilter('closed')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                backgroundColor: filter === 'closed' ? 'var(--secondary-color)' : 'transparent',
                                color: filter === 'closed' ? 'white' : 'var(--text-secondary)',
                                transition: 'all 0.2s',
                            }}
                        >
                            Closed Loans
                        </button>
                    )}
                </div>
            </div>

            {displayItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayItems.map(item => (
                        <div key={item.id} className="relative">
                            <div className="absolute top-4 right-4 z-10">
                                <StatusBadge status={item.status} />
                            </div>
                            <LoanCard
                                loan={{
                                    ...item,
                                    formattedAmount: formatINR(item.amount),
                                    interestRate: item.interestRate || 'TBD',
                                    duration: item.duration || 'TBD',
                                    nextPayment: (filter === 'pending' || filter === 'rejected') ? item.status : (item.nextDueDate || 'Upcoming')
                                }}
                                role="borrower"
                                actionLabel={filter === 'active' ? "View Updates" : "View Details"}
                                onAction={() => handleViewDetails(item.id)}
                            />
                            {/* Tracker Info Below Card */}
                            {(filter === 'pending' || filter === 'rejected') && (
                                <div className="mt-2 text-xs flex justify-between bg-gray-50 border border-gray-100 rounded p-2">
                                    <div>
                                        <span className="text-secondary font-medium">Risk Stage:</span>{' '}
                                        <span className={`font-bold ${item.analystDecision === 'approve' ? 'text-green-600' :
                                            item.analystDecision === 'reject' ? 'text-red-600' :
                                                item.analystDecision === 'hold' ? 'text-yellow-600' : 'text-slate-600'
                                            }`}>{item.analystDecision?.toUpperCase() || 'PADDING'}</span>
                                    </div>
                                    <div>
                                        <span className="text-secondary font-medium">Lender Stage:</span>{' '}
                                        <span className={`font-bold ${item.lenderDecision === 'accept' ? 'text-green-600' :
                                            item.lenderDecision === 'reject' ? 'text-red-600' :
                                                item.lenderDecision === 'hold' ? 'text-yellow-600' : 'text-slate-600'
                                            }`}>{item.lenderDecision?.toUpperCase() || 'PENDING'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="saas-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8" /><path d="M12 17v4" />
                        </svg>
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>
                        {isRequestsView ? 'No Applications Found' : 'No Loans Found'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        {isRequestsView
                            ? "You haven't applied for any loans yet. Please show apply for a loan."
                            : "You don't have any active or closed loans at the moment."}
                    </p>
                    {isRequestsView && (
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/borrower/apply')}
                        >
                            Apply for Loan
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyLoans;
