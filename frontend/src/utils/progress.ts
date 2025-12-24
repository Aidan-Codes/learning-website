import { LessonProgress } from '../types';

const PROGRESS_KEY = 'powershell-learning-progress';

export const loadProgress = (): LessonProgress => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveProgress = (progress: LessonProgress): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const markLessonComplete = (lessonId: string, exerciseId?: string): void => {
  const progress = loadProgress();
  
  if (!progress[lessonId]) {
    progress[lessonId] = {
      completed: false,
      exercisesCompleted: []
    };
  }
  
  if (exerciseId && !progress[lessonId].exercisesCompleted.includes(exerciseId)) {
    progress[lessonId].exercisesCompleted.push(exerciseId);
  }
  
  progress[lessonId].completed = true;
  saveProgress(progress);
};

export const isLessonComplete = (lessonId: string): boolean => {
  const progress = loadProgress();
  return progress[lessonId]?.completed || false;
};

export const isExerciseComplete = (lessonId: string, exerciseId: string): boolean => {
  const progress = loadProgress();
  return progress[lessonId]?.exercisesCompleted.includes(exerciseId) || false;
};
