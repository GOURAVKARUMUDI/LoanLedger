import React from 'react';
import Navbar from '../components/common/Navbar';

const TermsOfService = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem', paddingBottom: '4rem', marginTop: '64px' }}>
                <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                <p className="text-secondary mb-8">Last Updated: October 2026</p>

                <div className="card p-8">
                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>1. Acceptance of Terms</h2>
                        <p className="text-secondary">
                            By accessing or using LoanLedger services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not use our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>2. User Responsibilities</h2>
                        <p className="text-secondary mb-4">
                            You agree to Provide accurate, current, and complete information during the registration and loan application process. You are responsible for maintaining the confidentiality of your account credentials.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>3. Loan Data Accuracy</h2>
                        <p className="text-secondary">
                            LoanLedger strives to provide accurate calculations for EMIs and interest. However, final loan terms are subject to the agreement between the Lender and Borrower. The platform is a facilitator and not a lender itself.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>4. Platform Limitations</h2>
                        <p className="text-secondary">
                            We do not guarantee that the service will be uninterrupted or error-free. We reserve the right to modify or discontinue the service at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>5. Legal Compliance</h2>
                        <p className="text-secondary">
                            Users must comply with all applicable local, state, national, and international laws and regulations regarding financial transactions and lending.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
