import React, { useMemo, useState, useEffect, useRef } from 'react';
import { formatINR, computeEMI, amortizationSchedule } from '../../utils/finance';
import { Calculator, Calendar, AlertTriangle, Info } from 'lucide-react';
import useStore from '../../store/useStore';

// We allow passing props directly (e.g., from Apply Loan) or maintaining local state (e.g., in Dashboard)
const BorrowerEMICalculator = ({
    initialPrincipal = '',
    initialInterestRate = '',
    initialDuration = '',
    monthlyIncome = 0,
    onCalculate = null
}) => {
    const { marketRate } = useStore();


    // State
    // State (Initialize with props or defaults)
    const [localPrincipal, setLocalPrincipal] = useState(initialPrincipal || 100000);
    const [localInterestRate, setLocalInterestRate] = useState(initialInterestRate || 10.5);
    const [localDuration, setLocalDuration] = useState(initialDuration || 12);

    // Derived State (Props override local state if provided)
    const principal = initialPrincipal || localPrincipal;
    const interestRate = initialInterestRate || localInterestRate;
    const duration = initialDuration || localDuration;

    const validPrincipal = Number(principal) || 0;
    const validRate = Number(interestRate) || 0;
    const validDuration = Number(duration) || 0;

    const { emi, totalInterest, totalPayment } = useMemo(() =>
        computeEMI(validPrincipal, validRate, validDuration),
        [validPrincipal, validRate, validDuration]);

    const schedule = useMemo(() =>
        amortizationSchedule(validPrincipal, validRate, validDuration),
        [validPrincipal, validRate, validDuration]);

    // Ref to hold the latest onCalculate without triggering effect re-runs
    const onCalculateRef = useRef(onCalculate);
    onCalculateRef.current = onCalculate;

    // Triggers local callback if provided (e.g., for storing EMI in loanRequest)
    useEffect(() => {
        if (onCalculateRef.current && emi > 0) {
            onCalculateRef.current(emi);
        }
    }, [emi]);

    // Validation Rules
    const isBelowMarketRate = validRate > 0 && validRate < marketRate;
    const isHighRisk = monthlyIncome > 0 && emi > (monthlyIncome * 0.5);

    return (
        <div className="card fade-in p-6 bg-white shadow-sm border border-indigo-100 transition-all hover:-translate-y-1">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-6">
                <Calculator size={18} className="text-indigo-600" />
                Plan Your Loan (EMI Calculator)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Loan Amount (₹)</label>
                    <input
                        type="number"
                        className="input focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        value={principal}
                        onChange={(e) => setLocalPrincipal(e.target.value)}
                        placeholder="e.g. 100000"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Interest Rate (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        className="input focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        value={interestRate}
                        onChange={(e) => setLocalInterestRate(e.target.value)}
                        placeholder="e.g. 10"
                        min="0.1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Tenure (Months)</label>
                    <input
                        type="number"
                        className="input focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        value={duration}
                        onChange={(e) => setLocalDuration(e.target.value)}
                        placeholder="e.g. 12"
                        min="1"
                    />
                </div>
            </div>

            {validPrincipal > 0 && validRate > 0 && validDuration >= 1 ? (
                <div className="fade-in">
                    {/* Warnings Array */}
                    <div className="flex flex-col gap-2 mb-4">
                        {isBelowMarketRate && (
                            <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
                                <Info size={16} className="mt-0.5" />
                                <span><strong>Below Market Rate:</strong> This interest rate is lower than the RBI benchmark of {marketRate}%. Excellent deal!</span>
                            </div>
                        )}
                        {isHighRisk && (
                            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded border border-red-200">
                                <AlertTriangle size={16} className="mt-0.5" />
                                <span><strong>High Risk:</strong> This EMI ({formatINR(emi)}) exceeds 50% of your stated monthly income. Approval chances may be lower.</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-indigo-50 rounded border border-indigo-100 text-center">
                            <div className="text-xs text-indigo-800 font-semibold uppercase mb-1">Monthly EMI</div>
                            <div className="text-2xl font-extrabold text-indigo-600">{formatINR(emi)}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border border-gray-200 text-center">
                            <div className="text-xs text-secondary font-semibold uppercase mb-1">Total Interest</div>
                            <div className="text-xl font-bold text-gray-700">{formatINR(totalInterest)}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border border-gray-200 text-center">
                            <div className="text-xs text-secondary font-semibold uppercase mb-1">Total Payable</div>
                            <div className="text-xl font-bold text-gray-800">{formatINR(totalPayment)}</div>
                        </div>
                    </div>

                    <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        First 12 Months Amortization
                    </h4>
                    <div className="table-wrapper mt-4">
                        <div className="table-container border border-gray-200 rounded-lg overflow-hidden shadow-none">
                            <table className="table">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-xs text-gray-500 uppercase px-4 py-2">Month</th>
                                        <th className="text-xs text-gray-500 uppercase px-4 py-2 text-right">Principal</th>
                                        <th className="text-xs text-gray-500 uppercase px-4 py-2 text-right">Interest</th>
                                        <th className="text-xs text-gray-500 uppercase px-4 py-2 text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {schedule.map((row) => (
                                        <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2 text-sm font-medium text-gray-700">{row.month}</td>
                                            <td className="px-4 py-2 text-sm text-gray-600 text-right">{formatINR(row.principalPaid)}</td>
                                            <td className="px-4 py-2 text-sm text-gray-600 text-right">{formatINR(row.interestPaid)}</td>
                                            <td className="px-4 py-2 text-sm font-bold text-gray-800 text-right">{formatINR(row.remainingBalance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 text-center text-secondary bg-gray-50 rounded border border-gray-100">
                    Enter valid loan details to preview the amortization schedule.
                </div>
            )}
        </div>
    );
};

export default BorrowerEMICalculator;
