import React from 'react';
import { BadgeCheck, Clock, DollarSign, Calendar } from 'lucide-react';
import { formatINR } from '../../utils/format';

const LoanCard = ({ loan, actionLabel, onAction }) => {
    const { id, amount, interestRate, duration, status, borrowerName, date } = loan;

    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return 'badge badge-success';
            case 'pending': return 'badge badge-warning';
            case 'closed': return 'badge badge-neutral';
            case 'rejected': return 'badge badge-danger';
            default: return 'badge badge-neutral';
        }
    };

    return (
        <div className="card p-6" style={{ transition: 'box-shadow 0.2s', ':hover': { boxShadow: 'var(--shadow-md)' } }}>
            <div className="flex justify-between" style={{ alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <span className={getStatusClass(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <h4 className="font-bold text-lg mt-4" style={{ marginTop: '0.5rem' }}>Loan #{id}</h4>
                    {borrowerName && <p className="text-sm text-secondary">Borrower: {borrowerName}</p>}
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{formatINR(amount)}</div>
                    <div className="text-sm text-secondary">{interestRate}% Interest</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-secondary">
                <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: '#9ca3af' }} />
                    <span>{duration} Months</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: '#9ca3af' }} />
                    <span>{date}</span>
                </div>
            </div>

            {onAction && (
                <button
                    onClick={() => onAction(id)}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                >
                    {actionLabel || 'View Details'}
                </button>
            )}
        </div>
    );
};

export default LoanCard;
