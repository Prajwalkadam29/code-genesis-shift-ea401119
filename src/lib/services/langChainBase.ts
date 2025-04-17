
import { CodeLanguage, ConversionResult } from '@/types';

export class LangChainBase {
  private initialized: boolean = false;
  private apiUrl: string = 'http://localhost:5000'; // Python backend URL

  async initialize(): Promise<void> {
    try {
      // Check if the API is reachable
      const response = await fetch(`${this.apiUrl}/convert`, {
        method: 'HEAD'
      }).catch(() => null);
      
      this.initialized = response !== null;
      console.log(`LangChain service initialized: ${this.initialized}`);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to initialize LangChain:', error);
      return Promise.reject(error);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  async convertCode(
    sourceCode: string,
    sourceLanguage: CodeLanguage,
    targetLanguage: CodeLanguage,
    options: Record<string, boolean> = {}
  ): Promise<string> {
    if (!sourceCode.trim()) {
      throw new Error('Source code cannot be empty');
    }

    try {
      const response = await fetch(`${this.apiUrl}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCode,
          sourceLanguage,
          targetLanguage,
          options
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert code');
      }

      const data: ConversionResult = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.error || 'Unknown error occurred');
      }

      return data.transformedCode;
    } catch (error) {
      console.error('Code conversion error:', error);
      throw error;
    }
  }
}
