
import React from 'react';
import Navbar from '@/components/Navbar';
import LangChainVisualizer from '@/components/LangChainVisualizer';
import { ModeToggle } from '@/components/ModeToggle';

const LangChain = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">LangChain Code Converter</h1>
          <ModeToggle />
        </div>
        
        <div className="bg-card rounded-lg p-4 mb-8 border">
          <h2 className="text-xl font-semibold mb-2">About this tool</h2>
          <p className="text-muted-foreground">
            This tool uses a Python backend with LangChain to convert code between different programming languages.
            If the Python backend is not running, it will fall back to a simpler conversion method.
            To use the full capabilities, start the Python backend with:
          </p>
          <pre className="bg-muted p-2 mt-2 rounded overflow-x-auto">
            <code>python langchain_backend.py</code>
          </pre>
          <p className="text-muted-foreground mt-2">
            Make sure to set your OpenAI API key in the Python file before running.
          </p>
        </div>
        
        <LangChainVisualizer width={800} height={600} />
      </main>
    </div>
  );
};

export default LangChain;
