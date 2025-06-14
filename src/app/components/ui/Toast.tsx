'use client';

import {useToast} from '@/app/hooks/useToast';
import clsx from 'clsx';
import {HiCheckCircle, HiExclamationTriangle, HiInformationCircle, HiXCircle} from 'react-icons/hi2';

const toastIcons = {
    success: HiCheckCircle,
    error: HiXCircle,
    warning: HiExclamationTriangle,
    info: HiInformationCircle,
};

const toastStyles = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-blue-500',
};

export function ToastContainer() {
    const {toasts} = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
            {toasts.map((toast) => {
                const Icon = toastIcons[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={clsx(
                            'bg-gray-800 border border-gray-600 border-l-4 rounded-lg p-4 text-white text-sm shadow-lg min-w-64 animate-toast-slide',
                            toastStyles[toast.type]
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 flex-shrink-0"/>
                            <span>{toast.message}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}