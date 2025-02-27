import { NextRequest, NextResponse } from 'next/server';

if (!process.env.TRUFFLE_API_KEY) {
    throw new Error('TRUFFLE_API_KEY is not configured');
}

const API_KEY = process.env.TRUFFLE_API_KEY;

// You can change this to your own agent ID 
const AGENT_ID = "73c5fb52-318e-431b-84b4-63f483639a51" 

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

        const result = await fetch(`https://www.trytruffle.ai/api/v1/agents/${AGENT_ID}/run`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                input_data: input,
                json_mode: true //In this example, we have set the json_mode to true which uses the json_format schema defined during agent creation
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