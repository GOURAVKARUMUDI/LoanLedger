/**
 * Global utility functions for financial calculations and formatting.
 */

/**
 * Formats a number as Indian Rupees (INR).
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted INR string.
 */
export const formatINR = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Computes the Equated Monthly Installment (EMI).
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * @param {number} principal - Loan amount.
 * @param {number} annualInterestRate - Annual interest rate in percentage (e.g., 10 for 10%).
 * @param {number} durationMonths - Loan tenure in months.
 * @returns {Object} Object containing emi, totalInterest, and totalPayment.
 */
export const computeEMI = (principal, annualInterestRate, durationMonths) => {
    if (!principal || !annualInterestRate || !durationMonths || principal <= 0 || durationMonths <= 0) {
        return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const p = Number(principal);
    const r = Number(annualInterestRate) / 12 / 100; // Monthly interest rate
    const n = Number(durationMonths);

    let emi;
    if (r === 0) {
        emi = p / n;
    } else {
        emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    // Safety check for NaN or Infinity
    if (isNaN(emi) || !isFinite(emi)) {
        return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment)
    };
};

/**
 * Generates an amortization schedule.
 * @param {number} principal - Loan amount.
 * @param {number} annualInterestRate - Annual interest rate in percentage.
 * @param {number} durationMonths - Loan tenure in months.
 * @returns {Array<Object>} Array of monthly schedule objects.
 */
export const amortizationSchedule = (principal, annualInterestRate, durationMonths) => {
    const { emi } = computeEMI(principal, annualInterestRate, durationMonths);
    if (!emi) return [];

    let balance = Number(principal);
    const r = Number(annualInterestRate) / 12 / 100;
    const schedule = [];

    // Limit to max 12 months for preview purposes to avoid huge arrays if duration is long
    const limit = Math.min(durationMonths, 12);

    for (let month = 1; month <= limit; month++) {
        let interestForMonth = balance * r;
        let principalForMonth = emi - interestForMonth;

        // Handle last month rounding issues
        if (month === Number(durationMonths) || balance < principalForMonth) {
            principalForMonth = balance;
            interestForMonth = emi - principalForMonth;
        }

        balance -= principalForMonth;

        schedule.push({
            month,
            emi: Math.round(emi),
            principalPaid: Math.round(principalForMonth),
            interestPaid: Math.round(interestForMonth),
            remainingBalance: Math.max(0, Math.round(balance))
        });

        if (balance <= 0) break;
    }

    return schedule;
};

/**
 * Computes estimated lender earnings.
 * @param {number} principal - Amount lent.
 * @param {number} annualInterestRate - Annual interest rate in percentage.
 * @param {number} durationMonths - Loan tenure in months.
 * @returns {Object} Object containing monthlyReceipt, totalInterestEarned, totalAmountReceived, roi
 */
export const lenderEarnings = (principal, annualInterestRate, durationMonths) => {
    const { emi, totalInterest, totalPayment } = computeEMI(principal, annualInterestRate, durationMonths);
    if (!emi) return { monthlyReceipt: 0, totalInterestEarned: 0, totalAmountReceived: 0, roi: 0 };

    const roi = (totalInterest / Number(principal)) * 100;

    return {
        monthlyReceipt: emi,
        totalInterestEarned: totalInterest,
        totalAmountReceived: totalPayment,
        roi: roi.toFixed(2)
    };
};
