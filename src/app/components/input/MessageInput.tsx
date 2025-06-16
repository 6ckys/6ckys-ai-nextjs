'use client';

import {KeyboardEvent, useRef, useState} from 'react';
import {useChat} from '@/app/contexts/ChatContext';
import {HiPaperAirplane} from 'react-icons/hi2';
import {useToast} from '@/app/hooks/useToast';
import {Button} from "@/app/components/ui/Button";

declare global {
    interface Window {
        puter?: {
            ai: {
                chat: (content: string | Array<{ role: string; content: string }>, options: {
                    model: string;
                    messages: Array<{ role: string; content: string }>;
                    stream: boolean;
                }) => AsyncIterable<{ text?: string }>;
            };
        };
    }
}

export function MessageInput() {
    const [message, setMessage] = useState('');
    const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const {
        getActiveChat,
        addMessage,
        updateMessage,
        isLoading,
        setLoading
    } = useChat();

    const {addToast} = useToast();
    const activeChat = getActiveChat();

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 192)}px`;
        }
    };

    const handleSend = async () => {
        if (!message.trim() || isLoading || !activeChat) return;

        const userMessage = message.trim();
        setMessage('');
        setLoading(true);

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            // Add user message
            const userMessageObj = addMessage('user', userMessage);
            if (!userMessageObj) return;

            // Add AI message placeholder
            const aiMessage = addMessage('assistant', '', activeChat.model);
            if (!aiMessage) return;

            setStreamingMessageId(aiMessage.id);

            // Prepare message history including all messages up to this point
            const history = [
                ...activeChat.messages.map(m => ({role: m.role, content: m.content})),
                { role: 'user', content: userMessage }
            ];

            // Check if puter is available
            if (!window.puter?.ai?.chat) {
                throw new Error('Puter AI service is not available');
            }

            // Stream the response with retry logic
            const maxRetries = 3;
            let retryCount = 0;
            let responseStream: AsyncIterable<{ text?: string }> | undefined;

            while (retryCount < maxRetries) {
                try {
                    console.log('Making API call with model:', activeChat.model);
                    console.log('Message history:', history);

                    // Pass the history array directly as the first parameter
                    responseStream = await window.puter.ai.chat(history, {
                        model: activeChat.model,
                        messages: history,
                        stream: true,
                    });
                    break;
                } catch (error) {
                    console.error('API call error:', error);
                    retryCount++;
                    if (retryCount < maxRetries) {
                        console.log(`API call failed, retrying... (${retryCount}/${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                    } else {
                        throw error;
                    }
                }
            }

            if (!responseStream) {
                throw new Error('Failed to establish stream connection');
            }

            let accumulatedContent = '';
            let lastUpdateTime = Date.now();
            const updateInterval = 16; // Update UI every 16ms (roughly 60fps)

            for await (const part of responseStream) {
                if (part?.text) {
                    accumulatedContent += part.text;
                    const currentTime = Date.now();

                    // Update message content in state
                    aiMessage.content = accumulatedContent;

                    // Only update UI if enough time has passed since last update
                    if (currentTime - lastUpdateTime >= updateInterval) {
                        updateMessage(aiMessage.id, accumulatedContent);
                        lastUpdateTime = currentTime;
                    }
                }
            }

            // Final update to ensure we have the complete content
            updateMessage(aiMessage.id, accumulatedContent);

        } catch (error) {
            console.error('API Stream Error:', error);
            const errorMessage = `API Error: ${error instanceof Error ? error.message : 'The stream was interrupted or failed.'}`;

            // Find the AI message and update it with error
            if (streamingMessageId) {
                updateMessage(streamingMessageId, errorMessage);
            }

            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
            setStreamingMessageId(null);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSend();
        }
    };

    const canSend = message.trim() && !isLoading && activeChat;

    return (
        <div className="p-6 border-t border-white/20 bg-pro-bg-primary">
            <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
          <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                  setMessage(e.target.value);
                  autoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Ctrl+Enter to send)"
              className="w-full min-h-12 max-h-48 p-3 pr-12 bg-pro-bg-primary border border-white/20 rounded-lg text-white placeholder-white/40 resize-none focus:outline-none focus:border-white/40"
              rows={1}
              disabled={isLoading}
          />
                    <Button
                        onClick={handleSend}
                        disabled={!canSend}
                        size="sm"
                        className="absolute right-2 bottom-4 p-2"
                    >
                        <HiPaperAirplane className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}