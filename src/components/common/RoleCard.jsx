import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const RoleCard = ({ title, description, icon: Icon, link, color }) => {
    // color prop comes like 'bg-indigo-600' from Home.jsx
    // We need to map these to actual colors or use inline styles carefully
    // For now, let's map the tailwind bg colors to hex codes
    const getColor = (roleColor) => {
        // Map roles to theme colors
        if (roleColor === 'indigo') return 'var(--primary-color)'; // Admin -> Navy
        if (roleColor === 'emerald') return 'var(--accent-color)'; // Lender -> Emerald
        if (roleColor === 'blue') return '#0ea5e9'; // Borrower -> Light Blue/Info
        if (roleColor === 'purple') return '#8b5cf6'; // Analyst -> Purple
        return 'var(--primary-color)';
    };

    const cardColor = getColor(color);

    return (
        <div className="card" style={{ transition: 'all 0.3s', transform: 'translateY(0)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
            <div style={{ height: '0.5rem', width: '100%', backgroundColor: cardColor }}></div>
            <div className="p-6">
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: `${cardColor}1A`, // 10% opacity approx
                    color: cardColor,
                    marginBottom: '1rem'
                }}>
                    <Icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>{title}</h3>
                <p className="text-secondary mb-4" style={{ minHeight: '50px' }}>{description}</p>
                <Link
                    to={link}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: 'var(--primary-color)',
                        fontWeight: 500,
                        gap: '0.5rem'
                    }}
                >
                    Access Panel <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default RoleCard;
