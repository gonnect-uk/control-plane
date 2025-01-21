// src/lib/fileUtils.ts
import {FileAttachment} from "@/lib/types";

export interface FileContent {
    text: string;
    type: string;
    name: string;
}

export const getFileType = (file: File | FileAttachment): string => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = file.type.toLowerCase();

    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('image')) return 'Image';
    if (extension === 'txt') return 'Text';
    if (extension === 'json') return 'JSON';
    if (extension === 'csv') return 'CSV';
    if (extension === 'md') return 'Markdown';
    if (['doc', 'docx'].includes(extension)) return 'Word Document';
    if (['xls', 'xlsx'].includes(extension)) return 'Excel';
    return 'Unknown';
};

export const readFileContent = async (file: File): Promise<FileContent> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                resolve({
                    text,
                    type: getFileType(file),
                    name: file.name
                });
            } catch (error) {
                reject(new Error(`Failed to process file ${file.name}: ${error}`));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};

export const generateSystemPrompt = (fileContents: FileContent[], userPrompt?: string): string => {
    const fileContexts = fileContents.map(file =>
        `File "${file.name}" (${file.type}):\n${file.text}\n`
    ).join('\n');

    const basePrompt = userPrompt ? `${userPrompt}\n\n` : '';
    return `${basePrompt}Context from attached files:\n\n${fileContexts}\n\nPlease consider the above context when responding. When referencing content from files, specify which file you're referring to.`;
};

