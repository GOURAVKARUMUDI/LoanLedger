import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import { ExternalLink } from 'lucide-react';

const LenderActiveLoans = () => {
    const navigate = useNavigate();
    const { loans, currentUser } = useStore();


    // Relaxed filtering to allow dummy data IDs to populate the UI for demo purposes
    const activeLoans = (loans || []).filter(l => l.lenderId === currentUser?.id && l.status === 'active');

    return (
        <div className="container" style={{ maxWidth: '100%' }}>
            <h1 className="text-2xl font-bold mb-6">Active Loans Given</h1>

            {activeLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeLoans.map(loan => (
                        <div key={loan.id} className="card p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{loan.borrowerName}</h3>
                                    <span className="text-xs text-secondary">ID: {loan.id}</span>
                                </div>
                                <span className={`badge ${loan.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                                    {loan.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-secondary">Amount</span>
                                    <span className="font-bold">{formatINR(loan.amount)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-secondary">Interest</span>
                                    <span className="font-bold">{loan.interestRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-secondary">Progress</span>
                                    <span className="font-bold text-primary">{loan.progress}% Paid</span>
                                </div>
                            </div>

                            <div style={{ height: '0.5rem', backgroundColor: 'var(--border-color)', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem' }}>
                                <div style={{ width: `${loan.progress}%`, height: '100%', backgroundColor: 'var(--accent-color)' }}></div>
                            </div>

                            <button
                                onClick={() => navigate(`/lender/loans/${loan.id}`)}
                                className="btn btn-outline w-full flex items-center justify-center gap-2"
                            >
                                View Details <ExternalLink size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-6 text-center text-secondary">
                    <p>No active loans yet.</p>
                </div>
            )}
        </div>
    );
};

export default LenderActiveLoans;
