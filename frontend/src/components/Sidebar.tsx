import type { Section, Lesson } from '../types';
import { isLessonComplete } from '../utils/progress';

interface SidebarProps {
  sections: Section[];
  currentLessonId: string | null;
  onLessonSelect: (lesson: Lesson) => void;
  onHomeClick: () => void;
}

export default function Sidebar({ sections, currentLessonId, onLessonSelect, onHomeClick }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <button
          onClick={onHomeClick}
          className="w-full text-left px-4 py-2 mb-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
        >
          🏠 Home
        </button>
        
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.lessons.map((lesson) => {
                const isComplete = isLessonComplete(lesson.id);
                const isCurrent = currentLessonId === lesson.id;
                
                return (
                  <li key={lesson.id}>
                    <button
                      onClick={() => onLessonSelect(lesson)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        isCurrent
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{lesson.title}</span>
                        {isComplete && (
                          <span className="text-green-500" title="Completed">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
