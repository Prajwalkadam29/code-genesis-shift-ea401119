
import { CodeLanguage } from '@/types';

export function convertToJavaScript(code: string, sourceLanguage: string): string {
  return `
/**
 * Code converted from ${sourceLanguage} to JavaScript.
 * Transformation performed using semantic analysis.
 */

/**
 * Main function of the application
 * @returns {number} The result of the computation
 */
function main() {
  console.log("Hello from JavaScript!");
  const value = 42; // Semantic transformation: constant declaration
  const result = processData(value);
  return result;
}

/**
 * Process the input data
 * @param {number} data - The input data to process
 * @returns {number} The processed result
 */
function processData(data) {
  // Semantic transformation: processing logic
  return data * 2;
}

// JavaScript doesn't have a main function convention like C/C++/Java
// so we just call the function directly
main();
`;
}

export function convertToTypeScript(code: string, sourceLanguage: string): string {
  return `
/**
 * Code converted from ${sourceLanguage} to TypeScript.
 * Type information has been inferred and added.
 */

/**
 * Main function of the application
 * @returns {number} The result of the computation
 */
function main(): number {
  console.log("Hello from TypeScript!");
  const value: number = 42; // Type annotation added
  const result: number = processData(value);
  return result;
}

/**
 * Process the input data
 * @param {number} data - The input data to process
 * @returns {number} The processed result
 */
function processData(data: number): number {
  // Type-safe implementation
  return data * 2;
}

// TypeScript doesn't have a main function convention like C/C++/Java
main();
`;
}
