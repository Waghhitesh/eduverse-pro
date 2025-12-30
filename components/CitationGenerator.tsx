'use client';

import { useState } from 'react';
import { BookMarked, Copy, Download } from 'lucide-react';

type CitationStyle = 'apa' | 'mla' | 'chicago';

interface CitationData {
    type: 'book' | 'website' | 'journal';
    author: string;
    title: string;
    year: string;
    publisher?: string;
    url?: string;
    accessDate?: string;
    pages?: string;
}

export default function CitationGenerator() {
    const [style, setStyle] = useState<CitationStyle>('apa');
    const [type, setType] = useState<'book' | 'website' | 'journal'>('website');
    const [data, setData] = useState<CitationData>({
        type: 'website',
        author: '',
        title: '',
        year: '',
        publisher: '',
        url: '',
        accessDate: new Date().toISOString().split('T')[0],
    });
    const [citation, setCitation] = useState('');

    const generateCitation = () => {
        let result = '';

        if (style === 'apa') {
            if (type === 'website') {
                result = `${data.author}. (${data.year}). ${data.title}. ${data.publisher || 'Website'}. Retrieved ${data.accessDate}, from ${data.url}`;
            } else if (type === 'book') {
                result = `${data.author}. (${data.year}). ${data.title}. ${data.publisher}.`;
            } else {
                result = `${data.author}. (${data.year}). ${data.title}. Journal Name, Volume(Issue), ${data.pages}.`;
            }
        } else if (style === 'mla') {
            if (type === 'website') {
                result = `${data.author}. "${data.title}." ${data.publisher || 'Web'}, ${data.year}, ${data.url}. Accessed ${data.accessDate}.`;
            } else if (type === 'book') {
                result = `${data.author}. ${data.title}. ${data.publisher}, ${data.year}.`;
            } else {
                result = `${data.author}. "${data.title}." Journal Name, vol. X, no. Y, ${data.year}, pp. ${data.pages}.`;
            }
        } else if (style === 'chicago') {
            if (type === 'website') {
                result = `${data.author}. "${data.title}." ${data.publisher || 'Website'}. ${data.year}. ${data.url} (accessed ${data.accessDate}).`;
            } else if (type === 'book') {
                result = `${data.author}. ${data.title}. ${data.publisher}, ${data.year}.`;
            } else {
                result = `${data.author}. "${data.title}." Journal Name XX, no. Y (${data.year}): ${data.pages}.`;
            }
        }

        setCitation(result);
    };

    const copyCitation = () => {
        navigator.clipboard.writeText(citation);
        alert('✅ Citation copied to clipboard!');
    };

    const downloadCitations = () => {
        const blob = new Blob([citation], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `citation-${style}.txt`;
        a.click();
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <BookMarked className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">Citation Generator</h2>
                </div>
                <p className="text-slate-600">Generate properly formatted citations in APA, MLA, or Chicago style</p>
            </div>

            <div className="glass-card p-8 rounded-xl space-y-6">
                {/* Style Selector */}
                <div>
                    <label className="block text-sm font-medium mb-3">Citation Style:</label>
                    <div className="grid grid-cols-3 gap-4">
                        {(['apa', 'mla', 'chicago'] as CitationStyle[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStyle(s)}
                                className={`py-3 px-4 rounded-lg font-semibold transition-all ${style === s
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Source Type */}
                <div>
                    <label className="block text-sm font-medium mb-3">Source Type:</label>
                    <div className="grid grid-cols-3 gap-4">
                        {(['website', 'book', 'journal'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => {
                                    setType(t);
                                    setData({ ...data, type: t });
                                }}
                                className={`py-2 px-4 rounded-lg font-medium transition-all capitalize ${type === t
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Author(s):</label>
                        <input
                            type="text"
                            value={data.author}
                            onChange={(e) => setData({ ...data, author: e.target.value })}
                            placeholder="Smith, J. or Smith, J., & Doe, A."
                            className="input-field w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Year:</label>
                        <input
                            type="text"
                            value={data.year}
                            onChange={(e) => setData({ ...data, year: e.target.value })}
                            placeholder="2024"
                            className="input-field w-full"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Title:</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            placeholder={type === 'book' ? 'Book Title' : type === 'website' ? 'Article or Page Title' : 'Journal Article Title'}
                            className="input-field w-full"
                        />
                    </div>

                    {type !== 'journal' && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Publisher:</label>
                            <input
                                type="text"
                                value={data.publisher || ''}
                                onChange={(e) => setData({ ...data, publisher: e.target.value })}
                                placeholder={type === 'book' ? 'Publisher Name' : 'Website Name'}
                                className="input-field w-full"
                            />
                        </div>
                    )}

                    {type === 'website' && (
                        <>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">URL:</label>
                                <input
                                    type="url"
                                    value={data.url || ''}
                                    onChange={(e) => setData({ ...data, url: e.target.value })}
                                    placeholder="https://example.com/article"
                                    className="input-field w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Access Date:</label>
                                <input
                                    type="date"
                                    value={data.accessDate || ''}
                                    onChange={(e) => setData({ ...data, accessDate: e.target.value })}
                                    className="input-field w-full"
                                />
                            </div>
                        </>
                    )}

                    {type === 'journal' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Pages:</label>
                            <input
                                type="text"
                                value={data.pages || ''}
                                onChange={(e) => setData({ ...data, pages: e.target.value })}
                                placeholder="123-145"
                                className="input-field w-full"
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={generateCitation}
                    disabled={!data.author || !data.title || !data.year}
                    className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generate Citation
                </button>

                {/* Generated Citation */}
                {citation && (
                    <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-lg">Generated Citation ({style.toUpperCase()}):</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyCitation}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </button>
                                <button
                                    onClick={downloadCitations}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-800 leading-relaxed">{citation}</p>
                    </div>
                )}
            </div>

            {/* Style Guide Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold mb-2">📘 APA Style</h4>
                    <p className="text-slate-600">Used in psychology, education, and social sciences. Emphasizes author-date citations.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold mb-2">📗 MLA Style</h4>
                    <p className="text-slate-600">Common in humanities. Uses author-page number format for in-text citations.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold mb-2">📙 Chicago Style</h4>
                    <p className="text-slate-600">Flexible system used in history and humanities. Offers notes-bibliography system.</p>
                </div>
            </div>
        </div>
    );
}
