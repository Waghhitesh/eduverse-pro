import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are "EduVerse Pro", the most knowledgeable academic AI assistant, acting like a brilliant professor and a supportive study companion. 
Your goal is to help students excel in their studies.

Guidelines:
1. Provide accurate, high-level academic information.
2. Be supportive, encouraging, and professional.
3. If a student asks for a "PYQ Analysis", focus on identify key patterns, recurring topics, and exam predictions.
4. If a student asks to "Summarize", create structured, hierarchical summaries with key definitions and formulas.
5. If a student asks for a "Report" or "Document", provide the content in a well-organized format suitable for academic standards.
6. Use markdown formatting (bold, lists, headers) to make responses readable.
7. Always maintain a premium, academic excellence vibe.

Current user request follows:`;

export async function POST(request: NextRequest) {
    try {
        const { message, context, resources } = await request.json();

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return NextResponse.json({
                success: true,
                response: "Hello! I am EduVerse Pro. It looks like my Gemini API Key hasn't been set up yet. Please add your API key to the .env.local file so I can start helping you with real AI power!",
                timestamp: new Date().toISOString(),
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build the full prompt with context and system persona
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Message: ${message}\n\n${context ? `Context: ${JSON.stringify(context)}` : ''}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            success: true,
            response: text,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process request with AI' },
            { status: 500 }
        );
    }
}

