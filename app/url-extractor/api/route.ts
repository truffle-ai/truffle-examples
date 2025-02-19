import { NextRequest, NextResponse } from 'next/server';

if (!process.env.TRUFFLE_API_KEY) {
    throw new Error('TRUFFLE_API_KEY is not configured');
}

const API_KEY = process.env.TRUFFLE_API_KEY;

const AGENT_ID = process.env.URL_EXTRACTOR_AGENT_ID;

export async function POST(req: NextRequest) {
    try {
        const { url, context, schema } = await req.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        if (!schema) {
            return NextResponse.json(
                { error: 'Schema is required' },
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
                input_data: `
                    URL: ${url}
                    ${context ? `Context: ${context}\n` : ''}
                    
                    Extract content from the URL according to this schema:
                    ${JSON.stringify(schema, null, 2)}
                `,
                json_mode: true,
                json_format: JSON.stringify(schema)
            })
        });

        if (!result.ok) {
            throw new Error('Failed to extract content');
        }

        const apiResponse = await result.json();
        
        if (!apiResponse.success) {
            throw new Error('Failed to extract content');
        }

        const content = typeof apiResponse.data === 'string'
            ? JSON.parse(apiResponse.data)
            : apiResponse.data;

        return NextResponse.json({
            content,
            schema
        });
    } catch (error) {
        console.error('Error extracting content:', error);
        return NextResponse.json(
            { error: 'Failed to extract content' },
            { status: 500 }
        );
    }
} 