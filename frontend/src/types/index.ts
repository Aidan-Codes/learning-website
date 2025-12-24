export interface Exercise {
  id: string;
  title: string;
  description: string;
  starter: string;
  hint: string;
  solution: string;
}

export interface Lesson {
  id: string;
  title: string;
  file: string;
  starter: string;
  exercises: Exercise[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Manifest {
  title: string;
  description: string;
  sections: Section[];
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

export interface LessonProgress {
  [lessonId: string]: {
    completed: boolean;
    exercisesCompleted: string[];
  };
}
