'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { LoadingDots } from '@/components/loading-dots';
import { MarkdownContent } from '@/components/markdown-content';
import { useToast } from '@/hooks/use-toast';

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
    <div className="flex h-screen flex-col bg-zinc-900 p-4">
      <header className="border-b border-zinc-800 p-4">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoad}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
          >
            <Trash2 />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-5 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-3 max-w-[85%] ${message.role === 'user'
                    ? 'bg-amber-400 text-black'
                    : 'bg-zinc-800 text-zinc-100'
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

      <div className="border-t border-zinc-800 p-4">
        <form
          onSubmit={handleQuery}
          className="flex gap-2 max-w-3xl mx-auto"
        >
          <Input
            placeholder="Type a message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}