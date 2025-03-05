# Truffle AI Examples

A collection of example applications showcasing different capabilities of Truffle AI agents.

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Truffle AI account and API key
  - Sign up for free: https://www.trytruffle.ai
  - Get your API key in the settings tab

## Getting Started

1. Clone this repository
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

5. Open [http://localhost:3000](http://localhost:3000) to see the examples

## Available Examples

- **Journal Demo**: Interactive AI-powered journaling experience
- **Research Agent**: AI-powered research assistant
- **Portfolio Generator**: Generate professional portfolios with AI
- **Create Agent**: Create and customize your own AI agent
- **Social Content Generator**: Generate optimized content for multiple social platforms
- **URL Extractor**: Extract and analyze content from web URLs

## Adding Your Own Examples

1. Create a new folder in the `app` directory
2. Add your page component and API routes
3. Update the main page to include a link to your example
4. Document your example with a README.md file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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
│ └── research-agent/ # Research assistant
├── styles/ # Shared styles
├── public/ # Static assets
└── components/ # Shadcn UI components
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Truffle AI Documentation](https://docs.trytruffle.ai)
