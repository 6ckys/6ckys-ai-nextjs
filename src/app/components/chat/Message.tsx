'use client';

import {Message as MessageType} from '@/app/types/chat';
import {formatTime} from '@/app/utils/time';
import {useClipboard} from '@/app/hooks/useClipboard';
import {renderMarkdown} from '@/app/utils/markdown';
import {HiClipboard} from 'react-icons/hi2';
import clsx from 'clsx';

interface MessageProps {
    message: MessageType,
    isStreaming?: boolean,
    key?: string
}

const avatarStyles = {
    user: 'bg-blue-500 text-white',
    assistant: 'bg-green-600 text-white',
    system: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
};

const contentStyles = {
    user: 'bg-user-bg border-user-border text-pro-text-primary',
    assistant: 'bg-pro-bg-secondary border-pro-border text-pro-text-primary',
    system: 'bg-yellow-500/10 border-yellow-500 text-pro-text-primary',
    error: 'bg-red-500/10 border-red-500 text-pro-text-primary',
};

export function Message({message, isStreaming = false}: MessageProps) {
    const {copyToClipboard} = useClipboard();
    const sender = message.role.charAt(0).toUpperCase() + message.role.slice(1);

    let modelName = '';
    if (message.role === 'assistant' && message.model) {
        modelName = message.model
            .replace(/.*(?:openai|anthropic|google)\//, '')
            .replace(/-|\.|preview|:thinking/g, ' ');
    }

    const handleCopyMessage = () => {
        copyToClipboard(message.content);
    };

    return (
        <div className="mb-6 animate-message-slide group">
            <div className="flex items-center gap-3 mb-3">
                <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0',
                    avatarStyles[message.role]
                )}>
                    {message.role.slice(0, 3).toUpperCase()}
                </div>

                <div className="flex-1">
                    <div className="font-semibold text-pro-text-primary">{sender}</div>
                    {modelName && (
                        <div className="text-xs text-pro-text-muted">{modelName}</div>
                    )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleCopyMessage}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-pro-bg-tertiary border border-pro-border text-pro-text-secondary rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                        <HiClipboard className="w-3 h-3"/>
                        Copy
                    </button>
                </div>

                <div className="text-xs text-pro-text-muted">
                    {formatTime(message.timestamp)}
                </div>
            </div>

            <div className={clsx(
                'rounded-lg border p-4 word-break-words leading-relaxed markdown-content',
                contentStyles[message.role]
            )}>
                {message.role === 'user' ? (
                    <div>{message.content}</div>
                ) : (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: renderMarkdown(message.content) + (isStreaming ? '<span class="inline-block w-2 h-5 bg-primary rounded-sm animate-blink ml-1"></span>' : '')
                        }}
                    />
                )}
            </div>
        </div>
    );
}