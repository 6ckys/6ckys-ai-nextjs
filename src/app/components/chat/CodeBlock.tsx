'use client';

import {useState} from 'react';
import {HiCheck, HiClipboard} from 'react-icons/hi2';
import {useClipboard} from '@/app/hooks/useClipboard';
import clsx from 'clsx';

interface CodeBlockProps {
    code: string;
    language: string;
}

export function CodeBlock({code, language}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const {copyToClipboard} = useClipboard();

    const handleCopy = async () => {
        const success = await copyToClipboard(code);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div
            className="relative bg-gray-900 border border-pro-border rounded-lg overflow-hidden my-4 hover:border-primary transition-colors">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-pro-border">
        <span className="text-xs font-semibold text-primary uppercase">
          {language || 'code'}
        </span>
                <button
                    onClick={handleCopy}
                    className={clsx(
                        'flex items-center gap-2 px-3 py-1.5 text-xs rounded transition-colors',
                        copied
                            ? 'bg-green-600 text-white'
                            : 'bg-pro-bg-tertiary text-pro-text-secondary hover:bg-primary hover:text-white'
                    )}
                >
                    {copied ? (
                        <>
                            <HiCheck className="w-3.5 h-3.5"/>
                            Copied!
                        </>
                    ) : (
                        <>
                            <HiClipboard className="w-3.5 h-3.5"/>
                            Copy
                        </>
                    )}
                </button>
            </div>

            <pre className="p-4 overflow-x-auto text-sm">
        <code className="font-mono text-pro-text-primary">{code}</code>
      </pre>
        </div>
    );
}