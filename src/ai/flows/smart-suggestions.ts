// src/ai/flows/smart-suggestions.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered smart suggestions
 * to enhance content creation and organization in a collaborative document platform.
 *
 * - smartSuggestions - A function that generates smart suggestions for document content.
 * - SmartSuggestionsInput - The input type for the smartSuggestions function.
 * - SmartSuggestionsOutput - The return type for the smartSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSuggestionsInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The current content of the document.'),
  userQuery: z
    .string()
    .describe('The user query or request for suggestions.'),
});
export type SmartSuggestionsInput = z.infer<typeof SmartSuggestionsInputSchema>;

const SmartSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of AI-powered suggestions for incorporating information into the document.'),
});
export type SmartSuggestionsOutput = z.infer<typeof SmartSuggestionsOutputSchema>;

export async function smartSuggestions(input: SmartSuggestionsInput): Promise<SmartSuggestionsOutput> {
  return smartSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSuggestionsPrompt',
  input: {schema: SmartSuggestionsInputSchema},
  output: {schema: SmartSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide smart suggestions for improving document content and organization.

  Based on the current document content and the user's query, generate a list of suggestions for incorporating information into the document.

  Current Document Content:
  {{documentContent}}

  User Query:
  {{userQuery}}

  Suggestions:
  `, // Ensure valid Handlebars syntax
});

const smartSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSuggestionsFlow',
    inputSchema: SmartSuggestionsInputSchema,
    outputSchema: SmartSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
