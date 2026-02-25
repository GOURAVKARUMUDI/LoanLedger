import React from 'react';
import useStore from '../../store/useStore';
import BackButton from '../../components/common/BackButton';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const AdminRiskProtocol = () => {
    const { loans } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');


    const pending = loanRequests.filter(r => r.status === 'pending');
    const approved = loanRequests.filter(r => r.status === 'analystApproved');
    const rejected = loanRequests.filter(r => r.status === 'rejected');

    const protocols = [
        {
            name: 'Credit Score Threshold',
            value: '650+',
            status: 'active',
            desc: 'Minimum CIBIL score required for automated pre-approval.'
        },
        {
            name: 'Late Payment Tolerance',
            value: '≤ 2',
            status: 'active',
            desc: 'Maximum number of late payments before risk flag triggers.'
        },
        {
            name: 'Income Verification',
            value: 'Mandatory',
            status: 'active',
            desc: 'Annual income must be verified before loan disbursement.'
        },
        {
            name: 'Debt-to-Income Ratio',
            value: '< 40%',
            status: 'active',
            desc: 'Maximum DTI ratio allowed for new loan eligibility.'
        }
    ];

    return (
        <div>
            <BackButton />
            <div className="flex items-center gap-3 mb-6">
                <Shield size={28} className="text-emerald-500" />
                <h1 className="text-2xl font-bold">Risk Protocol Engine</h1>
            </div>

            {/* Risk Pipeline Stats */}
            <div className="card-grid mb-8">
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={18} className="text-amber-500" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Pending Review</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{pending.length}</p>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-emerald-500" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Approved</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{approved.length}</p>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle size={18} className="text-red-500" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Rejected</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{rejected.length}</p>
                </div>
            </div>

            {/* Protocol Rules */}
            <div className="saas-card" style={{ padding: '2rem' }}>
                <h3 className="mb-4">Active Scoring Parameters</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {protocols.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                            <div>
                                <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>{p.name}</p>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{p.desc}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text)' }}>{p.value}</span>
                                <span className="badge badge-success">Active</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminRiskProtocol;
