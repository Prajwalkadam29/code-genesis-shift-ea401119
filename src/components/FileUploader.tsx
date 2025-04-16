
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CodeLanguage } from '@/types';

interface FileUploaderProps {
  onFileSelect: (content: string, filename: string) => void;
  allowedLanguages?: CodeLanguage[];
}

const FileUploader = ({ onFileSelect, allowedLanguages }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    // Simple validation based on file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (allowedLanguages) {
      const extensionMap: Record<string, CodeLanguage> = {
        'c': 'c',
        'cpp': 'cpp',
        'h': 'cpp',
        'hpp': 'cpp',
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'java': 'java'
      };
      
      if (!extension || !extensionMap[extension] || 
          !allowedLanguages.includes(extensionMap[extension])) {
        alert(`Only ${allowedLanguages.join(', ')} files are allowed.`);
        return;
      }
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onFileSelect(e.target.result as string, file.name);
        setFilename(file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card 
      className={`p-6 border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Upload your code file</h3>
          <p className="text-sm text-gray-500 mt-1">
            {filename ? `Selected file: ${filename}` : 'Drag and drop your file here, or click to browse'}
          </p>
        </div>
        
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
        
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="mx-auto"
        >
          Browse Files
        </Button>
      </div>
    </Card>
  );
};

export default FileUploader;
