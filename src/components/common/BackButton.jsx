import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                marginBottom: '1.5rem',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-md)'
            }}
        >
            <ArrowLeft size={18} />
            <span style={{ fontWeight: 500 }}>Back</span>
        </button>
    );
};

export default BackButton;
