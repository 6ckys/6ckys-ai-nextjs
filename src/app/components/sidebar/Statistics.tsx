'use client';

import {useEffect, useState} from 'react';
import {useChat} from '@/app/contexts/ChatContext';
import {estimateTokens} from '@/app/utils/time';

export function Statistics() {
    const {getActiveChat} = useChat();
    const [sessionStart] = useState(Date.now());
    const [uptime, setUptime] = useState('0m 0s');

    const activeChat = getActiveChat();
    const messageCount = activeChat?.messages?.length ?? 0;

    const calculateTokenCount = (): number => {
        if (!activeChat?.messages) return 0;

        return activeChat.messages.reduce((accumulator: number, message) => {
            const content = message.content || '';
            const tokens = estimateTokens(content);
            return accumulator + tokens;
        }, 0);
    };

    const tokenCount = calculateTokenCount();

    useEffect(() => {
        const updateUptime = () => {
            const seconds = Math.floor((Date.now() - sessionStart) / 1000);
            setUptime(`${Math.floor(seconds / 60)}m ${seconds % 60}s`);
        };

        updateUptime();
        const interval = setInterval(updateUptime, 1000);

        return () => clearInterval(interval);
    }, [sessionStart]);

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Statistics
            </h3>
            <div className="bg-black/50 border border-white/20 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-white/60">Messages</span>
                    <span className="text-pro-text-primary">{messageCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/60">Tokens (Est.)</span>
                    <span className="text-pro-text-primary">{tokenCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/60">Uptime</span>
                    <span className="text-pro-text-primary">{uptime}</span>
                </div>
            </div>
        </div>
    );
}