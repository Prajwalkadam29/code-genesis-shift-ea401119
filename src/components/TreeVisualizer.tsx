
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { GraphData } from '@/types';
import * as d3 from 'd3';

interface TreeVisualizerProps {
  data: GraphData;
  width?: number;
  height?: number;
}

const TreeVisualizer = ({ data, width = 800, height = 600 }: TreeVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !data.nodes.length) return;
    
    // Clear previous visualization
    const container = containerRef.current;
    container.innerHTML = '';
    
    // Check if we have enough data to create a D3 visualization
    if (data.nodes.length > 1) {
      try {
        // Create a hierarchical structure from the flat data
        const rootNodes = data.nodes.filter(node => 
          !data.edges.some(edge => edge.target === node.id)
        );
        
        if (rootNodes.length === 0) return;
        
        // Use the first root node as the starting point
        const rootNode = rootNodes[0];
        
        // Create a tree structure that D3 can use
        const createHierarchy = (nodeId: string) => {
          const node = data.nodes.find(n => n.id === nodeId);
          if (!node) return null;
          
          const childEdges = data.edges.filter(edge => edge.source === nodeId);
          const children = childEdges.map(edge => createHierarchy(edge.target)).filter(Boolean);
          
          return {
            id: node.id,
            name: `${node.type}: ${node.value}`,
            children: children.length > 0 ? children : undefined
          };
        };
        
        const hierarchyData = createHierarchy(rootNode.id);
        
        if (!hierarchyData) {
          // Fallback to simple representation if hierarchy creation fails
          createFallbackVisualization(container);
          return;
        }
        
        // Set up the D3 tree layout
        const margin = { top: 20, right: 90, bottom: 30, left: 90 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // Create SVG container
        const svg = d3.select(container)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Create the tree layout
        const treeLayout = d3.tree()
          .size([innerHeight, innerWidth]);
        
        // Prepare the data
        const root = d3.hierarchy(hierarchyData);
        
        // Assign the data to the tree layout
        const treeData = treeLayout(root);
        
        // Add links between nodes
        svg.selectAll('.link')
          .data(treeData.links())
          .enter().append('path')
          .attr('class', 'link')
          .attr('fill', 'none')
          .attr('stroke', '#ccc')
          .attr('stroke-width', 2)
          .attr('d', d3.linkHorizontal()
            .x((d: any) => d.y)
            .y((d: any) => d.x)
          );
        
        // Create node groups
        const nodes = svg.selectAll('.node')
          .data(treeData.descendants())
          .enter().append('g')
          .attr('class', 'node')
          .attr('transform', (d: any) => `translate(${d.y},${d.x})`);
        
        // Add node circles
        nodes.append('circle')
          .attr('r', 10)
          .attr('fill', '#69b3a2')
          .attr('stroke', 'black')
          .attr('stroke-width', 1);
        
        // Add node labels
        nodes.append('text')
          .attr('dy', '.35em')
          .attr('x', (d: any) => d.children ? -13 : 13)
          .attr('text-anchor', (d: any) => d.children ? 'end' : 'start')
          .text((d: any) => {
            // Truncate long node names
            const name = d.data.name;
            return name.length > 20 ? name.substring(0, 17) + '...' : name;
          })
          .attr('font-size', '12px');
        
      } catch (error) {
        console.error('Error creating D3 tree visualization:', error);
        createFallbackVisualization(container);
      }
    } else {
      createFallbackVisualization(container);
    }
    
    return () => {
      container.innerHTML = '';
    };
  }, [data, width, height]);
  
  const createFallbackVisualization = (container: HTMLDivElement) => {
    // Create a simple representation of the tree for fallback
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
  };
  
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
