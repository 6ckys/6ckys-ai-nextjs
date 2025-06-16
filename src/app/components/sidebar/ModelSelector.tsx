'use client';

import {useChat} from '@/app/contexts/ChatContext';
import {ModelOption} from '@/app/types/chat';
import React from "react";

const modelOptions: ModelOption[] = [
    {value: "openrouter:anthropic/claude-4-sonnet-20250522", label: "Anthropic Claude 4 Sonnet"},
    {value: "openrouter:anthropic/claude-4-opus-20250522", label: "Anthropic Claude 4 Opus"},
    {value: "openrouter:openai/o3", label: "OpenAI O3"},
    {value: "openrouter:openai/gpt-4.1-2025-04-14", label: "OpenAI 4.1"},
    {value: "openrouter:openai/gpt-4.1-mini-2025-04-14", label: "OpenAI 4.1 Mini"},
    {value: "openrouter:openai/gpt-4.1-nano-2025-04-14", label: "OpenAI 4.1 Nano"},
    {value: "openrouter:openai/gpt-4.5-preview-2025-02-27", label: "OpenAI GPT-4.5 Preview"},
    {value: "openrouter:google/gemini-2.5-pro-preview-06-05", label: "Google: Gemini 2.5 Pro Preview 06-05"},
    {value: "openrouter:google/gemini-2.5-flash-preview-05-20", label: "Google: Gemini 2.5 Flash Preview 05-20"},
    {value: "openrouter:deepseek/deepseek-chat-v3", label: "DeepSeek: DeepSeek V3"},
    {value: "openrouter:perplexity/sonar-pro", label: "Perplexity: Sonar Pro"},
];

export function ModelSelector() {
    const {getActiveChat, updateChatModel} = useChat();
    const activeChat = getActiveChat();

    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updateChatModel(event.target.value);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Model
            </h3>
            <select
                value={activeChat?.model || 'openrouter:anthropic/claude-4-opus-20250522'}
                onChange={handleModelChange}
                className="w-full p-3 bg-pro-bg-primary border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
                disabled={!activeChat}
            >
                {modelOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-black text-white">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}