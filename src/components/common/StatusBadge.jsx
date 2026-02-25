import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    if (!status) return <span className="badge badge-neutral">Unknown</span>;

    const normalizedStatus = status.toLowerCase();

    // Default configuration for unknown statuses
    let config = {
        colorClass: 'badge-neutral',
        icon: null
    };

    // Strict rules overrides
    if (normalizedStatus === 'pending') {
        config = {
            colorClass: 'badge-warning', // yellow
            icon: <Clock size={14} className="mr-1" />
        };
    } else if (normalizedStatus === 'analystapproved') {
        config = {
            colorClass: 'badge-hold', // orange (using existing badge-hold which is orange-ish, or inline style if needed)
            icon: <AlertCircle size={14} className="mr-1" />
        };
    } else if (normalizedStatus === 'rejected') {
        config = {
            colorClass: 'badge-danger', // red
            icon: <XCircle size={14} className="mr-1" />
        };
    } else if (normalizedStatus === 'active') {
        config = {
            colorClass: 'badge-success', // green
            icon: <CheckCircle size={14} className="mr-1" />
        };
    } else if (normalizedStatus === 'onhold') {
        config = {
            colorClass: 'badge-info', // blue
            icon: <AlertCircle size={14} className="mr-1" />
        };
    } else if (
        normalizedStatus.includes('pending') ||
        normalizedStatus === 'on hold by analyst' ||
        normalizedStatus === 'approved by analyst' ||
        normalizedStatus === 'on hold by lender' ||
        normalizedStatus === 'under review'
    ) {
        // Yellow/Warning status backwards comp
        config = {
            colorClass: 'badge-warning',
            icon: <Clock size={14} className="mr-1" />
        };
    } else if (
        normalizedStatus.includes('reject') ||
        normalizedStatus === 'rejected by analyst' ||
        normalizedStatus === 'rejected by lender' ||
        normalizedStatus === 'payment rejected' ||
        normalizedStatus === 'late'
    ) {
        // Red/Danger status
        config = {
            colorClass: 'badge-danger',
            icon: <XCircle size={14} className="mr-1" />
        };
    } else if (
        normalizedStatus === 'accepted by lender' ||
        normalizedStatus.includes('approved') || // keeping for legacy
        normalizedStatus === 'verified' ||
        normalizedStatus === 'successful transfer'
    ) {
        // Green/Success
        config = {
            colorClass: 'badge-success',
            icon: <CheckCircle size={14} className="mr-1" />
        };
    } else if (normalizedStatus === 'closed' || normalizedStatus === 'paid') {
        // Slate/Neutral for closed accounts
        config = {
            colorClass: 'badge-neutral',
            icon: <AlertCircle size={14} className="mr-1" />
        };
    }

    return (
        <span className={`badge ${config.colorClass} flex items-center shadow-sm`}>
            {config.icon}
            {status}
        </span>
    );
};

export default StatusBadge;
