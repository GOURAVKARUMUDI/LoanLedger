import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Briefcase, Phone, Mail } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';

const LenderLoanDetails = () => {
    const { loanId } = useParams();
    const navigate = useNavigate();
    const { loans } = useStore();


    const currentLoan = loans.find(l => l.id === loanId);
    const scheduleMock = currentLoan?.schedule || [
        { no: 1, date: 'Nov 15, 2023', amount: currentLoan ? currentLoan.emi || (currentLoan.amount / 12) : 0, status: 'Paid' },
        { no: 2, date: 'Dec 15, 2023', amount: currentLoan ? currentLoan.emi || (currentLoan.amount / 12) : 0, status: 'Upcoming' }
    ];

    const loan = currentLoan ? { ...currentLoan, schedule: scheduleMock } : null;

    if (!loan) {
        return (
            <div className="container text-center pt-20">
                <h2 className="text-2xl font-bold text-danger">Loan Not Found</h2>
                <button onClick={() => navigate('/lender/active-loans')} className="btn btn-outline mt-4">
                    Back to Active Loans
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '100%' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline mb-6"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={16} /> Back
            </button>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Loan Details: #{loan.id}</h1>
                    <span className={`badge ${loan.status === 'active' ? 'badge-success' : 'badge-neutral'} mt-2`}>
                        {loan.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Borrower Profile Card */}
                <div className="card p-6 lg:col-span-1">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User size={20} /> Borrower Profile
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-secondary">Name</p>
                            <p className="font-bold">{loan.borrowerName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-secondary flex items-center gap-2">
                                <Mail size={14} /> Email
                            </p>
                            <p className="text-sm">{loan.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-secondary flex items-center gap-2">
                                <Phone size={14} /> Phone
                            </p>
                            <p className="text-sm">{loan.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-secondary flex items-center gap-2">
                                <Briefcase size={14} /> Employment
                            </p>
                            <p className="text-sm">{loan.employment}</p>
                        </div>
                        <div>
                            <p className="text-sm text-secondary flex items-center gap-2">
                                <MapPin size={14} /> Address
                            </p>
                            <p className="text-sm">{loan.address}</p>
                        </div>
                        <div className="pt-4 border-t mt-4">
                            <p className="text-sm text-secondary">Credit Score</p>
                            <span className="badge badge-success">{loan.creditScore}</span>
                        </div>
                    </div>
                </div>

                {/* Loan Info & Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-secondary">Loan Amount</p>
                            <h3 className="text-2xl font-bold text-primary">{formatINR(loan.amount)}</h3>
                        </div>
                        <div>
                            <p className="text-sm text-secondary">Interest Rate</p>
                            <h3 className="text-2xl font-bold">{loan.interestRate}%</h3>
                        </div>
                        <div>
                            <p className="text-sm text-secondary">Duration</p>
                            <h3 className="text-2xl font-bold">{loan.duration} Months</h3>
                        </div>
                    </div>

                    <div className="card overflow-hidden" style={{ padding: 0 }}>
                        <h3 className="p-4 font-bold border-b bg-gray-50 m-0">Repayment Schedule</h3>
                        <div className="table-wrapper">
                            <div className="table-container border-0 rounded-none shadow-none">
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
                                        {loan.schedule.map((row) => (
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
            </div>
        </div>
    );
};

export default LenderLoanDetails;
