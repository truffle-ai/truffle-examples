import { NextRequest, NextResponse } from 'next/server';
import { TruffleAI } from 'truffle-ai';

if (!process.env.TRUFFLE_API_KEY) {
  throw new Error('TRUFFLE_API_KEY is not configured');
}

const client = new TruffleAI(process.env.TRUFFLE_API_KEY);

// Create a new agent for journal suggestions if needed
// You can create this agent through the Truffle AI dashboard or programmatically
// You can change this to your own agent ID
const JOURNAL_AGENT_ID = "7dd9b3db-a3cb-4e4f-a831-9d199ceedf8a" 

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    if (!JOURNAL_AGENT_ID) {
      return NextResponse.json(
        { error: 'Journal agent ID not configured' },
        { status: 500 }
      );
    }

    // Load the journal agent
    const agent = await client.loadAgent(JOURNAL_AGENT_ID);

    // Get suggestion from agent
    const response = await agent.run(text);

    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to generate suggestion' },
        { status: 500 }
      );
    }

    // Clean and format the suggestion
    const suggestion = typeof response.data === 'string' 
      ? response.data.trim()
      : JSON.stringify(response.data);

    return NextResponse.json({ suggestion });
  } catch (error: unknown) {
    console.error('Error generating suggestion:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 