
import { CodeLanguage } from '@/types';
import { LangChainBase } from './services/langChainBase';
import { FallbackConverter } from './services/fallbackConverter';

export class LangChainService {
  private langChainBase: LangChainBase;
  private fallbackConverter: FallbackConverter;

  constructor() {
    this.langChainBase = new LangChainBase();
    this.fallbackConverter = new FallbackConverter();
  }

  async initialize(): Promise<void> {
    return this.langChainBase.initialize();
  }

  async convertCode(
    sourceCode: string,
    sourceLanguage: CodeLanguage,
    targetLanguage: CodeLanguage,
    options: Record<string, boolean> = {}
  ): Promise<string> {
    return this.langChainBase.convertCode(
      sourceCode,
      sourceLanguage,
      targetLanguage,
      options
    );
  }

  fallbackConvert(
    sourceCode: string, 
    sourceLanguage: CodeLanguage, 
    targetLanguage: CodeLanguage, 
    options: Record<string, boolean> = {}
  ): string {
    if (!this.langChainBase.isInitialized()) {
      throw new Error('LangChain service not initialized');
    }

    return this.fallbackConverter.convertCode(
      sourceCode,
      sourceLanguage,
      targetLanguage,
      options
    );
  }
}
