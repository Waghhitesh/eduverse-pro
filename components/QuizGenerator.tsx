'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Trophy, RefreshCw } from 'lucide-react';

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
}

export default function QuizGenerator() {
    const [topic, setTopic] = useState('');
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateQuiz = () => {
        setIsGenerating(true);

        setTimeout(() => {
            const questions = createQuestions(topic);
            setQuiz(questions);
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setScore(0);
            setShowResult(false);
            setIsGenerating(false);
        }, 1500);
    };

    const createQuestions = (subject: string): Question[] => {
        // Sample questions - in production, this would use AI/database
        const templates: Question[] = [
            {
                question: `What is a key concept in ${subject}?`,
                options: ['Option A - Primary concept', 'Option B - Secondary concept', 'Option C - Related theory', 'Option D - Advanced application'],
                correctAnswer: 0,
            },
            {
                question: `Which of the following best describes ${subject}?`,
                options: ['An important field of study', 'A fundamental principle', 'A practical application', 'None of the above'],
                correctAnswer: 1,
            },
            {
                question: `In ${subject}, what is most important to understand?`,
                options: ['Basic definitions', 'Core principles and relationships', 'Historical context', 'Modern applications'],
                correctAnswer: 1,
            },
            {
                question: `How does ${subject} relate to real-world applications?`,
                options: ['Limited application', 'Theoretical only', 'Wide practical use', 'Research purposes only'],
                correctAnswer: 2,
            },
            {
                question: `What is a common misconception about ${subject}?`,
                options: ['It is too complex', 'It has no practical value', 'It is outdated', 'All concepts are proven'],
                correctAnswer: 3,
            },
        ];

        return templates.slice(0, 5);
    };

    const handleAnswer = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);

        setTimeout(() => {
            if (answerIndex === quiz[currentQuestion].correctAnswer) {
                setScore(score + 1);
            }

            if (currentQuestion + 1 < quiz.length) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    const resetQuiz = () => {
        setQuiz([]);
        setTopic('');
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        const percentage = (score / quiz.length) * 100;
        return (
            <div className="w-full max-w-2xl mx-auto text-center">
                <div className="glass-card p-12 rounded-xl">
                    <Trophy className={`w-24 h-24 mx-auto mb-6 ${percentage >= 70 ? 'text-yellow-500' : 'text-slate-400'}`} />
                    <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
                    <p className="text-6xl font-bold text-blue-600 my-6">{percentage.toFixed(0)}%</p>
                    <p className="text-2xl mb-8">
                        You scored {score} out of {quiz.length}
                    </p>

                    <div className="space-y-2 mb-8">
                        {percentage >= 90 && <p className="text-lg text-green-600 font-semibold">🌟 Outstanding! Perfect mastery!</p>}
                        {percentage >= 70 && percentage < 90 && <p className="text-lg text-blue-600 font-semibold">✨ Great job! You understand the topic well!</p>}
                        {percentage >= 50 && percentage < 70 && <p className="text-lg text-orange-600 font-semibold">📚 Good effort! Review and try again!</p>}
                        {percentage < 50 && <p className="text-lg text-red-600 font-semibold">💪 Keep practicing! You'll improve!</p>}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={resetQuiz} className="btn-secondary flex-1">
                            New Topic
                        </button>
                        <button
                            onClick={() => {
                                setCurrentQuestion(0);
                                setSelectedAnswer(null);
                                setScore(0);
                                setShowResult(false);
                            }}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Retry Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (quiz.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Quiz Generator</h2>
                    <p className="text-slate-600">Test your knowledge with AI-generated quizzes</p>
                </div>

                <div className="glass-card p-8 rounded-xl">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Enter a topic to generate quiz questions:
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Photosynthesis, World War 2, Python Programming..."
                                className="input-field w-full"
                                onKeyPress={(e) => e.key === 'Enter' && topic.trim() && generateQuiz()}
                            />
                        </div>

                        <button
                            onClick={generateQuiz}
                            disabled={!topic.trim() || isGenerating}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Quiz...
                                </>
                            ) : (
                                <>
                                    <Trophy className="w-5 h-5" />
                                    Generate Quiz
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz[currentQuestion];

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span>Question {currentQuestion + 1} of {quiz.length}</span>
                    <span>Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="glass-card p-8 rounded-xl mb-6">
                <h3 className="text-2xl font-semibold mb-6">{question.question}</h3>

                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === question.correctAnswer;
                        const showFeedback = selectedAnswer !== null;

                        return (
                            <button
                                key={index}
                                onClick={() => selectedAnswer === null && handleAnswer(index)}
                                disabled={selectedAnswer !== null}
                                className={`
                  w-full p-4 rounded-lg text-left transition-all transform hover:scale-[1.02]
                  ${!showFeedback ? 'bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400' : ''}
                  ${showFeedback && isCorrect ? 'bg-green-100 border-2 border-green-500' : ''}
                  ${showFeedback && isSelected && !isCorrect ? 'bg-red-100 border-2 border-red-500' : ''}
                  ${showFeedback && !isSelected && !isCorrect ? 'bg-slate-50 border-2 border-slate-200 opacity-60' : ''}
                  disabled:cursor-not-allowed
                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex-1">{option}</span>
                                    {showFeedback && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                                    {showFeedback && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={resetQuiz}
                className="btn-secondary w-full"
            >
                Exit Quiz
            </button>
        </div>
    );
}
