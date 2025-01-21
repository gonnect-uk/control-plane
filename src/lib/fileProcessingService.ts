// src/lib/documentProcessing.ts
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { MarkdownLoader } from "langchain/document_loaders/fs/markdown";
import { BaseDocumentLoader } from 'langchain/document_loaders/base';
import { FileContent, getFileType } from './fileUtils';

export interface ProcessedDocument {
    pageContent: string;
    metadata: {
        source: string;
        type: string;
        page?: number;
        chunk?: number;
    };
}

export class DocumentProcessingError extends Error {
    constructor(message: string, public readonly fileName: string) {
        super(message);
        this.name = 'DocumentProcessingError';
    }
}

// Configure text splitter for chunking documents
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", " ", ""], // Order from most to least specific
});

// Get appropriate loader based on file type
function getLoader(file: File, blob: Blob): BaseDocumentLoader {
    const fileType = getFileType(file);
    const buffer = new Uint8Array(await blob.arrayBuffer());

    switch (fileType) {
        case 'PDF':
            return new PDFLoader(buffer);
        case 'CSV':
            return new CSVLoader(buffer);
        case 'JSON':
            return new JSONLoader(buffer);
        case 'Markdown':
            return new MarkdownLoader(buffer);
        case 'Text':
            return new TextLoader(buffer);
        default:
            throw new DocumentProcessingError(`Unsupported file type: ${fileType}`, file.name);
    }
}

async function processWithLangchain(file: File): Promise<ProcessedDocument[]> {
    try {
        // Create blob from file
        const blob = new Blob([file], { type: file.type });

        // Get appropriate loader
        const loader = getLoader(file, blob);

        // Load documents
        const docs = await loader.load();

        // Split documents into chunks
        const splitDocs = await textSplitter.splitDocuments(docs);

        // Process and return documents with metadata
        return splitDocs.map((doc, index) => ({
            pageContent: doc.pageContent,
            metadata: {
                ...doc.metadata,
                source: file.name,
                type: getFileType(file),
                chunk: index + 1
            }
        }));
    } catch (error) {
        throw new DocumentProcessingError(
            `Failed to process document: ${error.message}`,
            file.name
        );
    }
}

export async function processFile(file: File): Promise<FileContent> {
    try {
        // Process document using Langchain
        const processedDocs = await processWithLangchain(file);

        // Combine all chunks with metadata
        const combinedText = processedDocs.map(doc => {
            const chunkHeader = `--- Chunk ${doc.metadata.chunk}${doc.metadata.page ? ` (Page ${doc.metadata.page})` : ''} ---\n`;
            return chunkHeader + doc.pageContent;
        }).join('\n\n');

        return {
            text: combinedText,
            type: getFileType(file),
            name: file.name,
            metadata: {
                chunks: processedDocs.length,
                totalPages: Math.max(...processedDocs.map(doc => doc.metadata.page || 1))
            }
        };
    } catch (error) {
        throw new DocumentProcessingError(
            error instanceof DocumentProcessingError ? error.message : `Failed to process file: ${error.message}`,
            file.name
        );
    }
}