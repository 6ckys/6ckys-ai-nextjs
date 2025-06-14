'use client';

import {createContext, ReactNode, useCallback, useContext, useState} from 'react';
import {ToastMessage, ToastType} from '@/app/types/chat';

interface ToastContextType {
    toasts: ToastMessage[];
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({children}: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
        const id = `toast_${Date.now()}`;
        const toast: ToastMessage = {id, message, type, duration};

        setToasts(prev => [...prev, toast]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    const contextValue: ToastContextType = {
        toasts,
        addToast,
        removeToast
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}