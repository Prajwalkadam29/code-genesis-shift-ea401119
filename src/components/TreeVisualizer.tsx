
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { GraphData } from '@/types';

interface TreeVisualizerProps {
  data: GraphData;
  width?: number;
  height?: number;
}

const TreeVisualizer = ({ data, width = 800, height = 600 }: TreeVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !data.nodes.length) return;
    
    // In a real implementation, we would initialize a tree visualization library
    // like D3.js or a specialized tree visualization library
    
    const container = containerRef.current;
    container.innerHTML = '';
    
    // For this prototype, we'll show a placeholder with node hierarchy
    const placeholder = document.createElement('div');
    placeholder.className = 'flex items-center justify-center h-full text-center p-8';
    
    // Create a simple representation of the tree
    const rootNodes = data.nodes.filter(node => 
      !data.edges.some(edge => edge.target === node.id)
    );
    
    const createTreeHTML = (nodeId: string, depth = 0) => {
      const node = data.nodes.find(n => n.id === nodeId);
      if (!node) return '';
      
      const childNodes = data.edges
        .filter(edge => edge.source === nodeId)
        .map(edge => edge.target);
      
      const childrenHTML = childNodes.length 
        ? `<ul class="ml-6 mt-1 border-l-2 border-gray-300 pl-2">
            ${childNodes.map(childId => createTreeHTML(childId, depth + 1)).join('')}
          </ul>` 
        : '';
      
      return `
        <li class="my-1">
          <div class="flex items-center">
            <span class="font-semibold">${node.type}</span>
            <span class="ml-2 text-sm text-gray-600">${node.value}</span>
          </div>
          ${childrenHTML}
        </li>
      `;
    };
    
    const treeHTML = rootNodes.length
      ? `<ul class="text-left">${rootNodes.map(node => createTreeHTML(node.id)).join('')}</ul>`
      : '<p>No tree structure available</p>';
    
    placeholder.innerHTML = `
      <div class="w-full overflow-auto">
        <p class="text-lg font-semibold mb-4">Abstract Syntax Tree (AST)</p>
        <div class="max-h-[500px] overflow-auto p-4 border rounded-md">
          ${treeHTML}
        </div>
        <p class="mt-4 text-sm text-muted-foreground">This visualization shows the hierarchical tree structure of the code's abstract syntax tree.</p>
      </div>
    `;
    
    container.appendChild(placeholder);
    
    return () => {
      container.innerHTML = '';
    };
  }, [data]);
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-muted p-3 border-b">
        <h3 className="font-medium">Tree Visualization</h3>
      </div>
      <div 
        ref={containerRef} 
        className="bg-background" 
        style={{ width: `${width}px`, height: `${height}px` }}
      ></div>
    </Card>
  );
};

export default TreeVisualizer;
