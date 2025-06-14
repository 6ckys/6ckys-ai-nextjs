import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'dyslexic': ['Open-Dyslexic', 'Inter', 'system-ui', 'sans-serif'],
                'mono': ['SF Mono', 'Cascadia Code', 'Roboto Mono', 'monospace'],
            },
            colors: {
                'primary': {
                    DEFAULT: '#6366f1',
                    light: 'rgba(99, 102, 241, 0.1)',
                },
                'pro': {
                    'bg-primary': '#000000',
                    'bg-secondary': '#0a0a0a',
                    'bg-tertiary': '#111111',
                    'text-primary': '#ffffff',
                    'text-secondary': '#a1a1aa',
                    'text-muted': '#71717a',
                    'border': '#27272a',
                },
                'user-bg': '#3C4043',
                'user-border': '#5F6368',
            },
            animation: {
                'message-slide': 'messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'toast-slide': 'toastSlideInUp 0.3s ease',
                'toast-fade': 'toastFadeOut 0.3s ease forwards',
                'blink': 'blink 1s step-end infinite',
            },
            keyframes: {
                messageSlideIn: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                toastSlideInUp: {
                    from: { opacity: '0', transform: 'translateY(100%)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                toastFadeOut: {
                    to: { opacity: '0', transform: 'translateY(20px)' },
                },
                blink: {
                    '50%': { opacity: '0' },
                },
            },
        },
    },
    plugins: [],
}

export default config