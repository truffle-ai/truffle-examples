# Create Agent Example

This example demonstrates how to programmatically create and deploy a new Truffle AI agent using the SDK.

## Features

- Create a new agent with custom configuration
- Set agent instructions and model
- Handle API responses and errors
- Simple UI for testing agent creation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Truffle AI API key:
```
TRUFFLE_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

## Code Structure

- `page.tsx`: React component with UI for creating agents
- `route.ts`: API route that handles agent creation using the Truffle AI SDK

## How it Works

1. The UI provides a button to trigger agent creation
2. When clicked, it makes a POST request to the API route
3. The API route uses the Truffle AI SDK to create and deploy a new agent
4. The response includes the new agent's ID and configuration

## API Response Example

```json
{
  "success": true,
  "agent": {
    "agentId": "agent_xxx",
    "name": "Example Agent",
    "instruction": "You are a helpful AI assistant...",
    "model": "gpt-4-turbo"
  }
}
```

## Error Handling

The example includes error handling for both the frontend and API route:
- Frontend displays error messages if the API call fails
- API route returns appropriate error responses with status codes
- Loading states are managed in the UI 