import { useState } from 'react';
import { Lesson, ExecutionResult } from '../types';
import LessonContent from './LessonContent';
import ExerciseList from './ExerciseList';
import CodeEditor from './CodeEditor';
import OutputPane from './OutputPane';
import { Theme } from '../utils/theme';
import { markLessonComplete } from '../utils/progress';

interface LessonViewProps {
  lesson: Lesson;
  theme: Theme;
  apiUrl: string;
}

export default function LessonView({ lesson, theme, apiUrl }: LessonViewProps) {
  const [code, setCode] = useState(lesson.starter);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');

  const runCode = async () => {
    setIsRunning(true);
    setActiveTab('output');
    setResult(null);

    try {
      const response = await fetch(`${apiUrl}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      // Mark lesson as accessed/attempted
      markLessonComplete(lesson.id);
    } catch (error) {
      setResult({
        stdout: '',
        stderr: error instanceof Error ? `Error: ${error.message}` : 'Failed to execute code',
        exitCode: 1,
        durationMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleExerciseSelect = (exercise: any) => {
    setCode(exercise.starter);
    setResult(null);
    setActiveTab('editor');
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left pane - Lesson content */}
      <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex-1 overflow-y-auto">
          <LessonContent lessonFile={lesson.file} />
          <ExerciseList
            exercises={lesson.exercises}
            lessonId={lesson.id}
            onExerciseSelect={handleExerciseSelect}
          />
        </div>
      </div>

      {/* Right pane - Editor and output */}
      <div className="w-1/2 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'editor'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            💻 Editor
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'output'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            📋 Output
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800">
          {activeTab === 'editor' ? (
            <CodeEditor code={code} onChange={setCode} theme={theme} />
          ) : (
            <OutputPane result={result} isRunning={isRunning} />
          )}
        </div>

        {/* Run button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={runCode}
            disabled={isRunning || !code.trim()}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              isRunning || !code.trim()
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running...
              </span>
            ) : (
              '▶ Run PowerShell'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
