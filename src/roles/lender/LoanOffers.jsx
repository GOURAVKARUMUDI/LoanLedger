import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, CheckCircle } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';

const LoanOffers = () => {
    const navigate = useNavigate();
    const { offers } = useStore();


    // Borrower only sees approved (available) offers
    const approvedOffers = (offers || []).filter(o => o.status === 'available' || o.status === 'approved');

    return (
        <div className="container fade-in" style={{ maxWidth: '100%' }}>
            <h1 className="text-2xl font-bold">Available Loan Offers</h1>
            <p className="text-secondary mb-6">Explore competitive loan offers tailored to your needs by our Verified Lenders.</p>

            {approvedOffers.length === 0 ? (
                <div className="card text-center p-8 bg-gray-50 text-gray-500">
                    <p>No new approved loan offers are currently available on the market.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedOffers.map((offer) => (
                        <div key={offer.id} className="card p-6" style={{ transition: 'box-shadow 0.2s', ':hover': { boxShadow: 'var(--shadow-md)' } }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold">{offer.lender}</h3>
                                    <p className="text-sm text-secondary">{offer.description || 'Pre-Approved Personal Loan'}</p>
                                </div>
                                <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--surface-color)' }}>
                                    <DollarSign size={24} style={{ color: 'var(--success-color)' }} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div>
                                    <p className="text-xs text-secondary uppercase tracking-wider">Amount</p>
                                    <p className="font-semibold">{formatINR(offer.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary uppercase tracking-wider">Interest</p>
                                    <p className="font-semibold" style={{ color: 'var(--success-color)' }}>{offer.interestRate}%</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-secondary uppercase tracking-wider">Tenure</p>
                                    <p className="font-semibold">{offer.term || offer.duration}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/borrower/apply', { state: { selectedOffer: offer } })}
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1.5rem' }}
                            >
                                Apply Now <CheckCircle size={16} style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LoanOffers;
