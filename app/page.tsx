'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Trash2 } from 'lucide-react';
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

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: query.trim() }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
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

  const handleLoad = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/load', { method: 'POST' });
      if (res.ok) {
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/delete', { method: 'DELETE' });

      if (res.ok) {
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
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border p-4 backdrop-blur-sm bg-background/30">
        <div className="flex justify-end gap-2 max-w-4xl mx-auto">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoad}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
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
      </div>

      <div className="border-t border-border p-4 backdrop-blur-sm bg-background/30">
        <form
          onSubmit={handleQuery}
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
      </div>
    </div>
  );
}
