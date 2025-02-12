import { NextResponse } from 'next/server';
import { TruffleAI } from 'truffle-ai';

const client = new TruffleAI(process.env.TRUFFLE_API_KEY || '');

export async function POST() {
  try {
    // Create and deploy a new agent
    const agent = await client.deployAgent({
      name: "Example Agent",
      instruction: `You are a helpful AI assistant that provides concise responses.
        When asked a question, you should:
        1. Think about the question carefully
        2. Provide a clear and direct answer
        3. Keep responses under 100 words`,
      model: "gpt-4o-mini",
      tool: "None"
    });

    const config = agent.getConfig();
    
    return NextResponse.json({
      success: true,
      agent: {
        agentId: agent.getId(),
        name: config.name,
        instruction: config.instruction,
        model: config.model
      }
    });

  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create and deploy agent' },
      { status: 500 }
    );
  }
} 