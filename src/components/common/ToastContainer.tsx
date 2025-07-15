'use client';

import { useToastStore, Toast } from '@/stores/useToastStore';
import { cn } from '@/utils';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

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
        const baseClasses =
            'alert shadow-lg mb-2 flex items-center justify-between';
        switch (toast.type) {
            case 'success':
                return cn(baseClasses, 'alert-success');
            case 'error':
                return cn(baseClasses, 'alert-error');
            case 'warning':
                return cn(baseClasses, 'alert-warning');
            case 'info':
                return cn(baseClasses, 'alert-info');
            default:
                return cn(baseClasses, 'alert-info');
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={getToastClasses()}
        >
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
        </motion.div>
    );
};

export default function ToastContainer() {
    const { toasts } = useToastStore();

    return (
        <div className="toast z-50">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
}
