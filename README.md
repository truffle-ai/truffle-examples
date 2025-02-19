# Truffle AI Examples

This repository contains example projects and demonstrations showcasing how to use Truffle AI agents in various scenarios. Each example is self-contained and demonstrates different aspects of building and using AI agents.

## Examples

### Agent Creation & Management
- **Create Agent Demo**: Shows how to programmatically create and configure new agents using the SDK
- **Portfolio Chat**: Demonstrates building an AI-powered portfolio chat interface

### Content Generation & Analysis
- **Journal Demo**: AI-powered journaling application with real-time writing suggestions
- **Social Content Generator**: Multi-platform social media content generation
- **URL Content Extractor**: Extract structured content from URLs using custom schemas

### Video Processing
- **YouTube Summarizer**: Generate comprehensive video summaries with key points and timestamps
- **YouTube Quiz Generator**: Automatically create interactive quizzes from video content

### Research & Analysis
- **Research Agent**: AI-powered research assistant with source verification and citation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/truffle-ai/truffle-ai-examples.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Truffle AI API key:
```
TRUFFLE_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Navigate to specific examples at:
- `/create-agent`
- `/portfolio`
- `/journal-demo`
- `/social-content-generator`
- `/url-extractor`
- `/youtube-summarizer`
- `/youtube-quiz`
- `/research-agent`

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Truffle AI account and API key

## Project Structure

examples/
├── app/
│ ├── create-agent/ # Agent creation example
│ ├── portfolio/ # Portfolio chat interface
│ ├── journal-demo/ # AI journaling application
│ ├── social-content-generator/ # Social media content
│ ├── url-extractor/ # URL content extraction
│ ├── youtube-summarizer/ # Video summarization
│ ├── youtube-quiz/ # Quiz generation
│ └── research-agent/ # Research assistant
├── styles/ # Shared styles
└── public/ # Static assets


## Features Across Examples

- **AI Integration**: Each example demonstrates different aspects of the Truffle AI SDK
- **Error Handling**: Comprehensive error handling and user feedback
- **TypeScript**: Full TypeScript support for type safety
- **Modern UI**: Built with Next.js 13+ and Tailwind CSS
- **Responsive Design**: Mobile-friendly interfaces
- **Dark Mode**: Support for light/dark themes in applicable examples

## Common Patterns

1. **Agent Configuration**:
   - Environment-based agent IDs
   - Custom instructions and models
   - Tool integration where applicable

2. **API Integration**:
   - Consistent error handling
   - Response validation
   - Rate limiting consideration

3. **User Experience**:
   - Loading states
   - Error messages
   - Success feedback
   - Responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License - See LICENSE file for details

## Resources

- [Truffle AI Documentation](https://docs.trytruffle.ai)