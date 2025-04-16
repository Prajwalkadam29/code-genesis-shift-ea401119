
export type CodeLanguage = 'c' | 'cpp' | 'javascript' | 'typescript' | 'python' | 'java';

export interface ConversionOptions {
  sourceLanguage: CodeLanguage;
  targetLanguage: CodeLanguage;
  preserveComments: boolean;
  optimizeOutput: boolean;
}

export interface GraphNode {
  id: string;
  type: string;
  value: string;
  children: string[];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: Array<{source: string; target: string; type: string}>;
}

export interface ConversionResult {
  originalCode: string;
  transformedCode: string;
  graphData: GraphData;
  executionTime: number;
  status: 'success' | 'error';
  error?: string;
}
