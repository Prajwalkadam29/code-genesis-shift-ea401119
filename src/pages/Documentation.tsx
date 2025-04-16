
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-muted-foreground mb-8">Complete guide to using the CodeShift tool</p>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="backend">C++ Backend</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>
                  Learn about the CodeShift graph-based code migration tool
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">Introduction</h3>
                <p>
                  CodeShift is an advanced code migration tool that uses graph data structures to transform
                  source code from one programming language to another. This project demonstrates the application
                  of data structures and algorithms in solving real-world software engineering challenges.
                </p>
                
                <h3 className="text-xl font-semibold mt-6">Key Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Transform code between multiple programming languages (C, C++, JavaScript, TypeScript, Python, Java)</li>
                  <li>Visualize abstract syntax trees as graphs</li>
                  <li>Preserve semantic meaning during transformation</li>
                  <li>Optimize output code</li>
                  <li>Preserve comments and documentation</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">Technical Architecture</h3>
                <p>
                  The application is built using a modern web frontend with React and TypeScript, while the core
                  transformation engine is implemented in C++ and exposed to the web application via WebAssembly.
                  This architecture combines the performance benefits of C++ with the accessibility of a web interface.
                </p>
                
                <div className="p-4 bg-muted rounded-lg mt-6">
                  <h4 className="font-medium mb-2">Educational Purpose</h4>
                  <p className="text-sm">
                    This project was created as part of a Data Structures and Algorithms course to demonstrate
                    practical applications of graph algorithms, abstract syntax trees, and language parsing techniques.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Guide</CardTitle>
                <CardDescription>
                  Step-by-step instructions for using the CodeShift tool
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">Uploading Code</h3>
                  <p className="mt-2">
                    Use the file uploader on the Converter page to select your source code file.
                    You can also drag and drop your file or paste code directly into the editor.
                    The tool will attempt to detect the language based on the file extension.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Selecting Languages</h3>
                  <p className="mt-2">
                    Choose the source and target languages from the dropdown menus.
                    If you uploaded a file, the source language may be automatically detected.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Conversion Options</h3>
                  <p className="mt-2">
                    Configure additional options:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Preserve Comments</strong>: Keep comments from the original code</li>
                    <li><strong>Optimize Output</strong>: Apply optimizations to the generated code</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Converting Code</h3>
                  <p className="mt-2">
                    Click the "Convert Code" button to start the transformation process.
                    The tool will parse your code, transform it using the graph-based approach,
                    and generate equivalent code in the target language.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Viewing Results</h3>
                  <p className="mt-2">
                    Once conversion is complete, you'll see the results tab with:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Original source code</li>
                    <li>Transformed code in the target language</li>
                    <li>Visual representation of the abstract syntax tree</li>
                    <li>Conversion performance metrics</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-muted rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Supported File Types</h4>
                  <p className="text-sm">
                    The converter supports the following file extensions:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                    <li><strong>.c</strong> - C source files</li>
                    <li><strong>.cpp, .cc, .h, .hpp</strong> - C++ source files</li>
                    <li><strong>.js</strong> - JavaScript source files</li>
                    <li><strong>.ts</strong> - TypeScript source files</li>
                    <li><strong>.py</strong> - Python source files</li>
                    <li><strong>.java</strong> - Java source files</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="implementation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Details</CardTitle>
                <CardDescription>
                  Technical implementation of the graph-based transformation engine
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">Graph Representation</h3>
                  <p className="mt-2">
                    The code transformation engine represents source code as a graph where:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Nodes</strong>: Represent programming constructs (functions, variables, expressions)</li>
                    <li><strong>Edges</strong>: Represent relationships between constructs (parent-child, dependencies)</li>
                    <li><strong>Node Types</strong>: Classify nodes by their semantic meaning (loop, condition, declaration)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Transformation Process</h3>
                  <p className="mt-2">
                    The transformation follows these steps:
                  </p>
                  <ol className="list-decimal pl-6 mt-2 space-y-2">
                    <li>
                      <strong>Parsing</strong>: Source code is parsed into an abstract syntax tree (AST)
                      using language-specific parsers
                    </li>
                    <li>
                      <strong>Graph Construction</strong>: The AST is converted to a graph structure,
                      preserving semantic relationships
                    </li>
                    <li>
                      <strong>Pattern Matching</strong>: Language-specific patterns are identified in the graph
                    </li>
                    <li>
                      <strong>Transformation</strong>: Graph nodes are transformed according to target language rules
                    </li>
                    <li>
                      <strong>Code Generation</strong>: The transformed graph is converted back to source code
                      in the target language
                    </li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Algorithms Used</h3>
                  <p className="mt-2">
                    The project implements several advanced algorithms:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Depth-First Traversal</strong>: For exploring the AST structure</li>
                    <li><strong>Subgraph Isomorphism</strong>: For identifying language patterns</li>
                    <li><strong>Graph Transformation</strong>: For converting between language representations</li>
                    <li><strong>Topological Sorting</strong>: For maintaining dependency ordering</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-muted rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Technical Challenges</h4>
                  <p className="text-sm">
                    Some of the key technical challenges addressed in this project:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                    <li>Preserving semantic equivalence across different language paradigms</li>
                    <li>Handling language-specific features with no direct equivalent</li>
                    <li>Managing memory efficiency when processing large codebases</li>
                    <li>Optimizing the transformation algorithm for performance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backend" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>C++ Backend</CardTitle>
                <CardDescription>
                  Details about the C++ implementation of the transformation engine
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">C++ Core Engine</h3>
                  <p className="mt-2">
                    The core transformation logic is implemented in C++ for performance reasons.
                    This code is compiled to WebAssembly (WASM) to run in the browser.
                    The C++ implementation includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Language-specific parsers</li>
                    <li>AST construction and manipulation</li>
                    <li>Graph data structure implementation</li>
                    <li>Transformation algorithms</li>
                    <li>Code generation modules</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Integration with Frontend</h3>
                  <p className="mt-2">
                    The C++ backend is exposed to the JavaScript frontend through WebAssembly bindings.
                    The main exported functions include:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><code>transform_code</code>: Takes source code and language options, returns transformed code</li>
                    <li><code>get_graph_data</code>: Returns the graph representation of the code</li>
                    <li><code>analyze_code</code>: Provides analysis about the code structure</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Key C++ Components</h3>
                  <div className="mt-2 space-y-3">
                    <div>
                      <h4 className="font-medium">ASTNode Class</h4>
                      <p className="text-sm text-muted-foreground">
                        Represents nodes in the abstract syntax tree with type information and child relationships
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">GraphNode Class</h4>
                      <p className="text-sm text-muted-foreground">
                        Implements the graph data structure with relationships and properties
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">CodeParser Classes</h4>
                      <p className="text-sm text-muted-foreground">
                        Language-specific parsers that convert source code to AST
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">CodeTransformer Classes</h4>
                      <p className="text-sm text-muted-foreground">
                        Transform AST between language representations
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Sample C++ Code</h4>
                  <pre className="text-xs overflow-auto p-2 bg-background rounded border">
{`// Fragment of the transformation engine
std::shared_ptr<ASTNode> CPlusPlusParser::parse(const std::string& code) {
    auto root = std::make_shared<ASTNode>(NodeType::Program, "Program");
    
    // Parsing logic would go here...
    
    return root;
}

// Code transformation
std::string CPlusPlusToPythonTransformer::transform(
    const std::shared_ptr<ASTNode>& ast,
    bool preserveComments,
    bool optimize
) {
    // Transformation logic would go here...
    
    return pythonCode;
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Documentation;
