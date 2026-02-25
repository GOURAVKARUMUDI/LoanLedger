import React from 'react';
import BorrowerEMICalculator from './BorrowerEMICalculator';
import BackButton from '../../components/common/BackButton';

const BorrowerEMIPage = () => {
    return (
        <div className="dashboard-container fade-in">
            <div className="header-banner flex flex-col gap-2">
                <BackButton />
                <h1 className="text-3xl font-bold">EMI Calculator</h1>
                <p className="text-secondary">Plan your loan by calculating monthly EMIs and viewing the amortization schedule.</p>
            </div>

            <div className="max-w-4xl">
                <BorrowerEMICalculator />
            </div>
        </div>
    );
};

export default BorrowerEMIPage;
