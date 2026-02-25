import React from 'react';
import useStore from '../../store/useStore';
import BackButton from '../../components/common/BackButton';
import { Lock, Shield, Clock, Ban, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminAuditLogs = () => {
    const { users, loans, logs: globalLogs } = useStore();
    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');
    const activeLoans = (loans || []).filter(l => l.status === 'approved' || l.status === 'active' || l.status === 'closed');

    // Use the global logs or fallback
    const logs = globalLogs && globalLogs.length > 0 ? globalLogs : [
        { id: 'LOG-1', user: 'admin1', action: 'System Initialization', target: 'Security Protocol', status: 'Success', date: new Date().toISOString() }
    ];

    const getIcon = (status) => {
        if (status === 'success') return <CheckCircle size={16} className="text-emerald-500" />;
        if (status === 'danger') return <Ban size={16} className="text-red-500" />;
        return <AlertTriangle size={16} className="text-amber-500" />;
    };

    return (
        <div>
            <BackButton />
            <div className="flex items-center gap-3 mb-6">
                <Lock size={28} className="text-red-500" />
                <h1 className="text-2xl font-bold">Audit & Security Logs</h1>
            </div>

            {logs.length > 0 ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Action</th>
                                <th>User</th>
                                <th>Role</th>
                                <th>Detail</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>{getIcon(log.status.toLowerCase() === 'failed' ? 'danger' : log.status.toLowerCase())}</td>
                                    <td style={{ fontWeight: 600 }}>{log.action}</td>
                                    <td>{log.user}</td>
                                    <td><span className="badge badge-neutral">{log.target || 'System'}</span></td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{log.status}</td>
                                    <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(log.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="saas-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Shield size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--text-muted)' }} />
                    <h3>No Audit Logs</h3>
                    <p style={{ color: 'var(--text-muted)' }}>No platform activity recorded yet.</p>
                </div>
            )}
        </div>
    );
};

export default AdminAuditLogs;
