'use client';

import {useChat} from '@/app/contexts/ChatContext';
import {ModelOption} from '@/app/types/chat';
import React from "react";

const modelOptions: ModelOption[] = [
    {value: "claude-sonnet-4", label: "Anthropic Claude 4 Sonnet"},
    {value: "claude-opus-4", label: "Anthropic Claude 4 Opus"},
    {value: "gpt-4.1", label: "OpenAI 4.1"},
    {value: "gpt-4.1-mini", label: "OpenAI 4.1 Mini"},
    {value: "gpt-4.1-nano", label: "OpenAI 4.1 Nano"},
    {value: "gpt-4.5-preview", label: "OpenAI GPT-4.5 Preview"},
    {value: "gpt-4o", label: "OpenAI 4o"},
    {value: "gpt-4o-mini", label: "OpenAI 4o Mini"},
    {value: "o1", label: "OpenAI O1"},
    {value: "o1-mini", label: "OpenAI O1 Mini"},
    {value: "o1-pro", label: "OpenAI O1 Pro"},
    {value: "o3", label: "OpenAI O3"},
    {value: "o3-mini", label: "OpenAI O3 Mini"},
    {value: "o4-mini", label: "OpenAI O4 Mini"},
    {value: "google/gemini-2.5-flash-preview", label: "Gemini 2.5 flash preview"},
    {value: "google/gemini-2.5-flash-preview:thinking", label: "Gemini 2.5 flash preview thinking"},
    {value: "google/gemini-2.5-pro-exp-03-25:free", label: "Gemini 2.5 pro exp 03-25"},
    {value: "x-ai/grok-3-beta", label: "Grok3 Beta"},
    {value: "mistral-large-latest", label: "Mistral Large"},
    {value: "meta-llama/llama-4-maverick", label: "Llama 4 Maverick"},
    {value: "meta-llama/llama-4-scout", label: "Llama 4 Scout"},
    {value: "deepseek-chat", label: "Deepseek Chat"},
    {value: "deepseek-reasoner", label: "Deepseek Reasoner"},
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
                value={activeChat?.model || 'claude-opus-4'}
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