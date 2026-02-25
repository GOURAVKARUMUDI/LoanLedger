import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, DollarSign } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import BackButton from '../../components/common/BackButton';

const LoanDetails = () => {
    const { loanId } = useParams();
    const { loans } = useStore();


    const loan = loans.find(l => l.id === loanId);

    if (!loan) {
        return (
            <div className="container text-center pt-20">
                <h2 className="text-2xl font-bold text-danger">Loan Not Found</h2>
                <div className="mt-4"><BackButton /></div>
            </div>
        );
    }

    // Dummy Payment Schedule Generator
    const schedule = Array.from({ length: 5 }, (_, i) => ({
        no: i + 1,
        date: i === 0 ? '15 Oct 2023' : `15 ${['Nov', 'Dec', 'Jan', 'Feb'][i - 1]} ${i > 2 ? '2024' : '2023'}`,
        amount: loan.emi,
        status: i === 0 ? 'Paid' : 'Pending'
    }));

    return (
        <div className="container" style={{ maxWidth: '100%' }}>
            <BackButton />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Loan Details: #{loan.id}</h1>
                    <span className={`badge ${loan.status === 'active' ? 'badge-success' : 'badge-neutral'} mt-2`}>
                        {loan.status.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Loan Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6">
                    <p className="text-secondary text-sm">Loan Amount</p>
                    <h3 className="text-2xl font-bold text-primary mt-1">{formatINR(loan.amount)}</h3>
                </div>
                <div className="card p-6">
                    <p className="text-secondary text-sm">Monthly EMI</p>
                    <h3 className="text-2xl font-bold text-primary mt-1">{formatINR(loan.emi)}</h3>
                </div>
                <div className="card p-6">
                    <p className="text-secondary text-sm">Interest Rate</p>
                    <h3 className="text-2xl font-bold text-primary mt-1">{loan.interestRate}%</h3>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="card p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">Repayment Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-secondary">Duration</p>
                        <p className="font-medium">{loan.duration} Months</p>
                    </div>
                    <div>
                        <p className="text-sm text-secondary">Disbursed On</p>
                        <p className="font-medium">{loan.disbursedDate}</p>
                    </div>
                    <div>
                        <p className="text-sm text-secondary">Total Paid</p>
                        <p className="font-medium text-success">{formatINR(loan.totalPaid)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-secondary">Remaining Amount</p>
                        <p className="font-medium">{formatINR(loan.remainingAmount)}</p>
                    </div>
                </div>

                {/* Progress Bar (simplified) */}
                <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round((loan.totalPaid / (loan.amount + (loan.amount * loan.interestRate / 100))) * 100)}% Paid</span>
                    </div>
                    <div style={{ height: '0.5rem', backgroundColor: 'var(--border-color)', borderRadius: '1rem', overflow: 'hidden' }}>
                        <div style={{ width: `${(loan.totalPaid / loan.amount) * 100}%`, height: '100%', backgroundColor: 'var(--primary-color)' }}></div>
                    </div>
                </div>
            </div>

            {/* Payment Schedule Table */}
            <h3 className="text-xl font-bold mb-4">Payment Schedule</h3>
            <div className="card overflow-hidden" style={{ padding: 0 }}>
                <div className="table-wrapper">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Inst. No</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((row) => (
                                    <tr key={row.no}>
                                        <td>{row.no}</td>
                                        <td>{row.date}</td>
                                        <td>{formatINR(row.amount)}</td>
                                        <td>
                                            <span className={`badge ${row.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanDetails;
