// src/components/chat/ModeratorBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/lib/types';

interface ModerationResult {
    flagged: boolean;
    categories: {
        [key: string]: boolean;
    };
    categoryScores: {
        [key: string]: number;
    };
}

interface ModerationResponse {
    id: string;
    model: string;
    results: ModerationResult[];
}

interface TimedMessage extends ChatMessage {
    processingTime?: number;
}

const ModeratorBot: React.FC = () => {
    const [messages, setMessages] = useState<TimedMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const checkModeration = async (content: string): Promise<ModerationResponse> => {
        try {
            const response = await fetch('http://localhost:8080/api/moderation/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Moderation API error:', error);
            throw new Error('Failed to check content moderation');
        }
    };

    const formatModerationResponse = (result: ModerationResult): string => {
        const significantScores = Object.entries(result.categoryScores)
            .filter(([_, score]) => score > 0.01)
            .sort((a, b) => b[1] - a[1])
            .map(([category, score]) => `${category}: ${(score * 100).toFixed(1)}%`);

        if (result.flagged || significantScores.length > 0) {
            return `Content Analysis Results:
            
${result.flagged ? '⚠️ Content has been flagged for moderation.' : '⚠️ Potential concerns detected.'}

Significant category scores:
${significantScores.length > 0 ? significantScores.join('\n') : 'No significant category scores.'}

Recommendation: ${result.flagged ? 'Content requires review.' : 'Content may need review.'}`;
        }

        return '✅ Content Analysis Complete: No concerning content detected.';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userContent = input.trim();
        setInput('');
        setIsLoading(true);
        const startTime = performance.now();

        const userMessage: TimedMessage = {
            id: uuidv4(),
            role: 'user',
            content: userContent,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const moderation = await checkModeration(userContent);
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            const botResponse = formatModerationResponse(moderation.results[0]);

            const botMessage: TimedMessage = {
                id: uuidv4(),
                role: 'assistant',
                content: botResponse,
                timestamp: new Date(),
                processingTime
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Moderation error:', error);
            const errorMessage: TimedMessage = {
                id: uuidv4(),
                role: 'system',
                content: 'Unable to complete content moderation. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h2 className="text-lg font-semibold text-gray-900">Content Moderation Bot</h2>
                <p className="text-sm text-gray-600">Check content for potentially harmful or inappropriate material.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : message.role === 'system'
                                        ? 'bg-red-100 text-red-900'
                                        : 'bg-gray-100 text-gray-900'
                            }`}
                        >
                            <pre className="whitespace-pre-wrap font-sans text-sm">{message.content}</pre>
                            <div className="flex justify-between items-center text-xs mt-1 opacity-70">
                                <span>{message.timestamp.toLocaleTimeString()}</span>
                                {message.processingTime && (
                                    <span className="ml-2 text-xs">
                                        ⚡ {message.processingTime.toFixed(0)}ms
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type content to check for moderation..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-white ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        <span className="text-white">{isLoading ? 'Checking...' : 'Check'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModeratorBot;