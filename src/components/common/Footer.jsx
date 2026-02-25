import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <span className="footer-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={20} className="text-indigo-500" />
                        LoanLedger
                    </span>
                    <span className="footer-copy">&copy; 2026. All rights reserved.</span>
                </div>

                <div className="footer-links">
                    {[['/', 'Home'], ['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/contact', 'Contact']].map(([path, label]) => (
                        <Link key={path} to={path} className="footer-link">
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
