'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User2, Bot, Search, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
    content: string;
    type: 'user' | 'ai';
    timestamp: string;
}

const SUGGESTED_QUESTIONS = [
    "What's your background in software engineering?",
    "Tell me about your most challenging project",
    "What are your key skills?",
    "What are you passionate about?",
    "How do you approach problem-solving?",
];

// Add this constant at the top with other constants
const PROFILE_IMAGE_URL = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

// Add this new component for the typing animation
function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
        >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img 
                    src={PROFILE_IMAGE_URL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                />
            </div>
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        <motion.span
                            className="w-2 h-2 rounded-full bg-blue-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                            className="w-2 h-2 rounded-full bg-blue-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.span
                            className="w-2 h-2 rounded-full bg-blue-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function AIPortfolio() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        // Add user message
        setMessages(prev => [...prev, {
            content: userMessage,
            type: 'user',
            timestamp: new Date().toISOString()
        }]);

        try {
            const response = await fetch('/api/ai-portfolio/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            // Add AI response
            setMessages(prev => [...prev, {
                content: data.response,
                type: 'ai',
                timestamp: data.timestamp
            }]);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err instanceof Error ? err.message : 'Failed to get response'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto max-w-4xl p-6">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 py-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="h-12 w-12 text-blue-500" />
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                            My AI Portfolio
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Chat with my AI assistant to learn more about my experience, skills, and projects
                    </p>
                </motion.div>

                {/* Chat Interface */}
                <div className="relative">
                    {messages.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="text-center space-y-6 p-8">
                                <Search className="h-9 w-9 text-blue-500 mx-auto" />
                                <h2 className="text-xl font-semibold">Start a Conversation</h2>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {SUGGESTED_QUESTIONS.map((question, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="bg-card/50 border-blue-500/20 hover:bg-blue-500/5"
                                            onClick={() => {
                                                setInput(question);
                                                inputRef.current?.focus();
                                            }}
                                        >
                                            {question}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-4 mb-20">
                        <AnimatePresence mode="wait">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`flex items-start gap-3 ${
                                        message.type === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {message.type === 'ai' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            <img 
                                                src={PROFILE_IMAGE_URL} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <Card className={`max-w-[80%] ${
                                        message.type === 'user' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-card/50 backdrop-blur-sm'
                                    }`}>
                                        <CardContent className="p-4">
                                            <motion.div
                                                className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {message.type === 'user' ? (
                                                    <p>{message.content}</p>
                                                ) : (
                                                    <ReactMarkdown className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>p]:leading-normal [&>p]:my-2 [&>ul]:my-0.5 [&>ol]:my-0.5 [&>li]:my-0 [&>ul>li]:my-0 [&>ol>li]:my-0">{message.content}</ReactMarkdown>
                                                )}
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                    {message.type === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                            <User2 className="h-5 w-5 text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {loading && <TypingIndicator />}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <motion.form 
                        onSubmit={handleSubmit}
                        className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t p-4 z-10"
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                    >
                        <div className="container mx-auto max-w-4xl">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={loading ? "AI is typing..." : "Ask me anything about my experience, skills, or projects..."}
                                    className="w-full p-4 pr-24 rounded-lg border bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    disabled={loading}
                                />
                                <Button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 transition-all"
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <ArrowRight className="h-5 w-5" />
                                        </motion.div>
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.form>
                </div>
            </div>
        </div>
    );
} 