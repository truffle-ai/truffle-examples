'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ExternalLink, Brain, Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Source {
  title: string;
  url: string;
  snippet: string;
  img_url?: string;
}

interface ResearchResponse {
  summary: string;
  sources: Source[];
}

const EXAMPLE_QUERIES = [
  "Latest developments in quantum computing",
  "Impact of AI on healthcare",
  "Future of renewable energy"
];

export default function ResearchAgent() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<ResearchResponse | null>();
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  const { toast } = useToast();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadingStates = [
    "Searching the web...",
    "Reading through sources...",
    "Analyzing information...",
    "Synthesizing findings...",
    "Preparing your answer..."
  ];

  useEffect(() => {
    if (loading) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        setLoadingState(loadingStates[currentIndex]);
        currentIndex = (currentIndex + 1) % loadingStates.length;
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const response = await fetch('/api/use-cases/research-agent/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Failed to get research results');
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to get research results'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-5xl p-6 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-10"
        >
          <h1 className="text-4xl font-bold tracking-tight">My Perplexity</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask anything and get comprehensive answers with reliable sources
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 rounded-lg blur-lg group-hover:blur-xl transition-all opacity-70 -z-10" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <textarea
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask any question..."
                className="w-full p-4 pl-12 pr-24 rounded-lg border bg-background/80 backdrop-blur-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
                disabled={loading}
              />
              <Button 
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute bottom-4 right-4 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_QUERIES.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                className="text-sm"
                onClick={() => setQuery(q)}
                disabled={loading}
              >
                {q}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        </motion.form>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-primary/20 overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-lg" />
                      <Brain className="h-5 w-5 text-primary relative animate-pulse" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary/50 animate-progress rounded-full" />
                      </div>
                      <span className="font-medium text-primary">{loadingState}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {response && (
            <motion.div 
              className="grid lg:grid-cols-5 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="lg:col-span-3">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Summary</span>
                      <div className="h-1 flex-1 bg-primary/20 rounded-full" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {response.summary}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold">Sources</h2>
                <div className="grid gap-4">
                  {response.sources.map((source, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="group hover:bg-muted/50 transition-all duration-300">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {source.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {source.snippet}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              {source.img_url && (
                                <img 
                                  src={source.img_url} 
                                  alt={source.title}
                                  className="w-24 h-24 object-cover rounded-md shadow-md group-hover:shadow-lg transition-shadow"
                                />
                              )}
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                <ExternalLink className="h-5 w-5" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 