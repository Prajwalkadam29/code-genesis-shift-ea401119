
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            CodeShift
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your codebase using graph-based migration technology
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link to="/converter">
              <Button size="lg" className="px-8">
                Start Converting
              </Button>
            </Link>
            <Link to="/documentation">
              <Button size="lg" variant="outline" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <FeatureCard 
            title="Graph-Based Transformation" 
            description="Convert code using advanced graph algorithms that preserve semantic meaning and structure."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            }
          />
          
          <FeatureCard 
            title="Multi-Language Support" 
            description="Transform between C, C++, JavaScript, TypeScript, Python, and Java with high accuracy."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          />
          
          <FeatureCard 
            title="Visualize Transformations" 
            description="See how your code structure is converted through our graph visualization tools."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>
        
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-medium">Upload Your Code</h3>
              <p className="text-sm text-muted-foreground">Upload your source code file for conversion</p>
            </div>
            
            <div className="space-y-2">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-medium">Select Languages</h3>
              <p className="text-sm text-muted-foreground">Choose your source and target languages</p>
            </div>
            
            <div className="space-y-2">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-medium">Get Transformed Code</h3>
              <p className="text-sm text-muted-foreground">Receive your converted code and visualizations</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>CodeShift - A Data Structures and Algorithms Course Project</p>
          <p className="text-sm mt-2">Built with graph-based code transformation techniques</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => {
  return (
    <Card className="border border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Home;
