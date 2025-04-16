
import React from 'react';
import { GraphData } from '@/types';
import { findRootNodes, createTreeHTML } from '@/utils/treeUtils';

interface FallbackTreeViewProps {
  data: GraphData;
}

const FallbackTreeView = ({ data }: FallbackTreeViewProps) => {
  const createFallbackVisualization = (container: HTMLDivElement) => {
    // Create a simple representation of the tree for fallback
    const placeholder = document.createElement('div');
    placeholder.className = 'flex items-center justify-center h-full text-center p-8';
    
    // Create a simple representation of the tree
    const rootNodes = findRootNodes(data);
    
    const treeHTML = rootNodes.length
      ? `<ul class="text-left">${rootNodes.map(node => createTreeHTML(data, node.id)).join('')}</ul>`
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
  };

  return { createFallbackVisualization };
};

export default FallbackTreeView;
