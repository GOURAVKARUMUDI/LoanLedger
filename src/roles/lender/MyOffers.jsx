import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { formatINR } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import BackButton from '../../components/common/BackButton';
import { Edit3, CheckCircle, Clock } from 'lucide-react';

const MyOffers = () => {
    const { offers, currentUser, editLoanOffer } = useStore();

    const [editingOffer, setEditingOffer] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Relaxed filtering to allow dummy data IDs to populate the UI for demo purposes
    const myOffers = (offers || []).filter(o => o.lenderId === currentUser?.id || String(o.lenderId).startsWith('lender'));

    const handleEditClick = (offer) => {
        setEditingOffer(offer);
        setEditFormData({
            amount: offer.amount,
            interestRate: offer.interestRate,
            duration: offer.duration,
            maxBorrowers: offer.maxBorrowers,
            description: offer.description
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editLoanOffer(editingOffer.id, editFormData);
        setEditingOffer(null);
        alert('Offer updated and sent back for analyst review!');
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '100%' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Loan Offers</h1>
                <p className="text-secondary font-medium">Manage your active, pending, and revised offers.</p>
            </div>

            {editingOffer ? (
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Edit3 className="text-primary" /> Edit Offer: {editingOffer.id}
                    </h2>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded text-orange-800 mb-6">
                        <strong>Analyst Note: </strong> {editingOffer.suggestionNote}
                    </div>

                    <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={editFormData.amount}
                                    onChange={handleEditChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Interest Rate (%)</label>
                                <input
                                    type="number"
                                    name="interestRate"
                                    value={editFormData.interestRate}
                                    onChange={handleEditChange}
                                    step="0.1"
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Duration (Months)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={editFormData.duration}
                                    onChange={handleEditChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Max Borrowers</label>
                                <input
                                    type="number"
                                    name="maxBorrowers"
                                    value={editFormData.maxBorrowers}
                                    onChange={handleEditChange}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary mb-1">Description / Terms</label>
                            <textarea
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditChange}
                                rows="3"
                                className="input"
                                style={{ width: '100%', resize: 'vertical' }}
                                required
                            />
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button type="button" onClick={() => setEditingOffer(null)} className="btn btn-outline hover:bg-gray-100">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save & Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myOffers.length > 0 ? (
                        myOffers.map(offer => (
                            <div key={offer.id} className="card p-6 border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg">{formatINR(offer.amount)}</h3>
                                    <StatusBadge status={offer.status} />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-secondary mb-4">
                                    <div>
                                        <p className="uppercase text-xs font-semibold mb-1">Interest</p>
                                        <p className="font-bold text-primary">{offer.interestRate}%</p>
                                    </div>
                                    <div>
                                        <p className="uppercase text-xs font-semibold mb-1">Term</p>
                                        <p className="font-bold text-primary">{offer.duration} mos</p>
                                    </div>
                                </div>
                                {offer.status === 'needsRevision' && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-orange-600 mb-2 truncate">Note: {offer.suggestionNote}</p>
                                        <button
                                            onClick={() => handleEditClick(offer)}
                                            className="btn btn-outline w-full flex justify-center items-center gap-2"
                                            style={{ padding: '0.5rem', color: 'var(--warning-color)', borderColor: 'var(--warning-color)' }}
                                        >
                                            <Edit3 size={16} /> Edit Offer
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full card p-8 text-center text-secondary">
                            <p>You have not created any offers yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyOffers;
