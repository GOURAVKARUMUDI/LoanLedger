import React from 'react';
import useStore from '../../store/useStore';
import { CheckCircle, X, ShieldCheck } from 'lucide-react';

const SuccessModal = () => {
    const { activeModal, closeModal } = useStore();


    if (!activeModal) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="saas-card max-w-md w-full p-10 text-center animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 shadow-3xl border-white/20">
                <button
                    onClick={closeModal}
                    className="absolute top-6 right-6 text-muted hover:text-primary transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle className="text-emerald-500" size={48} />
                </div>

                <h2 className="text-3xl font-black mb-4 text-primary">
                    {activeModal.title || 'Action Successful'}
                </h2>

                <p className="text-secondary text-lg leading-relaxed mb-10">
                    {activeModal.message || 'The operation has been completed and verified across the network.'}
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={closeModal}
                        className="btn-premium btn-premium-primary w-full py-4 text-lg"
                    >
                        Acknowledged
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Institutional Verification Complete
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
