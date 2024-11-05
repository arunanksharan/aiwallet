'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatHistoryItem } from './chat-history-item';
import { Message } from '@/lib/types/chat';

export const ChatHistory = () => {
    const { messages, setMessages } = useChatStore();

    useEffect(() => {
        const fetchChatHistory = async () => {
            const response = await fetch('/api/chat_history');
            const data = await response.json();
            setMessages(data.messages);
        };

        fetchChatHistory();
    }, [setMessages]);

    return (
        <div className="flex flex-col h-[500px] overflow-y-auto p-4 m-4 border rounded-lg">
            {messages.map((message: Message, index: number) => (
                <ChatHistoryItem key={index} message={message} />
            ))}
        </div>
    );
};
