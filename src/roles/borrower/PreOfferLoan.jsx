import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import BorrowerEMICalculator from './BorrowerEMICalculator';

// Simple helper to calculate available cap
const getAvailableCapital = (lenderName, loans) => {
    const initialCapital = 500000;
    const fundedAmount = loans
        .filter(l => l.lender === lenderName && l.status === 'active')
        .reduce((sum, l) => sum + Number(l.amount), 0);
    return initialCapital - fundedAmount;
};

const PreOfferLoan = ({ formData }) => {
    const navigate = useNavigate();
    const { addLoanRequest, currentUser, offers, loans } = useStore();

    const [selectedOffer, setSelectedOffer] = useState(null);
    const [calculatedEmi, setCalculatedEmi] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.annualIncome || !formData.purpose) {
            alert('Please fill out all common loan details (Income, Amount, Purpose) in the section above before submitting.');
            return;
        }

        if (!selectedOffer) {
            alert('Please select a loan offer before applying.');
            return;
        }

        if (Number(formData.amount) > getAvailableCapital(selectedOffer.lender, loans)) {
            alert(`Requested amount exceeds lender's available capital (${getAvailableCapital(selectedOffer.lender, loans)}).`);
            return;
        }

        addLoanRequest({
            isCustom: false,
            type: 'preOffer',
            borrowerName: currentUser.name || 'Unknown Borrower',
            email: currentUser.email || 'unknown@example.com',
            phone: currentUser.phone || '000-000-0000',
            employment: formData.employment,
            annualIncome: Number(formData.annualIncome),
            amount: Number(formData.amount),
            purpose: formData.purpose,
            cibilScore: Math.floor(Math.random() * (850 - 600 + 1)) + 600,
            latePayments: Math.floor(Math.random() * 4),
            totalPaymentsMade: Math.floor(Math.random() * 20) + 5,
            existingLoansCount: Math.floor(Math.random() * 3),
            activeDebt: Math.floor(Math.random() * 50000),
            address: 'Verified Address On File',
            offerSelected: `${selectedOffer.lender} - ${selectedOffer.interestRate}% for ${selectedOffer.duration}m`,
            lenderName: selectedOffer.lender,
            interestRate: selectedOffer.interestRate,
            duration: selectedOffer.duration,
            expectedEmi: calculatedEmi
        });

        alert("Application Submitted! Redirecting to Dashboard.");
        navigate('/borrower/dashboard');
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)', marginBottom: '0.75rem' }}>Select a Pre-Approved Loan Offer</label>
                {(offers || []).filter(o => o.status === 'approved').length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {(offers || []).filter(o => o.status === 'approved').map((offer) => {
                            const availableCap = getAvailableCapital(offer.lender, loans);
                            const isSelected = selectedOffer?.id === offer.id;

                            return (
                                <div
                                    key={offer.id}
                                    onClick={() => setSelectedOffer(offer)}
                                    style={{
                                        padding: '1rem',
                                        border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? 'var(--surface-color, #f0f9ff)' : 'var(--bg)',
                                        transition: 'all 0.2s'
                                    }}
                                    className="hover:border-blue-300"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">{offer.lender}</span>
                                        <span className="badge badge-info">{offer.interestRate}% APR</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm text-secondary">
                                        <div>Max: ₹{offer.maxAmount?.toLocaleString() || offer.amount?.toLocaleString()}</div>
                                        <div>Term: {offer.duration} mos</div>
                                        <div className={availableCap < Number(formData.amount || 0) ? 'text-red-500 font-bold' : 'text-green-600'}>
                                            Avail Cap: ₹{availableCap.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-4 border rounded-lg text-center text-secondary text-sm" style={{ background: 'var(--surface-color)', borderColor: 'var(--border)' }}>
                        No loan offers available at this time.
                    </div>
                )}
            </div>

            {selectedOffer && (
                <div className="mt-2 mb-2">
                    <BorrowerEMICalculator
                        initialPrincipal={formData?.amount}
                        initialInterestRate={selectedOffer.interestRate}
                        initialDuration={selectedOffer.duration}
                        monthlyIncome={Number(formData.annualIncome) / 12}
                        onCalculate={(emi) => setCalculatedEmi(emi)}
                    />
                </div>
            )}

            <div className="flex items-start">
                <div style={{ display: 'flex', alignItems: 'center', height: '1.25rem' }}>
                    <input id="terms" name="terms" type="checkbox" style={{ height: '1rem', width: '1rem', color: 'var(--primary-color)', borderRadius: '0.25rem', border: '1px solid var(--border-color)' }} required />
                </div>
                <div style={{ marginLeft: '0.75rem', fontSize: '0.875rem' }}>
                    <label htmlFor="terms" style={{ fontWeight: 500, color: 'var(--text-color)' }}>I agree to the terms and conditions</label>
                    <p className="text-secondary">I declare that the information provided is accurate and complete.</p>
                </div>
            </div>

            <div style={{ paddingTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                    Submit Pre-Offer Application
                </button>
            </div>
        </form>
    );
};

export default PreOfferLoan;
