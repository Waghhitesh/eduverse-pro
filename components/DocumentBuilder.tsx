'use client';

import { useState } from 'react';
import { FileText, Presentation, FileSpreadsheet, Download, Sparkles } from 'lucide-react';

type DocumentType = 'pdf' | 'word' | 'ppt' | null;

interface FormData {
    title: string;
    content: string;
    sections: string;
    format: 'academic' | 'professional' | 'creative';
}

export default function DocumentBuilder() {
    const [selectedType, setSelectedType] = useState<DocumentType>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        sections: '',
        format: 'academic',
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const documentTypes = [
        {
            type: 'pdf' as DocumentType,
            icon: FileText,
            label: 'PDF Report',
            description: 'Professional reports & assignments',
        },
        {
            type: 'word' as DocumentType,
            icon: FileSpreadsheet,
            label: 'Word Document',
            description: 'Editable documents',
        },
        {
            type: 'ppt' as DocumentType,
            icon: Presentation,
            label: 'PowerPoint',
            description: 'Presentations & slideshows',
        },
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            const { generatePDF, generateWord, generatePPT } = await import('@/lib/fileGenerator');
            const { title, content, sections: sectionsStr } = formData;
            const sections = sectionsStr ? sectionsStr.split(',').map(s => s.trim()) : ['Introduction', 'Main Content', 'Conclusion'];

            if (selectedType === 'pdf') {
                await generatePDF(title, content, sections);
            } else if (selectedType === 'word') {
                await generateWord(title, content, sections);
            } else if (selectedType === 'ppt') {
                await generatePPT(title, content, sections);
            }

            alert(`✅ ${selectedType?.toUpperCase()} document "${title}" downloaded! Check your Downloads folder.`);
            setFormData({ title: '', content: '', sections: '', format: 'academic' });
            setSelectedType(null);
        } catch (error) {
            alert('❌ Error generating document. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!selectedType) {
        return (
            <div className="w-full">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Document Generator</h2>
                    <p className="text-muted-foreground">
                        Choose a document type to get started
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {documentTypes.map((doc) => {
                        const Icon = doc.icon;
                        return (
                            <button
                                key={doc.type}
                                onClick={() => setSelectedType(doc.type)}
                                className="glass-card p-6 rounded-xl card-hover group"
                            >
                                <div className="w-14 h-14 rounded-full gradient-academic flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{doc.label}</h3>
                                <p className="text-sm text-muted-foreground">{doc.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => setSelectedType(null)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to document types
                </button>
            </div>

            <div className="glass-card p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Create {selectedType?.toUpperCase()} Document
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Document Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Artificial Intelligence Research Report"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Main Content / Topic *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Describe the main content, key points, or paste your notes here..."
                            className="input-field min-h-[120px] resize-y"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Sections (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.sections}
                            onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
                            placeholder="Introduction, Methodology, Results, Conclusion"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Format Style
                        </label>
                        <select
                            value={formData.format}
                            onChange={(e) => setFormData({ ...formData, format: e.target.value as FormData['format'] })}
                            className="input-field"
                        >
                            <option value="academic">Academic (Formal, Citations)</option>
                            <option value="professional">Professional (Business Style)</option>
                            <option value="creative">Creative (Engaging, Visual)</option>
                        </select>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!formData.title || !formData.content || isGenerating}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Generate {selectedType?.toUpperCase()}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-accent/50 border border-border">
                <p className="text-sm text-muted-foreground">
                    <strong>💡 Tip:</strong> For better results, provide detailed content and specific requirements.
                    You can also upload reference materials using the resource uploader.
                </p>
            </div>
        </div>
    );
}
