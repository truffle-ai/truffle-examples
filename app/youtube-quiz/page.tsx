'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Brain, ArrowRight, Loader2, CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResponse {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

const loadingStates = [
  "Analyzing video content...",
  "Identifying key concepts...",
  "Generating questions...",
  "Creating answer options...",
  "Finalizing quiz...",
];

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

export default function YouTubeQuiz() {
  const [url, setUrl] = useState('');
  const [context, setContext] = useState('');
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setQuiz(null);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);

    let currentIndex = 0;
    const interval = setInterval(() => {
      setLoadingState(loadingStates[currentIndex]);
      currentIndex = (currentIndex + 1) % loadingStates.length;
    }, 3000);

    try {
      const response = await fetch('/youtube-quiz/api/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url,
          context: context.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to generate quiz'
      });
    } finally {
      setLoading(false);
      clearInterval(interval);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-4xl p-6 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              YouTube Quiz Generator
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn any YouTube video into an interactive quiz to test your knowledge
          </p>
        </motion.div>

        {url && getYouTubeVideoId(url) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-video w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl border border-purple-500/20"
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

        {!quiz && (
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-20 -z-10" />
              <div className="relative flex items-center bg-card/80 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-xl overflow-hidden">
                <Youtube className="absolute left-4 h-6 w-6 text-purple-500" />
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
                  className="absolute right-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span className="mr-2">Generate Quiz</span>
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
                  placeholder="Add specific topics or areas to focus the quiz on (optional)..."
                  className="w-full p-3 min-h-[80px] bg-transparent focus:outline-none text-sm placeholder:text-muted-foreground/70 resize-none"
                  disabled={loading}
                />
              </div>
            </motion.div>
          </motion.form>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/20 blur-xl" />
                      <Loader2 className="h-6 w-6 text-purple-500 relative animate-spin" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 animate-progress rounded-full" />
                      </div>
                      <span className="text-sm font-medium text-purple-500/90">{loadingState}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {quiz && !showResults && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="bg-card/50 backdrop-blur-sm border-purple-500/20 shadow-xl">
                <CardHeader className="border-b border-purple-500/10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-base font-medium">{quiz.questions[currentQuestion].question}</p>
                    <div className="grid gap-3">
                      {quiz.questions[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleAnswerSelect(index)}
                          className={`p-3 rounded-lg border text-left text-sm transition-all ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-border hover:border-purple-500/50 hover:bg-purple-500/5'
                          }`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={nextQuestion}
                        disabled={selectedAnswers[currentQuestion] === undefined}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        {currentQuestion === quiz.questions.length - 1 ? 'Show Results' : 'Next Question'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {showResults && quiz && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="bg-card/50 backdrop-blur-sm border-purple-500/20 shadow-xl">
                <CardHeader className="border-b border-purple-500/10">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-purple-500" />
                    Quiz Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-500">
                        {calculateScore()} / {quiz.questions.length}
                      </p>
                      <p className="text-muted-foreground">
                        {Math.round((calculateScore() / quiz.questions.length) * 100)}% Correct
                      </p>
                    </div>

                    <div className="space-y-4">
                      {quiz.questions.map((question, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium">{question.question}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Your answer: {question.options[selectedAnswers[index]]}
                              </p>
                            </div>
                            {selectedAnswers[index] === question.correctAnswer ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          {selectedAnswers[index] !== question.correctAnswer && (
                            <div className="mt-2 text-sm">
                              <p className="text-green-500">
                                Correct answer: {question.options[question.correctAnswer]}
                              </p>
                              <p className="text-muted-foreground mt-1">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={resetQuiz}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Quiz
                      </Button>
                      <Button
                        onClick={() => {
                          setQuiz(null);
                          setUrl('');
                          setContext('');
                        }}
                        variant="outline"
                        className="border-purple-500/20 hover:bg-purple-500/5"
                      >
                        Try Another Video
                      </Button>
                    </div>
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