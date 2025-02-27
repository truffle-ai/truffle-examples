# Truffle AI Examples

This repository contains example projects and demonstrations showcasing how to use Truffle AI agents in various scenarios. Each example is self-contained and demonstrates different aspects of building and using AI agents.

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Truffle AI account and API key. Sign up for free: https://www.trytruffle.ai. Get your API key in the settings tab.

## Examples

### Agent Creation & Management
- **Create Agent Demo**: Shows how to programmatically create and configure new agents using the SDK
- **Portfolio Chat**: Demonstrates building an AI-powered portfolio chat interface
- **Journal Demo**: AI-powered journaling application with real-time writing suggestions
- **Social Content Generator**: Multi-platform social media content generation
- **URL Content Extractor**: Extract structured content from URLs using custom schemas
- **YouTube Summarizer**: Generate comprehensive video summaries with key points and timestamps
- **YouTube Quiz Generator**: Automatically create interactive quizzes from video content
- **Research Agent**: AI-powered research assistant with source verification and citation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/truffle-ai/truffle-examples.git
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

5. Open localhost:3000 and navigate to the specific examples. Check the READMEs in individual folders for instructions and how to set up the specific examples.
- `/create-agent`
- `/portfolio`
- `/journal-demo`
- `/social-content-generator`
- `/url-extractor`
- `/youtube-summarizer`
- `/youtube-quiz`
- `/research-agent`


## Project Structure

The examples are all in the `app` folder.
Each folder has an API route file, a page.tsx file, and a README.md file with instructions and setup steps.
The API route files show how to use Truffle AI agents with our SDK.
The page.tsx files show how to call the API routes from the UI to build AI based applications

```
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
├── public/ # Static assets
└── components/ # Shadcn UI components
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Truffle AI Documentation](https://docs.trytruffle.ai)
