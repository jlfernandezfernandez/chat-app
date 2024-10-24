'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';

export function MarkdownContent({ content }: { content: string }) {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          // Para código en línea
          code: ({ children }) => (
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm">
              {children}
            </code>
          ),
          // Para bloques de código
          pre: ({ children }) => (
            <Card className="my-4">
              <pre className="overflow-x-auto p-4">
                <code className="text-sm text-zinc-100">
                  {children}
                </code>
              </pre>
            </Card>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}