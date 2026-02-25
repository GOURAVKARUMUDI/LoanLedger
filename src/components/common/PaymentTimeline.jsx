import { formatINR } from '../../utils/format';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';

const PaymentTimeline = ({ payments = [], loanDetails = {} }) => {
    // payments array should have { id, amount, dueDate, status, type }
    // statuses: 'completed', 'pending', 'late', 'upcoming'

    // Sort payments by date
    const sortedPayments = [...payments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="text-white" size={14} />;
            case 'pending': return <Clock className="text-white" size={14} />;
            case 'late': return <AlertCircle className="text-white" size={14} />;
            default: return <Calendar className="text-slate-400" size={14} />;
        }
    };

    const getStatusGlow = (status) => {
        switch (status) {
            case 'completed': return '0 0 15px var(--status-success)';
            case 'pending': return '0 0 15px var(--status-warning)';
            case 'late': return '0 0 15px var(--status-danger)';
            default: return 'none';
        }
    };

    return (
        <div className="saas-card p-10 h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 border-none" style={{ maxHeight: '600px' }}>
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black flex items-center gap-3 text-primary">
                    <Calendar size={24} className="text-indigo-600" />
                    Repayment Roadmap
                </h3>
                <div className="text-[10px] font-mono text-muted uppercase tracking-widest border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-lg">
                    Telemetery Stream: Live
                </div>
            </div>

            <div className="timeline-container ml-4 relative">
                {/* Vertical Line Connector */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>

                {/* Point of Origin: Loan Activated */}
                <div className="timeline-item relative z-10 mb-12">
                    <div className="timeline-node border-2 border-white dark:border-slate-900 shadow-xl"
                        style={{ background: 'var(--status-success)', boxShadow: '0 0 15px var(--status-success)' }}>
                        <CheckCircle className="text-white" size={14} />
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest text-emerald-500 mb-1">Genesis Point</p>
                                <p className="text-lg font-bold text-primary">Loan Activated</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-secondary font-bold uppercase mb-1">Date</p>
                                <p className="text-sm font-mono text-primary">{loanDetails.startDate || '2024-12-01'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {sortedPayments.length > 0 ? (
                    sortedPayments.map((p, idx) => (
                        <div key={p.id || idx} className="timeline-item relative z-10 mb-8 last:mb-0">
                            <div className={`timeline-node border-2 border-white dark:border-slate-900 shadow-xl transition-all duration-300 ${p.status}`}
                                style={{ boxShadow: getStatusGlow(p.status) }}>
                                {getStatusIcon(p.status)}
                            </div>
                            <div className={`flex-1 p-6 rounded-2xl border transition-all duration-300 group ${p.status === 'completed'
                                ? 'bg-emerald-500/5 border-emerald-500/10'
                                : p.status === 'late'
                                    ? 'bg-red-500/5 border-red-500/10'
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                                }`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="font-black text-sm text-primary uppercase tracking-tighter">
                                                {p.type || `Node Settlement #${idx + 1}`}
                                            </p>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${p.status === 'completed' ? 'bg-emerald-500 text-white' :
                                                p.status === 'late' ? 'bg-red-500 text-white' :
                                                    p.status === 'pending' ? 'bg-amber-500 text-white' :
                                                        'bg-slate-500 text-white'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-secondary font-bold mb-1 opacity-60">Scheduled Checkpoint</p>
                                        <p className="text-sm font-mono text-primary">{p.dueDate}</p>
                                        {p.paidDate && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Settled: {p.paidDate}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-secondary font-bold uppercase mb-1 opacity-60">Liability Amount</p>
                                        <p className="text-2xl font-black text-primary tracking-tighter">
                                            {formatINR(p.amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="timeline-item relative z-10">
                        <div className="timeline-node border-2 border-white dark:border-slate-900 shadow-xl bg-slate-200 dark:bg-slate-800">
                            <Clock className="text-slate-400" size={14} />
                        </div>
                        <div className="saas-card border-dashed border-2 flex-1 py-10 text-center">
                            <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">Queue Information</p>
                            <p className="text-primary italic">No active payment cycles detected for this trajectory.</p>
                        </div>
                    </div>
                )}

                {/* Trajectory Completion Point */}
                {sortedPayments.every(p => p.status === 'completed') && sortedPayments.length > 0 && (
                    <div className="timeline-item relative z-10 pt-4">
                        <div className="timeline-node border-2 border-white dark:border-slate-900 shadow-xl"
                            style={{ background: 'var(--status-success)', boxShadow: '0 0 20px var(--status-success)' }}>
                            <CheckCircle className="text-white" size={14} />
                        </div>
                        <div className="flex-1 p-8 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl text-center">
                            <h4 className="text-xl font-black text-emerald-600 mb-2 uppercase tracking-tighter">Trajectory Complete</h4>
                            <p className="text-xs text-secondary font-bold uppercase opacity-80">Node Fully Repaid & Decoupled</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default PaymentTimeline;
