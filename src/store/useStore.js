import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            // ─────────────────────────────────────────────
            // STATE
            // ─────────────────────────────────────────────
            users: [],
            loans: [],
            offers: [],
            payments: [],
            notifications: [],
            currentUser: null,
            theme: 'light',

            activeModal: null,
            lenderBalances: {},

            // ─────────────────────────────────────────────
            // AUTH
            // ─────────────────────────────────────────────

            registerUser: (userData) => {
                const state = get();

                const exists = state.users.find(
                    u => u.email === userData.email
                );

                if (exists) {
                    return { success: false, error: "User already exists" };
                }

                const newUser = {
                    ...userData,
                    id: crypto.randomUUID(),
                    joinDate: new Date().toISOString().split('T')[0],
                    status: "active"
                };

                set({
                    users: [...state.users, newUser]
                });

                return { success: true };
            },

            loginUser: (email, password) => {
                const state = get();

                const user = state.users.find(
                    u => u.email === email && u.password === password
                );

                if (!user) {
                    return { success: false, error: 'Invalid credentials' };
                }

                set({ currentUser: user });

                return { success: true, role: user.role };
            },

            logoutUser: () => set({ currentUser: null }),

            // ─────────────────────────────────────────────
            // THEME
            // ─────────────────────────────────────────────

            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                return { theme: newTheme };
            }),

            // ─────────────────────────────────────────────
            // LOAN FLOW
            // ─────────────────────────────────────────────

            applyLoan: (loanData) => set((state) => ({
                loans: [{
                    ...loanData,
                    id: loanData.id || `LOAN-${Date.now().toString().slice(-4)}`,
                    status: 'pending-analyst',
                    color: 'yellow',
                    createdAt: new Date().toISOString()
                }, ...state.loans]
            })),

            analystApproveLoan: (id, status) => set((state) => ({
                loans: state.loans.map(loan => {
                    if (loan.id === id) {
                        if (status === 'approved-analyst')
                            return { ...loan, status, color: 'orange' };
                        if (status === 'rejected')
                            return { ...loan, status, color: 'red' };
                    }
                    return loan;
                })
            })),

            evaluateRisk: (id, decision, reason) => set((state) => ({
                loans: state.loans.map(loan => {
                    if (loan.id === id) {
                        let newStatus = loan.status;
                        if (decision === 'approve') newStatus = 'analystApproved';
                        if (decision === 'reject') newStatus = 'rejected';
                        if (decision === 'hold') newStatus = 'analystHold';

                        return {
                            ...loan,
                            status: newStatus,
                            analystDecision: decision,
                            analystReason: reason
                        };
                    }
                    return loan;
                })
            })),

            lenderDecision: (id, status, matchedOffer = null) => set((state) => {
                const currentUser = state.currentUser;

                return {
                    loans: state.loans.map(loan => {
                        if (loan.id === id) {
                            if (status === 'approved') {
                                const finalInterestRate =
                                    matchedOffer?.interestRate ||
                                    loan.analystRecommendedRate ||
                                    loan.requestedInterestRate ||
                                    loan.interestRate ||
                                    10;

                                const finalDuration =
                                    matchedOffer?.duration ||
                                    loan.duration ||
                                    12;

                                return {
                                    ...loan,
                                    status: 'approved',
                                    color: 'green',
                                    interestRate: finalInterestRate,
                                    duration: finalDuration,
                                    lenderId: currentUser?.id,
                                    lender: currentUser?.name || "Verified Lender",
                                    remainingBalance: loan.amount,
                                    emi:
                                        Math.round(Number(loan.amount) / finalDuration) +
                                        Math.round((Number(loan.amount) * (finalInterestRate / 100)) / finalDuration),
                                    nextDueDate:
                                        new Date(
                                            new Date().setMonth(new Date().getMonth() + 1)
                                        ).toISOString().split('T')[0],
                                };
                            }

                            if (status === 'rejected') {
                                return { ...loan, status: 'rejected', color: 'red' };
                            }
                        }
                        return loan;
                    })
                };
            }),

            // ─────────────────────────────────────────────
            // OFFERS
            // ─────────────────────────────────────────────

            createOffer: (offerData) => set((state) => ({
                offers: [{
                    ...offerData,
                    id: offerData.id || `OFFER-${Date.now().toString().slice(-4)}`,
                    status: 'pending-analyst',
                    createdAt: new Date().toISOString()
                }, ...state.offers]
            })),

            analystVerifyOffer: (id) => set((state) => ({
                offers: state.offers.map(o =>
                    o.id === id ? { ...o, status: 'available' } : o
                )
            })),

            // ─────────────────────────────────────────────
            // PAYMENTS
            // ─────────────────────────────────────────────

            addPayment: (paymentData) => set((state) => {
                const newPayment = {
                    ...paymentData,
                    id: paymentData.id || `PAY-${Date.now().toString().slice(-4)}`,
                    date: new Date().toISOString().split('T')[0],
                    status: 'completed'
                };

                const updatedLoans = state.loans.map(loan => {
                    if (loan.id === newPayment.loanId) {
                        const newBalance = Math.max(
                            0,
                            loan.remainingBalance - newPayment.amount
                        );

                        return {
                            ...loan,
                            remainingBalance: newBalance,
                            status: newBalance === 0 ? 'closed' : loan.status,
                            nextDueDate:
                                newBalance > 0
                                    ? new Date(
                                        new Date().setMonth(new Date().getMonth() + 1)
                                    ).toISOString().split('T')[0]
                                    : null
                        };
                    }
                    return loan;
                });

                return {
                    payments: [newPayment, ...state.payments],
                    loans: updatedLoans
                };
            }),

            // ─────────────────────────────────────────────
            // UI / NOTIFICATIONS
            // ─────────────────────────────────────────────

            addNotification: (note) => set((state) => ({
                notifications: [{
                    ...note,
                    id: crypto.randomUUID(),
                    timestamp: new Date().toISOString()
                }, ...state.notifications].slice(0, 10)
            })),

            removeNotification: (id) => set((state) => ({
                notifications: state.notifications.filter(n => n.id !== id)
            })),

            showSuccess: (title, message) => set({
                activeModal: { type: 'success', title, message }
            }),

            closeModal: () => set({ activeModal: null }),

            addFunds: (lenderName, amount) => set((state) => ({
                lenderBalances: {
                    ...state.lenderBalances,
                    [lenderName]:
                        (state.lenderBalances[lenderName] || 0) + Number(amount)
                }
            })),

            // ─────────────────────────────────────────────
            // AUTO SEED ADMIN
            // ─────────────────────────────────────────────

            seedDummyData: () => {
                const state = get();

                // Force seed if they are running the old dummy data shapes (less than 13 users)
                if (state.users.length < 13) {
                    const mockUsers = [
                        { id: 'admin1', name: 'Kiran Kumar', email: 'admin@loanledger.com', password: '1234567890', role: 'admin', status: 'active', joinDate: '2023-01-01' },
                        { id: 'admin2', name: 'Rajeshwara Rao', email: 'secops@loanledger.com', password: '1234567890', role: 'admin', status: 'active', joinDate: '2023-05-15' },

                        { id: 'analyst1', name: 'Sneha Reddy', email: 'analyst@loanledger.com', password: 'password', role: 'analyst', status: 'active', joinDate: '2024-01-15' },
                        { id: 'analyst2', name: 'Arvind Swamy', email: 'risk@loanledger.com', password: 'password', role: 'analyst', status: 'active', joinDate: '2024-03-22' },
                        { id: 'analyst3', name: 'Ramesh Babu', email: 'ramesh@loanledger.com', password: 'password', role: 'analyst', status: 'inactive', joinDate: '2024-11-05' },

                        { id: 'lender1', name: 'Global Finance Corp', email: 'lender@loanledger.com', password: 'password', role: 'lender', status: 'active', joinDate: '2024-02-01' },
                        { id: 'lender2', name: 'Alpha Capital', email: 'lender2@loanledger.com', password: 'password', role: 'lender', status: 'active', joinDate: '2024-02-10' },
                        { id: 'lender3', name: 'Nexus Bank', email: 'nexus@loanledger.com', password: 'password', role: 'lender', status: 'active', joinDate: '2024-06-18' },

                        { id: 'borrower1', name: 'Karthik Iyer', email: 'karthik@loanledger.com', password: 'password', role: 'borrower', status: 'active', joinDate: '2024-02-15' },
                        { id: 'borrower2', name: 'Anjali Menon', email: 'anjali@loanledger.com', password: 'password', role: 'borrower', status: 'active', joinDate: '2024-03-01' },
                        { id: 'borrower3', name: 'Srinivas Rao', email: 'srinivas@loanledger.com', password: 'password', role: 'borrower', status: 'active', joinDate: '2024-04-12' },
                        { id: 'borrower4', name: 'Lakshmi Narayanan', email: 'lakshmi@loanledger.com', password: 'password', role: 'borrower', status: 'active', joinDate: '2024-07-30' },
                        { id: 'borrower5', name: 'Venkatesh Prabhu', email: 'venkatesh@loanledger.com', password: 'password', role: 'borrower', status: 'inactive', joinDate: '2024-08-22' }
                    ];

                    const mockOffers = [
                        { id: 'OFFER-1001', lenderId: 'lender1', lenderName: 'Global Finance Corp', amount: 500000, interestRate: 10.5, duration: 24, status: 'available', createdAt: '2024-03-10T10:00:00Z', riskTier: 'Low', description: 'Premium business expansion loan.' },
                        { id: 'OFFER-1002', lenderId: 'lender2', lenderName: 'Alpha Capital', amount: 150000, interestRate: 14.0, duration: 12, status: 'available', createdAt: '2024-03-12T14:30:00Z', riskTier: 'Medium', description: 'Short-term personal liquidity.' },
                        { id: 'OFFER-1003', lenderId: 'lender3', lenderName: 'Nexus Bank', amount: 1000000, interestRate: 9.5, duration: 48, status: 'available', createdAt: '2024-04-05T09:15:00Z', riskTier: 'Low', description: 'Long-term corporate structured debt.' },
                        { id: 'OFFER-1004', lenderId: 'lender1', lenderName: 'Global Finance Corp', amount: 50000, interestRate: 18.0, duration: 6, status: 'pending-analyst', createdAt: '2024-05-20T11:45:00Z', riskTier: 'High', description: 'Emergency micro-bridge loan.' }
                    ];

                    const mockLoans = [
                        { id: 'LOAN-2001', borrowerId: 'borrower1', borrowerName: 'Karthik Iyer', amount: 200000, purpose: 'Business Expansion', requestedInterestRate: 11, duration: 24, cibilScore: 780, monthlyIncome: 85000, status: 'active', color: 'green', lenderId: 'lender1', lender: 'Global Finance Corp', interestRate: 10.5, remainingBalance: 150000, emi: 9235, nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], createdAt: '2024-03-01T09:15:00Z', analystDecision: 'approve', lenderDecision: 'accept' },
                        { id: 'LOAN-2002', borrowerId: 'borrower2', borrowerName: 'Anjali Menon', amount: 50000, purpose: 'Medical Emergency', requestedInterestRate: 15, duration: 12, cibilScore: 640, monthlyIncome: 45000, status: 'pending-analyst', color: 'yellow', lenderId: null, lender: null, interestRate: null, remainingBalance: 50000, emi: null, nextDueDate: null, createdAt: new Date().toISOString(), analystDecision: null, lenderDecision: null },
                        { id: 'LOAN-2003', borrowerId: 'borrower1', borrowerName: 'Karthik Iyer', amount: 300000, purpose: 'Home Renovation', requestedInterestRate: 12, duration: 36, cibilScore: 780, monthlyIncome: 85000, status: 'analystApproved', color: 'orange', lenderId: null, lender: null, interestRate: null, remainingBalance: 300000, emi: null, nextDueDate: null, createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), analystDecision: 'approve', analystReason: 'Solid credit history.', lenderDecision: null },
                        { id: 'LOAN-2004', borrowerId: 'borrower2', borrowerName: 'Anjali Menon', amount: 100000, purpose: 'Debt Consolidation', requestedInterestRate: 14, duration: 18, cibilScore: 680, monthlyIncome: 45000, status: 'closed', color: 'slate', lenderId: 'lender2', lender: 'Alpha Capital', interestRate: 13.5, remainingBalance: 0, emi: 6150, nextDueDate: null, createdAt: '2023-05-10T11:20:00Z', analystDecision: 'approve', lenderDecision: 'accept' },
                        { id: 'LOAN-2005', borrowerId: 'borrower3', borrowerName: 'Srinivas Rao', amount: 750000, purpose: 'Equipment Purchase', requestedInterestRate: 10, duration: 48, cibilScore: 810, monthlyIncome: 120000, status: 'active', color: 'green', lenderId: 'lender3', lender: 'Nexus Bank', interestRate: 9.8, remainingBalance: 600000, emi: 18950, nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], createdAt: '2024-01-15T14:45:00Z', analystDecision: 'approve', lenderDecision: 'accept' },
                        { id: 'LOAN-2006', borrowerId: 'borrower4', borrowerName: 'Lakshmi Narayanan', amount: 25000, purpose: 'Education', requestedInterestRate: 16, duration: 6, cibilScore: 590, monthlyIncome: 30000, status: 'rejected', color: 'red', lenderId: null, lender: null, interestRate: null, remainingBalance: 25000, emi: null, nextDueDate: null, createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), analystDecision: 'reject', analystReason: 'Debt-to-income ratio exceeds limits.', lenderDecision: null },
                        { id: 'LOAN-2007', borrowerId: 'borrower3', borrowerName: 'Srinivas Rao', amount: 150000, purpose: 'Working Capital', requestedInterestRate: 12, duration: 12, cibilScore: 810, monthlyIncome: 120000, status: 'pending', color: 'yellow', lenderId: null, lender: null, interestRate: null, remainingBalance: 150000, emi: null, nextDueDate: null, createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), analystDecision: 'approve', analystReason: 'Excellent compliance record.', lenderDecision: null },
                        { id: 'LOAN-2008', borrowerId: 'borrower5', borrowerName: 'Venkatesh Prabhu', amount: 500000, purpose: 'Real Estate', requestedInterestRate: 11, duration: 60, cibilScore: 720, monthlyIncome: 95000, status: 'active', color: 'green', lenderId: 'lender2', lender: 'Alpha Capital', interestRate: 11.5, remainingBalance: 480000, emi: 10995, nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], createdAt: '2024-06-01T10:30:00Z', analystDecision: 'approve', lenderDecision: 'accept' }
                    ];

                    const mockPayments = [
                        { id: 'PAY-3001', loanId: 'LOAN-2001', borrowerId: 'borrower1', amount: 9235, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0], status: 'completed', method: 'Bank Transfer' },
                        { id: 'PAY-3002', loanId: 'LOAN-2001', borrowerId: 'borrower1', amount: 9235, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], status: 'completed', method: 'UPI' },
                        { id: 'PAY-3003', loanId: 'LOAN-2001', borrowerId: 'borrower1', amount: 9235, date: new Date().toISOString().split('T')[0], status: 'completed', method: 'UPI' },
                        { id: 'PAY-3004', loanId: 'LOAN-2004', borrowerId: 'borrower2', amount: 6150, date: '2023-11-10', status: 'completed', method: 'Auto-Debit' },
                        { id: 'PAY-3005', loanId: 'LOAN-2004', borrowerId: 'borrower2', amount: 6150, date: '2023-12-10', status: 'completed', method: 'Auto-Debit' },
                        { id: 'PAY-3006', loanId: 'LOAN-2005', borrowerId: 'borrower3', amount: 18950, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], status: 'completed', method: 'Bank Transfer' },
                        { id: 'PAY-3007', loanId: 'LOAN-2008', borrowerId: 'borrower5', amount: 10995, date: new Date().toISOString().split('T')[0], status: 'processing', method: 'UPI' }
                    ];

                    const mockLogs = [
                        { id: 'LOG-1', user: 'admin1', action: 'System Initialization', target: 'Security Protocol', status: 'Success', date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString() },
                        { id: 'LOG-2', user: 'analyst1', action: 'Risk Assessed', target: 'LOAN-2003', status: 'Success', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
                        { id: 'LOG-3', user: 'lender1', action: 'Offer Created', target: 'OFFER-1004', status: 'Pending', date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
                        { id: 'LOG-4', user: 'borrower2', action: 'Document Upload', target: 'KYC Files', status: 'Failed', date: new Date().toISOString() },
                        { id: 'LOG-5', user: 'system', action: 'Automated Sweeps', target: 'Escrow Accounts', status: 'Success', date: new Date().toISOString() }
                    ];

                    set({
                        users: mockUsers,
                        offers: mockOffers,
                        loans: mockLoans,
                        payments: mockPayments,
                        logs: mockLogs,
                        lenderBalances: { 'Global Finance Corp': 1500000, 'Alpha Capital': 800000, 'Nexus Bank': 4500000 }
                    });
                }
            }
        }),
        {
            name: 'loan-ledger-storage',
            storage: createJSONStorage(() => localStorage),

            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.seedDummyData();
                }
            }
        }
    )
);

export default useStore;