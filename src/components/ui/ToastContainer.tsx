'use client';

import { useToastStore, Toast } from '@/stores/useToastStore';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastItem = ({ toast }: { toast: Toast }) => {
    const { removeToast } = useToastStore();

    const getToastIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle size={20} className="text-success" />;
            case 'error':
                return <XCircle size={20} className="text-error" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-warning" />;
            case 'info':
                return <Info size={20} className="text-info" />;
            default:
                return <Info size={20} className="text-info" />;
        }
    };

    const getToastClasses = () => {
        const baseClasses = 'alert shadow-lg mb-2 flex items-center justify-between';
        switch (toast.type) {
            case 'success':
                return `${baseClasses} alert-success`;
            case 'error':
                return `${baseClasses} alert-error`;
            case 'warning':
                return `${baseClasses} alert-warning`;
            case 'info':
                return `${baseClasses} alert-info`;
            default:
                return `${baseClasses} alert-info`;
        }
    };

    return (
        <div className={getToastClasses()}>
            <div className="flex items-center space-x-2">
                {getToastIcon()}
                <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
                onClick={() => removeToast(toast.id)}
                className="btn btn-ghost btn-sm btn-square"
                aria-label="Close toast"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default function ToastContainer() {
    const { toasts } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="toast toast-top toast-center z-50">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}