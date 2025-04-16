
import React from 'react';
import { GraphData } from '@/types';
import { HierarchyNode, findRootNodes, createHierarchy } from '@/utils/treeUtils';
import * as d3 from 'd3';

interface D3TreeViewProps {
  data: GraphData;
  width: number;
  height: number;
  onFallback: (container: HTMLDivElement) => void;
}

const D3TreeView = ({ data, width, height, onFallback }: D3TreeViewProps) => {
  const renderD3Tree = (container: HTMLDivElement) => {
    try {
      // Find root nodes
      const rootNodes = findRootNodes(data);
      if (rootNodes.length === 0) return;
      
      // Use the first root node as the starting point
      const rootNode = rootNodes[0];
      
      // Create hierarchy data
      const hierarchyData = createHierarchy(data, rootNode.id);
      
      if (!hierarchyData) {
        // Fallback to simple representation if hierarchy creation fails
        onFallback(container);
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
      const treeLayout = d3.tree<HierarchyNode>()
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
        .attr('d', d3.linkHorizontal<d3.HierarchyPointLink<HierarchyNode>, d3.HierarchyPointNode<HierarchyNode>>()
          .x(d => d.y)
          .y(d => d.x)
        );
      
      // Create node groups
      const nodes = svg.selectAll('.node')
        .data(treeData.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);
      
      // Add node circles
      nodes.append('circle')
        .attr('r', 10)
        .attr('fill', '#69b3a2')
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
      
      // Add node labels
      nodes.append('text')
        .attr('dy', '.35em')
        .attr('x', d => d.children ? -13 : 13)
        .attr('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => {
          // Truncate long node names
          const name = d.data.name;
          return name.length > 20 ? name.substring(0, 17) + '...' : name;
        })
        .attr('font-size', '12px');
        
    } catch (error) {
      console.error('Error creating D3 tree visualization:', error);
      onFallback(container);
    }
  };

  return { renderD3Tree };
};

export default D3TreeView;
