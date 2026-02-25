import React, { useState, useMemo } from 'react';
import { formatINR, lenderEarnings } from '../../utils/finance';
import { TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';
import useStore from '../../store/useStore';

const LenderEarningsCalculator = () => {
    const { currentUser, lenderBalances, marketRate } = useStore();


    const [principal, setPrincipal] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [duration, setDuration] = useState('');

    const validPrincipal = Number(principal) || 0;
    const validRate = Number(interestRate) || 0;
    const validDuration = Number(duration) || 0;

    // Get available balance, fallback to 5M for UI testing
    const availableBalance = lenderBalances[currentUser?.name] || 5000000;

    const { monthlyReceipt, totalInterestEarned, totalAmountReceived, roi } = useMemo(() =>
        lenderEarnings(validPrincipal, validRate, validDuration),
        [validPrincipal, validRate, validDuration]);

    // Validations
    const isExceedingBalance = validPrincipal > availableBalance;
    const isBelowMarketRate = validRate > 0 && validRate < marketRate;

    return (
        <div className="card fade-in p-6 bg-white shadow-sm transition-all hover:-translate-y-1">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-emerald-600" />
                Estimate Your Returns
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Principal Amount (₹)</label>
                    <input
                        type="number"
                        className="input focus:ring-2 focus:ring-emerald-500 transition-shadow"
                        value={principal}
                        onChange={(e) => setPrincipal(e.target.value)}
                        placeholder="e.g. 50000"
                        min="1"
                    />
                    <p className="text-xs text-secondary mt-1">Available: {formatINR(availableBalance)}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Interest Rate (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        className="input focus:ring-2 focus:ring-emerald-500 transition-shadow"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="e.g. 12"
                        min="0.1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Tenure (Months)</label>
                    <input
                        type="number"
                        className="input focus:ring-2 focus:ring-emerald-500 transition-shadow"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g. 24"
                        min="1"
                    />
                </div>
            </div>

            {validPrincipal > 0 && validRate > 0 && validDuration >= 1 ? (
                <div className="fade-in">
                    {/* Warnings Array */}
                    <div className="flex flex-col gap-2 mb-4">
                        {isExceedingBalance && (
                            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded border border-red-200">
                                <AlertCircle size={16} className="mt-0.5" />
                                <span><strong>Exceeds Balance:</strong> The entered principal ({formatINR(validPrincipal)}) is higher than your available funds ({formatINR(availableBalance)}).</span>
                            </div>
                        )}
                        {isBelowMarketRate && (
                            <div className="flex items-start gap-2 text-sm text-yellow-800 bg-yellow-50 p-3 rounded border border-yellow-300">
                                <AlertCircle size={16} className="mt-0.5" />
                                <span><strong>Low Rate Flag:</strong> {validRate}% is below the current market average of {marketRate}%. Adjust to maximize returns.</span>
                            </div>
                        )}
                    </div>

                    {!isExceedingBalance && (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="bg-emerald-50 p-3 rounded shadow-sm border border-emerald-100">
                                    <div className="text-xs text-secondary font-semibold uppercase mb-1 flex items-center gap-1">
                                        <Activity size={12} /> Monthly Receipts
                                    </div>
                                    <div className="text-lg font-bold text-emerald-700">{formatINR(monthlyReceipt)}</div>
                                </div>

                                <div className="bg-emerald-50 p-3 rounded shadow-sm border border-emerald-100">
                                    <div className="text-xs text-secondary font-semibold uppercase mb-1">Total Interest</div>
                                    <div className="text-lg font-bold text-gray-800">{formatINR(totalInterestEarned)}</div>
                                </div>

                                <div className="bg-emerald-50 p-3 rounded shadow-sm border border-emerald-100">
                                    <div className="text-xs text-secondary font-semibold uppercase mb-1 flex items-center gap-1">
                                        <DollarSign size={12} /> Total Receipts
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">{formatINR(totalAmountReceived)}</div>
                                </div>

                                <div className="p-3 rounded shadow-sm text-center flex flex-col justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white transition-transform hover:scale-105">
                                    <div className="text-xs font-semibold uppercase mb-1 text-emerald-100">Yield (ROI)</div>
                                    <div className="text-xl font-extrabold">+{roi}%</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-4 rounded text-sm text-gray-700">
                                <strong>Break-Even Summary:</strong> Over {validDuration} months, you will recover your initial capital of {formatINR(validPrincipal)} and generate a cumulative passive income of <strong>{formatINR(totalInterestEarned)}</strong> via stable monthly payouts of {formatINR(monthlyReceipt)}.
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="p-6 text-center text-secondary bg-gray-50 rounded border border-gray-100">
                    Enter your intended lending capital, rate, and tenure to visualize returns.
                </div>
            )}
        </div>
    );
};

export default LenderEarningsCalculator;
