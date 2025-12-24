import { ExecutionResult } from '../types';

interface OutputPaneProps {
  result: ExecutionResult | null;
  isRunning: boolean;
}

export default function OutputPane({ result, isRunning }: OutputPaneProps) {
  if (isRunning) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div>Executing PowerShell...</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>Click "Run" to execute your code</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 font-mono text-sm">
      {result.stdout && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 font-semibold text-xs uppercase">
            Output
          </div>
          <pre className="p-4 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {result.stdout}
          </pre>
        </div>
      )}
      
      {result.stderr && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 font-semibold text-xs uppercase">
            Errors
          </div>
          <pre className="p-4 text-red-700 dark:text-red-300 whitespace-pre-wrap">
            {result.stderr}
          </pre>
        </div>
      )}
      
      <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-semibold ${
            result.exitCode === 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            Exit Code: {result.exitCode}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Duration: {result.durationMs}ms
          </span>
        </div>
      </div>
    </div>
  );
}
