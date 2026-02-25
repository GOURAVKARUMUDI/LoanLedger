import React from 'react';
import useStore from '../../store/useStore';
import { Shield, User, Briefcase, Award } from 'lucide-react';
import BackButton from '../../components/common/BackButton';

const AdminUsers = () => {
    const { users } = useStore();


    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield size={16} className="text-primary" />;
            case 'lender': return <Briefcase size={16} className="text-warning" />;
            case 'analyst': return <Award size={16} className="text-info" />;
            case 'borrower':
            default: return <User size={16} className="text-success" />;
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return 'badge-neutral';
            case 'lender': return 'badge-warning';
            case 'analyst': return 'badge-info';
            case 'borrower':
            default: return 'badge-success';
        }
    };

    return (
        <div className="container" style={{ maxWidth: '100%' }}>
            <BackButton />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-secondary">View and manage platform users</p>
                </div>
            </div>

            <div className="card overflow-hidden" style={{ padding: 0 }}>
                <div className="table-wrapper">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-secondary">{user.email}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(user.role)}
                                                <span className={`badge ${getRoleBadge(user.role)} capitalize`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-success bg-green-100 text-green-700">{user.status || 'Active'}</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }} className="text-secondary">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
