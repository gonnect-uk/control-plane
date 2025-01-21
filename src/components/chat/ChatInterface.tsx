// src/components/chat/ChatInterface.tsx
import React, {useState, useRef, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import {useDropzone} from 'react-dropzone';
import {ChatMessage as MessageComponent} from './ChatMessage';
import {StreamingResponse} from './StreamingResponse';
import {ChatMessage, ModelConfig, FileAttachment} from '@/lib/types';
import {controlPlaneConfig} from '@/lib/config';
import {callModel} from '@/lib/chat-service';
import {cleanMarkdown} from "@/lib/utils";
import {FileContent, readFileContent, getFileType, FileState} from "@/lib/fileUtils";
import {processFile, DocumentProcessingError, ProcessedDocument} from '@/lib/documentProcessing';
import {ChatMemoryManager} from '@/lib/chatMemory';
import {Document} from '@langchain/core/documents';
import FileDropdown from "@/components/chat/FileDropdown";


interface StreamingState {
    isStreaming: boolean;
    responses: {
        modelName: string;
        content: string;
    }[];
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [selectedModels, setSelectedModels] = useState<string[]>([controlPlaneConfig.models[0].name]);
    const [modelParams, setModelParams] = useState<{ [key: string]: ModelConfig }>(
        Object.fromEntries(controlPlaneConfig.models.map(model => [model.name, {...model}]))
    );
    const [files, setFiles] = useState<FileState[]>([]);
    const [isProcessingFiles, setIsProcessingFiles] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [streamingState, setStreamingState] = useState<StreamingState>({
        isStreaming: false,
        responses: []
    });

    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const abortController = useRef<AbortController | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const responseCache = useRef<{ [key: string]: string }>({});
    const memoryManager = useRef<ChatMemoryManager>(new ChatMemoryManager());

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages, streamingState]);

    const updateMemoryWithDocuments = async (processedDocs: ProcessedDocument[], fileId: string) => {
        const documents = processedDocs.map(doc => new Document({
            pageContent: doc.pageContent,
            metadata: {
                ...doc.metadata,
                fileId
            }
        }));
        await memoryManager.current.addDocument(fileId, documents);
    };

    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const handleFileSelect = async (fileId: string) => {
        setSelectedFileId(fileId);
        const selectedFile = files.find(f => f.id === fileId);

        if (selectedFile && selectedFile.content) {
            const chatHistory = await memoryManager.current.getChatHistory();
            const metadata = selectedFile.content.metadata;

            const fileDescription = `Selected Document Analysis:
Name: ${selectedFile.name}
Type: ${selectedFile.type}
Structure: ${metadata?.chunks || 1} segments across ${metadata?.totalPages || 1} pages
Content Overview: ${selectedFile.content.text.slice(0, 150)}...

Previous Context:
${chatHistory}

Expert Analysis Instructions:
1. Focus analysis on the selected document while maintaining awareness of other uploaded files
2. Provide specific references using chunk and page numbers
3. Extract key insights and patterns from the content
4. Compare findings with other documents when relevant
5. Maintain conversation context for coherent analysis

How would you like to analyze this document?`;

            setSystemPrompt(fileDescription);
        }
    };

    const processFiles = async (acceptedFiles: File[]) => {
        setIsProcessingFiles(true);
        setFileError(null);

        try {
            const newFiles: FileState[] = [];
            const fileContents: FileContent[] = [];

            for (const file of acceptedFiles) {
                try {
                    const content = await processFile(file);
                    const fileId = uuidv4();
                    const fileState: FileState = {
                        id: fileId,
                        name: file.name,
                        size: file.size,
                        type: getFileType(file),
                        content,
                        processed: true
                    };

                    // Update memory with processed documents
                    const processedDocs = content.text.split('\n\n')
                        .map((chunk, index) => ({
                            pageContent: chunk,
                            metadata: {
                                source: file.name,
                                type: getFileType(file),
                                chunk: index + 1
                            }
                        }));
                    await updateMemoryWithDocuments(processedDocs, fileId);

                    newFiles.push(fileState);
                    fileContents.push(content);
                } catch (error) {
                    if (error instanceof DocumentProcessingError) {
                        setFileError(`Error processing ${error.fileName}: ${error.message}`);
                    } else {
                        setFileError(`Failed to process ${file.name}: ${error.message}`);
                    }
                    return;
                }
            }

            setFiles(prev => [...prev, ...newFiles]);

            // Generate intelligent system prompt based on processed files
            if (!systemPrompt.trim()) {
                const chatHistory = await memoryManager.current.getChatHistory();
                const fileDescriptions = newFiles.map(file => {
                    const metadata = file.content?.metadata;
                    return `File: ${file.name} (${file.type})
Type: ${file.type}
Pages: ${metadata?.totalPages || 1}
Chunks: ${metadata?.chunks || 1}
Preview: ${file.content?.text.slice(0, 150)}...`;
                }).join('\n\n');

                const defaultPrompt = `Chat History:\n${chatHistory}\n\nAvailable Documents:

${fileDescriptions}

Key Instructions:
1. Use the chat history for context continuity
2. Reference specific chunks and files when quoting
3. Provide context when citing document parts
4. Search across all documents for relevant information
5. Compare information between documents when useful

How can I help you analyze these documents?`;

                setSystemPrompt(defaultPrompt);
            }

        } catch (error) {
            console.error('Error processing files:', error);
            setFileError('Failed to process files: ' + error.message);
        } finally {
            setIsProcessingFiles(false);
        }
    };

    const handleFileRemove = async (fileId: string) => {
        await memoryManager.current.removeDocument(fileId);

        setFiles(prev => {
            const newFiles = prev.filter(f => f.id !== fileId);

            if (newFiles.length === 0) {
                setSystemPrompt('');
                return newFiles;
            }

            const fileDescriptions = newFiles.map(file => {
                const metadata = file.content?.metadata;
                return `File: ${file.name} (${file.type})
Type: ${file.type}
Pages: ${metadata?.totalPages || 1}
Chunks: ${metadata?.chunks || 1}
Preview: ${file.content?.text.slice(0, 150)}...`;
            }).join('\n\n');

            const updatedPrompt = `You have access to the following documents:

${fileDescriptions}

Key Instructions:
1. Reference specific chunks and files when quoting
2. Provide context when citing document parts
3. Search across all documents for relevant information
4. Compare information between documents when useful

How can I help you analyze these documents?`;

            setSystemPrompt(updatedPrompt);
            return newFiles;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && files.length === 0) || streamingState.isStreaming || selectedModels.length === 0) return;

        const userInput = input.trim();
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        // Get relevant context from memory
        const relevantContext = await memoryManager.current.getRelevantContext(userInput);
        const contextStr = relevantContext.length > 0
            ? `\nRelevant context from documents:\n${relevantContext.map(doc =>
                `[${doc.metadata.source} (Chunk ${doc.metadata.chunk})]: ${doc.pageContent}`
            ).join('\n\n')}`
            : '';

        const userMessage: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: userInput,
            timestamp: new Date(),
            files: files.map(f => ({
                id: f.id,
                name: f.name,
                type: f.type,
                size: f.size
            }))
        };

        // Add message to memory
        await memoryManager.current.addMessage(userMessage);

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        responseCache.current = {};

        setStreamingState({
            isStreaming: true,
            responses: selectedModels.map(model => ({modelName: model, content: ''}))
        });

        try {
            await Promise.all(
                selectedModels.map(async (modelName, index) => {
                    const modelConfig = modelParams[modelName];
                    const messageHistory = [
                        ...(systemPrompt ? [{
                            id: 'system',
                            role: 'system' as const,
                            content: systemPrompt + contextStr,
                            timestamp: new Date()
                        }] : []),
                        ...messages,
                        userMessage
                    ];

                    let finalContent = '';
                    await callModel(
                        modelConfig,
                        messageHistory,
                        abortController.current!.signal,
                        {
                            onToken: (token) => {
                                finalContent += token;
                                responseCache.current[modelName] = finalContent;
                                setStreamingState(prev => ({
                                    ...prev,
                                    responses: prev.responses.map((r, i) =>
                                        i === index
                                            ? {...r, content: finalContent}
                                            : r
                                    )
                                }));
                            },
                            onError: (error) => {
                                const errorMsg = `Error from ${modelName}: ${error.message}`;
                                setMessages(prev => [...prev, {
                                    id: uuidv4(),
                                    role: 'system',
                                    content: errorMsg,
                                    timestamp: new Date()
                                }]);
                            },
                            onComplete: async () => {
                                const cleanContent = cleanMarkdown(finalContent);
                                if (finalContent) {
                                    const assistantMessage: ChatMessage = {
                                        id: uuidv4(),
                                        role: 'assistant',
                                        content: cleanContent,
                                        model: modelName,
                                        timestamp: new Date()
                                    };

                                    // Add assistant message to memory
                                    await memoryManager.current.addMessage(assistantMessage);

                                    setMessages(prev => [...prev, assistantMessage]);
                                }
                            }
                        }
                    );
                })
            );
        } catch (error) {
            if (error.name !== 'AbortError') {
                setMessages(prev => [...prev, {
                    id: uuidv4(),
                    role: 'system',
                    content: `Error: ${error.message}`,
                    timestamp: new Date()
                }]);
            }
        } finally {
            setStreamingState({
                isStreaming: false,
                responses: []
            });
            abortController.current = null;
            inputRef.current?.focus();
            responseCache.current = {};
        }
    };

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: processFiles,
        maxSize: 10 * 1024 * 1024, // 10MB limit
        accept: {
            'text/plain': ['.txt'],
            'text/csv': ['.csv'],
            'application/json': ['.json'],
            'text/markdown': ['.md'],
            'application/pdf': ['.pdf']
        }
    });

    const handleModelSelect = (modelName: string) => {
        setSelectedModels(prev => {
            if (prev.includes(modelName)) {
                return prev.filter(m => m !== modelName);
            }
            return [...prev, modelName];
        });
    };

    const handleParamChange = (modelName: string, param: string, value: number) => {
        setModelParams(prev => ({
            ...prev,
            [modelName]: {
                ...prev[modelName],
                [param]: value
            }
        }));
    };

    return (
        <div className="flex h-full bg-white">
            {/* Rest of the settings panel content */}
            <div className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
                <div className="space-y-4">
                    <div className="mb-4">
                        <FileDropdown
                            files={files}
                            onRemove={handleFileRemove}
                            onSelect={handleFileSelect}
                            selectedFileId={selectedFileId}
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Select Models</h3>
                        <div className="space-y-2">
                            {controlPlaneConfig.models.map((model) => (
                                <div key={model.name} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={model.name}
                                        checked={selectedModels.includes(model.name)}
                                        onChange={() => handleModelSelect(model.name)}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                    />
                                    <label htmlFor={model.name} className="ml-2 text-sm text-gray-900">
                                        {model.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedModels.map((modelName) => (
                        <div key={modelName} className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">{modelName} Settings</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Temperature</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={modelParams[modelName].temperature}
                                        onChange={(e) => handleParamChange(modelName, 'temperature', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-right text-gray-500">
                                        {modelParams[modelName].temperature}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Max Tokens</label>
                                    <input
                                        type="number"
                                        value={modelParams[modelName].max_tokens}
                                        onChange={(e) => handleParamChange(modelName, 'max_tokens', parseInt(e.target.value))}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => {
                            const nextMessage = messages[index + 1];
                            const isPartOfMultiResponse =
                                message.role === 'assistant' &&
                                nextMessage?.role === 'assistant' &&
                                selectedModels.length > 1;

                            return (
                                <div key={message.id} className={`${
                                    isPartOfMultiResponse ? 'flex gap-4' : ''
                                }`}>
                                    <MessageComponent
                                        message={message}
                                        isMultiModel={selectedModels.length > 1 && message.role === 'assistant'}
                                    />
                                    {isPartOfMultiResponse && <div className="border-l border-gray-200"/>}
                                </div>
                            );
                        })}
                        {streamingState.isStreaming && (
                            <StreamingResponse responses={streamingState.responses}/>
                        )}
                        <div ref={messagesEndRef}/>
                    </div>
                </div>

                {/* File Attachments */}
                {files.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center bg-gray-100 rounded px-2 py-1"
                                >
                                    <span className="text-sm text-gray-600">
                                        {file.name} ({file.type})
                                        {!file.processed && ' - Processing...'}
                                    </span>
                                    <button
                                        onClick={() => handleFileRemove(file.id)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        {fileError && (
                            <div className="mt-2 text-sm text-red-600">
                                {fileError}
                            </div>
                        )}
                        {isProcessingFiles && (
                            <div className="mt-2 text-sm text-blue-600">
                                Processing files...
                            </div>
                        )}
                    </div>
                )}

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div {...getRootProps()}
                             className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500">
                            <input {...getInputProps()} />
                            <p className="text-sm text-gray-500">
                                Drop files here or click to upload (Max 10MB)
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Supported formats: TXT, CSV, JSON, MD, PDF
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                                disabled={streamingState.isStreaming}
                            />
                            <button
                                type="submit"
                                disabled={streamingState.isStreaming || !selectedModels.length}
                                className={`px-4 py-2 rounded-lg text-white ${
                                    streamingState.isStreaming || !selectedModels.length
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                {streamingState.isStreaming ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;