'use client';

import { useState } from 'react';

export default function CreateAgentPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    success: boolean;
    agent?: {
      agentId: string;
      name: string;
      instruction: string;
      model: string;
    };
    error?: string;
  } | null>(null);

  const handleCreateAgent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/use-cases/create-agent', {
        method: 'POST',
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        error: 'Failed to create agent',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Create Agent</h1>
      
      <button
        onClick={handleCreateAgent}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Agent...' : 'Create New Agent'}
      </button>

      {response && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Response:</h2>
          {response.success ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h3 className="font-medium text-green-800">Agent Created Successfully!</h3>
              <div className="mt-4 space-y-2">
                <p><span className="font-medium">Agent ID:</span> {response.agent?.agentId}</p>
                <p><span className="font-medium">Name:</span> {response.agent?.name}</p>
                <p><span className="font-medium">Model:</span> {response.agent?.model}</p>
                <div>
                  <p className="font-medium">Instructions:</p>
                  <p className="whitespace-pre-wrap">{response.agent?.instruction}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800">{response.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 