// src/lib/chatMemory.ts
import { BufferMemory } from "langchain/memory";
import { ChatMessage } from "@/lib/types";
import { Document } from '@langchain/core/documents';

export interface MemoryMessage {
    type: 'human' | 'ai' | 'system';
    content: string;
    messageId: string;
    fileContext?: {
        fileName: string;
        chunk?: number;
        type: string;
    }[];
}

export class ChatMemoryManager {
    private memory: BufferMemory;
    private documentStore: Map<string, Document[]>;

    constructor(memoryKey: string = 'chat_history') {
        this.memory = new BufferMemory({
            memoryKey: memoryKey,
            returnMessages: true,
            inputKey: 'input',
            outputKey: 'output',
        });
        this.documentStore = new Map();
    }

    async addMessage(message: ChatMessage): Promise<void> {
        const memoryMessage: MemoryMessage = {
            type: message.role === 'user' ? 'human' : message.role === 'assistant' ? 'ai' : 'system',
            content: message.content,
            messageId: message.id,
            fileContext: message.files?.map(file => ({
                fileName: file.name,
                type: file.type
            }))
        };

        await this.memory.saveContext(
            { input: message.content },
            { output: message.role === 'assistant' ? message.content : '' }
        );
    }

    async addDocument(documentId: string, chunks: Document[]): Promise<void> {
        this.documentStore.set(documentId, chunks);
    }

    async removeDocument(documentId: string): Promise<void> {
        this.documentStore.delete(documentId);
    }

    async getRelevantContext(query: string): Promise<Document[]> {
        const relevantDocs: Document[] = [];

        // Simple relevance check - can be enhanced with embeddings
        for (const docs of this.documentStore.values()) {
            for (const doc of docs) {
                if (this.isRelevant(doc.pageContent, query)) {
                    relevantDocs.push(doc);
                }
            }
        }

        return relevantDocs;
    }

    private isRelevant(content: string, query: string): boolean {
        // Simple relevance check based on term presence
        // Can be enhanced with more sophisticated matching
        const normalizedContent = content.toLowerCase();
        const normalizedQuery = query.toLowerCase();
        const terms = normalizedQuery.split(' ');

        return terms.some(term => normalizedContent.includes(term));
    }

    async getChatHistory(): Promise<string> {
        const history = await this.memory.loadMemoryVariables({});
        return history.chat_history || '';
    }

    async clear(): Promise<void> {
        await this.memory.clear();
        this.documentStore.clear();
    }
}