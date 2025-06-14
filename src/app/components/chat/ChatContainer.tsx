'use client';

import {useChat} from '@/app/contexts/ChatContext';
import {HiArrowDownTray, HiArrowsPointingIn, HiArrowsPointingOut, HiBars3} from 'react-icons/hi2';
import {JSX, useState} from 'react';
import {exportChatToMarkdown} from '@/app/utils/export';
import {Button} from "@/app/components/ui/Button";
import {MessagesList} from "@/app/components/chat/MessagesList";
import {MessageInput} from "@/app/components/input/MessageInput";

export function ChatContainer() {
    const {getActiveChat, toggleSidebar} = useChat();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const activeChat = getActiveChat();

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleExport = () => {
        if (activeChat) {
            exportChatToMarkdown(activeChat);
        }
    };

    const getFullscreenIcon = (): JSX.Element => {
        if (isFullscreen) {
            return <HiArrowsPointingIn className="w-5 h-5"/>;
        }
        return <HiArrowsPointingOut className="w-5 h-5"/>;
    };

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <header className="p-4 border-b border-white/20 flex items-center justify-between bg-pro-bg-primary">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <HiBars3 className="w-6 h-6"/>
                    </button>
                    <h2 className="text-lg font-semibold truncate text-pro-text-primary">
                        {activeChat?.title || 'AI Chat'}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleExport}
                        disabled={!activeChat || activeChat.messages.length === 0}
                    >
                        <HiArrowDownTray className="w-4 h-4"/>
                        Export
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                    >
                        {getFullscreenIcon()}
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
                <MessagesList/>
            </main>

            {activeChat && <MessageInput/>}
        </div>
    );
}