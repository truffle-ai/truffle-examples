'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Clock, BookOpen, Quote, Lightbulb, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TopicTimestamp {
  time: string;
  topic: string;
}

interface VideoAnalysis {
  summary: string;
  keyPoints: string[];
  topicTimestamps: TopicTimestamp[];
  quotes: string[];
  relatedTopics: string[];
}

const loadingStates = [
  "Fetching video transcript...",
  "Reading through content...",
  "Identifying key points...",
  "Extracting insights...",
  "Crafting summary...",
  "Almost there..."
];

const EXAMPLE_URLS = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  "https://www.youtube.com/watch?v=_GuOjXYl5ew"
];

// Add these color constants
const YOUTUBE_COLORS = {
  primary: '#FF0000',
  secondary: '#282828',
  dark: '#0F0F0F',
  light: '#FFFFFF',
  hover: '#FF3333'
};

const getYouTubeVideoId = (url: string) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  } catch (e) {
    return null;
  }
  return null;
};

export default function YouTubeSummarizer() {
  const [url, setUrl] = useState('');
  const [context, setContext] = useState('');
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setAnalysis(null);

    // Start loading state animation
    let currentIndex = 0;
    const interval = setInterval(() => {
      setLoadingState(loadingStates[currentIndex]);
      currentIndex = (currentIndex + 1) % loadingStates.length;
    }, 3000);

    try {
      const response = await fetch('/api/youtube-summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url,
          context: context.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze video');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to analyze video'
      });
    } finally {
      setLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-5xl p-6 space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Youtube className="h-8 w-8 text-[#FF0000]" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              YouTube Summarizer
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform any YouTube video into a comprehensive summary with key insights, timestamps, and more
          </p>
        </motion.div>

        {/* Add Video Player */}
        {url && getYouTubeVideoId(url) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-video w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl border border-red-500/20"
          >
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>
        )}

        {/* Enhanced Form with Context Input */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* URL Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-20 -z-10" />
            <div className="relative flex items-center bg-card/80 backdrop-blur-sm rounded-xl border border-red-500/20 shadow-xl overflow-hidden">
              <Youtube className="absolute left-4 h-6 w-6 text-red-500" />
              <input
                ref={inputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="w-full p-4 pl-12 pr-32 bg-transparent focus:outline-none text-base placeholder:text-muted-foreground/70"
                disabled={loading}
              />
              <Button 
                type="submit"
                disabled={loading || !url.trim()}
                className="absolute right-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="mr-2">Analyze</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Context Input */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-20 -z-10" />
            <div className="relative bg-card/80 backdrop-blur-sm rounded-xl border border-red-500/20 shadow-xl overflow-hidden">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add specific topics or areas to focus on (optional)..."
                className="w-full p-3 min-h-[80px] bg-transparent focus:outline-none text-sm placeholder:text-muted-foreground/70 resize-none"
                disabled={loading}
              />
              {context && (
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50">
                  {context.length} characters
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-3 justify-center">
            {EXAMPLE_URLS.map((exampleUrl, i) => (
              <Button
                key={i}
                variant="outline"
                className="bg-card/50 border-red-500/20 hover:bg-red-500/5 transition-all hover:scale-105"
                onClick={() => setUrl(exampleUrl)}
                disabled={loading}
              >
                <Youtube className="h-4 w-4 mr-2 text-red-500" />
                Example Video {i + 1}
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
              <Card className="border-red-500/20 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 blur-xl" />
                      <Loader2 className="h-6 w-6 text-red-500 relative animate-spin" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-red-600 animate-progress rounded-full" />
                      </div>
                      <span className="text-sm font-medium text-red-500/90">{loadingState}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {analysis && (
            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Executive Summary Card */}
              <Card className="bg-card/50 backdrop-blur-sm border-red-500/20 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader className="border-b border-red-500/10 bg-gradient-to-r from-red-500/5 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BookOpen className="h-6 w-6 text-red-500" />
                    <span>Executive Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none">
                    {analysis.summary}
                  </div>
                </CardContent>
              </Card>

              {/* Key Points Card - Similar styling for other cards... */}
              <Card className="bg-card/50 backdrop-blur-sm border-red-500/20 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader className="border-b border-red-500/10">
                  <CardTitle className="text-lg">
                    Key Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2 text-sm">
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-red-500 flex-shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-card/50 backdrop-blur-sm border-red-500/20 shadow-xl">
                <CardHeader className="border-b border-red-500/10">
                  <CardTitle className="text-lg">
                    Timestamps
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2 text-sm">
                    {analysis.topicTimestamps.map((item, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-red-500 font-mono">{item.time}</span>
                        <span>{item.topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Notable Quotes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="h-5 w-5 text-purple-500" />
                    <span>Notable Quotes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.quotes.map((quote, index) => (
                      <motion.blockquote
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-l-2 border-purple-500 pl-4 italic text-muted-foreground"
                      >
                        "{quote}"
                      </motion.blockquote>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-green-500" />
                    <span>Related Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.relatedTopics.map((topic, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm"
                      >
                        {topic}
                      </motion.span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 