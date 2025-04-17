
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeLanguage } from '@/types';
import { LangChainService } from '@/lib/langChainService';
import { toast } from 'sonner';
import CodeInputSection from '@/components/langchain/CodeInputSection';
import CodeOutputSection from '@/components/langchain/CodeOutputSection';
import BackendStatusAlert from '@/components/langchain/BackendStatusAlert';
import { generateCodeGraph } from '@/utils/codeGraphUtils';

interface LangChainVisualizerProps {
  width?: number;
  height?: number;
}

const LangChainVisualizer = ({ width = 800, height = 600 }: LangChainVisualizerProps) => {
  const [sourceCode, setSourceCode] = useState<string>('');
  const [sourceLanguage, setSourceLanguage] = useState<CodeLanguage>('javascript');
  const [targetLanguage, setTargetLanguage] = useState<CodeLanguage>('python');
  const [convertedCode, setConvertedCode] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<any>({ nodes: [], edges: [] });
  const [activeTab, setActiveTab] = useState('input');
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  const langChainService = new LangChainService();
  
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        await langChainService.initialize();
        setBackendStatus('connected');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setBackendStatus('disconnected');
      }
    };
    
    checkBackendConnection();
  }, []);
  
  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      toast.error('Please enter some code to convert');
      return;
    }
    
    setIsConverting(true);
    try {
      let result: string;
      
      if (backendStatus === 'connected') {
        result = await langChainService.convertCode(
          sourceCode,
          sourceLanguage,
          targetLanguage,
          { preserveComments: true, optimize: true }
        );
      } else {
        toast.info('Using fallback conversion (Python backend not available)');
        result = langChainService.fallbackConvert(
          sourceCode,
          sourceLanguage,
          targetLanguage,
          { preserveComments: true, optimize: true }
        );
      }
      
      setConvertedCode(result);
      
      const data = generateCodeGraph(sourceCode, sourceLanguage);
      setGraphData(data);
      
      setActiveTab('output');
      
      toast.success('Code conversion successful!');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert code. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Code Conversion & Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <BackendStatusAlert status={backendStatus} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output" disabled={!convertedCode}>Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input">
            <CodeInputSection
              sourceCode={sourceCode}
              setSourceCode={setSourceCode}
              sourceLanguage={sourceLanguage}
              setSourceLanguage={setSourceLanguage}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              handleConvert={handleConvert}
              isConverting={isConverting}
            />
          </TabsContent>
          
          <TabsContent value="output">
            <CodeOutputSection
              sourceCode={sourceCode}
              sourceLanguage={sourceLanguage}
              convertedCode={convertedCode}
              targetLanguage={targetLanguage}
              graphData={graphData}
              width={width}
              height={height}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LangChainVisualizer;
