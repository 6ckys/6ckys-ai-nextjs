import {ButtonHTMLAttributes, ReactNode} from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export function Button({
                           variant = 'primary',
                           size = 'md',
                           className,
                           children,
                           ...props
                       }: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-white text-black hover:bg-white/90 focus:ring-white',
        secondary: 'bg-pro-bg-tertiary border border-pro-border text-pro-text-secondary hover:bg-red-500/30 focus:ring-red-500',
        ghost: 'hover:bg-white/10 text-pro-text-secondary focus:ring-white/20',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm gap-2',
        md: 'px-4 py-3 text-sm gap-3',
        lg: 'px-6 py-4 text-base gap-3',
    };

    return (
        <button
            className={clsx(baseClasses, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}