import {ModelConfig, ChatMessage} from './types';
import {controlPlaneConfig} from './config';

const MAX_RETRIES = controlPlaneConfig.max_retries;
const INITIAL_DELAY = controlPlaneConfig.initial_retry_delay;

interface StreamCallbacks {
    onToken?: (token: string) => void;
    onError?: (error: Error) => void;
    onComplete?: () => void;
}

export async function callModel(
    modelConfig: ModelConfig,
    messages: ChatMessage[],
    signal?: AbortSignal,
    streamCallbacks?: StreamCallbacks
): Promise<string> {
    let retryCount = 0;
    let delay = INITIAL_DELAY;
    let fullResponse = '';

    const handleStreamResponse = async (response: Response) => {
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body reader available');

        try {
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                // Convert the chunk to text
                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonData = line.slice(6);
                        if (jsonData === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(jsonData);
                            const content = parsed.choices[0]?.delta?.content || '';
                            if (content) {
                                fullResponse += content;
                                streamCallbacks?.onToken?.(content);
                            }
                        } catch (e) {
                            console.error('Error parsing stream data:', e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    };

    while (retryCount < MAX_RETRIES) {
        try {
            const response = await fetch(`${controlPlaneConfig.base_url}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${modelConfig.api_key}`,
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify({
                    model: modelConfig.model_name,
                    messages: messages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    temperature: modelConfig.temperature,
                    max_tokens: modelConfig.max_tokens,
                    stream: Boolean(streamCallbacks),
                }),
                signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            if (streamCallbacks) {
                await handleStreamResponse(response);
                streamCallbacks.onComplete?.();
                return fullResponse;
            } else {
                const data = await response.json();
                return data.choices[0].message.content;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                streamCallbacks?.onError?.(error);
                throw error;
            }

            retryCount++;
            const isLastRetry = retryCount === MAX_RETRIES;

            if (isLastRetry) {
                const errorMessage = `Failed to get response from ${modelConfig.name} after ${MAX_RETRIES} retries`;
                streamCallbacks?.onError?.(new Error(errorMessage));
                throw new Error(errorMessage);
            }

            console.warn(`Retry ${retryCount} for ${modelConfig.name}, waiting ${delay}s...`);
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
            delay *= 2; // Exponential backoff
        }
    }

    const finalError = new Error('Unexpected error in model call');
    streamCallbacks?.onError?.(finalError);
    throw finalError;
}

export function createModelStream(
    modelConfig: ModelConfig,
    messages: ChatMessage[],
    signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> {
    return fetch(`${controlPlaneConfig.base_url}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${modelConfig.api_key}`,
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
            model: modelConfig.model_name,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            temperature: modelConfig.temperature,
            max_tokens: modelConfig.max_tokens,
            stream: true,
        }),
        signal
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.body as ReadableStream<Uint8Array>;
    });
}

// Helper function to read SSE stream
export async function* readSSEStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<string, void, unknown> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, {stream: true});
            const lines = buffer.split('\n');

            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) yield content;
                    } catch (e) {
                        console.error('Error parsing SSE data:', e);
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}