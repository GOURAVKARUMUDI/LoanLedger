import React from 'react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import BackButton from '../../components/common/BackButton';
import { Check, X } from 'lucide-react';

const LenderPayments = () => {
    const { payments, verifyPayment, rejectPayment, currentUser } = useStore();


    // Ensure we only see payments belonging to this lender's funded loans
    const lenderPayments = (payments || []).filter(p => p.lenderId === currentUser?.name);

    return (
        <div className="container" style={{ maxWidth: '100%' }}>
            <BackButton />
            <h1 className="text-2xl font-bold mb-6">Payment Verification</h1>

            <div className="card p-0 overflow-hidden" style={{ padding: 0 }}>
                <div className="table-wrapper">
                    <div className="table-container border-0 rounded-none shadow-none">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Borrower</th>
                                    <th>Loan ID</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lenderPayments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="font-medium">{payment.borrower}</td>
                                        <td className="text-secondary">{payment.loanId}</td>
                                        <td className="font-medium text-primary">{formatINR(payment.amount)}</td>
                                        <td className="text-secondary">{payment.date}</td>
                                        <td>
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {payment.status === 'Under Review' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => verifyPayment(payment.id)}
                                                        className="btn btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                                        style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                                                        title="Verify Payment"
                                                    >
                                                        <Check size={16} /> <span className="hidden md:inline ml-1">Verify</span>
                                                    </button>
                                                    <button
                                                        onClick={() => rejectPayment(payment.id)}
                                                        className="btn btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                                        style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                                                        title="Reject Payment"
                                                    >
                                                        <X size={16} /> <span className="hidden md:inline ml-1">Reject</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Actioned</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {lenderPayments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center' }} className="text-secondary">
                                            <p className="mb-2">No payments found requiring verification.</p>
                                            <p className="text-sm">Payments from borrowers you have funded will appear here.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LenderPayments;
