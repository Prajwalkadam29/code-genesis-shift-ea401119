
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface BackendStatusAlertProps {
  status: 'connected' | 'disconnected' | 'checking';
}

const BackendStatusAlert = ({ status }: BackendStatusAlertProps) => {
  if (status !== 'disconnected') return null;
  
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
