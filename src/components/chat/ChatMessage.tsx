// src/components/chat/ChatMessage.tsx
import React from 'react';
import type { ChatMessage } from '@/lib/types';
import { cleanMarkdown } from '@/lib/utils';

interface ChatMessageProps {
    message: ChatMessage;
    isMultiModel?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMultiModel }) => {
    const content = message.role === 'assistant' ? cleanMarkdown(message.content) : message.content;
    const isAssistant = message.role === 'assistant';

    return (
        <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${isAssistant && isMultiModel ? 'w-full' : 'max-w-[80%]'}`}>
            <div
                className={`rounded-lg px-4 py-2 ${
                    message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.role === 'system'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                } ${isAssistant && isMultiModel ? 'w-full' : ''}`}
            >
                {message.model && (
                    <div className="text-xs font-medium mb-1" style={{ opacity: 0.7 }}>
                        {message.model}
                    </div>
                )}
                <div className="whitespace-pre-wrap">{content}</div>
                <div className="text-xs mt-1" style={{ opacity: 0.7 }}>
                    {message.timestamp.toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
};