
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">About CodeShift</h1>
        <p className="text-muted-foreground mb-8">A Data Structures and Algorithms Course Project</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Background</CardTitle>
              <CardDescription>The story behind CodeShift</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p>
                CodeShift was developed as a project for a Data Structures and Algorithms course to demonstrate 
                the practical application of graph theory, abstract syntax trees, and algorithm design in solving
                real-world programming challenges.
              </p>
              
              <p>
                The project aims to show how advanced data structures can be used to transform code between
                programming languages while preserving the semantic meaning of the code. This approach demonstrates
                the power of graph-based representations for analyzing and manipulating structured data like source code.
              </p>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Academic Significance</h4>
                <p className="text-sm">
                  This project demonstrates several key computer science concepts:
                </p>
                <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                  <li>Graph data structures and algorithms</li>
                  <li>Abstract syntax tree parsing and manipulation</li>
                  <li>Pattern recognition in structured data</li>
                  <li>Language theory and compilation techniques</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>The technologies behind CodeShift</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p>
                CodeShift is built using a modern technology stack that combines the performance of C++ 
                with the accessibility of a web interface:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Frontend:</span> React with TypeScript for a responsive user interface
                </li>
                <li>
                  <span className="font-medium">Styling:</span> Tailwind CSS for modern, responsive design
                </li>
                <li>
                  <span className="font-medium">Core Engine:</span> C++ for the graph-based transformation engine
                </li>
                <li>
                  <span className="font-medium">Integration:</span> WebAssembly to run C++ code in the browser
                </li>
                <li>
                  <span className="font-medium">Visualization:</span> Graph rendering for AST visualization
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">C++ Backend Integration</h4>
                <p className="text-sm">
                  The C++ backend is compiled to WebAssembly (WASM) to enable running high-performance code directly
                  in the browser. This approach allows us to leverage the strengths of both C++ (performance, memory management)
                  and web technologies (accessibility, cross-platform support).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Project Team</CardTitle>
            <CardDescription>The developers behind CodeShift</CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="mb-6">
              This project was developed as part of a Data Structures and Algorithms course assignment,
              emphasizing the practical application of graph theory and algorithm design in software development.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <TeamMember 
                name="Student Team"
                role="Development Team"
                description="Implemented the core graph-based transformation algorithms and frontend interface"
              />
              
              <TeamMember 
                name="Course Instructor"
                role="Project Advisor"
                description="Provided guidance on algorithm selection and optimization strategies"
              />
              
              <TeamMember 
                name="Teaching Assistants"
                role="Technical Support"
                description="Assisted with troubleshooting and code review during development"
              />
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-lg font-medium mb-2">Acknowledgments</h3>
              <p className="text-muted-foreground">
                Special thanks to all who contributed to the research and development of this project.
                This work draws inspiration from academic research in program analysis, compiler design,
                and graph theory.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const TeamMember = ({ name, role, description }: { name: string, role: string, description: string }) => {
  return (
    <div className="border border-border rounded-lg p-6 text-center">
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="text-sm text-primary mb-2">{role}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default About;
