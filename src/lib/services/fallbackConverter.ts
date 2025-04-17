
import { CodeLanguage } from '@/types';
import { convertToPython } from './pythonConverter';
import { convertToJavaScript, convertToTypeScript } from './javascriptConverter';
import { convertToJava } from './javaConverter';
import { convertToCpp, convertToC } from './cppConverter';

export class FallbackConverter {
  convertCode(
    sourceCode: string, 
    sourceLanguage: CodeLanguage, 
    targetLanguage: CodeLanguage, 
    options: Record<string, boolean> = {}
  ): string {
    // Create a header with information about the conversion
    const header = `
// Code converted from ${sourceLanguage} to ${targetLanguage}
// Conversion performed by CodeShift using LangChain
// Options: ${Object.entries(options).map(([key, value]) => `${key}=${value}`).join(', ')}
// Original code size: ${sourceCode.length} characters
`;

    // Call the appropriate converter based on the target language
    let convertedCode = '';
    
    switch (targetLanguage) {
      case 'python':
        convertedCode = convertToPython(sourceCode, sourceLanguage);
        break;
      case 'javascript':
        convertedCode = convertToJavaScript(sourceCode, sourceLanguage);
        break;
      case 'typescript':
        convertedCode = convertToTypeScript(sourceCode, sourceLanguage);
        break;
      case 'java':
        convertedCode = convertToJava(sourceCode, sourceLanguage);
        break;
      case 'cpp':
        convertedCode = convertToCpp(sourceCode, sourceLanguage);
        break;
      case 'c':
        convertedCode = convertToC(sourceCode, sourceLanguage);
        break;
      default:
        convertedCode = sourceCode;
    }
    
    return header + convertedCode;
  }
}
