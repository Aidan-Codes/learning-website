import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LessonContentProps {
  lessonFile: string;
}

export default function LessonContent({ lessonFile }: LessonContentProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/content/lessons/${lessonFile}`);
        if (!response.ok) {
          throw new Error('Failed to load lesson');
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonFile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Loading lesson...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none p-6 overflow-y-auto h-full">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ inline, className, children, ...props }) => {
            return inline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            ) : (
              <code className={`${className} block bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto`} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
