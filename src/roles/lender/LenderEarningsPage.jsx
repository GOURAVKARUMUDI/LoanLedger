import React from 'react';
import LenderEarningsCalculator from './LenderEarningsCalculator';
import BackButton from '../../components/common/BackButton';

const LenderEarningsPage = () => {
    return (
        <div className="dashboard-container fade-in">
            <div className="header-banner flex flex-col gap-2">
                <BackButton />
                <h1 className="text-3xl font-bold">Earnings Calculator</h1>
                <p className="text-secondary">Estimate your potential returns on loans based on principal, rate, and tenure.</p>
            </div>

            <div className="max-w-4xl">
                <LenderEarningsCalculator />
            </div>
        </div>
    );
};

export default LenderEarningsPage;
