
import React, { useRef } from 'react';
import { GraphData } from '@/types';
import { HierarchyNode, findRootNodes, createHierarchy } from '@/utils/treeUtils';
import * as d3 from 'd3';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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
      
      // Clear previous content
      d3.select(container).selectAll("*").remove();
      
      // Create SVG container
      const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.5, 3])
          .on('zoom', (event) => {
            svgGroup.attr('transform', event.transform);
          }) as any)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create a group for all tree elements to support zooming
      const svgGroup = svg.append('g');
      
      // Create the tree layout
      const treeLayout = d3.tree<HierarchyNode>()
        .size([innerHeight, innerWidth]);
      
      // Prepare the data
      const root = d3.hierarchy(hierarchyData);
      
      // Assign the data to the tree layout
      const treeData = treeLayout(root);
      
      // Create tooltip container
      const tooltip = d3.select(container)
        .append('div')
        .attr('class', 'absolute hidden bg-background border rounded-md p-2 shadow-md z-50 max-w-xs')
        .style('pointer-events', 'none');
      
      // Add links between nodes
      svgGroup.selectAll('.link')
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
      const nodes = svgGroup.selectAll('.node')
        .data(treeData.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .on('mouseover', (event, d) => {
          // Show tooltip on hover
          const nodeDetails = d.data;
          tooltip
            .html(`
              <div>
                <div class="font-semibold">${nodeDetails.name}</div>
                <div class="text-sm text-muted-foreground">ID: ${nodeDetails.id}</div>
                ${d.children ? `<div class="text-xs">Children: ${d.children.length}</div>` : ''}
              </div>
            `)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`)
            .classed('hidden', false);
        })
        .on('mouseout', () => {
          // Hide tooltip
          tooltip.classed('hidden', true);
        })
        .style('cursor', 'pointer');
      
      // Add node circles
      nodes.append('circle')
        .attr('r', 10)
        .attr('fill', d => d.children ? '#69b3a2' : '#f8b195') // Different color for leaf nodes
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
        
      // Add help text for interaction
      svg.append('text')
        .attr('x', 10)
        .attr('y', 20)
        .attr('class', 'text-xs text-muted-foreground')
        .text('Scroll to zoom, drag to pan');
        
    } catch (error) {
      console.error('Error creating D3 tree visualization:', error);
      onFallback(container);
    }
  };

  return { renderD3Tree };
};

export default D3TreeView;
