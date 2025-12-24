import Editor from '@monaco-editor/react';
import type { Theme } from '../utils/theme';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  theme: Theme;
}

export default function CodeEditor({ code, onChange, theme }: CodeEditorProps) {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="powershell"
        value={code}
        onChange={(value) => onChange(value || '')}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
