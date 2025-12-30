'use client';

import { useState } from 'react';
import { Zap, GraduationCap, Brain, Download } from 'lucide-react';

interface Flashcard {
    front: string;
    back: string;
}

export default function FlashcardGenerator() {
    const [content, setContent] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateFlashcards = () => {
        setIsGenerating(true);

        // Simulate AI processing
        setTimeout(() => {
            const cards = createFlashcardsFromContent(content);
            setFlashcards(cards);
            setCurrentIndex(0);
            setIsFlipped(false);
            setIsGenerating(false);
        }, 1500);
    };

    const createFlashcardsFromContent = (text: string): Flashcard[] => {
        // Smart flashcard generation based on content
        const cards: Flashcard[] = [];

        // Extract key concepts and definitions
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

        sentences.forEach((sentence, index) => {
            if (index % 2 === 0 && sentences[index + 1]) {
                cards.push({
                    front: sentence.trim() + '?',
                    back: sentences[index + 1]?.trim() || 'See notes for details',
                });
            }
        });

        // If no cards generated, create sample cards
        if (cards.length === 0) {
            cards.push(
                { front: 'What is the main topic?', back: text.substring(0, 100) + '...' },
                { front: 'Key concept?', back: 'Review your notes for detailed explanation' }
            );
        }

        return cards.slice(0, 20); // Max 20 cards
    };

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const downloadFlashcards = () => {
        const text = flashcards.map((card, i) =>
            `Card ${i + 1}:\nQ: ${card.front}\nA: ${card.back}\n\n`
        ).join('');

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flashcards.txt';
        a.click();
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Brain className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">Flashcard Generator</h2>
                </div>
                <p className="text-slate-600">Convert any content into study flashcards instantly!</p>
            </div>

            {flashcards.length === 0 ? (
                <div className="glass-card p-8 rounded-xl">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Paste your notes, study material, or any content:
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Example: Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in chloroplasts using chlorophyll. The equation is: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂..."
                                className="input-field min-h-[200px] resize-y w-full"
                            />
                        </div>

                        <button
                            onClick={generateFlashcards}
                            disabled={!content.trim() || isGenerating}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generating Flashcards...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Generate Flashcards
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Progress */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                            Card {currentIndex + 1} of {flashcards.length}
                        </span>
                        <button
                            onClick={downloadFlashcards}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            <Download className="w-4 h-4" />
                            Download All
                        </button>
                    </div>

                    {/* Flashcard */}
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="relative h-80 cursor-pointer perspective-1000"
                    >
                        <div
                            className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                                }`}
                        >
                            {/* Front */}
                            <div className="absolute w-full h-full backface-hidden">
                                <div className="glass-card p-8 rounded-xl h-full flex flex-col items-center justify-center text-center border-4 border-blue-500">
                                    <GraduationCap className="w-12 h-12 text-blue-600 mb-4" />
                                    <p className="text-2xl font-semibold">{flashcards[currentIndex].front}</p>
                                    <p className="text-sm text-slate-500 mt-6">Click to reveal answer</p>
                                </div>
                            </div>

                            {/* Back */}
                            <div className="absolute w-full h-full backface-hidden rotate-y-180">
                                <div className="glass-card p-8 rounded-xl h-full flex flex-col items-center justify-center text-center border-4 border-green-500">
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4">
                                        <span className="text-white text-2xl">✓</span>
                                    </div>
                                    <p className="text-xl">{flashcards[currentIndex].back}</p>
                                    <p className="text-sm text-slate-500 mt-6">Click to flip back</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-4">
                        <button
                            onClick={prevCard}
                            className="btn-secondary flex-1"
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={() => {
                                setFlashcards([]);
                                setContent('');
                            }}
                            className="btn-secondary px-6"
                        >
                            New Set
                        </button>
                        <button
                            onClick={nextCard}
                            className="btn-secondary flex-1"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
        </div>
    );
}
