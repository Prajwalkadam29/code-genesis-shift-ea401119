
import { GraphData } from '@/types';

export interface HierarchyNode {
  id: string;
  name: string;
  children?: HierarchyNode[];
}

// Convert flat graph data to hierarchical structure for D3
export const createHierarchy = (data: GraphData, nodeId: string): HierarchyNode | null => {
  const node = data.nodes.find(n => n.id === nodeId);
  if (!node) return null;
  
  const childEdges = data.edges.filter(edge => edge.source === nodeId);
  const children = childEdges
    .map(edge => createHierarchy(data, edge.target))
    .filter((node): node is HierarchyNode => node !== null);
  
  return {
    id: node.id,
    name: `${node.type}: ${node.value}`,
    children: children.length > 0 ? children : undefined
  };
};

// Find root nodes (nodes that aren't targets of any edges)
export const findRootNodes = (data: GraphData) => {
  return data.nodes.filter(node => 
    !data.edges.some(edge => edge.target === node.id)
  );
};

// Create HTML representation for fallback tree view
export const createTreeHTML = (data: GraphData, nodeId: string, depth = 0): string => {
  const node = data.nodes.find(n => n.id === nodeId);
  if (!node) return '';
  
  const childNodes = data.edges
    .filter(edge => edge.source === nodeId)
    .map(edge => edge.target);
  
  const childrenHTML = childNodes.length 
    ? `<ul class="ml-6 mt-1 border-l-2 border-gray-300 pl-2">
        ${childNodes.map(childId => createTreeHTML(data, childId, depth + 1)).join('')}
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
