import React from 'react';
import { CheckCircle } from 'lucide-react';

const LoanProgress = ({ status }) => {
    // Determine the progress width based on status
    let width = '0%';
    let currentStepIndex = 0;

    const normalizedStatus = status?.toLowerCase() || 'pending';

    if (normalizedStatus === 'active') {
        width = '100%';
        currentStepIndex = 4;
    } else if (normalizedStatus === 'lenderreview' || normalizedStatus === 'accepted by lender' || normalizedStatus === 'approved by analyst') {
        width = '75%';
        currentStepIndex = 3;
    } else if (normalizedStatus === 'analystapproved') {
        width = '50%';
        currentStepIndex = 2;
    } else {
        // Pending or general applying states
        width = '25%';
        currentStepIndex = 1;
    }

    if (normalizedStatus.includes('reject') || normalizedStatus.includes('hold')) {
        // Special case: don't fill progress bar normally for rejected/hold
        width = '100%';
    }

    const steps = [
        { label: 'Applied', index: 1 },
        { label: 'Analyst', index: 2 },
        { label: 'Lender', index: 3 },
        { label: 'Active', index: 4 }
    ];

    return (
        <div className="w-full mt-4 mb-2">
            <div className="flex justify-between text-xs text-secondary font-medium mb-2 px-1">
                {steps.map(step => (
                    <span
                        key={step.index}
                        className={`transition-colors duration-300 flex flex-col items-center gap-1 ${currentStepIndex >= step.index ? 'text-primary' : ''}`}
                    >
                        {step.label}
                    </span>
                ))}
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{
                        width,
                        background: normalizedStatus.includes('reject') ? '#ef4444' :
                            normalizedStatus.includes('hold') ? '#f59e0b' : undefined
                    }}
                ></div>
            </div>

            {(normalizedStatus.includes('reject') || normalizedStatus.includes('hold')) && (
                <div className="text-xs font-bold text-center mt-2 flex items-center justify-center gap-1"
                    style={{ color: normalizedStatus.includes('reject') ? '#ef4444' : '#f59e0b' }}>
                    Status: {status}
                </div>
            )}
        </div>
    );
};

export default LoanProgress;
