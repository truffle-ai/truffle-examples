# URL Content Extractor

An AI-powered tool that extracts structured content from any URL using custom schemas.

## Features

- Custom JSON schema definition
- Flexible content extraction
- Schema validation
- Context-aware parsing
- Copy functionality
- Loading states

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Truffle AI API key:
```
TRUFFLE_API_KEY=your_api_key_here
URL_EXTRACTOR_AGENT_ID=your_agent_id_here
```

3. Run the development server:
```bash
npm run dev
```


4. Navigate to `/url-extractor` to start extracting content

## How It Works

1. User defines a JSON schema
2. Provides a URL and optional context
3. AI analyzes the webpage content
4. Extracts and structures data according to schema
5. Returns validated JSON output

## Potential Improvements

1. Add schema templates
2. Implement batch processing
3. Add export options
4. Include schema validation rules
5. Add scheduled extraction
6. Implement webhook notifications
7. Add data transformation options
