'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Send, Loader2, FileJson, Globe, ArrowRight, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import JsonSchemaBuilder from './components/jsonSchemaBuilder';

interface JsonSchema {
  name: string;
  strict: boolean;
  schema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
    additionalProperties: boolean;
  };
}

interface ExtractedContent {
    content: any;
    schema: JsonSchema;
}

const loadingStates = [
  "Fetching content...",
  "Parsing webpage...",
  "Applying schema...",
  "Extracting data...",
  "Formatting results...",
];

const EXAMPLE_URLS = [
  "https://example.com/blog/post-1",
  "https://example.com/product/123",
  "https://example.com/profile/john-doe"
];

export default function URLExtractor() {
    const [url, setUrl] = useState('');
    const [context, setContext] = useState('');
    const [schema, setSchema] = useState<JsonSchema | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingState, setLoadingState] = useState('');
    const [result, setResult] = useState<ExtractedContent | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);

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

    const handleSchemaChange = (newSchema: JsonSchema) => {
        setSchema(newSchema);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || !schema || loading) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/url-extractor/api/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url,
                    context: context.trim(),
                    schema
                })
            });

            if (!response.ok) {
                throw new Error('Failed to extract content');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err instanceof Error ? err.message : 'Failed to extract content'
            });
        } finally {
            setLoading(false);
            setLoadingState('');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(result?.content, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Copied to clipboard",
            description: "The extracted content has been copied to your clipboard"
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto max-w-6xl p-6 space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 py-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                            <FileJson className="relative h-16 w-16 text-purple-500" />
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                            URL Content Extractor
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Extract structured content from any URL using your custom schema
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-70 -z-10" />
                            <div className="relative flex items-center bg-card/80 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-xl overflow-hidden">
                                <Globe className="absolute left-4 h-6 w-6 text-purple-500" />
                                <input
                                    ref={inputRef}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste URL here..."
                                    className="w-full p-6 pl-14 pr-32 bg-transparent focus:outline-none text-lg placeholder:text-muted-foreground/70"
                                    disabled={loading}
                                />
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={loading || !url.trim() || !schema}
                                    className="absolute right-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all hover:scale-105 disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            {loadingState}
                                        </>
                                    ) : (
                                        <>
                                            <span className="mr-2">Extract</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <motion.div
                            className="relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-20 -z-10" />
                            <div className="relative bg-card/80 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-xl overflow-hidden">
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="Add extraction context or instructions (optional)..."
                                    className="w-full p-4 min-h-[100px] bg-transparent focus:outline-none text-base placeholder:text-muted-foreground/70 resize-none"
                                    disabled={loading}
                                />
                            </div>
                        </motion.div>

                        <JsonSchemaBuilder 
                            onSchemaChange={handleSchemaChange}
                            jsonSchema={schema || undefined}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="h-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5" />
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Extracted Content</span>
                                    {result && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="gap-2"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-4 w-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" />
                                                    Copy JSON
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AnimatePresence mode="wait">
                                    {result ? (
                                        <motion.pre
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-[600px] text-sm"
                                        >
                                            {JSON.stringify(result.content, null, 2)}
                                        </motion.pre>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-center h-[600px] text-muted-foreground"
                                        >
                                            {loading ? (
                                                <div className="text-center space-y-4">
                                                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                                    <p className="text-sm">{loadingState}</p>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-4">
                                                    <FileJson className="h-16 w-16 mx-auto text-muted-foreground/40" />
                                                    <p>Enter a URL and define your schema to extract content</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 