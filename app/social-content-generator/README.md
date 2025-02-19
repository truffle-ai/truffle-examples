# Social Content Generator

An AI tool that generates optimized content for multiple social media platforms.

## Features

- Multi-platform content generation
- Platform-specific formatting
- Research-based content
- One-click copying
- Loading states
- Platform-specific styling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Truffle AI API key:
```
TRUFFLE_API_KEY=your_api_key_here
RESEARCH_AGENT_ID=your_research_agent_id
TWITTER_AGENT_ID=your_twitter_agent_id
LINKEDIN_AGENT_ID=your_linkedin_agent_id
INSTAGRAM_AGENT_ID=your_instagram_agent_id
```

3. Run the development server:
```bash
npm run dev
```

4. Navigate to `/social-content-generator` to start creating content

## How It Works

1. User inputs a topic or URL
2. Research agent analyzes the topic
3. Platform-specific agents generate optimized content
4. Content is formatted according to platform guidelines
5. Users can copy and use content directly

## Potential Improvements

1. Add image generation
2. Implement hashtag optimization
3. Add scheduling functionality
4. Include engagement predictions
5. Add A/B testing capabilities
6. Implement content calendar
7. Add brand voice customization
