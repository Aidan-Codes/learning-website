import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import LessonView from './components/LessonView';
import ThemeToggle from './components/ThemeToggle';
import { Manifest, Lesson } from './types';
import { Theme, initTheme, getTheme } from './utils/theme';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7071/api';

function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize theme
    initTheme();
    setTheme(getTheme());

    // Load manifest
    const loadManifest = async () => {
      try {
        const response = await fetch('/content/manifest.json');
        if (!response.ok) {
          throw new Error('Failed to load course manifest');
        }
        const data = await response.json();
        setManifest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    loadManifest();
  }, []);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleHomeClick = () => {
    setCurrentLesson(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading course...</div>
        </div>
      </div>
    );
  }

  if (error || !manifest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <div className="text-gray-600 dark:text-gray-400">{error || 'Failed to load course'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {manifest.title}
          </h1>
          {currentLesson && (
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              • {currentLesson.title}
            </span>
          )}
        </div>
        <ThemeToggle theme={theme} onThemeChange={setTheme} />
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          sections={manifest.sections}
          currentLessonId={currentLesson?.id || null}
          onLessonSelect={handleLessonSelect}
          onHomeClick={handleHomeClick}
        />
        
        <main className="flex-1 overflow-hidden bg-white dark:bg-gray-800">
          {currentLesson ? (
            <LessonView lesson={currentLesson} theme={theme} apiUrl={API_URL} />
          ) : (
            <div className="h-full overflow-y-auto">
              <HomePage title={manifest.title} description={manifest.description} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
