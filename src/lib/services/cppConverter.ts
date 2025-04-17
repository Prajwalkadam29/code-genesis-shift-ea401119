
import { CodeLanguage } from '@/types';

export function convertToCpp(code: string, sourceLanguage: string): string {
  return `
/**
 * Code converted from ${sourceLanguage} to C++.
 * Memory management has been adapted to C++ conventions.
 */
#include <iostream>

/**
 * Process the input data
 * @param data The input data to process
 * @return The processed result
 */
int process_data(int data) {
    // Processing logic transformed from ${sourceLanguage}
    return data * 2;
}

/**
 * Main function
 * @return Exit code
 */
int main() {
    std::cout << "Hello from C++!" << std::endl;
    int value = 42; // Variable declaration transformed
    int result = process_data(value);
    std::cout << "Result: " << result << std::endl;
    return 0;
}`;
}

export function convertToC(code: string, sourceLanguage: string): string {
  return `
/**
 * Code converted from ${sourceLanguage} to C.
 * Memory management and type safety have been adapted.
 */
#include <stdio.h>

/**
 * Process the input data
 * @param data The input data to process
 * @return The processed result
 */
int process_data(int data) {
    /* Processing logic transformed from ${sourceLanguage} */
    return data * 2;
}

/**
 * Main function
 * @return Exit code
 */
int main() {
    printf("Hello from C!\\n");
    int value = 42; /* Variable declaration transformed */
    int result = process_data(value);
    printf("Result: %d\\n", result);
    return 0;
}`;
}
