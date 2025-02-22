'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, History, Settings, Link, Globe, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

interface Response {
  query: string;
  timestamp: Date;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [isFirstQuery, setIsFirstQuery] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleAsk = () => {
    if (query.trim()) {
      setResponses(prev => [...prev, { query: query.trim(), timestamp: new Date() }]);
      setQuery('');
      setIsFirstQuery(false);
    }
  };

  useEffect(() => {
    if (responses.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [responses]);

  return (
    <div className="min-h-screen transition-all duration-300">
      {/* Navigation */}
      <nav className="border-b bg-background/50 backdrop-blur-sm transition-colors duration-300 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-primary transition-colors duration-300" />
              <span className="ml-2 text-xl font-semibold transition-colors duration-300">Newsify</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <History className="h-5 w-5 transition-colors duration-300" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 transition-colors duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col items-center ${!isFirstQuery ? 'pt-8' : 'justify-center min-h-[calc(100vh-4rem)]'}`}>
          <div className="w-full max-w-2xl space-y-4">
            {isFirstQuery && (
              <h1 className="text-4xl font-bold text-center mb-8 transition-colors duration-300">
                What do you want to know?
              </h1>
            )}

            {/* Chat History */}
            <div className="space-y-6">
              {responses.map((response, index) => (
                <div key={index} className="space-y-4">
                  {/* Query */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300">
                    <Search className="h-4 w-4" />
                    <span>{response.query}</span>
                  </div>
                  
                  {/* Response Card */}
                  <Card className="p-6 transition-colors duration-300 bg-background/80 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-5 w-5 text-primary transition-colors duration-300" />
                      <span className="font-medium transition-colors duration-300">Web Search</span>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert transition-colors duration-300">
                      <p className="mb-4">
                        Based on your query about "{response.query}", here's what I found:
                      </p>
                      <p className="mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <div className="flex flex-col gap-3 mt-6">
                        <div className="flex items-start gap-2">
                          <Link className="h-4 w-4 mt-1 text-blue-500 transition-colors duration-300" />
                          <div>
                            <a href="#" className="text-blue-500 hover:underline transition-colors duration-300">Example Source 1</a>
                            <p className="text-sm text-muted-foreground transition-colors duration-300">Brief excerpt from the source explaining its relevance...</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Book className="h-4 w-4 mt-1 text-blue-500 transition-colors duration-300" />
                          <div>
                            <a href="#" className="text-blue-500 hover:underline transition-colors duration-300">Academic Reference</a>
                            <p className="text-sm text-muted-foreground transition-colors duration-300">Additional context from academic sources...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Search Input */}
            <div className="relative sticky bottom-4 bg-background/50 backdrop-blur-sm transition-colors duration-300">
              <Input
                type="text"
                placeholder="Ask a question..."
                className="w-full pl-12 pr-24 py-7 text-lg rounded-xl border-2 focus:border-primary transition-colors duration-300 bg-background/80"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAsk();
                }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-300" />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors duration-300 p-5"
                size="sm"
                onClick={handleAsk}
              >
                Ask
              </Button>
            </div>

            {/* Example Queries */}
            {isFirstQuery && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {[
                  "What are the latest news for Uttar Pradesh?",
                  "What is the capital of India?",
                  "What is the capital of Uttar Pradesh?",
                  "What is the most populated state in India?",
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-4 px-6 transition-colors duration-300 bg-background/80 backdrop-blur-sm"
                    onClick={() => setQuery(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </main>
    </div>
  );
}