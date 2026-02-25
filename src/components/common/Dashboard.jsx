import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import useStore from '../../store/useStore';

const Dashboard = ({ role }) => {
    const { currentUser } = useStore();


    const getRoleHeader = () => {
        switch (role) {
            case 'admin':
                return { title: 'Platform Administration', bgClass: 'banner-admin' };
            case 'lender':
                return { title: 'Lender Control Panel', bgClass: 'banner-lender' };
            case 'analyst':
                return { title: 'Risk Analytics Center', bgClass: 'banner-analyst' };
            case 'borrower':
            default:
                return { title: 'Borrower Dashboard', bgClass: 'banner-borrower' };
        }
    };

    const header = getRoleHeader();

    return (
        <div className="public-page-wrapper">
            <Navbar role={role} />
            <main className="main-content" style={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className={`role-banner ${header.bgClass}`}>
                    <div className="container flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white m-0">{header.title}</h1>

                        {/* Profile Card — Text Only */}
                        {currentUser && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <div>
                                    <h3 className="font-bold text-sm" style={{ color: '#fff', margin: 0 }}>{currentUser.name}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: 0 }}>{currentUser.email}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="role-badge">{role?.charAt(0).toUpperCase() + role?.slice(1)}</span>
                                    <span style={{ fontSize: '0.625rem', fontFamily: 'ui-monospace, monospace', color: 'rgba(255,255,255,0.5)' }}>
                                        {currentUser.id?.slice(0, 8) || '—'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="container fade-in" style={{ flexGrow: 1, padding: '2rem 1rem' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
