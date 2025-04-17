
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
  
  const langChainService = new LangChainService();
  
  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      toast.error('Please enter some code to convert');
      return;
    }
    
    setIsConverting(true);
    try {
      await langChainService.initialize();
      
      const result = await langChainService.convertCode(
        sourceCode,
        sourceLanguage,
        targetLanguage,
        { preserveComments: true, optimize: true }
      );
      
      setConvertedCode(result);
      
      // Generate graph data for visualization
      const data = generateGraphData(sourceCode, sourceLanguage);
      setGraphData(data);
      
      // Switch to results tab
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
    // Simple parsing to create a basic AST-like structure
    const lines = code.split('\n');
    const nodes = [];
    const edges = [];
    
    // Create root node
    nodes.push({
      id: 'n0',
      type: 'Program',
      value: 'Program',
      children: []
    });
    
    let nodeIndex = 1;
    let currentScope = 'n0';
    const scopes = ['n0'];
    
    // Parse code and create nodes
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('//')) continue;
      
      if (language === 'javascript' || language === 'typescript') {
        // Function detection
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
          
          // Add to parent's children
          const parent = nodes.find(n => n.id === currentScope);
          if (parent) parent.children.push(nodeId);
          
          // Update current scope and push to scopes stack
          currentScope = nodeId;
          scopes.push(nodeId);
          
          nodeIndex++;
        }
        // Closing brace detection (end of scope)
        else if (line === '}' && scopes.length > 1) {
          scopes.pop();
          currentScope = scopes[scopes.length - 1];
        }
        // Variable declarations
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
          
          // Add to parent's children
          const parent = nodes.find(n => n.id === currentScope);
          if (parent) parent.children.push(nodeId);
          
          nodeIndex++;
        }
      } else if (language === 'python') {
        // Function detection
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
          
          // Add to parent's children
          const parent = nodes.find(n => n.id === currentScope);
          if (parent) parent.children.push(nodeId);
          
          // Update current scope and push to scopes stack
          currentScope = nodeId;
          scopes.push(nodeId);
          
          nodeIndex++;
        }
      }
    }
    
    return { nodes, edges };
  };
  
  const languageOptions: CodeLanguage[] = ['javascript', 'typescript', 'python', 'java', 'cpp', 'c'];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Code Conversion & Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output" disabled={!convertedCode}>Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Language</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value as CodeLanguage)}
                >
                  {languageOptions.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Language</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value as CodeLanguage)}
                >
                  {languageOptions.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
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
