
import React from 'react';
import Navbar from '@/components/Navbar';
import LangChainVisualizer from '@/components/LangChainVisualizer';

const LangChain = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">LangChain Code Converter</h1>
        <p className="text-muted-foreground mb-8">
          Transform your code between different programming languages using LangChain's advanced language models and visualize the code structure.
        </p>
        
        <LangChainVisualizer width={800} height={600} />
      </main>
    </div>
  );
};

export default LangChain;
