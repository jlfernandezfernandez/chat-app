'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Trash2 } from 'lucide-react';
import { handleQuery, handleLoad, handleDelete } from './actions/chat';
import { LoadingDots } from '@/components/loading-dots';
import { MarkdownContent } from '@/components/markdown-content';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showError = () => {
    toast({
      variant: "destructive",
      description: "Something went wrong. Please try again.",
      duration: 2000,
    });
  };

  const onSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: query.trim() }]);
    setQuery('');
    setLoading(true);

    try {
      const result = await handleQuery(query.trim());
      if (result.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: result.data.message }]);
      } else {
        showError();
      }
    } catch (error) {
      showError();
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onLoad = async () => {
    setLoading(true);
    try {
      const result = await handleLoad();
      if (result.success) {
        setMessages([{
          role: 'assistant',
          content: 'Knowledge base loaded. How can I help you?'
        }]);
      } else {
        showError();
      }
    } catch (error) {
      showError();
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      const result = await handleDelete();
      if (result.success) {
        setMessages([{
          role: 'assistant',
          content: 'Knowledge has been deleted.'
        }]);
      } else {
        showError();
      }
    } catch (error) {
      showError();
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 border-b border-border p-4 backdrop-blur-sm bg-background/30 z-10">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoad}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[85%] shadow-sm ${message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
                  }`}
              >
                {message.role === 'user' ? (
                  <div>{message.content}</div>
                ) : (
                  <MarkdownContent content={message.content} />
                )}
              </div>
            </div>
          ))}
          {loading && <LoadingDots />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border p-4 backdrop-blur-sm bg-background/30">
        <form
          onSubmit={onSubmitQuery}
          className="flex gap-2 max-w-4xl mx-auto"
        >
          <Input
            placeholder="Type a message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
