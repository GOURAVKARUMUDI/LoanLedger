import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Save } from 'lucide-react';
import useStore from '../../store/useStore';
import BackButton from '../../components/common/BackButton';

const AddFunds = () => {
    const navigate = useNavigate();
    const { currentUser, addFunds, lenderBalances } = useStore();

    const [amount, setAmount] = useState('');
    const [source, setSource] = useState('Bank Transfer');
    const [submitted, setSubmitted] = useState(false);

    const currentBalance = lenderBalances[currentUser?.name] || 0;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        addFunds(currentUser?.name, amount);
        setSubmitted(true);

        setTimeout(() => {
            navigate('/lender/dashboard');
        }, 2000);
    };

    if (submitted) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '5rem 0', textAlign: 'center' }}>
                <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--surface-color)', marginBottom: '1.5rem', border: '1px solid var(--accent-color)' }}>
                    <Save size={48} style={{ color: 'var(--accent-color)' }} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Funds Added Successfully!</h2>
                <p className="text-secondary">Your available capital has been updated. Redirecting...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <BackButton />

            <div className="card p-6" style={{ padding: '2rem' }}>
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-700">
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Add Lending Capital</h1>
                        <p className="text-sm text-secondary">Current Balance: <span className="font-bold" style={{ color: 'var(--text)' }}>₹{currentBalance.toLocaleString()}</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Amount to Add (₹)</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>₹</span>
                            </div>
                            <input
                                type="number"
                                className="input text-lg font-bold"
                                style={{ paddingLeft: '2rem' }}
                                placeholder="100000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Funding Source</label>
                        <select
                            className="input"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        >
                            <option>Bank Transfer (RTGS/NEFT)</option>
                            <option>UPI ID Linked</option>
                            <option>Corporate Treasury</option>
                        </select>
                    </div>

                    <div className="flex items-start p-4 rounded-lg border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '1.25rem', marginTop: '0.125rem' }}>
                            <input id="terms" type="checkbox" className="h-4 w-4 text-primary rounded" style={{ borderColor: 'var(--border)' }} required />
                        </div>
                        <div style={{ marginLeft: '0.75rem', fontSize: '0.875rem' }}>
                            <label htmlFor="terms" className="font-bold" style={{ color: 'var(--text)' }}>Acknowledgement</label>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>I understand that adding funds to my lender account increases my capacity to fund loan requests across the platform. This is an irreversible action.</p>
                        </div>
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }} className="flex justify-end gap-3">
                        <button type="button" onClick={() => navigate('/lender/dashboard')} className="btn btn-outline">
                            Cancel
                        </button>
                        <button type="submit" className="btn bg-green-600 hover:bg-green-700 border-green-600 text-white flex items-center gap-2">
                            <DollarSign size={18} /> Confirm Deposit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFunds;
