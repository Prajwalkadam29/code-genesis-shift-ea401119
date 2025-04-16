
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { GraphData } from '@/types';
import * as d3 from 'd3';
import FallbackTreeView from './tree/FallbackTreeView';
import D3TreeView from './tree/D3TreeView';

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
    
    // Initialize components
    const { createFallbackVisualization } = FallbackTreeView({ data });
    const { renderD3Tree } = D3TreeView({ 
      data, 
      width, 
      height, 
      onFallback: createFallbackVisualization 
    });
    
    // Check if we have enough data to create a D3 visualization
    if (data.nodes.length > 1) {
      renderD3Tree(container);
    } else {
      createFallbackVisualization(container);
    }
    
    return () => {
      container.innerHTML = '';
    };
  }, [data, width, height]);
  
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
