
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner";
import { CodeLanguage, ConversionOptions, ConversionResult } from '@/types';
import Navbar from '@/components/Navbar';
import FileUploader from '@/components/FileUploader';
import LanguageSelector from '@/components/LanguageSelector';
import CodeEditor from '@/components/CodeEditor';
import GraphVisualizer from '@/components/GraphVisualizer';
import TreeVisualizer from '@/components/TreeVisualizer';
import { initWasm, convertCode } from '@/lib/wasmLoader';

const Converter = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<CodeLanguage>('cpp');
  const [targetLanguage, setTargetLanguage] = useState<CodeLanguage>('javascript');
  const [preserveComments, setPreserveComments] = useState(true);
  const [optimizeOutput, setOptimizeOutput] = useState(true);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [wasmInitialized, setWasmInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [visualizationType, setVisualizationType] = useState<'graph' | 'tree'>('graph');
  
  useEffect(() => {
    const loadWasm = async () => {
      const initialized = await initWasm();
      setWasmInitialized(initialized);
    };
    
    loadWasm();
  }, []);
  
  const handleFileSelect = (content: string, name: string) => {
    setSourceCode(content);
    setFileName(name);
    toast.success(`File "${name}" loaded successfully`);
    
    // Try to determine the language from the file extension
    const extension = name.split('.').pop()?.toLowerCase();
    if (extension) {
      const extensionMap: Record<string, CodeLanguage> = {
        'c': 'c',
        'cpp': 'cpp',
        'cc': 'cpp',
        'h': 'cpp',
        'hpp': 'cpp',
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'java': 'java'
      };
      
      if (extensionMap[extension]) {
        setSourceLanguage(extensionMap[extension]);
      }
    }
  };
  
  const handleConvertCode = async () => {
    if (!sourceCode.trim()) {
      toast.error('Please upload or enter source code first');
      return;
    }
    
    setIsConverting(true);
    try {
      const options: ConversionOptions = {
        sourceLanguage,
        targetLanguage,
        preserveComments,
        optimizeOutput
      };
      
      const startTime = performance.now();
      const result = await convertCode(sourceCode, sourceLanguage, targetLanguage, {
        preserveComments,
        optimize: optimizeOutput
      });
      const endTime = performance.now();
      
      setConversionResult({
        originalCode: sourceCode,
        transformedCode: result.code,
        graphData: result.graphData,
        executionTime: endTime - startTime,
        status: 'success'
      });
      
      toast.success('Code converted successfully!');
      
      // Switch to the result tab
      setActiveTab('result');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Conversion failed: ${errorMessage}`);
      
      setConversionResult({
        originalCode: sourceCode,
        transformedCode: '',
        graphData: { nodes: [], edges: [] },
        executionTime: 0,
        status: 'error',
        error: errorMessage
      });
    } finally {
      setIsConverting(false);
    }
  };
  
  const handlePasteExample = () => {
    const examples = {
      'c': `#include <stdio.h>\n\nint main() {\n  printf("Hello, World!");\n  return 0;\n}`,
      'cpp': `#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}`,
      'javascript': `function greet() {\n  console.log("Hello, World!");\n}\n\ngreet();`,
      'typescript': `function greet(): void {\n  console.log("Hello, World!");\n}\n\ngreet();`,
      'python': `def greet():\n  print("Hello, World!")\n\nif __name__ == "__main__":\n  greet()`,
      'java': `public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`
    };
    
    setSourceCode(examples[sourceLanguage]);
    setFileName(`example.${sourceLanguage === 'typescript' ? 'ts' : sourceLanguage === 'javascript' ? 'js' : sourceLanguage}`);
    toast.success('Example code pasted');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Code Converter</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
                <CardDescription>Configure your code conversion settings</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <FileUploader 
                    onFileSelect={handleFileSelect} 
                  />
                  
                  <div className="flex justify-between items-center mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePasteExample}
                    >
                      Paste Example
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSourceCode('');
                        setFileName('');
                        toast.success('Code editor cleared');
                      }}
                    >
                      Clear Editor
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <LanguageSelector
                      label="Source Language"
                      selectedLanguage={sourceLanguage}
                      onSelectLanguage={setSourceLanguage}
                      disabled={!sourceCode}
                    />
                    
                    <LanguageSelector
                      label="Target Language"
                      selectedLanguage={targetLanguage}
                      onSelectLanguage={setTargetLanguage}
                      excludeLanguages={[sourceLanguage]}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="preserve-comments" 
                        checked={preserveComments}
                        onCheckedChange={(checked) => setPreserveComments(checked as boolean)}
                      />
                      <Label htmlFor="preserve-comments">Preserve comments</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="optimize-output" 
                        checked={optimizeOutput}
                        onCheckedChange={(checked) => setOptimizeOutput(checked as boolean)}
                      />
                      <Label htmlFor="optimize-output">Optimize output</Label>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    disabled={!sourceCode || isConverting || !wasmInitialized}
                    onClick={handleConvertCode}
                  >
                    {isConverting ? 'Converting...' : 'Convert Code'}
                  </Button>
                  
                  {!wasmInitialized && (
                    <Alert variant="destructive">
                      <AlertTitle>Initialization Error</AlertTitle>
                      <AlertDescription>
                        Failed to initialize the conversion engine. Please refresh and try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">Source Code</TabsTrigger>
                <TabsTrigger value="result" disabled={!conversionResult}>Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="mt-4">
                {sourceCode ? (
                  <CodeEditor 
                    code={sourceCode} 
                    language={sourceLanguage}
                    onChange={setSourceCode}
                    title={fileName || 'Source Code'}
                    height="500px"
                  />
                ) : (
                  <Card className="h-[500px] flex items-center justify-center">
                    <div className="text-center p-6">
                      <h3 className="text-lg font-medium mb-2">No Code Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload a file, paste your code, or use an example to begin conversion
                      </p>
                    </div>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="result" className="mt-4">
                {conversionResult ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Original Code</h3>
                        <CodeEditor 
                          code={conversionResult.originalCode} 
                          language={sourceLanguage}
                          readOnly
                          height="300px"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Transformed Code</h3>
                        <CodeEditor 
                          code={conversionResult.transformedCode} 
                          language={targetLanguage}
                          readOnly
                          height="300px"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Code Structure Visualization</h3>
                        <div className="flex space-x-2">
                          <Button 
                            variant={visualizationType === 'graph' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setVisualizationType('graph')}
                          >
                            Graph View
                          </Button>
                          <Button 
                            variant={visualizationType === 'tree' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setVisualizationType('tree')}
                          >
                            Tree View
                          </Button>
                        </div>
                      </div>
                      
                      {visualizationType === 'graph' ? (
                        <GraphVisualizer 
                          data={conversionResult.graphData}
                          width={800}
                          height={400}
                        />
                      ) : (
                        <TreeVisualizer 
                          data={conversionResult.graphData}
                          width={800}
                          height={400}
                        />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Execution time: {conversionResult.executionTime.toFixed(2)}ms</span>
                      <span>Status: {conversionResult.status === 'success' ? 'Success' : 'Error'}</span>
                    </div>
                  </div>
                ) : (
                  <Card className="h-[500px] flex items-center justify-center">
                    <div className="text-center p-6">
                      <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                      <p className="text-muted-foreground">
                        Convert your code to see the results here
                      </p>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Converter;
