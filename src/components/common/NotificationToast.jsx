import React, { useEffect } from 'react';
import useStore from '../../store/useStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationToast = () => {
    const { notifications, removeNotification } = useStore();


    return (
        <div className="toast-container" aria-live="polite" aria-atomic="false">
            {notifications.slice(0, 5).map((note) => (
                <ToastItem key={note.id} note={note} onRemove={removeNotification} />
            ))}
        </div>
    );
};

const ToastItem = ({ note, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(note.id), 4000);
        return () => clearTimeout(timer);
    }, [note.id, onRemove]);

    const getIcon = () => {
        switch (note.type) {
            case 'success': return <CheckCircle className="toast-icon toast-icon--success" size={18} />;
            case 'error': return <AlertCircle className="toast-icon toast-icon--error" size={18} />;
            case 'warning': return <AlertCircle className="toast-icon toast-icon--warning" size={18} />;
            default: return <Info className="toast-icon toast-icon--info" size={18} />;
        }
    };

    const getIndicatorClass = () => {
        switch (note.type) {
            case 'success': return 'toast-indicator--success';
            case 'error': return 'toast-indicator--error';
            case 'warning': return 'toast-indicator--warning';
            default: return 'toast-indicator--info';
        }
    };

    return (
        <div className="toast-item" role="alert">
            <div className={`toast-indicator ${getIndicatorClass()}`}></div>
            <div className="toast-body">
                <div className="toast-content">
                    {getIcon()}
                    <div className="toast-text">
                        <p className="toast-title">{note.title}</p>
                        <p className="toast-message">{note.message}</p>
                        <p className="toast-time">{new Date(note.timestamp).toLocaleTimeString()}</p>
                    </div>
                </div>
                <button onClick={() => onRemove(note.id)} className="toast-close">
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
