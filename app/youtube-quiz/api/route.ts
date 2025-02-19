import { NextRequest, NextResponse } from 'next/server';

if (!process.env.TRUFFLE_API_KEY) {
    throw new Error('TRUFFLE_API_KEY is not configured');
}

const API_KEY = process.env.TRUFFLE_API_KEY;

const RESPONSE_SCHEMA = {
    name: "quiz",
    strict: true,
    schema: {
        type: 'object',
        properties: {
            title: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            questions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        question: {
                            type: 'string'
                        },
                        options: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            additionalProperties: false
                        },
                        correctAnswer: {
                            type: 'number'
                        },
                        explanation: {
                            type: 'string'
                        }
                    },
                    required: ['question', 'options', 'correctAnswer', 'explanation'],
                    additionalProperties: false
                },
                additionalProperties: false
            }
        },
        required: ['title', 'description', 'questions'],
        additionalProperties: false
    }
};

export async function POST(req: NextRequest) {
    try {
        const { url, context } = await req.json();

        if (!url) {
            return NextResponse.json(
                { error: 'YouTube URL is required' },
                { status: 400 }
            );
        }

        // Combine URL and context into a single input string
        const input = context 
            ? `URL: ${url}\nContext: ${context}\nPlease create a quiz based on this video, focusing on the specified context.`
            : `URL: ${url}\nPlease create an engaging quiz based on this video's content.`;

        const headers = {
            'x-api-key': API_KEY || '',
            'Content-Type': 'application/json',
        } as const;

        const result = await fetch(`https://www.trytruffle.ai/api/v1/agents/73c5fb52-318e-431b-84b4-63f483639a51/run`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                input_data: input,
                json_mode: true,
                json_format: JSON.stringify(RESPONSE_SCHEMA)
            })
        });

        if (!result.ok) {
            throw new Error('Failed to generate quiz');
        }

        const apiResponse = await result.json();
        
        if (!apiResponse.success) {
            throw new Error('Failed to generate quiz');
        }

        const quiz = typeof apiResponse.data === 'string'
            ? JSON.parse(apiResponse.data)
            : apiResponse.data;

        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Error generating quiz:', error);
        return NextResponse.json(
            { error: 'Failed to generate quiz' },
            { status: 500 }
        );
    }
} 