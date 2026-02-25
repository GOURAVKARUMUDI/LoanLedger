import React from 'react';
import BackButton from '../../components/common/BackButton';
import { Settings } from 'lucide-react';

const AdminSettings = () => {
    const settings = [
        { label: 'Platform Name', value: 'LoanLedger', type: 'text' },
        { label: 'Max Loan Amount', value: '₹50,00,000', type: 'text' },
        { label: 'Min Interest Rate', value: '4.5%', type: 'text' },
        { label: 'Max Interest Rate', value: '18.0%', type: 'text' },
        { label: 'Default Loan Tenure', value: '12 months', type: 'text' },
        { label: 'Risk Score Threshold', value: '650', type: 'text' },
        { label: 'Auto-Approval', value: 'Disabled', type: 'toggle' },
        { label: 'KYC Verification', value: 'Mandatory', type: 'toggle' },
    ];

    return (
        <div>
            <BackButton />
            <div className="flex items-center gap-3 mb-6">
                <Settings size={28} className="text-slate-500" />
                <h1 className="text-2xl font-bold">System Settings</h1>
            </div>

            <div className="card-grid">
                {settings.map((s, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                            {s.label}
                        </p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="saas-card mt-6" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>
                    Settings are read-only in the current version. Contact the system administrator for changes.
                </p>
            </div>
        </div>
    );
};

export default AdminSettings;
