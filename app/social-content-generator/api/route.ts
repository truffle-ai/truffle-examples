import { NextRequest, NextResponse } from 'next/server';
import { TruffleAI } from 'truffle-ai';

if (!process.env.TRUFFLE_API_KEY) {
  throw new Error('TRUFFLE_API_KEY is not configured');
}

const client = new TruffleAI(process.env.TRUFFLE_API_KEY);

// Create agents for each step in the chain
// You can create these agents through the Truffle AI dashboard or programmatically
const AGENT_CHAIN = {
  research: process.env.RESEARCH_AGENT_ID,
  twitter: process.env.TWITTER_AGENT_ID,
  linkedin: process.env.LINKEDIN_AGENT_ID,
  instagram: process.env.INSTAGRAM_AGENT_ID
};

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Validate agent IDs
    for (const [key, value] of Object.entries(AGENT_CHAIN)) {
      if (!value) {
        return NextResponse.json(
          { error: `${key} agent ID not configured` },
          { status: 500 }
        );
      }
    }

    // Step 1: Research Phase
    const researchAgent = await client.loadAgent(AGENT_CHAIN.research);
    const researchResponse = await researchAgent.run(topic);

    if (!researchResponse.success) {
      return NextResponse.json(
        { error: 'Research phase failed' },
        { status: 500 }
      );
    }

    // Parse research results
    const researchData = typeof researchResponse.data === 'string' 
      ? researchResponse.data 
      : JSON.stringify(researchResponse.data)

    // Step 2: Parallel Content Generation
    const contentPromises = [
      generateContent('twitter', topic, researchData),
      generateContent('linkedin', topic, researchData),
      generateContent('instagram', topic, researchData)
    ];

    const contentResults = await Promise.all(contentPromises);

    // Combine all results
    return NextResponse.json({
      research: researchData,
      content: {
        twitter: contentResults[0],
        linkedin: contentResults[1],
        instagram: contentResults[2]
      }
    });

  } catch (error) {
    console.error('Error in content generation chain:', error);
    return NextResponse.json(
      { error: 'Failed to process the content generation chain' },
      { status: 500 }
    );
  }
}

async function generateContent(
  platform: 'twitter' | 'linkedin' | 'instagram',
  topic: string,
  research: any
) {
  try {
    const agent = await client.loadAgent(AGENT_CHAIN[platform]);
    
    // The context is minimal since the agent already has its system-level prompt
    const response = await agent.run(JSON.stringify({
      topic,
      research: research
    }));

    if (!response.success) {
      throw new Error(`${platform} content generation failed`);
    }

    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  } catch (error: unknown) {
    console.error(`Error generating ${platform} content:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return `Error generating ${platform} content: ${errorMessage}`;
  }
} 