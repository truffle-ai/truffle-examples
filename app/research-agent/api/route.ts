import { NextRequest, NextResponse } from 'next/server';

// You can change this to your own agent ID
const AGENT_ID = "b7065bed-3961-4cff-b5b7-619d860d2021"
const API_KEY = process.env.TRUFFLE_API_KEY;

if (!API_KEY) {
  throw new Error('TRUFFLE_API_KEY is not configured');
}


export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Call the Truffle AI API directly
    const headers = {
      'x-api-key': API_KEY || '',
      'Content-Type': 'application/json',
    } as const;

    const response = await fetch(`https://www.trytruffle.ai/api/v1/agents/${AGENT_ID}/run`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        input_data: query,
        json_mode: true
      })
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error('API Error Response:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.message || 'Failed to process research query');
      } catch {
        throw new Error(errorText || 'Failed to process research query');
      }
    }

    const apiResponse = await response.json();
    console.log(apiResponse);

    if (!apiResponse.success) {
      throw new Error('Failed to process research query');
    }

    // Parse and format the response
    const result = typeof apiResponse.data === 'string' 
      ? JSON.parse(apiResponse.data)
      : apiResponse.data;

    return NextResponse.json({
      summary: result.summary,
      sources: result.sources
    });
  } catch (error) {
    console.error('Error processing research query:', error);
    return NextResponse.json(
      { error: 'Failed to process research query' },
      { status: 500 }
    );
  }
} 