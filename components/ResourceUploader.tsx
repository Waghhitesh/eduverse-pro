'use client';

import { Upload, FileText, FileImage, FileCode, X } from 'lucide-react';
import { useState } from 'react';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
}

export default function ResourceUploader() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
        }));

        setFiles((prev) => [...prev, ...uploadedFiles]);
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <FileImage className="w-5 h-5" />;
        if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
        return <FileCode className="w-5 h-5" />;
    };

    return (
        <div className="w-full">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-xl p-8 transition-all duration-300
          ${isDragging
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }
        `}
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full gradient-academic flex items-center justify-center mb-4 animate-float">
                        <Upload className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold mb-2">Upload Your Resources</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        Drag and drop files here, or click to browse
                    </p>

                    <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                        Choose Files
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.ppt,.pptx"
                    />

                    <p className="text-xs text-muted-foreground mt-4">
                        Supported: PDF, Word, PowerPoint, Images, Text files
                    </p>
                </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <div className="mt-6 space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                        Uploaded Files ({files.length})
                    </h4>
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="text-primary">
                                    {getFileIcon(file.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(file.id)}
                                className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Remove file"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
