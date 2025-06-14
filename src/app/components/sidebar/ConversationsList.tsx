'use client';

import {useChat} from '@/app/contexts/ChatContext';
import {formatRelativeTime} from '@/app/utils/time';
import clsx from 'clsx';

export function ConversationsList() {
    const {chats, activeChatId, selectChat} = useChat();

    if (chats.length === 0) {
        return (
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Conversations
                </h3>
                <div className="p-4 text-center text-sm text-white/40 border border-dashed border-white/20 rounded-lg">
                    No chats yet
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Conversations
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {chats.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => selectChat(chat.id)}
                        className={clsx(
                            'w-full p-3 rounded-lg text-left transition-colors flex justify-between items-center',
                            chat.id === activeChatId
                                ? 'bg-white text-black'
                                : 'hover:bg-white/10 text-white'
                        )}
                    >
            <span className="truncate text-sm font-medium">
              {chat.title}
            </span>
                        <span className="text-xs opacity-60 ml-2 flex-shrink-0">
              {formatRelativeTime(chat.lastUpdatedAt)}
            </span>
                    </button>
                ))}
            </div>
        </div>
    );
}