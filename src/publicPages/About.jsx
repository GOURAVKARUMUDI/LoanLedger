import React from 'react';
import { ShieldCheck, Users, Calculator, FileText } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const _featureIconClasses = {
    info: 'contact-icon-box contact-icon-box--info',
    success: 'contact-icon-box contact-icon-box--success',
    accent: 'contact-icon-box contact-icon-box--success',
    warning: 'contact-icon-box',
};

const About = () => {
    return (
        <div className="public-page-wrapper">
            <Navbar />
            <div className="public-page-content" style={{ padding: 0 }}>
                {/* Hero */}
                <div className="public-hero">
                    <h1 className="text-3xl font-bold mb-4">About LoanLedger</h1>
                    <p>
                        Transparency in Every Transaction. We are reshaping the way loans are issued, tracked, and managed.
                    </p>
                </div>

                <div className="container" style={{ marginTop: '4rem' }}>
                    {/* Mission */}
                    <div className="card p-6 text-center mb-8" style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
                        <h2 className="text-2xl font-bold mb-4 policy-section-title">Our Mission</h2>
                        <p className="text-secondary leading-relaxed" style={{ fontSize: '1.125rem' }}>
                            To provide a secure, transparent, and efficient platform that connects Lenders, Borrowers, and Financial Analysts.
                            We believe in empowering users with clear data, fair practices, and robust tools to manage their financial journey.
                        </p>
                    </div>

                    {/* Key Features */}
                    <h2 className="text-2xl font-bold text-center mb-8">Why Choose LoanLedger?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card p-6 text-center">
                            <div className="about-feature-icon about-feature-icon--info mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Loan Issuance Tracking</h3>
                            <p className="text-sm text-secondary">Complete lifecycle management from application to disbursement.</p>
                        </div>

                        <div className="card p-6 text-center">
                            <div className="about-feature-icon about-feature-icon--success mb-4">
                                <Calculator size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">EMI Schedules</h3>
                            <p className="text-sm text-secondary">Automated EMI calculations and detailed repayment schedules.</p>
                        </div>

                        <div className="card p-6 text-center">
                            <div className="about-feature-icon about-feature-icon--accent mb-4">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Interest Calculation</h3>
                            <p className="text-sm text-secondary">Accurate and transparent interest computations for all loan types.</p>
                        </div>

                        <div className="card p-6 text-center">
                            <div className="about-feature-icon about-feature-icon--warning mb-4">
                                <Users size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Role-Based Access</h3>
                            <p className="text-sm text-secondary">Dedicated portals for Admins, Lenders, Borrowers, and Analysts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
