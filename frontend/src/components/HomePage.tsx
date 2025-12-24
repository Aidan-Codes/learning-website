interface HomePageProps {
  title: string;
  description: string;
}

export default function HomePage({ title, description }: HomePageProps) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-3 text-yellow-800 dark:text-yellow-300 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Safety Notice
        </h2>
        <div className="text-yellow-800 dark:text-yellow-200 space-y-2">
          <p>
            This is a <strong>sandboxed learning environment</strong>. The PowerShell code you run is executed in a controlled, isolated container with the following restrictions:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Limited execution time (8-10 seconds timeout)</li>
            <li>Restricted filesystem access</li>
            <li>Limited CPU and memory resources</li>
            <li>Some system commands are blocked for security</li>
            <li>Outbound HTTP requests are allowed for learning purposes</li>
          </ul>
          <p className="mt-3">
            <strong>Note:</strong> This environment is for learning purposes only. Do not attempt to execute malicious code or bypass security measures.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            📚 What You'll Learn
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• PowerShell basics and syntax</li>
            <li>• Variables and data types</li>
            <li>• Pipelines and object manipulation</li>
            <li>• Functions and script organization</li>
            <li>• Error handling best practices</li>
            <li>• File operations and JSON processing</li>
            <li>• Making REST API calls</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            🚀 How It Works
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• <strong>Read:</strong> Study the lesson content on the left</li>
            <li>• <strong>Code:</strong> Write PowerShell in the editor on the right</li>
            <li>• <strong>Run:</strong> Execute your code and see results instantly</li>
            <li>• <strong>Practice:</strong> Complete exercises to reinforce learning</li>
            <li>• <strong>Progress:</strong> Track your completion status</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-3 text-blue-800 dark:text-blue-300">
          💡 Getting Started
        </h2>
        <p className="text-blue-800 dark:text-blue-200 mb-4">
          Select a lesson from the sidebar to begin your PowerShell journey. Each lesson includes:
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded p-3">
            <div className="font-bold mb-1 text-gray-900 dark:text-white">📖 Theory</div>
            <div className="text-gray-600 dark:text-gray-400">Clear explanations with examples</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3">
            <div className="font-bold mb-1 text-gray-900 dark:text-white">💻 Exercises</div>
            <div className="text-gray-600 dark:text-gray-400">Hands-on coding challenges</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3">
            <div className="font-bold mb-1 text-gray-900 dark:text-white">💡 Hints & Solutions</div>
            <div className="text-gray-600 dark:text-gray-400">Help when you need it</div>
          </div>
        </div>
      </div>
    </div>
  );
}
