import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Truffle AI Examples</h1>
        
        <p className="text-lg mb-8">
          This is a collection of example applications showcasing Truffle AI agent capabilities.
          <br />
          Some of these apps require additional setup, please refer to the README.md files of each folder for more information.
        </p>
        
        <div className="grid gap-6">
          <Link 
            href="/journal-demo" 
            className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Journal Demo</h2>
            <p className="text-gray-600">Interactive AI-powered journaling experience</p>
          </Link>

          <Link 
            href="/research-agent" 
            className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Research Agent</h2>
            <p className="text-gray-600">AI-powered research assistant</p>
          </Link>

          <Link 
            href="/portfolio" 
            className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Portfolio Generator</h2>
            <p className="text-gray-600">Generate professional portfolios with AI</p>
          </Link>

          <Link 
            href="/create-agent" 
            className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Create Agent</h2>
            <p className="text-gray-600">Create and customize your own AI agent</p>
          </Link>

          <Link 
            href="/social-content-generator" 
            className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Social Content Generator</h2>
            <p className="text-gray-600">Generate optimized content for multiple social platforms</p>
          </Link>

          <Link 
            href="/url-extractor" 
            className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">URL Extractor</h2>
            <p className="text-gray-600">Extract and analyze content from web URLs</p>
          </Link>
        </div>
      </div>
    </main>
  )
} 