// src/components/FileDropdown.tsx
import React from 'react';
import { FileState } from '@/lib/types';

interface FileDropdownProps {
    files: FileState[];
    onRemove: (fileId: string) => void;
    onSelect: (fileId: string) => void;
    selectedFileId?: string | null;
}

export const FileDropdown: React.FC<FileDropdownProps> = ({
                                                              files,
                                                              onRemove,
                                                              onSelect,
                                                              selectedFileId
                                                          }) => {
    if (files.length === 0) return null;

    return (
        <div className="relative inline-block w-full">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Uploaded Files</h3>
                <span className="text-xs text-gray-500">{files.length} file(s)</span>
            </div>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-200">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className={`flex items-center justify-between p-3 ${
                            selectedFileId === file.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                    >
                        <button
                            onClick={() => onSelect(file.id)}
                            className="flex-1 flex items-center text-left"
                        >
                            <DocumentIcon className="w-4 h-4 text-gray-400 mr-2" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                    {file.type} • {formatFileSize(file.size)}
                                    {file.content?.metadata && ` • ${file.content.metadata.chunks} chunks`}
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => onRemove(file.id)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            aria-label="Remove file"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DocumentIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default FileDropdown;