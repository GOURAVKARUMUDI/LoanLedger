import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import BorrowerEMICalculator from './BorrowerEMICalculator';

const CustomLoan = ({ formData }) => {
    const navigate = useNavigate();
    const { applyLoan, currentUser } = useStore();

    const [customDetails, setCustomDetails] = useState({
        desiredInterestRate: '',
        desiredDuration: '12'
    });
    const [calculatedEmi, setCalculatedEmi] = useState(0);

    const handleChange = (e) => {
        setCustomDetails({ ...customDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.annualIncome || !formData.purpose) {
            alert('Please fill out all common loan details (Income, Amount, Purpose) in the section above before submitting.');
            return;
        }

        if (!customDetails.desiredInterestRate) {
            alert('Please specify your desired interest rate.');
            return;
        }

        applyLoan({
            isCustom: true,
            type: 'custom',
            requestedInterestRate: Number(customDetails.desiredInterestRate),
            duration: Number(customDetails.desiredDuration),
            borrowerName: currentUser.name || 'Unknown Borrower',
            borrowerId: currentUser.id || 'unknown',
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
            expectedEmi: calculatedEmi
        });

        alert("Custom Application Submitted! Analyst will review and negotiate shortly.");
        navigate('/borrower/dashboard');
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800 mb-2">
                <strong>Custom Loans</strong> allow you to set your own terms. A Financial Analyst will review your profile and negotiate the final interest rate before passing it to lenders.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)', marginBottom: '0.25rem' }}>Desired Interest Rate (%)</label>
                    <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                        <input type="number" step="0.1" name="desiredInterestRate" value={customDetails.desiredInterestRate} onChange={handleChange} className="input" placeholder="e.g. 5.5" required />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)', marginBottom: '0.25rem' }}>Desired Duration (Months)</label>
                    <select name="desiredDuration" value={customDetails.desiredDuration} onChange={handleChange} className="input">
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                        <option value="24">24 Months</option>
                        <option value="36">36 Months</option>
                    </select>
                </div>
            </div>

            <div className="mt-2 mb-2">
                <BorrowerEMICalculator
                    initialPrincipal={formData?.amount}
                    initialInterestRate={customDetails.desiredInterestRate}
                    initialDuration={customDetails.desiredDuration}
                    monthlyIncome={Number(formData.annualIncome) / 12}
                    onCalculate={(emi) => setCalculatedEmi(emi)}
                />
            </div>

            <div className="flex items-start">
                <div style={{ display: 'flex', alignItems: 'center', height: '1.25rem' }}>
                    <input id="terms_custom" name="terms" type="checkbox" style={{ height: '1rem', width: '1rem', color: 'var(--primary-color)', borderRadius: '0.25rem', border: '1px solid var(--border-color)' }} required />
                </div>
                <div style={{ marginLeft: '0.75rem', fontSize: '0.875rem' }}>
                    <label htmlFor="terms_custom" style={{ fontWeight: 500, color: 'var(--text-color)' }}>I agree to the terms and conditions</label>
                    <p className="text-secondary">I understand the final rate is subject to Analyst approval and Lender funding.</p>
                </div>
            </div>

            <div style={{ paddingTop: '1rem' }}>
                <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white" style={{ width: '100%', padding: '0.75rem' }}>
                    Submit Custom Request
                </button>
            </div>
        </form>
    );
};

export default CustomLoan;
