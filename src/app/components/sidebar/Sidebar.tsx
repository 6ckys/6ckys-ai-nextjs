'use client';

import {useChat} from '@/app/contexts/ChatContext';
import clsx from 'clsx';
import {HiPlus, HiTrash, HiXMark} from 'react-icons/hi2';
import {Button} from "@/app/components/ui/Button";
import {ConversationsList} from "@/app/components/sidebar/ConversationsList";
import {ModelSelector} from "@/app/components/sidebar/ModelSelector";
import {Statistics} from "@/app/components/sidebar/Statistics";
import Image from "next/image";

export function Sidebar() {
    const {
        sidebarOpen,
        toggleSidebar,
        createNewChat,
        deleteChat,
        getActiveChat
    } = useChat();

    const activeChat = getActiveChat();

    const handleDeleteChat = () => {
        if (activeChat && confirm(`Delete "${activeChat.title}"? This is permanent.`)) {
            deleteChat();
        }
    };

    const handleCreateNewChat = () => {
        createNewChat();
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    };

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <div className={clsx(
                'fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-pro-bg-primary border-r border-white/20 flex flex-col transition-transform duration-300 ease-in-out',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
                <div className="p-6 border-b border-white/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo/Logo-AG.png"
                                alt="AG Logo"
                                width={50}
                                height={50}
                            />
                            <div>
                                <h1 className="text-xl font-bold text-pro-text-primary">AI Chat</h1>
                                <p className="text-sm text-white/60">By Alaa GMAR (6ckys)</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <HiXMark className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <Button onClick={handleCreateNewChat} className="w-full">
                        <HiPlus className="w-5 h-5"/>
                        New Chat
                    </Button>

                    <ConversationsList/>

                    <ModelSelector/>

                    <Statistics/>
                </div>

                <div className="p-6 border-t border-white/20">
                    <Button
                        variant="secondary"
                        onClick={handleDeleteChat}
                        disabled={!activeChat}
                        className="w-full"
                    >
                        <HiTrash className="w-5 h-5"/>
                        Delete Chat
                    </Button>
                </div>
            </div>
        </>
    );
}