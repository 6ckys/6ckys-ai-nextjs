'use client';

import { Message as MessageType } from '@/app/types/chat';
import { formatTime } from '@/app/utils/time';
import { useClipboard } from '@/app/hooks/useClipboard';
import { HiClipboard } from 'react-icons/hi2';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
import React from "react";

interface MessageProps {
    message: MessageType;
    isStreaming?: boolean;
    key?: string;
}

interface CodeProps {
    node?: unknown;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
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

export function Message({ message, isStreaming = false }: MessageProps) {
    const { copyToClipboard } = useClipboard();
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

    const handleCopyCode = (code: string) => {
        copyToClipboard(code);
    };

    const markdownComponents: Components = {
        code({ inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
                return (
                    <div className="relative group/code">
                        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
              <span className="text-xs text-gray-400 font-medium">
                {language}
              </span>
                            <button
                                onClick={() => handleCopyCode(codeString)}
                                className="flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors opacity-0 group-hover/code:opacity-100"
                            >
                                <HiClipboard className="w-3 h-3" />
                                Copy
                            </button>
                        </div>
                        <SyntaxHighlighter
                            language={language}
                            style={vscDarkPlus}
                            PreTag="div"
                            customStyle={{
                                margin: 0,
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                fontSize: '0.875rem',
                            }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            return (
                <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                    {children}
                </code>
            );
        },
        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4">
                {children}
            </blockquote>
        ),
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
        table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                    {children}
                </table>
            </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>,
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {children}
            </td>
        ),
    };

    return (
        <div className="mb-6 animate-message-slide group">
            <div className="flex items-center gap-3 mb-3">
                <div
                    className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0',
                        avatarStyles[message.role]
                    )}
                >
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
                        <HiClipboard className="w-3 h-3" />
                        Copy
                    </button>
                </div>
                <div className="text-xs text-pro-text-muted">
                    {formatTime(message.timestamp)}
                </div>
            </div>
            <div
                className={clsx(
                    'rounded-lg border p-4 leading-relaxed prose prose-sm max-w-none',
                    contentStyles[message.role],
                    'prose-headings:text-pro-text-primary',
                    'prose-p:text-pro-text-primary',
                    'prose-strong:text-pro-text-primary',
                    'prose-em:text-pro-text-primary',
                    'prose-ul:text-pro-text-primary',
                    'prose-ol:text-pro-text-primary',
                    'prose-li:text-pro-text-primary',
                    'prose-blockquote:text-pro-text-secondary',
                    'prose-code:text-pro-text-primary'
                )}
            >
                {message.role === 'user' ? (
                    <div>{message.content}</div>
                ) : (
                    <>
                        <ReactMarkdown components={markdownComponents}>
                            {message.content}
                        </ReactMarkdown>
                        {isStreaming && (
                            <span className="inline-block w-2 h-5 bg-primary rounded-sm animate-blink ml-1" />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
