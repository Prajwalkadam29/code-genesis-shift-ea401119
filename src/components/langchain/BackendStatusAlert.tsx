
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

interface BackendStatusAlertProps {
  status: 'connected' | 'disconnected' | 'checking';
}

const BackendStatusAlert = ({ status }: BackendStatusAlertProps) => {
  if (status === 'checking') return null;
  
  if (status === 'connected') {
    return (
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Python Backend Connected</AlertTitle>
        <AlertDescription>
          Using advanced Python AST parsing for code analysis and visualization.
          The backend is running and ready to convert code.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Python Backend Not Connected</AlertTitle>
      <AlertDescription>
        The Python LangChain backend is not reachable. Using the fallback conversion method.
        <br />
        Start the Python backend with: <code>python langchain_backend.py</code>
      </AlertDescription>
    </Alert>
  );
};

export default BackendStatusAlert;
