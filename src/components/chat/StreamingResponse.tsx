// src/components/chat/StreamingResponse.tsx
import React from 'react';
import { cleanMarkdown } from '@/lib/utils';

interface StreamingResponseProps {
    responses: {
        modelName: string;
        content: string;
    }[];
}

export const StreamingResponse: React.FC<StreamingResponseProps> = ({ responses }) => {
    if (responses.length === 0) return null;

    return (
        <div className="flex w-full" style={{ minHeight: '100px' }}>
            {responses.map((response, index) => (
                <div
                    key={index}
                    className={`flex-1 ${index > 0 ? 'border-l border-gray-200 pl-4 ml-4' : ''}`}
                >
                    <div className="bg-gray-100 rounded-lg p-4 h-full">
                        <div className="text-xs font-medium text-gray-600 mb-2">
                            {response.modelName}
                        </div>
                        <div className="text-gray-900 whitespace-pre-wrap">
                            {cleanMarkdown(response.content)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};