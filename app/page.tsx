// app/page.tsx
'use client';

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Use the toast hook

  const handleQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data.message);
      } else {
        throw new Error(data.error || 'Error making the query');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error making the query",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('http://localhost:8080/delete', {
        method: 'DELETE',
      });

      const data = await res.json();
      
      if (res.ok) {
        toast({
          title: "Success",
          description: "Collection deleted successfully",
        });
        setResponse('');
      } else {
        throw new Error(data.error || 'Error deleting the collection');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting the collection",
      });
    }
  };

  const handleLoad = async () => {
    try {
      const res = await fetch('http://localhost:8080/load', {
        method: 'GET',
      });

      const data = await res.json();
      
      if (res.ok) {
        toast({
          title: "Success",
          description: "Data loaded successfully",
        });
        setResponse(data.message);
      } else {
        throw new Error(data.error || 'Error loading data');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error loading data",
      });
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Chat with Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter your question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button 
              onClick={handleQuery}
              disabled={loading}
              className="w-full"
            >
              Send Question
            </Button>
          </div>

          {response && (
            <Textarea
              value={response}
              readOnly
              className="h-40"
            />
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button 
            onClick={handleDelete}
            variant="destructive"
          >
            Delete Collection
          </Button>
          <Button 
            onClick={handleLoad}
            className="ml-2"
          >
            Load
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
