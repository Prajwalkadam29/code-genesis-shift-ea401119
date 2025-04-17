
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CodeShift</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert and visualize code between different programming languages using advanced AI models
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Converter</CardTitle>
              <CardDescription>
                Transform your code between programming languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our advanced conversion engine supports multiple languages including JavaScript, TypeScript, Python, Java, C++, and C.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/converter" className="w-full">
                <Button className="w-full">Try Converter</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Code Visualizer</CardTitle>
              <CardDescription>
                Visualize your code structure with interactive diagrams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See your code's structure represented as interactive tree and graph visualizations to better understand the codebase.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/visualizer" className="w-full">
                <Button className="w-full">Try Visualizer</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>LangChain Integration</CardTitle>
              <CardDescription>
                AI-powered code conversion with LangChain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Experience advanced code conversion powered by LangChain with visualized code structures and improved documentation.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/langchain" className="w-full">
                <Button className="w-full">Try LangChain</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
