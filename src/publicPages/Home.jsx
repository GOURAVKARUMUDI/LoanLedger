import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import RoleCard from '../components/common/RoleCard';
import { ShieldCheck, User, DollarSign, LayoutDashboard } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const roles = [
        {
            title: 'Admin',
            description: 'Manage users, system configurations, and view overall reports.',
            icon: ShieldCheck,
            link: '/login?role=admin',
            color: 'indigo',
        },
        {
            title: 'Lender',
            description: 'Create loan offers, manage active loans, and track payments.',
            icon: DollarSign,
            link: '/login?role=lender',
            color: 'emerald',
        },
        {
            title: 'Borrower',
            description: 'Apply for loans, view your schedule, and make payments.',
            icon: User,
            link: '/login?role=borrower',
            color: 'blue',
        },
        {
            title: 'Financial Analyst',
            description: 'Analyze risks, generate financial reports, and view trends.',
            icon: LayoutDashboard,
            link: '/login?role=analyst',
            color: 'purple',
        },
    ];

    return (
        <div className="home-page-wrapper">
            <Navbar />

            <main className="home-main">
                {/* Hero Section */}
                <section className="home-hero">
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={36} color="#fff" />
                            </div>
                        </div>
                        <h1 className="home-hero-title">
                            Smart Loan Issuance &amp; Tracking
                        </h1>
                        <p className="home-hero-sub">
                            A secure, transparent, and efficient platform connecting Lenders, Borrowers, and Financial Analysts.
                        </p>
                        <div className="home-hero-cta">
                            <button
                                onClick={() => navigate('/login')}
                                className="btn home-btn-primary"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="btn home-btn-outline"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>

                {/* Roles Section */}
                <section className="home-roles-section">
                    <div className="container">
                        <h2 className="text-3xl font-bold text-center home-roles-title">Select Your Role</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {roles.map((role) => (
                                <RoleCard key={role.title} {...role} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
