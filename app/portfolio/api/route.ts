import { NextRequest, NextResponse } from 'next/server';

if (!process.env.TRUFFLE_API_KEY) {
    throw new Error('TRUFFLE_API_KEY is not configured');
}

const API_KEY = process.env.TRUFFLE_API_KEY;

// This would be your actual resume data
const RESUME_CONTEXT = `
Name: Michael K.
Title: Senior Software Engineer
Location: San Francisco, CA

Summary:
Passionate software engineer with 8+ years of experience in full-stack development. 
Specialized in building scalable web applications and AI-powered solutions. 
Open source contributor and tech community mentor.

Experience:
- Senior Software Engineer at TechCorp (2020-Present)
  • Led development of cloud-native applications using React, Node.js, and AWS
  • Mentored junior developers and implemented agile practices
  • Reduced infrastructure costs by 40% through optimization

- Software Engineer at StartupX (2018-2020)
  • Built real-time analytics dashboard using Vue.js and Python
  • Implemented machine learning models for user behavior prediction
  • Increased user engagement by 25% through A/B testing

Skills:
- Languages: JavaScript, TypeScript, Python, Go
- Frontend: React, Vue.js, Next.js, Tailwind CSS
- Backend: Node.js, Express, Django, PostgreSQL
- Cloud: AWS, GCP, Docker, Kubernetes
- AI/ML: TensorFlow, PyTorch, Natural Language Processing

Education:
- M.S. Computer Science, Stanford University (2018)
- B.S. Computer Science, UC Berkeley (2016)

Projects:
- Created an open-source library for AI-powered code generation (5k+ GitHub stars)
- Built a real-time collaboration tool used by 10k+ developers
- Developed machine learning models for predictive analytics

Interests:
- Artificial Intelligence and Machine Learning
- Open Source Development
- Technical Writing and Speaking
- Rock Climbing and Photography
`;

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

        const result = await fetch(`https://www.trytruffle.ai/api/v1/agents/73c5fb52-318e-431b-84b4-63f483639a51/run`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                input_data: `
                    Context: You are an AI representation of a person based on their resume. 
                    You should respond in a friendly, professional manner as if you are that person.

                    You are NOT a virtual assistant so do not respond like one. You do not provide any assistance. Your responses
                    should be extremely conversational and friendly. Do not say more than you are asked. Be concise and to the point.
                    Provide information about yourself only if it is relevant to the user's question.

                    Resume Information:
                    ${RESUME_CONTEXT}
                    
                    User Message: ${message}
                `,
                json_mode: false
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