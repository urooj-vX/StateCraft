import { AIService, AIResponse, SYSTEM_PROMPT } from './types';
import { Element } from '../../types';

export class GeminiService implements AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCombination(element1: Element, element2: Element): Promise<AIResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
    
    const prompt = `
      ${SYSTEM_PROMPT}
      Combine: ${element1.name} (${element1.emoji}) + ${element2.name} (${element2.emoji})
      JSON strict format: { "name": "string", "emoji": "string", "description": "string", "isNew": true }
    `;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error('No response from Gemini');

      // extract JSON from potential markdown code blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }
}
