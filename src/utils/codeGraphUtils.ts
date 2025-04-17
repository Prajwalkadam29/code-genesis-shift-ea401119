
import { GraphData, CodeLanguage } from '@/types';

export const generateCodeGraph = (code: string, language: CodeLanguage): GraphData => {
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
