
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CodeLanguage } from '@/types';

interface CodeEditorProps {
  code: string;
  language: CodeLanguage;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  title?: string;
  height?: string;
}

const CodeEditor = ({ 
  code, 
  language, 
  onChange, 
  readOnly = false,
  title,
  height = '400px'
}: CodeEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  const handleCopy = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.value);
    }
  };
  
  const getLanguageClass = () => {
    switch (language) {
      case 'javascript': return 'language-javascript';
      case 'typescript': return 'language-typescript';
      case 'python': return 'language-python';
      case 'java': return 'language-java';
      case 'c': return 'language-c';
      case 'cpp': return 'language-cpp';
      default: return 'language-plaintext';
    }
  };
  
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="bg-muted p-3 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          {title && <span className="text-sm font-medium ml-2">{title}</span>}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            className="text-xs"
          >
            Copy
          </Button>
        </div>
      </div>
      
      <textarea
        ref={editorRef}
        className={`font-mono text-sm p-4 w-full bg-background overflow-auto ${getLanguageClass()}`}
        style={{ height, resize: 'none' }}
        value={code}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
      />
    </Card>
  );
};

export default CodeEditor;
