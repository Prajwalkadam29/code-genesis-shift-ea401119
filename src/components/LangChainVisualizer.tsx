
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CodeLanguage } from '@/types';
import { LangChainService } from '@/lib/langChainService';
import CodeEditor from '@/components/CodeEditor';
import TreeVisualizer from '@/components/TreeVisualizer';
import { toast } from 'sonner';
import LanguageSelector from '@/components/LanguageSelector';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  
  React.useEffect(() => {
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
          targetLanguage
        );
      }
      
      setConvertedCode(result);
      
      const data = generateGraphData(sourceCode, sourceLanguage);
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
  
  const generateGraphData = (code: string, language: string) => {
    const lines = code.split('\n');
    const nodes = [];
    const edges = [];
    
    nodes.push({
      id: 'n0',
      type: 'Program',
      value: 'Program',
      children: []
    });
    
    let nodeIndex = 1;
    let currentScope = 'n0';
    const scopes = ['n0'];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('//')) continue;
      
      if (language === 'javascript' || language === 'typescript') {
        if (line.includes('function') || line.includes('=>') || /\w+\s*\(\s*\)\s*\{/.test(line)) {
          const nodeId = `n${nodeIndex}`;
          nodes.push({
            id: nodeId,
            type: 'Function',
            value: line,
            children: []
          });
          
          edges.push({
            source: currentScope,
            target: nodeId,
            type: 'child'
          });
          
          const parent = nodes.find(n => n.id === currentScope);
          if (parent) parent.children.push(nodeId);
          
          currentScope = nodeId;
          scopes.push(nodeId);
          
          nodeIndex++;
        }
        else if (line === '}' && scopes.length > 1) {
          scopes.pop();
          currentScope = scopes[scopes.length - 1];
        }
        else if (line.includes('var') || line.includes('let') || line.includes('const')) {
          const nodeId = `n${nodeIndex}`;
          nodes.push({
            id: nodeId,
            type: 'Variable',
            value: line,
            children: []
          });
          
          edges.push({
            source: currentScope,
            target: nodeId,
            type: 'child'
          });
          
          const parent = nodes.find(n => n.id === currentScope);
          if (parent) parent.children.push(nodeId);
          
          nodeIndex++;
        }
      } else if (language === 'python') {
        if (line.startsWith('def ')) {
          const nodeId = `n${nodeIndex}`;
          nodes.push({
            id: nodeId,
            type: 'Function',
            value: line,
            children: []
          });
          
          edges.push({
            source: currentScope,
            target: nodeId,
            type: 'child'
          });
          
          const parent = nodes.find(n => n.id === currentScope);
          if (parent) parent.children.push(nodeId);
          
          currentScope = nodeId;
          scopes.push(nodeId);
          
          nodeIndex++;
        }
      }
    }
    
    return { nodes, edges };
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Code Conversion & Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {backendStatus === 'disconnected' && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Python Backend Not Connected</AlertTitle>
            <AlertDescription>
              The Python LangChain backend is not reachable. Using the fallback conversion method.
              <br />
              Start the Python backend with: <code>python langchain_backend.py</code>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output" disabled={!convertedCode}>Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4 pt-4">
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
          </TabsContent>
          
          <TabsContent value="output" className="space-y-6 pt-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LangChainVisualizer;
