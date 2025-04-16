
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CodeLanguage } from '@/types';

interface LanguageSelectorProps {
  selectedLanguage: CodeLanguage;
  onSelectLanguage: (language: CodeLanguage) => void;
  label: string;
  disabled?: boolean;
  excludeLanguages?: CodeLanguage[];
}

const LANGUAGES = [
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
];

const LanguageSelector = ({ 
  selectedLanguage, 
  onSelectLanguage, 
  label,
  disabled = false,
  excludeLanguages = []
}: LanguageSelectorProps) => {
  // Filter out excluded languages
  const availableLanguages = LANGUAGES.filter(
    lang => !excludeLanguages.includes(lang.value as CodeLanguage)
  );
  
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        disabled={disabled}
        value={selectedLanguage}
        onValueChange={(value) => onSelectLanguage(value as CodeLanguage)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
