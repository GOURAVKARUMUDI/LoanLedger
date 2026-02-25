import React from 'react';
import Navbar from '../components/common/Navbar';

const PrivacyPolicy = () => {
    return (
        <div className="public-page-wrapper">
            <Navbar />
            <div className="container policy-content">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-secondary mb-8">Last Updated: October 2026</p>

                <div className="card p-8">
                    <section className="mb-8">
                        <h2 className="policy-section-title">1. Information We Collect</h2>
                        <p className="text-secondary mb-4">
                            We collect information you provide directly to us, such as when you create an account, apply for a loan, or communicate with us. This includes:
                        </p>
                        <ul className="policy-list">
                            <li className="mb-2">Personal identification information (Name, Email, Phone number)</li>
                            <li className="mb-2">Financial information (Income details, Bank account numbers)</li>
                            <li className="mb-2">Identification documents (PAN Card, Aadhar Number for Indian users)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="policy-section-title">2. How We Use Your Data</h2>
                        <p className="text-secondary mb-4">We use the information we collect to:</p>
                        <ul className="policy-list">
                            <li className="mb-2">Process loan applications and assess creditworthiness.</li>
                            <li className="mb-2">Facilitate loan disbursements and repayment tracking.</li>
                            <li className="mb-2">Send transactional notifications and payment reminders.</li>
                            <li className="mb-2">Improve our platform's security and fraud detection.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="policy-section-title">3. Data Protection and Security</h2>
                        <p className="text-secondary">
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption for sensitive financial data.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="policy-section-title">4. Sharing with Third Parties</h2>
                        <p className="text-secondary">
                            We may share your information with credit bureaus, financial partners, and legal authorities as required by law. We do not sell your personal data to marketing agencies.
                        </p>
                    </section>

                    <section>
                        <h2 className="policy-section-title">5. User Rights</h2>
                        <p className="text-secondary">
                            You have the right to access, correct, or delete your personal information. You can also object to the processing of your data by contacting our support team.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
