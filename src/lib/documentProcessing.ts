// src/lib/documentProcessing.ts
import { Document } from '@langchain/core/documents';
import { FileContent, getFileType } from './fileUtils';

export interface ProcessedDocument {
    pageContent: string;
    metadata: {
        source: string;
        type: string;
        chunk?: number;
    };
}

export class DocumentProcessingError extends Error {
    constructor(message: string, public readonly fileName: string) {
        super(message);
        this.name = 'DocumentProcessingError';
    }
}

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

// Simple text splitter function
function splitTextIntoChunks(text: string, chunkSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/([.!?])\s+/);
    let currentChunk = '';

    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        if (currentChunk.length + sentence.length > chunkSize) {
            chunks.push(currentChunk.trim());
            // Keep the overlap from the previous chunk
            currentChunk = currentChunk.slice(-overlap) + sentence;
        } else {
            currentChunk += sentence + ' ';
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

async function processTextContent(text: string, fileName: string, type: string): Promise<ProcessedDocument[]> {
    const chunks = splitTextIntoChunks(text);
    return chunks.map((chunk, index) => ({
        pageContent: chunk,
        metadata: {
            source: fileName,
            type: type,
            chunk: index + 1
        }
    }));
}

async function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

async function processWithBrowserAPI(file: File): Promise<ProcessedDocument[]> {
    try {
        const fileType = getFileType(file);
        const content = await readFileAsText(file);

        // For CSV files, parse and convert to readable format
        if (fileType === 'CSV') {
            const rows = content.split('\n').map(row => row.split(','));
            const headers = rows[0];
            const csvContent = rows.slice(1)
                .map(row => headers.map((header, i) => `${header}: ${row[i]}`).join('\n'))
                .join('\n\n');
            return processTextContent(csvContent, file.name, fileType);
        }

        // For JSON files, pretty print
        if (fileType === 'JSON') {
            try {
                const jsonObj = JSON.parse(content);
                const prettyJson = JSON.stringify(jsonObj, null, 2);
                return processTextContent(prettyJson, file.name, fileType);
            } catch (e) {
                throw new Error('Invalid JSON file');
            }
        }

        // For other file types (TXT, MD), process as is
        return processTextContent(content, file.name, fileType);

    } catch (error) {
        throw new DocumentProcessingError(
            `Failed to process document: ${error.message}`,
            file.name
        );
    }
}

export async function processFile(file: File): Promise<FileContent> {
    try {
        const processedDocs = await processWithBrowserAPI(file);

        // Combine all chunks with metadata
        const combinedText = processedDocs.map(doc => {
            const chunkHeader = `--- Chunk ${doc.metadata.chunk} ---\n`;
            return chunkHeader + doc.pageContent;
        }).join('\n\n');

        return {
            text: combinedText,
            type: getFileType(file),
            name: file.name,
            metadata: {
                chunks: processedDocs.length,
                totalPages: 1 // Since we're not processing PDFs in this version
            }
        };
    } catch (error) {
        throw new DocumentProcessingError(
            error instanceof DocumentProcessingError ? error.message : `Failed to process file: ${error.message}`,
            file.name
        );
    }
}