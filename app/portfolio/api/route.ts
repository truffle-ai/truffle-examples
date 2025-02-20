import { NextRequest, NextResponse } from 'next/server';

if (!process.env.TRUFFLE_API_KEY) {
    throw new Error('TRUFFLE_API_KEY is not configured');
}

const API_KEY = process.env.TRUFFLE_API_KEY;

// You can change this to your own agent ID to use your own portfolio agent
const AGENT_ID = "224bfbe5-397c-47df-ac64-323614e4a1ec" 

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const headers = {
            'x-api-key': API_KEY || '',
            'Content-Type': 'application/json',
        } as const;

        const result = await fetch(`https://www.trytruffle.ai/api/v1/agents/${AGENT_ID}/run`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                input_data: message,
            })
        });

        if (!result.ok) {
            throw new Error('Failed to process message');
        }

        const apiResponse = await result.json();
        
        if (!apiResponse.success) {
            throw new Error('Failed to process message');
        }

        return NextResponse.json({ 
            response: apiResponse.data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error processing message:', error);
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        );
    }
} 