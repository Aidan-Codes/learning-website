import { useState } from 'react';
import type { Exercise } from '../types';
import { isExerciseComplete } from '../utils/progress';

interface ExerciseListProps {
  exercises: Exercise[];
  lessonId: string;
  onExerciseSelect: (exercise: Exercise) => void;
}

export default function ExerciseList({ exercises, lessonId, onExerciseSelect }: ExerciseListProps) {
  const [showHint, setShowHint] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState<string | null>(null);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
        📝 Exercises
      </h3>
      
      <div className="space-y-4">
        {exercises.map((exercise) => {
          const isComplete = isExerciseComplete(lessonId, exercise.id);
          
          return (
            <div
              key={exercise.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {exercise.title}
                  {isComplete && (
                    <span className="ml-2 text-green-500" title="Completed">✓</span>
                  )}
                </h4>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {exercise.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onExerciseSelect(exercise)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Start Exercise
                </button>
                
                <button
                  onClick={() => setShowHint(showHint === exercise.id ? null : exercise.id)}
                  className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  {showHint === exercise.id ? 'Hide' : 'Show'} Hint
                </button>
                
                <button
                  onClick={() => setShowSolution(showSolution === exercise.id ? null : exercise.id)}
                  className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  {showSolution === exercise.id ? 'Hide' : 'Show'} Solution
                </button>
              </div>
              
              {showHint === exercise.id && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm">
                  <div className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">💡 Hint:</div>
                  <div className="text-yellow-700 dark:text-yellow-200">{exercise.hint}</div>
                </div>
              )}
              
              {showSolution === exercise.id && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm">
                  <div className="font-semibold text-gray-800 dark:text-gray-300 mb-2">✅ Solution:</div>
                  <pre className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 p-2 rounded overflow-x-auto">
                    {exercise.solution}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
