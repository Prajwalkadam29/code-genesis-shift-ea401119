
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import GraphVisualizer from '@/components/GraphVisualizer';
import TreeVisualizer from '@/components/TreeVisualizer';
import { GraphData } from '@/types';

// Sample graph data for demonstrating various transformation patterns
const samplePatterns: Record<string, GraphData> = {
  functionTransformation: {
    nodes: [
      { id: 'n0', type: 'Program', value: 'Program', children: ['n1'] },
      { id: 'n1', type: 'FunctionDeclaration', value: 'function main()', children: ['n2', 'n3', 'n4'] },
      { id: 'n2', type: 'VariableDeclaration', value: 'int x = 5', children: [] },
      { id: 'n3', type: 'Expression', value: 'x = x + 10', children: [] },
      { id: 'n4', type: 'ReturnStatement', value: 'return x', children: [] }
    ],
    edges: [
      { source: 'n0', target: 'n1', type: 'child' },
      { source: 'n1', target: 'n2', type: 'child' },
      { source: 'n1', target: 'n3', type: 'child' },
      { source: 'n1', target: 'n4', type: 'child' }
    ]
  },
  loopTransformation: {
    nodes: [
      { id: 'n0', type: 'Program', value: 'Program', children: ['n1'] },
      { id: 'n1', type: 'ForLoop', value: 'for (int i = 0; i < 10; i++)', children: ['n2'] },
      { id: 'n2', type: 'BlockStatement', value: 'Block', children: ['n3'] },
      { id: 'n3', type: 'Expression', value: 'console.log(i)', children: [] }
    ],
    edges: [
      { source: 'n0', target: 'n1', type: 'child' },
      { source: 'n1', target: 'n2', type: 'child' },
      { source: 'n2', target: 'n3', type: 'child' }
    ]
  },
  classTransformation: {
    nodes: [
      { id: 'n0', type: 'Program', value: 'Program', children: ['n1'] },
      { id: 'n1', type: 'ClassDeclaration', value: 'class Person', children: ['n2', 'n3'] },
      { id: 'n2', type: 'PropertyDefinition', value: 'string name', children: [] },
      { id: 'n3', type: 'MethodDefinition', value: 'void greet()', children: ['n4'] },
      { id: 'n4', type: 'Expression', value: 'console.log("Hello, " + name)', children: [] }
    ],
    edges: [
      { source: 'n0', target: 'n1', type: 'child' },
      { source: 'n1', target: 'n2', type: 'child' },
      { source: 'n1', target: 'n3', type: 'child' },
      { source: 'n3', target: 'n4', type: 'child' }
    ]
  }
};

const Visualizer = () => {
  const [selectedPattern, setSelectedPattern] = useState<string>('functionTransformation');
  const [visualizationType, setVisualizationType] = useState<'graph' | 'tree'>('graph');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Graph Visualization</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Common Transformation Patterns</CardTitle>
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
            </CardHeader>
            
            <CardContent>
              <Tabs value={selectedPattern} onValueChange={setSelectedPattern}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="functionTransformation">Function</TabsTrigger>
                  <TabsTrigger value="loopTransformation">Loop</TabsTrigger>
                  <TabsTrigger value="classTransformation">Class</TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedPattern === 'functionTransformation' && 'Function Transformation'}
                    {selectedPattern === 'loopTransformation' && 'Loop Transformation'}
                    {selectedPattern === 'classTransformation' && 'Class Transformation'}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {selectedPattern === 'functionTransformation' && 
                      'This visualization shows how functions are converted between languages, mapping parameters, return types, and body statements.'}
                    {selectedPattern === 'loopTransformation' && 
                      'Loop structures vary widely between languages. This pattern shows how for loops are transformed to maintain the same behavior.'}
                    {selectedPattern === 'classTransformation' && 
                      'Class structures and object-oriented patterns are mapped to equivalent structures in the target language.'}
                  </p>
                  
                  {visualizationType === 'graph' ? (
                    <GraphVisualizer 
                      data={samplePatterns[selectedPattern]} 
                      width={800}
                      height={500}
                    />
                  ) : (
                    <TreeVisualizer 
                      data={samplePatterns[selectedPattern]} 
                      width={800}
                      height={500}
                    />
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How Graph-Based Code Transformation Works</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <p>
                  Our code transformation approach uses graph data structures to represent the abstract syntax tree (AST) 
                  of the source code. This allows us to preserve the semantic meaning during transformation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <StepCard 
                    number={1}
                    title="Parsing"
                    description="Source code is parsed into an abstract syntax tree (AST) representation"
                  />
                  
                  <StepCard 
                    number={2}
                    title="Graph Transformation"
                    description="AST is converted to a graph structure where nodes represent code elements"
                  />
                  
                  <StepCard 
                    number={3}
                    title="Code Generation"
                    description="Transformed graph is converted back to code in the target language"
                  />
                </div>
                
                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Visualization Types</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Graph View:</strong> Shows code structure as an interconnected graph of nodes, useful for visualizing complex relationships and patterns in the code.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Tree View:</strong> Displays code in a hierarchical tree structure, making it easier to understand parent-child relationships and the overall code organization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const StepCard = ({ number, title, description }: { number: number, title: string, description: string }) => {
  return (
    <div className="border border-border rounded-lg p-6">
      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <span className="text-lg font-bold text-primary">{number}</span>
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Visualizer;
