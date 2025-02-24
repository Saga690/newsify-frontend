'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, History, Settings, Link, Globe, Book, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from 'next-themes';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import axios from 'axios';

interface Response {
  query: string;
  timestamp: Date;
  response?: string;
}

interface Chat {
  id: string;
  title: string;
  responses: Response[];
  timestamp: Date;
}

// Define an interface for an article
interface Article {
  title: string;
  url: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [isFirstQuery, setIsFirstQuery] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Previous Chat 1',
      responses: [
        { query: 'What is quantum computing?', timestamp: new Date('2024-03-20') },
        { query: 'How does AI work?', timestamp: new Date('2024-03-20') }
      ],
      timestamp: new Date('2024-03-20')
    },
    {
      id: '2',
      title: 'Previous Chat 2',
      responses: [
        { query: 'Explain blockchain', timestamp: new Date('2024-03-19') }
      ],
      timestamp: new Date('2024-03-19')
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();

  const handleAsk = async () => {
    if (query.trim()) {
      const newQuery = query.trim();
      // setResponses(prev => [...prev, { query: query.trim(), timestamp: new Date() }]);
      setQuery('');
      setIsFirstQuery(false);

      //Fetching response ke sath UI update too
      setResponses((prev) => [
        ...prev,
        { query: newQuery, timestamp: new Date(), response: 'Fetching response...' }
      ]);

      try {
        const res = await axios.post("https://newsify-backend.onrender.com//generate-seo-content", {
          query: newQuery,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(res)

        setResponses((prev) =>
          prev.map((item) =>
            item.query === newQuery ? { ...item, response: res.data.seo_optimized_article || 'No response' } : item
          )
        );

        const extractedArticles: Article[] = res.data.retrieved_articles?.map((article: any) => ({
          title: article.title,
          url: article.url
        })) || [];

        setArticles(extractedArticles);

        console.log(`extractedArticles`, extractedArticles)

      } catch (error) {
        console.error('Error fetching response:', error);
        setResponses((prev) =>
          prev.map((item) =>
            item.query === newQuery ? { ...item, response: 'Failed to fetch response' } : item
          )
        );
      }
    }
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? url.slice(0, maxLength) + "..." : url;
  };

  useEffect(() => {
    if (responses.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [responses]);

  return (
    <div className="min-h-screen transition-all duration-300">
      {/* Navigation Bar*/}
      <nav className="border-b bg-background/50 backdrop-blur-sm transition-colors duration-300 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-primary transition-colors duration-300" />
              <span className="ml-2 text-xl font-semibold transition-colors duration-300">Newsify</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* History Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <History className="h-5 w-5 transition-colors duration-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Chat History</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {chats.map((chat) => (
                      <Card key={chat.id} className="p-4 cursor-pointer hover:bg-accent transition-colors duration-200">
                        <h3 className="font-medium mb-2">{chat.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {chat.responses.length} messages • {chat.timestamp.toLocaleDateString()}
                        </p>
                        <div className="mt-2 text-sm text-muted-foreground truncate">
                          {chat.responses[0].query}
                        </div>
                      </Card>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
              {/* <Button variant="ghost" size="icon">
                <History className="h-5 w-5 transition-colors duration-300" />
              </Button> */}
              <ThemeToggle />

              {/* Settings Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5 transition-colors duration-300" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                  </DialogHeader>
                  <div className="py-6">

                    <h3 className="text-sm font-medium mb-4">Theme Preferences</h3>
                    <RadioGroup defaultValue={theme} onValueChange={setTheme} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          System
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-4">Chat Preferences</h3>

                      {/* Language Selection */}
                      <div className="mb-4">
                        <Label htmlFor="language" className="block text-sm font-medium">
                          Language
                        </Label>
                        <Select defaultValue="english">
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Español</SelectItem>
                            <SelectItem value="french">Français</SelectItem>
                            <SelectItem value="german">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Chat Display Mode */}
                      <div className="mb-4">
                        <Label className="block text-sm font-medium">Message Display</Label>
                        <RadioGroup defaultValue="comfortable" className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="compact" id="compact" />
                            <Label htmlFor="compact">Compact</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="comfortable" id="comfortable" />
                            <Label htmlFor="comfortable">Comfortable</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Auto-Delete History Toggle */}
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-delete" />
                        <Label htmlFor="auto-delete">Auto-delete chat history</Label>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
            <div className="space-y-6 mb-6">
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
                      <p className="mb-4 newsreader-font">
                        {response.response || 'Loading...'}
                      </p>
                      {articles.length > 0 ? (<div className="flex flex-col gap-3 mt-6">
                        {articles.map((article, index) => <div className="flex items-start gap-2" key={index}>
                          <Link className="h-4 w-4 mt-1 text-blue-500 transition-colors duration-300" />
                          <div>
                            <a href={article.url} className="text-blue-500 hover:underline transition-colors duration-300">{truncateUrl(article.url, 30)}</a>
                            <p className="text-sm text-muted-foreground transition-colors duration-300">{article.title}</p>
                          </div>
                        </div>
                        )}
                        {/* <div className="flex items-start gap-2">
                          <Book className="h-4 w-4 mt-1 text-blue-500 transition-colors duration-300" />
                          <div>
                            <a href="#" className="text-blue-500 hover:underline transition-colors duration-300">Academic Reference</a>
                            <p className="text-sm text-muted-foreground transition-colors duration-300">Additional context from academic sources...</p>
                          </div>
                        </div> */}
                      </div>
                      ) : (
                        <p>Finding relevant articles...</p>
                      )}
                    </div>
                  </Card>

                  <Button className="w-full">Publish on Wordpress</Button>
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