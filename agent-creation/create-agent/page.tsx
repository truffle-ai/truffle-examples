'use client';

import { useState } from 'react';

export default function CreateAgentExample() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAgent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/agent-creation/create-agent', {
        method: 'POST',
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error creating agent: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Truffle Agent Example</h1>
      <p className="mb-4">
        This example demonstrates how to programmatically create and deploy a new Truffle AI agent
        using the SDK. Click the button below to create a new agent with basic configuration.
      </p>
      
      <button
        onClick={handleCreateAgent}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? 'Creating Agent...' : 'Create New Agent'}
      </button>

      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
} 