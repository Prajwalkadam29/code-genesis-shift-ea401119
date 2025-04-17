
import React from 'react';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/CodeEditor';
import { CodeLanguage } from '@/types';
import LanguageSelector from '@/components/LanguageSelector';

interface CodeInputSectionProps {
  sourceCode: string;
  setSourceCode: (code: string) => void;
  sourceLanguage: CodeLanguage;
  setSourceLanguage: (language: CodeLanguage) => void;
  targetLanguage: CodeLanguage;
  setTargetLanguage: (language: CodeLanguage) => void;
  handleConvert: () => void;
  isConverting: boolean;
}

const CodeInputSection = ({
  sourceCode,
  setSourceCode,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  handleConvert,
  isConverting
}: CodeInputSectionProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <LanguageSelector
          selectedLanguage={sourceLanguage}
          onSelectLanguage={setSourceLanguage}
          label="Source Language"
          excludeLanguages={[targetLanguage]}
        />
        <LanguageSelector
          selectedLanguage={targetLanguage}
          onSelectLanguage={setTargetLanguage}
          label="Target Language"
          excludeLanguages={[sourceLanguage]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Source Code</label>
        <CodeEditor
          code={sourceCode}
          language={sourceLanguage}
          onChange={setSourceCode}
          height="300px"
        />
      </div>
      
      <Button 
        onClick={handleConvert} 
        disabled={isConverting || !sourceCode.trim()}
        className="w-full"
      >
        {isConverting ? 'Converting...' : 'Convert Code'}
      </Button>
    </div>
  );
};

export default CodeInputSection;
