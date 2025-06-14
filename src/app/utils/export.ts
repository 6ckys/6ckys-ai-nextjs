import {Chat} from '@/app/types/chat';
import {formatTime} from './time';

export function exportChatToMarkdown(chat: Chat) {
    let markdown = `# Chat: ${chat.title}\n\n**Model:** ${chat.model}\n\n---\n\n`;

    chat.messages.forEach(msg => {
        markdown += `**${msg.role.toUpperCase()}** (_${formatTime(msg.timestamp)}_):\n\n${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([markdown], {type: 'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${chat.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();

    URL.revokeObjectURL(url);
}