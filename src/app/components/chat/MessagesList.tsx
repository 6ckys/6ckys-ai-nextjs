'use client';

import {useRef} from 'react';
import {useChat} from '@/app/contexts/ChatContext';
import {HiChatBubbleLeftEllipsis} from 'react-icons/hi2';
import {Message} from "@/app/components/chat/Message";

interface MessagesListProps {
    streamingMessageId?: string;
}

export function MessagesList({streamingMessageId}: MessagesListProps) {
    const {getActiveChat} = useChat();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const activeChat = getActiveChat();

    if (!activeChat) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                <HiChatBubbleLeftEllipsis className="w-16 h-16 mb-4 text-white/50"/>
                <h3 className="text-xl font-semibold mb-2">Welcome!</h3>
                <p className="text-white/60 mb-6 max-w-md">
                    Click &apos;New Chat&apos; in the sidebar to begin.
                </p>
            </div>
        );
    }

    if (activeChat.messages.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center text-white/70">
                <HiChatBubbleLeftEllipsis className="w-12 h-12 mb-3"/>
                <h3 className="text-lg font-semibold mb-1">Chat is empty</h3>
                <p className="text-sm">Start the conversation below.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activeChat.messages.map((message) => (
                <Message
                    key={message.id}
                    message={message}
                    isStreaming={streamingMessageId === message.id}
                />
            ))}
            <div ref={messagesEndRef}/>
        </div>
    );
}