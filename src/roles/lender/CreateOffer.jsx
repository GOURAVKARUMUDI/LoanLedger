import React, { useState } from 'react';
import { formatINR } from '../../utils/format';
import BackButton from '../../components/common/BackButton';
import useStore from '../../store/useStore';

const CreateOffer = () => {
    const { addLoanOffer, currentUser } = useStore();

    const [formData, setFormData] = useState({
        amount: '',
        interestRate: '',
        duration: '',
        maxBorrowers: '',
        description: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const offerData = {
            lenderId: currentUser?.id,
            lender: currentUser?.name || "Verified Lender",
            term: `${formData.duration} Months`,
            ...formData
        };

        addLoanOffer(offerData);
        setMessage({ type: 'success', text: 'Loan Offer Created Successfully!' });
        // Offer created successfully

        // Reset form after 2 seconds
        setTimeout(() => {
            setMessage({ type: '', text: '' });
            setFormData({
                amount: '',
                interestRate: '',
                duration: '',
                maxBorrowers: '',
                description: ''
            });
        }, 3000);
    };

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <BackButton />
            <h1 className="text-2xl font-bold mb-6">Create New Loan Offer</h1>

            {message.text && (
                <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="card p-8">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Loan Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="e.g. 500000"
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Interest Rate (%)</label>
                            <input
                                type="number"
                                name="interestRate"
                                value={formData.interestRate}
                                onChange={handleChange}
                                step="0.1"
                                placeholder="e.g. 8.5"
                                className="input"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Duration (Months)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g. 12"
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Max Borrowers</label>
                            <input
                                type="number"
                                name="maxBorrowers"
                                value={formData.maxBorrowers}
                                onChange={handleChange}
                                placeholder="e.g. 10"
                                className="input"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-secondary mb-1">Description / Terms</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe the loan terms and eligibility..."
                            className="input"
                            style={{ width: '100%', resize: 'vertical' }}
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary" style={{ minWidth: '150px' }}>
                            Create Offer
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Section */}
            {formData.amount && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4">Offer Preview</h3>
                    <div className="card p-6 border-l-4 border-accent">
                        <h4 className="font-bold text-xl mb-2">{formatINR(formData.amount)} Loan</h4>
                        <div className="flex gap-4 text-sm text-secondary mb-2">
                            <span>@ {formData.interestRate}% Interest</span>
                            <span>• {formData.duration} Months</span>
                        </div>
                        <p className="text-sm">{formData.description || 'No description yet.'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateOffer;
