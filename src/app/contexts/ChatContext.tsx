'use client';

import {createContext, ReactNode, useContext, useEffect, useReducer} from 'react';
import {Chat, ChatState, Message} from '@/app/types/chat';
import {useLocalStorage} from '@/app/hooks/useLocalStorage';
import {nanoid} from 'nanoid';

interface ChatContextType extends ChatState {
    createNewChat: () => void;
    selectChat: (chatId: string) => void;
    deleteChat: (chatId?: string) => void;
    addMessage: (role: Message['role'], content: string, model?: string) => Message | null;
    updateMessage: (messageId: string, content: string) => void;
    updateChatModel: (model: string) => void;
    setLoading: (loading: boolean) => void;
    toggleSidebar: () => void;
    getActiveChat: () => Chat | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type ChatAction =
    | { type: 'SET_CHATS'; payload: Chat[] }
    | { type: 'CREATE_CHAT'; payload: Chat }
    | { type: 'SELECT_CHAT'; payload: string }
    | { type: 'DELETE_CHAT'; payload: string }
    | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
    | { type: 'UPDATE_MESSAGE'; payload: { messageId: string; content: string } }
    | { type: 'UPDATE_CHAT_MODEL'; payload: { chatId: string; model: string } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'UPDATE_CHAT_TITLE'; payload: { chatId: string; title: string } };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
    switch (action.type) {
        case 'SET_CHATS':
            return {...state, chats: action.payload};

        case 'CREATE_CHAT':
            return {
                ...state,
                chats: [action.payload, ...state.chats],
                activeChatId: action.payload.id,
            };

        case 'SELECT_CHAT':
            return {...state, activeChatId: action.payload};

        case 'DELETE_CHAT':
            const filteredChats = state.chats.filter(chat => chat.id !== action.payload);
            return {
                ...state,
                chats: filteredChats,
                activeChatId: filteredChats.length > 0 ? filteredChats[0].id : null,
            };

        case 'ADD_MESSAGE':
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? {
                            ...chat,
                            messages: [...chat.messages, action.payload.message],
                            lastUpdatedAt: Date.now(),
                        }
                        : chat
                ),
            };

        case 'UPDATE_MESSAGE':
            return {
                ...state,
                chats: state.chats.map(chat => ({
                    ...chat,
                    messages: chat.messages.map(msg =>
                        msg.id === action.payload.messageId
                            ? {...msg, content: action.payload.content}
                            : msg
                    ),
                })),
            };

        case 'UPDATE_CHAT_MODEL':
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? {...chat, model: action.payload.model}
                        : chat
                ),
            };

        case 'UPDATE_CHAT_TITLE':
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? {...chat, title: action.payload.title}
                        : chat
                ),
            };

        case 'SET_LOADING':
            return {...state, isLoading: action.payload};

        case 'TOGGLE_SIDEBAR':
            return {...state, sidebarOpen: !state.sidebarOpen};

        default:
            return state;
    }
}

export function ChatProvider({children}: { children: ReactNode }) {
    const [storedChats, setStoredChats] = useLocalStorage<Chat[]>('ai-chat-explorer-chats', []);

    const initialState: ChatState = {
        chats: storedChats,
        activeChatId: null,
        isLoading: false,
        sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
    };

    const [state, dispatch] = useReducer(chatReducer, initialState);

    useEffect(() => {
        setStoredChats(state.chats);
    }, [state.chats, setStoredChats]);

    const createNewChat = () => {
        const newChat: Chat = {
            id: `chat_${nanoid()}`,
            title: 'New Chat',
            messages: [],
            model: 'claude-opus-4',
            createdAt: Date.now(),
            lastUpdatedAt: Date.now(),
        };
        dispatch({type: 'CREATE_CHAT', payload: newChat});
    };

    const selectChat = (chatId: string) => {
        dispatch({type: 'SELECT_CHAT', payload: chatId});
    };

    const deleteChat = (chatId?: string) => {
        const targetId = chatId || state.activeChatId;
        if (targetId) {
            dispatch({type: 'DELETE_CHAT', payload: targetId});
        }
    };

    const addMessage = (role: Message['role'], content: string, model?: string): Message | null => {
        if (!state.activeChatId) return null;

        const message: Message = {
            id: `msg_${nanoid()}`,
            role,
            content,
            timestamp: Date.now(),
            model,
        };

        dispatch({type: 'ADD_MESSAGE', payload: {chatId: state.activeChatId, message}});

        // Update chat title for first user message
        if (role === 'user' && getActiveChat()?.title === 'New Chat') {
            const title = content.slice(0, 35) + (content.length > 35 ? '...' : '');
            dispatch({type: 'UPDATE_CHAT_TITLE', payload: {chatId: state.activeChatId, title}});
        }

        return message;
    };

    const updateMessage = (messageId: string, content: string) => {
        dispatch({type: 'UPDATE_MESSAGE', payload: {messageId, content}});
    };

    const updateChatModel = (model: string) => {
        if (state.activeChatId) {
            dispatch({type: 'UPDATE_CHAT_MODEL', payload: {chatId: state.activeChatId, model}});
        }
    };

    const setLoading = (loading: boolean) => {
        dispatch({type: 'SET_LOADING', payload: loading});
    };

    const toggleSidebar = () => {
        dispatch({type: 'TOGGLE_SIDEBAR'});
    };

    const getActiveChat = () => {
        return state.chats.find(chat => chat.id === state.activeChatId);
    };

    const contextValue: ChatContextType = {
        ...state,
        createNewChat,
        selectChat,
        deleteChat,
        addMessage,
        updateMessage,
        updateChatModel,
        setLoading,
        toggleSidebar,
        getActiveChat,
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}