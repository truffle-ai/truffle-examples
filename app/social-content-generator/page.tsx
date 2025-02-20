'use client';

import { useState } from 'react';
import { FaTwitter, FaLinkedin, FaInstagram, FaCopy, FaCheck } from 'react-icons/fa';

interface PlatformContent {
  platform: string;
  content: string;
  status: 'idle' | 'loading' | 'complete' | 'error';
}

interface ResearchResult {
  data: any;
  status: 'idle' | 'loading' | 'complete' | 'error';
}

export default function SocialContentGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Twitter');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [research, setResearch] = useState<ResearchResult>({
    data: '',
    status: 'idle'
  });
  const [platformContent, setPlatformContent] = useState<PlatformContent[]>([
    { platform: 'Twitter', content: '', status: 'idle' },
    { platform: 'LinkedIn', content: '', status: 'idle' },
    { platform: 'Instagram', content: '', status: 'idle' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCopiedStates({});
    
    // Reset states
    setResearch(prev => ({ ...prev, status: 'loading' }));
    setPlatformContent(prev => prev.map(content => ({ ...content, status: 'loading' })));
    
    try {
      const response = await fetch('/social-content-generator/api/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      // Update research results
      setResearch({
        data: data.research,
        status: 'complete'
      });

      // Update platform content
      setPlatformContent([
        { platform: 'Twitter', content: data.content.twitter, status: 'complete' },
        { platform: 'LinkedIn', content: data.content.linkedin, status: 'complete' },
        { platform: 'Instagram', content: data.content.instagram, status: 'complete' }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setResearch(prev => ({ ...prev, status: 'error' }));
      setPlatformContent(prev => prev.map(content => ({ ...content, status: 'error' })));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (platform: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedStates(prev => ({ ...prev, [platform]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [platform]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPlatformIcon = (platform: string, className = "w-6 h-6") => {
    switch (platform) {
      case 'Twitter':
        return <FaTwitter className={className} />;
      case 'LinkedIn':
        return <FaLinkedin className={className} />;
      case 'Instagram':
        return <FaInstagram className={className} />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Twitter':
        return 'text-blue-400';
      case 'LinkedIn':
        return 'text-blue-700';
      case 'Instagram':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Social Media Content Generator</h1>
        <p className="text-gray-600">
          Enter a topic or URL, and our AI will research it and generate optimized content for each platform.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <label htmlFor="topic" className="block text-sm font-medium">
            Research Topic or Source URL
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Enter a topic or paste a URL..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !topic}
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Generating Content...' : 'Generate Content'}
          </button>
        </div>
      </form>

      {research.status !== 'idle' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Research & Analysis</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            {research.status === 'loading' ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : research.status === 'complete' ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {research.data}
              </div>
            ) : (
              <div className="text-red-500">Error analyzing content</div>
            )}
          </div>
        </div>
      )}

      {platformContent[0].status !== 'idle' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
          
          {/* Platform Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Platform tabs">
              {platformContent.map((platform) => (
                <button
                  key={platform.platform}
                  onClick={() => setActiveTab(platform.platform)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === platform.platform
                      ? `border-blue-500 ${getPlatformColor(platform.platform)}`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {getPlatformIcon(platform.platform, "w-5 h-5")}
                  <span>{platform.platform}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Panel */}
          <div className="mt-4">
            {platformContent.map((platform) => (
              <div
                key={platform.platform}
                className={`${activeTab === platform.platform ? 'block' : 'hidden'}`}
              >
                <div className="bg-white rounded-lg border p-4">
                  {platform.status === 'loading' ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : platform.status === 'complete' ? (
                    <div>
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => handleCopy(platform.platform, platform.content)}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                          {copiedStates[platform.platform] ? (
                            <>
                              <FaCheck className="w-4 h-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <FaCopy className="w-4 h-4" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                        {platform.content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-500">Error generating content</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 