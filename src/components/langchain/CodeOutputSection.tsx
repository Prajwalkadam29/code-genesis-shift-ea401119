
import React from 'react';
import CodeEditor from '@/components/CodeEditor';
import TreeVisualizer from '@/components/TreeVisualizer';
import { CodeLanguage } from '@/types';
import { GraphData } from '@/types';

interface CodeOutputSectionProps {
  sourceCode: string;
  sourceLanguage: CodeLanguage;
  convertedCode: string;
  targetLanguage: CodeLanguage;
  graphData: GraphData;
  width: number;
  height: number;
}

const CodeOutputSection = ({
  sourceCode,
  sourceLanguage,
  convertedCode,
  targetLanguage,
  graphData,
  width,
  height
}: CodeOutputSectionProps) => {
  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Original Code ({sourceLanguage})</h3>
          <CodeEditor 
            code={sourceCode} 
            language={sourceLanguage}
            readOnly
            height="250px"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Converted Code ({targetLanguage})</h3>
          <CodeEditor 
            code={convertedCode} 
            language={targetLanguage}
            readOnly
            height="250px"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Code Structure Visualization</h3>
        <TreeVisualizer data={graphData} width={width} height={height / 2} />
      </div>
    </div>
  );
};

export default CodeOutputSection;
