export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
    timestamp: number;
    model?: string;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    model: string;
    createdAt: number;
    lastUpdatedAt: number;
}

export interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
    isLoading: boolean;
    sidebarOpen: boolean;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

export interface ModelOption {
    value: string;
    label: string;
}