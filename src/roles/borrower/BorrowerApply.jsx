import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useStore from '../../store/useStore';
import PreOfferLoan from './PreOfferLoan';
import CustomLoan from './CustomLoan';

const BorrowerApply = () => {
    const navigate = useNavigate();
    const { currentUser } = useStore();

    const [mode, setMode] = useState('preOffer'); // 'preOffer' or 'custom'

    // Controlled Form State for shared basic details
    const [formData, setFormData] = useState({
        employment: 'Employed Full-Time',
        annualIncome: '',
        amount: '',
        purpose: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 500 }}
                onMouseEnter={(e) => e.target.style.color = '#374151'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
                <ArrowLeft size={16} style={{ marginRight: '0.25rem' }} /> Back to Dashboard
            </button>

            <div className="card p-6" style={{ padding: '2rem' }}>
                <h1 className="text-2xl font-bold mb-6">Loan Application</h1>

                {/* Common Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', mb: '2rem' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)', marginBottom: '0.25rem' }}>Full Name</label>
                            <input type="text" defaultValue={currentUser?.name || "Guest User"} className="input" readOnly />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)', marginBottom: '0.25rem' }}>Employment Status</label>
                            <select name="employment" value={formData.employment} onChange={handleChange} className="input">
                                <option>Employed Full-Time</option>
                                <option>Self-Employed</option>
                                <option>Unemployed</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)', marginBottom: '0.25rem' }}>Annual Income (₹)</label>
                            <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                                <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>₹</span>
                                </div>
                                <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} className="input" style={{ paddingLeft: '1.75rem' }} placeholder="0.00" required />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)', marginBottom: '0.25rem' }}>Loan Amount Requested (₹)</label>
                            <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                                <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>₹</span>
                                </div>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input" style={{ paddingLeft: '1.75rem' }} placeholder="5000" required />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)', marginBottom: '0.25rem' }}>Purpose of Loan</label>
                        <textarea name="purpose" value={formData.purpose} onChange={handleChange} rows={2} className="input" placeholder="Briefly describe why you need this loan..." required></textarea>
                    </div>
                </div>

                {/* Tabs / Mode Selection */}
                <div className="flex gap-4 mb-6 mt-6 border-b border-gray-200 pb-4">
                    <button
                        className={`px-4 py-2 font-bold rounded ${mode === 'preOffer' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setMode('preOffer')}
                        type="button"
                    >
                        Pre-Offered Loans
                    </button>
                    <button
                        className={`px-4 py-2 font-bold rounded ${mode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setMode('custom')}
                        type="button"
                    >
                        Custom Loan
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                    {mode === 'preOffer' ? (
                        <PreOfferLoan formData={formData} />
                    ) : (
                        <CustomLoan formData={formData} />
                    )}
                </div>

            </div>
        </div>
    );
};

export default BorrowerApply;
