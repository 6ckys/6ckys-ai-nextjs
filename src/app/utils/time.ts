export const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatRelativeTime = (timestamp: number): string => {
    const diff = (Date.now() - timestamp) / 60000; // minutes
    if (diff < 1) return 'now';
    if (diff < 60) return `${Math.floor(diff)}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
};

export const estimateTokens = (text: string | undefined | null): number => {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
};