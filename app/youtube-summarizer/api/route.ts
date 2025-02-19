import { NextRequest, NextResponse } from 'next/server';

if (!process.env.TRUFFLE_API_KEY) {
    throw new Error('TRUFFLE_API_KEY is not configured');
}

const API_KEY = process.env.TRUFFLE_API_KEY;

const RESPONSE_SCHEMA = {
    type: 'object',
    required: ['summary', 'keyPoints', 'topicTimestamps', 'quotes', 'relatedTopics'],
    properties: {
        summary: {
            type: 'string',
            description: 'Executive summary of the video content (2-3 sentences)'
        },
        keyPoints: {
            type: 'array',
            items: {
                type: 'string'
            },
            description: 'List of key takeaways from the video'
        },
        topicTimestamps: {
            type: 'array',
            items: {
                type: 'object',
                required: ['time', 'topic'],
                properties: {
                    time: {
                        type: 'string',
                        pattern: '^[0-9]{2}:[0-9]{2}$',
                        description: 'Timestamp in MM:SS format'
                    },
                    topic: {
                        type: 'string',
                        description: 'Description of the topic at this timestamp'
                    }
                }
            }
        },
        quotes: {
            type: 'array',
            items: {
                type: 'string'
            },
            description: 'Important quotes or memorable statements from the video'
        },
        relatedTopics: {
            type: 'array',
            items: {
                type: 'string'
            },
            description: 'Suggested topics for further learning'
        }
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
            ? `URL: ${url}\nContext: ${context}\nPlease analyze this video with the given context in mind.`
            : url;

        // Call the Truffle AI API
        const headers = {
            'x-api-key': API_KEY || '',
            'Content-Type': 'application/json',
        } as const;

        const result = await fetch(`https://www.trytruffle.ai/api/v1/agents/73c5fb52-318e-431b-84b4-63f483639a51/run`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                input_data: input,
                json_mode: true
            })
        });

        if (!result.ok) {
            throw new Error('Failed to analyze video');
        }

        // Parse the JSON response
        const apiResponse = await result.json();

        console.log(apiResponse);
        
        if (!apiResponse.success) {
            throw new Error('Failed to analyze video');
        }

        const analysis = typeof apiResponse.data === 'string'
            ? JSON.parse(apiResponse.data)
            : apiResponse.data;

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Error analyzing video:', error);
        return NextResponse.json(
            { error: 'Failed to analyze video' },
            { status: 500 }
        );
    }
}